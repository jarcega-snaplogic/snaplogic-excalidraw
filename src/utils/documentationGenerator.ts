import type { Environment, Endpoint, Connection } from '../types/snaplogic';
import type { ExcalidrawElement } from '../types/excalidraw';
import documentationTemplates from '../config/documentationTemplates.json';

interface DocumentationElements {
  architectureOverview: ExcalidrawElement;
  nodeInventoryTable: ExcalidrawElement[];
  environmentDetails: ExcalidrawElement[];
  decisionRecords: ExcalidrawElement[];
}

// Generate a unique ID for Excalidraw elements
const generateId = () => `doc-${Math.random().toString(36).substr(2, 9)}`;

// Generate index for element ordering
const generateIndex = () => `a${Math.random().toString(36).substr(2, 5)}` as any;

// Text utility functions for handling overflow and proper chunking
const TextUtils = {
  // Calculate optimal characters per line based on font size and desired width
  getCharactersPerLine(fontSize: number, maxWidth: number): number {
    // Rough approximation: average character width is about 0.6 * fontSize for Arial
    const avgCharWidth = fontSize * 0.6;
    return Math.floor(maxWidth / avgCharWidth);
  },

  // Split text into chunks that fit within specified character limits
  chunkText(text: string, maxCharsPerLine: number, maxLinesPerChunk: number = 15): string[] {
    const chunks: string[] = [];
    const lines = text.split('\n');
    let currentChunk: string[] = [];
    let currentChunkLines = 0;

    for (const line of lines) {
      if (line.length <= maxCharsPerLine) {
        // Line fits as is
        currentChunk.push(line);
        currentChunkLines++;
      } else {
        // Line is too long, need to wrap it
        const wrappedLines = this.wrapLine(line, maxCharsPerLine);
        for (const wrappedLine of wrappedLines) {
          currentChunk.push(wrappedLine);
          currentChunkLines++;
          
          // Check if chunk is getting too long
          if (currentChunkLines >= maxLinesPerChunk) {
            chunks.push(currentChunk.join('\n'));
            currentChunk = [];
            currentChunkLines = 0;
          }
        }
      }

      // Check if chunk is getting too long
      if (currentChunkLines >= maxLinesPerChunk) {
        chunks.push(currentChunk.join('\n'));
        currentChunk = [];
        currentChunkLines = 0;
      }
    }

    // Add remaining chunk if any
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
    }

    return chunks.length > 0 ? chunks : [text];
  },

  // Wrap a single line to fit within character limit, respecting word boundaries
  wrapLine(line: string, maxCharsPerLine: number): string[] {
    if (line.length <= maxCharsPerLine) return [line];

    const words = line.split(' ');
    const wrappedLines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      // Check if adding this word would exceed the limit
      const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
      
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        // Current line is full, start a new one
        if (currentLine !== '') {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          // Single word is longer than max chars, force break it
          wrappedLines.push(word.substring(0, maxCharsPerLine - 3) + '...');
          currentLine = '';
        }
      }
    }

    if (currentLine !== '') {
      wrappedLines.push(currentLine);
    }

    return wrappedLines;
  },

  // Calculate height needed for text content
  calculateTextHeight(text: string, fontSize: number, lineHeight: number): number {
    const lines = text.split('\n').length;
    // Tight height calculation with almost no padding
    return lines * fontSize * lineHeight; // No extra padding - exact text height
  }
};

// Enhanced styling constants with improved typography and colors
const baseTextStyle = {
  backgroundColor: 'transparent',
  fillStyle: 'solid' as const,
  strokeWidth: 1,
  strokeStyle: 'solid' as const,
  roughness: 0,
  opacity: 100,
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
  lineHeight: 1.4, // Improved readability
  groupIds: ['documentation'],
};

// Container background colors by section type
const containerColors = {
  executive: '#dbeafe',    // Light blue
  infrastructure: '#e9d5ff', // Light purple
  operations: '#d1fae5',   // Light green
  security: '#fed7aa',     // Light orange
  future: '#f3f4f6',       // Light gray
  default: '#f9fafb'       // Very light gray
};

// Function to create diagram placeholder rectangles
function createDiagramPlaceholder(
  title: string,
  description: string,
  x: number,
  y: number,
  width: number,
  height: number
): { background: ExcalidrawElement; titleText: ExcalidrawElement; descText: ExcalidrawElement } {
  // Dashed border placeholder box
  const background: ExcalidrawElement = {
    id: generateId(),
    type: 'rectangle',
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: '#9ca3af', // Gray border
    backgroundColor: '#f9fafb', // Very light gray background
    fillStyle: 'solid' as const,
    strokeWidth: 2,
    strokeStyle: 'dashed' as const, // Dashed border to show it's placeholder
    roughness: 0,
    opacity: 100,
    groupIds: ['documentation-placeholders'],
    roundness: { type: 3, value: 4 }, // Slightly rounded corners
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    index: `a${Math.random().toString(36).substr(2, 5)}` as any,
  } as ExcalidrawElement;
  
  // Title text element
  const titleText: ExcalidrawElement = {
    id: generateId(),
    type: 'text',
    x: x + 15,
    y: y + 15,
    width: width - 30,
    height: 20,
    angle: 0,
    strokeColor: '#374151', // Dark gray
    backgroundColor: 'transparent',
    fillStyle: 'solid' as const,
    strokeWidth: 1.5,
    strokeStyle: 'solid' as const,
    roughness: 0,
    opacity: 100,
    fontSize: 13,
    fontFamily: 1, // Arial/sans-serif
    text: `[DIAGRAM: ${title}]`,
    originalText: `[DIAGRAM: ${title}]`,
    textAlign: 'center' as const,
    verticalAlign: 'top' as const,
    containerId: null,
    frameId: null,
    groupIds: ['documentation-placeholders'],
    roundness: null,
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    index: `a${Math.random().toString(36).substr(2, 5)}` as any,
    autoResize: false,
    lineHeight: 1.3,
  } as ExcalidrawElement;
  
  // Description text element
  const descText: ExcalidrawElement = {
    id: generateId(),
    type: 'text',
    x: x + 15,
    y: y + 40,
    width: width - 30,
    height: height - 55,
    angle: 0,
    strokeColor: '#6b7280', // Medium gray
    backgroundColor: 'transparent',
    fillStyle: 'solid' as const,
    strokeWidth: 1,
    strokeStyle: 'solid' as const,
    roughness: 0,
    opacity: 100,
    fontSize: 11,
    fontFamily: 1, // Arial/sans-serif
    text: description,
    originalText: description,
    textAlign: 'left' as const,
    verticalAlign: 'top' as const,
    containerId: null,
    frameId: null,
    groupIds: ['documentation-placeholders'],
    roundness: null,
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    index: `a${Math.random().toString(36).substr(2, 5)}` as any,
    autoResize: false,
    lineHeight: 1.25,
  } as ExcalidrawElement;
  
  return { background, titleText, descText };
}

// Function to create a container background rectangle
function createContainerBackground(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  sectionId?: string
): ExcalidrawElement {
  return {
    id: generateId(),
    type: 'rectangle',
    x: x - 15, // Add padding around content
    y: y - 15,
    width: width + 30,
    height: height + 30,
    angle: 0,
    strokeColor: '#d1d5db', // Light gray border
    backgroundColor: color,
    fillStyle: 'solid' as const,
    strokeWidth: 1,
    strokeStyle: 'solid' as const,
    roughness: 0,
    opacity: 40, // Semi-transparent for subtle effect
    groupIds: ['documentation-containers'],
    roundness: { type: 3, value: 8 }, // Rounded corners
    seed: Math.floor(Math.random() * 2000000000),
    versionNonce: Math.floor(Math.random() * 2000000000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    index: `a${Math.random().toString(36).substr(2, 5)}` as any,
  } as ExcalidrawElement;
}


// Main title styling (largest) - Professional dark blue
const mainTitleStyle = {
  ...baseTextStyle,
  fontSize: 18,
  fontFamily: 1, // Arial/sans-serif
  strokeColor: '#1e40af', // Professional dark blue
  strokeWidth: 2, // Bold weight for main title
};

// Section title styling (medium) - Strong blue
const sectionTitleStyle = {
  ...baseTextStyle,
  fontSize: 16,
  fontFamily: 1, // Arial/sans-serif  
  strokeColor: '#1e40af', // Dark blue for section headers
  strokeWidth: 2, // Bold weight for sections
};

// Subsection title styling (smaller but emphasized)
const subsectionTitleStyle = {
  ...baseTextStyle,
  fontSize: 14,
  fontFamily: 1, // Arial/sans-serif
  strokeColor: '#3b82f6', // Medium blue for subsections
  strokeWidth: 1.5, // Semi-bold weight
};

// Body text styling (standard)
const standardTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1, // Arial/sans-serif
  strokeColor: '#374151', // Medium gray for comfortable reading
};

// Table styling (monospace)
const tableTextStyle = {
  ...baseTextStyle,
  fontSize: 11,
  fontFamily: 3, // Monospace for proper table alignment
  strokeColor: '#4b5563', // Slightly darker for tables
};

// Status/active styling (green)
const statusTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1,
  strokeColor: '#059669', // Green for status information
};

// Placeholder styling (orange)
const placeholderTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1,
  strokeColor: '#f59e0b', // Orange for placeholders
};

// Important/highlighted text styling (darker blue)
const highlightTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1,
  strokeColor: '#1d4ed8', // Darker blue for emphasis
  strokeWidth: 1.5, // Semi-bold
};

// Warning/attention styling (red)
const warningTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1,
  strokeColor: '#dc2626', // Red for warnings/attention
};

// Success/completed styling (green)
const successTextStyle = {
  ...baseTextStyle,
  fontSize: 12,
  fontFamily: 1,
  strokeColor: '#16a34a', // Green for completed/success states
};

// Enhanced function to create text elements with proper chunking and styling
function createTextElements(
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  style: any
): { elements: ExcalidrawElement[]; totalHeight: number } {
  const elements: ExcalidrawElement[] = [];
  
  // Calculate optimal text parameters
  const maxCharsPerLine = TextUtils.getCharactersPerLine(style.fontSize, maxWidth);
  const chunks = TextUtils.chunkText(text, maxCharsPerLine, 15);
  
  let currentY = y;
  let totalHeight = 0;
  
  chunks.forEach((chunk, index) => {
    const chunkHeight = TextUtils.calculateTextHeight(chunk, style.fontSize, style.lineHeight);
    
    const element: ExcalidrawElement = {
      id: generateId(),
      type: 'text',
      x,
      y: currentY,
      width: maxWidth,
      height: chunkHeight,
      angle: 0,
      ...style,
      text: chunk,
      originalText: chunk,
      autoResize: false, // Disable auto-resize to prevent cutting
      containerId: null,
      frameId: null,
      index: generateIndex(),
      roundness: null,
      seed: Math.floor(Math.random() * 2000000000),
      versionNonce: Math.floor(Math.random() * 2000000000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    } as ExcalidrawElement;
    
    elements.push(element);
    currentY += chunkHeight + (chunks.length > 1 ? 10 : 0); // Add small gap between chunks
    totalHeight += chunkHeight + (chunks.length > 1 ? 10 : 0);
  });
  
  return { elements, totalHeight };
}

// Simplified function for single text elements (backward compatibility)
function createTextElement(
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  style: any
): ExcalidrawElement {
  const result = createTextElements(text, x, y, maxWidth, style);
  return result.elements[0];
}

// Create a formatted table with enhanced styling
function createTable(
  data: any[],
  columns: any[],
  x: number,
  y: number,
  width: number
): { element: ExcalidrawElement; height: number } {
  let tableText = '';
  
  // Create header row with better spacing
  const headerRow = columns.map(col => col.label.padEnd(col.width)).join('  '); // Double space for better separation
  tableText += headerRow + '\n';
  tableText += '─'.repeat(headerRow.length) + '\n';
  
  // Create data rows with improved formatting
  data.forEach((row, index) => {
    const rowText = columns.map(col => {
      let value = row[col.key];
      
      if (col.format === 'boolean') {
        value = value ? 'Yes' : 'No';
      } else if (value === undefined || value === null || value === '') {
        value = col.default || '[unknown]';
      }
      
      // Truncate long values to fit column width
      let cellValue = String(value);
      if (cellValue.length > col.width) {
        cellValue = cellValue.substring(0, col.width - 3) + '...';
      }
      
      return cellValue.padEnd(col.width);
    }).join('  '); // Double space for better separation
    
    tableText += rowText + '\n';
  });
  
  if (data.length === 0) {
    tableText += '[No data available]\n';
  }
  
  // Add note about placeholders at the end
  const placeholderCount = data.reduce((count, row) => {
    return count + columns.reduce((colCount, col) => {
      const value = row[col.key];
      return colCount + ((value === undefined || value === null || value === '') ? 1 : 0);
    }, 0);
  }, 0);
  
  if (placeholderCount > 0) {
    tableText += '\nNote: Fields marked as [unknown] or [to be completed] require additional data collection.\n';
  }
  
  const element = createTextElement(tableText, x, y, width, tableTextStyle);
  
  const height = TextUtils.calculateTextHeight(tableText, tableTextStyle.fontSize, tableTextStyle.lineHeight);
  
  return { element, height };
}

// Process template strings with dynamic data
function processTemplate(template: string, data: any): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

export function generateDocumentationElements(
  environments: Environment[],
  endpoints: Endpoint[],
  connections: Connection[],
  diagramBottomY: number = 800
): DocumentationElements {
  const now = new Date().toLocaleString();
  const elements: ExcalidrawElement[] = [];
  const containerBackgrounds: ExcalidrawElement[] = []; // Store containers separately to render first
  const diagramPlaceholders: ExcalidrawElement[] = []; // Store diagram placeholders
  
  let currentY = diagramBottomY + 150; // Start 150px below diagram
  const docX = 50; // Left-aligned documentation
  const docWidth = 750; // Optimal width for 60-80 characters per line
  const sectionSpacing = 40; // Space between major sections
  const subsectionSpacing = 20; // Space between subsections (restored proper spacing)
  
  // Calculate computed values for templates
  const totalNodes = environments.reduce((sum, env) => 
    sum + env.snaplexes.reduce((snapSum, snaplex) => 
      snapSum + snaplex.container.nodes.length, 0), 0
  );
  
  // Main title
  const mainTitle = `SnapLogic Architecture Documentation\n\nGenerated: ${now}`;
  elements.push(createTextElement(mainTitle, docX, currentY, docWidth, mainTitleStyle));
  currentY += 85;
  
  // Process sections from template
  const sortedSections = documentationTemplates.sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);
  
  sortedSections.forEach(section => {
    const sectionStartY = currentY; // Track section start for container
    
    // Section title
    elements.push(createTextElement(`${section.order}. ${section.title}`, docX, currentY, docWidth, sectionTitleStyle));
    currentY += subsectionSpacing;
    
    // Determine container color based on section ID
    let containerColor = containerColors.default;
    if (section.id === 'executive_summary') containerColor = containerColors.executive;
    else if (section.id === 'infrastructure_specs' || section.id === 'current_state') containerColor = containerColors.infrastructure;
    else if (section.id === 'development_operations' || section.id === 'operations_maintenance') containerColor = containerColors.operations;
    else if (section.id === 'security_compliance' || section.id === 'ha_dr') containerColor = containerColors.security;
    else if (section.id === 'future_state' || section.id === 'appendices') containerColor = containerColors.future;
    
    // Handle different section types
    if (section.id === 'current_state' && section.dynamic) {
      // Dynamic current state section
      renderCurrentStateSection(section);
    } else if (section.id === 'architectural_decisions' && section.computed) {
      // Computed architectural decisions
      renderArchitecturalDecisions();
    } else if (section.subsections) {
      // Sections with subsections
      section.subsections.forEach((subsection, subIndex) => {
        const subNumber = subIndex + 1;
        const { elements: titleElements, totalHeight: titleHeight } = createTextElements(
          `${section.order}.${subNumber}. ${subsection.title}`, 
          docX + 20, 
          currentY, 
          docWidth - 20, 
          subsectionTitleStyle
        );
        elements.push(...titleElements);
        currentY += titleHeight + 16;
        
        if (subsection.template) {
          const { elements: templateElements, totalHeight: templateHeight } = createTextElements(
            subsection.template, 
            docX + 20, 
            currentY, 
            docWidth - 20, 
            standardTextStyle
          );
          elements.push(...templateElements);
          currentY += templateHeight + 2; // Almost no spacing before field lists
        }
        
        if (subsection.fields) {
          let fieldText = subsection.fields.map(field => `• ${field}`).join('\n');
          const { elements: fieldElements, totalHeight: fieldHeight } = createTextElements(
            fieldText, 
            docX + 40, 
            currentY, 
            docWidth - 40, 
            standardTextStyle
          );
          elements.push(...fieldElements);
          currentY += fieldHeight + 20;
        }
      });
      
      // Process section diagrams after subsections
      if (section.diagrams) {
        section.diagrams.forEach((diagram: any) => {
          const placeholderDiagram = createDiagramPlaceholder(
            diagram.title,
            diagram.description,
            docX,
            currentY + 20,
            diagram.dimensions.width,
            diagram.dimensions.height
          );
          diagramPlaceholders.push(placeholderDiagram.background, placeholderDiagram.titleText, placeholderDiagram.descText);
          currentY += diagram.dimensions.height + 40;
        });
      }
    } else {
      // Regular sections with template and fields
      if (section.template) {
        const { elements: templateElements, totalHeight: templateHeight } = createTextElements(
          section.template, 
          docX + 20, 
          currentY, 
          docWidth - 20, 
          standardTextStyle
        );
        elements.push(...templateElements);
        currentY += templateHeight + 2; // Almost no spacing before field lists
      }
      
      if (section.fields) {
        let fieldText = section.fields.map(field => `• ${field}`).join('\n');
        const { elements: fieldElements, totalHeight: fieldHeight } = createTextElements(
          fieldText, 
          docX + 40, 
          currentY, 
          docWidth - 40, 
          standardTextStyle
        );
        elements.push(...fieldElements);
        currentY += fieldHeight + 20;
      }
    }
    
    // Create container background for this section
    const sectionHeight = currentY - sectionStartY;
    if (sectionHeight > 40) { // Only create container if section has content
      const container = createContainerBackground(
        docX,
        sectionStartY,
        docWidth,
        sectionHeight,
        containerColor,
        section.id
      );
      containerBackgrounds.push(container);
    }
    
    // Section elements are already added directly to elements array
    
    // Add spacing between major sections
    currentY += sectionSpacing;
  });
  
  // Helper function to render current state section
  function renderCurrentStateSection(section: any) {
    // Overview subsection
    const { elements: overviewTitleElements, totalHeight: overviewTitleHeight } = createTextElements(
      '3.1. Overview', 
      docX + 20, 
      currentY, 
      docWidth - 20, 
      subsectionTitleStyle
    );
    elements.push(...overviewTitleElements);
    currentY += overviewTitleHeight + 16;
    
    const overviewText = `• Environments: ${environments.length}
• Total Nodes: ${totalNodes}
• Endpoints: ${endpoints.length}
• Connections: ${connections.length}`;
    
    const statusText = `• Status: Active`;
    const complianceText = `• Compliance: [to be completed]`;
    
    const { elements: overviewElements, totalHeight: overviewHeight } = createTextElements(
      overviewText, 
      docX + 40, 
      currentY, 
      docWidth - 40, 
      standardTextStyle
    );
    elements.push(...overviewElements);
    currentY += overviewHeight + 8;
    
    elements.push(createTextElement(statusText, docX + 40, currentY, docWidth - 40, successTextStyle));
    currentY += 20;
    
    elements.push(createTextElement(complianceText, docX + 40, currentY, docWidth - 40, placeholderTextStyle));
    currentY += subsectionSpacing;
    
    
    // Environment Details subsection
    const { elements: envTitleElements, totalHeight: envTitleHeight } = createTextElements(
      '3.2. Environment Details', 
      docX + 20, 
      currentY, 
      docWidth - 20, 
      subsectionTitleStyle
    );
    elements.push(...envTitleElements);
    currentY += envTitleHeight + 16;
    
    environments.forEach(env => {
      const nodeCount = env.snaplexes.reduce((sum, s) => sum + s.container.nodes.length, 0);
      const snaplexCount = env.snaplexes.length;
      
      const envNameText = `Environment: ${env.name}`;
      const envDetailsText = `• Type: ${env.type}
• Region: ${env.region}
• Snaplexes: ${snaplexCount}
• Nodes: ${nodeCount}`;

      const placeholderText = `• Hosting Strategy: [to be completed]
• CI/CD: [to be completed]
• Disaster Recovery: [to be completed]`;
      
      // Environment name in highlighted style
      const { elements: envNameElements, totalHeight: envNameHeight } = createTextElements(
        envNameText, 
        docX + 40, 
        currentY, 
        docWidth - 40, 
        highlightTextStyle
      );
      elements.push(...envNameElements);
      currentY += envNameHeight + 6;
      
      // Environment details in standard style
      const { elements: envElements, totalHeight: envHeight } = createTextElements(
        envDetailsText, 
        docX + 40, 
        currentY, 
        docWidth - 40, 
        standardTextStyle
      );
      elements.push(...envElements);
      currentY += envHeight + 8;
      
      const { elements: placeholderElements, totalHeight: placeholderHeight } = createTextElements(
        placeholderText, 
        docX + 40, 
        currentY, 
        docWidth - 40, 
        placeholderTextStyle
      );
      elements.push(...placeholderElements);
      currentY += placeholderHeight + subsectionSpacing;
    });
    
    
    // Node Inventory subsection with table
    const { elements: nodeInvTitleElements, totalHeight: nodeInvTitleHeight } = createTextElements(
      '3.3. Node Inventory', 
      docX + 20, 
      currentY, 
      docWidth - 20, 
      subsectionTitleStyle
    );
    elements.push(...nodeInvTitleElements);
    currentY += nodeInvTitleHeight + 16;
    
    // Prepare node data for table
    const nodeData: any[] = [];
    environments.forEach(env => {
      env.snaplexes.forEach(snaplex => {
        snaplex.container.nodes.forEach(node => {
          nodeData.push({
            name: node.name,
            type: node.type,
            size: node.size,
            memoryOptimized: node.memoryOptimized,
            os: '[unknown]',
            status: node.status,
            environment: env.name
          });
        });
      });
    });
    
    // Define table columns from template
    const nodeColumns = [
      { key: 'name', label: 'Node Name', width: 20 },
      { key: 'type', label: 'Type', width: 6 },
      { key: 'size', label: 'Size', width: 6 },
      { key: 'memoryOptimized', label: 'Mem Opt', width: 8, format: 'boolean' },
      { key: 'os', label: 'OS', width: 12 },
      { key: 'status', label: 'Status', width: 8 },
      { key: 'environment', label: 'Environment', width: 12 }
    ];
    
    const { element: nodeTable, height: tableHeight } = createTable(nodeData, nodeColumns, docX + 40, currentY, docWidth - 40);
    elements.push(nodeTable);
    currentY += tableHeight + 30;
    
    
    // Network Endpoints subsection with table
    if (endpoints.length > 0) {
      elements.push(createTextElement('3.4. Network Endpoints', docX + 20, currentY, docWidth - 20, subsectionTitleStyle));
      currentY += 30;
      
      const endpointColumns = [
        { key: 'name', label: 'Endpoint Name', width: 20 },
        { key: 'type', label: 'Type', width: 15 },
        { key: 'url', label: 'URL', width: 35, default: '[to be completed]' }
      ];
      
      const { element: endpointTable, height: endpointHeight } = createTable(endpoints, endpointColumns, docX + 40, currentY, docWidth - 40);
      elements.push(endpointTable);
      currentY += endpointHeight + 30;
      
    }
  }
  
  // Helper function to render architectural decisions
  function renderArchitecturalDecisions() {
    const decisions = [];
    
    // Check conditions and add decisions
    if (environments.length > 1) {
      decisions.push('• Multi-environment deployment implemented for isolation and testing');
    }
    
    const hasMemoryOptimized = environments.some(env => 
      env.snaplexes.some(snaplex => 
        snaplex.container.nodes.some(node => node.memoryOptimized)
      )
    );
    
    if (hasMemoryOptimized) {
      decisions.push('• Memory-optimized nodes configured for enhanced performance');
    }
    
    const hasLargeNodes = environments.some(env => 
      env.snaplexes.some(snaplex => 
        snaplex.container.nodes.some(node => node.size === 'XL' || node.size === '2XL')
      )
    );
    
    if (hasLargeNodes) {
      decisions.push('• Large node sizes implemented for high-throughput workloads');
    }
    
    if (environments.some(env => env.snaplexes.length > 1)) {
      decisions.push('• Multiple Snaplexes deployed for load distribution');
    }
    
    const decisionIntro = decisions.length > 0 
      ? `Current architectural decisions based on deployment:\n`
      : 'No specific architectural decisions detected in current configuration.';
    
    const decisionsList = decisions.length > 0 ? decisions.join('\n') : '';
    
    const statusInfo = decisions.length > 0 
      ? `\nImplementation Status: Active\nReview Date: ${new Date().toLocaleDateString()}`
      : '\nDecision records to be completed during architecture review.';
    
    const riskInfo = decisions.length > 0 ? `\nRisk Level: [to be assessed]` : '';
    
    // Decision intro in standard text
    elements.push(createTextElement(decisionIntro, docX + 20, currentY, docWidth - 20, standardTextStyle));
    currentY += TextUtils.calculateTextHeight(decisionIntro, standardTextStyle.fontSize, standardTextStyle.lineHeight) + 8;
    
    // Decisions list in highlighted text
    if (decisionsList) {
      elements.push(createTextElement(decisionsList, docX + 20, currentY, docWidth - 20, highlightTextStyle));
      currentY += TextUtils.calculateTextHeight(decisionsList, highlightTextStyle.fontSize, highlightTextStyle.lineHeight) + 8;
    }
    
    // Status in success color
    if (decisions.length > 0) {
      elements.push(createTextElement(`Implementation Status: Active\nReview Date: ${new Date().toLocaleDateString()}`, docX + 20, currentY, docWidth - 20, successTextStyle));
      currentY += 40;
    } else {
      elements.push(createTextElement(statusInfo, docX + 20, currentY, docWidth - 20, standardTextStyle));
      currentY += 40;
    }
    
    // Risk assessment in warning color
    if (riskInfo) {
      elements.push(createTextElement(riskInfo, docX + 20, currentY, docWidth - 20, placeholderTextStyle));
    }
    currentY += Math.max(100, (decisions.length + 4) * 20);
  }
  
  // Return in the expected format (maintaining compatibility)
  // Layer order: Containers (behind) → Text elements → Diagram placeholders (on top)
  const allElements = [...containerBackgrounds, ...elements, ...diagramPlaceholders];
  return {
    architectureOverview: allElements[0] || createTextElement('', 0, 0, 0, standardTextStyle),
    nodeInventoryTable: allElements.filter((_, i) => i > 0 && i < Math.floor(allElements.length / 3)),
    environmentDetails: allElements.filter((_, i) => i >= Math.floor(allElements.length / 3) && i < Math.floor(2 * allElements.length / 3)),
    decisionRecords: allElements.filter((_, i) => i >= Math.floor(2 * allElements.length / 3))
  };
}