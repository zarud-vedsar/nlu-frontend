import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { NODE_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import { Modal, Button, Spinner } from "react-bootstrap";
import validator from "validator";

const localizer = momentLocalizer(moment);

function MyVerticallyCenteredModal(props) {
  return (
    <Modal {...props} size="lg" centered>
              <Modal.Header>{props?.modalMessage?.title}</Modal.Header>
        
      <Modal.Body>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: props?.modalMessage?.content
              ? validator.unescape(props?.modalMessage?.content)
              : "",
          }}
        ></div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide} className="mx-auto border-0 btn btn-secondary">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

const CustomToolbar = ({ label, onNavigate }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="custom-toolbar d-flex justify-content-between align-items-center">
      <button className="btn btn-primary border-0" onClick={() => onNavigate("PREV")}>
      <i class="fa-solid fa-arrow-left"></i> {!isMobile &&  `Previous` }
      </button>
      <h6 className="mb-0">{label}</h6>
      <div className="d-flex align-items-center">
        <button
          className="btn btn-secondary ms-2 border-0"
          style={{ marginRight: "10px" }}
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
        <button className="btn btn-primary border-0" onClick={() => onNavigate("NEXT")}>
         {!isMobile && `Next` } <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

function AcademicCalendar() {
  const [isFetching, setIsFetching] = useState();
  const [events, setEvents] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState();

  
  const EventComponent = ({ event }) => (
    <div
      onClick={() => {
        setModalMessage(event);
        setModalShow(true);
      }}
    >
      {event.title}
    </div>
  );

  const handleNavigate = (date = false) => {
    const selectedDate = date ? moment(date) : moment();

    const currentMonth = selectedDate.format("MMMM");
    const currentYear = selectedDate.format("YYYY");

    const firstDate = selectedDate.startOf("month").format("YYYY-MM-DD");
    const lastDate = selectedDate.endOf("month").format("YYYY-MM-DD");

    console.log(`Navigated to: ${currentMonth} ${currentYear}`);
    console.log(`First Date: ${firstDate}, Last Date: ${lastDate}`);

    fetchCalendarListing(firstDate, lastDate);
  };
  const fetchCalendarListing = async (fromDate, toDate) => {
    setIsFetching(true);
    try {
      const response = await axios.post(`${NODE_API_URL}/api/calendar/fetch`, {
        deleteStatus: 0,
        listing: "yes",
        status:1,
        fromDate,
        toDate,
      });

      console.log(response.data.data);
      if (response?.data?.statusCode === 200 && response.data.data.length > 0) {
        console.log(response.data.data);
        setEvents(
          response?.data?.data.map((data) => ({
            title: data?.title,
            content: validator.unescape(data?.content),
            start: new Date(data?.date),
            end: new Date(data?.date),
          }))
        );
      } else {
        setEvents([]);
      }
    } catch (error) {
      setEvents([]);
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.message || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => handleNavigate(), []);

  return (
    <>
      <div className="breadcrumb-banner-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="breadcrumb-text">
                <h1 className="text-center">Academic Calendar</h1>
                <div className="breadcrumb-bar">
                  <ul className="breadcrumb text-center">
                    <li>
                      <Link to="/">Home</Link> <FaAngleRight />
                    </li>
                    <li>More Links</li> <FaAngleRight />
                    <li>Academic Calendar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="heading-primary">Academic Calendar</h1>
            </div>
            <div className="col-md-12">
              <div className="card border-0">
                <div className="card-body">
                  <div className="row">
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      views={["month"]}
                      style={{ height: 700 }}
                      onNavigate={handleNavigate} // Capture navigation
                      
                      components={{
                        toolbar: CustomToolbar,
                        event: EventComponent,
                      }} //
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        modalMessage={modalMessage}
      />
      <style jsx>
        {`
        .modal-body {
    max-height: 600px;
    
    max-width: 100%;
    overflow: auto;
    
        }
          .rbc-event {
            background-color: #559be6 !important;
            color: white !important;
            border-radius: 5px !important;
            padding: 5px !important;
         
          }
            .rbc-day-bg{
               height:300px !important;
            }
          /* Custom Toolbar */
          .custom-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 10px;
            padding-bottom:20px;
            border-radius: 8px;
            margin-bottom: 10px;
          }
        `}
      </style>
    </>
  );
}

export default AcademicCalendar;
