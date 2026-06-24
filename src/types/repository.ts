export interface RepositoryMetadata {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  url: string;
  description: string;
  language: string;
  lastUpdated: string;
}

export interface RepoResponse {
  success: boolean;
  count: number;
  repos: RepositoryMetadata[];
}
