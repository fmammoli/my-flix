import WebTorrent from 'webtorrent'
import path from 'path'
import rimraf from 'rimraf'

const TMP_FOLDER = 'tmp'
const TORRENT_TMP_FOLER = path.join(TMP_FOLDER, 'torrents')
const SUBTITLE_TMP_FOLDER = path.join(TMP_FOLDER, 'subs')

const client = new WebTorrent()

function startTorrent(magnetURI) {
  return new Promise((resolve, reject) => {
    client.add(magnetURI, {path: TORRENT_TMP_FOLER}, (torrent, err) => {
      if(err) reject(err)
      resolve(torrent)
    })
  })
}

function getMovie(magnetURI) {
  return new Promise((resolve, reject) => {
    startTorrent(magnetURI)
    .then(torrent => {
      const moviefile = torrent.files.reduce((a,b) => (a.length > b.length) ? a : b)
      const movie = {
        filename: moviefile.name,
        filesize: moviefile.length,
        filepath: path.join(TORRENT_TMP_FOLER, moviefile.path),
        file: moviefile
      }
     
      torrent.on('download', function onDownload () {
        if(torrent.downloaded > 131072){
          torrent.removeListener('download', onDownload)
          resolve(movie)
        }
      })
    })
  })
}

function clearAll() {
  return new Promise((resolve, reject) => {
    client.destroy(err => {
      if(err) reject(err)
      rimraf(TORRENT_TMP_FOLER, (res, err) => {
        if(err) reject(err)
        resolve(res)
      })
    })
  })
}
export default function createPreloader() {
  return {
    getMovie: getMovie,
    clear: clearAll
  }
}