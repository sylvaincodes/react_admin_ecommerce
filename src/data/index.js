/** Product 1 */
import product1 from "../assets/images/product/img-1.png";
import product7 from "../assets/images/product/Pro-1a.png";
import product8 from "../assets/images/product/Pro-1b.png";

/** Product 2 */
import product2a from "../assets/images/product/img-2.png";
import product2b from "../assets/images/product/Pro-2a.png";
import product2c from "../assets/images/product/Pro-2b.png";

/** Product 3 */
import product3a from "../assets/images/product/img-3.png";
import product3b from "../assets/images/product/Pro-4.png";
import product3c from "../assets/images/product/Pro-4a.png";

/** Product 4 */
import product4a from "../assets/images/product/img-4.png";
import product4b from "../assets/images/product/Pro-12a.png";
import product4c from "../assets/images/product/Pro-12b.png";

/** Product 5 */
import product5a from "../assets/images/product/Pro-8.png";
import product5b from "../assets/images/product/Pro-8a.png";
import product5c from "../assets/images/product/Pro-8b.png";

/** Product 6 */
import product6a from "../assets/images/product/img-6.png";
import product6b from "../assets/images/product/Pro-17.png";
import product6c from "../assets/images/product/Pro-17a.png";

// Languages
import us from "../assets/images/flags/us.jpg";
import spain from "../assets/images/flags/spain.jpg";
import germany from "../assets/images/flags/germany.jpg";
import italy from "../assets/images/flags/italy.jpg";
import russia from "../assets/images/flags/russia.jpg";
import french from "../assets/images/flags/french.jpg";

//Languages
import * as RiIcons from "react-icons/ri";

export const API_URL =
  "https://laravelapiecommerce.000webhostapp.com/public/api";
export const BASE_URL = "https://laravelapiecommerce.000webhostapp.com/public/";
export const token = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user")).token
  : "";

export const productsData = [
  {
    id: 1,
    image: "product1",
    name: "Half sleeve T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 5,
    oldPrice: 500,
    newPrice: 405,
    isOffer: true,
    offer: 10,
    reviews: 0,
    subImage: [product1, product7, product8],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "M" },
      { type: "Color", value: "Red" },
    ],

    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product8", color: "Red" },
      { image: "product7", color: "Black" },
    ],
  },
  {
    id: 2,
    image: "product2",
    name: "Black color T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 5,
    oldPrice: 225,
    newPrice: 175,
    isOffer: true,
    offer: 20,
    reviews: 0,
    subImage: [product2a, product2b, product2c],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "L" },
      { type: "Color", value: "Light blue" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product2", color: "Light blue" },
      { image: "product9", color: "Black" },
    ],
  },
  {
    id: 3,
    image: "product3",
    name: "Printed T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 4,
    oldPrice: 177,
    newPrice: 152,
    isOffer: true,
    offer: 14,
    reviews: 0,
    subImage: [product3a, product3b, product3c],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "XL" },
      { type: "Color", value: "Black" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product3", color: "Black" },
      { image: "product10", color: "White" },
    ],
  },
  {
    id: 4,
    image: "product4",
    name: "Smiley Plain T-shirt",
    link: "#",
    category: "Hoodies",
    rating: 3,
    oldPrice: 150,
    newPrice: 145,
    isOffer: true,
    offer: 5,
    reviews: 0,
    subImage: [product4a, product4b, product4c],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "M" },
      { type: "Color", value: "Blue" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product4", color: "Blue" },
      { image: "product11", color: "Black" },
    ],
  },
  {
    id: 5,
    image: "product5",
    name: "Full sleeve T-Shirt",
    link: "#",
    category: "T-shirts",
    rating: 1,
    oldPrice: 177,
    newPrice: 152,
    isOffer: false,
    offer: 0,
    reviews: 5,
    subImage: [product5a, product5b, product5c],
    specification: [
      { type: "Size", value: "S" },
      { type: "Color", value: "Coral" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product5", color: "Coral" },
      { image: "product12", color: "Black" },
    ],
  },
  {
    id: 6,
    image: "product6",
    name: "Sky blue color T-shirt",
    link: "#",
    category: "T-shirts",
    rating: 5,
    oldPrice: 200,
    newPrice: 100,
    isOffer: true,
    offer: 50,
    reviews: 10,
    subImage: [product6a, product6b, product6c],
    specification: [
      { type: "Category", value: "T-shirt" },
      { type: "Brand", value: "Levis" },
      { type: "Size", value: "L" },
      { type: "Color", value: "Green" },
    ],
    features: [
      { icon: "fa fa-caret-right", type: "Fit", value: "Regular fit" },
      { icon: "fa fa-caret-right", type: "", value: "Highest quality fabric" },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Suitable for all weather condition",
      },
      {
        icon: "fa fa-caret-right",
        type: "",
        value: "Excellent Washing and Light Fastness",
      },
    ],
    colorOptions: [
      { image: "product6", color: "Green" },
      { image: "product13", color: "Black" },
    ],
  },
];

export const languages = {
  sp: {
    label: "Espagnol",
    flag: spain,
  },
  gr: {
    label: "Germanien",
    flag: germany,
  },
  it: {
    label: "Italien",
    flag: italy,
  },
  rs: {
    label: "Russe",
    flag: russia,
  },
  en: {
    label: "Anglais",
    flag: us,
  },
  fr: {
    label: "Français",
    flag: french,
  },
};

export const SidebarData = [
  {
    title: "Ecommerce",
    path: "#",
    status: "published",
    icon: <i className="fa fa-shopping-bag"></i>,
    iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up" />,
    iconOpened: (
      <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down" />
    ),

    subNav: [
      {
        title: "Tableau de bord",
        path: "/ecommerce/dashboard",
      },
      {
        title: "Produits",
        path: "/ecommerce/produits",
      },
      {
        title: "Categorie de produits",
        path: "/ecommerce/categories",
      },
      {
        title: "Marque de produits",
        path: "/ecommerce/brands",
      },
      {
        title: "Collection de produits",
        path: "/ecommerce/collections",
      },
      {
        title: "Attributs de produits",
        path: "/ecommerce/pattributes",
      },
      {
        title: "Valeurs Attributs de produits",
        path: "/ecommerce/pattributeitems",
      },
      {
        title: "Commandes",
        path: "/ecommerce/commandes",
      },
      {
        title: "Clients",
        path: "/ecommerce/clients",
      },
    ],
  },

  {
    title: "Création de cv",
    path: "#",
    status: "draft",
    icon: <i className="fa fa-file"></i>,
    iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up" />,
    iconOpened: (
      <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down" />
    ),

    subNav: [
      {
        title: "Tableau de bord",
        path: "/resumes/dashboard",
      },
      {
        title: "CV",
        path: "/resumes/cv",
      },
      {
        title: "Lettre de motivation",
        path: "/resumes/lettres",
      },
    ],
  },

  {
    title: "Utilisateurs",
    path: "#",
    status: "published",
    icon: <i className="fa fa-user"></i>,
    iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up" />,
    iconOpened: (
      <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down" />
    ),

    subNav: [
      {
        title: "Comptes",
        path: "/users/list",
      },
    ],
  },

  {
    title: "Paramètres",
    path: "#",
    status: "published",
    icon: <i className="fa fa-key"></i>,
    iconClosed: <RiIcons.RiArrowUpSFill className="ms-auto fa fa-arrow-up" />,
    iconOpened: (
      <RiIcons.RiArrowDownSFill className="ms-auto fa fa-arrow-down" />
    ),

    subNav: [
      {
        title: "Slides",
        path: "/parametres/slides/list",
      },

      {
        title: "Slides Items",
        path: "/parametres/slides/items/list",
      },
    ],
  },
];
