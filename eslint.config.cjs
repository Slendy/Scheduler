const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const parser = require("svelte-eslint-parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
    ),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            svelte: "readonly",
            $$Generic: "readonly",
        },

        parser: tsParser,

        parserOptions: {
            tsconfigRootDir: __dirname,
            project: "./tsconfig.lint.json",
            extraFileExtensions: [".svelte"],
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "no-extra-semi": "off",
    },
}, globalIgnores(["src/routes/*", "src/tests/*", "**/*.cjs"]), {
    files: ["**/*.svelte"],
    extends: compat.extends("plugin:svelte/recommended"),

    languageOptions: {
        parser: parser,
        sourceType: "module",
        ecmaVersion: "latest",

        parserOptions: {
            parser: "@typescript-eslint/parser",
            extraFileExtensions: [".svelte"],
            tsconfigRootDir: __dirname,
            project: "./tsconfig.lint.json",
        },
    },

    settings: {
        svelte: {
            ignoreWarnings: [
                "@typescript-eslint/no-unsafe-assignment",
                "@typescript-eslint/no-unsafe-member-access",
            ],
        },
    },

    rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
        "svelte/no-dupe-use-directives": "error",
        "svelte/no-dom-manipulating": "warn",
        "svelte/no-export-load-in-svelte-module-in-kit-pages": "error",
        "svelte/no-store-async": "error",
        "svelte/require-store-callbacks-use-set-param": "error",
        "svelte/no-target-blank": "error",
        "svelte/no-reactive-functions": "error",
        "svelte/no-reactive-literals": "error",
        "svelte/no-useless-mustaches": "error",
        "svelte/require-optimized-style-attribute": "error",
        "svelte/require-stores-init": "error",
        "no-trailing-spaces": "off",
        "svelte/no-trailing-spaces": "error",
        "svelte/derived-has-same-inputs-outputs": "error",
        "svelte/html-closing-bracket-spacing": "error",
        "svelte/html-quotes": "error",
        "svelte/mustache-spacing": "error",
        "svelte/no-extra-reactive-curlies": "error",
        "svelte/no-spaces-around-equal-signs-in-attribute": "error",
        "svelte/prefer-class-directive": "error",
        "svelte/prefer-style-directive": "error",
        "svelte/shorthand-attribute": "error",
        "svelte/shorthand-directive": "error",
        "svelte/spaced-html-comment": "error",
    },
}, globalIgnores([
    "**/.DS_Store",
    "**/node_modules",
    "build",
    ".svelte-kit",
    "package",
    "**/.env",
    "**/.env.*",
    "!**/.env.example",
    "**/pnpm-lock.yaml",
    "**/package-lock.json",
    "**/yarn.lock",
])]);