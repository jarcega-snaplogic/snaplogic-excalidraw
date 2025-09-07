import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { libraryManager, SnapLogicShapeType } from '../utils/libraryUtils';

/**
 * Library Loader Service
 * Created by Jean-Claude - because someone has to handle the heavy lifting
 * 
 * This service manages loading the SnapLogic component library and provides
 * a centralized way to access library shapes throughout the application.
 */

class LibraryLoaderService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;
  private libraryCache: Map<string, ExcalidrawElement[]> = new Map();

  /**
   * Initialize and load the SnapLogic library
   */
  async initialize(): Promise<void> {
    // Prevent multiple simultaneous loads
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (this.isLoaded) {
      console.log('📚 Library already loaded');
      return;
    }

    this.loadPromise = this.loadLibrary();
    return this.loadPromise;
  }

  /**
   * Load the library from the public directory
   */
  private async loadLibrary(): Promise<void> {
    try {
      console.log('🔄 Loading SnapLogic component library...');
      
      // Fetch the library file from public directory
      const response = await fetch('/snaplogic-library.excalidrawlib');
      
      if (!response.ok) {
        throw new Error(`Failed to load library: ${response.statusText}`);
      }

      const libraryContent = await response.text();
      
      // Load into the library manager
      await libraryManager.loadLibrary(libraryContent);
      
      this.isLoaded = true;
      console.log('✅ SnapLogic library loaded successfully');
      
      // Log available shapes for debugging
      const info = libraryManager.getLibraryInfo();
      if (info) {
        console.log(`📊 Library contains ${info.itemCount} items, ${info.snaplogicItemCount} SnapLogic components identified`);
      }
      
    } catch (error) {
      console.error('❌ Failed to load SnapLogic library:', error);
      // Don't set isLoaded to true, allowing retry
      this.loadPromise = null;
      throw error;
    }
  }

  /**
   * Get a SnapLogic shape from the library
   */
  getShape(type: SnapLogicShapeType, x: number, y: number): ExcalidrawElement[] {
    if (!this.isLoaded) {
      console.warn('⚠️ Library not loaded, returning empty array');
      return [];
    }

    // Check cache first
    const cacheKey = `${type}-${x}-${y}`;
    if (this.libraryCache.has(cacheKey)) {
      return this.libraryCache.get(cacheKey)!;
    }

    // Get from library manager
    const elements = libraryManager.cloneLibraryItem(type, x, y);
    
    // Cache for performance
    this.libraryCache.set(cacheKey, elements);
    
    return elements;
  }

  /**
   * Get a simple clean container shape (no embedded components)
   */
  getCleanContainer(type: SnapLogicShapeType, x: number, y: number): ExcalidrawElement[] {
    return this.getShape(type, x, y);
  }

  /**
   * Check if library is loaded
   */
  isLibraryLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache(): void {
    this.libraryCache.clear();
    console.log('🧹 Library cache cleared');
  }

  /**
   * Get all available shapes for UI
   */
  getAvailableShapes(): SnapLogicShapeType[] {
    if (!this.isLoaded) {
      return [];
    }
    
    return Object.values(SnapLogicShapeType);
  }
}

// Singleton instance
export const libraryLoader = new LibraryLoaderService();

// Auto-initialize on import (with error handling)
libraryLoader.initialize().catch(error => {
  console.error('Failed to auto-initialize library:', error);
  // App can still work with basic shapes as fallback
});