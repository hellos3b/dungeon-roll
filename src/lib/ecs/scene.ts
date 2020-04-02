import Entity, { ComponentChange } from "./entity";

import ComponentsCache from './components-cache';
import { EventEmitter } from "../events";
import System from "./system";
import shortid from 'shortid';

export default class Scene {
  /** Name of the scene. Useful for debugging */
  public name: string;

  /** A map of entities, indexed by entity ID */
  public entities: Entity[] = [];

  /** All the current systems */
  private systems: System[] = [];

  /** Event emitter */
  public events = new EventEmitter();
  
  constructor(name = "New Scene") {
    this.name = name;
    
    this.events.on(ComponentChange, event => {
      this.entityChange(event.entity);
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
    // Remove old entities
    this.entities = this.entities
      .filter( entity => {
        if (!entity.delete) return true;

        console.log("deleting, emit entity change")
        this.entityChange(entity)
        
        return false;
      })

    this.systems.forEach(system => {
      system.update(delta)
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
      
    this.entities.push(entity);
    this.entityChange(entity);

    return entity;
  }

  private entityChange(entity: Entity) {
    this.systems.forEach( sys => {
      sys.checkEntity(entity);
    })
  }

  /**
   s* Add a system to the scene, will update each time the scene is updated
   * 
   * @param system 
   */
  public addSystem(system: System) {
    system.events = this.events;
    this.systems.push(system);    
  }

  public toJSON() {
    return {
      name: this.name,
      entities: this.entities.map( i => i.toJSON() )
    }
  }
}

interface IScene {
  systems?: System[];
  entities?: Entity[];
}