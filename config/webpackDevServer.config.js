const paths = require('./paths');

module.exports = function () {
    return {
        compress: true,
        clientLogLevel: 'none',
        contentBase: paths.appPublic,
        watchContentBase: true,
        hot: true,
        // It is important to tell WebpackDevServer to use the same "root" path
        // as we specified in the config. In development, we always serve from /.
        publicPath: '/',
        quiet: true,
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        // Enable HTTPS if the HTTPS environment variable is set to 'true'
        https: process.env.HTTPS === 'true' ? true : false,
        host: process.env.HOST || '0.0.0.0',
    };
};
