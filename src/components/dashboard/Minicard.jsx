import React from 'react'
import { Card, CardBody } from 'reactstrap'
import * as FaIcons from "react-icons/fa";

const Minicard = (props) => {
  return (
    <>
        <Card className='bg-white'>
            <CardBody>
                <div className='d-flex justify-content-between'>
                    <div className='d-grid'>
                        <h5 className='text-muted fs-6 text-uppercase'>{props.title}</h5>
                        <span className='fs-2 fw-bolder text-muted'>{props.count}</span>
                    </div>
                    <div className='avatar-sm rounded-circle bg-first-color avatar-title align-self-center'>
                        {props.icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    </>
  )
}

export default Minicard