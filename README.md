# tile-dl-client

Download map tiles in the browser to a `.tar` file, without memory limits.

Uses `tilelive`

## Usage

```
npm install tile-dl-client
```

```js
var download = require('tile-dl-client')
download(url, data, function (stream) {
  stream.on('error', function (err) {
    throw err
  })
  stream.on('end', function () {
    alert('Done!')
  })
})
```
