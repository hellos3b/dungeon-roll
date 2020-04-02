import Component, {ComponentCreator} from './component';
import {EmitEvent, Event} from './eventEmitter';

export class ComponentChange extends Event {
  componentName: string;
}

class EntityClass {
  /** ID of entity, must be unique. Used for caching/mapping */
  public id: string = 'not-set';

  /** Name of entity, useful for debugging purposes */
  public name: string;

  /** Set this to true to mark entity as remove */
  public delete: boolean = false;
  
  /** Dependency injection of emit event */
  public emit: EmitEvent = () => {};

  /** A map of all components, indexed by the function signature. */
  private components = new Map<string, Component>();

  constructor(name: string = "New Entity") {
    this.name = name;
  }

  get componentsList() {
    return Array.from(this.components.values())
  }

  /**
   * Add a single component to the entity
   * 
   * @param components
   **/
  public addComponent(component: Component) {
    this.components.set(component.name, component)
    component.setup();
    this.emitChange(component.name);
  }

  /** 
   * Get a specific component from this entity 
   * 
   * @param componentName
   **/
  public getComponentByName<T>(componentName: string) {
    return this.components.get(componentName) as Component<T>;
  }

  /** 
   * Check if an entity exists 
   * 
   * @param createComponent
   **/
  public hasComponent(createComponent: ComponentCreator<any>) {
    return !!this.getComponentByName(createComponent.componentName)
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
  public removeComponent(findComponent: Component|ComponentCreator<any>) {
    let name = (typeof findComponent === 'function') ? findComponent.componentName : findComponent.name;
    const component = this.components.get(name);

    component?.teardown();
    this.components.delete(name);
    this.emitChange(name)
    
    return this;
  }

  teardown() {
    this.componentsList.forEach(component => {
      this.removeComponent(component);
    });
  }

  /**
   * Sets the entity to be removed next tick
   */
  public remove() {
    this.delete = true;
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

export default class Entity extends EntityClass {
  public static create(name: string, components: Component[]=[]) {
    const entity = new Entity(name);
    components.forEach( comp => entity.addComponent(comp));
    return entity;
  }
}