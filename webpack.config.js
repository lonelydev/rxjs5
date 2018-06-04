/**
 * This is for webpack
 * it executes this in the nodejs envireonment
 * Webpack uses this js to know the configuration
 */
module.exports = {
    /**the entry point for the application, which file should we start */
    entry: "./main",
    /*  single output into a js file */
    output: { filename: "app.js" },
    module: {
        rules: [
            { test: /.ts$/, use: "ts-loader" }
        ]
    },
    resolve: {
        extensions: ["*", ".ts", ".js"]
    },
    mode: "development"
}