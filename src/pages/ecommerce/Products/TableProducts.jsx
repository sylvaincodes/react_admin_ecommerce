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
import { getCategoriesSuccess } from "../../../redux/categories/actions";

const TableProducts = (props) => {
  //meta name
  // no-dupe-keys
  document.name = "Liste des produits - Tableau | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [product, setProduct] = useState();
  const [brands, setBrandList] = useState();
  // const [categories, setBrandList] = useState();
  const [image, setImage] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

  const error = useSelector((state) => state.products.error);
  
  const imageHandle = (e) =>  {
    const file = e.target
    setImage(file.files[0]);
  }

  const { products,categories } = useSelector(state => ({
    products: state.products,
    categories: state.categories,
  }))

  useEffect(() => {
    fetch(API_URL + "/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        // setFilterClothes(array);
        console.log(array);
        dispatch(getCategoriesSuccess(array));
      });
  }, []);

 
   
  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      category_id: (product && product.category_id) || "",
      name: (product && product.name) || "",
      brand_id: (product && product.brand_id) || "",
      description: (product && product.description) || "",
      quantity: (product && product.quantity) || "",
      content: (product && product.content) || "",
      status: (product && product.status) || "",
      image: (product && product.image) || "",
      url: (product && product.url) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      brand_id: Yup.string().required("Entrer le sous titre"),
      category_id: Yup.string().required("Selectionner le product parent"),
      status: Yup.string().required("Selectionner le status"),
      description: Yup.string().required("Entrer la description"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateProduct = {
          id: product.id,
          category_id: values.category_id,
          name: values.name,
          brand_id: values.brand_id,
          description: values.description,
          quantity: values.quantity,
          content: values.content,         
          status: values.status,
          image: image,
          url: values.url,
        };

        //update product
        dispatch(onupdateProduct(updateProduct));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editProductApi(
          updateProduct.category_id,
          updateProduct.name,
          updateProduct.brand_id,
          updateProduct.description,
          updateProduct.quantity,
          updateProduct.status,
          updateProduct.content,
          updateProduct.image,
          updateProduct.url
        );
      } else {
        const newProduct = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          category_id: values["category_id"],
          name: values["name"],
          brand_id: values['brand_id'],  
          description: values["description"],
          quantity: values['quantity'],
          status: values["status"],
          content: values['content'],  
          image: image,
          url: values['url'],
        };

        //save new product

        // console.log(newProduct);
        // return false;

        setIsloading(true);
        dispatch(onaddNewProduct(newProduct));
        addProductApi(
          newProduct.category_id,
          newProduct.name,
          newProduct.brand_id,
          newProduct.description,
          newProduct.quantity,
          newProduct.status,
          newProduct.content,
          newProduct.image,
          newProduct.url,
        );
        validation.resetForm(); 
      }
      toggle();
    },
  });

  const addProductApi = async (
    category_id,
    name,
    brand_id,
    description,
    quantity,
    content,
    status,
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
        category_id: category_id,
        name: name,
        brand_id: brand_id,
        description: description,
        quantity: quantity,
        content: content,
        status: status,
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
    category_id,
    name,
    brand_id,
    description,
    quantity,
    status,
    content,
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
        category_id: category_id,
        name: name,
        brand_id: brand_id,
        description: description,
        quantity: quantity,
        content: content,
        status: status,
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


  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" />;
        },
      },
      
      {
        Header: "Produit",
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      
      {
        Header: "Catégorie",
        accessor: "category",
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
      name: product.name,
      brand_id: product.brand_id,
      description: product.description,
      category_id: product.category_id,
      status: product.status,
      quantity: product.quantity,
      content: product.content,
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
            title="Ecommerce"
            breadcrumbItem="Liste des produits"
          />
          
          {/* 
          {error.message ? <Alert color="danger">{error.message} :
                <ul>
                {error.key && error.key.map((item) =>{
                  return <li> { item } </li>
                })} 
                </ul>

            </Alert> : null} */}

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
                                name="name"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                  validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                              validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Marques</Label>
                              <Input
                                name="brand_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.brand_id || ""}
                                invalid={
                                  validation.touched.brand_id &&
                                  validation.errors.brand_id
                                    ? true
                                    : false
                                }
                              >
                                <option value="">--Selectionner--</option>
                                
                              </Input>

                              {validation.touched.brand_id &&
                              validation.errors.brand_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.brand_id}
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
                                name="quantity"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.quantity || ""}
                                invalid={
                                  validation.touched.quantity &&
                                  validation.errors.quantity
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.quantity &&
                              validation.errors.quantity ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.quantity}
                                </FormFeedback>
                              ) : null}
                            </div>
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Status</Label>
                              <Input
                                name="status"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.status || ""}
                                invalid={
                                  validation.touched.status &&
                                  validation.errors.status
                                    ? true
                                    : false
                                }
                              >
                                <option value="0">--Selectionner--</option>
                                {brands &&
                                  brands.map((item) => (
                                    <option { ...item.id === values.brand_id ? 'selected' : ""}  key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.status &&
                              validation.errors.status ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.status}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Ordre</Label>
                              <Input
                                name="content"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                
                                value={validation.values.content || ""}
                                invalid={
                                  validation.touched.content &&
                                  validation.errors.content
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.content &&
                              validation.errors.content ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.content}
                                </FormFeedback>
                              ) : null}
                            </div>
                            

                            <div className="mb-3">
                              <Label className="form-label">Catégorie</Label>
                              <Input
                                name="category_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.category_id || ""}
                                invalid={
                                  validation.touched.category_id &&
                                  validation.errors.category_id
                                    ? true
                                    : false
                                }
                              >
                                 <option value="0">--Selectionner--</option>
                                {categories.categories &&
                                  categories.categories.map((item) => (
                                    <option { ...item.id === values.category_id ? 'selected' : ""}  key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.category_id &&
                              validation.errors.category_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.category_id}
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
                                className="status status-success save-product"
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

export default TableProducts;
