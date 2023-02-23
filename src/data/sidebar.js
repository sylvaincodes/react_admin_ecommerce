import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
      title: "Ecommerce",
      path: "#",
      icon: <i className="fa fa-shopping-bag"></i>,
      iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up"  />,
      iconOpened: <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down"/>,
   
      subNav: [
        {
          title: "Tableau de bord",
          path: "/ecommerce/dashboard",
        }
        ,{
          title: "Produits",
          path: "/ecommerce/produits",
        },{
          title: "Commandes",
          path: "/ecommerce/commandes",
        },{
          title: "Commandes",
          path: "/ecommerce/clients",
        }
      ],
    },
    
    {
      title: "Création de cv",
      path: "#",
      icon: <i className="fa fa-file"></i>,
      iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up"  />,
      iconOpened: <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down"/>,
   
      subNav: [
        {
          title: "Tableau de bord",
          path: "/resumes/dashboard",
        }
        ,{
          title: "CV",
          path: "/resumes/cv",
        },{
          title: "Lettre de motivation",
          path: "/resumes/lettres",
        }
      ]
    }

]