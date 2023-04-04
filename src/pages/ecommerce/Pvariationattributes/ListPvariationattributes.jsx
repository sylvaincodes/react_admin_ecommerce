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
import { Name } from "./ListPvariationattributesCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, productsData, token } from "../../../data";
import {
  getPvariationattributes as onGetPvariationattributes,
  addNewPvariationattribute as onAddNewPvariationattribute,
  updatePvariationattribute as onUpdatePvariationattribute,
  deletePvariationattribute as onDeletePvariationattribute,
  getPvariationattributesSuccess,
  addPvariationattributeSuccess,
  addPvariationattributeFail,
  updatePvariationattributeSuccess,
  updatePvariationattributeFail,
  deletePvariationattributeSuccess,
  deletePvariationattributeFail,
} from "../../../redux/pvariationattributes/actions";

import { values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray, stringToArray } from "../../../helpers/functions";
import { getPattributesSuccess } from "../../../redux/pattributes/actions";
import { getPattributeitemsSuccess } from "../../../redux/pattributeitems/actions";



const ListPvariationattributes = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des produits | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [pvariationattribute, setPvariationattribute] = useState();
  const [pattributeList, setPattributeList] = useState([]);
  const [pattributeItemList, setPattributeItemList] = useState([]);
  const [pattributId, setPattributId] = useState(1);

  const error = useSelector((state) => state.pvariationattributes.error);

  const { pvariationattributes, pvariations } = useSelector((state) => ({
    pvariationattributes: state.pvariationattributes.pvariationattributes,
    pvariations: state.pvariations,
  }));
  
  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      
      product_variation_id: pvariations.pvariation.id,
      product_attribute_item_id: (pvariationattribute && pvariationattribute.product_attribute_item_id) || "",
 
    },
    validationSchema: Yup.object({
      product_attribute_item_id: Yup.string().required("Entrer le libelle"),
     
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatePvariationattribute = {
          id: pvariationattribute.id,
          
          product_variation_id: pvariations.pvariation.id,
          product_attribute_item_id: values.product_attribute_item_id,
  
        };

        //update pvariationattribute
          // console.log(updatePvariationattribute);
          // return false;

        dispatch(onUpdatePvariationattribute(updatePvariationattribute));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editPvariationattributeApi(
          
          updatePvariationattribute.product_attribute_item_id,
      
        );
      } else {
        const newPvariationattribute = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          
          product_variation_id: pvariations.pvariation.id,
          product_attribute_item_id: values["product_attribute_item_id"],
      
        };

        // save new pvariationattribute
        // console.log(newPvariationattribute);
        // return false;

        setIsloading(true);
        dispatch(onAddNewPvariationattribute(newPvariationattribute));
        addPvariationattributeApi(
          
          newPvariationattribute.product_variation_id,
          newPvariationattribute.product_attribute_item_id,
      
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addPvariationattributeApi = async (
    
    product_variation_id,
    product_attribute_item_id,

  ) => {
    await fetch(API_URL + "/pvariationattributes?id="+ pvariations.pvariation.id, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        
        product_variation_id: product_variation_id,
        product_attribute_item_id: product_attribute_item_id,
      
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status == 201) {
          dispatch(addPvariationattributeSuccess(data.pvariationattribute));
          
        } else {
          dispatch(
            addPvariationattributeFail({ message: data.message, key: errorsInArray(data) })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deletePvariationattributeApi = async (pvariationattribute) => {
    console.log(pvariationattributes);
    console.log(pvariationattribute);
    await fetch(API_URL + "/pvariationattributes/" + pvariationattribute.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deletePvariationattributeSuccess(pvariationattribute));
      
    });
  };

  const editPvariationattributeApi = async (
    
    product_variation_id,
    product_attribute_item_id,

    url
  ) => {
    await fetch(API_URL + "/pvariationattributes/" + pvariationattribute.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
       
        product_variation_id: product_variation_id,
        product_attribute_item_id: product_attribute_item_id,
      
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updatePvariationattributeSuccess(data.pvariationattribute));
          
        } else {
          dispatch(
            updatePvariationattributeFail({ message: data.message, key: data.errors.key })
          );
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const [productList, setPvariationattributeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setIsloading(true);
    fetch(API_URL + "/pvariationattributes?id="+ pvariations.pvariation.id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPvariationattributeList(array.data);
        dispatch(getPvariationattributesSuccess(array));
        setIsloading(false);
      });
  }, []);
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
        Header: "Attribut ",
        accessor: "attribut",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      {
        Header: "Valeur",
        accessor: "valeur",
        disableFilters: true,
        filterable: false,
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
              
              
             
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    setPvariationattributeList(pvariationattributes);
  }, [pvariationattributes]);

  const toggle = () => {
    setModal(!modal);
  };

  const handlePvariationattributeClick = (arg) => {
    const pvariationattribute = arg;

    setPvariationattribute({
      id: pvariationattribute.id,
      product_attribute_item_id: pvariationattribute.product_attribute_item_id,
     
    });

    setIsEdit(true);

    toggle();
  };  
  
  const changeProductId = (e) => {
    setPattributId(e.target.value);
  }


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

  const onClickDelete = (pvariationattribute) => {
    setPvariationattribute(pvariationattribute);
    setDeleteModal(true);
  };

  const handleDeletePvariationattribute = () => {
    dispatch(onDeletePvariationattribute(pvariationattribute));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deletePvariationattributeApi(pvariationattribute);
  };

  const handlePvariationattributeClicks = () => {
    setPvariationattribute("");
    setIsEdit(false);
    toggle();
  };

  //const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePvariationattribute}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Les variations" back="/ecommerce/pvariations"
            breadcrumbItem={`Liste des attributs`}
          />

          {error && error.message ? (
            <Alert color="danger">
              {error.message} :
              <ul>
                {error.key.map(  (item, key) =>  

                  <li key={key}> {item['key'][0]}   </li>    )}
                 
                </ul>
            </Alert>
          ) : null}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>

                <h5>
                      <strong>Variations : </strong>
                      N°{`${pvariations.pvariation.id}`}
                    </h5>

                  <TableContainer
                    columns={columns}
                    data={productList}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handlePvariationattributeClicks}
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
                                  <Label className="form-label text-capitalize">
                                    Attribut
                                  </Label>
                                  <Input
                                    name="product_attribute_id"
                                    type="select"
                                    onChange={(e) => changeProductId(e) }
                                    value={pattributId}
                                    
                                  >
                                    <option value="">--Selectionner--</option>
                                    {pattributeList &&
                                      pattributeList.map((item,key) => (
                                                                           
                                      <option key={key} value={item.id}>{item.name}</option>
                                      
                                      ))}
                                  </Input>

                                  
                                </div>
{/* 
                            <div className="mb-3">
                              <Label className="form-label">Attribut id</Label>
                              <Input
                                name="product_attribute_item_id"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.product_attribute_item_id || ""}
                                invalid={
                                  validation.touched.product_attribute_item_id &&
                                  validation.errors.product_attribute_item_id
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.product_attribute_item_id &&
                              validation.errors.product_attribute_item_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.product_attribute_item_id}
                                </FormFeedback>
                              ) : null}
                            </div> */}

                            <div className="mb-3">
                                  <Label className="form-label text-capitalize">
                                    Valeur
                                  </Label>
                                  <Input
                                    name="product_attribute_item_id"
                                    type="select"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.product_attribute_item_id || ""}
                                    invalid={
                                      validation.touched.product_attribute_item_id &&
                                      validation.errors.product_attribute_item_id
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="">--Selectionner--</option>
                                    {pattributeItemList &&
                                      pattributeItemList.map((item,key) => (
                                        
                                        pattributId == item.product_attribute_id ?
                                        <option key={key} value={item.id}>{item.slug}</option>
                                        :
                                        ""
                                      
                                      ))}
                                  </Input>

                                  {validation.touched.product_attribute_item_id &&
                                  validation.errors.product_attribute_item_id ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.product_attribute_item_id}
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
                                className="btn btn-success save-pvariationattribute"
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

export default ListPvariationattributes;
