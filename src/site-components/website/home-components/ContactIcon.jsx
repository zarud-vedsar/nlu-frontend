import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PHP_API_URL } from '../../Helper/Constant';
import { Link } from 'react-router-dom';
import validator from 'validator';
function ContactIcon() {
    const [items, setItems] = useState({
        whatsapplink: '',
        calllink: ''
    });
    const getContactIconInfo = async () => {
        try {
            const bformData = new FormData();
            bformData.append("data", "get_conacticon_sett");

            const response = await axios.post(
                `${PHP_API_URL}/sitesetting.php`,
                bformData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.status === 200) {
                setItems({
                    whatsapplink: response?.data?.data[0]?.whatsapplink,
                    calllink: response?.data?.data[0]?.calllink,
                });
            }
        } catch (error) { /* empty */ }
    };
    useEffect(() => {
        getContactIconInfo();
    }, []);
    return (
        <>
            <div className="floating_btn">
                <Link
                    target="_blank"
                    to={items.whatsapplink ? validator.unescape(items.whatsapplink) : ''}
                >
                    <div className="contact_icon">
                        <i className="fab fa-whatsapp my-float" />
                    </div>
                </Link>
            </div>
            <div className="floating_btn1">
                <Link target="_blank" to={`tel:${items.calllink}`}>
                    <div className="contact_icon1">
                        <i className="fas fa-phone my-float" />
                    </div>
                </Link>
            </div>
        </>
    )
}
export default ContactIcon