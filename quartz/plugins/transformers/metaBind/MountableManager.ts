import { FieldMountable } from "./FieldMountable";

/**
 * Manages the lifecycle of mountable components
 * Closely follows the original Meta Bind implementation
 */
export class MountableManager {
  activeMountables: Map<string, FieldMountable>;

  constructor() {
    this.activeMountables = new Map<string, FieldMountable>();
    console.debug('meta-bind-quartz | MountableManager initialized');
  }

  /**
   * Unload all mountables for a specific file
   */
  unloadFile(filePath: string): void {
    for (const mountable of this.activeMountables.values()) {
      if (mountable.getFilePath() === filePath) {
        console.debug(`meta-bind-quartz | MountableManager >> unregistered Mountable ${mountable.getUuid()}`);
        mountable.unmount();
      }
    }
  }

  /**
   * Unload all mountables
   */
  unload(): void {
    for (const mountable of this.activeMountables.values()) {
      console.debug(`meta-bind-quartz | MountableManager >> unregistered Mountable ${mountable.getUuid()}`);
      mountable.unmount();
    }
  }

  /**
   * Register a mountable component
   */
  registerMountable(mountable: FieldMountable): void {
    console.debug(`meta-bind-quartz | MountableManager >> registered Mountable ${mountable.getUuid()}`);
    this.activeMountables.set(mountable.getUuid(), mountable);
  }

  /**
   * Unregister a mountable component
   */
  unregisterMountable(mountable: FieldMountable): void {
    console.debug(`meta-bind-quartz | MountableManager >> unregistered Mountable ${mountable.getUuid()}`);
    this.activeMountables.delete(mountable.getUuid());
  }
} 