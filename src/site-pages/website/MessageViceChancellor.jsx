import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PHP_API_URL,
  NODE_API_URL,
  FILE_API_URL,
} from "../../site-components/Helper/Constant";
import { FaAngleRight } from "react-icons/fa6";
import { useParams, Link } from "react-router-dom";
import { dataFetchingGet } from "../../site-components/Helper/HelperFunction";
import validator from "validator";
const MessageViceChancellor = () => {
  const [facultyData, setFacultyData] = useState();
  const { id } = useParams();
  const fetchDepartment = async (id) => {
    try {
      const bformData = new FormData();
      const response = await axios.post(
        `${NODE_API_URL}/api/department/fetch`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data.data;
      const department = result.find((dept) => dept.id === id);
      if (department) {
        setFacultyData((prevData) => ({
          ...prevData,
          departmentid: department.dtitle,
        }));
      }
    } catch (e) {}
  };

  const fetchDesignationList = async (id) => {
    const deleteStatus = 0;
    try {
      const response = await dataFetchingGet(
        `${NODE_API_URL}/api/designation/retrieve-all-designation-with-department/${deleteStatus}`
      );
      if (response?.statusCode === 200 && response.data.length > 0) {
        const result = response.data;
        const designation = result.find((des) => des.id === id);
        if (designation) {
          setFacultyData((prevData) => ({
            ...prevData,
            designationid: designation.title,
          }));
        } else {
        }
      }
    } catch (error) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        console(error.response.message || "A server error occurred.");
      }
    }
  };
  const loadFacultyData = async () => {
    try {
      const bformData = new FormData();
      bformData.append("data", "fetch_user");
      bformData.append("update_id", id);
      const response = await axios.post(
        `${PHP_API_URL}/faculty.php`,
        bformData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFacultyData(response.data.data[0]);
      fetchDepartment(response.data.data[0].departmentid);
      fetchDesignationList(response.data.data[0].designationid);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      loadFacultyData();
    }
  }, [id]);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">MESSAGE FROM THE
                Vice-Chancellor</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>
                      <span>People</span> <FaAngleRight />
                    </li>
                    <li>
                      {" "}
                      <Link to="/faculty">Faculty</Link> <FaAngleRight />{" "}
                    </li>
                    <li>
                      <span>Vice Chancellor</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {facultyData && (
        <section className="container section-padding">
          <div className="contentttr">
            <div className="imagecont">
              <img
                src={
                  facultyData.avtar
                    ? `${FILE_API_URL}/user/${facultyData.uid}/${facultyData.avtar}`
                    : `${FILE_API_URL}/user/dummy.webp`
                }
                alt="faculty image"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "2px",
                }}
              />
            </div>
            <div className="informationttx">
              {facultyData?.first_name && (
                <p className="fac-del-heading source-font">{`${facultyData?.first_name}  ${facultyData?.last_name}`}</p>
              )}
              {facultyData.designationid && (
                <p className="fac-del-heading1">{facultyData.designationid}</p>
              )}

              {/* {facultyData.departmentid && (
                  <p style={{ marginTop: "5px" }}>{facultyData.departmentid}</p>
                )} */}
              {facultyData.qualification && (
                <div className="exitem mt-3">
                  <span className="facddt">Qualification</span>
                  <p>{`${facultyData.qualification}`}</p>
                </div>
              )}

              {facultyData.specialization && (
                <div className="exitem">
                  <span className="facddt">Specialization</span>
                  <p>{`${facultyData.specialization}`}</p>
                </div>
              )}
              <div className="secdev topbr">
                {facultyData.exp_yrs && (
                  <div className="exitem borright">
                    <span className="facddt">Experience</span>
                    <p>{`${facultyData.exp_yrs}`}</p>
                  </div>
                )}
                <div className="phhbx">
                  {facultyData?.show_email_on_website && facultyData.u_email ? (
                    <p style={{ color: "#fff" }}>
                      Email : {facultyData.u_email}
                    </p>
                  ) : null}

                  {facultyData?.show_contact_on_website &&
                  facultyData.u_phone ? (
                    <p style={{ color: "#fff" }}>
                      Phone : {facultyData.u_phone}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="description">
            <div className="profhdd source-font">Profile</div>
           
              <div>
              <p className="mb-3" style={{ textAlign: 'justify' }}>Senior Professor Usha Tandon is Professor of Environmental Law, Gender Justice, Family Law and Alternative Dispute Resolution. A widely acclaimed professional, she is a recognised scholar for her work on human development.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>With the teaching experience of more than three decades, she is known for her outstanding contributions in the fields of environmental protection and women empowerment. Her book on Population Law in India (2003) is the only book of its kind which covers various population issues through the perspective of law and has been referred to extensively in India and abroad.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>As a Member of coveted statutory bodies such as Legal Education Committee, Bar Council of India; General Body, National Judicial Academy; and Delhi State Legal Services Authority, she is incessantly contributing to the development of legal education and profession in India.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>Her illustrious career in the field of Law includes being the eminent author/editor of several books like Energy Law (Oxford University Press); Biodiversity Law (Routledge, Taylor & Francis Group); Mediation (Bloomsbury); Climate Change (Eastern Book Company); Gender Justice (Regal Publications); and Human Trafficking Law (Central Law Publications).</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>Her research papers have been published in international journals like Transnational Environmental Law, Cambridge University Press,(UK); Coventry Law Journal, (UK); Yonsei Law Journal (South Korea); IIUM Law Journal (Malaysia); TOAEP, (Brussels, Belgium); OIDA International Journal of Sustainable Development (Ontario Canada); Palgrave Macmillan, (Singapore) and NOUN International Journal of Private and Property Law (Nigeria) to name a few and have been applauded and recognised by the Supreme Court of India.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>She has the honour of presenting her research work at various international academic platforms in countries including USA, Canada, U.K. France, Germany, Netherlands, Australia, China, Singapore, South Korea, South Africa, Bosnia, Malaysia, Sri Lanka, Nepal and Bhutan.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>She has also been contributing to international scholarship by serving as a Reviewer for Scopus indexed journals like “Environmental Law Review, (SAGE, UK)”; “Review of European, Comparative and International Environmental Law, (Wiley, USA) and “Journal of Environmental Policy and Planning” (Taylor & Francis, UK).</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>She has been the Fellow of the Max Planck Institute for International and Comparative Private Law, Hamburg, Germany,(2011); International Institute of Human Rights, Strasbourg, France, (2007) and has to her credit Ciedhu which specializes her in the university human rights teaching.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>She has the honour of being invited by the Centre for Human Rights and Humanitarian Law, American University Washington College of Law, USA to pursue research on Human Rights and Women’s Reproductive Health (2004). She has also been invited by Korea Environment Cooperation to speak on “Green India Mission” in the 6th Policy Consultation Forum of the Seoul Initiative Network on Green Growth: Economic System Economy” in Busan, Republic of Korea,(2011), organized by Economic and Social Commission of Asia and Pacific (ESCAP) in cooperation with Ministry of Environment of Republic of Korea.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>As an expert from India, she participated in the International Symposium of Constitutional Court of Korea, in South Korea (August, 2014, 2023), Kathmandu School of Law, Nepal in the deliberations on the curriculum for “Human Rights of Women” (2003). She had been invited by the Royal Court of Bhutan as a Guest of Honour to participate in the inauguration of the new Supreme Court of Bhutan, by the Indian Prime Minister on 15th June, 2014.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>As a national expert, she contributed for the World Bank’s Report, 2017 “Enabling the Business of Agriculture – Access to Water” studying the laws and regulations for water resources management and irrigation, recognizing the importance of sustainable, equitable and efficient management of water resources for long-term agricultural development.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>Her critically acclaimed projects include the country report for the International Research Project on Climate Change Commitments: An Ethical Analysis” conducted by the University of Auckland, NZ and Widener University, USA with support from IUCN World Commission on Environmental Law and its Specialist Ethical Group.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>As an expert, she participated in the “National Consultation on Strategic Five Year Plan Organised by National Commission for Women, Delhi (2010). She successfully completed the research projects sanctioned by the University Grants Commission, Delhi; National Commission for Women, Delhi; and the University of Delhi.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>One of her research studies on Women and Population has been published by the National Commission for Women (2010). The recipient of “World Population Day Award, 2000”, “Phenomenal She, 2019 ”, “Exceptional Woman of Excellence”, 2023 and “Distinguished Woman Researcher in Law”, 2023, she is a member of several professional organisations such as Population Association of America, MD, USA; South Asian Law Schools Forum for Human Rights (founding member) Kathmandu; All India Law Teachers Congress, New Delhi (founding member); Indian Law Institute, New Delhi (life member) Institute for Constitutional and Parliamentary Studies, New Delhi (life member) and Indian Society for International Law, New Delhi.</p>

<p className="mb-3" style={{ textAlign: 'justify' }}>Professor Usha Tandon served as the Dean and Head, Faculty of Law, University of Delhi (2021-2023); the Professor-in-Charge of Campus Law Centre (CLC), University of Delhi (2013-2019) and the Director of Vivekananda Law School, GGS Indraprastha University, Delhi (2004-2005). She is currently on deputation as the Founding Vice-Chancellor, Dr. Rajendra Prasad National Law University, Prayagraj.</p>


              </div>
            
          </div>
        </section>
      )}
      <style jsx>{`
        p {
          padding: 0px;
          margin: 0px;
        }
        .content {
          display: flex;
          gap: 40px;
        }
        .description {
          padding-top: 10px;
        }
        @media screen and (max-width: 800px) {
          .content {
            display: block;
          }
          .image {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default MessageViceChancellor;
