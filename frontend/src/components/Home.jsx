import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Assets/css/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [serverData,setServerData] = useState([]);

  const [selectedMachine, setMachineDetails] = useState(null);
  const [serverDetails, setServerDetails] = useState(false);

  useEffect(() => {
    // Make a GET request using axios
    axios
      .get("http://127.0.0.1:5000/fetch-machines-data")
      .then((response) => {
        const clientData = response.data.filter(machine => machine.MachineId !== 'my-machine');
        setData(clientData);
        const server_Data = response.data.find(machine => machine.MachineId === 'my-machine');
        setServerData(server_Data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSelect = (machineId) => {
    // storing machine id in session storage
    sessionStorage.setItem("selectedMachine", machineId);
    // navigating to simulation page
    navigate("/simulation");
  };

  return (
    <>
      {/* Navbar */}
      <div className="home-top-container">
        <nav className="navbar">
          <div className="logo">Firewall Visualizer</div>
          <ul className="nav-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/add-machine">Add Machine</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>

        {/* Main Container */}
        <div className="home_container">
          {/* Left Section with Large Monitor */}
          <div className="left-section">
            <div className="large-monitor-block">
              <div className="machine-type-title">
                <h1>Server</h1>
              </div>
              <div className="config-options-block">
                <ul>
                  <li>
                    <button onClick={()=>setServerDetails(true)}>Machine Details</button>
                  </li>
                  <li>
                    <button>Config Firewall</button>
                  </li>
                </ul>
              </div>
              <div className="large-monitor">
              <div
                    className={
                      serverDetails
                        ? "details-show"
                        : "details-hide"
                    }
                  >
                    <div className="monitor-details-header-title">
                     Server
                    </div>
                    <div className="details-list">
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th className="details-table-header">
                              Details
                            </th>
                            <th className="details-table-header">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>MAC:</strong>
                            </td>
                            <td>
                              {serverData.MAC}
                              </td>
                          </tr>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>IP:</strong>
                            </td>
                            <td>
                            {serverData.IP}
                              </td>
                          </tr>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>Port:</strong>
                            </td>
                            <td>
                            {serverData.PORT}
                              </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="close-details">
                      <button onClick={()=>setServerDetails(false)}>
                        Close
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Section with Small Monitors */}
          <div className="right-section">
            <div className="machine-type-title">
              <h1>Client Machines</h1>
            </div>
            <div className="grid">
              {data.map((machine, index) => (
                <div className="monitor-block" key={index}>
                  <div
                    className={
                      selectedMachine === machine.MachineId
                        ? "details-show"
                        : "details-hide"
                    }
                  >
                    <div className="monitor-details-header-title">
                      {machine.MachineId}
                    </div>
                    <div className="details-list">
                      <table className="details-table">
                        <thead>
                          <tr>
                            <th className="details-table-header">
                              Details
                            </th>
                            <th className="details-table-header">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>MAC:</strong>
                            </td>
                            <td>{machine.MAC}</td>
                          </tr>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>IP:</strong>
                            </td>
                            <td>{machine.IP}</td>
                          </tr>
                          <tr className="details-table-row">
                            <td className="details-table-cell">
                              <strong>Port:</strong>
                            </td>
                            <td>{machine.PORT}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="close-details">
                      <button onClick={() => setMachineDetails(null)}>
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="monitor-list-header-title">
                    {machine.MachineId}
                  </div>
                  <div className="monitor"></div>
                  <div className="btn-block">
                    <button
                      onClick={() => setMachineDetails(machine.MachineId)}
                      className="btn"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleSelect(machine.MachineId)}
                      className="btn-circle"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
