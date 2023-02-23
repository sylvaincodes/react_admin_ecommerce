import React from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import login_header from "../../assets/images/profile-img.png";

const Welcome = () => {
  return (
    <>
        <Card className='bg-first-color'>
            <Row>
                    <Col col-6 className='p-4'>
                       <h4 className='text-white'>Bienvenue</h4>
                       <p className='text-white'>Tableau de bord</p> 
                    </Col>
                    
                    <Col col-6 className='m-auto align-self-end'>
                       <img src={login_header} alt="" className='img-fluid' />
                    </Col>
            </Row>
            
        </Card>
    </>
  )
}

export default Welcome