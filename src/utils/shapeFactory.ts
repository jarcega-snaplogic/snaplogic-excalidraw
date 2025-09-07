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
    
    if (this.useLibraryShapes) {
      try {
        const shapeType = node.type === 'JCC' 
          ? SnapLogicShapeType.JCC_NODE 
          : SnapLogicShapeType.FM_NODE;
        
        const elements = libraryLoader.getShape(shapeType, x, y);
        if (elements.length > 0) {
          return elements;
        }
      } catch (error) {
        console.error('Failed to create library node, falling back:', error);
      }
    }
    
    // Fallback to basic shapes
    return basicShapes.createNodeElement(node, x, y);
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