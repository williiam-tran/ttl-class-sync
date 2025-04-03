import { FieldMountable } from "./FieldMountable";

/**
 * Manages the lifecycle of mountable components
 * Closely follows the original Meta Bind implementation
 */
export class MountableManager {
  activeMountables: Map<string, FieldMountable>;

  constructor() {
    this.activeMountables = new Map<string, FieldMountable>();
  }

  /**
   * Unload all mountables for a specific file
   */
  unloadFile(filePath: string): void {
    for (const mountable of this.activeMountables.values()) {
      if (mountable.getFilePath() === filePath) {
        mountable.unmount();
      }
    }
  }

  /**
   * Unload all mountables
   */
  unload(): void {
    for (const mountable of this.activeMountables.values()) {
      mountable.unmount();
    }
  }

  /**
   * Register a mountable component
   */
  registerMountable(mountable: FieldMountable): void {
    this.activeMountables.set(mountable.getUuid(), mountable);
  }

  /**
   * Unregister a mountable component
   */
  unregisterMountable(mountable: FieldMountable): void {
    this.activeMountables.delete(mountable.getUuid());
  }
} 