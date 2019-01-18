
function transformManifestVersion(content) {
  const manifest = JSON.parse(content.toString());
  manifest.version = process.env.npm_package_version;
  return Buffer.from(JSON.stringify(manifest));
}


const copyPatterns = [
  {
    from: 'src/manifest.json',
    to: '.',
    transform: transformManifestVersion,
  },
  { from: 'img', to: 'img' },
  /* {
    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
    to: 'lib/',
  }, */
  // { from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js', to: 'lib/' },
  // {
  //  from: 'fonts/*/*',
  //  to: 'fonts/googlefonts/[name].[ext]',
  // },
  /* {
    from:
      'node_modules/material-design-icons/iconfont/*.{eot,ttf,woff,woff2,css}',
    to: 'fonts/material-icons/[name].[ext]',
    toType: 'template',
  }, */
];

module.exports = {
  copyPatterns
};