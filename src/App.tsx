import { useState, useEffect, useCallback } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from './types/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { useArchitectureStore } from './store/architectureStore';
import { Sidebar } from './components/Sidebar';
import { 
  createConnectionElement,
  createEnvironmentElement,
  createSnaplexContainer,
  autoLayout 
} from './utils/excalidrawHelpers';
import { shapeFactory } from './utils/shapeFactory';
import './App.css';

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const { 
    environments, 
    endpoints, 
    connections,
    architectureDescription,
    updateArchitectureDescription 
  } = useArchitectureStore();

  // Convert SnapLogic data to Excalidraw elements
  const generateExcalidrawElements = useCallback(() => {
    const elements: ExcalidrawElement[] = [];
    const { positions, envDimensions } = autoLayout(environments, endpoints);
    
    // Create environment elements
    environments.forEach(env => {
      const pos = positions.get(`env-${env.id}`) || { x: 50, y: 50 };
      const dims = envDimensions.get(`env-${env.id}`) || { width: 1200, height: 500 };
      elements.push(...createEnvironmentElement(env, pos.x, pos.y, dims.width, dims.height));
      
      // Create snaplex elements
      env.snaplexes.forEach(snaplex => {
        const sPos = positions.get(`snaplex-${snaplex.id}`) || { x: 100, y: 100 };
        const sDims = envDimensions.get(`snaplex-${snaplex.id}`) || { width: 450, height: 300 };
        
        // Add professional library shape (header) with 30px padding from container edges
        elements.push(...shapeFactory.createSnaplex(snaplex, sPos.x + 30, sPos.y + 30, sDims.width, sDims.height));
        
        // Add dotted scalable container (encompasses entire snaplex area)
        elements.push(createSnaplexContainer(
          snaplex, 
          sPos.x, 
          sPos.y, // Same Y position as the snaplex header
          sDims.width, 
          sDims.height // Full calculated height
        ));
        
        // Create node elements
        snaplex.container.nodes.forEach(node => {
          const nPos = positions.get(`node-${node.id}`) || { x: 150, y: 150 };
          elements.push(...shapeFactory.createExecutionNode(node, nPos.x, nPos.y));
        });
      });
    });
    
    // Create endpoint elements
    endpoints.forEach(endpoint => {
      const pos = positions.get(`endpoint-${endpoint.id}`) || { x: 50, y: 400 };
      elements.push(...shapeFactory.createEndpoint(endpoint, pos.x, pos.y));
    });
    
    // Create connections
    connections.forEach(conn => {
      const sourcePos = positions.get(conn.source) || { x: 0, y: 0 };
      const targetPos = positions.get(conn.target) || { x: 100, y: 100 };
      elements.push(createConnectionElement(
        conn, 
        sourcePos.x, 
        sourcePos.y, 
        targetPos.x, 
        targetPos.y
      ));
    });
    
    return elements;
  }, [environments, endpoints, connections]);

  // Update Excalidraw when data changes
  useEffect(() => {
    if (excalidrawAPI) {
      const elements = generateExcalidrawElements();
      excalidrawAPI.updateScene({
        elements,
        appState: {
          viewBackgroundColor: '#f8fafc',
          currentItemFontFamily: 1,
          gridSize: 20,
        }
      });

      // Auto-zoom to fit all content with some padding - because Jean-Claude thinks ahead
      if (elements.length > 0) {
        setTimeout(() => {
          excalidrawAPI.scrollToContent(elements, {
            fitToViewport: true,
            viewportZoomFactor: 0.8, // Leave 20% padding around the architecture
            animate: true,
            duration: 1000
          });
        }, 100); // Small delay to ensure elements are rendered
      }
    }
  }, [excalidrawAPI, generateExcalidrawElements]);

  // Generate architecture description
  useEffect(() => {
    let description = `# SnapLogic Architecture\n\n`;
    
    if (environments.length > 0) {
      description += `## Environments (${environments.length})\n\n`;
      environments.forEach(env => {
        description += `### ${env.name} (${env.type})\n`;
        description += `- Region: ${env.region}\n`;
        description += `- Snaplexes: ${env.snaplexes.length}\n`;
        
        env.snaplexes.forEach(snaplex => {
          description += `  - **${snaplex.name}** (${snaplex.type})\n`;
          description += `    - Nodes: ${snaplex.container.nodes.length}\n`;
          description += `    - Status: ${snaplex.status}\n`;
        });
        description += '\n';
      });
    }
    
    if (endpoints.length > 0) {
      description += `## Endpoints (${endpoints.length})\n\n`;
      endpoints.forEach(ep => {
        description += `- **${ep.name}** (${ep.type})\n`;
        if (ep.url) description += `  - URL: ${ep.url}\n`;
      });
      description += '\n';
    }
    
    if (connections.length > 0) {
      description += `## Connections (${connections.length})\n\n`;
      connections.forEach(conn => {
        description += `- ${conn.source} → ${conn.target} (${conn.type})\n`;
      });
    }
    
    updateArchitectureDescription(description);
  }, [environments, endpoints, connections, updateArchitectureDescription]);

  return (
    <div className="app-container">
      {showSidebar && (
        <Sidebar 
          onClose={() => setShowSidebar(false)}
        />
      )}
      
      <div className="excalidraw-container">
        <button 
          className={`toggle-sidebar-btn ${showSidebar ? 'sidebar-open' : ''}`}
          onClick={() => setShowSidebar(!showSidebar)}
          title={showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
        >
          {showSidebar ? '◀' : '▶'}
        </button>
        
        <Excalidraw
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          theme="light"
        >
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.SaveToActiveFile />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>
                SnapLogic Architecture Designer
              </WelcomeScreen.Center.Heading>
              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItemHelp />
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>
      
      {architectureDescription && (
        <div className="description-panel">
          <h3>Architecture Description</h3>
          <pre>{architectureDescription}</pre>
        </div>
      )}
    </div>
  );
}

export default App
