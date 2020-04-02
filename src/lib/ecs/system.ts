import { ComponentCreator } from "./component";
import Engine from "./engine";
import Entity from "./entity";

export default abstract class System {
  public family: ComponentCreator<any>[];
  public abstract update(entities: Entity[], delta: number): void;
}