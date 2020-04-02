import {Entity, System} from 'lib/ecs';

import Position from 'game/components/Position';

export default class Animator implements System {
  family = [Position];

  update(entities: Entity[], delta: number) {
    entities.forEach( entity => {
      const position = entity.getComponent(Position);
      position.state.x += 10*delta;
      position.state.y += (10*delta);
    })
  }
}