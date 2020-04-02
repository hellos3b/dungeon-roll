import Animator from 'game/systems/Animator';
import Bob from 'game/entities/Bob';
import EntityClick from 'game/systems/EntityClick';
import {Scene} from 'lib/ecs';
import SpriteRenderer from 'game/systems/RenderSprite';

export default () => {
  // Create scene
  return Scene.create("Main", {
    systems: [
      new SpriteRenderer(),
      new Animator(),
      new EntityClick()
    ],
    entities: [
      Bob()
    ]
  })
}