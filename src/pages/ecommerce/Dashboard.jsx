import React from "react";
import { Container, CardBody, Row, Col } from "reactstrap";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumb";
import Welcome from "../../components/dashboard/Welcome";
import * as FaIcons from "react-icons/fa";

import avatar1 from "../../assets/images/users/avatar-1.jpg";
import Minicard from "../../components/dashboard/Minicard";

const Dashboard = () => {
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Ecommerce" breadcrumbItem="Tableau de bord" />
      
          <Row>
            <Col lg={4}>
              <Welcome />
            </Col>

            <Col lg={8} >

              <Row>

              <Col md={4}>
              <Minicard
                count="2,567"
                title="commandes"
                icon={<FaIcons.FaShoppingBag />}
                />
              </Col>

              <Col md={4}>

              <Minicard
                count="67"
                title="clients"
                icon={<FaIcons.FaPeopleCarry />}
                />
              </Col>

              <Col md={4}>
              <Minicard
                count="26"
                title="produits"
                icon={<FaIcons.FaRegWindowRestore />}
                />
              </Col>

              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
