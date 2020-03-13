// jest.config.js
module.exports = {
    verbose: false,
    moduleNameMapper: {
        "^components(.*)$": "<rootDir>/src/components$1",
        "^src(.*)$": "<rootDir>/src$1"
    }
};
