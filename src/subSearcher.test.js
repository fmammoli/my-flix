import createSubSearcher from './subSearcher'

describe('subtitleSearcher', () => {
  it('should search a subtitle on opensubtitle API', t => {
    const subSearcher = createSubSearcher()
    const movie = {
      hash: '8e245d9679d31e12',
      filesize: '12 909 756',      
      filename: 'filename'
    }
    return subSearcher.search(movie, 'pob')
      .then(subtitles => {
        console.info(subtitles)
        expect(subtitles).toMatchObject({})
      })
  })
  it('should call opensubtitle api', () => {
    //expect(subSearcher.search).toBeCalledWith(movie, 'pob')
  })
})