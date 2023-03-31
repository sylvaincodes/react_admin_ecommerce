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
import { Name } from "./ListPattributeItemsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  getPattributeitems as onGetPattributeitems,
  addNewPattributeitem as onAddNewPattributeitem,
  updatePattributeitem as onUpdatePattributeitem,
  deletePattributeitem as onDeletePattributeitem,
  getPattributeitemsSuccess,
  addPattributeitemSuccess,
  addPattributeitemFail,
  updatePattributeitemSuccess,
  updatePattributeitemFail,
  deletePattributeitemSuccess,
  deletePattributeitemFail,
} from "../../../redux/pattributeitems/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray } from "../../../helpers/functions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { stringToArray } from "../../../helpers/functions";
import { getPattributesSuccess } from "../../../redux/pattributes/actions";


const ListPattributeitemItems = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des valeurs des attributs produits | Admin ";

  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [pattributeitem, setPattributeitem] = useState();
  const [pattributeList, setPattributeitemList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const checkboxRef = useRef("");

  const handleChangeCheckbox = (e) => {
    e.target.setAttribute("className","false");
  };

  const error = useSelector( state => state.pattributeitems.error);
  
  const { pattributeitems,pattributes } = useSelector((state) => ({
    pattributeitems: state.pattributeitems.pattributeitems,
    pattributes: state.pattributes.pattributes,
  }));

  const imageHandle = (e) => {
    
    const file = e.target;
    setImage(file.files[0]);
    if (file.files[0] == null) {
      return;
    } else { 

        const imageRef = ref(storage, `media/pattributeitems/${file.files[0].name + v4()}`);
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
      product_attribute_id: (pattributeitem && pattributeitem.product_attribute_id) || "",
      name: (pattributeitem && pattributeitem.name) || "",
      value: (pattributeitem && pattributeitem.value) || "",
      url: (pattributeitem && pattributeitem.url) || "",
      is_default: (pattributeitem && pattributeitem.is_default) || "",
      slug: (pattributeitem && pattributeitem.slug) || "",
      order: (pattributeitem && pattributeitem.order) || "",
      status: (pattributeitem && pattributeitem.status) || "",
    },
    validationSchema: Yup.object({
      product_attribute_id: Yup.string().required("Selectionner"),
      value: Yup.string().required("Entre la valeur"),
      name: Yup.string().required("Entrer le libelle"),
      status: Yup.string().required("Selectionner le status"),
      is_default: Yup.string().required("Selectionner"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatePattributeitem = {
          id: pattributeitem.id,
          product_attribute_id: values.product_attribute_id,
          name: values.name,
          value: values.value,
          url: url.trim().length==0 ? values.url : url ,
          is_default: values.is_default,
          slug: values.slug,
          order: values.order,
          status: values.status,
        };

        //  console.log(updatePattributeitem);
        //  return false;
        
        //update pattributeitem
        dispatch(onUpdatePattributeitem(updatePattributeitem));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editPattributeitemApi(
          updatePattributeitem.product_attribute_id,
          updatePattributeitem.name,
          updatePattributeitem.value,
          updatePattributeitem.url,
          updatePattributeitem.is_default,
          updatePattributeitem.slug,
          updatePattributeitem.order,
          updatePattributeitem.status,
        );

      } else {
        const newPattributeitem = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          product_attribute_id: values["product_attribute_id"],
          name: values["name"],
          value: values["value"],
          url: url,
          is_default: values["is_default"],
          slug: values["slug"],
          order: values["order"],
          status: values["status"],
        };
        // save new pattributeitem

 
        //  console.log(newPattributeitem);
        //  return false;

        setIsloading(true);
        dispatch(onAddNewPattributeitem(newPattributeitem));
        addPattributeitemApi(
          newPattributeitem.product_attribute_id,
          newPattributeitem.name,
          newPattributeitem.value,
          newPattributeitem.url,
          newPattributeitem.is_default,
          newPattributeitem.slug,
          newPattributeitem.order,
          newPattributeitem.status,    
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addPattributeitemApi = async (
    product_attribute_id,
          name,
          value,
          url,
          is_default,
          slug,
          order,
          status, 
  ) => {
    await fetch(API_URL + "/pattributeitems", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        product_attribute_id: product_attribute_id,
          name: name,
          value: value,
          url: url,
          is_default: is_default,
          slug: slug,
          order: order,
          status: status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 201) {
          dispatch(addPattributeitemSuccess(data.product_attribute_item));
          setUrl("");
        } else {
          dispatch(addPattributeitemFail({ message: data.message , key : errorsInArray(data) }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deletePattributeitemApi = async (pattributeitem) => {
    await fetch(API_URL + "/pattributeitems/" + pattributeitem.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deletePattributeitemSuccess(pattributeitem));
    });
  };

  const editPattributeitemApi = async (
    product_attribute_id,
    name,
    value,
    url,
    is_default,
    slug,
    order,
    status, 
  ) => {

    await fetch(API_URL + "/pattributeitems/" + pattributeitem.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
       body:
      JSON.stringify({
          product_attribute_id: product_attribute_id,
          name: name,
          value: value,
          url: url,
          is_default: is_default,
          slug: slug,
          order: order,
          status: status,
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 200) {
          dispatch(updatePattributeitemSuccess(data.product_attribute_item));
          setUrl("");
        } else {
          dispatch(updatePattributeitemFail({ message: data.message , key : errorsInArray(data) }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  useEffect(() => {
    fetch(API_URL + "/pattributeitems", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setPattributeitemList(array);
        dispatch(getPattributeitemsSuccess(array));
      });
    }, [dispatch]);
    
    useEffect(() => {
      fetch(API_URL + "/pattributes", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((array) => {
          dispatch(getPattributesSuccess(array));
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
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      }, 
      
      {
        Header: "Valeur",
        accessor: "value",
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
                  handlePattributeitemClick(pattributeData);
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
    setPattributeitemList(pattributeitems);
  }, [pattributeitems]);


  const toggle = () => {
    setModal(!modal);
  };

  const handlePattributeitemClick = (arg) => {
    const pattributeitem = arg;

    setPattributeitem({
          id: pattributeitem.id,
          product_attribute_id: pattributeitem.product_attribute_id,
          name: pattributeitem.name,
          value: pattributeitem.value,
          url: pattributeitem.url,
          is_default: pattributeitem.is_default,
          slug: pattributeitem.slug,
          order: pattributeitem.order,
          status: pattributeitem.status,
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

  const onClickDelete = (pattributeitem) => {
    setPattributeitem(pattributeitem);
    setDeleteModal(true);
  };

  const handleDeletePattributeitem = () => {
    dispatch(onDeletePattributeitem(pattributeitem));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deletePattributeitemApi(pattributeitem);
  };

  const handlePattributeitemClicks = () => {
    setPattributeitem("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePattributeitem}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste valeurs des attr. des produits"
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
                    data={pattributeitems}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handlePattributeitemClicks}
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
                              <Label className="form-label">Valeur</Label>
                              <Input
                                name="value"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.value || ""}
                                invalid={
                                  validation.touched.value &&
                                  validation.errors.value
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.value &&
                              validation.errors.value ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.value}
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
                              <Label className="form-label">Est par default</Label>
                              <Input
                                name="is_default"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.is_default || ""}
                                invalid={
                                  validation.touched.is_default &&
                                  validation.errors.is_default
                                    ? true
                                    : false
                                }
                              >
                                <option value="">--Selectionner--</option>
                                <option value="1">OUI</option>
                                <option value="0">NON</option>
                              </Input>

                              {validation.touched.is_default &&
                              validation.errors.is_default ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.is_default}
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

                            <div className="mb-3">
                              <Label className="form-label">Attributs de produit</Label>
                              <Input
                                name="product_attribute_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.product_attribute_id || ""}
                                invalid={
                                  validation.touched.product_attribute_id &&
                                  validation.errors.product_attribute_id
                                    ? true
                                    : false
                                }
                              >
                                 <option value="0">--Selectionner--</option>
                                {pattributes &&
                                  pattributes.map((item) => (
                                    <option { ...item.id === values.product_attribute_id ? 'selected' : ""}  key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.product_attribute_id &&
                              validation.errors.product_attribute_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.product_attribute_id}
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
                                className="btn btn-success save-pattributeitem"
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

export default ListPattributeitemItems;
