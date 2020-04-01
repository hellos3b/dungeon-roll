import Entity, { ComponentChange } from "./entity";

import ComponentsCache from './components-cache';
import { EventEmitter } from "./eventEmitter";
import System from "./system";
import shortid from 'shortid';

export default class Scene {
  /** Name of the scene. Useful for debugging */
  public name: string;

  /** A map of entities, indexed by entity ID */
  private entities: Map<string, Entity> = new Map();

  /** All the current systems */
  private systems: System[] = [];

  /** A cache of components, used for filtering for systems */
  private componentsCache = new ComponentsCache();

  /** Event emitter */
  public events = new EventEmitter();

  constructor(name = "New Scene") {
    this.name = name;
    
    this.events.on(ComponentChange, event => {
      this.componentsCache.dirtify(event.componentName)
    })
  }

  /**
   * Shorthand way of creating a scene
   * @example
   *  const scene = Scene.create("My Scene", {
   *    systems: [
   *      new System()
   *    ]
   *  })
   * 
   * @param name 
   * @param options 
   */
  public static create(name: string, options: IScene) {
    const scene = new Scene(name);
    options.systems?.forEach(sys => scene.addSystem(sys));
    options.entities?.forEach(ent => scene.addEntity(ent));
    return scene;
  }

  /**
   * Runs update on all systems
   * 
   * @param delta Time since last update
   */
  public update(delta: number) {
    this.componentsCache.update(Array.from(this.entities.values()));

    this.systems.forEach(system => {
      const entities = this.componentsCache.getEntitiesWith(system.family);
      system.update(entities, delta)
    });
  }

  /**
   * Adds an entity to the scene. 
   * 
   * @param entity 
   */
  public addEntity(entity: Entity): Entity {
    entity.id = shortid.generate();
    entity.emit = this.events.emit;
      
    this.entities.set(entity.id, entity);
    
    entity.componentsList.map(comp => {
      this.componentsCache.dirtify(comp.name);
    })

    return entity;
  }

  /**
   s* Add a system to the scene, will update each time the scene is updated
   * 
   * @param system 
   */
  public addSystem(system: System) {
    this.systems.push(system);    
  }
}

interface IScene {
  setup?():void;
  systems?: System[];
  entities?: Entity[];
}