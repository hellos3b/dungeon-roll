import { Engine } from './lib/ecs';

const engine = new Engine()

function run(prevTime: number) {
  const newTime = new Date().getTime()
  engine.run((newTime - prevTime) / 1000)

  setTimeout(() => run(newTime), 1000);
}

// start game
run(new Date().getTime())