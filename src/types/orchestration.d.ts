export interface SystemState {
  initialized: boolean;
  swarmStatus: 'idle' | 'active' | 'error';
  memoryLoad: number;
}

export interface AgentNode {
  id: string;
  role: 'controller' | 'worker' | 'observer';
  computeWeight: number;
}