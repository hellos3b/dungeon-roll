import { ComponentCreator } from "./component";
import Engine from "./engine";
import Entity from "./entity";
import { EventEmitter } from "../events";
import Family from './family';

export default abstract class System {
  public events?: EventEmitter;
  public components: ComponentCreator<any>[];
  protected entitySet = new Set<Entity>();
  
  protected get entities() {
    return Array.from(this.entitySet)
  }

  /** Lifestyle */
  public entityAdded(entity: Entity) {};
  public entityRemoved(entity: Entity) {};
  public update(delta: number) {}

  public checkEntity(entity: Entity) { 
    const match = this.doesEntityMatch(entity);
    const alreadyHas = this.entitySet.has(entity);

    if (match && !alreadyHas) {
      this.addEntity(entity);
    } else if (!match && alreadyHas) {
      this.removeEntity(entity)
    } else if (entity.delete && alreadyHas) {
      this.removeEntity(entity);
    }
  }

  private addEntity(entity: Entity) {
    this.entityAdded(entity);
    this.entitySet.add(entity)    
  }

  private removeEntity(entity: Entity) {
    this.entityRemoved(entity);
    this.entitySet.delete(entity)
  }

  private doesEntityMatch(entity: Entity) {
    return this.components.reduce( (matches, component) => entity.hasComponent(component) ? matches : false, true);
  }
}