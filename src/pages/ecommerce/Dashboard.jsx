import React from "react";
import { CardBody, Row , Col } from "reactstrap";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Welcome from "../../components/dashboard/Welcome";
import * as FaIcons from "react-icons/fa";

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import Minicard from "../../components/dashboard/Minicard";


const Dashboard = () => {
  return (
    <>
      <div className="page-content">
        
        <Breadcrumb title="Tableau de bord" />

        <Row className="gap-3">
            <Col xl={4}>
                <Welcome />
            </Col>
            
            <Col xl={8} className="d-grid gap-3 my-2">
                <Minicard count="2,567" title="commandes" icon={<FaIcons.FaShoppingBag/>} />
                <Minicard count="67" title="clients" icon={<FaIcons.FaPeopleCarry/>} />
                <Minicard count="26" title="produits" icon={<FaIcons.FaRegWindowRestore/>} />
            </Col>
        </Row>

      </div>
    </>
  );
};

export default Dashboard;
