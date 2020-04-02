import 'regenerator-runtime/runtime'

import { Engine } from 'lib/ecs';
import Main from 'game/scenes/Main';
import renderer from 'game/core/renderer';

const engine = new Engine()

let lastTime = 0;

const run = () => {
  const now = Date.now()
  const delta = (now - lastTime) / 1000;
  
  engine.run(delta)

  lastTime = now
  requestAnimationFrame(run)
}

(async function() {
  // Initialize PIXI instance
  await renderer.load();
  const container = document.getElementById("game");
  container?.appendChild(renderer.app.view);
  
  const main = Main();
  engine.setScene(main)

  lastTime = Date.now();
  requestAnimationFrame(run);
})();