var debug             = process.env.NODE_ENV !== "production";
var webpack           = require("webpack");
var failPlugin        = require('webpack-fail-plugin');
var path              = require("path");
var CompressionPlugin = require("compression-webpack-plugin");
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var CordovaPlugin     = require('webpack-cordova-plugin');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser       = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi           = path.join(phaserModule, 'build/custom/pixi.js'),
  p2             = path.join(phaserModule, 'build/custom/p2.js');

var production  = (process.env.NODE_ENV === 'production');
var development = !production;

var config = {
  context: __dirname + "/src",
  entry: './boot.ts',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.min.js'
  },

  resolve: {
    extensions: ['', '.js', '.ts', '.tsx', '.png', '.gif', '.jpeg', '.jpg', '.json'],
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2
    },
    root: [
      path.resolve('./src/'),
      path.resolve('./data/'),
      path.resolve('./assets/'),
      path.resolve('./assets/fonts'),
    ]
  },

  module: {
    loaders: [
      { test: /pixi\.js/, loader: 'expose?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
      { test: /p2\.js/, loader: 'expose?p2' },
      { test: /\.ts(x?)$/, loader: 'awesome-typescript-loader' },
      { test: /(phaser-arcade-physics|phaser-debug)\.js$/i, loader: 'script' },
			{ test: /\.json$/i, loader: "json-loader" },
      { test: /\.(jpe?g|png|gif)$/i, loader: "file?name=[path][name].[ext]?[hash]" },
			{ test: /\.(mp3|ac3|ogg|m4a)$/i, loader: "file?name=[path][name].[ext]?[hash]" },
			{ test: /\.(ttf|woff|eot)$/i, loader: "file?name=[path][name].[ext]?[hash]" },
      { test: /index\.html$/,       loader: "file-loader?name=[path][name].[ext]" },
      { test: /\.json$/,       loader: "json" },
      {
        test: /\.scss|css$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },

  plugins: [
    failPlugin
  ]
}

if (development) {
  config['devtool'] = 'eval-source-map';
  config.devServer = {
    host: '0.0.0.0'
  };
}
/*
config.devServer.contentBase = 'src/';
config.plugins.push(new CordovaPlugin({
  config: 'config.xml',  // Location of Cordova' config.xml (will be created if not found)
  src: 'src/index.html',     // Set entry-point of cordova in config.xml
  version: true,         // Set config.xml' version. (true = use version from package.json)
}));*/

config.plugins.push(new webpack.DefinePlugin({
  GAME_PRODUCTION: !development,
  LOG_FSM_STATES: false
}));

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      minimize: true,
      mangle: true,
      compressor: { warnings: false },
      sourceMap: false
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      regExp: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

module.exports = config;
