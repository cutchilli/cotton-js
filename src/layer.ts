import { Buffer } from "./buffer";
import { Entity } from "./entity";
import { BoundingBox, Point } from "./util/math";

/**
 * Contains entities that are rendered and updated
 * by the layer. Multiple layers can be contained within
 * a compositor layered on top of one another.
 */
export class Layer {
  public bounds: BoundingBox;

  private width: number;
  private height: number;

  private entities: Entity[] = [];

  private buffer: Buffer;

  /**
   * @param width The width of the Layer
   * @param height The height of the Layer
   * @param entities The initial entities to place in the Layer
   */
  public constructor(width: number, height: number, entities: Entity[] = []) {
    this.width = width;
    this.height = height;

    this.buffer = new Buffer(this.width, this.height);

    this.calculateBounds();
    this.addEntities(entities);
  }

  /**
   * Adds an entity to the layer
   * @param entity The entity to add to the layer
   */
  public addEntity(entity: Entity): void {
    this.addEntities([entity]);
  }

  /**
   * Adds entities to the layer
   * @param entities entities to add to the layer
   */
  public addEntities(entities: Entity[]): void {
    this.entities = this.entities.concat(entities);
  }

  /**
   * Removes an entity
   * @param entity The entity to remove
   */
  public removeEntity(entity: Entity): void {
    this.entities = this.entities.filter((e) => {
      return e !== entity;
    });
  }

  /**
   * This method is called to request all entities to run their calculations
   * General use will not require you to call this
   * @param deltaTime How many times a second to update
   */
  public update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  /**
   * This method is called to update the layer buffer and then paint
   * the resulting canvas onto the passed in context
   * This is called for you by the animator
   * @param context The context to paint on
   */
  public paintOn(context: CanvasRenderingContext2D): void {
    this.buffer.clear();

    for (const entity of this.entities) {
      // Only draw the entity if it is visible.
      if (BoundingBox.overlaps(this.bounds, entity.bounds)) {
        entity.paintOn(this.buffer.getContext());
      }
    }

    context.drawImage(this.buffer.getCanvas(), 0, 0);
  }

  private calculateBounds() {
    this.bounds = new BoundingBox(new Point(0, 0), new Point(this.width, this.height));
  }
}
