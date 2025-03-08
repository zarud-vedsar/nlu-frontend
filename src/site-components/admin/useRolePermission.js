import { useState, useEffect, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import { RoleDbData } from "./FetchFacultyLoginData";

// Custom hook to manage and fetch role permissions
const useRolePermission = () => {
  const [RolePermission, setRolePermission] = useState([]);
  const role_id = secureLocalStorage.getItem("role_id");
  const loginType = secureLocalStorage.getItem("loginType");

  const fetchRolePermsn = useCallback(async () => {
    setRolePermission(await RoleDbData(role_id));
  }, [role_id]);

  // Check if any permissions exist with subRole and crudType
  const hasPermission = (subRole, crudType) => {
    console.log(RolePermission)
    if (loginType === 'superadmin') {
      return true;
    }
    return RolePermission?.some((rData) => {
      let arr = rData[Object.keys(rData)[0]]; // Get the array of roles
      
      return arr?.some(
        (item) => item.subRole === subRole && item.crud.includes(crudType)
      );
    });
  };

  useEffect(() => {
    fetchRolePermsn();
  }, [fetchRolePermsn]);

  return { RolePermission, hasPermission };
};

export default useRolePermission;