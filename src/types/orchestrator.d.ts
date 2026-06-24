export interface AgentConfig {
  id: string;
  role: 'controller' | 'worker' | 'observer';
  priority: number;
  memoryBuffer: boolean;
}

export interface SystemState {
  status: 'active' | 'dormant' | 'evolving';
  lastSync: string;
  activeAgents: AgentConfig[];
}
