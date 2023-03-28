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
  FormText,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListSlidesItemsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, token } from "../../../data";
import {
  // getSlidesitems as onGetSlidesitems,
  addNewSlidesitem as onaddNewSlidesitem,
  updateSlidesitem as onupdateSlidesitem,
  deleteSlidesitem as onDeleteSlidesitem,
  getSlidesitemsSuccess,
  addSlidesitemSuccess,
  addSlidesitemFail,
  updateSlidesitemSuccess,
  updateSlidesitemFail,
  deleteSlidesitemSuccess,
  deleteSlidesitemFail,
} from "../../../redux/slidesitems/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { getSlidesSuccess } from "../../../redux/slides/actions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { stringToArray } from "../../../helpers/functions";

const ListSlidesItems = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des slides | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [slidesitem, setSlidesItem] = useState();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const error = useSelector((state) => state.slidesitems.error);

  const imageHandle = (e) => {
    
    const file = e.target;
    setImage(file.files[0]);
    if (file.files[0] == null) {
      return;
    } else { 

        const imageRef = ref(storage, `media/slides/${file.files[0].name + v4()}`);
        uploadBytes(imageRef, file.files[0]).then((data) => {
          getDownloadURL(data.ref).then((url) => {
            setIsloading(true);
            setUrl(url);
            setIsloading(false);  
          });
        }); 
    }
  };
  

  useEffect(() => {
    fetch(API_URL + "/slides", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getSlidesSuccess(array));
      });
  }, []);

  
  const { slidesitems , slides } = useSelector((state) => ({
    slidesitems: state.slidesitems.slidesitems,
    slides: state.slides.slides,
  }));

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      slide_id: (slidesitem && slidesitem.slide_id) || "",
      title: (slidesitem && slidesitem.title) || "",
      subtitle: (slidesitem && slidesitem.subtitle) || "",
      description: (slidesitem && slidesitem.description) || "",
      link: (slidesitem && slidesitem.link) || "",
      order: (slidesitem && slidesitem.order) || "",
      btn: (slidesitem && slidesitem.btn) || "",
      image: (slidesitem && slidesitem.image) || "",
      url: (slidesitem && slidesitem.url) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Entrer le libelle"),
      subtitle: Yup.string().required("Entrer le sous titre"),
      slide_id: Yup.string().required("Selectionner le slidesitem parent"),
      description: Yup.string().required("Entrer la description"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateSlidesitem = {
          id: slidesitem.id,
          slide_id: values.slide_id,
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          link: values.link,
          order: values.order,         
          btn: values.btn,
          images: values.images,
          url: url.trim().length==0 ? values.url : url ,
        };

        //update slidesitem
        dispatch(onupdateSlidesitem(updateSlidesitem));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editSlidesItemApi(
          updateSlidesitem.slide_id,
          updateSlidesitem.title,
          updateSlidesitem.subtitle,
          updateSlidesitem.description,
          updateSlidesitem.link,
          updateSlidesitem.btn,
          updateSlidesitem.order,
          updateSlidesitem.image,
          updateSlidesitem.url
        );
      } else {
        const newSlidesItem = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          slide_id: values["slide_id"],
          title: values["title"],
          subtitle: values['subtitle'],  
          description: values["description"],
          link: values['link'],
          btn: values["btn"],
          order: values['order'],  
          images: values['images'],
          url: url,
        };

        //save new slidesitem

        // console.log(newSlidesItem);
        // return false;

        setIsloading(true);
        dispatch(onaddNewSlidesitem(newSlidesItem));
        addSlidesItemApi(
          newSlidesItem.slide_id,
          newSlidesItem.title,
          newSlidesItem.subtitle,
          newSlidesItem.description,
          newSlidesItem.link,
          newSlidesItem.btn,
          newSlidesItem.order,
          newSlidesItem.image,
          newSlidesItem.url,
        );
        validation.resetForm(); 
      }
      toggle();
    },
  });

  
  const addSlidesItemApi = async (
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
    await fetch(API_URL + "/slidesitems", {
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
        image: image,
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        setUrl("");
        if (data.status === 201) {
          dispatch(addSlidesitemSuccess(data.slidesitem));
        } else {
          dispatch(addSlidesitemFail({ message: data.message ,  key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
        console.log(e);
      });
  };

  const deleteSlidesitemApi = async (slidesitem) => {
    await fetch(API_URL + "/slidesitems/" + slidesitem.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteSlidesitemSuccess(slidesitem));
      dispatch(deleteSlidesitemFail({ message: data.message , key : data.errors.key  }));
    });
  };

  const editSlidesItemApi = async (
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
    await fetch(API_URL + "/slidesitems/" + slidesitem.id, {
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
        btn: btn,
        order: order,
        image: image,
        url: url,
      }),      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        setUrl("");
        if (data.status === 200) {
          dispatch(updateSlidesitemSuccess(data.slidesitem));
        } else {
          console.log(data.errors);
          dispatch(updateSlidesitemFail({ message: data.message ,key : data.errors.key }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const [slidesitemsList, setSlidesItemList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/slidesitems", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setSlidesItemList(array);
        dispatch(getSlidesitemsSuccess(array));
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
                  handleSlidesItemClick(categoryData);
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
    if (slidesitems && !slidesitems.length) {
      dispatch(getSlidesitemsSuccess(slidesitems));
      setIsEdit(false);
    }
  }, [dispatch, slidesitems]);

  useEffect(() => {
    setSlidesItemList(slidesitems);
    setIsEdit(false);
  }, [slidesitems]);

  useEffect(() => {
    if (!isEmpty(slidesitems) && !!isEdit) {
      setSlidesItemList(slidesitems);
      setIsEdit(false);
    }
  }, [slidesitems]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSlidesItemClick = (arg) => {
    const slidesitem = arg;

    setSlidesItem({
      id: slidesitem.id,
      title: slidesitem.title,
      subtitle: slidesitem.subtitle,
      description: slidesitem.description,
      slide_id: slidesitem.slide_id,
      btn: slidesitem.btn,
      link: slidesitem.link,
      order: slidesitem.order,
      image: slidesitem.image,
      url: slidesitem.url,
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

  const onClickDelete = (slidesitem) => {
    setSlidesItem(slidesitem);
    setDeleteModal(true);
  };

  const handleDeleteSlidesItem = () => {
    dispatch(onDeleteSlidesitem(slidesitem));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteSlidesitemApi(slidesitem);
  };

  const handleSlidesItemClicks = () => {
    setSlidesItem("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteSlidesItem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Paramètres"
            breadcrumbItem="Liste des slides items"
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
                    data={slidesitems}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleSlidesItemClicks}
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
                                {slides &&
                                  slides.map((item) => (
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
                              <FormText>
                                Pour ajouter ou supprimer # Retélecharger de nouveau #</FormText>
                            
                             
                            </div>

                             <div className="mb-3">
                              <Label className="form-label">Prévisionnez</Label>
                              <div className="d-flex flex-wrap w-auto gap-3">
                              {
                                  url ?
                                  <img height={200} width={200} src={url} alt="" />
                                  : ""
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
                                className="btn btn-success save-slidesitem"
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

export default ListSlidesItems;
