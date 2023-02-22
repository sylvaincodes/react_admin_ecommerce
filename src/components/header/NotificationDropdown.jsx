import React, { useState } from "react";
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import {
    Button,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    Input,
    InputGroup,
    Row,
    Col
  } from "reactstrap";
  import { Link } from "react-router-dom";


const NotificationDropdown = () => {
const [menu, setMenu] = useState(false);
    const [socialDrp, setSocialDrp] = useState(false);

  return (
    <>
       <Dropdown className="dropdown d-inline-block"
              isOpen={socialDrp}
              toggle={() => {
                setSocialDrp(!socialDrp);
              }}
              tag="li"
            >
              <DropdownToggle

                className="header-item btn notif-icon"
                tag="button"
              >
                <i className="fa fa-bell bx-tada"></i>
                <span className="bg-danger badge rounded-pill">3</span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                    <div className="p-3">
                        <div className="d-flex justify-content-between">      
                                <h6>Notifications</h6>
                                <Link to="\">Tout voir</Link>
                        </div>         
                    </div>

                    <div className="d-grid gap-3">
                        <Link className="text-reset notification-item mb-2">
                            <div className="d-flex">
                                <img className="px-3 rounded-circle" height={42} src={avatar1} alt="" />
                                <div className="px-2 ">
                                        <h6 className="m-0 fs-8">Nouvelle commande</h6>
                                        <p className="fw-lighter m-0 fs-8">N°252365 ( 320 $ ) 5 articles</p>
                                        <span className="d-flex gap-2 text-muted align-items-center">
                                        <i className="fa fa-clock"></i>
                                            il ya 3 heures
                                        </span>
                                </div>
                            </div>
                        </Link><Link className="text-reset notification-item">
                            <div className="d-flex">
                                <img className="px-3 rounded-circle" height={42} src={avatar1} alt="" />
                                <div className="px-2 ">
                                <h6 className="m-0 fs-8">Nouvelle commande</h6>
                                        <p className="fw-lighter m-0 fs-8">N°252365 ( 320 $ ) 4 articles</p>
                                        <span className="d-flex gap-2 text-muted align-items-center">
                                            <i className="fa fa-clock"></i>
                                            il y a 10 min
                                        </span>
                                </div>
                            </div>
                        </Link>
                    </div>
              </DropdownMenu>
            </Dropdown>
    </>
  )
}

export default NotificationDropdown