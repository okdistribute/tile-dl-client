var downloader = require('..')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(function (reg) {
    // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope)
    }).catch(function (error) {
    // registration failed
      console.log('Registration failed with ' + error)
    })
}

var url = 'https://ecn.t0.tiles.virtualearth.net/tiles/a{q}.jpeg?g=5869'
var data = {
  minLat: 57.9095,
  maxLat: 58.516,
  maxLng: -6.1357,
  minLng: -7.1354,
  minZoom: 0,
  maxZoom: 6,
  path: '/export/tiles.tar'
}

function onprogress (p) {
  document.body.innerHTML = p
}

function ondone (err) {
  if (err) throw err
  var element = document.createElement('a')
  element.setAttribute('href', data.path)
  element.style.display = 'none'
  document.body.appendChild(element)
  let click = new window.MouseEvent('click')
  element.dispatchEvent(click)
  document.body.removeChild(element)
}

downloader(url, data, ondone, onprogress)
