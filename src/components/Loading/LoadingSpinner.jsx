import React from "react";

export default function LoadingSpinner(props) {
  return (
    <div className={ props.isloading ? "spinner-container" : "spinner-container  d-none"} >
      <div className="loading-spinner">
      </div>
    </div>
  );
}