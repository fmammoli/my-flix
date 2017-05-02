import OS from 'opensubtitles-api'

const opensubtitles = new OS('OSTestUserAgentTemp')

function search(movie, lang) {
  
  return opensubtitles.search({
    sublanguageid: 'pb',
    hash: movie.hash,
    filesize: movie.filesize,
    filename: movie.filename,
    gzip: true
  }).then(res => {
    console.info(res)
    return res
  }).catch(err => {
    console.error(err)
    throw err
  })
}

export default function createSubSearcher() {
  return {
    search: search
  }
}