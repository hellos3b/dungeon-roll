import {Engine, Entity, System, createComponent} from './lib/ecs';

import Position from './components/Position';
import Velocity from './components/Velocity';

const SomeComponent = createComponent("someComponent", {})

const engine = new Engine();

const bob = engine.createEntity("Bob", [
  Position({ x: 10, y: 5 }),
  Velocity({ vx: 14, vy: 32 })
])

class DemoSystem extends System {
  family = [Position];

  update(entities: Entity[], delta: number) {
    entities.forEach(this.updateEach)
  }

  updateEach = (entity: Entity) => {
    const pos = entity.getComponent(Position)

    console.log("Entity " + entity.name + " position: ", pos)
  }
}

engine.addSystems([
  new DemoSystem()
])

const run = (prevTime: number) => {
  const newTime = new Date().getTime()
  engine.run((newTime - prevTime) / 1000)

  setTimeout(() => run(newTime), 1000);
}

//@ts-ignore
window.ADD = () => bob.addComponents([
  SomeComponent({})
])

run(new Date().getTime())