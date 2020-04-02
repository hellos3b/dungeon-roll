import * as PIXI from 'pixi.js';

import Sprites from '../../assets/sprites/*.jpg';

class Renderer {
  app = new PIXI.Application();
  loader = PIXI.Loader.shared;

  load() {    
    const loader = this.loader;
    
    return new Promise( (resolve, reject) => {
      console.log("SPrites", Sprites)
      //@ts-ignore
      for (var k in Sprites) {
        loader.add(Sprites[k])
      }

      loader.onError.add(reject)
      loader.onComplete.add(resolve)

      loader.load()
    })
  }

  addSprite(sprite: PIXI.Sprite) {
    this.app.stage.addChild(sprite);
  }
  
  getTexture(path: string) {
    return this.loader.resources[path].texture
  }
}

export default new Renderer();