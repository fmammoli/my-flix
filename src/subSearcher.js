//TODO retry the search, but maybe in the seek part not here
import OS from 'opensubtitles-api'

const opensubtitles = new OS('OSTestUserAgentTemp')

function search(movie, lang) {
  return opensubtitles.search({
    sublanguageid: (lang === 'pob') ? lang : 'pob,eng',
    hash: movie.hash,
    filesize: movie.filesize,
    filename: movie.filename,
    gzip: true
  })
}

function subFilter(subtitles, lang) {
  return new Promise((resolve, reject) => {
    if(!subtitles) {
      console.error('aloooooooooooooooooooooooooooo!!!')
      reject(new Error('Subtitles came empty.'))
      //console.info("aloooo errrooo")
      //reject('Subtitles came empty')
    }
    let subtitle = {}
    if (lang === 'pob') {
      subtitle = subtitles.pb ? subtitles.pb : subtitles.en
    } else {
      subtitle = subtitle.en
    }
    resolve(subtitle)
  })
}

export default function createSubSearcher() {
  return {
    search: search,
    filter: subFilter
  }
}