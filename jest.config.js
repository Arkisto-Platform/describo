// jest.config.js
module.exports = {
    verbose: true,
    moduleNameMapper: {
        "^components(.*)$": "<rootDir>/src/components$1",
        "^src(.*)$": "<rootDir>/src$1"
    }
};
