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
  FormText,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListPvariationsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  getPvariations as onGetPvariations,
  addNewPvariation as onAddNewPvariation,
  updatePvariation as onUpdatePvariation,
  deletePvariation as onDeletePvariation,
  getPvariationsSuccess,
  addPvariationSuccess,
  addPvariationFail,
  updatePvariationSuccess,
  updatePvariationFail,
  deletePvariationSuccess,
  deletePvariationFail,
  setPvariationSuccess,
} from "../../../redux/pvariations/actions";

import { getPattributesSuccess } from "../../../redux/pattributes/actions";
import { getPattributeitemsSuccess } from "../../../redux/pattributeitems/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray } from "../../../helpers/functions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { stringToArray } from "../../../helpers/functions";

const ListPvariations = (props) => {

  //meta title
  // no-dupe-keys
  document.title = "Liste des attributs produits | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [pvariation, setPvariation] = useState();
  const [pvariationList, setPvariationList] = useState([]);
  const [pattributeItemList, setPattributeItemList] = useState([]);
  const [pattributeList, setPattributeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [priceActive, setPriceActive] = useState(true);
  const [images, setImages] = useState();
  const [url, setUrl] = useState([]);

  const imageHandle = (e) => {
    const file = e.target;
    setImages(file.files);

    if (images == null) {
      return;
    } else {
      const array = [];

      Object.keys(e.target.files).forEach((key) => {
        let image = e.target.files[key];
        const imageRef = ref(storage, `media/products/${image.name + v4()}`);
        uploadBytes(imageRef, image).then((data) => {
          getDownloadURL(data.ref).then((url) => {
            setIsloading(true);
            array.push({ url: url });
            setIsloading(false);
          });
        });
      });
      setUrl(array);
    }
  };

  const [isEdit, setIsEdit] = useState(false);

  const checkboxRef = useRef("");

  const error = useSelector((state) => state.pvariations.error);

  const { pvariations, products, pattributes } = useSelector((state) => ({
    pvariations: state.pvariations.pvariations,
    products: state.products,
    pattributes: state.pattributes,
  }));

  const handleClickPrice = (e) => {
    if (e.target.value.length == 0) {
      setPriceActive(true);
    } else {
      setPriceActive(false);
    }
  };

  const handleSetProductVariation = (arg) => {
    dispatch(setPvariationSuccess(arg));
  };

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      price: (pvariation && pvariation.price) || "",
      price_discount: (pvariation && pvariation.price_discount) || "",
      date_debut_discount: (pvariation && pvariation.date_debut_discount) || "",
      date_fin_discount: (pvariation && pvariation.date_fin_discount) || "",
      stock_status: (pvariation && pvariation.stock_status) || "",
      weight: (pvariation && pvariation.weight) || "",
      lenght: (pvariation && pvariation.lenght) || "",
      wide: (pvariation && pvariation.wide) || "",
      height: (pvariation && pvariation.height) || "",
      url: (pvariation && pvariation.url) || "",
      product_id: products.product.id,

    },
    validationSchema: Yup.object({
      price: Yup.string().required("Entrer le prix"),
      stock_status: Yup.string().required("Selectionner"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatePvariation = {
          id: pvariation.id,
          price: values.price,
          price_discount: values.price_discount,
          date_debut_discount: values.date_debut_discount,
          date_fin_discount: values.date_fin_discount,
          stock_status: values.stock_status,
          weight: values.weight,
          lenght: values.lenght,
          wide: values.wide,
          height: values.height,
          url: url.length == 0 ? values.url : url     ,
          product_id: products.product.id,     
        };

        //  console.log(updatePvariation);
        //  return false;

        //update pvariation
        dispatch(onUpdatePvariation(updatePvariation));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editPvariationApi(
          updatePvariation.price,
          updatePvariation.price_discount,
          updatePvariation.date_debut_discount,
          updatePvariation.date_fin_discount,
          updatePvariation.stock_status,
          updatePvariation.weight,
          updatePvariation.lenght,
          updatePvariation.wide,
          updatePvariation.height,
          updatePvariation.url,
        );
      } else {
        const newPvariation = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          price: values["price"],
          price_discount: values["price_discount"],
          date_debut_discount: values["date_debut_discount"],
          stock_status: values["stock_status"],
          weight: values["weight"],
          lenght: values["lenght"],
          wide: values["wide"],
          height: values["height"],
          url: url,
          product_id: products.product.id,     
        };
        // save new pvariation

        //  console.log(newPvariation);
        //  return false;

        setIsloading(true);
        dispatch(onAddNewPvariation(newPvariation));
        addPvariationApi(
          newPvariation.price,
          newPvariation.price_discount,
          newPvariation.date_debut_discount,
          newPvariation.date_fin_discount,
          newPvariation.stock_status,
          newPvariation.weight,
          newPvariation.lenght,
          newPvariation.wide,
          newPvariation.height,
          newPvariation.url,
          newPvariation.product_id,
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addPvariationApi = async (
    price,
    price_discount,
    date_debut_discount,
    date_fin_discount,
    stock_status,
    weight,
    lenght,
    wide,
    height,
    url,
    product_id
  ) => {
    await fetch(API_URL + "/pvariations", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        price: price,
        price_discount: price_discount,
        date_debut_discount: date_debut_discount,
        date_fin_discount: date_fin_discount,
        stock_status: stock_status,
        weight: weight,
        lenght: lenght,
        wide: wide,
        height: height,
        url: url,
        product_id: product_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 201) {
          dispatch(addPvariationSuccess(data.pvariation));
        } else {
          dispatch(
            addPvariationFail({
              message: data.message,
              key: errorsInArray(data),
            })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deletePvariationApi = async (pvariation) => {
    await fetch(API_URL + "/pvariations/" + pvariation.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deletePvariationSuccess(pvariation));
    });
  };

  const editPvariationApi = async (
    price,
    price_discount,
    date_debut_discount,
    date_fin_discount,
    stock_status,
    weight,
    lenght,
    wide,
    height,
    url
  ) => {
    await fetch(API_URL + "/pvariations/" + pvariation.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        price: price,
        price_discount: price_discount,
        date_debut_discount: date_debut_discount,
        date_fin_discount: date_fin_discount,
        stock_status: stock_status,
        weight: weight,
        lenght: lenght,
        wide: wide,
        height: height,
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updatePvariationSuccess(data.pvariation));
          setUrl("");
        } else {
          dispatch(
            updatePvariationFail({
              message: data.message,
              key: errorsInArray(data),
            })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  useEffect(() => {
    setIsloading(true);
    fetch(API_URL + "/pvariations?id="+ products.product.id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPvariationList(array);
        dispatch(getPvariationsSuccess(array));
        setIsloading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setIsloading(true);
    fetch(API_URL + "/pattributes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPattributeList(array);
        dispatch(getPattributesSuccess(array));
        setIsloading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setIsloading(true);
    fetch(API_URL + "/pattributeitems", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPattributeItemList(array);
        dispatch(getPattributeitemsSuccess(array));
        setIsloading(false);
      });
  }, [dispatch]);

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
        disableFilters: true,
        filterable: false,

        accessor: (cellProps) => (
          <>
            {!cellProps.url ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">I</span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={
                    cellProps.url
                      ? cellProps.url
                      : BASE_URL + "media/products/" + cellProps.image
                  }
                  alt=""
                />
              </div>
            )}
          </>
        ),
      },

      {
        Header: "Stock",
        accessor: "stock_status",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },

      {
        Header: "Prix",
        accessor: "price",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },

      {
        Header: "Actif",
        disableFilters: true,
        filterable: false,
        accessor: (cellProps) => (
          <>
            <div className="form-check text-center">
              <input
                name="is_default"
                className="form-check-input"
                type="radio"
              />
            </div>
          </>
        ),
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const pvariationData = cellProps.row.original;
                  handlePvariationClick(pvariationData);
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
                  const pvariationData = cellProps.row.original;
                  onClickDelete(pvariationData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Supprimer
                </UncontrolledTooltip>
              </Link>
              
              <Link
                to={`/ecommerce/pvariationattributes`}
                onClick={ () => {
                    handleSetProductVariation(cellProps.row.original)
                } }
                className="text-success"
                
              >
                <i className="fa fa-plus font-size-18" id="addattribut" />
                <UncontrolledTooltip placement="top" target="addattribut">
                  Ajouter un attribut
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
    setPvariationList(pvariations);
  }, [pvariations]);

  const toggle = () => {
    setModal(!modal);
  };

  const handlePvariationClick = (arg) => {
    const pvariation = arg;

    setPvariation({
      id: pvariation.id,
      price: pvariation.price,
      price_discount: pvariation.price_discount,
      date_debut_discount: pvariation.date_debut_discount,
      date_fin_discount: pvariation.date_fin_discount,
      stock_status: pvariation.stock_status,
      weight: pvariation.weight,
      lenght: pvariation.lenght,
      wide: pvariation.wide,
      height: pvariation.height,
      url: pvariation.url,
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

  const onClickDelete = (pvariation) => {
    setPvariation(pvariation);
    setDeleteModal(true);
  };

  const handleDeletePvariation = () => {
    dispatch(onDeletePvariation(pvariation));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deletePvariationApi(pvariation);
  };

  const handlePvariationClicks = () => {
    setPvariation("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePvariation}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Les produits" back="/ecommerce/produits"
            breadcrumbItem={`Liste des variations`}
          />

          {error.message ? (
            <Alert color="danger">
              {error.message} :
              <ul>
                {error.key.map((item, key) => (
                  <li key={key}> {item["key"][0]} </li>
                ))}
              </ul>
            </Alert>
          ) : null}
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Row className="mb-3">
                    <h5>
                      <strong>Produit : </strong>
                      {`${products.product.name}`}
                    </h5>
                  </Row>
                  <TableContainer
                    columns={columns}
                    data={pvariations}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handlePvariationClicks}
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
                            
                            <div className="mb-3">
                              <Label className="form-label">Prix</Label>
                              <Input
                                name="price"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.price || ""}
                                invalid={
                                  validation.touched.price &&
                                  validation.errors.price
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.price &&
                              validation.errors.price ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.price}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">
                                Prix promotionnelle
                              </Label>
                              <Input
                                onInput={(e) => handleClickPrice(e)}
                                name="price_discount"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.price_discount || ""}
                                invalid={
                                  validation.touched.price_discount &&
                                  validation.errors.price_discount
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.price_discount &&
                              validation.errors.price_discount ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.price_discount}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">
                                Date début promotion
                              </Label>
                              <Input
                                disabled={priceActive}
                                name="date_debut_discount"
                                type="date"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.date_debut_discount}
                                invalid={
                                  validation.touched.date_debut_discount &&
                                  validation.errors.date_debut_discount
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.date_debut_discount &&
                              validation.errors.date_debut_discount ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.date_debut_discount}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">
                                Date fin promotion
                              </Label>
                              <Input
                                disabled={priceActive}
                                name="date_fin_discount"
                                type="date"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.date_fin_discount}
                                invalid={
                                  validation.touched.date_fin_discount &&
                                  validation.errors.date_fin_discount
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.date_fin_discount &&
                              validation.errors.date_fin_discount ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.date_fin_discount}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Poids</Label>
                              <Input
                                name="weight"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.weight}
                                invalid={
                                  validation.touched.weight &&
                                  validation.errors.weight
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.weight &&
                              validation.errors.weight ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.weight}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Longueur</Label>
                              <Input
                                name="lenght"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.lenght}
                                invalid={
                                  validation.touched.lenght &&
                                  validation.errors.lenght
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.lenght &&
                              validation.errors.lenght ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.lenght}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Largeur</Label>
                              <Input
                                name="wide"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.wide}
                                invalid={
                                  validation.touched.wide &&
                                  validation.errors.wide
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.wide &&
                              validation.errors.wide ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.wide}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Hauteur</Label>
                              <Input
                                name="height"
                                type="number"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.height}
                                invalid={
                                  validation.touched.height &&
                                  validation.errors.height
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.height &&
                              validation.errors.height ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.height}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Status Stock</Label>
                              <Input
                                name="stock_status"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.stock_status || ""}
                                invalid={
                                  validation.touched.stock_status &&
                                  validation.errors.stock_status
                                    ? true
                                    : false
                                }
                              >
                                <option value="">--Selectionner--</option>
                                <option value="en_stock">En stock</option>
                                <option value="epuise">Epuisé</option>
                              </Input>

                              {validation.touched.stock_status &&
                              validation.errors.stock_status ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.stock_status}
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
                                Pour ajouter ou supprimer # Retélecharger de
                                nouveau #
                              </FormText>
                            </FormGroup>

                            <div className="mb-3">
                              <Label className="form-label">Prévisionnez</Label>
                              <div className="d-flex flex-wrap w-auto gap-3">
                                {url &&
                                  url.map((item, key) => (
                                    <img
                                      height={200}
                                      key={key}
                                      width={200}
                                      src={item.url}
                                      alt=""
                                    />
                                  ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">
                                Images par défault
                              </Label>
                              <div className="d-flex flex-wrap w-auto gap-3">
                                {validation.values.url
                                  ? stringToArray(validation.values.url).map(
                                      (url_, key) => (
                                        <img
                                          key={key}
                                          className="img-thumbnail"
                                          width={200}
                                          src={url_}
                                          alt=""
                                        />
                                      )
                                    )
                                  : "Aucun"}
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
                                className="btn btn-success save-pvariation"
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

export default ListPvariations;
