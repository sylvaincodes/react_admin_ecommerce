import React , { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import avatar1 from "../../assets/images/users/avatar-1.jpg"

const ProfilMenu = () => {

    const [profil, setProfil] = useState(false)
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

                        <Link className='text-reset'>
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