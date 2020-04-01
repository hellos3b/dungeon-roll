import Engine from '../Engine';
import Entity from '../entity';
import System from '../system';
import {createComponent} from '../component';

/** Spy on calls */
const updateWork = jest.fn();
const updateSingleWorkers = jest.fn();

/** Sample Components */
const Single = createComponent("single", {})
const Working = createComponent("working", {
  job: "",
  salary: 50000
})

/** Systems */
class WorkSystem extends System {
  family = [Working];
  update = updateWork;
}

class SingleWorkerSystem extends System {
  family = [Working, Single];
  update = updateSingleWorkers;
}

// Begin tests
describe('ECS Engine', () => { 
  /** references */
  let engine: Engine,
    jim: Entity,
    pam: Entity,
    michael: Entity;

  beforeEach(() => {
    // Create engine
    engine = new Engine();
  
    // Add system that updates Component1
    engine.addSystems([
      new WorkSystem(),
      new SingleWorkerSystem()
    ]);
    updateWork.mockReset();
  
    // Add two entities
    jim = engine.createEntity("jim", [
      Single(),
      Working({ job: "sales" })
    ])
    pam = engine.createEntity("pam", [
      Working({ job: "receptionist" })
    ])
    michael = engine.createEntity("dwight");
  })

  describe("Component", () => {
    it("merges in new properties", () => {
      const work = Working({job: "manager"})
      expect(work.state.job).toEqual("manager")
      expect(work.state.salary).toEqual(50000)
    })
  })

  describe("Entity", () => {
    it("has components", () => {
      expect(jim.componentsList).toHaveLength(2)
    })

    it("can get component by base class", () => {
      const working = jim.getComponent(Working)
      expect(working.state.job).toEqual("sales")
    })

    it("removes components by class", () => {
      jim.removeComponent(Working);
      expect(jim.componentsList).toHaveLength(1);
    })

    it("removes components by instance", () => {
      const working = jim.getComponent(Working);
      jim.removeComponent(working);
      expect(jim.componentsList).toHaveLength(1);
    })
    
    it("adds components", () => {
      pam.addComponent(Single())
      expect(pam.componentsList).toHaveLength(2);
    })

    it("serializes to JSON", () => {
      const json = pam.toJSON()
      expect(json.id).not.toBeNull();
      expect(json.components).toHaveLength(1)
    })
  })
  
  describe("System", () => {
    it("gets passed the right amount of entities", () => {
      engine.run(0);
      expect(updateWork.mock.calls[0][0]).toHaveLength(2)
    })

    it("gets the right entities when family has two components", () => {
      engine.run(0);
      expect(updateSingleWorkers.mock.calls[0][0]).toHaveLength(1);
    })
    
    it("updates entities when components are changed", () => {
      jim.removeComponent(Working)
      engine.run(0);
      expect(updateWork.mock.calls[0][0]).toHaveLength(1);
    })
  })
});