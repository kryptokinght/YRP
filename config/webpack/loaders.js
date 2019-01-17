const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// NOTE: Loader `include` paths are relative to this module
const paths = require('../paths');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;




const getLoaders = (isEnvProduction, isEnvDevelopment, shouldUseRelativeAssetPaths, shouldUseSourceMap) => {

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const styleLoaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {},
          shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
        ),
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ],
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      styleLoaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      });
    }
    return styleLoaders;
  };

  const eslintLoader = {
    test: /\.(js|mjs|jsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),

        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    include: paths.appSrc,
  };

  const urlLoader = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  };

  const insideBabelLoader = {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
      customize: require.resolve(
        'babel-preset-react-app/webpack-overrides'
      ),

      plugins: [
        [
          require.resolve('babel-plugin-named-asset-import'),
          {
            loaderMap: {
              svg: {
                ReactComponent:
                  '@svgr/webpack?-prettier,-svgo![path]',
              },
            },
          },
        ],
      ],
      cacheCompression: isEnvProduction,
      compact: isEnvProduction,
    },
  };

  const outsideBabelLoader = {
    test: /\.(js|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: isEnvProduction,
      sourceMaps: false,
    },
  };

  const styleLoader = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    }),
    sideEffects: true,
  };

  const cssModuleLoader = {
    test: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    }),
  };

  const fileLoader = {
    loader: require.resolve('file-loader'),
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  };

  return {
    eslintLoader,
    urlLoader,
    insideBabelLoader,
    outsideBabelLoader,
    styleLoader,
    cssModuleLoader,
    fileLoader
  };
};

module.exports = getLoaders;


