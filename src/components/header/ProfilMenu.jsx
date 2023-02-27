import React , { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import { API_URL, token } from '../../data'
import { logoutRequest } from '../../redux/auth/login/actions'
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'

const ProfilMenu = () => {

    const [profil, setProfil] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutApi = async (
        
      ) => {
        await fetch(API_URL+"/logout", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status == "200") {
              localStorage.removeItem('user');
              dispatch(logoutRequest());
              navigate("/login");
            } else {
            }
          })
          .catch((e) => {
           
          });
      };
    

  return (
    <>
        <Dropdown className='dropdown d-inline-block'  isOpen={profil} toggle={ () => setProfil(!profil) }>
                <DropdownToggle className='btn header-item clickme' tag="button">
                    <img src={avatar1} alt="" height={33} className="rounded-circle" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                    <div className='p-3 d-grid gap-3'>
                        <Link className='text-reset '>
                            <div className='d-flex gap-3 align-items-center fw-lighter'>
                                <i className='fa fa-user-alt'></i>
                                Profil
                            </div>
                        </Link><Link className='text-reset '>
                            <div className='d-flex gap-3 align-items-center fw-lighter'>
                                <i className='fa fa-globe'></i>
                                Parametres
                            </div>
                        </Link>

                        <div className='dropdown-divider'>

                        </div>

                        <Link onClick={() => logoutApi()} className='text-reset'>
                            <div className='d-flex gap-3 align-items-center fw-lighter'>
                                <i className='text-danger fa fa-power-off'></i>
                                Se déconnecter
                            </div>
                        </Link>

                    </div>
                </DropdownMenu>
        </Dropdown>
    </>
  )
}

export default ProfilMenu