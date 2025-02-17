import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { dataFetchingPost } from "../../Helper/HelperFunction";
import { NODE_API_URL } from "../../Helper/Constant";
import { FaArrowRightLong } from "react-icons/fa6";
import logo from '../assets/Images/rpnlu.png';
import validator from 'validator';
const PopupNotice = () => {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalShow(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchPopupNotice = async () => {
    try {
      const response = await dataFetchingPost(`${NODE_API_URL}/api/popup-notice/fetch`, { status: 1, deleteStatus: 0 });
      if (response?.statusCode === 200 && response.data.length > 0) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    }
  };

  useEffect(() => {
    fetchPopupNotice();
  }, []);

  return (
    <>
      {data && data.length > 0 && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className="title-img-bx">
              <img src={logo} />
              <h6 className="heading-primary2 butler-regular">Important Notice</h6>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-striped table-hover tblpad-10">
              <thead>
                <tr>
                  <th>
                    <strong style={{ whiteSpace: 'nowrap' }}>Sr. No.</strong>
                  </th>
                  <th>
                    <strong>Title</strong>
                  </th>
                  <th className="text-end">
                    <strong>Action</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, index) => (
                  <>
                    <tr key={index}>
                      <th><strong>{index + 1}</strong></th>
                      <td className="text-start">
                        {data?.title ? validator.unescape(validator.unescape(data?.title)) : ''}
                      </td>
                      <td className="text-end" style={{ verticalAlign: 'middle' }}>
                        <a
                          href={data.link}
                          style={{
                            whiteSpace: "nowrap",
                          }}
                          className="btn btn-primary border border-primary d-flex justify-content-center align-items-center gap-2">
                          Click here <FaArrowRightLong />
                        </a>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PopupNotice;
