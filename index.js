global.setImmediate = require('timers').setImmediate // monkey patch for tilelive-http
const path = require('path')
const tilelive = require('tilelive-streaming')(require('tilelive-browser'))
const store = require('browser-cache-blob-store')
const pump = require('pump')

require('tilelive-http')(tilelive)
require('@mapbox/tilejson').registerProtocols(tilelive)
require('tilelive-tar').registerProtocols(tilelive)

/**
* Download tile data given a query.
*/

var blobStore = store()
let browser = window.browser

module.exports = function (url, data, cb) {
  tilelive.load(url, function (err, source) {
    if (err) throw err
    var sinkUrl = 'tar://tiles' + path.extname(url)
    tilelive.load(sinkUrl, function (err, sink) {
      if (err) throw err
      var ws = blobStore.createWriteStream('tiles.tar', () => {
        var filename = 'tiles.tar'
        console.log('downloading', filename)
        browser.downloads.download({
          url: `/export/${filename}`,
          filename: filename,
          conflictAction: 'uniquify'
        })
      })

      sink.pack.on('data', function (data) {
        ws.write(data)
      })

      var bounds = [data.minLng, data.minLat, data.maxLng, data.maxLat]
      var reader = source.createReadStream({
        minzoom: data.minZoom,
        maxzoom: data.maxZoom || data.minZoom + 1,
        bounds: bounds
      })
      var writer = sink.createWriteStream()

      var stream = pump(reader, writer, function (err) {
        if (err) console.error(err)
        ws.close()
      })

      cb(stream)
    })
  })
}
