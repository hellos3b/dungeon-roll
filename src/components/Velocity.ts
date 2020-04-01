import { createComponent } from "../lib/ecs";

type Velocity = {
  /** X Velocity */
  vx: number;
  /** Y velocity */
  vy: number;
}

export default createComponent<Velocity>("velocity", {
  vx: 0,
  vy: 0
})