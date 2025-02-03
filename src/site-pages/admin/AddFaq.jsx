/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { goBack } from '../../site-components/Helper/HelperFunction';
import { FormField, TextareaField } from '../../site-components/admin/assets/FormField';
import { toast } from 'react-toastify';
import { PHP_API_URL     } from '../../site-components/Helper/Constant';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

function AddUseFulLinks() {
  const { dbId } = useParams();
  const initialFormData = {
    dbId: '',
    title: '',
    content: '',
  }
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const updatfetchPageById = async (dbId) => {

    if (Number.isInteger(parseInt(dbId, 10)) && parseInt(dbId, 10) > 0) {
        try {
            const response = await axios.post(`${PHP_API_URL}/faq.php`, {
                data: 'get_faq_by_id',
                id: dbId,
            },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                
            if (response.data.status === 200 && response.data.data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data.data[0].id,
                    title: response.data.data[0].title,
                    content: response.data.data[0].content,
                }));
            }
        } catch (error) {
            const status = error.response?.data?.status;
            if (status === 400 || status === 500) {
                toast.error(error.response.data.msg || "A server error occurred.");
            } else {
                toast.error(
                    "An error occurred. Please check your connection or try again."
                );
            }
        }
    }
}
useEffect(() => {
    if (dbId) {
        updatfetchPageById(dbId);
    }
}, [dbId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (!formData.title) {
        toast.error("Title is required.");
        return setIsSubmit(false);
    }
    if (!formData.content) {
        toast.error("Content is required.");
        return setIsSubmit(false);
    }
    const sendFormData = new FormData();
    for (let key in formData) {
        sendFormData.append(key, formData[key]);
    }
    sendFormData.append('data', 'faq_add');
    sendFormData.append('updateid', formData.dbId);
    sendFormData.append('title', formData.title);
    sendFormData.append('content', formData.content);
    sendFormData.append('loguserid', secureLocalStorage.getItem('login_id'));
    sendFormData.append('login_type', secureLocalStorage.getItem('loginType'));
    try {
        // submit to the API here
        const response = await axios.post(`${PHP_API_URL}/faq.php`, sendFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        if (response.data?.status === 200 || response.data?.status === 201) {
            toast.success(response.data.msg);
            if (response.data.status === 201) {
                setFormData(initialFormData);
            }
        } else {
            toast.error("An error occurred. Please try again.");
        }
    } catch (error) {
        const status = error.response?.data?.status;

        if (status === 400 || status === 500) {
            toast.error(error.response.data.msg || "A server error occurred.");
        } else {
            toast.error(
                "An error occurred. Please check your connection or try again."
            );
        }
    } finally {
        setIsSubmit(false);
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
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </a>
                  <span className="breadcrumb-item">CMS</span>
                  <span className="breadcrumb-item active">Faqs</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">{dbId ? 'Update Faqs' : 'Add Faqs'}</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link to="/admin/faq-list"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Faqs List
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                  <form onSubmit={handleSubmit}>
                  <div className='row'>
                        <FormField label="Title" required name="title" id="title" value={formData.title} column="col-md-12" onChange={handleChange} />
                        <TextareaField label="Content" required name="content" id="content" value={formData.content} column="col-md-12" onChange={handleChange} />
                        <div className="col-md-12 col-lg-12 col-12">
                          <button className='btn btn-dark btn-block d-flex justify-content-center align-items-center' type='submit'>
                            Save{" "} {isSubmit && (
                              <>
                                &nbsp; <div className="loader-circle"></div>
                              </>
                            )}
                          </button>
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
  )
}

export default AddUseFulLinks