/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "\\.(gql|graphql)$": "@jagi/jest-transform-graphql"
  },
  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};