import React from "react";
import loading from '../../assets/images/loading.gif'

export default function LoadingSpinner(props) {
  return (
    <div className={ props.isloading ? "spinner-container" : "spinner-container  d-none"} >
      <div className="loading-spinner">
        <img src={loading} alt="loading gif"/>
        <strong>Patientez....</strong>
      </div>
    </div>
  );
}