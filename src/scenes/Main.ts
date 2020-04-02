import Animator from '../systems/Animator';
import Bob from '../entities/Bob';
import {Scene} from '../lib/ecs';
import SpriteRenderer from '../systems/RenderSprite';

export default () => {
  // Create scene
  return Scene.create("Main", {
    systems: [
      new SpriteRenderer(),
      new Animator()
    ],
    entities: [
      Bob()
    ]
  })
}