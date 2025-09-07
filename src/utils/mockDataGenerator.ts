import { Environment, ExecutionNode, Endpoint, Connection, APIGateway, LoadBalancer, UltraPipeline } from '../types/snaplogic';

// Generate sample data for demonstration  
// Created by Jean-Claude, because someone has to do the actual work around here
// Now with proper container architecture that actually makes sense

export function generateMockEnvironment(): Environment {
  const envId = `env-${Date.now()}`;
  return {
    id: envId,
    name: 'Production AWS',
    type: 'production',
    region: 'us-east-1',
    description: 'Main production environment for customer data processing',
    snaplexes: [
      {
        id: `snaplex-${Date.now()}-1`,
        name: 'Primary Cloudplex',
        type: 'cloudplex',
        environment: envId,
        status: 'active',
        version: '4.33',
        container: {
          nodes: [
            {
              id: `node-${Date.now()}-1`,
              name: 'JCC-01',
              type: 'JCC',
              hostname: 'jcc-01.snaplogic.io',
              ipAddress: '10.0.1.10',
              port: 8080,
              status: 'running',
              cpu: 45,
              memory: 72,
              diskSpace: 35
            },
            {
              id: `node-${Date.now()}-2`,
              name: 'JCC-02',
              type: 'JCC',
              hostname: 'jcc-02.snaplogic.io',
              ipAddress: '10.0.1.11',
              port: 8080,
              status: 'running',
              cpu: 62,
              memory: 68,
              diskSpace: 42
            },
            {
              id: `node-${Date.now()}-3`,
              name: 'FM-01',
              type: 'FM',
              hostname: 'fm-01.snaplogic.io',
              ipAddress: '10.0.1.15',
              port: 8081,
              status: 'running',
              cpu: 25,
              memory: 48,
              diskSpace: 20
            }
          ],
          apiGateway: {
            id: `gw-${Date.now()}`,
            name: 'API Gateway',
            enabled: true,
            port: 443,
            protocol: 'https'
          },
          loadBalancer: {
            id: `lb-${Date.now()}`,
            name: 'AWS ALB',
            type: 'aws-elb',
            algorithm: 'round-robin',
            healthCheckEndpoint: '/health'
          },
          ultraPipeline: {
            id: `ultra-${Date.now()}`,
            name: 'Ultra Processing',
            enabled: true,
            feedMasterNodes: [`node-${Date.now()}-3`]
          },
          minWidth: 400,
          minHeight: 300,
          x: 100,
          y: 100
        }
      },
      {
        id: `snaplex-${Date.now()}-2`,
        name: 'On-Premise Groundplex',
        type: 'groundplex',
        environment: envId,
        status: 'active',
        version: '4.33',
        container: {
          nodes: [
            {
              id: `node-${Date.now()}-4`,
              name: 'Ground-JCC-01',
              type: 'JCC',
              hostname: 'ground-jcc-01.internal',
              ipAddress: '192.168.1.100',
              port: 8080,
              status: 'running',
              cpu: 38,
              memory: 55,
              diskSpace: 28
            }
          ],
          minWidth: 300,
          minHeight: 200,
          x: 600,
          y: 100
        }
      }
    ],
    zones: [
      {
        id: `zone-${Date.now()}`,
        name: 'AWS VPC Zone',
        type: 'security',
        region: 'us-east-1',
        components: []
      }
    ]
  };
}

export function generateMockEndpoints(): Endpoint[] {
  return [
    {
      id: `endpoint-${Date.now()}-1`,
      name: 'Customer API',
      type: 'rest',
      url: 'https://api.customer.com/v2',
      protocol: 'HTTPS',
      authentication: 'oauth2'
    },
    {
      id: `endpoint-${Date.now()}-2`,
      name: 'Oracle Database',
      type: 'database',
      url: 'jdbc:oracle:thin:@//db.internal:1521/PROD',
      protocol: 'TCP',
      authentication: 'basic'
    },
    {
      id: `endpoint-${Date.now()}-3`,
      name: 'S3 Bucket',
      type: 'file',
      url: 's3://data-bucket/inbound/',
      protocol: 'S3',
      authentication: 'apikey'
    },
    {
      id: `endpoint-${Date.now()}-4`,
      name: 'Kafka Cluster',
      type: 'kafka',
      url: 'kafka-broker.internal:9092',
      protocol: 'TCP',
      authentication: 'certificate'
    }
  ];
}

export function generateMockConnections(envs: Environment[], endpoints: Endpoint[]): Connection[] {
  const connections: Connection[] = [];
  
  // Connect first snaplex to some endpoints
  if (envs.length > 0 && envs[0].snaplexes.length > 0 && endpoints.length > 0) {
    connections.push({
      id: `conn-${Date.now()}-1`,
      source: `snaplex-${envs[0].snaplexes[0].id}`,
      target: `endpoint-${endpoints[0].id}`,
      type: 'data-flow',
      label: 'API Integration'
    });
    
    if (endpoints.length > 1) {
      connections.push({
        id: `conn-${Date.now()}-2`,
        source: `snaplex-${envs[0].snaplexes[0].id}`,
        target: `endpoint-${endpoints[1].id}`,
        type: 'data-flow',
        label: 'Database Sync'
      });
    }
  }
  
  return connections;
}

export function generateFullMockArchitecture() {
  const environment = generateMockEnvironment();
  const endpoints = generateMockEndpoints();
  const connections = generateMockConnections([environment], endpoints);
  
  return {
    environments: [environment],
    endpoints,
    connections
  };
}

// Helper functions for creating specific component types
export function createMockJCCNode(name: string, hostname: string, ip: string): ExecutionNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    type: 'JCC',
    hostname,
    ipAddress: ip,
    port: 8080,
    status: 'running',
    cpu: Math.floor(Math.random() * 80) + 10,
    memory: Math.floor(Math.random() * 80) + 20,
    diskSpace: Math.floor(Math.random() * 60) + 10
  };
}

export function createMockFMNode(name: string, hostname: string, ip: string): ExecutionNode {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    type: 'FM',
    hostname,
    ipAddress: ip,
    port: 8081,
    status: 'running',
    cpu: Math.floor(Math.random() * 50) + 10,
    memory: Math.floor(Math.random() * 60) + 20,
    diskSpace: Math.floor(Math.random() * 40) + 10
  };
}

export function createMockAPIGateway(name: string = 'API Gateway'): APIGateway {
  return {
    id: `gw-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    enabled: true,
    port: 443,
    protocol: 'https'
  };
}

export function createMockLoadBalancer(name: string = 'Load Balancer'): LoadBalancer {
  return {
    id: `lb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name,
    type: 'nginx',
    algorithm: 'round-robin',
    healthCheckEndpoint: '/health'
  };
}

export function createMockUltraPipeline(feedMasterNodeIds: string[]): UltraPipeline {
  return {
    id: `ultra-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: 'Ultra Pipeline',
    enabled: true,
    feedMasterNodes: feedMasterNodeIds
  };
}