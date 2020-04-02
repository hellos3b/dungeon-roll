import {Component} from "lib/ecs";

type SpriteRenderer = {
  enabled: boolean;
}

const initialState = {
  enabled: true
}

export default Component.define<SpriteRenderer>("sprite-renderer", {state: initialState})