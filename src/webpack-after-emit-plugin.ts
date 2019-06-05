import {Compiler, compilation} from 'webpack';
import * as webpack from "webpack";

const ThisPluginName = 'WebpackAfterEmitPlugin';

type AssetSources = { [assetName: string]: string };
type CheckEmittedSourcesFn = (assetSources: AssetSources) => void

type Options = {
  enable: boolean,
  checkFn: CheckEmittedSourcesFn
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

export default class WebpackAfterEmitPlugin {
  private readonly enable: boolean;
  private readonly checkFn: CheckEmittedSourcesFn;

  constructor(options: Options) {
    this.enable = options.enable;
    this.checkFn = options.checkFn;
  }

  apply(compiler: Compiler) {
    if (!this.enable) {
      return;
    }
    compiler.hooks.afterEmit.tap(ThisPluginName, (compilation: compilation.Compilation) => {
      const assetSources = getAssetSources(compilation);
      this.checkFn(assetSources)
    });
  }

}
