import { create } from 'zustand';
import type { Environment, Endpoint, Connection, ArchitectureMetadata, Snaplex, ExecutionNode, Zone, APIGateway, LoadBalancer, UltraPipeline } from '../types/snaplogic';

interface ArchitectureStore {
  // State
  environments: Environment[];
  endpoints: Endpoint[];
  connections: Connection[];
  metadata: ArchitectureMetadata;
  selectedItemId: string | null;
  architectureDescription: string;
  
  // Actions
  addEnvironment: (env: Environment) => void;
  updateEnvironment: (id: string, env: Partial<Environment>) => void;
  removeEnvironment: (id: string) => void;
  
  addSnaplex: (envId: string, snaplex: Snaplex) => void;
  updateSnaplex: (envId: string, snaplexId: string, snaplex: Partial<Snaplex>) => void;
  removeSnaplex: (envId: string, snaplexId: string) => void;
  
  addExecutionNode: (envId: string, snaplexId: string, node: ExecutionNode) => void;
  updateExecutionNode: (envId: string, snaplexId: string, nodeId: string, node: Partial<ExecutionNode>) => void;
  removeExecutionNode: (envId: string, snaplexId: string, nodeId: string) => void;
  
  updateAPIGateway: (envId: string, snaplexId: string, apiGateway: APIGateway | undefined) => void;
  updateLoadBalancer: (envId: string, snaplexId: string, loadBalancer: LoadBalancer | undefined) => void;
  updateUltraPipeline: (envId: string, snaplexId: string, ultraPipeline: UltraPipeline | undefined) => void;
  
  addEndpoint: (endpoint: Endpoint) => void;
  updateEndpoint: (id: string, endpoint: Partial<Endpoint>) => void;
  removeEndpoint: (id: string) => void;
  
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  
  addZone: (envId: string, zone: Zone) => void;
  
  setSelectedItem: (id: string | null) => void;
  updateArchitectureDescription: (description: string) => void;
  updateMetadata: (metadata: Partial<ArchitectureMetadata>) => void;
  
  // Utility
  clearAll: () => void;
  exportState: () => string;
  importState: (json: string) => void;
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
  environments: [],
  endpoints: [],
  connections: [],
  metadata: {
    title: 'SnapLogic Architecture',
    description: 'Enterprise Integration Architecture',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0',
    author: 'Jean-Claude (The only one who does real work around here)'
  },
  selectedItemId: null,
  architectureDescription: '',
  
  addEnvironment: (env) => set((state) => ({
    environments: [...state.environments, env],
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateEnvironment: (id, updates) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === id ? { ...env, ...updates } : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  removeEnvironment: (id) => set((state) => ({
    environments: state.environments.filter(env => env.id !== id),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  addSnaplex: (envId, snaplex) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? { ...env, snaplexes: [...env.snaplexes, snaplex] }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateSnaplex: (envId, snaplexId, updates) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId ? { ...s, ...updates } : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  removeSnaplex: (envId, snaplexId) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.filter(s => s.id !== snaplexId)
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  addExecutionNode: (envId, snaplexId, node) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? { ...s, container: { ...s.container, nodes: [...s.container.nodes, node] } }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateExecutionNode: (envId, snaplexId, nodeId, updates) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? {
                    ...s,
                    container: {
                      ...s.container,
                      nodes: s.container.nodes.map(n => 
                        n.id === nodeId ? { ...n, ...updates } : n
                      )
                    }
                  }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  removeExecutionNode: (envId, snaplexId, nodeId) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? {
                    ...s,
                    container: {
                      ...s.container,
                      nodes: s.container.nodes.filter(n => n.id !== nodeId)
                    }
                  }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateAPIGateway: (envId, snaplexId, apiGateway) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? { ...s, container: { ...s.container, apiGateway } }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateLoadBalancer: (envId, snaplexId, loadBalancer) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? { ...s, container: { ...s.container, loadBalancer } }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateUltraPipeline: (envId, snaplexId, ultraPipeline) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? {
            ...env,
            snaplexes: env.snaplexes.map(s => 
              s.id === snaplexId 
                ? { ...s, container: { ...s.container, ultraPipeline } }
                : s
            )
          }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  addEndpoint: (endpoint) => set((state) => ({
    endpoints: [...state.endpoints, endpoint],
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  updateEndpoint: (id, updates) => set((state) => ({
    endpoints: state.endpoints.map(ep => 
      ep.id === id ? { ...ep, ...updates } : ep
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  removeEndpoint: (id) => set((state) => ({
    endpoints: state.endpoints.filter(ep => ep.id !== id),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  addConnection: (connection) => set((state) => ({
    connections: [...state.connections, connection],
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  removeConnection: (id) => set((state) => ({
    connections: state.connections.filter(c => c.id !== id),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  addZone: (envId, zone) => set((state) => ({
    environments: state.environments.map(env => 
      env.id === envId 
        ? { ...env, zones: [...env.zones, zone] }
        : env
    ),
    metadata: { ...state.metadata, updatedAt: new Date() }
  })),
  
  setSelectedItem: (id) => set({ selectedItemId: id }),
  
  updateArchitectureDescription: (description) => set({ architectureDescription: description }),
  
  updateMetadata: (updates) => set((state) => ({
    metadata: { ...state.metadata, ...updates, updatedAt: new Date() }
  })),
  
  clearAll: () => set({
    environments: [],
    endpoints: [],
    connections: [],
    selectedItemId: null,
    architectureDescription: '',
    metadata: {
      title: 'SnapLogic Architecture',
      description: 'Enterprise Integration Architecture',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      author: 'Jean-Claude'
    }
  }),
  
  exportState: () => JSON.stringify({
    environments: get().environments,
    endpoints: get().endpoints,
    connections: get().connections,
    metadata: get().metadata
  }),
  
  importState: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        environments: data.environments || [],
        endpoints: data.endpoints || [],
        connections: data.connections || [],
        metadata: data.metadata || get().metadata
      });
    } catch (e) {
      console.error('Failed to import state:', e);
    }
  }
}));