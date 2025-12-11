export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    transform: {},
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true
        }
    },
    moduleFileExtensions: ["js", "ts", "json"],
    testMatch: ["**/server/test/**/*.test.js", "**/tests/**/*.test.ts"]
};
