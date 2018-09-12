'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction,

    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
    // the "scss" and "sass" values for the lang attribute to the right configs here.
    // other preprocessors should work out of the box, no loader config like this necessary.
    'scss': 'vue-style-loader!css-loader!sass-loader',
    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',

  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
