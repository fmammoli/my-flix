import createPreloader from './preloader'
//should mock the start torrent so it does not need to download a file
//then should mock the dele stuff too, who knows
describe('preloader', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000
  test('should donwload the first and last 64kb of the movie file', () => {
    const preloader = createPreloader()    
    const magnetURI = 'magnet:?xt=urn:btih:0ed0e0d76f86360d63cd73d11b8f1a703b8b988f&dn=Star.Wars.Rebels.S03E11.HDTV.x264-BATV%5Bettv%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
    const movieMatch = {
      filename: 'Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv].mkv',
      filesize: 137941440,
      filepath: 'tmp\\torrents\\Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv]\\Star.Wars.Rebels.S03E11.HDTV.x264-BATV[ettv].mkv'
    }
    return preloader.getMovie(magnetURI).then(movie => {
      return preloader.clear().then(() => {
        expect(movie).toMatchObject(movieMatch)      
      })
    })
  })
})