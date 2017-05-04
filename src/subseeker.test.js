import createSubSeeker from './subseeker'
import rimraf from 'rimraf'
import fs from 'fs'

describe('SubSeeker', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  //the other test already executes this code
  test.skip('should find a subtitle', () => {
    const subseeker = createSubSeeker()
    //const magnetURI = 'magnet:?xt=urn:btih:3db80e9fe85fd3e41771a94a7f81e96599f54eef&dn=Star.Wars.Rebels.S03E12.HDTV.x264-RBB%5Bstate%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    const magnetURI = 'magnet:?xt=urn:btih:0ed0e0d76f86360d63cd73d11b8f1a703b8b988f&dn=Star.Wars.Rebels.S03E11.HDTV.x264-BATV%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    const lang = 'pob'
  
    //subseeker.findSubtitle object response
    const subtitleMatch = { 
      movie: {
        filename: 'Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv].mkv',
        filesize: 137941440,
        filepath: 'tmp\\torrents\\Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv]\\Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv].mkv',
      },      
      subtitle: {
        url: 'http://dl.opensubtitles.org/en/download/src-api/vrf-19ca0c5b/sid-SXCCDSZ-Vr4p-weytDEvWMgb1Te/filead/1955426936.gz',
        lang: 'pb',
        langName: 'Portuguese (BR)',
        subName: 'Star.Wars.Rebels.S03E11.720p.HDTV.x264-BATV.srt'
      }
    }
    
    return subseeker.findSubtitle(magnetURI, lang)
      .then(response => {
        return subseeker.clear().then(() =>{
          expect(response.subtitle.subName).toMatch('Star.Wars.Rebels.S03E11.720p.HDTV.x264-BATV.srt')
          expect(response.subtitle.lang).toMatch('pb')
        })
      })
  })

  test('should save subtitle file', () => {
    const subseeker = createSubSeeker()
    //const magnetURI = 'magnet:?xt=urn:btih:3db80e9fe85fd3e41771a94a7f81e96599f54eef&dn=Star.Wars.Rebels.S03E12.HDTV.x264-RBB%5Bstate%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    const magnetURI = 'magnet:?xt=urn:btih:0ed0e0d76f86360d63cd73d11b8f1a703b8b988f&dn=Star.Wars.Rebels.S03E11.HDTV.x264-BATV%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    const lang = 'pob'
   
    return subseeker.findSubtitle(magnetURI, lang)
       .then(result => subseeker.saveSubtitle(result))
       .then(subPath => {
         console.log(subPath)
         fs.stat(subPath, (err, stats) => {
           return subseeker.clear(() => {
             expect(err).toBeNull()
             expect(stats.size).toBeGreaterThan(0)
           })
         })
       })
       .catch(err => console.error(err))
  })
})