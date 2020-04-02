import {Component} from "lib/ecs";

type Inventory = {
  /** Items currenty in inventory */
  items: Component[];
  /** Max limit of items */
  limit: number;

  readonly dice: Component[];
}

export default Component.define<Inventory>("inventory", {
  state: {
    items: [],
    limit: 12,

    get dice() {
      return this.items;
    }
  }
})