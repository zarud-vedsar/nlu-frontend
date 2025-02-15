import React, { useState, useEffect } from "react";
import rpnl_logo from "./site-components/website/assets/Images/rpnlu.png";

const SuspensionLoader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return oldProgress + 1;
            });
        }, 50); // Adjust speed here (lower = faster)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loader-container">
            <img src={rpnl_logo} alt="RPNLU Logo" className="logo" />
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}%</p>

            <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          z-index: 1000;
        }

        .logo {
          width: 120px;
          margin-bottom: 20px;
        }

        .progress-bar {
          width: 200px;
          height: 10px;
          background: #ddd;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: #b71c1c; /* Dark Red */
          transition: width 0.1s linear;
        }

        p {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
        </div>
    );
};

export default SuspensionLoader;