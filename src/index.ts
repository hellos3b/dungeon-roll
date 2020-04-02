import 'regenerator-runtime/runtime'

import * as PIXI from 'pixi.js';

import { Engine } from './lib/ecs';
import Main from './scenes/Main';
import renderer from './core/renderer';

const engine = new Engine()

function run(prevTime: number) {
  const newTime = new Date().getTime()
  engine.run((newTime - prevTime) / 1000)

  setTimeout(() => run(newTime), 1000/60);
}

(async function() {
  // Initialize PIXI instance
  await renderer.load();
  const container = document.getElementById("game");
  container?.appendChild(renderer.app.view);
  
  const main = Main();

  engine.setScene(main)

  // start game
  run(new Date().getTime())
})()