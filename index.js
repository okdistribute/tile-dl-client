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

module.exports = function (url, data, cb) {
  var blobStore = store()
  if (!data.bounds && !(data.minLng && data.minLat && data.maxLng && data.maxLat)) {
    return cb(new Error('Requires bounds, or minLat/minLon/maxLat/maxLon'))
  }

  tilelive.load(url, function (err, source) {
    if (err) throw err
    var sinkUrl = 'tar://tiles' + path.extname(url)
    tilelive.load(sinkUrl, function (err, sink) {
      if (err) throw err
      var ws = blobStore.createWriteStream(data.path || 'tiles.tar', cb)

      sink.pack.on('data', function (data) {
        ws.write(data)
      })

      var bounds = data.bounds || [
        data.minLng,
        data.minLat,
        data.maxLng,
        data.maxLat
      ]

      var reader = source.createReadStream({
        minzoom: data.minZoom,
        maxzoom: data.maxZoom || data.minZoom + 1,
        bounds: bounds
      })
      var writer = sink.createWriteStream()

      pump(reader, writer, function (err) {
        if (err) cb(err)
        ws.end()
      })
    })
  })
}
