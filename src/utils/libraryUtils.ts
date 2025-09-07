import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

// Library shape categories for SnapLogic components
export enum SnapLogicShapeType {
  GROUNDPLEX = 'groundplex',
  CLOUDPLEX = 'cloudplex',
  JCC_NODE = 'jcc_node',
  FM_NODE = 'fm_node',
  API_GATEWAY = 'api_gateway',
  LOAD_BALANCER = 'load_balancer',
  ULTRA_PIPELINE = 'ultra_pipeline',
  ENDPOINT = 'endpoint',
  ZONE = 'zone'
}

// Library item structure matching Excalidraw format
export interface LibraryItem {
  id: string;
  created: number;
  name?: string;
  elements: ExcalidrawElement[];
  type?: SnapLogicShapeType;
  description?: string;
}

export interface ExcalidrawLibrary {
  type: 'excalidrawlib';
  version: number;
  libraryItems: LibraryItem[];
}

// SnapLogic component templates - these would be loaded from the .excalidrawlib file
const SNAPLOGIC_TEMPLATES: Record<SnapLogicShapeType, Partial<LibraryItem>> = {
  [SnapLogicShapeType.GROUNDPLEX]: {
    name: 'Groundplex',
    type: SnapLogicShapeType.GROUNDPLEX,
    description: 'On-premises SnapLogic execution environment'
  },
  [SnapLogicShapeType.CLOUDPLEX]: {
    name: 'Cloudplex',
    type: SnapLogicShapeType.CLOUDPLEX,
    description: 'Cloud-based SnapLogic execution environment'
  },
  [SnapLogicShapeType.JCC_NODE]: {
    name: 'JCC Node',
    type: SnapLogicShapeType.JCC_NODE,
    description: 'Job Control Center - manages pipeline execution'
  },
  [SnapLogicShapeType.FM_NODE]: {
    name: 'FeedMaster Node',
    type: SnapLogicShapeType.FM_NODE,
    description: 'FeedMaster - optimized for Ultra pipelines'
  },
  [SnapLogicShapeType.API_GATEWAY]: {
    name: 'API Gateway',
    type: SnapLogicShapeType.API_GATEWAY,
    description: 'API Gateway for external service exposure'
  },
  [SnapLogicShapeType.LOAD_BALANCER]: {
    name: 'Load Balancer',
    type: SnapLogicShapeType.LOAD_BALANCER,
    description: 'Load balancer for high-availability deployments'
  },
  [SnapLogicShapeType.ULTRA_PIPELINE]: {
    name: 'Ultra Pipeline',
    type: SnapLogicShapeType.ULTRA_PIPELINE,
    description: 'Ultra pipeline for high-throughput streaming'
  },
  [SnapLogicShapeType.ENDPOINT]: {
    name: 'Endpoint',
    type: SnapLogicShapeType.ENDPOINT,
    description: 'External system endpoint'
  },
  [SnapLogicShapeType.ZONE]: {
    name: 'Zone',
    type: SnapLogicShapeType.ZONE,
    description: 'Logical grouping zone'
  }
};

// Library utility functions
export class LibraryManager {
  private library: ExcalidrawLibrary | null = null;
  private libraryItems: Map<SnapLogicShapeType, LibraryItem> = new Map();

  /**
   * Load library from .excalidrawlib file content
   */
  async loadLibrary(libraryContent: string): Promise<void> {
    try {
      const parsedLibrary: ExcalidrawLibrary = JSON.parse(libraryContent);
      
      if (parsedLibrary.type !== 'excalidrawlib') {
        throw new Error('Invalid library format');
      }

      this.library = parsedLibrary;
      this.indexLibraryItems();
      
      console.log(`📚 Loaded SnapLogic library with ${parsedLibrary.libraryItems.length} items`);
    } catch (error) {
      console.error('❌ Failed to load library:', error);
      throw error;
    }
  }

  /**
   * Index library items by SnapLogic component type based on name matching
   */
  private indexLibraryItems(): void {
    if (!this.library) return;

    this.libraryItems.clear();

    this.library.libraryItems.forEach(item => {
      const itemName = item.name?.toLowerCase() || '';
      
      // Match library items to SnapLogic types based on name patterns
      let shapeType: SnapLogicShapeType | null = null;
      
      // Exact name matches first (most reliable)
      if (itemName === 'groundplex' || itemName.startsWith('groundplex')) {
        shapeType = SnapLogicShapeType.GROUNDPLEX;
      } else if (itemName === 'cloudplex' || itemName.startsWith('cloudplex')) {
        shapeType = SnapLogicShapeType.CLOUDPLEX;
      } else if (itemName === 'jcc node' || itemName.startsWith('jcc')) {
        shapeType = SnapLogicShapeType.JCC_NODE;
      } else if (itemName === 'feedmaster node' || itemName.includes('feedmaster')) {
        shapeType = SnapLogicShapeType.FM_NODE;
      } else if (itemName === 'api gateway' || itemName.includes('api gateway')) {
        shapeType = SnapLogicShapeType.API_GATEWAY;
      } else if (itemName === 'load balancer' || itemName.startsWith('load balancer')) {
        shapeType = SnapLogicShapeType.LOAD_BALANCER;
      } else if (itemName === 'ultra pipeline' || itemName.includes('ultra pipeline')) {
        shapeType = SnapLogicShapeType.ULTRA_PIPELINE;
      }
      
      // Generic endpoint/node matching for basic components
      else if (itemName.includes('endpoint')) {
        shapeType = SnapLogicShapeType.ENDPOINT;
      } else if (itemName.includes('node') && !shapeType) {
        // Use as generic JCC node if no other match
        shapeType = SnapLogicShapeType.JCC_NODE;
      }

      if (shapeType) {
        // Only use the first match of each type (avoid duplicates)
        if (!this.libraryItems.has(shapeType)) {
          this.libraryItems.set(shapeType, {
            ...item,
            type: shapeType,
            description: SNAPLOGIC_TEMPLATES[shapeType].description
          });
          console.log(`✅ Matched "${item.name}" -> ${shapeType}`);
        }
      } else {
        console.log(`⚠️ No match found for: "${item.name}"`);
      }
    });

    console.log(`🔍 Indexed ${this.libraryItems.size} SnapLogic components`);
  }

  /**
   * Get a specific SnapLogic shape template
   */
  getShape(type: SnapLogicShapeType): LibraryItem | null {
    return this.libraryItems.get(type) || null;
  }

  /**
   * Get all available SnapLogic shapes
   */
  getAllShapes(): LibraryItem[] {
    return Array.from(this.libraryItems.values());
  }

  /**
   * Check if library is loaded
   */
  isLoaded(): boolean {
    return this.library !== null;
  }

  /**
   * Get library metadata
   */
  getLibraryInfo(): { version: number; itemCount: number; snaplogicItemCount: number } | null {
    if (!this.library) return null;

    return {
      version: this.library.version,
      itemCount: this.library.libraryItems.length,
      snaplogicItemCount: this.libraryItems.size
    };
  }

  /**
   * Clone elements from a library item with new positions
   */
  cloneLibraryItem(type: SnapLogicShapeType, x: number, y: number): ExcalidrawElement[] {
    const libraryItem = this.getShape(type);
    if (!libraryItem) {
      console.warn(`⚠️  No library item found for type: ${type}`);
      return [];
    }

    // Calculate the bounding box of the original library item
    const elements = libraryItem.elements;
    if (elements.length === 0) return [];
    
    const minX = Math.min(...elements.map(e => e.x || 0));
    const minY = Math.min(...elements.map(e => e.y || 0));
    
    console.log(`🔧 Repositioning ${type} from library offset (${minX}, ${minY}) to target (${x}, ${y})`);

    // Clone the elements and reposition them relative to the target position
    return elements.map(element => ({
      ...element,
      id: this.generateId(), // Generate new ID for each cloned element
      x: x + (element.x || 0) - minX,  // Normalize to target position
      y: y + (element.y || 0) - minY,  // Normalize to target position
      seed: Math.floor(Math.random() * 2000000000),
      versionNonce: Math.floor(Math.random() * 2000000000),
      updated: Date.now(),
      isDeleted: false
    }));
  }

  /**
   * Generate unique element ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Global library manager instance
export const libraryManager = new LibraryManager();

// Utility functions for loading library from file
export async function loadLibraryFromFile(file: File): Promise<void> {
  const content = await file.text();
  return libraryManager.loadLibrary(content);
}

export async function loadLibraryFromUrl(url: string): Promise<void> {
  const response = await fetch(url);
  const content = await response.text();
  return libraryManager.loadLibrary(content);
}

// Helper function to get shape bounds for positioning
export function getShapeBounds(elements: ExcalidrawElement[]): { width: number; height: number; minX: number; minY: number } {
  if (elements.length === 0) {
    return { width: 100, height: 50, minX: 0, minY: 0 };
  }

  const xs = elements.map(el => el.x);
  const ys = elements.map(el => el.y);
  const widths = elements.map(el => (el.x || 0) + (el.width || 0));
  const heights = elements.map(el => (el.y || 0) + (el.height || 0));

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...widths);
  const maxY = Math.max(...heights);

  return {
    width: maxX - minX,
    height: maxY - minY,
    minX,
    minY
  };
}