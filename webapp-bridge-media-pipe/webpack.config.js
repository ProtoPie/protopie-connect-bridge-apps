const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  console.log(`\n>> Run ${env.mode} Mode\n`);

  const entryFile = (() => {
    switch (env.mode) {
      case 'finger-pointing':
        return 'FingerPointingMode.ts';
      case 'brightness-control':
        return 'BrightnessControlMode.ts';
      default:
        console.error(`\n>> Mode Error: ${env.mode}\nRun finger-pointing\n`);
        return 'FingerPointingMode.ts';
    }
  })();

  return {
    mode: 'development',
    entry: path.join(__dirname, 'src', entryFile),
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name]_bundle.js',
    },
    module: {
      rules: [
        {
          test: /[\.js]$/,
          exclude: /node_module/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.ts$/,
          exclude: /node_module/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'connect-with-media-pipe Dev',
        template: './src/index.html',
      }),
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/@mediapipe/holistic',
            to: 'holistic',
          },
        ],
      }),
    ],
    devServer: {
      host: 'localhost',
      port: 2918,
    },
  };
};
