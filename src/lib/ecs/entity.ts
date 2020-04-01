import { Component, ComponentCreator } from './component';
import {EmitEvent, Event} from './eventEmitter';

import clone from 'clone';

export class ComponentChange extends Event {
  componentName: string;
}

export default class Entity {
  public id: string;
  public name: string;
  private emit: EmitEvent;

  /** A map of all components, indexed by the function signature. */
  private components = new Map<string, Component>();

  constructor(id: string, name: string = "New Entity", emit: EmitEvent = ()=>{}) {
    this.id = id;
    this.name = name;
    this.emit = emit;
  }

  get componentsList() {
    return Array.from(this.components.values())
  }

  /**
   * Add a list of components to the entity 
   * 
   * @param components
   **/
  addComponents(components: Component[]) {
    components.forEach( component => {
      this.addComponent(component)
    });

    return this;
  }

  /**
   * Add a single component to the entity
   * 
   * @param components
   **/
  addComponent(component: Component) {
    this.components.set(component.name, clone(component))
    this.emitChange(component.name);
  }

  /** 
   * Get a specific component from this entity 
   * 
   * @param createComponent
   **/
  getComponentByName<T>(componentName: string) {
    return this.components.get(componentName) as Component<T>;
  }

  /** 
   * Get a specific component from this entity 
   * 
   * @param createComponent
   **/
  getComponent<T>(createComponent: ComponentCreator<T>) {
    return this.getComponentByName<T>(createComponent.componentName);
  }
  
  /** 
   * Remove a specific component from this entity 
   * 
   * @param component 
   **/
  removeComponent(component: Component|ComponentCreator<any>) {
    let name = (typeof component === 'function') ? component.componentName : component.name;
    this.components.delete(name);
    this.emitChange(name)
    return this;
  }

  /**
   * Sends out an event that a component was added or removed
   * 
   * @param components
   */
  emitChange(componentName: string) {
    this.emit(ComponentChange, {componentName})
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      components: [...this.components.values()]
    }
  }
}