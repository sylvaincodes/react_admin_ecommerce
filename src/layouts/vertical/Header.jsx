import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-sm-light.png";
import {
  Button,
  Container,
  Form,
  Input,
  InputGroup,
} from "reactstrap";
import LanguageDropdown from "../../components/header/LanguageDropdown";
import NotificationDropdown from "../../components/header/NotificationDropdown";
import ProfilMenu from "../../components/header/ProfilMenu";


const Header = (props) => {
  const [search, setSearch] = useState(false);
    
  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard" className="logo logo-dark">
                <img src={logo} alt="logo" height={22} />
              </Link>
              <Link to="/dashboard" className="logo logo-light">
                <img src={logoLightSvg} alt="logo-light" width={22} />
              </Link>
            </div>
            <button className="btn btn-lg px-3"  onClick={props.showSidebar}>
              <i className="fa fa-bars"> </i>
            </button>
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block">
              <button
                className="btn header-item notif-icon"
                id="page-header-search-dropdown"
                onClick={() => {
                  setSearch(!search);
                }}
              >
                <i className="fa fa-search"></i>
              </button>

              <Container
                className={
                  search
                    ? "dropdown-menu-lg dropdown-menu-end dropdown-menu show p-3"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
              >
                <Form>
                  {/* <Row></Row> */}
                  <InputGroup>
                    <Input
                      aria-label="Recipient's username"
                      className="form-control"
                      type="text"
                      name="search"
                    />
                    <Button className="btn btn-primary">
                      <i className="fa fa-search"></i>
                    </Button>
                  </InputGroup>
                </Form>
              </Container>
            </div>

            <LanguageDropdown />

            <NotificationDropdown/>

            <ProfilMenu/>
            
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
