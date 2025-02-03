import React, { useEffect, useState } from 'react'
import { studentRecordById } from '../../site-components/student/GetData';
import { Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage"; // Importing secure storage for storing sensitive data.
import { FILE_API_URL } from '../../site-components/Helper/Constant';
import { capitalizeFirstLetter } from '../../site-components/Helper/HelperFunction';
function Profile() {
    // State declarations
    const [student, setstudent] = useState([]); // For storing student details.
    const sid = secureLocalStorage.getItem('studentId'); // Retrieving student ID from secure local storage.
    const [previewSpic, setPreviewSpic] = useState(null); // For previewing student photo.
    const [previewSsign, setPreviewSsign] = useState(null); // For previewing signature.
    const [previewAadhaarFront, setPreviewAadhaarFront] = useState(null); // For previewing Aadhaar front.
    const [previewAadhaarBack, setPreviewAadhaarBack] = useState(null); // For previewing Aadhaar back.
    // useEffect to fetch student data if student ID exists
    useEffect(() => {
        if (sid) {
            studentRecordById(sid).then((res) => {
                if (res.length > 0) {
                    setstudent(res[0]); // Set fetched student data in state.
                    if (res[0].spic) {
                        setPreviewSpic(`${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].spic}`);
                    }
                    if (res[0].ssign) {
                        setPreviewSsign(`${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].ssign}`);
                    }
                    if (res[0].aadhaarfront) {
                        setPreviewAadhaarFront(`${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].aadhaarfront}`);
                    }
                    if (res[0].aadhaarback) {
                        setPreviewAadhaarBack(`${FILE_API_URL}/student/${res[0].id}${res[0].registrationNo}/${res[0].aadhaarback}`);
                    }
                }
            });
        }
    }, [sid]); // Dependency array ensures effect runs when sid changes.
    return (
        <>
            <div className="page-container">
                <div className="main-content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-header mb-0 d-flex justify-content-between align-items-center">
                                <h6 className="card-title h6_new">Enrollment No: {student?.enrollmentNo}</h6>
                                <div><Link to="/student/" className="btn btn-primary"><i className="fas fa-arrow-left"></i> Home</Link></div>

                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h6 className="custom"><span className="custo-head">Personal Details</span></h6>
                                    </div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Name:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sname)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Date Of Birth:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.sdob}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Father's Name:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sfather)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Mother's Name:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.smother)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Gender:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sgender)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Religion:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sreligion)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Category:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.scategory)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Caste:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.scaste)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Sub Caste:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.ssubcaste)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">ABC Id:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sabcid)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Aadhaar No:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.saadhaar}</p></div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-12">
                                        <h6 className="custom mt-3"><span className="custo-head">Contact Details</span></h6>
                                    </div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Email:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.semail}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Phone No.:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.sphone}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Alternate Phone No.:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.salterphone}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Whatsapp No:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.swhatsapp}</p></div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-12">
                                        <h6 className="custom mt-3"><span className="custo-head">Address</span></h6>
                                    </div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Address:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.saddress}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">Pin Code:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{student?.spincode}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">City:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.scity)}</p></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><label className="font-weight-semibold">State:</label></div>
                                    <div className='col-md-2 col-lg-2 col-6 col-sm-6'><p>{capitalizeFirstLetter(student?.sstate)}</p></div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-3 col-lg-3 col-12 col-sm-12 mb-2'><label className="font-weight-semibold">Photograph:</label>
                                        <img src={previewSpic} className='img-fluid mt-2' />
                                    </div>
                                    <div className='col-md-3 col-lg-3 col-12 col-sm-12 mb-2'><label className="font-weight-semibold">Signature:</label>
                                        <img src={previewSsign} className='img-fluid mt-2' />
                                    </div>
                                    <div className='col-md-3 col-lg-3 col-12 col-sm-12 mb-2'><label className="font-weight-semibold">Aadhaar Front Picture:</label>
                                        <img src={previewAadhaarFront} className='img-fluid mt-2' />
                                    </div>
                                    <div className='col-md-3 col-lg-3 col-12 col-sm-12 mb-2'><label className="font-weight-semibold">Aadhaar Back Picture:</label>
                                        <img src={previewAadhaarBack} className='img-fluid mt-2' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile