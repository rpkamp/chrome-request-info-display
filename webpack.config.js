var Encore = require('@symfony/webpack-encore');

Encore
  .disableSingleRuntimeChunk()
  .enableVersioning(false)
  .configureManifestPlugin((options) => {
    options.fileName = 'webpack-manifest.json';
  })

  .setOutputPath('dist/')
  .setPublicPath('/')

  .addEntry('background', './src/background/index.ts')
  .addEntry('options', './src/options/index.ts')
  .addEntry('banner', './src/contentScripts/banner.ts')

  .copyFiles([
    {
      from: './src/icons',
      to: 'icons/[path][name].[ext]'
    },
    {
      from: './src/',
      pattern: /\.json$/,
      includeSubdirectories: false
    },
    {
      from: './src/contentScripts',
      pattern: /\.css$/,
      includeSubdirectories: false
    },
    {
      from: './src/options',
      pattern: /\.html$/,
      includeSubdirectories: false
    }
  ])

  .enableSassLoader()
  .enableTypeScriptLoader()

  .enableSourceMaps(!Encore.isProduction())
  .cleanupOutputBeforeBuild()
  .configureFilenames({
    js: '[name].js',
    css: '[name].css'
  })
;

module.exports = Encore.getWebpackConfig();
