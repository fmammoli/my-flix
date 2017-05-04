import http from 'http'
import zlib from 'zlib'
import fs from 'fs'

function download(url, desPath) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      const gunzip = zlib.createGunzip()
      let dest = fs.createReadStream(desPath)
      dest.on('open', () => res.pipe(gunzip).pipe(dest))
      dest.on('close', () => {
        res.unpipe(dest)
        res.unpipe(gunzip)
        resolve(dest)
      })
    })
  })
}

export default function createSubDownloader() {
  return {
    download: download
  }
}