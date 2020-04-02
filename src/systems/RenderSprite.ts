import {Entity, System} from '../lib/ecs';

import Position from '../components/Position';
import Sprite from '../components/Sprite';
import SpriteRenderer from '../components/SpriteRenderer';

export default class RenderSprite implements System {
  family = [Sprite, SpriteRenderer];

  update(entities: Entity[]) {
    for (var i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const spriteComponent = entity.getComponent(Sprite);
      const sprite = spriteComponent.state.sprite;

      // Check position
      const position = entity.getComponent(Position);
      if (!!position) {
        sprite.x = position.state.x;
        sprite.y = position.state.y;
      } 
    }
  }
}