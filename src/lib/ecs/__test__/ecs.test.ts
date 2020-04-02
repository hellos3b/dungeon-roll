import Component from '../component';
import Engine from '../engine';
import Entity from '../entity';
import Scene from '../scene';
import System from '../system';

/** System.update() is called */
const updateFruit = jest.fn();

/** System.update() is called */
const updateFruitSales = jest.fn();

const saleComponentAdded = jest.fn();
const saleComponentRemoved = jest.fn();

/** Sample Components */
const Fruit = Component.define("fruit")
const OnSale = Component.define("on-sale", {
  state: {
    amount: 0,
    price: 0,
    section: ""
  }
})


/** Systems */
class FruitSystem extends System {
  components = [Fruit];
  update() {
    updateFruit(this.entities)
  }
}

class FruitSaleSystem extends System {
  components = [Fruit, OnSale];
  entityAdded(entity: Entity) {
    saleComponentAdded(entity);
  }
  update() {
    updateFruitSales(this.entities)
  }
  entityRemoved(entity: Entity) {
    console.log("ENTITY REMOOOOOVED")
    saleComponentRemoved(entity);
  }
}

beforeEach(() => {
  // Reset mock functions
  updateFruit.mockReset();
  updateFruitSales.mockReset();
  saleComponentAdded.mockReset();
  saleComponentRemoved.mockReset();
})

// Begin tests
describe('ECS Engine', () => { 
  /** references */
  let engine: Engine,
    scene: Scene,
    apple: Entity,
    tomato: Entity,
    broccoli: Entity,
    orange: Entity;

  beforeEach(() => {
    // Create entities
    apple = Entity.create("apple", [
      Fruit(),
      OnSale({ price: 5 })
    ])
    
    tomato = Entity.create("tomato", [
      Fruit()
    ])

    broccoli = Entity.create("broccoli");
    orange = Entity.create("orange", [
      Fruit(),
      OnSale()
    ]);

    // Create scene
    scene = Scene.create("Grocery Store", {
      systems: [
        new FruitSystem(),
        new FruitSaleSystem()
      ],
      entities: [
        apple, tomato, broccoli
      ]
    })
  
    // Begin engine
    engine = new Engine();
    engine.setScene(scene);
  })

  /** Tests ! */
  describe("Component", () => {
    it("can be referenced by name in instance or creator", () => {
      const fruit = Fruit();
      expect(Fruit.componentName).toEqual(fruit.name)
    })
    
    it("merges in new properties", () => {
      const sale = OnSale({amount: 12})
      expect(sale.state.amount).toEqual(12)
      expect(sale.state.price).toEqual(0)
    })
  })

  describe("Entity", () => {
    it("has components", () => {
      expect(apple.hasComponent(Fruit)).toBeTruthy()
      expect(apple.hasComponent(OnSale)).toBeTruthy()
    })

    it("returns component", () => {
      const onSale = apple.getComponent(OnSale)
      const notOnSale = tomato.getComponent(OnSale)
      expect(onSale).toBeTruthy();
      expect(notOnSale).toBeFalsy();
    })

    it("removes components by class", () => {
      apple.removeComponent(OnSale);
      expect(apple.getComponent(OnSale)).toBeFalsy();
    })

    it("removes components by instance", () => {
      const sale = apple.getComponent(OnSale);
      apple.removeComponent(sale);
      expect(apple.getComponent(OnSale)).toBeFalsy();
    })
    
    it("adds components", () => {
      tomato.addComponent(OnSale())
      expect(tomato.getComponent(OnSale)).toBeTruthy();
    })

    it("serializes to JSON", () => {
      const json = apple.toJSON()
      expect(json.id).toBeTruthy();
      expect(json.components).toHaveLength(2)
    })
  })
  
  describe("Scene", () => {
    it("serializes", () => {
      const json = scene.toJSON();
      expect(json.name).toEqual("Grocery Store");
      expect(json.entities).toHaveLength(3);
    })

    it("removes entities", () => {
      broccoli.remove()
      engine.run(0) 
      expect(scene.entities).not.toContain(broccoli)
    })

    describe("System", () => {
      // Shorthand to get first argument from update() call
      const expectEntitiesFrom = (fn: jest.Mock) => expect(fn.mock.calls[0][0])

      it("passes the right amount of entities", () => {
        engine.run(0);
        expectEntitiesFrom(updateFruit).toHaveLength(2)
      })
  
      it("passes the right entities when family has two components", () => {
        engine.run(0);
        expectEntitiesFrom(updateFruitSales).toHaveLength(1);
      })
      
      it("updates entities when components are changed", () => {
        tomato.removeComponent(Fruit)
        engine.run(0);
        expectEntitiesFrom(updateFruit).toHaveLength(1);
      })
  
      it("updates entities when entities are removed", () => {
        tomato.remove();
        engine.run(0)
        expectEntitiesFrom(updateFruit).toHaveLength(1);
      })

      it("calls componentAdded event when entity gets a component", () => {
        saleComponentAdded.mockReset();
        tomato.addComponent(OnSale())
        expect(saleComponentAdded).toBeCalled()
      })

      it("calls componentAdded event when entity is added", () => {
        saleComponentAdded.mockReset();
        scene.addEntity(orange);
        expect(saleComponentAdded).toBeCalled()
      })

      it("calls componentRemoved event when entity removes component", () => {
        saleComponentRemoved.mockReset();
        console.log("remove component", OnSale)
        apple.removeComponent(OnSale)
        expect(saleComponentRemoved).toBeCalled()
      })

      it("calls componentRemoved event when entity is removed", () => {
        saleComponentRemoved.mockReset();
        apple.remove()
        engine.run(0)
        expect(saleComponentRemoved).toBeCalled()
      })

      // todo: it DOESNT call if entity already exists?
    })
  })
});