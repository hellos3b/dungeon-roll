export interface ComponentCreator<T> extends WithComponentName {
  (newState?: Partial<T>): Component<T>;
}

export default class Component<T = any> {
  public name: string;
  public state: T;

  constructor(name: string) {
    this.name = name;
  }


  /**
   * Define a component.
   * 
   * @param name 
   * @param initialState 
   */
  public static define<T>(name: string, initialState: T) {
    function merge(newState: Partial<T> = {}): Component<T> {
      const comp = new Component<T>(name);
      comp.state = Object.assign({}, initialState, newState)
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

interface WithComponentName {
  componentName: string;
}