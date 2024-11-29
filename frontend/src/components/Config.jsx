import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TwoDigitInput from "./TwoDigitInput";
import { useNavigate } from "react-router";
import axios from "axios";

import "../Assets/css/addMachine.css";

export default function Config() {
  const [Alert, setAlert] = useState(false);
  const [IP, setIP] = useState(new Array(4).fill(""));
  const [PORT, setPort] = useState("");
  const [direction, setDirection] = useState("");
  const [action, setAction] = useState("");
  const [inBoundRules, setInBoundRules] = useState({
    accepting: [],
    rejecting: [],
  });
  const [outBoundRules, setOutBoundRules] = useState({
    accepting: [],
    rejecting: [],
  });
  const [inboundLoading, setInboundLoading] = useState(true);
  const [outboundLoading, setOutboundLoading] = useState(true);

  const fetchInboundRules = () => {
    axios
      .post("http://127.0.0.1:5000/inbound-rules")
      .then((response) => {
        setInBoundRules({
          accepting: response.data.accepting, // Use accepting data directly from the response
          rejecting: response.data.rejecting, // Use rejecting data directly from the response
        });
        setInboundLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inbound rules:", error);
        setInboundLoading(false);
      });
  };

  const fetchOutboundRules = () => {
    axios
      .post("http://127.0.0.1:5000/outbound-rules")
      .then((response) => {
        setOutBoundRules({
          accepting: response.data.accepting, // Use accepting data directly from the response
          rejecting: response.data.rejecting, // Use rejecting data directly from the response
        });
        setOutboundLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching outbound rules:", error);
        setOutboundLoading(false);
      });
  };

  useEffect(() => {
    fetchInboundRules();
    fetchOutboundRules();
  }, []);

  const handleRoute = (data) => {
    if (!direction || !action) {
      alert("Please select both Inbound/Outbound and Accept/Reject.");
      return;
    }
    axios
      .post(
        `http://127.0.0.1:5000/config-firewall/${direction}-${action}`,
        data
      )
      .then((response) => {
        if (response.data === true) {
          if (direction === "inbound") fetchInboundRules();
          if (direction === "outbound") fetchOutboundRules();
          setIP(new Array(4).fill(""));
          setPort("");
          setAlert(true);
          setTimeout(() => setAlert(false), 1500);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
        alert("Failed to configure firewall. Please try again.");
      });
  };

  const handleRouteDelete = (direction, action, data) => {
    if (!direction || !action) {
      alert("Please select both Inbound/Outbound and Accept/Reject.");
      return;
    }
    axios
      .post(
        `http://127.0.0.1:5000/config-firewall/delete-rule/${direction}-${action}`,
        data
      )
      .then((response) => {
        if (response.data === true) {
          if (direction === "inbound") fetchInboundRules();
          if (direction === "outbound") fetchOutboundRules();
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
        alert("Failed to configure firewall. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (IP.some((segment) => segment === "")) {
      alert("Please fill in all IP segments.");
      return;
    }
    if (!PORT || isNaN(PORT) || PORT < 1 || PORT > 65535) {
      alert("Please enter a valid port number (1-65535).");
      return;
    }

    // Format IP
    const ip = IP.join("|");

    // Format PORT to hexadecimal
    const portDec = parseInt(PORT, 10);

    // Data to send
    const data = {
      IP: ip,
      PORT: portDec,
    };
    handleRoute(data);
  };

  const handleDelete = (direction, action, ip, port) => {
    // Data to send
    const data = {
      IP: ip,
      PORT: port,
    };
    handleRouteDelete(direction, action, data);
  };

  return (
    <>
      <div className="machine-details-outer-block">
        <div className="left-display-block">
          <h2>Firewall Configuration</h2>
          <div className="config-main-block">
            <div className="config-block">
              <h3>Inbound Rules</h3>
              {inboundLoading ? (
                <p>Loading...</p>
              ) : (
                <table>
                  <tr>
                    <th>Accepting IPs and Ports</th>
                    <th>Rejecting IPs and Ports</th>
                  </tr>

                  {Array.from(
                    {
                      length: Math.max(
                        inBoundRules.accepting.length,
                        inBoundRules.rejecting.length
                      ),
                    },
                    (_, index) => (
                      <tr key={index}>
                        <td>
                          {inBoundRules.accepting[index]
                            ? `${inBoundRules.accepting[index].ip} ,[ ${inBoundRules.accepting[index].ports} ]`
                            : ""}
                          {inBoundRules.accepting[index] && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  "inbound",
                                  "accept",
                                  inBoundRules.accepting[index].ip,
                                  inBoundRules.accepting[index].ports
                                )
                              }
                              className="remove-rule"
                            >
                              -
                            </button>
                          )}
                        </td>
                        <td>
                          {inBoundRules.rejecting[index]
                            ? `${inBoundRules.rejecting[index].ip}, [ ${inBoundRules.rejecting[index].ports} ]`
                            : ""}
                          {inBoundRules.rejecting[index] && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  "inbound",
                                  "reject",
                                  inBoundRules.rejecting[index].ip,
                                  inBoundRules.rejecting[index].ports
                                )
                              }
                              className="remove-rule"
                            >
                              -
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </table>
              )}
            </div>

            <div className="config-block">
              <h3>Outbound Rules</h3>
              {outboundLoading ? (
                <p>Loading...</p>
              ) : (
                <table>
                  <tbody>
                    <tr>
                      <th>Accepting IPs and Ports</th>
                      <th>Rejecting IPs and Ports</th>
                    </tr>

                    {Array.from(
                      {
                        length: Math.max(
                          outBoundRules.accepting.length,
                          outBoundRules.rejecting.length
                        ),
                      },
                      (_, index) => (
                        <tr key={index}>
                          <td>
                            {outBoundRules.accepting[index]
                              ? `${outBoundRules.accepting[index].ip}, [ ${outBoundRules.accepting[index].ports} ]`
                              : ""}
                            {outBoundRules.accepting[index] && (
                              <button
                                onClick={() =>
                                  handleDelete(
                                    "outbound",
                                    "accept",
                                    outBoundRules.accepting[index].ip,
                                    outBoundRules.accepting[index].ports
                                  )
                                }
                                className="remove-rule"
                              >
                                -
                              </button>
                            )}
                          </td>
                          <td>
                            {outBoundRules.rejecting[index]
                              ? `${outBoundRules.rejecting[index].ip}, [ ${outBoundRules.rejecting[index].ports} ]`
                              : ""}
                            {outBoundRules.rejecting[index] && (
                              <button
                                onClick={() =>
                                  handleDelete(
                                    "outbound",
                                    "reject",
                                    outBoundRules.rejecting[index].ip,
                                    outBoundRules.rejecting[index].ports
                                  )
                                }
                                className="remove-rule"
                              >
                                -
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="machine-details-main-block">
          <div className="backnavbar">
            {Alert && (
              <>
                <div className="alert-box">
                  <p>Configuration Added </p>
                </div>
              </>
            )}
            <ul>
              <li className="home-link">
                <Link to="/" className="link">
                  Home
                </Link>
              </li>
              <li className="header-title-md">
                <h2>Machine Details</h2>
              </li>
            </ul>
          </div>
          <form
            className="machine-details-form"
            onSubmit={handleSubmit} // Attach the handler to the form
          >
            <div className="input-container">
              <div className="input-block">
                <div className="input-sub-block1">
                  <input
                    className="radio-btn"
                    type="radio"
                    name="door"
                    id="inbound"
                    value="inbound"
                    onChange={(e) => setDirection(e.target.value)}
                  />
                  <label className="radio-label" htmlFor="inbound">
                    Inbound
                  </label>

                  <input
                    className="radio-btn"
                    type="radio"
                    name="door"
                    id="outbound"
                    value="outbound"
                    onChange={(e) => setDirection(e.target.value)}
                  />
                  <label className="radio-label" htmlFor="outbound">
                    Outbound
                  </label>
                </div>
              </div>

              <div className="input-block">
                <div className="input-sub-block1">
                  <input
                    className="radio-btn"
                    type="radio"
                    name="status"
                    id="accept"
                    value="accept"
                    onChange={(e) => setAction(e.target.value)}
                  />
                  <label className="radio-label" htmlFor="accept">
                    Accept
                  </label>

                  <input
                    className="radio-btn"
                    type="radio"
                    name="status"
                    id="reject"
                    value="reject"
                    onChange={(e) => setAction(e.target.value)}
                  />
                  <label className="radio-label" htmlFor="reject">
                    Reject
                  </label>
                </div>
              </div>
              <div className="input-block">
                <h2>IP Address</h2>
                <p className="instruction-text">*Please use the hex format.</p>
                <div className="input-sub-block">
                  <TwoDigitInput value={IP} onChange={setIP} numInputs={4} />
                </div>
              </div>
              <hr className="input-line-separation" />
              <div className="input-block">
                <h2>Port Number</h2>
                <p className="instruction-text">Enter port number</p>
                <div className="input-sub-block">
                  <input
                    className="port-input"
                    value={PORT}
                    onChange={(e) => setPort(e.target.value)}
                    type="text"
                    id="port"
                    placeholder="Enter port"
                  />
                </div>
              </div>
            </div>
            <div className="submit-btn-block">
              <button type="submit" className="submit-btn">
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
