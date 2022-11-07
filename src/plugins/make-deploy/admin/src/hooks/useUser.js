import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";

export const useUser = () => {
  const [user, setUser] = useState();

  useEffect(async () => {
    const { data } = await axiosInstance.get("/admin/users/me");
    console.log("user me: ", data.data);
    setUser(data.data);
  }, []);

  return { user };
};

export default useUser;
