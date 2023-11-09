import path from 'path';
import WebpackModifyBeforeEmittingPlugin from './src/webpack-modify-before-emitting-plugin';

module.exports = {
    mode: 'development',
    entry: './entry.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new WebpackModifyBeforeEmittingPlugin({
            enable: true,
            modifyFn: (assetSources) => {
                for (const assetName in assetSources) {
                    const content = assetSources[assetName];
                    console.log("### content", content)
                    assetSources[assetName] = content.replace('---placeholder---', '(modified in webpack plugin)');
                }
                return assetSources;
            }
        })
    ]
}
