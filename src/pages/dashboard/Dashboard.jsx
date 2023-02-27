import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Container, Col, Row } from 'reactstrap';
import './dashboard.scss'

const Dashboard = () => {

  document.title = "Dashboard | Admin Ecommerce";

  return (
    <div className="page-content bg-image-full">
          <Container fluid>

            <Row>
              <Col sm={6} md={4} lg={3}>
                <Card className='p-3'>
                  <Link to="/ecommerce/dashboard">
                    <h5>Ecommerce</h5>
                  </Link>
                </Card>
              </Col>

              <Col sm={6} md={4} lg={3}>
                <Card className='p-3'>
                  <Link to="/cv/dashboard">
                    <h5>Création de cv</h5>
                  </Link>
                </Card>
              </Col>
            </Row>
          </Container>
    </div>
  )

}
               
export default Dashboard