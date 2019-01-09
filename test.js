console.log('hi')
var downloader = require('./')
var url = 'https://ecn.t0.tiles.virtualearth.net/tiles/a{q}.jpeg?g=5869'
var data = {
  IBBox: {
    minLat: 58.516,
    maxLat: 57.9095,
    maxLng: -6.1357,
    minLng: -7.1354
  },
  minZoom: 1,
  maxZoom: 2,
  path: '/export/mytiles.tar'
}

console.log('downloading', url)

downloader(url, data, function (err) {
  if (err) throw err
  console.log('done')
})
