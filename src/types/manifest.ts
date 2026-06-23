export interface ProjectManifest {
  project: string;
  version: string;
  architecture: {
    engine: string;
    stateManagement: string;
    agentFramework: string;
    security: string;
  };
  capabilities: {
    primary: string;
    secondary: string[];
    integration: {
      portfolioSync: string;
      selfRefactoring: boolean;
    };
  };
  environment: {
    node: string;
    typescript: string;
    tailwind: string;
  };
  manifest: {
    description: string;
    author: string;
    license: string;
  };
}