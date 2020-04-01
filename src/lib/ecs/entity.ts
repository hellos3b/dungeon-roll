import Component, {ComponentCreator} from './component';
import {EmitEvent, Event} from './eventEmitter';

import clone from 'clone';

export class ComponentChange extends Event {
  componentName: string;
}

export default class Entity {
  public id: string = 'not-set';
  public name: string;
  public emit: EmitEvent = () => {};

  /** A map of all components, indexed by the function signature. */
  private components = new Map<string, Component>();

  constructor(name: string = "New Entity") {
    this.name = name;
  }

  get componentsList() {
    return Array.from(this.components.values())
  }

  public static create(name: string, components: Component[]=[]) {
    const entity = new Entity(name);
    components.forEach( comp => entity.addComponent(comp));
    return entity;
  }

  /**
   * Add a single component to the entity
   * 
   * @param components
   **/
  public addComponent(component: Component) {
    this.components.set(component.name, clone(component))
    this.emitChange(component.name);
  }

  /** 
   * Get a specific component from this entity 
   * 
   * @param createComponent
   **/
  public getComponentByName<T>(componentName: string) {
    return this.components.get(componentName) as Component<T>;
  }

  /** 
   * Get a specific component from this entity 
   * 
   * @param createComponent
   **/
  public getComponent<T>(createComponent: ComponentCreator<T>) {
    return this.getComponentByName<T>(createComponent.componentName);
  }
  
  /** 
   * Remove a specific component from this entity 
   * 
   * @param component 
   **/
  public removeComponent(component: Component|ComponentCreator<any>) {
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
  public emitChange(componentName: string) {
    this.emit(ComponentChange, {componentName})
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      components: [...this.components.values()]
    }
  }
}