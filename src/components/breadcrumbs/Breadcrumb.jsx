import React from "react";
import { BreadcrumbItem, Row } from "reactstrap";

const Breadcrumb = (props) => {
  return (
    <>
      <Row className="">
        <h4 className="text-uppercase fs-6">{props.title}</h4>
        <ul className="d-flex gap-2">
          <BreadcrumbItem className="text-muted">Ecommerce </BreadcrumbItem>
          <span className="fs-6"> / </span>
          <BreadcrumbItem className="text-muted fw-bold" >{props.title}</BreadcrumbItem>
        </ul>
      </Row>
    </>
  );
};

export default Breadcrumb;
