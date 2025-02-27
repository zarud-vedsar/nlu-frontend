import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  capitalizeEachLetter,
  goBack
} from "../../site-components/Helper/HelperFunction";
import { RoleData } from "../../site-components/admin/assets/RoleData";
import { FormField } from "../../site-components/admin/assets/FormField";
import { toast } from "react-toastify";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
function AddRole() {
  const location = useLocation();
  const dbId = location?.state?.dbId;
  const [roleData, setRoleData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    setRoleData(RoleData);
  }, []);

  const [formData, setFormData] = useState({
    dbId: dbId || "",
    roleName: "",
    rolePermissions: [],
  });

  useEffect(() => {
    if (roleData.length) {
      setFormData((prev) => ({
        ...prev,
        rolePermissions: roleData.map((item) => ({
          [item.title]: item.items.map((subItem) => ({
            subRole: subItem.label,
            crud: [],
          })),
        })),
      }));
    }
  }, [roleData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchRoleList = async (dbId) => {
    const sendFormData = new FormData();
    sendFormData.append("data", "RoleList");
    sendFormData.append("id", dbId);

    try {
      const response = await axios.post(
        `${PHP_API_URL}/role_permission.php`,
        sendFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.status === 200) {
        const roleData = response.data.data[0];
        let parsedRoles = JSON.parse(roleData.role);

        setFormData((prev) => ({
          ...prev,
          dbId: roleData.id,
          roleName: roleData.role_name,
        }));
        if (parsedRoles.length > 0) {
          parsedRoles.forEach((permissionObj) => {
            // Get the title (e.g., "Student Management")
            let mainTitle = Object.keys(permissionObj)[0];
            permissionObj[mainTitle].forEach((subRoleObj) => {
              if (subRoleObj.crud.length) {
                subRoleObj.crud.forEach((subR) => {
                  handleCheckboxChange(subRoleObj.subRole, subR, mainTitle);
                });
              }
            });
          });
        }
      } else {
        toast.error("Failed to fetch role list.");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "A server error occurred.");
    }
  };

  // Update the effect to set rolePermissions when role data is fetched

  const handleCheckboxChange = (role, permission, mainTitle) => {
    setFormData((prev) => {
      let updatedPermissions = [...prev.rolePermissions];

      let mainTitleIndex = updatedPermissions.findIndex(
        (item) => Object.keys(item)[0] === mainTitle
      );

      if (mainTitleIndex !== -1) {
        let existingMainTitle = updatedPermissions[mainTitleIndex];

        let rolePermissions = existingMainTitle[mainTitle] || [];

        let roleIndex = rolePermissions.findIndex((r) => r.subRole === role);

        if (roleIndex !== -1) {
          let newCrud = [...rolePermissions[roleIndex].crud];
          newCrud.includes(permission)
            ? (newCrud = newCrud.filter((perm) => perm !== permission))
            : newCrud.push(permission);

          rolePermissions[roleIndex] = { subRole: role, crud: newCrud };
        } else {
          rolePermissions.push({ subRole: role, crud: [permission] });
        }

        existingMainTitle[mainTitle] = rolePermissions;
      } else {
        updatedPermissions.push({
          [mainTitle]: [{ subRole: role, crud: [permission] }],
        });
      }

      return { ...prev, rolePermissions: updatedPermissions };
    });
  };


  const handleSubmit = async (e) => {
    const filteredPermissions = formData.rolePermissions.filter(
      (permissionObj) => {
        let mainTitle = Object.keys(permissionObj)[0];

        // Ensure the mainTitle has a valid array and at least one subRole with non-empty crud
        return (
          permissionObj[mainTitle].length > 0 &&
          permissionObj[mainTitle].some((subRole) => subRole.crud.length > 0)
        );
      }
    );

    e.preventDefault();
    setIsSubmit(true);
    const formData2 = new FormData();
    formData2.append("data", "role_add");
    formData2.append("updateid", formData.dbId);
    formData2.append("roleName", formData.roleName);
    formData2.append(
      "rolePermissions",
      JSON.stringify(filteredPermissions)
    );
    formData2.append("loguserid", secureLocalStorage.getItem("login_id"));
    formData2.append("login_type", secureLocalStorage.getItem("loginType"));
    try {
      const response = await axios.post(
        `${PHP_API_URL}/role_permission.php`,
        formData2,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.status === 200 || response.data?.status === 201) {
        toast.success(response.data.msg);
      } else {
        toast.error(
          response.data?.msg || "Failed to generate attendace marks."
        );
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmit(false);
    }
  };
  useEffect(() => {
    if (dbId)
      setTimeout(() => {
        fetchRoleList(dbId);
      }, 500);
  }, [dbId]);
  return (
    <div className="page-container">
      <div className="main-content">
        <div className="container-fluid">
          <div className="page-header mb-0">
            <div className="header-sub-title">
              <nav className="breadcrumb breadcrumb-dash">
                <Link to="/admin/home" className="breadcrumb-item">
                  <i className="fas fa-home m-r-5" /> Dashboard
                </Link>
             
                <span className="breadcrumb-item active">
                  Role & Permission
                </span>
                <span className="breadcrumb-item">Add New</span>
              </nav>
            </div>
          </div>
          <div className="card bg-transparent mb-2">
            <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
              <h5 className="card-title h6_new">
                {dbId ? "Update Page" : "Add New"}
              </h5>
              <div className="ml-auto id-mobile-go-back">
                <button
                  className="btn btn-light border-0 mr-2"
                  onClick={goBack}
                >
                  <i className="fas fa-arrow-left" /> Go Back
                </button>
                <Link
                  to="/admin/role-list"
                  className="btn btn-secondary border-0"
                >
                  <i className="fas fa-list" /> Role List
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <FormField
                    label="Title"
                    name="roleName"
                    id="roleName"
                    placeholder="Enter Role Title"
                    value={formData.roleName}
                    column="col-md-12"
                    onChange={handleChange}
                  />
                  <div className="col-12">
                    <label className="font-weight-semibold">Permissions</label>
                  </div>
                  {roleData.map((role, roleIndex) => (
                    <div
                      key={roleIndex}
                      className="col-12 my-2 rounded-5"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <h5 className="card-title py-2 mb-0 px-2 font-weight-semibold bg_light">
                        {role.title}
                      </h5>
                      <div
                        className="row mx-auto mt-2"
                        style={{ width: "98%" }}
                      >
                        {role.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="col-md-4 my-2 border">
                            <h6>{item.label}</h6>
                            <div className="d-flex flex-wrap bg_light p-3 rounded-3">
                              {item.crud.map((perm, permIndex) => {
                                let checked = formData.rolePermissions
                                  .find((perm) => perm[role.title])
                                  ?.[role.title]?.some(
                                    (r) =>
                                      r.subRole === item.label &&
                                      r.crud.includes(perm)
                                  );
                                return (
                                  <div key={permIndex} className="col-12">
                                    <div className="checkbox">
                                      <input
                                        type="checkbox"
                                        name={`role[${item.label}][]`}
                                        id={`${item.label}_${perm}`}
                                        value={perm}
                                        checked={checked}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            item.label,
                                            perm,
                                            role.title
                                          )
                                        }
                                        className="form-check-input role_checkbox"
                                      />
                                      <label htmlFor={`${item.label}_${perm}`}>
                                        {capitalizeEachLetter(perm)}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="col-md-12">
                    <button
                      disabled={isSubmit}
                      className="btn btn-dark d-flex justify-content-center align-items-center"
                      type="submit"
                    >
                      Submit{" "}
                      {isSubmit && <div className="loader-circle ml-2"></div>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRole;
