#!/usr/bin/env node
const args = require('yargs').argv;
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const events = require('events');
const spawn = require('cross-spawn');
const WebTorrent = require('webtorrent');
const OS = require('opensubtitles-api');
const rimraf = require('rimraf');

const magnetURI = args._[0];

const opensubtitlesAPI = new OS({
    useragent: 'OSTestUserAgentTemp'
});

const client = new WebTorrent();

const subtitleEmitter = new events.EventEmitter();

const subsDestinationFolder = "tmp"+path.sep+"subs";
const torrentDestinationFolder = "tmp"+path.sep+"torrents";

function downloadSubtitle(subtitle, cb) {
    if(!subtitle.url) return
    http.get(subtitle.url, cb);
}

function saveSubtitle(response, subFilePath) {
    let gunzip = zlib.createGunzip();
        //complete path of the srt file

    let dest = fs.createWriteStream(subFilePath);
    response.pipe(gunzip).pipe(dest);

    dest.on('close', function () {
        response.unpipe(gunzip);
        response.unpipe(dest);
        console.log("done!");
        console.log('Subs saved at: %s', subFilePath);
        subtitleEmitter.emit("done", subFilePath);
    });
}

function destroyTorrent(torrent) {
    torrent.destroy(function () {
            console.log('Temporary torrent client finished.');
            let torrentPath = path.join(torrentDestinationFolder, torrent.name)
            rimraf(torrentPath, function (res, err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Temporary torrent files deleted successfully.');    
                }
            });
        });
}

function searchSubtitles(infos, movieName) {
    return opensubtitlesAPI.search({
                sublanguageid: 'pob eng',
                hash: infos.moviehash,
                filesize: infos.moviebytesize,
                //path: movieFilePath,
                filename: movieName,
                gzip: true
    }).catch(err => console.error(err));
}

function downloadRightSubs(subtitles, pathToSave) {
    let subtitle = {};
    if (!subtitles) {
        console.log('no subtitles found')
        subtitleEmitter.emit('no-subs');
        return
    } else {
        if (!subtitles.pb) {
            console.log('found no pob subtitles, running in eng subs')
            subtitle = subtitles.en;
        } else {
            subtitle = subtitles.pb;
        }
        downloadSubtitle(subtitle, function (response) {
            saveSubtitle(response, pathToSave);
        });
    }
}

function go() {
    client.add(magnetURI, {path: torrentDestinationFolder}, function (torrent) {

        let movieFile = biggestFile(torrent.files);

        let movieName = movieFile.name;
        let currentPath = path.dirname(require.resolve('./'));
        let movieFilePath = path.join(currentPath, torrentDestinationFolder, movieFile.path);
        
        //destroyTorrent(torrent);        
        opensubtitlesAPI.extractInfo(movieFilePath)
        .then((infos) => searchSubtitles(infos, movieName))
        .then((subtitles) => {
            //fix subfilePath 
            let subFilePath = subsDestinationFolder + path.sep + movieFile.name + '.srt';
            subFilePath = subFilePath.split(' ').join('.').toString();
            downloadRightSubs(subtitles, subFilePath);
        })
        .catch(err => console.log(err))
    });
}

function biggestFile(files) {
    const sortedFiles = files.sort(function (a, b) {
        return b.length - a.length;
    });
    return sortedFiles[0];
}

subtitleEmitter.on('no-subs', () => {
    startStreaming(magnetURI);
})
subtitleEmitter.on('done', function (subtitle){
    console.log("subtitle downloaded finished downloading");
    startStreaming(magnetURI, subtitle);
});

function startStreaming(magnetLink, subtitle) {
    console.log('Starting streaming, this can take a while...');
    
    console.log('lunching peerflix');
    let peerflixPath = path.join('.','node_modules','peerflix','app.js')
    if(subtitle){
        let currentPath = path.dirname(require.resolve('./'));

        let subtitlePath = path.join(currentPath, subtitle);
        console.log(subtitlePath);
        
        let sp = spawn('node', [peerflixPath, magnetLink, '-d', '-t', subtitlePath, '--vlc'], {
            stdio: 'inherit'
        });
    }else{
        let sp = spawn('node', [peerflixPath, magnetLink, '-d','--vlc'], {
            stdio: 'inherit'
        });
    }
}
go();
