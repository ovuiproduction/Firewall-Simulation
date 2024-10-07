import { React, useState } from "react";
import { Link } from "react-router-dom";
import TwoDigitInput from "./TwoDigitInput";
import { useNavigate } from "react-router";
import axios from "axios";

import "../Assets/css/addMachine.css";

export default function AddMachine() {
  const navigate = useNavigate();

  const [MAC, setMAC] = useState(new Array(6).fill(""));
  const [IP, setIP] = useState(new Array(4).fill(""));
  const [PORT, setPort] = useState();

  const handleSubmit = () => {

    let mac = "",ip="",port=""
    MAC.map((ele)=>(
      mac += ele+"|"
    ));
    IP.map((ele)=>(
      ip += ele+"|"
    ));

    mac = mac.slice(0, -1);
    ip = ip.slice(0, -1);

    let port_dec  = parseInt(PORT,10);
    let hexPort = port_dec.toString(16).padStart(4, '0');
    port = hexPort.match(/.{1,2}/g).join("|"); 

    const data = {
      MAC: mac,
      IP: ip,
      PORT: port,
    };
    axios
      .post("http://127.0.0.1:5000/add-machine", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      navigate("/");
  };

  return (
    <>
    <div className="machine-details-outer-block">
      <div className="img-display-block">
        <div className="img-blur-layer"></div>
      </div>
      <div className="machine-details-main-block">
      <div className="backnavbar">
        <ul>
          <li className="home-link"><Link to="/" className="link">Home</Link></li>
          <li className="header-title-md"><h2>Machine Details</h2></li>
        </ul>
      </div>
      <form className="machine-details-form">
        <div className="input-container">
          <div className="input-block">
            <h2>MAC Address</h2>
            <p className="instruction-text">
              *Please use the hex format.
            </p>
            <div className="input-sub-block">
              <TwoDigitInput value={MAC} onChange={setMAC} numInputs={6} />
            </div>
          </div>
          <hr className="input-line-separation" />
          <div className="input-block">
            <h2>IP Address</h2>
            <p className="instruction-text">
              *Please use the hex format.
            </p>
            <div className="input-sub-block">
              <TwoDigitInput value={IP} onChange={setIP} numInputs={4} />
            </div>
          </div>
          <hr className="input-line-separation" />
          <div className="input-block">
            <h2>Port Number</h2>
            <p className="instruction-text">
              Enter port number
            </p>
            <div className="input-sub-block">
              <input className="port-input" onChange={(e)=>setPort(e.target.value)} type="text" id="port" placeholder="Enter port" />
            </div>
          </div>
        </div>
        <div className="submit-btn-block">
          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
        </div>
      </form>
      </div>
      <footer>
          &copy; 2024 Data Packet Visualization. All rights reserved.
        </footer>
      </div>
    </>
  );
}
