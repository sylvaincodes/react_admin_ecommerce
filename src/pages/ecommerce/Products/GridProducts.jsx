import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, Navigate, useNavigate, withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";
import classnames from "classnames";
import { isEmpty, map } from "lodash";

//Import Star Ratings
import StarRatings from "react-star-ratings";

//RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/dist/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";

//Import data
import { API_URL, token, discountData, productsData } from "../../../data/index";

//Import actions
import {
  getProducts as onGetProducts,
  getProductsSuccess,
} from "../../../redux/products/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getProductOffer } from "../../../helpers/functions";
import { getCategoriesSuccess } from "../../../redux/categories/actions";

const GridProducts = props => {

  
  //meta title
  document.title="GridProducts | Ecommerce";

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { products,categories } = useSelector(state => ({
    products: state.products,
    categories: state.categories,
  }))
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  

  const { history } = props
  const [FilterClothes, setFilterClothes] = useState(categories['categories'])
  const [productList, setProductList] = useState([])
  const [activeTab, setActiveTab] = useState("1")
  const [active, setActive] = useState(false)
  const [discountDataList, setDiscountDataList] = useState([])
  const [filters, setFilters] = useState({
    discount: [],
    price: { min: 0, max: 500 },
  })
  const [page, setPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState()

  const toggle = () =>{
    setActive(!active)
  }


  useEffect(() => {
    fetch(API_URL + "/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setFilterClothes(array);
        dispatch(getCategoriesSuccess(array));
      });
  }, []);


  useEffect(() => {
    setProductList(products.products);
    setTotalPage(products['total_page']);
    setDiscountDataList(discountData)
  }, [products, discountData])

  console.log(FilterClothes);

  useEffect(() => {
    return (products) => {
      if (!isEmpty(products)) {
        setProductList(products.products);
        setTotalPage(products['total_page']);
      }
    }
  }, [products])
  

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const onHandleInputSearch = e => {  
    const  { value } = e.target
    fetch(API_URL + "/search/products?search=" + value, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getProductsSuccess(array));
        console.log(array);
      });
  };  

  const onSelectDiscount = e => {
    const { value, checked } = e.target
    const { discount } = filters
    var existing = [...discount]
    if (checked) {
      existing = [...discount, value]
      setFilters({
        ...filters,
        discount: existing,
      })
    } else {
      const unCheckedItem = discount.find(item => item === value)
      if (unCheckedItem) {
        existing = discount.filter(item => item !== value)
      }
    }
    setFilters({
      ...filters,
      discount: existing,
    })
    // onFilterProducts(value, checked)

    let filteredProducts = products['products']
    if (checked && parseInt(value) === 0) {
      filteredProducts = products['products'].filter(product => getProductOffer(product.price , product.sale_price) < 10)
    } else if (checked && existing.length > 0) {
      filteredProducts = products['products'].filter(
        product => getProductOffer(product.price , product.sale_price) >= Math.min(...existing)
      )
    }
    setProductList(filteredProducts)
  }

  const onUpdate = (render, handle, value) => {
    setProductList(
      products['products'].filter(
        product => product.price >= value[0] && product.price <= value[1]
      )
    )
  }
  
  
  const onUpdateCategory= (category_id) => {
    setProductList(
      products['products'].filter(
        product => product.category_id === category_id
      )
    )
  }

  const [ratingvalues, setRatingvalues] = useState([])
  /*
  on change rating checkbox method
  */
  const onChangeRating = value => {
    setProductList(products['products'].filter(product => product.rating >= value))

    var modifiedRating = [...ratingvalues]
    modifiedRating.push(value)
    setRatingvalues(modifiedRating)
  }

  const onSelectRating = value => {
    setProductList(products['products'].filter(product => product.rating === value))
  }

  const onUncheckMark = (value) => {
    var modifiedRating = [...ratingvalues]
    const modifiedData = (modifiedRating || []).filter(x => x !== value)
    /*
    find min values
    */
    var filteredProducts = products['products']
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData)
      if (minValue && minValue !== Infinity) {
        filteredProducts = products['products'].filter(
          product => product.rating >= minValue
        )
        setRatingvalues(modifiedData)
      }
    } else {
      filteredProducts = products['products']
    }
    setProductList(filteredProducts)
  }

  const handlePageClick = (page) => {
    setPage(page);
    fetch(API_URL + "/products?page=" + page, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getProductsSuccess(array));
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Grid Products" />
          <Row>
            <Col lg="3">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Filtres</CardTitle>
                  <div>
                    <h5 className="font-size-14 mb-3">Catégories</h5>


                    {FilterClothes &&
                      FilterClothes.map((item, key) => {
                        if (item.parent_id==0) {
                          return <Dropdown className="dropdown"  toggle={() => setActive(!active) } isOpen={active}>
                          <DropdownToggle key={key} className='header-item btn' tag="button" onClick={ () => onUpdateCategory(item.id) }>
                                <i className="mdi mdi-chevron-right me-1" />
                                {item.name}
                          </DropdownToggle>
                        </Dropdown>;
                        }
                      })}

                  </div>
                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-4">Prix</h5>
                    <br />

                    <Nouislider
                      range={{ min: 0, max: 800}}
                      tooltips={true}
                      start={[100, 800]}
                      connect
                      tooltipVisible
                      step={5}
                      onSlide={onUpdate}
                    />
                  </div>

                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-3">Réductions</h5>
                    {discountData.map((discount, i) => (
                      <div className="form-check mt-2" key={i}>
                        <Input
                          type="checkbox"
                          value={discount.value}
                          className="form-check-input"
                          id={i}
                          onChange={onSelectDiscount}
                        />
                        <Label className="form-check-label" htmlFor={i}>
                          {discount.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-3">Avis des clients</h5>
                    <div>
                      <div className="form-check mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="productratingCheck1"
                          onChange={e => {
                            if (e.target.checked) {
                              onChangeRating(4)
                            } else {
                              onUncheckMark(4)
                            }
                          }}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="productratingCheck1"
                        >
                          4 <i className="fa fa-star text-warning" /> et Plus
                        </Label>
                      </div>
                      <div className="form-check mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="productratingCheck2"
                          onChange={e => {
                            if (e.target.checked) {
                              onChangeRating(3)
                            } else {
                              onUncheckMark(3)
                            }
                          }}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="productratingCheck2"
                        >
                          3 <i className="fa fa-star text-warning" /> et Plus
                        </Label>
                      </div>
                      <div className="form-check mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="productratingCheck3"
                          onChange={e => {
                            if (e.target.checked) {
                              onChangeRating(2)
                            } else {
                              onUncheckMark(2)
                            }
                          }}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="productratingCheck3"
                        >
                          2 <i className="fa fa-star text-warning" /> et Plus
                        </Label>
                      </div>
                      <div className="form-check mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="productratingCheck4"
                          onChange={e => {
                            if (e.target.checked) {
                              onSelectRating(1)
                            } else {
                              onUncheckMark(1)
                            }
                          }}
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="productratingCheck4"
                        >
                          1 <i className="fa fa-star text-warning" />
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="9">
              <Row className="mb-3">
                <Col xl="4" sm="6">
                  <div className="mt-2">
                    <h5>Produits</h5>
                  </div>
                </Col>
                <Col lg="8" sm="6">
                  <Form className="mt-4 mt-sm-0 float-sm-end d-flex align-items-center">
                    <div className="search-box me-2">
                      <div className="position-relative">
                        <Input
                          type="text"
                          className="form-control border-0"
                          placeholder="Rechercher..."
                          onChange={onHandleInputSearch}
                        />
                         <i className="fa fa-search search-icon" />
                      </div>
                    </div>
                    <Nav className="product-view-nav" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() =>
                            navigate(
                              `/ecommerce/produits/grid`
                            )
                          }
                        >
                          <i className="fa fa-bars"></i>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink 
                          className={classnames({
                            active: activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2");
                            navigate(
                              `/ecommerce/produits/table`
                            );
                          }}
                        >
                          <i className="fa fa-list" />
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Form>
                </Col>
              </Row>
              <Row>
                {!isEmpty(productList) &&
                  productList.map((product, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card key={key}
                        onClick={() =>
                          history.push(
                            `/ecommerce-product-detail/${product.id}`
                          )
                        }
                      >
                        <CardBody>
                          <div className="product-img position-relative">
                          {product.sale_price ? (
                              <div className="avatar-sm product-ribbon">
                                <span className="avatar-title rounded-circle bg-primary">
                                  {/* {`-${product.price - product.sale_price}%`} */}
                                  -{" "}
                                  {getProductOffer(
                                    product.price,
                                    product.sale_price
                                  )}{" "}
                                  %
                                </span>
                              </div>
                            ) : null}

                            <img
                              src={`http://localhost:3000/media/products/${product.images}`}
                              alt=""
                              className="img-fluid mx-auto d-block"
                            />

                          </div>
                          <div className="mt-4 text-center">
                            <h5 className="mb-3 text-truncate">
                              <Link
                                to={"/ecommerce-product-detail/" + product.id}
                                className="text-dark"
                              >
                                {product.name}{" "}
                              </Link>
                            </h5>
                            <div className="text-muted mb-3">
                              <StarRatings
                                rating={product.rating ? product.rating : 0}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="14px"
                                starSpacing="3px"
                              />
                            </div>
                            <h5 className="my-0">
                              {product.price ? (
                                <span>
                                  {product.sale_price ? (
                                    <span className="text-muted me-2">
                                      <del>${product.price}</del>
                                    </span>
                                  ) : (
                                    <b>${product.price}</b>
                                  )}
                                </span>
                              ) : (
                                ""
                              )}
                              {product.sale_price ? (
                                <b>${product.sale_price}</b>
                              ) : (
                                ""
                              )}
                            </h5>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
              </Row>
              <Row>
                <Col lg="12">
                  <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                    <PaginationItem disabled={page === 1}>
                      <PaginationLink
                        previous
                        href="#"
                        onClick={() => handlePageClick(page - 1)}
                      />
                    </PaginationItem>
                    {map(Array(totalPage), (item, i) => (
                      <PaginationItem active={i + 1 === page} key={i}>
                        <PaginationLink
                          onClick={() => handlePageClick(i + 1)}
                          href="#"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={page === totalPage}>
                      <PaginationLink
                        next
                        href="#"
                        onClick={() => handlePageClick(page + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

GridProducts.propTypes = {
  products: PropTypes.array,
  history: PropTypes.object,
  onGetProducts: PropTypes.func,
}

export default (GridProducts)
