import * as PIXI from 'pixi.js';

import {Component} from "../lib/ecs";
import renderer from '../core/renderer';

type Sprite = {
  /** URL Path to sprite */
  src: string;
  sprite: PIXI.Sprite;
  clickable: boolean;
}

export default Component.define<Sprite>("sprite", {
  state: {
    src: "",
    sprite: new PIXI.Sprite(),
    clickable: false
  },
  
  setup() {
    const sprite = this.state.sprite

    if (!this.state.src) throw new Error("src must be set on state")

    sprite.texture = renderer.getTexture(this.state.src);
    renderer.addSprite(sprite)
  },

  teardown() {
    this.state.sprite?.destroy();
  }
})