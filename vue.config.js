module.exports = {
  css: {
    extract: false
  },
  outputDir: "dist/lib",

  chainWebpack: config => {
    config.externals({
      jquery: "jquery"
    });
  }
};
