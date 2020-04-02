import * as PIXI from 'pixi.js';

import {Entity, System} from 'lib/ecs';

import { Event } from 'lib/events';
import Position from 'game/components/Position';
import Sprite from 'game/components/Sprite';
import SpriteRenderer from 'game/components/SpriteRenderer';
import renderer from 'game/core/renderer';

export class ClickEntity extends Event {
  entity: Entity;
}

export default class RenderSprite extends System {
  components = [Sprite, SpriteRenderer];

  entityAdded(entity: Entity) {
    const component = entity.getComponent(Sprite);
    const sprite = new PIXI.Sprite()

    sprite.texture = renderer.getTexture(component.state.src);
    renderer.addSprite(sprite)

    component.state.sprite = sprite;
  }

  entityRemoved(entity: Entity) {
    const component = entity.getComponent(Sprite);
    component.state.sprite?.destroy()
  }

  update() {
    this.entities.forEach(this.updateSprite)
  }

  updateSprite(entity: Entity) {
    // Check position
    const spriteComponent = entity.getComponent(Sprite);
    const sprite = spriteComponent.state.sprite
    if (!sprite) {
      throw new Error("Sprite not initialized!")
    }

    const position = entity.getComponent(Position);
    if (!!position) {
      sprite.x = position.state.x;
      sprite.y = position.state.y;
    } 
  }
}