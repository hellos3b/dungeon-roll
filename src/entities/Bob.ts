import {Entity} from '../lib/ecs';
import Position from '../components/Position';
import Sprite from '../components/Sprite';
import SpriteRenderer from '../components/SpriteRenderer';
import TestSprite from '../sprites/test-sprite.jpg';

export default () => Entity.create("Bob", [

  Position({ x: 20, y: 20}),

  Sprite({
    src: TestSprite
  }),

  SpriteRenderer()
  
])