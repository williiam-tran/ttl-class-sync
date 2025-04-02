import { Mountable } from "./Mountable";

/**
 * Base class for field mountable components
 */
export abstract class FieldMountable extends Mountable {
  private readonly uuid: string;
  private readonly filePath: string;

  constructor(uuid: string, filePath: string) {
    super();
    this.uuid = uuid;
    this.filePath = filePath;
  }

  /**
   * Get the UUID of this field mountable
   */
  public getUuid(): string {
    return this.uuid;
  }

  /**
   * Get the file path this field mountable is associated with
   */
  public getFilePath(): string {
    return this.filePath;
  }
} 