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

export default function createSubSearcher() {
  return {
    search: search
  }
}