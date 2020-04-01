import {Component} from "../lib/ecs";

type Sprite = {
  src: string;
}

export default Component.define<Sprite>("sprite", {
  src: ""
})