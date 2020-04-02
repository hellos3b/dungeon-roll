import Component from '../component';
import Engine from '../Engine';
import Entity from '../entity';
import Scene from '../scene';
import System from '../system';

/** Spy on calls */
const updateFruit = jest.fn();
const updateFruitSales = jest.fn();
const componentSetup = jest.fn();
const componentTeardown = jest.fn();

/** Sample Components */
const Fruit = Component.define("fruit")
const OnSale = Component.define("on-sale", {
  state: {
    amount: 0,
    price: 0,
    section: ""
  },
  setup() {
    this.state.section = "fresh";
    componentSetup();
  },
  teardown: componentTeardown
})


/** Systems */
class FruitSystem implements System {
  family = [Fruit];
  update = updateFruit;
}

class FruitSaleSystem implements System {
  family = [Fruit, OnSale];
  update = updateFruitSales;
}

// Begin tests
describe('ECS Engine', () => { 
  /** references */
  let engine: Engine,
    scene: Scene,
    apple: Entity,
    tomato: Entity,
    broccoli: Entity;

  beforeEach(() => {
    // Reset mock functions
    updateFruit.mockReset();
    updateFruitSales.mockReset();
    componentSetup.mockReset();
    componentTeardown.mockReset();

    // Create entities
    apple = Entity.create("apple", [
      Fruit(),
      OnSale({ price: 5 })
    ])

    tomato = Entity.create("tomato", [
      Fruit()
    ])

    broccoli = Entity.create("broccoli");

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

    it("called setup when entity was added", () => {
      expect(componentSetup).toBeCalled();
    })

    it("called teardown when entity was removed", () => {
      apple.remove();
      engine.run(0);
      expect(componentTeardown).toBeCalled();
    })

    it("called setup when component was added", () => {
      componentSetup.mockReset()
      tomato.addComponent(OnSale())
      expect(componentSetup).toBeCalled()
    })

    it("called teardown when component was removed", () => {
      componentTeardown.mockReset();
      apple.removeComponent(OnSale);
      engine.run(0);
      expect(componentTeardown).toBeCalled();
    })

    it("updates own state on setup", () => {
      const sale = apple.getComponent(OnSale)
      expect(sale.state.section).toEqual("fresh")
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
    })
  })
});