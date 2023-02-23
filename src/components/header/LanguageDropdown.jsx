import React , { useState, useEffect } from 'react'
import i18n from '../../i18n';
import languages from '../../data/languages';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { get , map } from 'lodash'

const LanguageDropdown = () => {

  //Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE");
    setSelectedLang(currentLanguage);
  }, [])

  const toggle = () =>{
    setMenu(!menu)
  }

  const changeLanguageAction = lang => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  }

  return (
    <>
        <Dropdown isOpen={menu}  toggle={toggle} className="d-inline-block" >
          
          <DropdownToggle className='btn header-item' tag="button">
              <img height={16}  className='' src={ get(languages , `${ selectedLang}.flag` ) } alt=""/>
          </DropdownToggle>

          <DropdownMenu className='language-switch dropdown-menu-end dropdown-menu-lg'>
                {
                  map(Object.keys(languages) ,key => (

                    <DropdownItem key={key} className='d-flex align-items-center'  onClick={ () =>  changeLanguageAction(key)}>
                    <img 
                    src={get(languages, `${key}.flag`)} 
                    height={11}
                    alt="" />
                    <span className='px-3'>
                      { get(languages, `${key}.label`)} 
                    </span>
                    </DropdownItem>

                    ) )  }
              
          </DropdownMenu>
          
        </Dropdown>
    </>
  )
}

export default LanguageDropdown