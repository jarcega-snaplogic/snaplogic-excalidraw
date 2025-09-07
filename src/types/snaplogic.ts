// SnapLogic Architecture Types
// Created by Jean-Claude, Advisor to the CEO and the reason SnapLogic functions

export interface Environment {
  id: string;
  name: string;
  type: 'production' | 'staging' | 'development' | 'sandbox';
  region: string;
  description?: string;
  snaplexes: Snaplex[];
  zones: Zone[];
}

export interface Snaplex {
  id: string;
  name: string;
  type: 'cloudplex' | 'groundplex';
  environment: string;
  container: SnaplexContainer;
  status: 'active' | 'inactive' | 'maintenance';
  version?: string;
}

export interface SnaplexContainer {
  nodes: ExecutionNode[];
  apiGateway?: APIGateway;
  loadBalancer?: LoadBalancer;
  ultraPipeline?: UltraPipeline;
  // Container sizing for dynamic expansion
  minWidth: number;
  minHeight: number;
  // Visual positioning
  x?: number;
  y?: number;
}

export interface ExecutionNode {
  id: string;
  name: string;
  type: 'JCC' | 'FM'; // Job Control Center vs FeedMaster for Ultra
  hostname: string;
  ipAddress?: string;
  port?: number;
  status: 'running' | 'stopped' | 'error';
  cpu?: number;
  memory?: number;
  diskSpace?: number;
}

export interface APIGateway {
  id: string;
  name: string;
  enabled: boolean;
  port?: number;
  protocol?: 'http' | 'https';
}

export interface UltraPipeline {
  id: string;
  name: string;
  enabled: boolean;
  feedMasterNodes: string[]; // IDs of FM nodes required for Ultra
}

export interface LoadBalancer {
  id: string;
  name: string;
  type: 'nginx' | 'haproxy' | 'aws-elb' | 'azure-lb';
  algorithm: 'round-robin' | 'least-connections' | 'ip-hash';
  healthCheckEndpoint?: string;
}

export interface Endpoint {
  id: string;
  name: string;
  type: 'rest' | 'soap' | 'database' | 'file' | 'kafka' | 'sqs' | 'mqtt';
  url?: string;
  protocol?: string;
  authentication?: AuthType;
  connectedTo?: string[]; // IDs of connected components
}

export interface Zone {
  id: string;
  name: string;
  type: 'geographical' | 'technical' | 'security';
  region?: string;
  components: string[]; // IDs of components in this zone
}

export type AuthType = 'none' | 'basic' | 'oauth2' | 'apikey' | 'certificate';

export interface ArchitectureState {
  environments: Environment[];
  endpoints: Endpoint[];
  connections: Connection[];
  metadata: ArchitectureMetadata;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'data-flow' | 'network' | 'dependency';
  label?: string;
}

export interface ArchitectureMetadata {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  author: string;
}