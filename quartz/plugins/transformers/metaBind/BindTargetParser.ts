import { MetaBindQuartz } from "./MetaBindQuartz";
import { ParseError } from "./utils/ParseError";

/**
 * Types of storage for bind targets
 */
export enum BindTargetStorageType {
  FRONTMATTER = 'frontmatter',
  MEMORY = 'memory',
  GLOBAL_MEMORY = 'global',
  SCOPE = 'scope',
}

/**
 * Represents a path to a property
 */
export class PropPath {
  path: PropAccess[];

  constructor(path: PropAccess[]) {
    this.path = path;
  }

  /**
   * Concatenate with another prop path
   */
  concat(other: PropPath): PropPath {
    return new PropPath([...this.path, ...other.path]);
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this.path.map(p => p.toString()).join('.');
  }
}

/**
 * Represents a property access (direct or via index)
 */
export class PropAccess {
  // Type of access (0 = direct, 1 = bracket)
  type: number;
  prop: string;

  constructor(type: number, prop: string) {
    this.type = type;
    this.prop = prop;
  }

  toString(): string {
    if (this.type === 0) {
      return this.prop;
    } else {
      return `[${this.prop}]`;
    }
  }
}

/**
 * Represents a bind target declaration
 */
export interface BindTargetDeclaration {
  storageType: string;
  storagePath: string;
  storageProp: PropPath;
  listenToChildren: boolean;
}

/**
 * Simple scope for bind targets
 */
export interface BindTargetScope {
  scope: BindTargetDeclaration;
}

/**
 * Parser for bind targets
 */
export class BindTargetParser {
  private mb: MetaBindQuartz;

  constructor(mb: MetaBindQuartz) {
    this.mb = mb;
  }

  /**
   * Parse a bind target string and validate it
   */
  fromStringAndValidate(bindTargetString: string, filePath: string, scope?: BindTargetScope): BindTargetDeclaration {
    try {
      // Handle different formats
      // Basic format: property
      // With storage type: frontmatter:property
      // With file path: otherFile#property
      // Combined: frontmatter:otherFile#property

      let storageType = BindTargetStorageType.FRONTMATTER;
      let storagePath = filePath;
      let propPath = '';
      
      // Check for storage type
      if (bindTargetString.includes(':')) {
        const parts = bindTargetString.split(':');
        storageType = parts[0] as BindTargetStorageType;
        bindTargetString = parts[1];
      }
      
      // Check for file path
      if (bindTargetString.includes('#')) {
        const parts = bindTargetString.split('#');
        storagePath = this.resolveFilePath(parts[0], filePath);
        propPath = parts[1];
      } else {
        propPath = bindTargetString;
      }
      
      // Parse property path
      const propAccesses = this.parsePropertyPath(propPath);
      
      const declaration: BindTargetDeclaration = {
        storageType,
        storagePath,
        storageProp: new PropPath(propAccesses),
        listenToChildren: false,
      };
      
      if (storageType === BindTargetStorageType.SCOPE && scope) {
        return this.resolveScope(declaration, scope);
      }
      
      return declaration;
    } catch (error: any) {
      throw new ParseError('Failed to parse bind target: ' + (error.message || String(error)));
    }
  }

  /**
   * Resolve a scope reference
   */
  resolveScope(bindTarget: BindTargetDeclaration, scope: BindTargetScope): BindTargetDeclaration {
    if (!scope) {
      throw new ParseError('Failed to resolve bind target scope, no scope provided');
    }
    
    bindTarget.storageType = scope.scope.storageType;
    bindTarget.storagePath = scope.scope.storagePath;
    bindTarget.storageProp = scope.scope.storageProp.concat(bindTarget.storageProp);
    return bindTarget;
  }

  /**
   * Parse a property path into an array of PropAccess objects
   */
  private parsePropertyPath(path: string): PropAccess[] {
    const result: PropAccess[] = [];
    
    // Simple parsing for now
    // Handle dot notation (obj.prop) and bracket notation (obj['prop'])
    const parts = path.split('.');
    
    for (const part of parts) {
      if (part.match(/^\[.*\]$/)) {
        // Bracket notation
        const prop = part.substring(1, part.length - 1).replace(/['"]/g, '');
        result.push(new PropAccess(1, prop));
      } else {
        // Dot notation
        result.push(new PropAccess(0, part));
      }
    }
    
    return result;
  }

  /**
   * Resolve a file path, relative to a base path
   */
  private resolveFilePath(path: string, basePath: string): string {
    // Simple implementation
    return path;
  }
} 