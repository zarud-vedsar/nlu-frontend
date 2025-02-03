import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { dataFetchingPost } from "../../Helper/HelperFunction";
import { NODE_API_URL } from "../../Helper/Constant";
import { Link } from "react-router-dom";
import { right } from "@popperjs/core";
import { FaRightLong } from "react-icons/fa6";

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
      const response = await dataFetchingPost(
        `${NODE_API_URL}/api/popup-notice/fetch`
      );
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
            <Modal.Title id="contained-modal-title-vcenter">
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
                        {data.title}
                      </td>
                      <td className="text-end" style={{verticalAlign:'middle'}}>
                        <a
                          href={data.link}
                          style={{
                            whiteSpace: "nowrap",
                          }}
                          className="btn-link">
                          Click here <FaRightLong />
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
