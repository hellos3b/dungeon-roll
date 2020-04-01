import { ComponentCreator } from "./component";
import Engine from "./Engine";
import Entity from "./entity";

export default abstract class System {
  engine: Engine;
  family: ComponentCreator<{}>[];
  
  abstract update(entities: Entity[], delta: number): void;
}