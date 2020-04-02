class ComponentClass<T> {
  public name: string;
  public state: T;

  constructor(name: string) {
    this.name = name;
  }

  _setup?: (state:T)=>void;
  _teardown?: (state:T)=>void;

  setup = () => this._setup && this._setup(this.state);
  teardown = () => this._teardown && this._teardown(this.state);
}

export default class Component<T=any> extends ComponentClass<T> {
  /**
   * Define a component.
   * 
   * @param name 
   * @param props 
   */
  public static define<T={}>(name: string, props: DefineComponent<T> = {}) {
    function merge(newState: Partial<T> = {}): Component<T> {
      const comp = new Component<T>(name);
    
      comp.state = Object.assign({}, props.state, newState)
      comp._setup = props.setup;
      comp._teardown = props.teardown;

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

export interface ComponentCreator<T> extends WithComponentName {
  (newState?: Partial<T>): Component<T>;
}

interface DefineComponent<T> {
  /** Initial State of component */
  state?: T;
  /** Called when entity is added to a scene or when component is added */
  setup?(this: Component<T>):void;
  /** Called when component is removed */
  teardown?(this: Component<T>):void;

  // todo: add a `serialize()` field maybe?
}

interface WithComponentName {
  componentName: string;
}