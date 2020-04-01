import { Component, ComponentCreator } from './component';

import Entity from './entity';

/**
 * Maintains a cache of entities in an engine,
 * listens for changes and updates the dirty lists each ticks
 */
export default class ComponentsCache {
  /**
   * A map of entities by component name
   */
  private entities: Map<string, Entity[]> = new Map();

  /**
   * A map of component names marked as whether they have changed or not
   */
  private dirty = new Map<string, boolean>();

  constructor() {}

  /**
   * Update entities
   */
  public update(entities: Entity[]) {
    for (let [componentName] of this.dirty) {
      const entityList = entities
        .filter(ent => !!ent.getComponentByName(componentName))

      this.entities.set(componentName, entityList)
    }
  }

  /**
   * Mark a list of components as dirty, which will update the cache next tick
   * 
   * @param components 
   */
  public dirtify(componentName: string) {
    this.dirty.set(componentName, true);
  }

  // todo: can prob dump this off in cache a well somehow?
  public getEntitiesWith([first, ...rest]: ComponentCreator<{}>[]) {
    const entities = this.entities.get(first.componentName)

    if (!entities) return []

    return rest.reduce( (ent, component) => {
      return ent.filter(e => !!e.getComponent(component));
    }, entities)
  }
}