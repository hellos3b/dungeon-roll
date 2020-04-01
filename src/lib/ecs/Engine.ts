import {Component, ComponentCreator} from "./component";
import Entity, { ComponentChange } from "./entity";

import ComponentsCache from './components-cache';
import { EventEmitter } from "./eventEmitter";
import System from "./system";
import shortid from 'shortid';

export default class Engine {
  private entities: Map<string, Entity> = new Map();
  private systems: System[] = [];
  private componentsCache = new ComponentsCache();
  private eventEmitter = new EventEmitter();

  constructor() {
    this.eventEmitter.on(ComponentChange, event => {
      this.setComponentAsDirty(event.componentName)
    })
  }

  private setComponentAsDirty = (componentName: string) => {
    this.componentsCache.dirtify(componentName)
  }

  public run(delta: number) {
    this.componentsCache.update(Array.from(this.entities.values()));

    this.systems.forEach(system => {
      const entities = this.componentsCache.getEntitiesWith(system.family);
      system.update(entities, delta)
    });
  }

  public createEntity(name: string, components: Component<{}>[] = []) {
    const entity = new Entity(shortid.generate(), name, this.eventEmitter.emit)
      .addComponents(components)
      
    this.entities.set(entity.id, entity);
    
    entity.componentsList.map(comp => {
      this.setComponentAsDirty(comp.name);
    })

    return entity;
  }

  public addSystem(system: System) {
    system.engine = this;
    this.systems.push(system);    
  }

  public addSystems(systems: System[]) {
    systems.forEach(system => this.addSystem(system));
  }
}