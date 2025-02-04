// Axios और React-toastify को इम्पोर्ट करें
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Helper कॉन्स्टेंट से PHP API URL को इम्पोर्ट करें
import { PHP_API_URL, NODE_API_URL } from "../Helper/Constant";
import secureLocalStorage from "react-secure-storage";

// छात्र रिकॉर्ड को छात्र आईडी (sid) द्वारा प्राप्त करने के लिए एक असिंक्रोनस फ़ंक्शन
export const studentRecordById = async (sid) => {
  // छात्र आईडी सत्यापित करें
  if (!sid) {
    toast.error("Invalid student."); // यदि आईडी वैध नहीं है तो एरर दिखाएं
    return false; // प्रक्रिया को रोकें
  }

  // API के लिए FormData बनाएँ और आवश्यक डेटा जोड़ें
  const formData = new FormData();
  formData.append("data", "studentRecord"); // API के लिए ऑपरेशन की पहचान करें
  formData.append("sid", sid); // छात्र आईडी जोड़ें

  try {
    // API को पोस्ट रिक्वेस्ट भेजें
    const response = await axios.post(
      `${PHP_API_URL}/StudentSet.php`, // API endpoint
      formData, // डेटा
      {
        headers: {
          "Content-Type": "multipart/form-data", // फॉर्म डेटा के लिए हेडर सेट करें
        },
      }
    );
    return response.data.data; // API से प्राप्त डेटा वापस लौटाएं
  } catch (error) {
    // एरर की हैंडलिंग करें
    const status = error.response?.data?.status;
    if (status === 400) {
      // यदि स्टेटस 400 है तो सर्वर की एरर संदेश दिखाएं
      toast.error(error.response.data.msg || "A server error occurred.");
    } else {
      // अन्य एरर के लिए जनरल एरर संदेश दिखाएं
      toast.error(
        "An error occurred. Please check your connection or try again."
      );
    }
  }
};
// दस्तावेज़ जांचने के चरण (steps) प्राप्त करने के लिए असिंक्रोनस फ़ंक्शन
export const getDocument = async (selectedcourse) => {
  // छात्र आईडी सत्यापित करें
  if (!selectedcourse) {
    toast.error("Invalid student."); // यदि आईडी वैध नहीं है तो एरर दिखाएं
    return false; // प्रक्रिया को रोकें
  }

  // API के लिए FormData बनाएँ और आवश्यक डेटा जोड़ें
  const formData = new FormData();
  formData.append("data", "getDocument"); // API के लिए ऑपरेशन की पहचान करें
  // छात्र आईडी जोड़ें
  formData.append("selectedcourse", selectedcourse);

  try {
    // API को पोस्ट रिक्वेस्ट भेजें
    const response = await axios.post(
      `${PHP_API_URL}/StudentSet.php`, // API endpoint
      formData, // डेटा
      {
        headers: {
          "Content-Type": "multipart/form-data", // फॉर्म डेटा के लिए हेडर सेट करें
        },
      }
    );
    return response.data.data; // API से प्राप्त डेटा वापस लौटाएं
  } catch (error) {
    // एरर की हैंडलिंग करें
    const status = error.response?.data?.status;
    if (status === 400) {
      // यदि स्टेटस 400 है तो सर्वर की एरर संदेश दिखाएं
      toast.error(error.response.data.msg || "A server error occurred.");
    } else {
      // अन्य एरर के लिए जनरल एरर संदेश दिखाएं
      toast.error(
        "An error occurred. Please check your connection or try again."
      );
    }
  }
};
// दस्तावेज़ जांचने के चरण (steps) प्राप्त करने के लिए असिंक्रोनस फ़ंक्शन
export const checkDocumentStep = async (sid) => {
  // छात्र आईडी सत्यापित करें
  if (!sid) {
    toast.error("Invalid student."); // यदि आईडी वैध नहीं है तो एरर दिखाएं
    return false; // प्रक्रिया को रोकें
  }

  // API के लिए FormData बनाएँ और आवश्यक डेटा जोड़ें
  const formData = new FormData();
  formData.append("data", "checkDocumentStep"); // API के लिए ऑपरेशन की पहचान करें
  formData.append("sid", sid); // छात्र आईडी जोड़ें

  try {
    // API को पोस्ट रिक्वेस्ट भेजें
    const response = await axios.post(
      `${PHP_API_URL}/StudentSet.php`, // API endpoint
      formData, // डेटा
      {
        headers: {
          "Content-Type": "multipart/form-data", // फॉर्म डेटा के लिए हेडर सेट करें
        },
      }
    );
    return response.data.data; // API से प्राप्त डेटा वापस लौटाएं
  } catch (error) {
    // एरर की हैंडलिंग करें
    const status = error.response?.data?.status;
    if (status === 400) {
      // यदि स्टेटस 400 है तो सर्वर की एरर संदेश दिखाएं
      toast.error(error.response.data.msg || "A server error occurred.");
    } else {
      // अन्य एरर के लिए जनरल एरर संदेश दिखाएं
      toast.error(
        "An error occurred. Please check your connection or try again."
      );
    }
  }
};
// दस्तावेज़ जांचने के चरण (steps) प्राप्त करने के लिए असिंक्रोनस फ़ंक्शन
export const getEducation = async (selectedcourse, sid = 0) => {
  // छात्र आईडी सत्यापित करें
  if (!selectedcourse) {
    toast.error("Invalid student."); // यदि आईडी वैध नहीं है तो एरर दिखाएं
    return false; // प्रक्रिया को रोकें
  }

  // API के लिए FormData बनाएँ और आवश्यक डेटा जोड़ें
  const formData = new FormData();
  formData.append("data", "getEducation"); // API के लिए ऑपरेशन की पहचान करें
  formData.append("sid", sid); // API के लिए ऑपरेशन की पहचान करें
  formData.append("selectedcourse", selectedcourse); // छात्र आईडी जोड़ें

  try {
    // API को पोस्ट रिक्वेस्ट भेजें
    const response = await axios.post(
      `${PHP_API_URL}/StudentSet.php`, // API endpoint
      formData, // डेटा
      {
        headers: {
          "Content-Type": "multipart/form-data", // फॉर्म डेटा के लिए हेडर सेट करें
        },
      }
    );
    return response.data.data; // API से प्राप्त डेटा वापस लौटाएं
  } catch (error) {
    // एरर की हैंडलिंग करें
    const status = error.response?.data?.status;
    if (status === 400) {
      // यदि स्टेटस 400 है तो सर्वर की एरर संदेश दिखाएं
      toast.error(error.response.data.msg || "A server error occurred.");
    } else {
      // अन्य एरर के लिए जनरल एरर संदेश दिखाएं
      toast.error(
        "An error occurred. Please check your connection or try again."
      );
    }
  }
};
export const Step = () => {
  const [checkDocument, setcheckDocument] = useState([]);
  const [student, setstudent] = useState([]);
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  const sid = secureLocalStorage.getItem("studentId");
  useEffect(() => {
    getStudentSelectedCourse();
    getStudentSelectedDetail();
    if (sid) {
      studentRecordById(sid).then((res) => {
        if (res.length > 0) {
          setstudent(res[0]);
        }
      });
      checkDocumentStep(sid).then((res) => {
        if (res.length > 0) {
          setcheckDocument(res[0]);
        }
      });
    }
  }, [sid]);

  const [courseDetail, setCourseDetail] = useState();
  const [educationDetailFilled, setEducationDetailFilled] = useState(false);
  const getStudentSelectedCourse = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetch`,
        formData
      );

      if (response.data?.statusCode === 200) {
        let { preview, approved, id } = response.data?.data[0] || {};

        if (!id || (preview == 1 && approved == 1)) {
          setIsCourseSelected(false);
        } else {
          setIsCourseSelected(true);
        }
        setCourseDetail((prev) => ({
          ...prev,
          preview: response.data?.data[0]?.preview,
        }));
      }
    } catch (error) {}
  };

  const getStudentSelectedDetail = async () => {
    try {
      let formData = {};
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/courseType`,
        formData
      );
      if (response?.data?.statusCode === 200) {
        setCourseDetail((prev) => ({
          ...prev,
          semtitle: response?.data?.data[0]?.semtitle,
          level: response?.data?.data[0]?.level,
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (checkDocument && courseDetail)
      if (
        (checkDocument.plroll && courseDetail?.semtitle !== "semester 1") ||
        (courseDetail?.semtitle === "semester 1" &&
          courseDetail?.level == "UG" &&
          checkDocument?.hroll) ||
        (courseDetail?.semtitle === "semester 1" &&
          courseDetail?.level == "PG" &&
          checkDocument?.groll)
      ) {
        setEducationDetailFilled(true);
      }
  }, [checkDocument, courseDetail]);

  return (
    <>
      <ul className="progressbar mb-3">
        <li className={student.spincode ? "active" : ""}>Personal Details</li>
        <li className={isCourseSelected ? "active" : ""}>Course Selection</li>
        <li className={educationDetailFilled ? "active" : ""}>
          Educational Details
        </li>
        <li className={checkDocument.dtc ? "active" : ""}>Documents Upload</li>
        <li
          className={courseDetail?.preview && isCourseSelected ? "active" : ""}
        >
          Preview
        </li>
        {/* {progressData.preview === 0 && <li>Verification By College</li>}
            {progressData.preview === 1 && <li>Verification Pending</li>}
            {progressData.preview === 3 && <li className="active">Verification Completed</li>}
            {progressData.preview === 2 && <li>Rejected By College</li>} */}
      </ul>
    </>
  );
};
