import {Entity, System} from 'lib/ecs';

import Position from 'game/components/Position';

export default class Animator extends System {
  components = [Position];

  update(delta: number) {
    this.entities.forEach( entity => {
      const position = entity.getComponent(Position);
      position.state.x += 10*delta;
      position.state.y += (10*delta);
    })
  }
}