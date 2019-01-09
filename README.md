# tile-dl-client

Download map tiles in the browser to a `.tar` file.

Uses window.caches to support downloads without memory limits, which only works in
late versions of Google Chrome.


## Usage

```
npm install tile-dl-client
```

```js
var download = require('tile-dl-client')

var opts = {
  minZoom: 4,
  maxZoom: 5,
  path: '/export/mytiles.tar'
}
```

Bounds can be specified using `bounds` or `IBBox`:

```js
opts.IBBox = {
  minLat: 58.516,
  maxLat: 57.9095,
  maxLng: -6.1357,
  minLng: -7.1354,
}
```

OR 

```js
opts.bounds = [
  -7.1354, 58.516,-6.1357, 57.9095
]
```

And then pass options and the URL to the downloader:
```js
download(url, opts, function (err) {
  if (err) throw err
  alert('Done!')
})
```

## Testing

Run `npm test` and view the console output in your browser. 

## License

MIT
