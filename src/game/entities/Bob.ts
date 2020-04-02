import {Entity} from 'lib/ecs';
import Position from 'game/components/Position';
import Sprite from 'game/components/Sprite';
import SpriteRenderer from 'game/components/SpriteRenderer';
import TestSprite from 'assets/sprites/test-sprite.jpg';

export default () => Entity.create("Bob", [

  Position({ x: 20, y: 20}),

  Sprite({
    src: TestSprite
  }),

  SpriteRenderer()
  
])