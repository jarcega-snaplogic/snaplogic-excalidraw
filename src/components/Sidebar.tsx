import { useState } from 'react';
import { useArchitectureStore } from '../store/architectureStore';
import { Environment, Snaplex, ExecutionNode, Endpoint } from '../types/snaplogic';
import { generateFullMockArchitecture } from '../utils/mockDataGenerator';
import './Sidebar.css';

interface SidebarProps {
  onClose: () => void;
  excalidrawAPI: any;
}

export function Sidebar({ onClose, excalidrawAPI }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'environments' | 'endpoints' | 'import'>('environments');
  const [showAddEnvForm, setShowAddEnvForm] = useState(false);
  const [showAddEndpointForm, setShowAddEndpointForm] = useState(false);
  const [showAddSnaplexForm, setShowAddSnaplexForm] = useState<string | null>(null); // Store environment ID
  
  const {
    environments,
    endpoints,
    addEnvironment,
    addSnaplex,
    addExecutionNode,
    addEndpoint,
    updateExecutionNode,
    importState,
    exportState,
    clearAll
  } = useArchitectureStore();
  
  const handleAddEnvironment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const envType = formData.get('type') as 'production' | 'staging' | 'development' | 'sandbox';
    
    const newEnv: Environment = {
      id: `env-${Date.now()}`,
      name: name || `${envType}-${environments.length + 1}`,
      type: envType,
      region: formData.get('region') as string || '',
      description: formData.get('description') as string || '',
      snaplexes: [],
      zones: []
    };
    
    addEnvironment(newEnv);
    setShowAddEnvForm(false);
    e.currentTarget.reset();
  };
  
  const handleAddSnaplex = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const envId = showAddSnaplexForm!;
    
    const name = formData.get('name') as string;
    const snaplexType = formData.get('type') as 'cloudplex' | 'groundplex';
    const env = environments.find(e => e.id === envId);
    const snaplexCount = env ? env.snaplexes.length + 1 : 1;
    
    const newSnaplex: Snaplex = {
      id: `snaplex-${Date.now()}`,
      name: name || `${snaplexType}-${snaplexCount}`,
      type: snaplexType,
      environment: envId,
      status: 'active',
      container: {
        nodes: [],
        minWidth: 300,
        minHeight: 200,
        x: 100,
        y: 100
      }
    };
    
    addSnaplex(envId, newSnaplex);
    setShowAddSnaplexForm(null);
    e.currentTarget.reset();
  };
  
  const handleAddNode = (envId: string, snaplexId: string, nodeType: 'JCC' | 'FM') => {
    const env = environments.find(e => e.id === envId);
    const snaplex = env?.snaplexes.find(s => s.id === snaplexId);
    const nodeCount = snaplex ? snaplex.container.nodes.length + 1 : 1;
    
    const nodeName = `node-${nodeCount}`;
    
    const newNode: ExecutionNode = {
      id: `node-${Date.now()}`,
      name: nodeName,
      type: nodeType,
      hostname: `${nodeName}.snaplogic.local`,
      ipAddress: '10.0.1.100',
      port: nodeType === 'JCC' ? 8080 : 8081,
      status: 'running',
      cpu: 50,
      memory: 60,
      diskSpace: 30,
      size: 'medium',
      memoryOptimized: false
    };
    
    addExecutionNode(envId, snaplexId, newNode);
  };
  
  const handleAddEndpoint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEndpoint: Endpoint = {
      id: `endpoint-${Date.now()}`,
      name: formData.get('name') as string,
      type: formData.get('type') as 'rest' | 'database' | 'file' | 'kafka' | 'sqs' | 'mqtt',
      url: formData.get('url') as string || undefined,
      authentication: formData.get('auth') as any
    };
    
    addEndpoint(newEndpoint);
    setShowAddEndpointForm(false);
    e.currentTarget.reset();
  };
  
  const handleExport = () => {
    const data = exportState();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snaplogic-architecture.json';
    a.click();
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      importState(json);
    };
    reader.readAsText(file);
  };

  const handleNodeSizeUp = (envId: string, snaplexId: string, nodeId: string) => {
    const sizeOrder = ['medium', 'L', 'XL', '2XL'] as const;
    const env = environments.find(e => e.id === envId);
    const snaplex = env?.snaplexes.find(s => s.id === snaplexId);
    const node = snaplex?.container.nodes.find(n => n.id === nodeId);
    
    if (node) {
      const currentIndex = sizeOrder.indexOf(node.size);
      if (currentIndex < sizeOrder.length - 1) {
        updateExecutionNode(envId, snaplexId, nodeId, { size: sizeOrder[currentIndex + 1] });
      }
    }
  };

  const handleNodeSizeDown = (envId: string, snaplexId: string, nodeId: string) => {
    const sizeOrder = ['medium', 'L', 'XL', '2XL'] as const;
    const env = environments.find(e => e.id === envId);
    const snaplex = env?.snaplexes.find(s => s.id === snaplexId);
    const node = snaplex?.container.nodes.find(n => n.id === nodeId);
    
    if (node) {
      const currentIndex = sizeOrder.indexOf(node.size);
      if (currentIndex > 0) {
        updateExecutionNode(envId, snaplexId, nodeId, { size: sizeOrder[currentIndex - 1] });
      }
    }
  };

  const handleToggleMO = (envId: string, snaplexId: string, nodeId: string) => {
    const env = environments.find(e => e.id === envId);
    const snaplex = env?.snaplexes.find(s => s.id === snaplexId);
    const node = snaplex?.container.nodes.find(n => n.id === nodeId);
    
    if (node && node.type === 'JCC') {
      updateExecutionNode(envId, snaplexId, nodeId, { memoryOptimized: !node.memoryOptimized });
    }
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SnapLogic Architecture</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-tabs">
        <button 
          className={activeTab === 'environments' ? 'active' : ''}
          onClick={() => setActiveTab('environments')}
        >
          Environments
        </button>
        <button 
          className={activeTab === 'endpoints' ? 'active' : ''}
          onClick={() => setActiveTab('endpoints')}
        >
          Endpoints
        </button>
        <button 
          className={activeTab === 'import' ? 'active' : ''}
          onClick={() => setActiveTab('import')}
        >
          Import/Export
        </button>
      </div>
      
      <div className="sidebar-content">
        {activeTab === 'environments' && (
          <div className="environments-section">
            <button 
              className="add-btn"
              onClick={() => setShowAddEnvForm(!showAddEnvForm)}
            >
              + Add Environment
            </button>
            
            {showAddEnvForm && (
              <form onSubmit={handleAddEnvironment} className="add-form">
                <input name="name" placeholder="Environment Name (optional - auto-generated if empty)" />
                <select name="type" required defaultValue="production">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                  <option value="sandbox">Sandbox</option>
                </select>
                <input name="region" placeholder="Region (optional, e.g., us-east-1)" />
                <textarea name="description" placeholder="Description (optional)" />
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowAddEnvForm(false)}>Cancel</button>
              </form>
            )}
            
            <div className="env-list">
              {environments.map(env => (
                <div key={env.id} className="env-item">
                  <h4>{env.name} <span className="env-type">({env.type})</span></h4>
                  <p>Region: {env.region}</p>
                  <button 
                    className="mini-btn"
                    onClick={() => setShowAddSnaplexForm(showAddSnaplexForm === env.id ? null : env.id)}
                  >
                    + Add Snaplex
                  </button>
                  
                  {showAddSnaplexForm === env.id && (
                    <form onSubmit={handleAddSnaplex} className="add-form snaplex-form">
                      <input name="name" placeholder="Snaplex Name (optional - auto-generated if empty)" />
                      <select name="type" required defaultValue="cloudplex">
                        <option value="cloudplex">Cloudplex</option>
                        <option value="groundplex">Groundplex</option>
                      </select>
                      <button type="submit">Add</button>
                      <button type="button" onClick={() => setShowAddSnaplexForm(null)}>Cancel</button>
                    </form>
                  )}
                  
                  {env.snaplexes.map(snaplex => (
                    <div key={snaplex.id} className="snaplex-item">
                      <h5>{snaplex.name} ({snaplex.type})</h5>
                      <div className="node-buttons">
                        <button 
                          className="mini-btn"
                          onClick={() => handleAddNode(env.id, snaplex.id, 'JCC')}
                        >
                          + Add JCC Node
                        </button>
                        <button 
                          className="mini-btn"
                          onClick={() => handleAddNode(env.id, snaplex.id, 'FM')}
                        >
                          + Add FM Node
                        </button>
                      </div>
                      
                      {snaplex.container.nodes.map(node => (
                        <div key={node.id} className="node-item">
                          <span>• {node.name}</span>
                          <span className="node-indicators">
                            {node.size !== 'medium' && <span className="size-indicator"> ({node.size})</span>}
                            {node.memoryOptimized && node.type === 'JCC' && <span className="mo-indicator"> MO</span>}
                          </span>
                          <div className="node-controls">
                            {node.size !== '2XL' && (
                              <button 
                                className="node-btn" 
                                onClick={() => handleNodeSizeUp(env.id, snaplex.id, node.id)}
                                title="Increase node size"
                              >
                                ▲
                              </button>
                            )}
                            {node.size !== 'medium' && (
                              <button 
                                className="node-btn" 
                                onClick={() => handleNodeSizeDown(env.id, snaplex.id, node.id)}
                                title="Decrease node size"
                              >
                                ▼
                              </button>
                            )}
                            {node.type === 'JCC' && (
                              <button 
                                className={`node-btn ${node.memoryOptimized ? 'active' : ''}`}
                                onClick={() => handleToggleMO(env.id, snaplex.id, node.id)}
                                title="Toggle Memory Optimization"
                              >
                                MO
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'endpoints' && (
          <div className="endpoints-section">
            <button 
              className="add-btn"
              onClick={() => setShowAddEndpointForm(!showAddEndpointForm)}
            >
              + Add Endpoint
            </button>
            
            {showAddEndpointForm && (
              <form onSubmit={handleAddEndpoint} className="add-form">
                <input name="name" placeholder="Endpoint Name" required />
                <select name="type" required>
                  <option value="">Select Type</option>
                  <option value="rest">REST API</option>
                  <option value="database">Database</option>
                  <option value="file">File System</option>
                  <option value="kafka">Kafka</option>
                  <option value="sqs">AWS SQS</option>
                  <option value="mqtt">MQTT</option>
                </select>
                <input name="url" placeholder="URL/Connection String (optional)" />
                <select name="auth">
                  <option value="none">No Authentication</option>
                  <option value="basic">Basic Auth</option>
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="apikey">API Key</option>
                  <option value="certificate">Certificate</option>
                </select>
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowAddEndpointForm(false)}>Cancel</button>
              </form>
            )}
            
            <div className="endpoint-list">
              {endpoints.map(endpoint => (
                <div key={endpoint.id} className="endpoint-item">
                  <h4>{endpoint.name}</h4>
                  <p>Type: {endpoint.type}</p>
                  {endpoint.url && <p>URL: {endpoint.url}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'import' && (
          <div className="import-section">
            <h3>Import/Export Architecture</h3>
            
            <div className="import-controls">
              <button className="export-btn" onClick={handleExport}>
                Export Architecture
              </button>
              
              <label className="import-btn">
                Import Architecture
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
              </label>
              
              <button className="clear-btn" onClick={clearAll}>
                Clear All
              </button>
            </div>
            
            <button 
              className="export-btn" 
              style={{ background: '#8b5cf6' }}
              onClick={() => {
                const mockData = generateFullMockArchitecture();
                mockData.environments.forEach(env => addEnvironment(env));
                mockData.endpoints.forEach(ep => addEndpoint(ep));
                // Note: Connections need proper implementation after elements are added
              }}
            >
              Load Sample Architecture
            </button>
            
            <div className="info-section">
              <h4>Tips:</h4>
              <ul>
                <li>Export your architecture to save it locally</li>
                <li>Import previously saved architectures</li>
                <li>Use Clear All to start fresh</li>
                <li>Load sample data to explore features</li>
                <li>Changes are auto-saved in browser memory</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="sidebar-footer">
        <p>Created by Jean-Claude</p>
        <p className="small">The only one who does real work</p>
      </div>
    </div>
  );
}