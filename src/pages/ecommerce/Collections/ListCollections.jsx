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
import { Name } from "./ListCollectionsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  getCollections as onGetCollections,
  addNewCollection as onAddNewCollection,
  updateCollection as onUpdateCollection,
  deleteCollection as onDeleteCollection,
  getCollectionsSuccess,
  addCollectionSuccess,
  addCollectionFail,
  updateCollectionSuccess,
  updateCollectionFail,
  deleteCollectionSuccess,
  deleteCollectionFail,
} from "../../../redux/collections/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray } from "../../../helpers/functions";
import { storage } from "../../../helpers/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { stringToArray } from "../../../helpers/functions";

const ListCollections = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des collections | Admin ";

  const [isloading, setIsloading] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  
  const dispatch = useDispatch();
  const [collection, setCollection] = useState();
  const [collectionList, setCollectionList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [slug, setSlug] = useState("");
  
  const error = useSelector( state => state.collections.error);

  const { collections } = useSelector((state) => ({
    collections: state.collections.collections,
  }));

  const imageHandle = (e) => {
    
    const file = e.target;
    setImage(file.files[0]);
    if (file.files[0] == null) {
      return;
    } else { 

        const imageRef = ref(storage, `media/collections/${file.files[0].name + v4()}`);
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
      name: (collection && collection.name) || "",
      description: (collection && collection.description) || "",
      status: (collection && collection.status) || "",
      slug: (collection && collection.slug) || "",
      is_featured: (collection && collection.is_featured) || "",
      image: (collection && collection.image) || {},
      order: (collection && collection.order) || "0",
      url: (collection && collection.url) || "",
      parent_id: (collection && collection.parent_id) || "",
      link: (collection && collection.link) || ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      description: Yup.string().required("Entrer la description"),
      status: Yup.string().required("Selectionner le status"),
      is_featured: Yup.string().required("Selectionner"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCollection = {
          id: collection.id,
          name: values.name,
          description: values.description,
          status: values.status,
          slug: values.slug,
          is_featured: values.is_featured ,
          image: image,
          order: values.order,
          url: url.trim().length==0 ? values.url : url ,
          parent_id: values.parent_id,
          link: values.link,
        };

        //  console.log(updateCollection);
        //  return false;
        
        //update collection
        dispatch(onUpdateCollection(updateCollection));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editCollectionApi(
          updateCollection.name,
          updateCollection.description,
          updateCollection.status,
          updateCollection.slug,
          updateCollection.is_featured,
          updateCollection.image,
          updateCollection.order,
          updateCollection.url,
          updateCollection.parent_id,
          updateCollection.link
        );

      } else {
        const newCollection = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          description: values["description"],
          status: values["status"],
          slug: values["slug"],
          is_featured: values.is_featured,
          image:  image,
          order: values["order"],
          url: url,
          parent_id: values['parent_id'],
          link: values['link']
        };
        // save new collection

 
        setIsloading(true);
        dispatch(onAddNewCollection(newCollection));
        addCollectionApi(
          newCollection.name,
          newCollection.description,
          newCollection.status,
          newCollection.slug,
          newCollection.is_featured,
          newCollection.image,
          newCollection.order,
          newCollection.url,
          newCollection.parent_id,
          newCollection.link,
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addCollectionApi = async (
    name,
    description,
    status,
    slug,
    is_featured,
    image,
    order,
    url,
    parent_id,
    link
  ) => {
    await fetch(API_URL + "/collections", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        status: status,
        slug: slug,
        is_featured: is_featured,
        image: image,
        order: order,
        url: url,
        parent_id: parent_id,
        link: link,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === 201) {
          dispatch(addCollectionSuccess(data.collection));
          setUrl("");
        } else {
          dispatch(addCollectionFail({ message: data.message , key : errorsInArray(data) }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deleteCollectionApi = async (collection) => {
    await fetch(API_URL + "/collections/" + collection.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteCollectionSuccess(collection));
      dispatch(deleteCollectionFail({ message: data.message }));
    });
  };

  const editCollectionApi = async (
    name,
    description,
    status,
    slug,
    is_featured,
    image,
    order,
    url,
    parent_id,
    link
  ) => {

    await fetch(API_URL + "/collections/" + collection.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
       body:
      JSON.stringify({
        name: name,
        description: description,
        status: status,
        slug: slug,
        is_featured: is_featured,
        image: image,
        order: order,
        url: url,
        parent_id: parent_id,
        link: link,
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        console.log(data);
        if (data.status === 200) {
          dispatch(updateCollectionSuccess(data.collection));
        } else {
          dispatch(updateCollectionFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  useEffect(() => {
    fetch(API_URL + "/collections", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setCollectionList(array.data);
        dispatch(getCollectionsSuccess(array.data));
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
        accessor: "image",
        disableFilters: true,
        filterable: false,

        accessor: (cellProps) => (
          <>
            {!cellProps.image ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cellProps.name.charAt(0)}
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={ cellProps.url ? cellProps.url :  BASE_URL+'media/collections/'+cellProps.image}
                  alt=""
                />
              </div>
            )}
          </>
        ),
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
                  const collectionData = cellProps.row.original;
                  handleCollectionClick(collectionData);
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
                  const collectionData = cellProps.row.original;
                  onClickDelete(collectionData);
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
    setCollectionList(collections);
  }, [collections]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleCollectionClick = (arg) => {
    const collection = arg;

    setCollection({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      status: collection.status,
      slug: collection.slug,
      is_featured: collection.is_featured,
      image: collection.image,
      order: collection.order,
      parent_id: collection.parent_id,
      link: collection.link,
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

  const onClickDelete = (collection) => {
    setCollection(collection);
    setDeleteModal(true);
  };

  const handleDeleteCollection = () => {
    dispatch(onDeleteCollection(collection));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteCollectionApi(collection);
  };

  const handleCollectionClicks = () => {
    setCollection("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCollection}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste des collections"
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
                    data={collections}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleCollectionClicks}
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
                                onChange={ validation.handleChange}
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
                              <Label className="form-label">Parent</Label>
                              <Input
                                name="parent_id"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.parent_id || ""}
                                invalid={
                                  validation.touched.parent_id &&
                                  validation.errors.parent_id
                                    ? true
                                    : false
                                }
                              >
                                <option value="0">--Selectionner--</option>
                                {collections &&
                                  collections.map((col) => (
                                    <option { ...col.id == values.parent_id ? 'selected' : ""}  key={col.id} value={col.id}>
                                      {col.name}
                                    </option>
                                  ))}
                              </Input>

                              {validation.touched.parent_id &&
                              validation.errors.parent_id ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.parent_id}
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
                              <Label className="form-label">Featured</Label>
                              <Input
                                name="is_featured"
                                type="select"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.is_featured || ""}
                                invalid={
                                  validation.touched.is_featured &&
                                  validation.errors.is_featured
                                    ? true
                                    : false
                                }
                              >
                                <option value="">--Selectionner--</option>
                                <option value="1">OUI</option>
                                <option value="0">NON</option>
                              </Input>

                              {validation.touched.is_featured &&
                              validation.errors.is_featured ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.is_featured}
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
                                
                                value={validation.values.slug ? validation.values.slug : slug}
                                invalid={
                                  validation.touched.slug &&
                                  validation.errors.slug
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.slug &&
                              validation.errors.slug ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.slug}
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
                                value={validation.values.link }
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
                                value={validation.values.url }
                                invalid={
                                  validation.touched.url &&
                                  validation.errors.url
                                    ? true
                                    : false
                                }
                              />

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
                                className="btn btn-success save-collection"
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

export default ListCollections;
