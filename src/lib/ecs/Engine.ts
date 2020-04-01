import Scene from "./scene";

export default class Engine {
  public scene: Scene;

  constructor() {
    this.setScene(new Scene("Default Scene"));
  }

  /**
   * Sets the current scene to run.
   * @todo Add a setup and teardown?
   * 
   * @param scene 
   */
  public setScene(scene: Scene) {
    this.scene = scene;
  }

  public run(delta: number) {
    this.scene.update(delta);
  }
}