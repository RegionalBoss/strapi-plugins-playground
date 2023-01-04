export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  username: null;
  email: string;
  isActive: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  preferedLanguage: string;
  roles?: { [x: string]: unknown }[];
  [x: string]: unknown;
}
