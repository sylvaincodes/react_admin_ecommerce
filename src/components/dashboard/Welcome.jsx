import React from 'react'
import { Card, Col, Row } from 'reactstrap'
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