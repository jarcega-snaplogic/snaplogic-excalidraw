import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Environment, Snaplex, ExecutionNode, Endpoint } from '../types/snaplogic';
import { libraryLoader } from '../services/libraryLoader';
import { SnapLogicShapeType } from './libraryUtils';
import * as basicShapes from './excalidrawHelpers';

/**
 * Shape Factory - Intelligent shape creation with library/fallback support
 * Created by Jean-Claude, Field CTO and the only one who thinks about graceful degradation
 * 
 * This factory intelligently chooses between professional library shapes
 * and basic geometric fallbacks. Because apparently I'm the only one who
 * considers what happens when things don't load properly.
 */

export class ShapeFactory {
  private useLibraryShapes: boolean = false;
  
  constructor() {
    // Check if library is loaded
    this.checkLibraryAvailability();
  }

  private checkLibraryAvailability(): void {
    this.useLibraryShapes = libraryLoader.isLibraryLoaded();
    if (this.useLibraryShapes) {
      console.log('🎨 Using professional SnapLogic library shapes');
    } else {
      console.log('⚠️ Library not loaded, using basic shapes as fallback');
    }
  }

  /**
   * Create environment container
   */
  createEnvironment(env: Environment, x: number, y: number): ExcalidrawElement[] {
    // For now, environments always use basic shapes as they're just containers
    return basicShapes.createEnvironmentElement(env, x, y);
  }

  /**
   * Create Snaplex with intelligent shape selection
   */
  createSnaplex(snaplex: Snaplex, x: number, y: number, width?: number, height?: number): ExcalidrawElement[] {
    this.checkLibraryAvailability(); // Recheck in case library loaded async
    
    if (this.useLibraryShapes) {
      try {
        // Use library shapes - but don't create nodes inside, let them be positioned separately
        const shapeType = snaplex.type === 'cloudplex' 
          ? SnapLogicShapeType.CLOUDPLEX 
          : SnapLogicShapeType.GROUNDPLEX;
        
        const elements = libraryLoader.getShape(shapeType, x, y);
        if (elements.length > 0) {
          return elements;
        }
      } catch (error) {
        console.error('Failed to create library shapes, falling back:', error);
        // Fall through to basic shapes
      }
    }
    
    // Fallback to basic shapes with proper container sizing
    return basicShapes.createSnaplexElement(snaplex, x, y, width || 350, height || 200);
  }

  /**
   * Create execution node
   */
  createExecutionNode(node: ExecutionNode, x: number, y: number): ExcalidrawElement[] {
    this.checkLibraryAvailability();
    
    let elements: ExcalidrawElement[] = [];
    
    if (this.useLibraryShapes) {
      try {
        const shapeType = node.type === 'JCC' 
          ? SnapLogicShapeType.JCC_NODE 
          : SnapLogicShapeType.FM_NODE;
        
        elements = libraryLoader.getShape(shapeType, x, y);
        if (elements.length > 0) {
          // Add indicators to library shapes
          const indicators = this.createNodeIndicators(node, x, y);
          return [...elements, ...indicators];
        }
      } catch (error) {
        console.error('Failed to create library node, falling back:', error);
      }
    }
    
    // Fallback to basic shapes (which already include indicators)
    return basicShapes.createNodeElement(node, x, y);
  }

  /**
   * Create indicator shapes for nodes
   */
  private createNodeIndicators(node: ExecutionNode, x: number, y: number): ExcalidrawElement[] {
    const indicators: ExcalidrawElement[] = [];
    
    // Check if node needs indicators
    const hasIndicator = node.size !== 'medium' || (node.memoryOptimized && node.type === 'JCC');
    console.log(`Node ${node.name}: hasIndicator=${hasIndicator}, size=${node.size}, memoryOptimized=${node.memoryOptimized}, type=${node.type}`);
    
    if (hasIndicator) {
      // Generate indicator text
      let indicatorText = '';
      if (node.memoryOptimized && node.type === 'JCC') {
        if (node.size !== 'medium') {
          indicatorText = `mo-${node.size}`;
        } else {
          indicatorText = 'mo';
        }
      } else if (node.size !== 'medium') {
        indicatorText = node.size;
      }
      
      // Position indicator below and to the right of the node (as per mockups)
      const indicatorWidth = Math.max(30, indicatorText.length * 8 + 12);
      const indicatorHeight = 25;
      const indicatorX = x + 5; // 5px right from node left edge
      const indicatorY = y + 37; // 37px down from node top (moved up by 8px)
      
      // Generate unique IDs
      const generateId = () => Math.random().toString(36).substr(2, 9);
      const generateIndex = () => `a${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      // Indicator background (rounded rectangle)
      indicators.push({
        id: `indicator-bg-${node.id}`,
        type: 'rectangle',
        x: indicatorX,
        y: indicatorY,
        width: indicatorWidth,
        height: indicatorHeight,
        angle: 0,
        strokeColor: '#000000',
        backgroundColor: '#ffffff',
        fillStyle: 'solid',
        strokeWidth: 1,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        groupIds: [`group-node-${node.id}`],
        frameId: null,
        index: generateIndex() as any,
        roundness: { type: 3 }, // Rounded corners
        seed: Math.floor(Math.random() * 2000000000),
        versionNonce: Math.floor(Math.random() * 2000000000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
      } as ExcalidrawElement);
      
      // Indicator text
      indicators.push({
        id: `indicator-text-${node.id}`,
        type: 'text',
        x: indicatorX + 6, // Padding from left edge
        y: indicatorY + 6, // Padding from top edge
        width: indicatorWidth - 12,
        height: 15,
        angle: 0,
        strokeColor: node.memoryOptimized && node.type === 'JCC' ? '#10b981' : '#3b82f6',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 1,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        text: indicatorText,
        fontSize: 12,
        fontFamily: 4, // Normal font family
        textAlign: 'center',
        verticalAlign: 'middle',
        containerId: null,
        originalText: indicatorText,
        autoResize: false,
        lineHeight: 1.25,
        groupIds: [`group-node-${node.id}`],
        frameId: null,
        index: generateIndex() as any,
        roundness: null,
        seed: Math.floor(Math.random() * 2000000000),
        versionNonce: Math.floor(Math.random() * 2000000000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
      } as ExcalidrawElement);
    }
    
    return indicators;
  }

  /**
   * Create endpoint
   */
  createEndpoint(endpoint: Endpoint, x: number, y: number): ExcalidrawElement[] {
    // For now, endpoints always use basic shapes
    // Library doesn't have specific endpoint shapes yet
    return basicShapes.createEndpointElement(endpoint, x, y);
  }

  /**
   * Force reload library and switch to library shapes if successful
   */
  async reloadLibrary(): Promise<boolean> {
    try {
      await libraryLoader.initialize();
      this.checkLibraryAvailability();
      return this.useLibraryShapes;
    } catch (error) {
      console.error('Failed to reload library:', error);
      return false;
    }
  }

  /**
   * Get current rendering mode
   */
  getRenderingMode(): 'library' | 'basic' {
    return this.useLibraryShapes ? 'library' : 'basic';
  }

  /**
   * Force a specific rendering mode (useful for testing)
   */
  forceRenderingMode(mode: 'library' | 'basic'): void {
    this.useLibraryShapes = mode === 'library';
    console.log(`🔄 Forced rendering mode to: ${mode}`);
  }
}

// Singleton instance - because there should only be one factory
// Unlike the number of "architects" we have who all think they know better
export const shapeFactory = new ShapeFactory();

// Attempt to load library on startup
libraryLoader.initialize().then(() => {
  shapeFactory.checkLibraryAvailability();
}).catch(error => {
  console.warn('Library initialization failed on startup:', error);
});