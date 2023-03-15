import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import TableContainer from "../../../components/tables/TableContainer";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Form,
  Alert,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListProductsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, token } from "../../../data";
import {
  // getProducts as onGetProducts,
  addNewProduct as onaddNewProduct,
  updateProduct as onupdateProduct,
  deleteProduct as onDeleteProduct,
  getProductsSuccess,
  addProductSuccess,
  addProductFail,
  updateProductSuccess,
  updateProductFail,
  deleteProductSuccess,
  deleteProductFail,
} from "../../../redux/products/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { getProductsSuccess } from "../../../redux/categories/actions";

const ListProducts = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des produits - Tableau | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [product, setProduct] = useState();
  const [image, setImage] = useState({});
  
  const error = useSelector((state) => state.products.error);

  const imageHandle = (e) =>  {
    const file = e.target
    setImage(file.files[0]);
  }

  useEffect(() => {
    fetch(API_URL + "/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getProductsSuccess(array));
      });
  }, []);

  
  const { products , categories } = useSelector((state) => ({
    products: state.products.products,
    categories: state.categories.categories,
  }));

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      slide_id: (product && product.slide_id) || "",
      title: (product && product.title) || "",
      subtitle: (product && product.subtitle) || "",
      description: (product && product.description) || "",
      link: (product && product.link) || "",
      order: (product && product.order) || "",
      btn: (product && product.btn) || "",
      image: (product && product.image) || "",
      url: (product && product.url) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Entrer le libelle"),
      subtitle: Yup.string().required("Entrer le sous titre"),
      slide_id: Yup.string().required("Selectionner le product parent"),
      description: Yup.string().required("Entrer la description"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateProduct = {
          id: product.id,
          slide_id: values.slide_id,
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          link: values.link,
          order: values.order,         
          btn: values.btn,
          image: image,
          url: values.url,
        };

        //update product
        dispatch(onupdateProduct(updateProduct));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editProductApi(
          updateProduct.slide_id,
          updateProduct.title,
          updateProduct.subtitle,
          updateProduct.description,
          updateProduct.link,
          updateProduct.btn,
          updateProduct.order,
          updateProduct.image,
          updateProduct.url
        );
      } else {
        const newProduct = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          slide_id: values["slide_id"],
          title: values["title"],
          subtitle: values['subtitle'],  
          description: values["description"],
          link: values['link'],
          btn: values["btn"],
          order: values['order'],  
          image: image,
          url: values['url'],
        };

        //save new product

        // console.log(newProduct);
        // return false;

        setIsloading(true);
        dispatch(onaddNewProduct(newProduct));
        addProductApi(
          newProduct.slide_id,
          newProduct.title,
          newProduct.subtitle,
          newProduct.description,
          newProduct.link,
          newProduct.btn,
          newProduct.order,
          newProduct.image,
          newProduct.url,
        );
        validation.resetForm(); 
      }
      toggle();
    },
  });

  
  const addProductApi = async (
    slide_id,
    title,
    subtitle,
    description,
    link,
    order,
    btn,
    image,
    url,
  ) => {
    await fetch(API_URL + "/products", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        slide_id: slide_id,
        title: title,
        subtitle: subtitle,
        description: description,
        link: link,
        order: order,
        btn: btn,
        url: url,
        image: image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        console.log(data);
        if (data.status === 201) {
          dispatch(addProductSuccess(data.product));
        } else {
          dispatch(addProductFail({ message: data.message ,  key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
        console.log(e);
      });
  };

  const deleteProductApi = async (product) => {
    await fetch(API_URL + "/products/" + product.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteProductSuccess(product));
      dispatch(deleteProductFail({ message: data.message , key : data.errors.key  }));
    });
  };

  const editProductApi = async (
    slide_id,
    title,
    subtitle,
    description,
    link,
    btn,
    order,
    image,
    url,

  ) => {
    await fetch(API_URL + "/products/" + product.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
       body:
      JSON.stringify({
        slide_id: slide_id,
        title: title,
        subtitle: subtitle,
        description: description,
        link: link,
        order: order,
        btn: btn,
        image: image,
        url: url,
      }),      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updateProductSuccess(data.product));
        } else {
          console.log(data.errors);
          dispatch(updateProductFail({ message: data.message ,key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const [productsList, setProductList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/products", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setProductList(array);
        dispatch(getProductsSuccess(array));
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" />;
        },
      },
      
      {
        Header: "Libellé",
        accessor: "title",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      
      {
        Header: "Slide",
        accessor: "slide_name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      
      {
        Header: "Description",
        accessor: "description",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const categoryData = cellProps.row.original;
                  handleProductClick(categoryData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Modifier
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const categoryData = cellProps.row.original;
                  onClickDelete(categoryData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Supprimer
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (products && !products.length) {
      dispatch(getProductsSuccess(products));
      setIsEdit(false);
    }
  }, [dispatch, products]);

  useEffect(() => {
    setProductList(products);
    setIsEdit(false);
  }, [products]);

  useEffect(() => {
    if (!isEmpty(products) && !!isEdit) {
      setProductList(products);
      setIsEdit(false);
    }
  }, [products]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleProductClick = (arg) => {
    const product = arg;

    setProduct({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      slide_id: product.slide_id,
      btn: product.btn,
      link: product.link,
      order: product.order,
      image: product.image,
      url: product.url,
    });

    setIsEdit(true);

    toggle();
  };

  var node = useRef();
  const onPaginationPageChange = (page) => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const handleDeleteProduct = () => {
    dispatch(onDeleteProduct(product));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteProductApi(product);
  };

  const handleProductClicks = () => {
    setProduct("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Paramètres"
            breadcrumbItem="Liste des produits items"
          />

          {error.message ? <Alert color="danger">{error.message} :
                <ul>
                {error.key && error.key.map((item) =>{
                  return <li> { item } </li>
                })} 
                </ul>

            </Alert> : null}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={products}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleProductClicks}
                    customPageSize={10}
                    className="custom-header-css"
                  />

                  {/* Formulaire */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit
                        ? "Formulaire de modification"
                        : "Formulaire de création"}
                    </ModalHeader>
                    <ModalBody>
                      <Form encType="multipart/form-data"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row form="true">
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Titre</Label>
                              <Input
                                name="title"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.title || ""}
                                invalid={
                                  validation.touched.title &&
                                  validation.errors.title
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.title &&
                              validation.errors.title ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.title}
                                </FormFeedback>
                              ) : null}
                            </div>
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Sous titre</Label>
                              <Input
                                name="subtitle"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.subtitle || ""}
                                invalid={
                                  validation.touched.subtitle &&
                                  validation.errors.subtitle
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.subtitle &&
                              validation.errors.subtitle ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.subtitle}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Description</Label>
                              <Input
                                name="description"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.description || ""}
                                invalid={
                                  validation.touched.description &&
                                  validation.errors.description
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.description &&
                              validation.errors.description ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.description}
                                </FormFeedback>
                              ) : null}
                            </div> 
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Link</Label>
                              <Input
                                name="link"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.link || ""}
                                invalid={
                                  validation.touched.link &&
                                  validation.errors.link
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.link &&
                              validation.errors.link ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.link}
                                </FormFeedback>
                              ) : null}
                            </div>
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Button text</Label>
                              <Input
                                name="btn"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.btn || ""}
                                invalid={
                                  validation.touched.btn &&
                                  validation.errors.btn
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.btn &&
                              validation.errors.btn ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.btn}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Ordre</Label>
                              <Input
                                name="order"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                
                                value={validation.values.order || ""}
                                invalid={
                                  validation.touched.order &&
                                  validation.errors.order
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.order &&
                              validation.errors.order ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.order}
                                </FormFeedback>
                              ) : null}
                            </div>
                            

                            <div className="mb-3">
                              <Label className="form-label">Slide</Label>
                              <Input
                                name="slide_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.slide_id || ""}
                                invalid={
                                  validation.touched.slide_id &&
                                  validation.errors.slide_id
                                    ? true
                                    : false
                                }
                              >
                                 <option value="0">--Selectionner--</option>
                                {categories &&
                                  categories.map((item) => (
                                    <option { ...item.id === values.slide_id ? 'selected' : ""}  key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.slide_id &&
                              validation.errors.slide_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.slide_id}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Image</Label>
                              <Input id="image"
                                name="image"
                                type="file"
                                onChange={ imageHandle}
                                onBlur={validation.handleBlur}
                                // value={validation.values.image || ""}
                                invalid={
                                  validation.touched.image &&
                                  validation.errors.image
                                    ? true
                                    : false
                                }
                              />
                             
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Image url</Label>
                              <Input
                                name="url"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.url || ""}
                                invalid={
                                  validation.touched.url &&
                                  validation.errors.url
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.url &&
                              validation.errors.url ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.url}
                                </FormFeedback>
                              ) : null}
                            </div>

                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-product"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListProducts;
