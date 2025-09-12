import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [{
    "languageOptions": {
        "parser": tsParser,
        "parserOptions": {
            "ecmaVersion": 6,
            "ecmaFeatures": {
                "experimentalObjectRestSpread": true
            },
            "project": "./tsconfig.json"
        },
        "globals": {
            ...globals.browser,
            ...global.jQuery,
        }
    },
    "plugins": { "@typescript-eslint": tsPlugin },
    "rules": {
        ...tsPlugin.configs.recommended.rules,
        ...tsPlugin.configs['eslint-recommended'].rules,
        "no-console": "error",
        "object-curly-spacing": ["warn", "always"],
        "one-var": ["error", "never"],
        "quote-props": "warn",
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/member-ordering": "warn",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "space-before-function-paren": "off"
    },
    "ignores": [
        "build/*"
    ]
}];