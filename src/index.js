import fs from "fs";
import path from "path";
import _ from "lodash";

let getChunks = (chunks) => {
  let mapper = (arr, ext) => {
      return arr.map((chunk) => {
          return {
            name: chunk.name,
            files: chunk.files.filter((file) => {
                return path.extname(file) === ext;
            })
          }
    }).filter((item) => {
        return item.files.length;
    });
  };
  return {
    assets: {
      js: mapper(chunks, ".js"),
      css: mapper(chunks, ".css")
    }
  }
}

let sortIt = (chunksSortMode, type, assets) => {
  if (typeof chunksSortMode === "function") {
    assets[type].sort(chunksSortMode);
  } else if (chunksSortMode[type]) {
    assets[type].sort(chunksSortMode[type]);
  }
}

export default class JSONAssetWebpackPlugin {

  constructor(config) {
    this.defaultConfig = {
      out: "assets.json"
    }
    this.config = _.extend(this.defaultConfig, config);
  }

  apply(compiler) {
    compiler.plugin("done", ( {compilation} ) => {
        let outPath = path.join(compilation.outputOptions.path || "", this.config.out);
        let assetObj = getChunks(compilation.chunks);
        if (this.config.chunksSortMode) {
            sortIt(this.config.chunksSortMode, "js", assetObj.assets);
            sortIt(this.config.chunksSortMode, "css", assetObj.assets);
        }
        fs.writeFileSync(outPath, JSON.stringify(assetObj));
      });
  }
}