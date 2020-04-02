import {Entity, System} from 'lib/ecs';

import Clickable from 'game/components/Clickable';
import { Event } from 'lib/events';
import Sprite from 'game/components/Sprite';

export class ClickEntity extends Event {
  entity: Entity;
}

export default class EntityClick extends System {
  components = [Sprite, Clickable];

  entityAdded(entity: Entity) {
    console.log("clickable entity add", entity)
    const component = entity.getComponent(Sprite)
    const sprite = component.state.sprite!;
    
    sprite.interactive = true;
    sprite.on('mousedown', () => this.handleClick(entity))
    sprite.on('touchstart', () => this.handleClick(entity));
  }

  entityRemoved(entity: Entity) {
    // todo: sprite.off ??
  }

  handleClick(entity: Entity) {
    this.events?.emit(ClickEntity, {entity});
  }
}