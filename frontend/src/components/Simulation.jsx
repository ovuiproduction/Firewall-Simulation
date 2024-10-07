import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assets/css/simulation.css";
import machineLogo from "../Assets/images/monitor.png";

export default function Simulation() {
  const [protocol, setProtocol] = useState("TCP");
  const [packetStyle, setPacketStyle] = useState({
    transform: "translate(0px, 0)",
  });
  // const [firewallStyle,setFirewallStyle] = useState()
  const [dataPacketVisible, setDataPacketVisible] = useState(false);
  const [checkpointDetails, setCheckpointDetails] = useState([]);
  const [firewallProcessing, setFirewallProcessing] = useState("Ideal");
  const [packetAccepted, setPacketAccepted] = useState(false);

  let selectedMachineId = sessionStorage.getItem("selectedMachine");
  let myMachineId = "my-machine";

  // Function to handle protocol change
  const handleProtocolChange = (event) => {
    setProtocol(event.target.value);
  };

  // Function to handle sending the request
  const handleSendRequest = () => {
    // Show the data packet immediately and reset its position
    setDataPacketVisible(true);
    setPacketStyle({
      transform: "translate(0px, -30px)", // Reset to initial position
      transition: "none", // Remove transition for immediate effect
    });

    // Start moving the packet to the firewall
    setTimeout(() => {
      setPacketStyle({
        transform: "translate(300px,0)", // Move to firewall position
        transition: "transform 5s",
      });
      // Simulate delay for the packet to reach the firewall
      setTimeout(() => {
        axios
          .post("http://127.0.0.1:5000/apply", {
            srcId: myMachineId,
            desId: selectedMachineId,
            protocol: protocol,
          })
          .then((response) => {
            // Show firewall processing animation
            setFirewallProcessing("working");

            // Get checkpoint details from response and process them one by one
            const checkpoints = [
              { name: "Source MAC", value: response.data.srcMac || "N/A" },
              { name: "Source MAC", value: response.data.srcMac || "N/A" },
              {
                name: "Destination MAC",
                value: response.data.destMac || "N/A",
              },
              { name: "Source IP", value: response.data.srcIP || "N/A" },
              { name: "Destination IP", value: response.data.destIP || "N/A" },
              { name: "Source Port", value: response.data.srcPort || "N/A" },
              {
                name: "Destination Port",
                value: response.data.destPort || "N/A",
              },
            ];
            processCheckpoints(checkpoints, response.data.status);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 2000);
    }, 0);
  };

  const processCheckpoints = (checkpoints, status) => {
    let currentCheckpoint = 0;

    // Clear existing checkpoint details before starting
    setCheckpointDetails([]);

    const processNext = () => {
      if (currentCheckpoint < checkpoints.length) {
        // Add the current checkpoint to the list
        setCheckpointDetails((prevDetails) => {
          const updatedDetails = [
            ...prevDetails,
            checkpoints[currentCheckpoint],
          ];
          return updatedDetails;
        });

        currentCheckpoint++;

        // Process the next checkpoint after 1 second
        setTimeout(processNext, 1000);
      } else {
        // All checkpoints processed, show result
        setTimeout(() => {
          setFirewallProcessing("completed");
          setPacketAccepted(status === "accepted");

          if (status === "accepted") {
            // Move packet to Computer B
            setPacketStyle({
              transform: "translate(840px, -10px)", // Move to Computer B
              transition: "transform 5s",
            });
          }
        }, 500);
      }
    };
    processNext();
  };

  return (
    <>
      <div className="simulation-page-top-container">
        <nav className="navbar_simulation">
          <div className="logo">Firewall Visualizer</div>
          <ul className="nav-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/">About</a>
            </li>
            <li>
              <a href="/">Features</a>
            </li>
            <li>
              <a href="/">Contact</a>
            </li>
          </ul>
        </nav>

        <div className="container">
          <div className="protocol-div">
            <select className="select-protocol" onChange={handleProtocolChange}>
              <option value="">Protocol</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
            </select>
          </div>

          <div className="simulation-main-block">
            <div className="computer" id="computerA">
            <div className="machine-title">
              <h3>Server</h3>
            </div>
              <div className="machine-details-block"></div>
              <div className="server-img-block"></div>
              <div className="request-btn-block">
                <button className="send-button" onClick={handleSendRequest}>
                  Send
                </button>
              </div>
              {dataPacketVisible && (
                <div
                  className="data-packet"
                  id="dataPacket"
                  style={packetStyle}
                >
                  Data Packet
                </div>
              )}
            </div>

            {/* Firewall */}
            {/* style={firewallStyle} */}
            <div className="firewall" id="firewallBox">
              <h3>Firewall</h3>
              {firewallProcessing === "Ideal" && (
                <p className="curr-state-div">
                  Current State : <b>Ideal</b>
                </p>
              )}
              {firewallProcessing === "working" && (
                <p className="curr-state-div">
                  Current State : <b>Processing</b>
                </p>
              )}
              {firewallProcessing === "completed" && (
                <p className="curr-state-div">
                  Current State : <b>Scan Completed</b>
                </p>
              )}
              <div className="checkpoint-list">
                <table className="checkpoint-table">
                  <thead>
                    <tr>
                      <th className="checkpoint-table-header">
                        Checkpoint Name
                      </th>
                      <th className="checkpoint-table-header">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkpointDetails.map(
                      (checkpoint, index) =>
                        checkpoint ? ( // Check if checkpoint is defined
                          <tr className="checkpoint-table-row" key={index}>
                            <td className="checkpoint-table-cell">
                              {checkpoint.name}
                            </td>
                            <td className="checkpoint-table-cell">
                              {checkpoint.value}
                            </td>
                          </tr>
                        ) : null // Render nothing if checkpoint is undefined
                    )}
                  </tbody>
                </table>
              </div>

              {firewallProcessing === "completed" && (
                <div
                  className={
                    packetAccepted ? "success-message" : "failure-message"
                  }
                >
                  {packetAccepted ? "Packet Accepted" : "Packet Rejected"}
                </div>
              )}
            </div>

            {/* Computer B */}
            <div className="computer" id="computerB">
            <div className="machine-title">
            <h3>Client</h3>
            </div>
              <div className="machine-details-block"></div>
              <div className="machine-img-block"></div>
              <div className="request-btn-block">
                <button className="send-button" onClick={handleSendRequest}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer>
          &copy; 2024 Data Packet Visualization. All rights reserved.
        </footer>
      </div>
    </>
  );
}