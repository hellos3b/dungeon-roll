import {Entity, System} from '../lib/ecs';

import Position from '../components/Position';
import Sprite from '../components/Renderer';

export default class SpriteRenderer extends System {
  family = [Sprite, Position];

  sprites = new Map<string, any>();
  
  update(entities: Entity[]) {
    const rendered = new Set(this.sprites.keys());

    // Update all existing sprites
    entities.forEach( entity => {
      this.updateSprite(entity);
      rendered.delete(entity.id)
    })

    // If any left over in rendered list, clean up and remove
    rendered.forEach( r => {
      // Clean up
    })
  }

  updateSprite(entity: Entity) {

  }
}