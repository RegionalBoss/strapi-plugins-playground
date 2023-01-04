import { StrapiUser } from "strapi-typed";

export interface IUserRole {
  id: number;
  [x: string]: unknown;
}

export interface IUser extends StrapiUser {
  firstname: string;
  lastname: string;
  isActive: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  preferedLanguage: string;
  roles?: IUserRole[];
  [x: string]: unknown;
}
