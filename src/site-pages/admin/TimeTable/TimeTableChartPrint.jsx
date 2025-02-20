import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import rpnl_logo from "../../../site-components/website/assets/Images/rpnl_logo_white.png";
import { capitalizeAllLetters, capitalizeEachLetter, goBack } from "../../../site-components/Helper/HelperFunction";
import axios from "axios";
import "./print.css";
import { NODE_API_URL } from "../../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
function TimeTableChartPrint() {
  const { timeChartId } = useParams();
  const [timeList, setTimeList] = useState([]);
  const ftechChartList = async (dbId) => {
    try {
      const response = await axios.get(`${NODE_API_URL}/api/time-table/table-chart/chart-complete-by-id/${dbId}`);
      if (response.data?.statusCode === 200 && response.data.data.length > 0) {
        setTimeList(response.data.data[0]);
      } else {
        toast.error("Course not found.");
        setTimeList([]);
      }
    } catch (error) {
      setTimeList([]);
    }
  };
  useEffect(() => {
    ftechChartList(timeChartId);
  }, [timeChartId]);
  const handleDownload = async () => {
    const element = document.getElementById("jsx-template");
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2, // Increases resolution
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save("document.pdf");
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <a href="./" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" /> Dashboard
                  </a>
                  <span className="breadcrumb-item">Time Table Management</span>
                  <span className="breadcrumb-item active">
                    Time Table Chart Print
                  </span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2 px-0">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Time Table Chart Print</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 goback mr-2"
                    onClick={goBack}
                  >
                    <i className="fas fa-arrow-left"></i> Go Back
                  </button>
                  {/* Print Button */}
                  <button
                    onClick={handleDownload}
                    className="ml-auto btn border-0 btn-primary"
                  >
                    <i className="fas fa-download"></i> Download
                  </button>
                </div>
              </div>
            </div>

            {/* Timetable Section to Print */}
            <div className="row d-flex justify-content-center">
              <div className="col-md-12">
                <div className="container-page" id="jsx-template">
                  <div className="page">
                    <header className="head">
                      <div className="head-data">
                        <h1>
                          {" "}
                          Dr. Rajendra Prasad National Law University, <br />{" "}
                          Prayagraj
                        </h1>
                        <img src={rpnl_logo} />
                        <h1 style={{ textAlign: "end" }}>
                          डॉ राजेन्द्र प्रसाद राष्ट्रीय विधि विश्वविद्यालय,{" "}
                          <br /> प्रयागराज
                        </h1>
                      </div>
                    </header>
                    <div className="taxe">
                      <h3>
                        {" "}
                        TIME-TABLE |{" "}
                        {timeList?.chartDetail?.semtitle
                          ? capitalizeAllLetters(
                            timeList?.chartDetail?.semtitle
                          )
                          : timeList?.chartDetail?.semtitle}{" "}
                        ({" "}
                        {timeList?.chartDetail?.coursename
                          ? capitalizeAllLetters(
                            timeList?.chartDetail?.coursename
                          )
                          : timeList?.chartDetail?.coursename}{" "}
                        ) |{" "}
                        {timeList?.chartDetail?.classroom
                          ? capitalizeAllLetters(
                            timeList?.chartDetail?.classroom
                          )
                          : timeList?.chartDetail?.classroom}{" "}
                      </h3>
                    </div>
                    <table className="table-cs">
                      <tbody>
                        <tr className="table1">
                          <th className="tstart f14"> DAY</th>
                          <th> {timeList?.time?.time1?.dtitle}</th>
                          <th> {timeList?.time?.time2?.dtitle}</th>
                          <th
                            rowSpan={
                              timeList?.subjects?.time1subject6?.subject ? 7 : 6
                            }
                            className="tab1"
                          >
                            <p className="rotateVer">BREAK</p>
                          </th>
                          <th> {timeList?.time?.time3?.dtitle}</th>
                          <th> {timeList?.time?.time4?.dtitle}</th>
                          <th
                            rowSpan={
                              timeList?.subjects?.time1subject6?.subject ? 7 : 6
                            }
                            className="tab1"
                          >
                            <p className="rotateVer">LUNCH BREAK</p>
                          </th>
                          <th> {timeList?.time?.time5?.dtitle}</th>
                          <th> {timeList?.time?.time6?.dtitle}</th>
                          <th> {timeList?.time?.time7?.dtitle}</th>
                        </tr>
                        <tr>
                          <th className="tstart f14"> Monday </th>
                          <td>
                            {" "}
                            {timeList?.subjects?.time1subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time1subject1?.subject
                              )
                              : timeList?.subjects?.time1subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time2subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time2subject1?.subject
                              )
                              : timeList?.subjects?.time2subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time3subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time3subject1?.subject
                              )
                              : timeList?.subjects?.time3subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time4subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time4subject1?.subject
                              )
                              : timeList?.subjects?.time4subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time5subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time5subject1?.subject
                              )
                              : timeList?.subjects?.time5subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time6subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time6subject1?.subject
                              )
                              : timeList?.subjects?.time6subject1?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time7subject1?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time7subject1?.subject
                              )
                              : timeList?.subjects?.time7subject1?.subject}
                          </td>
                        </tr>
                        <tr>
                          <th className="tstart f14">Tuesday </th>
                          <td>
                            {" "}
                            {timeList?.subjects?.time1subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time1subject2?.subject
                              )
                              : timeList?.subjects?.time1subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time2subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time2subject2?.subject
                              )
                              : timeList?.subjects?.time2subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time3subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time3subject2?.subject
                              )
                              : timeList?.subjects?.time3subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time4subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time4subject2?.subject
                              )
                              : timeList?.subjects?.time4subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time5subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time5subject2?.subject
                              )
                              : timeList?.subjects?.time5subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time6subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time6subject2?.subject
                              )
                              : timeList?.subjects?.time6subject2?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time7subject2?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time7subject2?.subject
                              )
                              : timeList?.subjects?.time7subject2?.subject}
                          </td>
                        </tr>
                        <tr>
                          <th className="tstart f14">Wednesday </th>
                          <td>
                            {" "}
                            {timeList?.subjects?.time1subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time1subject3?.subject
                              )
                              : timeList?.subjects?.time1subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time2subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time2subject3?.subject
                              )
                              : timeList?.subjects?.time2subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time3subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time3subject3?.subject
                              )
                              : timeList?.subjects?.time3subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time4subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time4subject3?.subject
                              )
                              : timeList?.subjects?.time4subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time5subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time5subject3?.subject
                              )
                              : timeList?.subjects?.time5subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time6subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time6subject3?.subject
                              )
                              : timeList?.subjects?.time6subject3?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time7subject3?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time7subject3?.subject
                              )
                              : timeList?.subjects?.time7subject3?.subject}
                          </td>
                        </tr>
                        <tr>
                          <th className="tstart f14">Thursday </th>
                          <td>
                            {" "}
                            {timeList?.subjects?.time1subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time1subject4?.subject
                              )
                              : timeList?.subjects?.time1subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time2subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time2subject4?.subject
                              )
                              : timeList?.subjects?.time2subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time3subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time3subject4?.subject
                              )
                              : timeList?.subjects?.time3subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time4subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time4subject4?.subject
                              )
                              : timeList?.subjects?.time4subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time5subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time5subject4?.subject
                              )
                              : timeList?.subjects?.time5subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time6subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time6subject4?.subject
                              )
                              : timeList?.subjects?.time6subject4?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time7subject4?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time7subject4?.subject
                              )
                              : timeList?.subjects?.time7subject4?.subject}
                          </td>
                        </tr>
                        <tr>
                          <th className="tstart f14">Friday </th>
                          <td>
                            {" "}
                            {timeList?.subjects?.time1subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time1subject5?.subject
                              )
                              : timeList?.subjects?.time1subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time2subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time2subject5?.subject
                              )
                              : timeList?.subjects?.time2subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time3subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time3subject5?.subject
                              )
                              : timeList?.subjects?.time3subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time4subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time4subject5?.subject
                              )
                              : timeList?.subjects?.time4subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time5subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time5subject5?.subject
                              )
                              : timeList?.subjects?.time5subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time6subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time6subject5?.subject
                              )
                              : timeList?.subjects?.time6subject5?.subject}
                          </td>
                          <td>
                            {" "}
                            {timeList?.subjects?.time7subject5?.subject
                              ? capitalizeEachLetter(
                                timeList?.subjects?.time7subject5?.subject
                              )
                              : timeList?.subjects?.time7subject5?.subject}
                          </td>
                        </tr>

                        {timeList?.subjects?.time1subject6?.subject ? (
                          <tr>
                            <th className="tstart f14">Saturday </th>
                            <td>
                              {" "}
                              {timeList?.subjects?.time1subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time1subject6?.subject
                                )
                                : timeList?.subjects?.time1subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time2subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time2subject6?.subject
                                )
                                : timeList?.subjects?.time2subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time3subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time3subject6?.subject
                                )
                                : timeList?.subjects?.time3subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time4subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time4subject6?.subject
                                )
                                : timeList?.subjects?.time4subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time5subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time5subject6?.subject
                                )
                                : timeList?.subjects?.time5subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time6subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time6subject6?.subject
                                )
                                : timeList?.subjects?.time6subject6?.subject}
                            </td>
                            <td>
                              {" "}
                              {timeList?.subjects?.time7subject6?.subject
                                ? capitalizeEachLetter(
                                  timeList?.subjects?.time7subject6?.subject
                                )
                                : timeList?.subjects?.time7subject6?.subject}
                            </td>
                          </tr>
                        ) : (
                          <tr className="sat">
                            <th> Saturday </th>
                            <th colSpan={9}>
                              {" "}
                              VALUE-ADDED COURSES/EXTRA-CURRICULAR
                              ACTIVITIES/CO-CURRICULAR ACTIVITIES ETC.
                            </th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <footer className="footer">
                      <p>
                        {" "}
                        <strong>Course Instructors: </strong>
                        {timeList?.instructor &&
                          timeList?.instructor.length > 0 &&
                          timeList?.instructor.map((item) => (
                            <>
                              <strong>
                                {item.subjectName
                                  ? capitalizeEachLetter(item.subjectName)
                                  : item.subjectName}{" "}
                              </strong>{" "}
                              -{" "}
                              {item.facultyName
                                ? capitalizeEachLetter(item.facultyName)
                                : item.facultyName},
                              &nbsp;&nbsp;
                            </>
                          ))}
                      </p>
                    </footer>
                    <p className="para">
                      Time-Table Coordinator <br />
                      RPNLU, Prayagraj
                    </p>
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

export default TimeTableChartPrint;
