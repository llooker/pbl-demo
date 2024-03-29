const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const absolutePath = path.join(__dirname, "../shared");

module.exports = {
  webpack: {
    alias: {
      react: path.resolve('../node_modules/react')
    },
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );

      webpackConfig.target = "web"

      if (isFound) {

        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(absolutePath);
        // for commonjs import/export in server_utils/auth_utils
        match.loader.options.sourceType = "unambiguous"

      }
      return webpackConfig;
    }
  }
};

