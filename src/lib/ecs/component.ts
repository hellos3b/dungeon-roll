export interface ComponentCreator<T> extends WithComponentName {
  (newState?: Partial<T>): Component<T>;
}

/**
 * Define a component.
 * 
 * @param name 
 * @param initialState 
 */
export function createComponent<T>(name: string, initialState: T) {
  function merge(newState: Partial<T> = {}): Component<T> {
    return {
      name,
      state: Object.assign({}, initialState, newState)
    }
  }

  Object.defineProperty(
    merge, 
    "componentName", 
    { get() { return name; }}
  )

  return merge as ComponentCreator<T>
}

export interface Component<T = any> {
  name: string;
  state: T;
}

interface WithComponentName {
  componentName: string;
}