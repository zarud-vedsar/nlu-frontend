import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { goBack } from '../../site-components/Helper/HelperFunction';
import { FormField } from '../../site-components/admin/assets/FormField';
import { toast } from 'react-toastify';
import { PHP_API_URL, FILE_API_URL } from '../../site-components/Helper/Constant';
import axios from 'axios';
import Select from 'react-select'; // Dropdown component
import secureLocalStorage from 'react-secure-storage';

function AddUseFulLinks() {
  const { dbId } = useParams();
  const initialFormData = {
    dbId: '',
    link_title: '',
    image_file: '',
    unlink_image_file: '',
    link_link: '',
    link_other_link: '',
    target: ''
  }
  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(null);
  const [PageListing, setPageListing] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  // Fetch list of pages 
  const fetchList = async () => {
    try {
        const response = await axios.post(`${PHP_API_URL}/page.php`, {
            data: 'distinctTitleId',
        },
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
        if (response.data.status === 200) {
            setPageListing(response.data.data);
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
useEffect(() => {
    fetchList();
}, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { id } = e.target;

    if (!file) return;

    if (id === "image_file") {
      if (file.type.startsWith("image/")) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((formData) => ({ ...formData, image_file: file }));
      } else {
        toast.error("Invalid image format. Only png, jpeg, jpg, and webp are allowed.");
      }
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const updatfetchPageById = async (dbId) => {

    if (Number.isInteger(parseInt(dbId, 10)) && parseInt(dbId, 10) > 0) {
        try {
            const response = await axios.post(`${PHP_API_URL}/useful_link.php`, {
                data: 'get_link_by_id',
                id: dbId,
            },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
            if (response.data.status === 200) {
                setFormData((prev) => ({
                    ...prev,
                    dbId: response.data.data[0].id,
                    link_title: response.data.data[0].link_title,
                    image_file: response.data.data[0].image_file,
                    unlink_image_file: response.data.data[0].image_file,
                    link_link: response.data.data[0].link_link,
                    link_other_link: response.data.data[0].link_other_link,
                    target: response.data.data[0].target
                }));
                if(response.data.data[0].image_file){
                  setPreviewImage(`${FILE_API_URL}/${response.data.data[0].image_file}`);
                }
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
    if (!formData.link_title) {
        toast.error("Title is required.");
        return setIsSubmit(false);
    }
    if (!formData.link_link) {
        toast.error("Link is required.");
        return setIsSubmit(false);
    }
    if (formData.link_link === 'other-link' && !formData.link_other_link) {
        toast.error("Other Link is required.");
        return setIsSubmit(false);
    }
    if (!formData.target) {
        toast.error("Target is required.");
        return setIsSubmit(false);
    }

    const sendFormData = new FormData();
    for (let key in formData) {
        sendFormData.append(key, formData[key]);
    }
    sendFormData.append('data', 'linksave');
    sendFormData.append('updateid', formData.dbId);
    sendFormData.append('link_title', formData.link_title);
    sendFormData.append('image_file', formData.image_file);
    sendFormData.append('link_link', formData.link_link);
    sendFormData.append('link_other_link', formData.link_other_link);
    sendFormData.append('target', formData.target);
    sendFormData.append('loguserid', secureLocalStorage.getItem('login_id'));
    sendFormData.append('login_type', secureLocalStorage.getItem('loginType'));

    try {
        // submit to the API here
        const response = await axios.post(`${PHP_API_URL}/useful_link.php`, sendFormData, {
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
                  <span className="breadcrumb-item active">Useful Link</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2 col-lg-7 col-md-7 mx-auto">
              <div className="card-header id-pc-divices-header px-0 id-mobile-divice-d-block">
                <h5 className="card-title h6_new">{dbId ? 'Update Useful Link' : 'Add New Useful Link'}</h5>
                <div className="ml-auto id-mobile-go-back">
                  <button
                    className="mr-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link to="/admin/useful-links"
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-list" /> Useful Link List
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-7 col-lg-7 col-12 mx-auto">
                <div className="card">
                  <div className="card-body">
                  <form onSubmit={handleSubmit}>
                  <div className='row'>
                        <FormField label="Title" required name="link_title" id="link_title"
                         value={formData.link_title} 
                         placeholder='Enter Title'
                         column="col-md-12"
                          onChange={handleChange} />
                        <div className="col-md-12 col-lg-12 col-12 form-group " >
                          <label>Choose Image</label>
                          <input
                            type="file"
                            id="image_file"
                            accept=".png, .jpg, .jpeg, .webp"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          {previewImage && (
                            <img src={previewImage} alt="Preview" className="img-fluid mt-3" style={{ maxHeight: 300 }} />
                          )}
                        </div>
                        <div className="col-md-12 form-group">
                          <label>Link Type: <span className="text-danger">*</span></label>
                          <Select
                            options={[
                              { value: '', label: 'Select' },
                              { value: 'other-link', label: 'Other Link' },
                              ...PageListing.map(page => ({ value: page.id, label: page.ptitle })),
                            ]}
                            value={
                              formData.link_link === 'other-link'
                                ? { value: 'other-link', label: 'Other Link' }
                                : PageListing.find(page => page.id === parseInt(formData.link_link))
                                  ? {
                                    value: parseInt(formData.link_link),
                                    label: PageListing.find(page => page.id === parseInt(formData.link_link)).ptitle
                                  }
                                  : { value: formData.link_link, label: 'Select' }
                            }
                            onChange={(selectedOption) =>
                              setFormData({ ...formData, link_link: selectedOption.value })
                            }
                          />
                        </div>
                        {formData.link_link === 'other-link' && (
                          <FormField
                            label="Other Link"
                            type="text"
                            name="link_other_link"
                            value={formData.link_other_link}
                            column="col-md-12"
                            onChange={handleChange}
                            required
                          />
                        )}
                        <div className="col-md-12 form-group">
                          <label>Target: <span className="text-danger">*</span></label>
                          <Select
                            options={[
                              { value: '', label: 'Select' },
                              { value: '_blank', label: 'On New Tab' },
                              { value: '_self', label: 'On Same Tab' },
                            ]}
                            value={
                              formData.target
                                ? { value: formData.target, label: formData.target === '_blank' ? 'On New Tab' : 'On Same Tab' }
                                : { value: '', label: 'Select' }
                            }
                            onChange={(selectedOption) =>
                              setFormData({ ...formData, target: selectedOption.value })
                            }
                          />
                        </div>
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