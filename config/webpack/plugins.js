const { DefinePlugin, HotModuleReplacementPlugin, IgnorePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

// NOTE: Loader `include` paths are relative to this module
const paths = require('../paths');

const minifyHtml = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
};


const getPlugins = (isEnvProduction, env, shouldUseSourceMap) => {

  const optionsHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Options',
        chunks: ['options'],
        filename: 'options.html',
        template: paths.appTemplate,
      },
      isEnvProduction
        ? {
          minify: minifyHtml,
        }
        : undefined
    )
  );

  const popupHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Popup',
        chunks: ['popup'],
        filename: 'popup.html',
        template: paths.appTemplate,
      },
      isEnvProduction
        ? {
          minify: minifyHtml,
        }
        : undefined
    )
  );

  const sidebarHtmlPlugin = new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        title: 'Sidebar',
        chunks: ['sidebar'],
        filename: 'sidebar.html',
        template: paths.appTemplate,
      },
      isEnvProduction
        ? {
          minify: minifyHtml,
        }
        : undefined
    )
  );

  const interpolateHtmlPlugin = new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw);
  const moduleNotFoundPlugin = new ModuleNotFoundPlugin(paths.appPath);
  const webpackDefinePlugin = new DefinePlugin(env.stringified);
  const hotModuleReplacementPlguin = new HotModuleReplacementPlugin();
  const caseSensitivePathsPlugin = new CaseSensitivePathsPlugin();
  const watchMissingNodeModulesPlugin = new WatchMissingNodeModulesPlugin(paths.appNodeModules);
  const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    // chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  });
  const ignorePlugin = new IgnorePlugin(/^\.\/locale$/, /moment$/);
  const terserPlugin = new TerserPlugin({
    terserOptions: {
      parse: {
        ecma: 8,
      },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true,
      },
    },
    parallel: true,
    cache: true,
    sourceMap: shouldUseSourceMap,
  });
  const optimizeCSSAssetsPlugin = new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      parser: safePostCssParser,
      map: shouldUseSourceMap
        ? {
          inline: false,
          annotation: true,
        }
        : false,
    },
  });

  const moduleScopePlugin = new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]);

  return {
    optionsHtmlPlugin,
    popupHtmlPlugin,
    sidebarHtmlPlugin,
    interpolateHtmlPlugin,
    moduleNotFoundPlugin,
    webpackDefinePlugin,
    hotModuleReplacementPlguin,
    caseSensitivePathsPlugin,
    watchMissingNodeModulesPlugin,
    miniCssExtractPlugin,
    ignorePlugin,
    terserPlugin,
    optimizeCSSAssetsPlugin,
    moduleScopePlugin
  };
};

module.exports = getPlugins;


