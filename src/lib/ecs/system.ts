import { ComponentCreator } from "./component";
import Engine from "./engine";
import Entity from "./entity";
import { EventEmitter } from "../events";

export default abstract class System {
  public events?: EventEmitter;
  public family: ComponentCreator<any>[];
  public abstract update(entities: Entity[], delta: number): void;
}