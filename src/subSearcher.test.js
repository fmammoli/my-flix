describe('subtitleSearcher', () => {
  it('should search a subtitle on opensubtitle API', () => {
    const subSearcher = createSubSearcher()
    const movie = {
      hash: 'hash',
      filename: 'filename',
      filesize: '1'
    }
    subSearcher.search(movie, 'lang')
  })
})