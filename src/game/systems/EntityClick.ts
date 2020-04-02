import {Entity, System} from 'lib/ecs';

import Clickable from 'game/components/Clickable';
import { Event } from 'lib/events';
import Sprite from 'game/components/Sprite';

export class ClickEntity extends Event {
  entity: Entity;
}

export default class EntityClick extends System {
  components = [Sprite, Clickable];

  /** How short before touch up to register it has a click */
  static CLICK_TIME = 500;

  /** Track touch down/up time */
  touchStartTime = new Map<string, number>();

  entityAdded(entity: Entity) {
    console.log("clickable entity add", entity)
    const component = entity.getComponent(Sprite)
    const sprite = component.state.sprite!;
    
    sprite.interactive = true;
    sprite.on('mousedown', () => this.touchStart(entity))
    sprite.on('touchstart', () => this.touchStart(entity));

    sprite.on('mouseup', () => this.touchEnd(entity))
    sprite.on('touchend', () => this.touchEnd(entity));
  }

  entityRemoved(entity: Entity) {
    // todo: sprite.off ??
  }

  touchStart(entity: Entity) {
    this.touchStartTime.set(entity.id, Date.now())
  }

  /**
   * We only emit the event if:
   * 1. User's touch started on this element
   * 2. They lifted their finger quick enough (and aren't swiping)
   * 
   * @param entity 
   */
  touchEnd(entity: Entity) {
    const startTime = this.touchStartTime.get(entity.id)
    if (!startTime) return;

    const touchTime = Date.now() - startTime
    
    if (touchTime <= EntityClick.CLICK_TIME) {
      this.events?.emit(ClickEntity, {entity});
    }
  }
}