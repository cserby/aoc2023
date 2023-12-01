/** @type {import('eslint').Linter.Config} */
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    // "extends": "standard-with-typescript",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": ["@stylistic"],
    "rules": {
        "@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
        "@stylistic/semi": "error"
    }
};
