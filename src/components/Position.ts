import {Component} from '../lib/ecs';

type Position = {
  /** X Position */
  x: number;
  /** Y position */
  y: number;
}

export default Component.define<Position>("position", {
  x: 0, 
  y: 0
});