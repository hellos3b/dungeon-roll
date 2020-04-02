import * as PIXI from 'pixi.js';

import {Component} from "lib/ecs";

type Sprite = {
  /** URL Path to sprite */
  src: string;
  sprite?: PIXI.Sprite;
  interactive: boolean;
}

export type SpriteComponent = Component<Sprite>

export default Component.define<Sprite>("sprite", {
  state: {
    src: "",
    interactive: false
  }
})