import {Component} from '../lib/ecs';

type Position = {
  /** X Position */
  x: number;
  /** Y position */
  y: number;
}

const initialState = {
  x: 0,
  y: 0
}

export default Component.define<Position>("position", {state: initialState});