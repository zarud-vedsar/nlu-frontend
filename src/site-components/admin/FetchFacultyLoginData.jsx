import axios from "axios";
import { PHP_API_URL } from "../Helper/Constant";
export const facultyData = async(dbId) => {
    const sendFormData = new FormData();
    sendFormData.append("data", "fetch_user");
    sendFormData.append("update_id", dbId);

    try {
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        sendFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data?.status === 200) {
        return response.data.data[0];
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) { /* empty */ }
}
export const RoleDbData = async (dbId) => {
  const sendFormData = new FormData();
  sendFormData.append("data", "fetchRoleOnly");
  sendFormData.append("id", dbId);

  try {
    const response = await axios.post(
      `${PHP_API_URL}/faculty.php`,
      sendFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response.data?.status === 200) {
      return JSON.parse(response.data.data[0].role);
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    /* empty */
  }
};