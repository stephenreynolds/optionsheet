module.exports = {
  preset: "ts-jest",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: ".*\\.test.(js|jsx|ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"]
};