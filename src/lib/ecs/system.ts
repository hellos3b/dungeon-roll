import { ComponentCreator } from "./component";
import Engine from "./Engine";
import Entity from "./entity";

export default abstract class System {
  public name: string;
  public family: ComponentCreator<{}>[];
  
  public abstract update(entities: Entity[], delta: number): void;
}