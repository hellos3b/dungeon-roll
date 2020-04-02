import 'regenerator-runtime/runtime'

import { Engine } from 'lib/ecs';
import Main from 'game/scenes/Main';
import stage from 'game/core/stage';

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
  await stage.load();
  const container = document.getElementById("game");
  container?.appendChild(stage.app.view);
  
  const main = Main();
  engine.setScene(main)

  lastTime = Date.now();
  requestAnimationFrame(run);
})();