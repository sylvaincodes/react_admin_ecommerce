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
  FormGroup,
  FormText
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListProductsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, productsData, token } from "../../../data";
import {
  getProducts as onGetProducts,
  addNewProduct as onAddNewProduct,
  updateProduct as onUpdateProduct,
  deleteProduct as onDeleteProduct,
  getProductsSuccess,
  addProductSuccess,
  addProductFail,
  updateProductSuccess,
  updateProductFail,
  deleteProductSuccess,
  deleteProductFail,
  setProductSuccess,
} from "../../../redux/products/actions";

import { values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray, stringToArray } from "../../../helpers/functions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const ListProducts = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des produits | Admin ";

  const [isloading, setIsloading] = useState(false);
  const [images, setImages] = useState({});
  const [url, setUrl] = useState([]);
  // const [imagesList, setImageslist] = useState();
  const dispatch = useDispatch();
  const [product, setProduct] = useState();

  const error = useSelector((state) => state.products.error);

  const { products, brands, categories, collections } = useSelector((state) => ({
    products: state.products.products,
    brands: state.brands.brands,
    categories: state.categories.categories,
    collections: state.collections.collections,
  }));

  const imageHandle = (e) => {
    
    const file = e.target;
    setImages(file.files);
    
    if (images == null) {
      return;
    } else { 

      const array = [];

      Object.keys(e.target.files).forEach(key => {
        let image = e.target.files[key];
        const imageRef = ref(storage, `media/products/${image.name + v4()}`);
        uploadBytes(imageRef, image).then((data) => {
          getDownloadURL(data.ref).then((url) => {
            setIsloading(true);
            array.push({ url : url })
            setIsloading(false);  
          });
        });
        
      });
      setUrl(array);
    }
  };
  
  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      category_id: (product && product.category_id) || "",
      collection_id: (product && product.collection_id) || "",
      name: (product && product.name) || "",
      brand_id: (product && product.brand_id) || "",
      description: (product && product.description) || "",
      quantity: (product && product.quantity) || "0",
      content: (product && product.content) || "",
      status: (product && product.status) || "",
      images: (product && product.images) || "",
      url: (product && product.url) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      brand_id: Yup.string().required("Entrer le sous titre"),
      category_id: Yup.string().required("Selectionner la catégorie"),
      collection_id: Yup.string().required("Selectionner la collection"),
      status: Yup.string().required("Selectionner le status"),
      description: Yup.string().required("Entrer la description"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateProduct = {
          id: product.id,
          category_id: values.category_id,
          collection_id: values.collection_id,
          name: values.name,
          brand_id: values.brand_id,
          description: values.description,
          quantity: values.quantity,
          content: values.content,
          status: values.status,
          images: images,
          url: url.length==0 ? values.url : url ,
        };

        //update product
          // console.log(updateProduct);
          // return false;

        dispatch(onUpdateProduct(updateProduct));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editProductApi(
          updateProduct.category_id,
          updateProduct.collection_id,
          updateProduct.name,
          updateProduct.brand_id,
          updateProduct.description,
          updateProduct.quantity,
          updateProduct.status,
          updateProduct.content,
          updateProduct.images,
          updateProduct.url
        );
      } else {
        const newProduct = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          category_id: values["category_id"],
          collection_id: values["collection_id"],
          name: values["name"],
          brand_id: values["brand_id"],
          description: values["description"],
          quantity: values["quantity"],
          status: values["status"],
          content: values["content"],
          images: images,
          url: url,
        };

        // save new product
        // console.log(newProduct);
        // return false;

        setIsloading(true);
        dispatch(onAddNewProduct(newProduct));
        addProductApi(
          newProduct.category_id,
          newProduct.collection_id,
          newProduct.name,
          newProduct.brand_id,
          newProduct.description,
          newProduct.quantity,
          newProduct.status,
          newProduct.content,
          newProduct.images,
          newProduct.url
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addProductApi = async (
    category_id,
    collection_id,
    name,
    brand_id,
    description,
    quantity,
    status,
    content,
    images,
    url
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
        status: status,
        content: content,
        images: images,
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status == 201) {
          dispatch(addProductSuccess(data.product));
          setUrl("");
        } else {
          dispatch(
            addProductFail({ message: data.message, key: errorsInArray(data) })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
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
      setUrl("");
    });
  };

  const editProductApi = async (
    category_id,
    collection_id,
    name,
    brand_id,
    description,
    quantity,
    status,
    content,
    images,
    url
  ) => {
    await fetch(API_URL + "/products/" + product.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        category_id: category_id,
        collection_id: collection_id,
        name: name,
        brand_id: brand_id,
        description: description,
        quantity: quantity,
        content: content,
        status: status,
        images: images,
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updateProductSuccess(data.product));
          setUrl("");
        } else {
          dispatch(
            updateProductFail({ message: data.message, key: data.errors.key })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const [productList, setProductList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setIsloading(true);
    fetch(API_URL + "/products", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setProductList(array.data);
        dispatch(getProductsSuccess(array));
        setIsloading(false);
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
        Header: "Thumball",
        accessor: "image",
        disableFilters: true,
        filterable: false,

        accessor: (cellProps) => (
          <>
            {!cellProps.url ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cellProps.name.charAt(0)}
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={ cellProps.url ? cellProps.url :  BASE_URL+'media/products/'+cellProps.image}
                  alt=""
                />
              </div>
            )}
          </>
        ),
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
                  const data = cellProps.row.original;
                  handleProductClick(data);
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
                  const data = cellProps.row.original;
                  onClickDelete(data);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Supprimer
                </UncontrolledTooltip>
              </Link>
              
              
              <Link
                to={`/ecommerce/pvariations`}
                className="text-danger"
                onClick={ () => {
                    handleSetProduct(cellProps.row.original)
                } }
              >
                <i className="mdi mdi-plus font-size-18" id="addooltip" />
                <UncontrolledTooltip placement="top" target="addooltip">
                  Ajouter une variation
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
    setProductList(products);
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
      collection_id: product.collection_id,
      status: product.status,
      quantity: product.quantity,
      content: product.content,
      images: product.images,
      url: product.url,
    });

    setIsEdit(true);

    toggle();
  };  
  
  
  const handleSetProduct = (arg) => {
    dispatch(setProductSuccess(arg));
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

  //const keyField = "id";

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

          <Breadcrumbs title="Ecommerce" breadcrumbItem="Liste des produits" />

          {error && error.message ? (
            <Alert color="danger">
              {error.message} :
              {/* <ul>
                {error.key.map(  (item, key) =>  

                  <li key={key}> {item['key'][0]}   </li>    )}
                 
                </ul> */}
            </Alert>
          ) : null}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={productList}
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
                      <Form
                        encType="multipart/form-data"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row form="true">
                          <Col xs={12}>

                            <LoadingSpinner isloading={isloading} />


                            <div className="mb-3">
                              <Label className="form-label">Nom</Label>
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
                                <option value="0">--Selectionner--</option>
                                {brands &&
                                  brands.map((item) => (
                                    <option
                                      {...(item.id === values.brand_id
                                        ? "selected"
                                        : "")}
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.brand_id &&
                              validation.errors.brand_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.brand_id}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Catégories</Label>
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
                                {categories &&
                                  categories.map((item) => (
                                    <option
                                      {...(item.id === values.category_id
                                        ? "selected"
                                        : "")}
                                      key={item.id}
                                      value={item.id}
                                    >
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
                              <Label className="form-label">Collections</Label>
                              <Input
                                name="collection_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.collection_id || ""}
                                invalid={
                                  validation.touched.collection_id &&
                                  validation.errors.collection_id
                                    ? true
                                    : false
                                }
                              >
                                <option value="0">--Selectionner--</option>
                                {collections &&
                                  collections.map((item) => (
                                    <option
                                      {...(item.id === values.collection_id
                                        ? "selected"
                                        : "")}
                                      key={item.id}
                                      value={item.id}
                                    >
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
                              <Label className="form-label">Description</Label>
                              <Input
                                name="description"
                                type="textarea"
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
                              <Label className="form-label">Quantité</Label>
                              <Input
                                name="quantity"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.quantity || ""}
                                invalid={
                                  validation.touched.quantity &&
                                  validation.errors.quantity
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.quantity &&
                              validation.errors.quantity ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.quantity}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Contenu</Label>
                              <Input
                                name="content"
                                type="textarea"
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
                                <option value="">--Selectionner--</option>
                                <option value="published">Publié</option>
                                <option value="draft">Brouillon</option>
                              </Input>

                              {validation.touched.status &&
                              validation.errors.status ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.status}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <FormGroup className="mb-3">
                              <Label className="form-label">Image</Label>
                              <Input
                                id="images"
                                name="images[]"
                                type="file"
                                multiple
                                onChange={imageHandle}
                                onBlur={validation.handleBlur}
                                // value={validation.values.images || ""}
                                invalid={
                                  validation.touched.images &&
                                  validation.errors.images
                                    ? true
                                    : false
                                }
                              />
                              <FormText>
                                Pour ajouter ou supprimer # Retélecharger de nouveau #</FormText>
                            </FormGroup>

                            
                            <div className="mb-3">
                              <Label className="form-label">Prévisionnez</Label>
                              <div className="d-flex flex-wrap w-auto gap-3">
                              {
 
                                url && url.map( (item,key)=> (                                 
                                  <img height={200} key={key} width={200} src={item.url} alt="" />
                                  ) )
                                }
                              </div>
                            </div>
                            
                            
                            <div className="mb-3">
                              <Label className="form-label">Images par défault</Label>
                              <div className="d-flex flex-wrap w-auto gap-3">
                              {
                             
                             validation.values.url ? 
                              stringToArray(validation.values.url).map((url_, key) => (
                                <img key={key} className="img-thumbnail" width={200} src={url_} alt="" />
                              ))

                              :

                              "Aucun"

                      
                                }
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Url</Label>
                              <Input
                              placeholder="A ne pas renseigner"
                                readOnly
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
