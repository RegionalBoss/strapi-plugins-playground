export interface IDeploySetting {
  name: string;
  deploy: string;
  link: string;
  id: string;
  roles: {
    id: number;
    name: string;
    code: string;
    description: string;
    [x: string]: unknown;
  }[];
}
