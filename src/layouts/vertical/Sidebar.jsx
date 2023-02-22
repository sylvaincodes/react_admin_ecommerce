import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div id="sidebar-menu">
        <ul>
          <li>
            <Link href="#" className="d-flex gap-2 align-items-center active">
              <i className="fa fa-shopping-bag"></i>
              <span className="p-2">
                Ecommerce
              </span>
              <i className="ms-auto fa fa-arrow-down"></i>
            </Link>

            <ul>
              <li>
                <Link>Produits</Link>
              </li>
              <li>
                <Link>Commandes</Link>{" "}
              </li>
              <li>
                <Link>Clients</Link>{" "}
              </li>
            </ul>
          </li>

          <li>
            <Link href="#" className="d-flex gap-2 align-items-center">
              <i className="fa fa-cog"></i>
              <span className="p-2">
                Paramètres
              </span>
              <i className="ms-auto fa fa-arrow-down"></i>
            </Link>

            <ul>
              <li>
                <Link>Api</Link>
              </li>
              <li>
                <Link>langues</Link>{" "}
              </li>
              <li>
                <Link>autres</Link>{" "}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
