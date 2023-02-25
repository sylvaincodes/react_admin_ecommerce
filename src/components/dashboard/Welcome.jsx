import React from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import login_header from "../../assets/images/profile-img.png";
import { Link } from 'react-router-dom';

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"

const Welcome = () => {
  return (
    <>
        <Card className="overflow-hidden">
        <div className="bg-first-color bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-white p-3">
                <h5 className="text-white">Welcome Boss</h5>
                <p>Tableau</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        
      </Card>
    </>
  )
}

export default Welcome