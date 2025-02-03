import secureLocalStorage from "react-secure-storage";
export default function IsAdminLoggedIn() {
  const login_id = parseInt(secureLocalStorage.getItem("login_id"), 10);

  if (secureLocalStorage.getItem("lastLoginTime")) {
    const lastLoginTime = secureLocalStorage.getItem("lastLoginTime");

    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastLoginTime;
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

    if (timeDifference > twoHoursInMilliseconds) {
      localStorage.clear();
      window.location.href = "/admin/";
      window.location.reload();
      return;
    }
  }

  const currentTime = new Date().getTime();
  secureLocalStorage.setItem("lastLoginTime", currentTime);

  // Ensuring base 10 for integer parsing
  if (isNaN(login_id) || login_id <= 0) {
    return false; // Return false if login_id is not a valid number or <= 0
  }
  return true; // Return true if login_id is a valid positive number
}
