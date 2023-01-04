import React from "react";
import { rolesRequests } from "../api/roles";

export const useRoles = () => {
  const [roles, setRoles] = React.useState([]);

  React.useEffect(() => {
    const fetchRoles = async () => {
      setRoles((await rolesRequests.getRoles()).data);
    };
    fetchRoles();
  }, []);

  return { roles };
};
