# json-asset-webpack-plugin
Simple asset to json webpack plugin

#Usage

`Npm Install`
```
npm install json-asset-webpack-plugin --save-dev
```

`Require into webpack config`
```
var JSONAssetWebpackPlugin = require("json-asset-webpack-plugin");
```

`Use Plugin`
```
new JSONAssetWebpackPlugin( {config: optional} )
```

`Configuration`

- config.out (optional)
    - file name: default: "assets.json"
- config.chunksSortMode (optional)
    - function: (a, b) => {} //https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    - object: { js: Array.sort, css: Array.sort }


