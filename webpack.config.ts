import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackModifyBeforeEmittingPlugin from './src/webpack-modify-before-emiting-plugin';

module.exports = {
  mode: 'development',
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new WebpackModifyBeforeEmittingPlugin({
      enable: true,
      modifyFn: (assetSources) => {
        for (const assetName in assetSources) {
          const content = assetSources[assetName];
          assetSources[assetName] = content.replace('---placeholder---', '(modified in webpack plugin)');
        }
        return assetSources;
      }
    })
  ]
}
