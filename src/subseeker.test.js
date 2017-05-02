import createSubSeeker from './subseeker'

describe('SubSeeker', () => {
  it('should seek a Subtitle', () => {
    const subSeeker = createSubSeeker()
    console.info(subSeeker)
    subSeeker.seek('magnetURI','lang')
    expect(subSeeker.seek()).toBeCalled()
  })
  it('should return a subtitle object', () => {
    const subtitle = {
      movieName: 'movieName',
      fileName: 'fileName',
      filePath: 'filePath',
      lang: 'lang',
      downloadLink: 'downloadLink'
    }
    const subSeeker = createSubSeeker()
    return subSeeker.seek('magnetURI', 'lang').then(subtitle => {
      expect(subtitle).toMatchObject(subtitle)
    })
  })
})