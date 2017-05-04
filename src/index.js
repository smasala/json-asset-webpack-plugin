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
        console.info(getChunks(compilation.chunks));
        let assetObj = getChunks(compilation.chunks);
        if (this.config.chunksSortMode) {
            assetObj.assets.js.sort(
              typeof this.config.chunksSortMode === "function" ? this.config.chunksSortMode : this.config.chunksSortMode.js
            );
            if (this.config.chunksSortMode.css) {
                assetObj.assets.css.sort(this.config.chunksSortMode.css);
            }
        }
        fs.writeFileSync(outPath, JSON.stringify(assetObj));
      });
  }
}