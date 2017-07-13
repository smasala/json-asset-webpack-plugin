import JSONAssetWebpackPlugin from "./index";
import fs from "fs";
import path from "path";

describe("JSONAssetWebpackPlugin", () => {

    const OUT_ORDER = ["chunk1", "chunk2", "chunk3"];
    const CHUNK_SORTER = (a, b) => {
            return OUT_ORDER.indexOf(a.name) - OUT_ORDER.indexOf(b.name);
        };
    let MOCK_COMPILER;
    // root dir: 
    // from:    "{somepath}/json-asset-webpack-plugin/src"
    // to:      "{somepath}/json-asset-webpack-plugin/"
    const rootPath = __dirname.replace(path.sep + "src", path.sep);

    beforeEach(function() {
        // retrieve from compiler.js helper
        MOCK_COMPILER = this.MOCK_COMPILER;
    });

    it("init", () => {
        let plugin = new JSONAssetWebpackPlugin();
        expect(plugin).toBeDefined();
        expect(plugin.config).toEqual({
            out: "assets.json",
            beforeWrite: jasmine.any(Function)
        });
    });

    it("override config", () => {
        let plugin = new JSONAssetWebpackPlugin({
            out: "abc.json",
            chunksSortMode: (a, b) => {
                //do nothing
            }
        });
        expect(plugin.config.out).toBe("abc.json");
        expect(typeof plugin.config.chunksSortMode).toBe("function");
    });

    it("get basic assets", () => {
        let plugin = new JSONAssetWebpackPlugin({
            out: "abc.json"
        });
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "abc.json");
            expect(jsonString).toBeDefined();
            expect(jsonString).not.toBeNull();
        })
        plugin.apply(MOCK_COMPILER);
    });

    it("get assets", () => {
        let plugin = new JSONAssetWebpackPlugin();
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "assets.json");
            expect(jsonString).toBeDefined();
            expect(JSON.parse(jsonString)).toEqual({
                assets: {
                    js: [{
                        name: "chunk1",
                        files: ["aa.js", "a.js"]
                    }, {
                        name: "chunk3",
                        files: ["c.js"]
                    }, {
                        name: "chunk2",
                        files: ["b.js"]
                    }],
                    css: [{
                        name: "chunk3",
                        files: ["c.css"]
                    }, {
                        name: "chunk2",
                        files: ["b.css"]
                    }]
                } 
            });
        })
        plugin.apply(MOCK_COMPILER);
    });

    it("sort only js assets", () => {
        let plugin = new JSONAssetWebpackPlugin({
            chunksSortMode: {
                js: CHUNK_SORTER
            }
        });
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "assets.json");
            expect(jsonString).toBeDefined();
            expect(JSON.parse(jsonString)).toEqual({
                assets: {
                    js: [{
                        name: "chunk1",
                        files: ["aa.js", "a.js"]
                    }, {
                        name: "chunk2",
                        files: ["b.js"]
                    }, {
                        name: "chunk3",
                        files: ["c.js"]
                    }],
                    css: [{
                        name: "chunk3",
                        files: ["c.css"]
                    }, {
                        name: "chunk2",
                        files: ["b.css"]
                    }]
                } 
            });
        })
        plugin.apply(MOCK_COMPILER);
    });

    it("sort only css assets", () => {
        let plugin = new JSONAssetWebpackPlugin({
            chunksSortMode: {
                css: CHUNK_SORTER
            }
        });
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "assets.json");
            expect(jsonString).toBeDefined();
            expect(JSON.parse(jsonString)).toEqual({
                assets: {
                    js: [{
                        name: "chunk1",
                        files: ["aa.js", "a.js"]
                    }, {
                        name: "chunk3",
                        files: ["c.js"]
                    }, {
                        name: "chunk2",
                        files: ["b.js"]
                    }],
                    css: [{
                        name: "chunk2",
                        files: ["b.css"]
                    }, {
                        name: "chunk3",
                        files: ["c.css"]
                    }]
                } 
            });
        })
        plugin.apply(MOCK_COMPILER);
    });

    it("sort all assets", () => {
        let plugin = new JSONAssetWebpackPlugin({
            chunksSortMode: CHUNK_SORTER
        });
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "assets.json");
            expect(jsonString).toBeDefined();
            expect(JSON.parse(jsonString)).toEqual({
                assets: {
                    js: [{
                        name: "chunk1",
                        files: ["aa.js", "a.js"]
                    }, {
                        name: "chunk2",
                        files: ["b.js"]
                    }, {
                        name: "chunk3",
                        files: ["c.js"]
                    }],
                    css: [{
                        name: "chunk2",
                        files: ["b.css"]
                    }, {
                        name: "chunk3",
                        files: ["c.css"]
                    }]
                } 
            });
        })
        plugin.apply(MOCK_COMPILER);
    });

    it("before write callback", () => {
        let plugin = new JSONAssetWebpackPlugin({
            chunksSortMode: CHUNK_SORTER,
            beforeWrite: (out, assets, callback) => {
                out = "bob.json";
                assets = {
                    a: "hello"
                };
                callback(out, assets);
            }
        });
        spyOn(fs, "writeFileSync").and.callFake((path, jsonString) => {
            expect(path).toBe(rootPath + "bob.json");
            expect(jsonString).toBe(JSON.stringify({
                a: "hello"
            }));
        });
        plugin.apply(MOCK_COMPILER);
    });

});
