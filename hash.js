// Generate hash from file torrent for opensubtitles api
//based on https://github.com/alamcordeiro/torrent-subtitle
//and opensubtitles-api
function computeHashFromTorrentFile (fileTorrent) {
    return new Promise((resolve, reject) => {
      let chunk_size = 65536, // 1024 * 64
        file_size = fileTorrent.length,
        length_bytes = 131072 // chunk_size * 2

      let startStream = fileTorrent.createReadStream({start: 0, end: length_bytes - 1}),
        endStream = fileTorrent.createReadStream({start: (file_size - chunk_size), end: file_size})

      Promise.all([checksumStream(startStream, length_bytes), checksumStream(endStream, length_bytes)])
        .then((checksuns) => {
          let checksum = sumChecksuns(checksuns, file_size)
          resolve(checksum)
        }).catch(reject)
    })
  }

  // Calculate hex sum between checksuns
function  sumChecksuns (checksuns, file_size) {
    let checksum = sumHex64bits(file_size.toString(16), checksuns[0])
    checksum = sumHex64bits(checksum, checksuns[1])
    checksum = checksum.substr(-16)
    checksum = padLeft(checksum, '0', 16)
    return checksum
  }

  // Compute checksum of the buffer splitting by chunk of lengths bits
  function checksumBuffer (buf, length) {
    let checksum = 0,
      checksum_hex = 0
    for (let i = 0; i < (buf.length / length); i++) {
      checksum_hex = read64LE(buf, i)
      checksum = sumHex64bits(checksum.toString(), checksum_hex).substr(-16)
    }
    return checksum
  }

  // Get checksum from readable stream
  function checksumStream (stream, defaultsize) {
    let self = this
    return new Promise(function (resolve, reject) {
      let bufs = []
      stream.on('data', function (data) {
        bufs.push(data)
      }).on('end', function () {
        let buffer = new Buffer(defaultsize)
        Buffer.concat(bufs).copy(buffer)
        let checksum = checksumBuffer(buffer, 16)
        resolve(checksum)
      }).on('error', reject)
    })
  }

  // Read 64 bits from buffer starting at offset as LITTLE ENDIAN hex
  function read64LE (buffer, offset) {
    var ret_64_be = buffer.toString('hex', offset * 8, ((offset + 1) * 8))
    var array = []
    for (var i = 0; i < 8; i++) {
      array.push(ret_64_be.substr(i * 2, 2))
    }
    array.reverse()
    return array.join('')
  }

  // Calculate hex sum between 2 64bits hex numbers
  function sumHex64bits (n1, n2) {
    if (n1.length < 16) n1 = padLeft(n1, '0', 16)

    if (n2.length < 16) n2 = padLeft(n2, '0', 16)

    // 1st 32 bits
    let n1_0 = n1.substr(0, 8),
      n2_0 = n2.substr(0, 8),
      i_0 = parseInt(n1_0, 16) + parseInt(n2_0, 16)

    // 2nd 32 bits
    let n1_1 = n1.substr(8, 8),
      n2_1 = n2.substr(8, 8),
      i_1 = parseInt(n1_1, 16) + parseInt(n2_1, 16)

    // back to hex
    let h_1 = i_1.toString(16),
      i_1_over = 0
    if (h_1.length > 8) {
      i_1_over = parseInt(h_1.substr(0, h_1.length - 8), 16)
    } else {
      h_1 = padLeft(h_1, '0', 8)
    }
    let h_0 = (i_1_over + i_0).toString(16)
    return h_0 + h_1.substr(-8)
  }

  // Pad left with c up to length characters
  function padLeft (str, c, length) {
    while (str.length < length) str = c.toString() + str
    return str
  }
module.exports = {
  computeHashFromTorrentFile: computeHashFromTorrentFile
}