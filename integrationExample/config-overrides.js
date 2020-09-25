const multipleEntry = require("react-app-rewire-multiple-entry")([
  {
    // Webpack extra entry
    entry: "src/index.js",
    // HTML template used in plugin HtmlWebpackPlugin
    template: "public/index.html",
    // The file to write the HTML to. You can specify a subdirectory
    outPath: "/fr",
    // Visit: http[s]://localhost:3000/entry/standard.html
  },
  {
    entry: "src/index.nl.js",
    // HTML template used in plugin HtmlWebpackPlugin
    template: "public/index-nl.html",
    // The file to write the HTML to. You can specify a subdirectory
    outPath: "/nl",
    // Visit: http[s]://localhost:3000/entry/standard.html
  },
]);

console.log("REWIRED");

module.exports = {
  webpack: function (config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  },
};
