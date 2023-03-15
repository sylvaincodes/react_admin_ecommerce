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
import { Name } from "./ListSlidesCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, token } from "../../../data";
import {
  // getSlides as onGetSlides,
  addNewSlide as onAddNewSlide,
  updateSlide as onUpdateSlide,
  deleteSlide as onDeleteSlide,
  getSlidesSuccess,
  addSlideSuccess,
  addSlideFail,
  updateSlideSuccess,
  updateSlideFail,
  deleteSlideSuccess,
  deleteSlideFail,
} from "../../../redux/slides/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";

const ListSlides = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des banners | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [slide, setSlide] = useState();
  const error = useSelector((state) => state.slides.error);

  const { slides } = useSelector((state) => ({
    slides: state.slides.slides,
  }));

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (slide && slide.name) || "",
      key: (slide && slide.key) || "",
      description: (slide && slide.description) || "",
      status: (slide && slide.status) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      key: Yup.string().required("Entrer la clé"),
      description: Yup.string().required("Entrer la description"),
      status: Yup.string().required("Selectionner le status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateSlide = {
          id: slide.id,
          name: values.name,
          key: values.key,
          description: values.description,
          status: values.status,
        };

        // console.log(updateSlide);
        // return false;

        //update slide
        dispatch(onUpdateSlide(updateSlide));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editSlideApi(
          updateSlide.name,
          updateSlide.key,
          updateSlide.description,
          updateSlide.status,

        );
      } else {
        const newSlide = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          key: values["key"],
          description: values["description"],
          status: values["status"],

        };
        // save new slide

        // console.log(newSlide);
        // return false;

        setIsloading(true);
        dispatch(onAddNewSlide(newSlide));
        addSlideApi(
          newSlide.name,
          newSlide.key,
          newSlide.description,
          newSlide.status,

        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addSlideApi = async (
    name,
    key,
    description,
    status
  ) => {
    await fetch(API_URL + "/slides", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        key: key,
        status: status,

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 201) {
          dispatch(addSlideSuccess(data.slide));
        } else {
          dispatch(addSlideFail({ message: data.message , key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deleteSlideApi = async (slide) => {
    await fetch(API_URL + "/slides/" + slide.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteSlideSuccess(slide));
      dispatch(deleteSlideFail({ message: data.message }));
    });
  };

  const editSlideApi = async (
    name,
    key,
    description,
    status

  ) => {
    await fetch(API_URL + "/slides/" + slide.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
       body:
      JSON.stringify({
        name: name,
        description: description,
        key: key,
        status: status
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        console.log(data);
        if (data.status === 200) {
          dispatch(updateSlideSuccess(data.slide));
        } else {
          dispatch(updateSlideFail({ message: data.message ,key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const [categoryList, setSlideList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/slides", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setSlideList(array);
        dispatch(getSlidesSuccess(array));
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
        Header: "Clé",
        accessor: "key",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      {
        Header: "Status",
        accessor: "status",
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
                  handleSlideClick(categoryData);
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
    if (slides && !slides.length) {
      dispatch(getSlidesSuccess(slides));
      setIsEdit(false);
    }
  }, [dispatch, slides]);

  useEffect(() => {
    setSlideList(slides);
    setIsEdit(false);
  }, [slides]);

  useEffect(() => {
    if (!isEmpty(slides) && !!isEdit) {
      setSlideList(slides);
      setIsEdit(false);
    }
  }, [slides]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSlideClick = (arg) => {
    const slide = arg;

    setSlide({
      id: slide.id,
      name: slide.name,
      description: slide.description,
      key: slide.key,
      status: slide.status
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

  const onClickDelete = (slide) => {
    setSlide(slide);
    setDeleteModal(true);
  };

  const handleDeleteSlide = () => {
    dispatch(onDeleteSlide(slide));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteSlideApi(slide);
  };

  const handleSlideClicks = () => {
    setSlide("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSlide}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Paramètres"
            breadcrumbItem="Liste des slides"
          />

          {error.message ? <Alert color="danger">{error.message} :
                <ul>
                {error.key.map((item) =>{
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
                    data={slides}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleSlideClicks}
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
                              <Label className="form-label">Clé</Label>
                              <Input
                                name="key"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.key || ""}
                                invalid={
                                  validation.touched.key &&
                                  validation.errors.key
                                    ? true
                                    : false
                                }
                              >
                                
                              </Input>

                              {validation.touched.key &&
                              validation.errors.key ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.key}
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

                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-slide"
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

export default ListSlides;
