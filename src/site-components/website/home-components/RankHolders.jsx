import React, { useState, useEffect } from 'react';

const RankHolders = () => {
  const students = [
    {
      name: "ANKUR RAI",
      designation: "B-Pharma",
      score: "78.68",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "AWADESH KUMAR PAL",
      designation: "D-Pharma",
      score: "76.08",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "JITENDRA SINGH",
      designation: "D-Pharma",
      score: "74.14",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "KM ANJOO",
      designation: "ANM",
      score: "82.6%",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "KM ARTI",
      designation: "ANM",
      score: "83%",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "NAAZ BANO",
      designation: "GNM",
      score: "81.6%",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "NIKHIL MISHRA",
      designation: "B-Pharma",
      score: "77.11",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "RAGINI DWIVEDI",
      designation: "GNM",
      score: "79.6%",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "KULDEEP SINGH (GOLD MEDALIST)",
      designation: "B.A.LL.B.",
      score: "61.76",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
    {
      name: "AJEET KUMAR SINGH",
      designation: "B.A.LL.B.",
      score: "61.01",
      image: "https://rkgi.in/Uploads/Toppers/S00012.jpg",
    },
  ];

  // State to track the current slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % students.length); // Increment by 1 for one card at a time
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + students.length) % students.length); // Decrement by 1
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3000ms = 3 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [currentIndex]); // Depend on currentIndex so that the interval will reset properly

  return (
    <div className="fun-factor-area section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="section-title-wrapper">
              <div className="section-title-wrapper white">
                <div className="section-title">
                  <h3>Our Rank Holders</h3>
                  <p>R.K. Group Of Institutions</p>
                </div>
              </div>
            </div>
            <div className="row students-say-area">
              <div className="owl-carousel4 owl-theme">
                {/* Display the current student's profile */}
                <div className="single-item">
                  <div className="single-item-wrapper">
                    <div className="profile-img-wrapper">
                      <a href="#" className="profile-img">
                        <img
                          className="profile-img-responsive img-circle"
                          src={students[currentIndex].image}
                          alt={students[currentIndex].name}
                        />
                      </a>
                    </div>
                    <div className="tlp-tm-content-wrapper">
                      <h3 className="item-title">
                        <a href="#">{students[currentIndex].name}</a>
                      </h3>
                      <span className="item-designation">{students[currentIndex].designation}</span>
                      <ul className="rating-wrapper">
                        <li><i className="fa fa-star" aria-hidden="true" /></li>
                        <li><i className="fa fa-star" aria-hidden="true" /></li>
                        <li><i className="fa fa-star" aria-hidden="true" /></li>
                        <li><i className="fa fa-star" aria-hidden="true" /></li>
                        <li><i className="fa fa-star" aria-hidden="true" /></li>
                      </ul>
                      <div className="item-content">
                        Position:
                        <br />
                        Score: {students[currentIndex].score}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="carousel-navigation">
              <button onClick={prevSlide} className="prev-btn">
                Prev
              </button>
              <button onClick={nextSlide} className="next-btn">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankHolders;
