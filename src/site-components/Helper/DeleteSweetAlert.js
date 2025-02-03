import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export const DeleteSweetAlert = async (msg) => {
  // Use SweetAlert to show a confirmation prompt
  const result = await Swal.fire({
    title: "Are you sure?",
    text: msg? msg: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00c9a7",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Proceed"
  });

  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
};

export const CancelSweetAlert = async (msg) => {
  // Use SweetAlert to show a confirmation prompt
  const result = await Swal.fire({
    title: "Are you sure?",
    text: msg? msg: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00c9a7",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Proceed"
  });

  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
};

export const EMailSweetAlert = async (msg) => {
  // Use SweetAlert to show a confirmation prompt
  const result = await Swal.fire({
    title: "Are you sure? ",
    text: msg? msg: "You want Send Notification for Update Time Table",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#00c9a7",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Proceed"
  });

  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
};
