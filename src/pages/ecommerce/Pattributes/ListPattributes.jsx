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
  Fade,
  FormText,
  FormGroup 
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListPattributesCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  getPattributes as onGetPattributes,
  addNewPattribute as onAddNewPattribute,
  updatePattribute as onUpdatePattribute,
  deletePattribute as onDeletePattribute,
  getPattributesSuccess,
  addPattributeSuccess,
  addPattributeFail,
  updatePattributeSuccess,
  updatePattributeFail,
  deletePattributeSuccess,
  deletePattributeFail,
} from "../../../redux/pattributes/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray } from "../../../helpers/functions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { stringToArray } from "../../../helpers/functions";


const ListPattributes = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des attributs produits | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [pattribute, setPattribute] = useState();
  const [pattributeList, setPattributeList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const checkboxRef = useRef("");

  const handleChangeCheckbox = (e) => {
    // setCheckbox(checkboxRef.current.checked);
    console.log(e.target.value);
    //e.target.checked=false;
    e.target.setAttribute("className","false");
  };

  const error = useSelector( state => state.pattributes.error);
  
  const { pattributes } = useSelector((state) => ({
    pattributes: state.pattributes.pattributes,
  }));

  const imageHandle = (e) => {
    
    const file = e.target;
    setImage(file.files[0]);
    if (file.files[0] == null) {
      return;
    } else { 

        const imageRef = ref(storage, `media/pattributes/${file.files[0].name + v4()}`);
        uploadBytes(imageRef, file.files[0]).then((data) => {
          getDownloadURL(data.ref).then((url) => {
            setIsloading(true);
            setUrl(url);
            setIsloading(false);  
          });
        }); 
    }
  };

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (pattribute && pattribute.name) || "",
      slug: (pattribute && pattribute.slug) || "",
      status: (pattribute && pattribute.status) || "",
      order: (pattribute && pattribute.order) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      status: Yup.string().required("Selectionner le status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatePattribute = {
          id: pattribute.id,
          name: values.name,
          slug: values.slug,
          status: values.status,
          order: values.order
        };

        //  console.log(updatePattribute);
        //  return false;
        
        //update pattribute
        dispatch(onUpdatePattribute(updatePattribute));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editPattributeApi(
          updatePattribute.name,
          updatePattribute.slug,
          updatePattribute.status,
          updatePattribute.order,
        );

      } else {
        const newPattribute = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          slug: values["slug"],
          status: values["status"],
          order: values["order"],
        };
        // save new pattribute

 
        //  console.log(newPattribute);
        //  return false;

        setIsloading(true);
        dispatch(onAddNewPattribute(newPattribute));
        addPattributeApi(
          newPattribute.name,
          newPattribute.slug,
          newPattribute.status,
          newPattribute.order,     
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addPattributeApi = async (
    name,
    slug,
    status,
    order,
  ) => {
    await fetch(API_URL + "/pattributes", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        slug: slug,
        status: status,
        order: order,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 201) {
          dispatch(addPattributeSuccess(data.product_attribute));
        } else {
          dispatch(addPattributeFail({ message: data.message , key : errorsInArray(data) }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deletePattributeApi = async (pattribute) => {
    await fetch(API_URL + "/pattributes/" + pattribute.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deletePattributeSuccess(pattribute));
    });
  };

  const editPattributeApi = async (
    name,
    slug,
    status,
    order,
  ) => {

    await fetch(API_URL + "/pattributes/" + pattribute.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
       body:
      JSON.stringify({
        name: name,
        slug: slug,
        status: status,
        order: order
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updatePattributeSuccess(data.product_attribute));
          setUrl("");
        } else {
          dispatch(updatePattributeFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  useEffect(() => {
    fetch(API_URL + "/pattributes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPattributeList(array);
        dispatch(getPattributesSuccess(array));
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
        Header: "Libellé",
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      {
        Header: "Slug",
        accessor: "slug",
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
                  const pattributeData = cellProps.row.original;
                  handlePattributeClick(pattributeData);
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
                  const pattributeData = cellProps.row.original;
                  onClickDelete(pattributeData);
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
    setPattributeList(pattributes);
  }, [pattributes]);


  const toggle = () => {
    setModal(!modal);
  };

  const handlePattributeClick = (arg) => {
    const pattribute = arg;

    setPattribute({
      id: pattribute.id,
      name: pattribute.name,
      slug: pattribute.slug,
      status: pattribute.status,
      order: pattribute.order,
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

  const onClickDelete = (pattribute) => {
    setPattribute(pattribute);
    setDeleteModal(true);
  };

  const handleDeletePattribute = () => {
    dispatch(onDeletePattribute(pattribute));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deletePattributeApi(pattribute);
  };

  const handlePattributeClicks = () => {
    setPattribute("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePattribute}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste des attributs des produits"
          />

            {error.message ? <Alert color="danger">{error.message} :
                <ul>
                {error.key.map(  (item, key) =>  

                  <li key={key}> {item['key'][0]}   </li>    )}
                 
                </ul>

            </Alert> : null}
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={pattributes}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handlePattributeClicks}
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
                              <Label className="form-label">Libelle</Label>
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
                              <Label className="form-label">Slug</Label>
                              <Input
                                name="slug"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.slug || ""}
                                invalid={
                                  validation.touched.slug &&
                                  validation.errors.slug
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.slug &&
                              validation.errors.slug ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.slug}
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
                          
                           
                            <div className="mb-3">
                              <Label className="form-label">Ordre</Label>
                              <Input
                                name="order"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.order }
                                invalid={
                                  validation.touched.order &&
                                  validation.errors.order
                                    ? true
                                    : false
                                }
                              />

                              {validation.touched.order &&
                              validation.errors.order ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.order}
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
                                className="btn btn-success save-pattribute"
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

export default ListPattributes;
