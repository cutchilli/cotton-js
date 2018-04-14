import { Compositor } from './compositor';

export class Animator {
  private context: CanvasRenderingContext2D;
  private compositor: Compositor;
  private deltaTime: number;
  private lastTime: number;
  private accumulatedTime: number;

  public constructor(
    compositor: Compositor,
    context: CanvasRenderingContext2D,
    deltaTime: number = 1 / 60,
  ) {
    this.accumulatedTime = 0;
    this.lastTime = 0;
    this.deltaTime = deltaTime;

    this.compositor = compositor;
    this.context = context;

    this.update = this.update.bind(this);
    this.animate = this.animate.bind(this);
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
      this.animate(this.deltaTime);
      this.accumulatedTime -= this.deltaTime;
    }

    this.lastTime = time;

    this.enqueue();
  }

  protected animate(deltaTime: number): void {
    this.compositor.update(deltaTime);
    this.compositor.draw(this.context);
  }

  protected start(): void {
    this.enqueue();
  }
}
