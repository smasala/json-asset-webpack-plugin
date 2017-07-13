"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPath = require("fs-path");

var _fsPath2 = _interopRequireDefault(_fsPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getChunks = function getChunks(chunks, publicPath) {
  var mapper = function mapper(arr, ext) {
    return arr.map(function (chunk) {
      return {
        name: chunk.name,
        files: chunk.files.filter(function (file) {
          return _path2.default.extname(file) === ext;
        }).map(function (file) {
          return publicPath + file;
        })
      };
    }).filter(function (item) {
      return item.files.length;
    });
  };
  return {
    assets: {
      js: mapper(chunks, ".js"),
      css: mapper(chunks, ".css")
    }
  };
};

var sortIt = function sortIt(chunksSortMode, type, assets) {
  if (typeof chunksSortMode === "function") {
    assets[type].sort(chunksSortMode);
  } else if (chunksSortMode[type]) {
    assets[type].sort(chunksSortMode[type]);
  }
};

var JSONAssetWebpackPlugin = function () {
  function JSONAssetWebpackPlugin(config) {
    _classCallCheck(this, JSONAssetWebpackPlugin);

    this.defaultConfig = {
      out: "assets.json",
      beforeWrite: function beforeWrite(outPath, assetObj, callback) {
        callback(outPath, assetObj);
      }
    };
    this.config = _lodash2.default.extend(this.defaultConfig, config);
  }

  _createClass(JSONAssetWebpackPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin("done", function (_ref) {
        var compilation = _ref.compilation;

        var outPath = _path2.default.join(compilation.outputOptions.path || "", _this.config.out);
        var assetObj = getChunks(compilation.chunks, compilation.outputOptions.publicPath || "");
        if (_this.config.chunksSortMode) {
          sortIt(_this.config.chunksSortMode, "js", assetObj.assets);
          sortIt(_this.config.chunksSortMode, "css", assetObj.assets);
        }
        _this.config.beforeWrite(outPath, assetObj, function (out, assets) {
          _fsPath2.default.writeFileSync(out, JSON.stringify(assets));
        });
      });
    }
  }]);

  return JSONAssetWebpackPlugin;
}();

exports.default = JSONAssetWebpackPlugin;
module.exports = exports["default"];
