const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const ZipWebpackPlugin = require("zip-webpack-plugin");

module.exports = (env) => {
    env = env || {};
    const PACKAGE_TARGET = env.PACKAGE_TARGET || "chrome";

    const config = {
        "mode": env.production ? "production" : "development",
        "entry": {
            "background": "./app/background.ts",
            "options": "./app/options.ts",
            "page_inject": "./app/page_inject.ts",
            "tabdelay": "./app/tabdelay.ts"
        },
        "module": {
            "rules": [
                {
                    "test": /\.tsx?$/,
                    "use": "ts-loader",
                    "exclude": /node_modules/
                }
            ]
        },
        "resolve": {
            "extensions": [".tsx", ".ts", ".js"]
        },
        "output": {
            "filename": "[name].bundle.js",
            "path": path.resolve(__dirname, "build", `packed-${PACKAGE_TARGET}`)
        },
        "devtool": "inline-source-map",
        "plugins": [
            new CleanWebpackPlugin(),
            new webpack.ProvidePlugin({
                "$": "jquery",
                "jQuery": "jquery",
                "window.jQuery": "jquery"
            }),
            new CopyWebpackPlugin({
                patterns: [{ "from": "src" }]
            }),
            new MergeJsonWebpackPlugin({
                "files": [
                    "./manifest/manifest.json",
                    `./manifest/${PACKAGE_TARGET}.json`
                ],
                "output": {
                    "fileName": "manifest.json"
                }
            }),
            new ZipWebpackPlugin({
                "path": path.resolve(__dirname, "build"),
                "filename": `faextender_${PACKAGE_TARGET}.zip`,
                "exclude": [/\.map$/]
            })
        ],
        "optimization": {
            "splitChunks": {
                "chunks": (chunk) => chunk.name !== 'background',
                "cacheGroups": {
                    "vendors": {
                        "test": /[\\/]node_modules[\\/]/,
                        "name": "vendor"
                    }
                }
            },
            "usedExports": true
        }
    };

    if (env.production) {
        // Use regular source maps instead of inline
        config.devtool = "source-map";
    }

    return config;
};
