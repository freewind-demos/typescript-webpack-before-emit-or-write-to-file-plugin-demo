import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackAfterEmitPlugin from './src/webpack-after-emit-plugin';

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
    new WebpackAfterEmitPlugin({
      enable: true,
      checkFn: (assetSources) => {
        for (const assetName in assetSources) {
          const content = assetSources[assetName];
          const abondonKeyword = 'console';
          if (content.includes(abondonKeyword)) {
            throw new Error(`should not contain '${abondonKeyword}' in content of '${assetName}'`)
          }
        }
      }
    })
  ]
}
