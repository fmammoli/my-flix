import createPreloader from './preloader'
import Hash from './hash'
import createSubSearcher from './subSearcher'
import createSubDownloader from './subdownloader'
import path from 'path'

const preloader = createPreloader()
const subSearcher = createSubSearcher()
const subDownloader = createSubDownloader()

const TMP_FOLDER = 'tmp'
const SUBTITLE_TMP_FOLDER = path.join(TMP_FOLDER, 'subs')

function seek(magnetURI, lang) {
  return preloader.getMovie(magnetURI)
    .then(movie => {
      return Hash.computeHash(movie.filepath, movie.filesize)
        .then(hash => {
          movie.hash = hash
          return subSearcher.search(movie, lang)
            .then(subtitles => subSearcher.filter(subtitles, lang))
            .then(subtitle => {
              const result = {
                movie: {
                  filename: movie.filename,
                  filepath: movie.filepath,
                  filesize: movie.filesize
                },
                subtitle: {
                  lang: subtitle.lang,
                  langName: subtitle.langName,
                  subName: subtitle.subName,
                  url: subtitle.url
                }
              }
              return result
            }) 
        })
    })
}
function save(movie) {
  const destFile = path.join(SUBTITLE_TMP_FOLDER, movie.subtitle.subName)
  return subDownloader.download(movie.subtitle.url, destFile)
}
function clear() {
  return preloader.clear()
}

export default function createSeeker (){
  return {
    findSubtitle: seek,
    saveSubtitle: save,
    clear: clear
  }
}