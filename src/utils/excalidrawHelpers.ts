import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Environment, Snaplex, ExecutionNode, Endpoint, Connection } from '../types/snaplogic';

// Color scheme for different component types
const COLORS = {
  production: '#dc2626',
  staging: '#f59e0b',
  development: '#3b82f6',
  sandbox: '#8b5cf6',
  cloudplex: '#10b981',
  groundplex: '#6366f1',
  node: '#64748b',
  endpoint: {
    rest: '#3b82f6',
    database: '#f59e0b',
    file: '#8b5cf6',
    kafka: '#dc2626',
    sqs: '#f97316',
    mqtt: '#14b8a6'
  },
  zone: {
    geographical: '#fef3c7',
    technical: '#dbeafe',
    security: '#fee2e2'
  }
};

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate proper fractional index for Excalidraw
// Using fractional indexing to avoid order key validation errors
const generateIndex = (() => {
  let counter = 1;
  return () => {
    // Generate indices like a1, a1V, a2, a2V, etc to spread them out
    const base = Math.floor(counter / 2);
    const suffix = counter % 2 === 0 ? 'V' : '';
    counter++;
    return `a${base}${suffix}`;
  };
})();

// Create environment container
export function createEnvironmentElement(
  env: Environment,
  x: number,
  y: number,
  width: number = 1200,
  height: number = 500
): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];
  
  // Environment container
  elements.push({
    id: `env-${env.id}`,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: COLORS[env.type] || '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [`group-${env.id}`],
    frameId: null,
    index: generateIndex() as any,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  } as ExcalidrawElement);
  
  // Environment label
  elements.push({
    id: `label-${env.id}`,
    type: 'text',
    x: x + 10,
    y: y + 10,
    width: 200,
    height: 25,
    angle: 0,
    strokeColor: COLORS[env.type] || '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    text: `${env.name} (${env.type})`,
    fontSize: 20,
    fontFamily: 1,
    textAlign: 'left',
    verticalAlign: 'top',
    containerId: null,
    originalText: `${env.name} (${env.type})`,
    autoResize: true,
    lineHeight: 1.25,
    groupIds: [`group-${env.id}`],
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
  
  return elements;
}

// Create Snaplex element
export function createSnaplexElement(
  snaplex: Snaplex,
  x: number,
  y: number,
  width: number = 150,
  height: number = 100
): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];
  
  // Snaplex container
  elements.push({
    id: `snaplex-${snaplex.id}`,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: COLORS[snaplex.type],
    backgroundColor: COLORS[snaplex.type] + '20',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [`group-snaplex-${snaplex.id}`],
    frameId: null,
    index: generateIndex() as any,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  } as ExcalidrawElement);
  
  // Snaplex label
  elements.push({
    id: `label-snaplex-${snaplex.id}`,
    type: 'text',
    x: x + width / 2 - 40,
    y: y + 5,
    width: 80,
    height: 20,
    angle: 0,
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    text: snaplex.name,
    fontSize: 16,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: null,
    originalText: snaplex.name,
    autoResize: true,
    lineHeight: 1.25,
    groupIds: [`group-snaplex-${snaplex.id}`],
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
  
  return elements;
}

// Create ExecutionNode element
export function createNodeElement(
  node: ExecutionNode,
  x: number,
  y: number,
  size: number = 40
): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];
  
  // Adjust size based on node size setting
  const sizeMultipliers = {
    'medium': 1,
    'L': 1.2,
    'XL': 1.4,
    '2XL': 1.6
  };
  const actualSize = size * (sizeMultipliers[node.size] || 1);
  
  // Node circle
  elements.push({
    id: `node-${node.id}`,
    type: 'ellipse',
    x,
    y,
    width: actualSize,
    height: actualSize,
    angle: 0,
    strokeColor: COLORS.node,
    backgroundColor: node.status === 'running' ? '#10b981' : node.status === 'error' ? '#dc2626' : '#fbbf24',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [`group-node-${node.id}`],
    frameId: null,
    index: generateIndex() as any,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  } as ExcalidrawElement);
  
  // Node label with size indicator
  const sizeIndicator = node.size !== 'medium' ? ` (${node.size})` : '';
  const moIndicator = node.memoryOptimized && node.type === 'JCC' ? ' MO' : '';
  const labelText = `${node.name}${sizeIndicator}${moIndicator}`;
  
  elements.push({
    id: `label-node-${node.id}`,
    type: 'text',
    x: x - 25,
    y: y + actualSize + 5,
    width: actualSize + 50,
    height: 15,
    angle: 0,
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    text: labelText,
    fontSize: 12,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'top',
    containerId: null,
    originalText: labelText,
    autoResize: true,
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
  
  return elements;
}

// Create Endpoint element
export function createEndpointElement(
  endpoint: Endpoint,
  x: number,
  y: number,
  width: number = 120,
  height: number = 60
): ExcalidrawElement[] {
  const elements: ExcalidrawElement[] = [];
  const color = COLORS.endpoint[endpoint.type as keyof typeof COLORS.endpoint] || '#000000';
  
  // Endpoint diamond/rectangle based on type
  elements.push({
    id: `endpoint-${endpoint.id}`,
    type: 'diamond',
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: color,
    backgroundColor: color + '20',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [`group-endpoint-${endpoint.id}`],
    frameId: null,
    index: generateIndex() as any,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  } as ExcalidrawElement);
  
  // Endpoint label
  elements.push({
    id: `label-endpoint-${endpoint.id}`,
    type: 'text',
    x: x + width / 2 - 30,
    y: y + height / 2 - 10,
    width: 60,
    height: 20,
    angle: 0,
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    text: endpoint.name,
    fontSize: 14,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: null,
    originalText: endpoint.name,
    autoResize: true,
    lineHeight: 1.25,
    groupIds: [`group-endpoint-${endpoint.id}`],
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
  
  return elements;
}

// Create scalable snaplex container with dotted border
export function createSnaplexContainer(
  snaplex: Snaplex,
  x: number,
  y: number,
  width: number,
  height: number
): ExcalidrawElement {
  return {
    id: `container-${snaplex.id}`,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: '#000000', // Black color for better visual contrast
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 2,
    strokeStyle: 'dashed', // Dotted container
    roughness: 1,
    opacity: 100,
    groupIds: [`group-snaplex-${snaplex.id}`],
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
  } as ExcalidrawElement;
}

// Create connection arrow
export function createConnectionElement(
  connection: Connection,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): ExcalidrawElement {
  return {
    id: `connection-${connection.id}`,
    type: 'arrow',
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    angle: 0,
    strokeColor: connection.type === 'data-flow' ? '#3b82f6' : '#6b7280',
    backgroundColor: 'transparent',
    fillStyle: 'hachure',
    strokeWidth: 2,
    strokeStyle: connection.type === 'dependency' ? 'dashed' : 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: generateIndex() as any,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    startBinding: {
      elementId: `${connection.source}`,
      focus: 0,
      gap: 0,
      fixedPoint: null
    },
    endBinding: {
      elementId: `${connection.target}`,
      focus: 0,
      gap: 0,
      fixedPoint: null
    },
    lastCommittedPoint: null,
    startArrowhead: null,
    endArrowhead: 'arrow',
    points: [[0, 0], [endX - startX, endY - startY]],
    elbowed: false,
  } as ExcalidrawElement;
}

// Auto-layout function for positioning elements with proper container hierarchy
export function autoLayout(environments: Environment[], endpoints: Endpoint[]): { 
  positions: Map<string, { x: number, y: number }>, 
  envDimensions: Map<string, { width: number, height: number }> 
} {
  const positions = new Map<string, { x: number, y: number }>();
  const envDimensions = new Map<string, { width: number, height: number }>();
  let currentX = 50;
  let currentY = 50;
  
  // Sizing constants for proper hierarchy (adjusted for professional shapes)
  const ENV_WIDTH = 1200;  // Increased to fit larger professional shapes
  const ENV_HEIGHT = 500;
  const SNAPLEX_WIDTH = 450;  // Increased for professional snaplex shapes
  const SNAPLEX_HEIGHT = 300; // Increased for professional snaplex shapes
  const NODE_SPACING = 80;
  const SNAPLEX_MARGIN = 40;
  
  // Track row heights for proper vertical spacing
  let rowStartY = currentY;
  let maxRowHeight = 0;
  
  // Position environments
  environments.forEach((env, index) => {
    positions.set(`env-${env.id}`, { x: currentX, y: currentY });
    console.log(`🏢 Environment "${env.name}" positioned at (${currentX}, ${currentY})`);
    
    // Position snaplexes and calculate environment bounds
    let snaplexX = currentX + SNAPLEX_MARGIN;
    let snaplexY = currentY + 80; // Leave space for environment header
    let maxX = currentX;
    let maxY = currentY + 80;
    
    env.snaplexes.forEach((snaplex, sIndex) => {
      positions.set(`snaplex-${snaplex.id}`, { x: snaplexX, y: snaplexY });
      console.log(`📦 Snaplex "${snaplex.name}" positioned at (${snaplexX}, ${snaplexY}) relative to env at (${currentX}, ${currentY})`);
      
      // Track the maximum bounds (will update maxY after calculating actual snaplex height)
      maxX = Math.max(maxX, snaplexX + SNAPLEX_WIDTH);
      
      // Position nodes within snaplex container boundaries
      const nodeStartX = snaplexX + 50; // More margin from snaplex edge for professional shapes
      let nodeX = nodeStartX;
      let nodeY = snaplexY + 220; // Fine-tuned space for professional snaplex header graphics
      const nodesPerRow = 5;
      const nodeSpacing = NODE_SPACING - 10; // Reduce spacing between nodes by 10px
      
      snaplex.container.nodes.forEach((node, nIndex) => {
        // Arrange nodes in a grid within the snaplex (5 per row)
        if (nIndex > 0 && nIndex % nodesPerRow === 0) {
          // New row of nodes - reset X to starting position
          nodeX = nodeStartX;
          nodeY += 70;
        }
        
        positions.set(`node-${node.id}`, { x: nodeX, y: nodeY });
        nodeX += nodeSpacing;
      });
      
      // Calculate snaplex height based on node rows
      const nodeRows = Math.ceil(snaplex.container.nodes.length / nodesPerRow);
      const calculatedSnaplexHeight = SNAPLEX_HEIGHT + (nodeRows > 1 ? (nodeRows - 1) * 70 : 0);
      const actualSnaplexHeight = Math.max(SNAPLEX_HEIGHT, calculatedSnaplexHeight);
      
      // Update maxY with actual snaplex height
      maxY = Math.max(maxY, snaplexY + actualSnaplexHeight);
      
      // Store the actual snaplex dimensions for later use
      envDimensions.set(`snaplex-${snaplex.id}`, { width: SNAPLEX_WIDTH, height: actualSnaplexHeight });
      
      snaplexX += SNAPLEX_WIDTH + 30; // Move to next snaplex position
    });
    
    // Calculate actual environment dimensions with padding
    const actualWidth = Math.max(ENV_WIDTH, maxX - currentX + SNAPLEX_MARGIN);
    const actualHeight = Math.max(ENV_HEIGHT, maxY - currentY + 30);
    envDimensions.set(`env-${env.id}`, { width: actualWidth, height: actualHeight });
    
    // Track maximum height in this row
    maxRowHeight = Math.max(maxRowHeight, actualHeight);
    
    // Move to next environment position using actual width
    currentX += actualWidth + 50;
    if ((index + 1) % 2 === 0) {
      // End of row - move to next row using maximum height from this row
      currentX = 50;
      currentY = rowStartY + maxRowHeight + 100;
      rowStartY = currentY; // Start tracking next row
      maxRowHeight = 0; // Reset for next row
    }
  });
  
  // Handle final row height adjustment if we have an odd number of environments
  if (environments.length % 2 === 1) {
    currentY = rowStartY + maxRowHeight + 100;
  }
  
  // Position endpoints at the bottom with proper spacing
  currentY += 50;
  const endpointStartX = 50;
  
  endpoints.forEach((endpoint, index) => {
    positions.set(`endpoint-${endpoint.id}`, { 
      x: endpointStartX + (index * 200), 
      y: currentY 
    });
  });
  
  return { positions, envDimensions };
}