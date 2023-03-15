import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "../../data/index";

const Sidebar = (props) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  const setActive = (key) => {
    document.getElementById("li_"+key).classList.toggle('active');
    document.getElementById("subnav_"+key).classList.toggle('active');
  };

  return (
    <>
      <div id="sidebar-menu" className={ props.sidebar ? "show" : "hide" }>
        <ul className="menu-list">
          {SidebarData.map((item, key) => {

            if (item.status=="published") {
              
          
            return (
              <li className="menu-item" id={"li_"+key} key={key} onClick={ () => setActive(key) } >
                <Link
                  to={item.path}
                  className="d-flex gap-2 align-items-center active"
                >
                  {item.icon}
                  <span className="p-2">{item.title}</span>
                  {item.iconOpened}
                  {item.iconClosed}
                </Link>

                <ul
                  // className={
                  //   subnav
                  //     ? "sub-menu mm-collapse mm-show"
                  //     : "sub-menu mm-collapse"
                  // }
                  id={"subnav_"+key}
                  
                >
                  {
                    item.subNav.map((subitem, index) => {
                      return (
                        <li key={index}>
                          <Link to={subitem.path}>{subitem.title}</Link>
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          }
          else{
            return ""
          }
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
