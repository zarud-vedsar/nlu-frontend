import React, { useEffect, useState } from "react";
import { Step } from "../../site-components/student/GetData";
import "../../site-components/student/assets/css/custom.css"; // Importing custom CSS for styling.
import Select from "react-select";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import {
  capitalizeFirstLetter,
  dataFetchingPost,
} from "../../site-components/Helper/HelperFunction";
import { Link } from "react-router-dom";
function CourseSelection() {
  // Initial form state
  const initialForm = {
    id: "",
    studentId: "",
    courseid: "",
    semesterid: "",
    groupName: "",
    subGroupName: "",
    subject1: "",
    subject2: "",
    subject3: "",
    subject4: "",
    subject5: "",
    subject6: "",
    preview: "",
    approved: "",
  };
  const [newSemeterData,setNewSemesterData] = useState();
  const [formData, setFormData] = useState(initialForm); // Form state
  const [isSubmit, setIsSubmit] = useState(false); // Form submission state

  const [semesterListing, setSemesterListing] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [error, setError] = useState({ field: "", msg: "" }); // Error state

  const [compulsorySubListing, setCompulsorySubListing] = useState([]);
  const [electiveSubListing, setElectiveSubListing] = useState([]);
  const [optionalPaperSubListing, setOptionalPaperSubListing] = useState([]);
  const [seminarSubListing, setSeminarSubListing] = useState([]);

  const [
    compulsorySubListingWithGroupSubGroup,
    setCompulsorySubListingWithGroupSubGroup,
  ] = useState([]);

  const [courseListing, setCourseListing] = useState([]); // Form submission state
  const [groupListing, setGroupListing] = useState([]);
  const [subGroupListing, setSubGroupListing] = useState([]);

  const semesters = [
    "semester 1",
    "semester 2",
    "semester 3",
    "semester 4",
    "semester 5",
    "semester 6",
    "semester 7",
  ];

  const isSubjectAlreadySelected = (subject) => {
    const { subject1, subject2, subject3, subject4, subject5, subject6 } =
      formData;

    if (
      subject1 == subject.value ||
      subject2 == subject.value ||
      subject3 == subject.value ||
      subject4 == subject.value ||
      subject5 == subject.value ||
      subject6 == subject.value
    ) {
      toast.error(`${subject.label} is already selected`);
      return true;
    } else {
      return false;
    }
  };

  const courseListDropdown = async () => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/course/dropdown`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setCourseListing(response.data.data);
      } else {
        setCourseListing([]);
      }
    } catch (error) {
      setCourseListing([]);
    }
  };
  const getStudentSelectedCourse = async () => {
    try {
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/fetch`,
        formData
      );

      if (response.data?.statusCode === 200) {
        let {
          id,
          studentId,
          courseid,
          semesterid,
          groupName,
          subGroupName,
          subject1,
          subject2,
          subject3,
          subject4,
          subject5,
          subject6,
          preview,
          approved,
        } = response.data?.data?.[0] || {};

        

        setFormData((prev) => ({
          ...prev,
          id: id,
          studentId: studentId,
          courseid: courseid,
          semesterid: semesterid,
          groupName: groupName,
          subGroupName: subGroupName,
          subject1: subject1,
          subject2: subject2,
          subject3: subject3,
          subject4: subject4,
          subject5: subject5,
          subject6: subject6,
          preview: preview,
          approved: approved,
        }));

        setNewSemesterData({
          id: "",
    studentId: studentId,
    courseid: courseid,
    semesterid: "",
    groupName: "",
    subGroupName: "",
    subject1: "",
    subject2: "",
    subject3: "",
    subject4: "",
    subject5: "",
    subject6: "",
    preview: 0,
    approved: 0,
        })

        await fetchSemesterBasedOnCourse(courseid);


        await fetchSubGroupBasedOnCourseSemesterAndGroupName(
          courseid,
          semesterid,
          groupName
        );
        await fetchSubjectBasedOnCourseSemesterGroupNameAndSubGroupForEightSemester(
          courseid,
          semesterid,
          "Compulsory",
          groupName,
          subGroupName
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    const tempSelectedCourse = courseListing.find(
      (item) => item.id === parseInt(formData.courseid)
    );
    if (tempSelectedCourse) {
      setSelectedCourse(tempSelectedCourse.coursename.toLowerCase());
    } else {
      setSelectedCourse(null);
    }
  }, [courseListing, formData.courseid]);

  useEffect(() => {
    if (formData.semesterid && formData.approved===1) {
      let  tempSelectedSemester = semesterListing.find(
        (item) => item.id === parseInt(formData.semesterid)
      );
      if (tempSelectedSemester) {
        let semester = tempSelectedSemester.semtitle.toLowerCase(); 
        let parts = semester.split(" ");
        let number = parseInt(parts[1], 10);
        number++; 

        semester = `${parts[0]} ${number}`; 
        console.log(semester)
          let updatedSemester = semesterListing.find( 
          (item) => item.semtitle.toLowerCase() === semester 
        ) || tempSelectedSemester;
        console.log(updatedSemester.id)
        setFormData((prev)=>({...prev,...newSemeterData,semesterid:updatedSemester.id})) 
        setSelectedSemester(updatedSemester.semtitle.toLowerCase());
      }
    }
    
   else  if(formData.semesterid){
      const tempSelectedCourse = semesterListing.find(
        (item) => item.id === parseInt(formData.semesterid)
      );
      if (tempSelectedCourse) {
        setSelectedSemester(tempSelectedCourse.semtitle.toLowerCase());
      } else {
        setSelectedSemester(null);
      }
    }
     else {
      setSelectedSemester(null);
    }
  }, [semesterListing]);

  useEffect(() => {
    courseListDropdown();
    getStudentSelectedCourse();
  }, []);
  const fetchSemesterBasedOnCourse = async (courseid) => {
    console.log(courseid)
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester/fetch`,
        {
          courseid: courseid,
          column: "id, semtitle",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSemesterListing(response.data);
      } else {
        setSemesterListing([]);
      }
    } catch (error) {
      setSemesterListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const fetchGroupBasedOnCourseAndSemeter = async (courseid, semesterid) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          isGroup: "Yes",
          column: "id, groupName",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setGroupListing(response.data);
      } else {
        setGroupListing([]);
      }
    } catch (error) {
      setGroupListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubGroupBasedOnCourseSemesterAndGroupName = async (
    courseid,
    semesterid,
    groupName
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          groupName: groupName,
          isSubGroup: "Yes",
          column: "id, subGroupName",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        setSubGroupListing(response.data);
      } else {
        setSubGroupListing([]);
      }
    } catch (error) {
      setSubGroupListing([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const fetchSubjectBasedOnCourseAndSemeterUptoSevenSemester = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing(response.data);
          setFormData((prev) => ({
            ...prev,
            subject1: response.data[0]?.id,
            subject2: response.data[1]?.id,
            subject3: response.data[2]?.id,
            subject4: response.data[3]?.id,
            subject5: response.data[4]?.id,
            subject6: response.data[5]?.id,
          }));
        }
        if (subjectType === "Elective") {
          setElectiveSubListing(response.data);
          setFormData((prev) => ({
            ...prev,
            subject1: response.data[0]?.id,
            subject2: response.data[1]?.id,
            subject3: response.data[2]?.id,
            subject4: response.data[3]?.id,
            subject5: response.data[4]?.id,
            subject6: response.data[5]?.id,
          }));
        }
      } else {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "Compulsory") {
        setCompulsorySubListing([]);
      }
      if (subjectType === "Elective") {
        setElectiveSubListing([]);
      }

      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };

  const fetchSubjectBasedOnCourseAndSemeterEight = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing(response.data);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing(response.data);
        }
      } else {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "Compulsory") {
        setCompulsorySubListing([]);
      }
      if (subjectType === "Elective") {
        setElectiveSubListing([]);
      }
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnLLMAndSemeterOne = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing(response.data);
        }
        if (subjectType === "optional-paper") {
          setOptionalPaperSubListing(response.data);
        }
      } else {
        if (subjectType === "Compulsory") {
          setCompulsorySubListing([]);
        }
        if (subjectType === "optional-paper") {
          setOptionalPaperSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "Compulsory") {
        setCompulsorySubListing([]);
      }
      if (subjectType === "optional-paper") {
        setOptionalPaperSubListing([]);
      }
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnLLMAndSemeterTwo = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "optional-paper") {
          setOptionalPaperSubListing(response.data);
        }
      } else {
        if (subjectType === "optional-paper") {
          setOptionalPaperSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "optional-paper") {
        setOptionalPaperSubListing([]);
      }
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnCourseAndSemeterNine = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "Seminar") {
          setSeminarSubListing(response.data);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing(response.data);
        }
      } else {
        if (subjectType === "Seminar") {
          setSeminarSubListing([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "Seminar") {
        setSeminarSubListing([]);
      }
      if (subjectType === "Elective") {
        setElectiveSubListing([]);
      }
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnCourseAndSemeterTen = async (
    courseid,
    semesterid,
    subjectType
  ) => {
    if (
      !courseid ||
      !Number.isInteger(parseInt(courseid, 10)) ||
      parseInt(courseid, 10) <= 0
    )
      return;
    try {
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/semester-subject/fetch`,
        {
          courseid: courseid,
          semesterid: semesterid,
          subjectType: subjectType,
          column: "id, subject, subjectType",
        }
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        if (subjectType === "Seminar") {
          setSeminarSubListing(response.data);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing(response.data);
        }
      } else {
        if (subjectType === "Seminar") {
          setSeminarSubListing([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListing([]);
        }
      }
    } catch (error) {
      if (subjectType === "Seminar") {
        setSeminarSubListing([]);
      }
      if (subjectType === "Elective") {
        setElectiveSubListing([]);
      }
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const fetchSubjectBasedOnCourseSemesterGroupNameAndSubGroupForEightSemester =
    async (courseid, semesterid, subjectType, groupName, subGroupName) => {
      if (
        !courseid ||
        !Number.isInteger(parseInt(courseid, 10)) ||
        parseInt(courseid, 10) <= 0
      )
        return;
      try {
        const response = await dataFetchingPost(
          `${NODE_API_URL}/api/semester-subject/fetch`,
          {
            courseid: courseid,
            semesterid: semesterid,
            subjectType: subjectType,
            groupName: groupName,
            subGroupName: subGroupName,
            column: "id, subject",
          }
        );
        if (response?.statusCode === 200 && response.data.length > 0) {
          if (subjectType === "Compulsory") {
            setCompulsorySubListingWithGroupSubGroup(response.data);
          }
          if (subjectType === "Elective") {
            setElectiveSubListingWithGroupSubGroup(response.data);
          }
        } else {
          if (subjectType === "Compulsory") {
            setCompulsorySubListingWithGroupSubGroup([]);
          }
          if (subjectType === "Elective") {
            setElectiveSubListingWithGroupSubGroup([]);
          }
        }
      } catch (error) {
        if (subjectType === "Compulsory") {
          setCompulsorySubListingWithGroupSubGroup([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListingWithGroupSubGroup([]);
        }
        const statusCode = error.response?.data?.statusCode;
        if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
          toast.error(error.response.message || "A server error occurred.");
        } else {
          toast.error(
            "An error occurred. Please check your connection or try again."
          );
        }
      }
    };
  const fetchSubjectBasedOnCourseSemesterGroupNameAndSubGroupForNineSemester =
    async (courseid, semesterid, subjectType, groupName, subGroupName) => {
      if (
        !courseid ||
        !Number.isInteger(parseInt(courseid, 10)) ||
        parseInt(courseid, 10) <= 0
      )
        return;
      try {
        const response = await dataFetchingPost(
          `${NODE_API_URL}/api/semester-subject/fetch`,
          {
            courseid: courseid,
            semesterid: semesterid,
            subjectType: subjectType,
            groupName: groupName,
            subGroupName: subGroupName,
            column: "id, subject",
          }
        );
        if (response?.statusCode === 200 && response.data.length > 0) {
          if (subjectType === "Compulsory") {
            setCompulsorySubListingWithGroupSubGroup(response.data);
          }
          if (subjectType === "Elective") {
            setElectiveSubListingWithGroupSubGroup(response.data);
          }
        } else {
          if (subjectType === "Compulsory") {
            setCompulsorySubListingWithGroupSubGroup([]);
          }
          if (subjectType === "Elective") {
            setElectiveSubListingWithGroupSubGroup([]);
          }
        }
      } catch (error) {
        if (subjectType === "Compulsory") {
          setCompulsorySubListingWithGroupSubGroup([]);
        }
        if (subjectType === "Elective") {
          setElectiveSubListingWithGroupSubGroup([]);
        }
        const statusCode = error.response?.data?.statusCode;
        if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
          toast.error(error.response.message || "A server error occurred.");
        } else {
          toast.error(
            "An error occurred. Please check your connection or try again."
          );
        }
      }
    };

  const BallbSemesterOneToSeven = () => {
    return (
      <>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            isDisabled={true}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject1: selectedOption.value,
            //   });
            // }}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject1)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject2: selectedOption.value,
            //   });
            // }}
            isDisabled={true}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject2)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 3 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject3: selectedOption.value,
            //   });
            // }}
            isDisabled={true}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject3)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 4 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject4: selectedOption.value,
            //   });
            // }}
            isDisabled={true}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject4)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 5 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject5: selectedOption.value,
            //   });
            // }}
            isDisabled={true}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject5)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject5
                      ).subject
                    ),
                  }
                : { value: formData.subject5, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Subject 6 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            // onChange={(selectedOption) => {
            //   setFormData({
            //     ...formData,
            //     subject6: selectedOption.value,
            //   });
            // }}
            isDisabled={true}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject6)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject6
                      ).subject
                    ),
                  }
                : { value: formData.subject6, label: "Select" }
            }
          />
        </div>
      </>
    );
  };
  const BallbSemesterEight = () => {
    return (
      <>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Select Group <span className="text-danger">*</span>
          </label>
          <Select
            options={groupListing.map((item) => ({
              value: item,
              label: capitalizeFirstLetter(item),
            }))}
            onChange={(selectedOption) => {
              setFormData({
                ...formData,
                groupName: selectedOption.value,
              });
              resetSubGroup();
              fetchSubGroupBasedOnCourseSemesterAndGroupName(
                formData.courseid,
                formData.semesterid,
                selectedOption.value
              );
            }}
            value={
              groupListing.find((item) => item === formData.groupName)
                ? {
                    value: formData.groupName,
                    label: formData.groupName,
                  }
                : { value: formData.groupName, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Select Sub Group <span className="text-danger">*</span>
          </label>
          <Select
            options={subGroupListing.map((item) => ({
              value: item,
              label: capitalizeFirstLetter(item),
            }))}
            onChange={(selectedOption) => {
              setFormData({
                ...formData,
                subGroupName: selectedOption.value,
              });
              resetSubject();
              fetchSubjectBasedOnCourseSemesterGroupNameAndSubGroupForEightSemester(
                formData.courseid,
                formData.semesterid,
                "Compulsory",
                formData.groupName,
                selectedOption.value
              );
            }}
            value={
              subGroupListing.find((item) => item === formData.subGroupName)
                ? {
                    value: formData.subGroupName,
                    label: formData.subGroupName,
                  }
                : { value: formData.subGroupName, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListingWithGroupSubGroup.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject1: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListingWithGroupSubGroup.find(
                (item) => item.id === formData.subject1
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListingWithGroupSubGroup.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory Subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject2: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject2)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject3: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject3)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject4: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject4)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject4, label: "Select" }
            }
          />
        </div>
      </>
    );
  };
  const BallbSemesterNine = () => {
    return (
      <>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Select Group <span className="text-danger">*</span>
          </label>
          <Select
            options={groupListing.map((item) => ({
              value: item,
              label: capitalizeFirstLetter(item),
            }))}
            onChange={(selectedOption) => {
              setFormData({
                ...formData,
                groupName: selectedOption.value,
              });
              fetchSubGroupBasedOnCourseSemesterAndGroupName(
                formData.courseid,
                formData.semesterid,
                selectedOption.value
              );
            }}
            value={
              groupListing.find((item) => item === formData.groupName)
                ? {
                    value: formData.groupName,
                    label: formData.groupName,
                  }
                : { value: formData.groupName, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Select Sub Group <span className="text-danger">*</span>
          </label>
          <Select
            options={subGroupListing.map((item) => ({
              value: item,
              label: capitalizeFirstLetter(item),
            }))}
            onChange={(selectedOption) => {
              setFormData({
                ...formData,
                subGroupName: selectedOption.value,
              });
              fetchSubjectBasedOnCourseSemesterGroupNameAndSubGroupForNineSemester(
                formData.courseid,
                formData.semesterid,
                "Compulsory",
                formData.groupName,
                selectedOption.value
              );
            }}
            value={
              subGroupListing.find((item) => item === formData.subGroupName)
                ? {
                    value: formData.subGroupName,
                    label: formData.subGroupName,
                  }
                : { value: formData.subGroupName, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListingWithGroupSubGroup.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject1: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListingWithGroupSubGroup.find(
                (item) => item.id === formData.subject1
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListingWithGroupSubGroup.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Seminar Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={seminarSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject2: selectedOption.value,
                });
              }
            }}
            value={
              seminarSubListing.find((item) => item.id === formData.subject2)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      seminarSubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject3: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject3)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>
        <div className="col-md-6 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject4: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject4)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject4, label: "Select" }
            }
          />
        </div>
      </>
    );
  };
  const BallbSemesterTen = () => {
    return (
      <>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Seminar Subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={seminarSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject1: selectedOption.value,
                });
              }
            }}
            value={
              seminarSubListing.find((item) => item.id === formData.subject1)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      seminarSubListing.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Seminar Subject 3 <span className="text-danger">*</span>
          </label>
          <Select
            options={seminarSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject2: selectedOption.value,
                });
              }
            }}
            value={
              seminarSubListing.find((item) => item.id === formData.subject2)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      seminarSubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Seminar Subject 4 <span className="text-danger">*</span>
          </label>
          <Select
            options={seminarSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject3: selectedOption.value,
                });
              }
            }}
            value={
              seminarSubListing.find((item) => item.id === formData.subject3)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      seminarSubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>

        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 5 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject4: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject4)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject4, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 6 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject5: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject5)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject5
                      ).subject
                    ),
                  }
                : { value: formData.subject5, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Elective Subject 7 <span className="text-danger">*</span>
          </label>
          <Select
            options={electiveSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject6: selectedOption.value,
                });
              }
            }}
            value={
              electiveSubListing.find((item) => item.id === formData.subject6)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      electiveSubListing.find(
                        (item) => item.id === formData.subject6
                      ).subject
                    ),
                  }
                : { value: formData.subject6, label: "Select" }
            }
          />
        </div>
      </>
    );
  };

  const LlmSemesterOne = () => {
    return (
      <>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory subject 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject1: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject1)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory subject 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject2: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject2)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Compulsory subject 3 <span className="text-danger">*</span>
          </label>
          <Select
            options={compulsorySubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject3: selectedOption.value,
                });
              }
            }}
            value={
              compulsorySubListing.find((item) => item.id === formData.subject3)
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      compulsorySubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Option Paper 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject4: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject4
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject4, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Optional Paper 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject5: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject5
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject5
                      ).subject
                    ),
                  }
                : { value: formData.subject5, label: "Select" }
            }
          />
        </div>
      </>
    );
  };
  const LlmSemesterTwo = () => {
    return (
      <>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Option Paper 1 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject1: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject1
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject1
                      ).subject
                    ),
                  }
                : { value: formData.subject1, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Optional Paper 2 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject2: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject2
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject2
                      ).subject
                    ),
                  }
                : { value: formData.subject2, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Optional Paper 3 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject3: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject3
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject3
                      ).subject
                    ),
                  }
                : { value: formData.subject3, label: "Select" }
            }
          />
        </div>
        <div className="col-md-4 col-12 form-group">
          <label className="font-weight-semibold">
            Optional Paper 4 <span className="text-danger">*</span>
          </label>
          <Select
            options={optionalPaperSubListing.map((item) => ({
              value: item.id,
              label: capitalizeFirstLetter(item.subject),
            }))}
            onChange={(selectedOption) => {
              if (!isSubjectAlreadySelected(selectedOption)) {
                setFormData({
                  ...formData,
                  subject4: selectedOption.value,
                });
              }
            }}
            value={
              optionalPaperSubListing.find(
                (item) => item.id === formData.subject4
              )
                ? {
                    value: formData.subject,
                    label: capitalizeFirstLetter(
                      optionalPaperSubListing.find(
                        (item) => item.id === formData.subject4
                      ).subject
                    ),
                  }
                : { value: formData.subject4, label: "Select" }
            }
          />
        </div>
      </>
    );
  };

  const errorMsg = (field, msg) => {
    setError((prev) => ({
      ...prev,
      field: field,
      msg: msg,
    }));
  };

  const isSubjectValidBasedOnSemester = () => {
    const {
      groupName,
      subGroupName,
      subject1,
      subject2,
      subject3,
      subject4,
      subject5,
      subject6,
    } = formData;
    if (selectedCourse === "B.A. LL.B. (Hons.)".toLowerCase()) {
      if (semesters.includes(selectedSemester)) {
        if (
          !subject1 ||
          !subject2 ||
          !subject3 ||
          !subject4 ||
          !subject5 ||
          !subject6
        ) {
          toast.error("Please fill required field");
          return false;
        }
      }
      if (selectedSemester === "semester 8".toLowerCase()) {
        if (
          !groupName ||
          !subGroupName ||
          !subject1 ||
          !subject2 ||
          !subject3 ||
          !subject4
        ) {
          toast.error("Please fill required field");
          return false;
        }
      }
      if (selectedSemester === "semester 9".toLowerCase()) {
        if (
          !groupName ||
          !subGroupName ||
          !subject1 ||
          !subject2 ||
          !subject3 ||
          !subject4
        ) {
          toast.error("Please fill required field");
          return false;
        }
      }
      if (selectedSemester === "semester 10".toLowerCase()) {
        if (
          !subject1 ||
          !subject2 ||
          !subject3 ||
          !subject4 ||
          !subject5 ||
          !subject6
        ) {
          toast.error("Please fill required field");
          return false;
        }
      }
    }
    if (selectedCourse === "LL.M.".toLowerCase()) {
      if (selectedSemester === "semester 1".toLowerCase()) {
        if (!subject1 || !subject2 || !subject3 || !subject4 || !subject5) {
          toast.error("Please fill required field");
          return false;
        }
      }
      if (selectedSemester === "semester 2".toLowerCase()) {
        if (!subject1 || !subject2 || !subject3 || !subject4) {
          toast.error("Please fill required field");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    errorMsg("", "");
    if (!formData.courseid) {
      errorMsg("courseid", "Course is required.");
      toast.error("Course is required.");
      return setIsSubmit(false);
    }

    if (!formData.semesterid) {
      errorMsg("semesterid", "Semester is required.");
      toast.error("Semester is required.");
      return setIsSubmit(false);
    }

    let subjectIsValid = isSubjectValidBasedOnSemester();
   
    if (!subjectIsValid) {
      return setIsSubmit(false);
    }
    try {
      formData.studentId = secureLocalStorage.getItem("studentId");
      formData.login_type = "student";
      const response = await axios.post(
        `${NODE_API_URL}/api/course-selection/register`,
        formData
      );

      if (
        response.data?.statusCode === 200 ||
        response.data?.statusCode === 201
      ) {
        errorMsg("", "");
        setFormData((prev)=>({...prev,id:1}))
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      const errorField = error.response?.data?.errorField;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        if (errorField) errorMsg(errorField, error.response?.data?.message);
        toast.error(error.response.data.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    if (selectedCourse === "B.A. LL.B. (Hons.)".toLowerCase()) {
      if (semesters.includes(selectedSemester)) {
        fetchSubjectBasedOnCourseAndSemeterUptoSevenSemester(
          formData.courseid,
          formData.semesterid,
          "Compulsory"
        );
      }
      if (selectedSemester === "semester 8".toLowerCase()) {
        fetchGroupBasedOnCourseAndSemeter(
          formData.courseid,
          formData.semesterid
        );
        fetchSubjectBasedOnCourseAndSemeterEight(
          formData.courseid,
          formData.semesterid,
          "Compulsory"
        );
        fetchSubjectBasedOnCourseAndSemeterEight(
          formData.courseid,
          formData.semesterid,
          "Elective"
        );
      }
      if (selectedSemester === "semester 9".toLowerCase()) {
        fetchGroupBasedOnCourseAndSemeter(
          formData.courseid,
          formData.semesterid
        );
        fetchSubjectBasedOnCourseAndSemeterNine(
          formData.courseid,
          formData.semesterid,
          "Seminar"
        );
        fetchSubjectBasedOnCourseAndSemeterNine(
          formData.courseid,
          formData.semesterid,
          "Elective"
        );
      }
      if (selectedSemester === "semester 10".toLowerCase()) {
        fetchSubjectBasedOnCourseAndSemeterTen(
          formData.courseid,
          formData.semesterid,
          "Seminar"
        );
        fetchSubjectBasedOnCourseAndSemeterTen(
          formData.courseid,
          formData.semesterid,
          "Elective"
        );
      }
    }
    if (selectedCourse === "LL.M.".toLowerCase()) {
      if (selectedSemester === "semester 1".toLowerCase()) {
        fetchSubjectBasedOnLLMAndSemeterOne(
          formData.courseid,
          formData.semesterid,
          "Compulsory"
        );
        fetchSubjectBasedOnLLMAndSemeterOne(
          formData.courseid,
          formData.semesterid,
          "optional-paper"
        );
      }
      if (selectedSemester === "semester 2".toLowerCase()) {
        fetchSubjectBasedOnLLMAndSemeterTwo(
          formData.courseid,
          formData.semesterid,
          "optional-paper"
        );
      }
    }
  }, [selectedSemester]);

  const resetSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subject1: "",
      subject2: "",
      subject3: "",
      subject4: "",
      subject5: "",
      subject6: "",
    }));
    setCompulsorySubListingWithGroupSubGroup([]);
  };
  const resetSubGroup = () => {
    setFormData((prev) => ({
      ...prev,
      subGroupName: "",
    }));
    resetSubject();
    setSubGroupListing([]);
  };
  const resetGroup = () => {
    setFormData((prev) => ({
      ...prev,

      groupName: "",
    }));
    resetSubGroup();
    setGroupListing([]);
  };
  const resetAll = () => {
    setFormData((prev) => ({
      ...prev,
      subject1: "",
      subject2: "",
      subject3: "",
      subject4: "",
      subject5: "",
      subject6: "",
      groupName: "",
      subGroupName: "",
    }));
    setCompulsorySubListing([]);
    setElectiveSubListing([]);
    setOptionalPaperSubListing([]);
    setSeminarSubListing([]);
    setCompulsorySubListingWithGroupSubGroup([]);
    setGroupListing([]);
    setSubGroupListing([]);
  };
  const resetSemester = () => {
    setFormData((prev) => ({
      ...prev,
      semesterid: "",
    }));
    resetAll();
    setSemesterListing([]);
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 text-center">
                <Step /> {/* Step component rendering */}
              </div>
              <div className="col-md-12 col-lg-12 col-12 col-sm-12 mx-auto">
                <div className="card bg-transparent">
                  <div className="card-header px-0 mb-0 d-flex justify-content-between align-items-center">
                    <div>
                      <a href="/student" className="btn btn-primary">
                        <i className="fas fa-arrow-left"></i> Previous
                      </a>
                    </div>
                    {formData.id && (
                      <div>
                        <Link
                          to="/student/qualification"
                          className="btn btn-secondary"
                        >
                          Educational Details{" "}
                          <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title h6_new">Course Selection</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 form-group">
                          <label className="font-weight-semibold">
                            Course <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={courseListing.map((item) => ({
                              value: item.id,
                              label: item.coursename,
                            }))}
                            onChange={(selectedOption) => {
                              if (!selectedSemester || selectedSemester == "semester 1") {
                                setFormData({
                                  ...formData,
                                  courseid: selectedOption.value,
                                });
                                setSelectedCourse(
                                  selectedOption.label.toLowerCase()
                                );
                                resetSemester();

                                fetchSemesterBasedOnCourse(
                                  selectedOption.value
                                );
                              }
                            }}
                            value={
                              courseListing.find(
                                (item) =>
                                  item.id === parseInt(formData.courseid)
                              )
                                ? {
                                    value: parseInt(formData.courseid),
                                    label: courseListing.find(
                                      (item) =>
                                        item.id === parseInt(formData.courseid)
                                    ).coursename,
                                  }
                                : { value: formData.courseid, label: "Select" }
                            }
                          />

                          {error.field === "courseid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>

                        <div className="col-md-12 form-group">
                          <label className="font-weight-semibold">
                            Semester <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={[
                              {
                                value: semesterListing[0]?.id,
                                label: capitalizeFirstLetter(semesterListing[0]?.semtitle),
                              }
                            ]}
                            onChange={(selectedOption) => {
                              if(!selectedSemester){
                              setFormData((prev) => ({
                                ...prev,
                                semesterid: selectedOption.value,
                              }));
                              setSelectedSemester(
                                selectedOption.label.toLowerCase()
                              );
                              resetGroup();
                            }
                            }}
                            value={
                              semesterListing.find(
                                (item) => item.id === formData.semesterid
                              )
                                ? {
                                    value: formData.semesterid,
                                    label: capitalizeFirstLetter(
                                      semesterListing.find(
                                        (item) =>
                                          item.id === formData.semesterid
                                      ).semtitle
                                    ),
                                  }
                                : {
                                    value: formData.semesterid,
                                    label: "Select",
                                  }
                            }
                          />
                          {error.field === "semesterid" && (
                            <span className="text-danger">{error.msg}</span>
                          )}
                        </div>
                        {selectedCourse == "B.A. LL.B. (Hons.)".toLowerCase() &&
                          ((semesters.includes(selectedSemester) && (
                            <BallbSemesterOneToSeven />
                          )) ||
                            (selectedSemester ===
                              "semester 8".toLowerCase() && (
                              <BallbSemesterEight />
                            )) ||
                            (selectedSemester ===
                              "semester 9".toLowerCase() && (
                              <BallbSemesterNine />
                            )) ||
                            (selectedSemester ===
                              "semester 10".toLowerCase() && (
                              <BallbSemesterTen />
                            )))}
                        {selectedCourse == "LL.M.".toLowerCase() &&
                          ((selectedSemester === "semester 1".toLowerCase() && (
                            <LlmSemesterOne />
                          )) ||
                            (selectedSemester ===
                              "semester 2".toLowerCase() && (
                              <LlmSemesterTwo />
                            )))}

                        <div className="col-md-12 col-lg-12 col-12">
                          {!isSubmit ? (
                            <button
                              className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                              type="submit"
                            >
                              Save{" "}
                            </button>
                          ) : (
                            <button
                              className="btn btn-dark btn-block d-flex justify-content-center align-items-center"
                              type="submit"
                              disabled
                            >
                              Saving &nbsp;{" "}
                              <div className="loader-circle"></div>
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseSelection;
