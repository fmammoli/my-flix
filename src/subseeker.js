import createPreloader from './preloader'
import Hash from './hash'
import createSubSearcher from './subSearcher'

const preloader = createPreloader()
const subSearcher = createSubSearcher()



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

function clear() {
  return preloader.clear()
}

export default function createSeeker (){
  return {
    findSubtitle: seek,
    clear: clear
  }
}