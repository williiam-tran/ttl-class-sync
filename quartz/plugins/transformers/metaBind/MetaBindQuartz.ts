import { BindTargetDeclaration, BindTargetParser, BindTargetStorageType, PropAccess, PropPath } from "./BindTargetParser";
import { createMathJS } from "./MathJS";
import { MountableManager } from "./MountableManager";
import { getUUID } from "./utils/utils";

/**
 * Settings for the Meta Bind plugin
 */
export interface MetaBindSettings {
  preferredDateFormat: string;
  firstWeekday: number;
  syncInterval: number;
  enableJs: boolean;
  inputFieldTemplates: any[];
  buttonTemplates: any[];
}

/**
 * Default settings
 */
const DEFAULT_SETTINGS: MetaBindSettings = {
  preferredDateFormat: "YYYY-MM-DD",
  firstWeekday: 1, // Monday
  syncInterval: 50,
  enableJs: true,
  inputFieldTemplates: [],
  buttonTemplates: []
};

/**
 * Metadata manager for handling frontmatter data
 */
export class MetadataManager {
  private sources: Map<string, any>;
  public defaultSource = BindTargetStorageType.FRONTMATTER;

  constructor() {
    this.sources = new Map();
  }

  /**
   * Register a metadata source
   */
  registerSource(source: any): void {
    this.sources.set(source.id, source);
  }

  /**
   * Get a metadata source by id
   */
  getSource(id: string): any {
    return this.sources.get(id);
  }

  /**
   * Get all sources
   */
  iterateSources(): string[] {
    return Array.from(this.sources.keys());
  }

  /**
   * Read a value from the metadata
   */
  read(bindTarget: BindTargetDeclaration): any {
    // Simple implementation for now
    // In a real implementation, this would delegate to the appropriate source
    const frontmatter = window._quartzMetaBindCache?.frontmatter || {};
    const file = frontmatter[bindTarget.storagePath] || {};
    
    let value = file;
    for (const access of bindTarget.storageProp.path) {
      if (value === undefined || value === null) return undefined;
      value = value[access.prop];
    }
    
    return value;
  }

  /**
   * Write a value to the metadata
   */
  write(value: any, bindTarget: BindTargetDeclaration): void {
    // Simple implementation that just updates the cache
    // In a real implementation, this would delegate to the appropriate source
    if (!window._quartzMetaBindCache) {
      window._quartzMetaBindCache = { frontmatter: {} };
    }
    
    if (!window._quartzMetaBindCache.frontmatter[bindTarget.storagePath]) {
      window._quartzMetaBindCache.frontmatter[bindTarget.storagePath] = {};
    }
    
    let target = window._quartzMetaBindCache.frontmatter[bindTarget.storagePath];
    const path = bindTarget.storageProp.path;
    
    // Navigate to the parent object
    for (let i = 0; i < path.length - 1; i++) {
      const prop = path[i].prop;
      if (!target[prop]) {
        target[prop] = {};
      }
      target = target[prop];
    }
    
    // Set the value
    if (path.length > 0) {
      target[path[path.length - 1].prop] = value;
    }
    
    // Notify subscribers if we had them
    console.debug('meta-bind-quartz | MetadataManager >> wrote value', value, 'to', bindTarget);
  }

  /**
   * Run periodic operations
   */
  cycle(): void {
    // No-op for now
  }
}

/**
 * Main MetaBindQuartz class
 */
export class MetaBindQuartz {
  settings: MetaBindSettings;
  metadataManager: MetadataManager;
  mountableManager: MountableManager;
  bindTargetParser: BindTargetParser;
  math: any;

  constructor(settings?: Partial<MetaBindSettings>) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings };
    
    this.metadataManager = new MetadataManager();
    this.mountableManager = new MountableManager();
    this.bindTargetParser = new BindTargetParser(this);
    this.math = createMathJS();

    // Set up data structure for cache
    if (typeof window !== 'undefined') {
      window._quartzMetaBindCache = { frontmatter: {} };
    }

    console.debug('meta-bind-quartz | initialized');
  }
  
  /**
   * Create a bind target from string parts
   */
  createBindTarget(
    storageType: string, 
    storagePath: string, 
    property: string[], 
    listenToChildren: boolean = false
  ): BindTargetDeclaration {
    // Convert the property path to PropAccess objects
    const propAccesses = property.map(prop => new PropAccess(0, prop));
    
    return {
      storageType,
      storagePath,
      storageProp: new PropPath(propAccesses),
      listenToChildren
    };
  }

  /**
   * Parse a bind target string
   */
  parseBindTarget(declarationString: string, filePath: string): BindTargetDeclaration {
    return this.bindTargetParser.fromStringAndValidate(declarationString, filePath);
  }

  /**
   * Set metadata value
   */
  setMetadata(bindTarget: BindTargetDeclaration, value: unknown): void {
    this.metadataManager.write(value, bindTarget);
  }

  /**
   * Get metadata value
   */
  getMetadata(bindTarget: BindTargetDeclaration): unknown {
    return this.metadataManager.read(bindTarget);
  }

  /**
   * Generate a UUID for components
   */
  generateUUID(): string {
    return getUUID();
  }
}

// Add type definition for global cache
declare global {
  interface Window {
    _quartzMetaBindCache?: {
      frontmatter: Record<string, any>;
    };
  }
} 