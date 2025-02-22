import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function AcademicCalendar() {
  const [events, setEvents] = useState([
    {
      title: "Exam Date",
      start: new Date(2025, 1, 1), 
      end: new Date(2025, 1, 3),
    },
    {
      title: "Holidays Begin",
      start: new Date(2024, 2, 20), 
      end: new Date(2024, 2, 30),
    },
  ]);

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
                    <li>Cells</li> <FaAngleRight />
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
                      style={{ height: 500 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>
        {`
          .rbc-event {
            background-color: #007bff !important;
            color: white !important;
            border-radius: 5px !important;
            padding: 5px !important;
          }
        `}
      </style>
    </>
  );
}

export default AcademicCalendar;
