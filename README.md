# tile-dl-client

Download map tiles in the browser to a `.tar` file.

Uses window.caches to support downloads without memory limits, which only works in
late versions of Google Chrome.


## Install

```
npm install tile-dl-client
```

## Example

Run `npm test` and see the code in `example/`.

## Usage 

```js
var download = require('tile-dl-client')

var opts = {
  minZoom: 4,
  maxZoom: 5,
  path: '/export/mytiles.tar'
}
```

Bounds can be specified with minimum and maximum lats and lons directly:

```js
{
  minLat: 58.516,
  maxLat: 57.9095,
  maxLng: -6.1357,
  minLng: -7.1354,
}
```

OR using `bounds`, 

```js
bounds = [
  -7.1354, 58.516,-6.1357, 57.9095
]
```

And then pass these options and the URL. The callback is called when the tiles
are finished downloading.

```js
function done (err) {
  if (err) throw err
  alert('Done!')
})

function onprogress (p) {
  console.log(`${p}%`)
}

download(url, opts, done, onprogress)
```

You'll probably want to then use a service worker or some other method to get
use the offline tiles after that point. See the `example` directory for the
recommended way to download these files to the user's download folder.

## License

MIT
