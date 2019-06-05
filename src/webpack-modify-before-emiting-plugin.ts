import * as webpack from 'webpack';
import {Compiler, compilation} from 'webpack';

const ThisPluginName = 'WebpackAfterEmitPlugin';

type AssetSources = { [assetName: string]: string };
type ModifyAssetSourcesFn = (assetSources: AssetSources) => AssetSources

type Options = {
  enable: boolean,
  modifyFn: ModifyAssetSourcesFn
}

function getAssetSources(compilation: webpack.compilation.Compilation): AssetSources {
  const assetSources: AssetSources = {};
  for (const assetName in compilation.assets) {
    if (compilation.assets.hasOwnProperty(assetName)) {
      assetSources[assetName] = compilation.assets[assetName].source()
    }
  }
  return assetSources;
}

function resetAssetSources(compilation: webpack.compilation.Compilation, assetSources: AssetSources): void {
  for (const assetName in assetSources) {
    compilation.assets[assetName].source = () => assetSources[assetName];
  }
}

export default class WebpackModifyBeforeEmitingPlugin {
  private readonly enable: boolean;
  private readonly modifyFn: ModifyAssetSourcesFn;

  constructor(options: Options) {
    this.enable = options.enable;
    this.modifyFn = options.modifyFn;
  }

  apply(compiler: Compiler) {
    if (!this.enable) {
      return;
    }
    compiler.hooks.emit.tap(ThisPluginName, (compilation: compilation.Compilation) => {
      const assetSources = getAssetSources(compilation);
      resetAssetSources(compilation, this.modifyFn(assetSources));
    });
  }

}
