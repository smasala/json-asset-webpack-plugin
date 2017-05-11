# Json-Asset-Webpack-Plugin
Simple asset to json webpack plugin

## Sample Output

```
 {
	"assets": {
		"js": [{
			"name": "polyfills",
			"files": ["polyfills.a4a96aebc315cd042a48.bundle.js"]
		}, {
			"name": "vendor",
			"files": ["vendor.a4a96aebc315cd042a48.bundle.js"]
		}, {
			"name": "app",
			"files": ["app.a4a96aebc315cd042a48.bundle.js"]
		}],
		"css": [{
			"name": "app",
			"files": ["app.09bff5466d500a2adfef92c1c2867e23.css"]
		}]
	}
}
```

## Usage

### Npm Install
```
npm install json-asset-webpack-plugin --save-dev
```

### Require into webpack config
```
var JSONAssetWebpackPlugin = require("json-asset-webpack-plugin");
```

### Use Plugin
```
new JSONAssetWebpackPlugin( {config: optional} )
```

### Configuration

- `config.out` (optional)
    - file name: default: "assets.json"
- `config.chunksSortMode` (optional)
    - Function: `Array.sort` used to sort both `js` and `css` files https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    - Object: `{ js: Array.sort function (optional), css: Array.sort function (optional) }`
- `config.beforeWrite` (optional)

#### chunksSortMode example:
```
new JSONAssetWebpackPlugin({
    chunksSortMode: function(a, b) {
        // thanks to @jantimon https://github.com/jantimon/html-webpack-plugin/issues/140#issuecomment-263927464
        var order = ["polyfills", "vendor", "app"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})
```

#### beforeWrite example:
```
new JSONAssetWebpackPlugin({
    beforeWrite: function(outPath, assetsObj, callback) {
        // manipulate outPath/assetsObj if needed
        callback(outPath, assetsObj);	// must be called to write the file
    }
})
```

