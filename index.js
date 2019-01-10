global.setImmediate = require('timers').setImmediate // monkey patch for tilelive-http
const path = require('path')
const tilelive = require('tilelive-streaming')(require('tilelive-browser'))
const store = require('browser-cache-blob-store')
const pump = require('pump')
const utils = require('@yaga/tile-utils')

require('tilelive-http')(tilelive)
require('@mapbox/tilejson').registerProtocols(tilelive)
require('tilelive-tar').registerProtocols(tilelive)

/**
* Download tile data given a query.
*/

module.exports = function (url, data, cb, onprogress) {
  var blobStore = store()
  if (!data.bounds && !(data.minLng && data.minLat && data.maxLng && data.maxLat)) {
    return cb(new Error('Requires bounds, or minLat/minLon/maxLat/maxLon'))
  }

  if (!data.bounds) {
    data.bounds = [
      data.minLng,
      data.minLat,
      data.maxLng,
      data.maxLat
    ]
  }

  var complete = 0
  var size = estimatedSize(data)

  tilelive.load(url, function (err, source) {
    if (err) throw err
    var sinkUrl = 'tar://tiles' + path.extname(url)
    tilelive.load(sinkUrl, function (err, sink) {
      if (err) throw err

      var ws = blobStore.createWriteStream(data.path || 'tiles.tar', function (err) {
        cb(err)
      })

      sink.pack.on('data', function (data) {
        ws.write(data)
        complete += data.length
        var progress = complete / size
        onprogress(Math.min(progress, 1))
      })

      var reader = source.createReadStream({
        minzoom: data.minZoom,
        maxzoom: data.maxZoom || data.minZoom + 1,
        bounds: data.bounds
      })
      var writer = sink.createWriteStream()

      pump(reader, writer, function (err) {
        if (err) cb(err)
        ws.end()
      })
    })
  })
}

function estimatedSize (data) {
  // This seems wrong!
  var count = 0
  for (let z = data.minZoom; z <= data.maxZoom; z += 1) {
    const minX = utils.lng2x(data.bounds[0], z)
    const maxX = utils.lng2x(data.bounds[2], z)
    const maxY = utils.lat2y(data.bounds[1], z)
    const minY = utils.lat2y(data.bounds[3], z)
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        count += 1
      }
    }
  }
  return count * (6 * 1000)
}
