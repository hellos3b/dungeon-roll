class ComponentClass<T> {
  public name: string;
  public state: T;

  constructor(name: string) {
    this.name = name;
  }
}

export default class Component<T=any> extends ComponentClass<T> {
  /**
   * Define a component.
   * 
   * @param name 
   * @param props 
   */
  public static define<T={}, U={}>(name: string, props: DefineComponent<T> = {}) {
    function merge(newState: Partial<T> = {}): Component<T> {
      const comp = new Component<T>(name);
    
      comp.state = Object.assign({}, props.state, newState)

      return comp;
    }
  
    // Set a virtual property on the function so the creator
    // can be referenced by string
    Object.defineProperty(
      merge, 
      "componentName", 
      { get() { return name; }}
    )
  
    return merge as ComponentCreator<T>    
  }
}

export interface ComponentCreator<T={}> extends WithComponentName {
  (newState?: Partial<T>): Component<T>;
}

interface DefineComponent<T> {
  /** Initial State of component */
  state?: T;
}

interface WithComponentName {
  componentName: string;
}