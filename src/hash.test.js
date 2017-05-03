import Hash from './hash'
import path from 'path'

describe('hash', () =>{
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  it('should hash a file', () => {    
    //looks like the test thing start looking at root, not relative
    const moviepath = path.join('testfile','breakdance.avi')
    const moviesize = 12909756
    return Hash.computeHash(moviepath, moviesize)
    .then(hash => {
      expect(hash).toMatch('8e245d9679d31e12')
    }).catch(err => console.error(err))
  })
})