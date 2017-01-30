
const args = require('yargs').argv;
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const WebTorrent = require('webtorrent');
const OS = require('opensubtitles-api');
const rimraf = require('rimraf');
const hash = require('./hash');

const defined = require('defined');

//const magnetURI = args._[0];

const opensubtitles = new OS({
    useragent: 'OSTestUserAgentTemp'
});

const client = new WebTorrent();

let TMP_FOLDER = 'tmp';
let TORRENT_TMP_FOLER = path.join(TMP_FOLDER, 'torrents');
let SUBTITLE_TMP_FOLDER = path.join(TMP_FOLDER, 'subs');

function biggestFile(files) {
    const sortedFiles = files.sort(function (a, b) {
        return b.length - a.length;
    });
    return sortedFiles[0];
}

function destroyTorrent() {
    let torrents = client.torrents;
    let torrentPath = path.join(torrents[0].path, torrents[0].name);
    rimraf(torrentPath, function (res, err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Temporary torrent files deleted successfully.');    
        }
    });
    torrents[0].destroy(function () {
        console.log('Temporary torrent client finished.'); 
    });
}

function startTorrent(magnetURI, torrentPath) {
    return new Promise(function (resolve, reject) {
        client.add(magnetURI, {path: torrentPath}, function (torrent, err) {
            if (err) reject(err);
            else {
                resolve(torrent)
            };
        })
    });
}
function getMovieFile(torrent) {
    return new Promise(function (resolve, reject) {
        let movieFile = biggestFile(torrent.files);
        resolve(movieFile);
    });
}
function hashMovie(movieFile) {
    //const movieFilePath = path.join(TORRENT_TMP_FOLER, movieFile.path);
    return hash.computeHashFromTorrentFile(movieFile)
}
 
function searchMovie(movieHash, movieFile) {
    
    console.log(movieFile.name);
    const movieFilePath = path.join(TORRENT_TMP_FOLER, movieFile.path);
    return opensubtitles.search({
        sublanguageid: 'pob eng',
        hash: movieHash,
        filesize: movieFile.length,
        filename: movieFile.name,
        //path: movieFilePath,
        gzip: true
    }).catch(err => console.error('Problem searching on OpenSubtitles: '+err));
}
function filterSubtitles(subtitles) {
    return new Promise(function (resolve, reject) {
        let subtitle = {};
        if (!subtitles) {
            console.log('no subtitles found');
            reject('No subtitles found');
        } else {
            if (!subtitles.pb) {
                subtitle = subtitles.en;
            } else {
                subtitle = subtitles.pb;
            }
            resolve(subtitle);
        }
    }).catch(err => console.error("Problem Filtering Subs: "+err));
}

function findSubtitles(magnetURI, opt) {
    return new Promise(function (resolve, reject) {
        if (!defined(opt)) {
            opt = {
                torrentFolder: TORRENT_TMP_FOLER,
                subtitleFolder: SUBTITLE_TMP_FOLDER,
                gzip: true
            }
        }
        startTorrent(magnetURI, opt.torrentFolder)
        .then(getMovieFile)
        .then(function (movieFile) {
            return hashMovie(movieFile)
            .then(moviehash => searchMovie(moviehash, movieFile), err => console.error('more up here'))
            .then(filterSubtitles, err => console.log('up here'))
            .then(subtitle => {
                console.log(subtitle);
                subtitle.movieFileName = movieFile.name;
                resolve(subtitle);
            }, err => console.log('here')).catch(err => console.error('Problem!!!: '+err))
        })       
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
    //get the has for the torrent file
    //search on opensub api
    //return subtitle object
}
function removeExt(name) {
    let a = name.split('.');
    a.pop();
    a = a.join('.');
    return a;
}
//Find and download subs
//receive and magnetURI
//return the srt file path
function downloadSubtitles(magnetURI, opt) {
    return new Promise(function (resolve, reject) {
        findSubtitles(magnetURI, opt)
        .then(subtitle => {
            let subtitleFileName = removeExt(subtitle.movieFileName) + '.srt';
            let subtitleFilePath = path.join(SUBTITLE_TMP_FOLDER, subtitleFileName);
            let subtitlePath = subtitleFilePath.split(' ').join('.').toString();
            return downloadSub(subtitle.url, subtitlePath)
        })
        .then(subPath => {
            const currentPath = path.dirname(require.resolve('./'));
            const absolutePath = path.join(currentPath, subPath);
            destroyTorrent();
            resolve(absolutePath);
        })
        .catch(err => {
            console.error(err);
            reject(err);
        })
    })
}

function downloadSub(url, subtitlePath) {
    return new Promise(function (resolve, reject) {
        http.get(url, function (response) {
            let gunzip = zlib.createGunzip();
            let dest = fs.createWriteStream(subtitlePath);
            dest.on('open', function (data) {
                response.pipe(gunzip).pipe(dest);    
            });
            
            dest.on('close', function () {
                response.unpipe(gunzip);
                response.unpipe(dest);
                resolve(subtitlePath);
            });
        });
    });
}


module.exports = {
    findSubtitles: findSubtitles,
    downloadSubtitles: downloadSubtitles
}