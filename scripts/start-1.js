process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
/* const openBrowser = require('react-dev-utils/openBrowser');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils'); */

const paths = require('../config/paths');
const webpackConfigFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const isInteractive = process.stdout.isTTY;
// const urls = prepareUrls(protocol, HOST, port);

const webpackConfig = webpackConfigFactory('development');

const compiler = Webpack(webpackConfig);
const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(3001, 'localhost', (err) => {
  if (err) {
    return console.log(err);
  }
  if (isInteractive) {
    clearConsole();
  }
  console.log(chalk.cyan('Starting the development server...\n'));
  console.log(chalk.cyan('Open in localhost:3001'));
  // openBrowser('localhost:3000');
});