import Hash from './hash'

describe('hash', () =>{
  it('should hash a file', () => {    
    //looks like the test thing start looking at root, not relative
    const moviepath = './tmp/torrents/Star.Wars.Rebels.S03E19.Twin.Suns.1080p.WEB-DL.DD5.1.H.264-YFN/Star.Wars.Rebels.S03E19.Twin.Suns.1080p.WEB-DL.DD5.1.AAC2.0.H.264-YFN.mkv'
    return Hash.computeHash(moviepath)
    .then(hash => {
      expect(hash).toMatch('b7173e5f05c29947')
    })
  })
})