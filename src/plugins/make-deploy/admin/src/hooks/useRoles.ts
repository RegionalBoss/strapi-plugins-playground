import React from "react";
import { IUserRole } from "../../../server/content-types/user";
import { rolesRequests } from "../api/roles";

export const useRoles = () => {
  const [roles, setRoles] = React.useState<IUserRole[]>([]);

  React.useEffect(() => {
    const fetchRoles = async () => {
      setRoles((await rolesRequests.getRoles()).data);
    };
    fetchRoles();
  }, []);

  return { roles };
};
