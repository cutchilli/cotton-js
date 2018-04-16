import { Compositor } from './compositor';

export class Animator {
  private compositor: Compositor;
  private deltaTime: number;
  private lastTime: number;
  private accumulatedTime: number;

  public constructor(compositor: Compositor, deltaTime: number = 1 / 60) {
    this.accumulatedTime = 0;
    this.lastTime = 0;
    this.deltaTime = deltaTime;

    this.compositor = compositor;

    this.update = this.update.bind(this);
  }

  protected enqueue(): void {
    window.requestAnimationFrame(this.update);
  }

  protected update(time: number): void {
    this.accumulatedTime += (time - this.lastTime) / 1000;

    if (this.accumulatedTime > 1) {
      this.accumulatedTime = 1;
    }

    while (this.accumulatedTime > this.deltaTime) {
      this.compositor.update(this.deltaTime);
      this.accumulatedTime -= this.deltaTime;
    }

    this.compositor.draw();
    this.lastTime = time;

    this.enqueue();
  }

  protected start(): void {
    this.enqueue();
  }
}
