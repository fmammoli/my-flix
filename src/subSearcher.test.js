import createSubSearcher from './subSearcher'

describe('subtitleSearcher', () => {
  it('should search a subtitle on opensubtitle API', () => {
    const subSearcher = createSubSearcher()
    
    const movie = {
      hash: 'b7173e5f05c29947',
      filesize: '924410044',
      filename: 'filename'
    }
    
    // OpensSubtitles API response object
    // const subtitleMatch = {
    //   'pb': {
    //     'downloads': '178',
    //     'encoding': 'CP1252',
    //     'id': '1955507215',
    //     'lang': 'pb',
    //     'langName': 'Portuguese (BR)',
    //     'score': 12,
    //     'subName': 'Star Wars Rebels S03E19 Twin Suns 1080p.srt',
    //     'url': 'http://dl.opensubtitles.org/en/download/src-api/vrf-19b00c51/sid-t3CrHYaJdRAa8f3os4UQUMMnTU8/filead/1955507215.gz'
    //   }
    // }

    return subSearcher.search(movie, 'pob')
      .then(subtitles => {
        expect(subtitles.pb.lang).toMatch('pb')
      })
  })
})