import React from "react";

export default function LoadingSpinner(props) {
  return (
    <div className={ props.isLoading ? "spinner-container" : "spinner-container  d-none"} >
      <div className="loading-spinner">
      </div>
    </div>
  );
}