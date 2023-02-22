import React from 'react'
import { Col, Row } from 'reactstrap'

const Footer = () => {
  return (
    <>
      <footer id='footer'>
          <Row className='fw-lighter d-flex justify-content-center text-muted '>
            <Col className='fw-normal px-3'>
             2023  Ecommerce
            </Col>
            <Col className='text-end fw-lighter px-3 fs-8'>
              Design UI
            </Col>
          </Row>
      </footer>
    </>
  )
}
export default Footer