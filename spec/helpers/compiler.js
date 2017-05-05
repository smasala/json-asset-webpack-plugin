const TEST_DATA = [{
        name: "chunk1",
        files: ["aa.js", "a.js"]
    }, {
        name: "chunk3",
        files: ["c.js", "c.map", "c.css"]
    }, {
        name: "chunk2",
        files: ["b.js", "b.css"]
}];

const COMPILATION = {
        compilation: {
            outputOptions: {},
            chunks: TEST_DATA
        }
}

const MOCK_COMPILER = {
    plugin(type, callback) {
        if (type === "done") {
            callback(COMPILATION);
        }
    }
}

beforeEach(function() {
    this.MOCK_COMPILER = MOCK_COMPILER;
})