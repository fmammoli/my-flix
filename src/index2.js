import createSubseeker from './subseeker'

function run() {
  const magnetURI = 'magnet:?xt=urn:btih:3db80e9fe85fd3e41771a94a7f81e96599f54eef&dn=Star.Wars.Rebels.S03E12.HDTV.x264-RBB%5Bstate%5D&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
  const lang = 'pob'
  const subseeker = createSubseeker()

  return subseeker.findSubtitle(magnetURI, lang)
  .then(result => {
    console.log('aloooooo');
    console.info(result)
    return subseeker.saveSubtitle(result)
  })
}

run().then(res => {
  console.info('Subtitles saved on: '+res)
  process.exit()
})