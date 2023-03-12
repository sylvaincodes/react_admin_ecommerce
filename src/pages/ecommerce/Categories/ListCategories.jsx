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
import { Name } from "./ListCategoriesCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  addNewCategory as onAddNewCategory,
  updateCategory as onUpdateCategory,
  deleteCategory as onDeleteCategory,
  getCategoriesSuccess,
  addCategorySuccess,
  addCategoryFail,
  updateCategorySuccess,
  updateCategoryFail,
  deleteCategorySuccess,
  deleteCategoryFail,
} from "../../../redux/categories/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";

const ListCategories = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des catégories | Admin ";

  const [isloading, setIsloading] = useState(false);
  const [image, setImage] = useState({});
  const dispatch = useDispatch();
  const [category, setCategory] = useState();
  const error = useSelector((state) => state.categories.error);

  const { categories } = useSelector((state) => ({
    categories: state.categories.categories,
  }));

  const imageHandle = (e) =>  {
    const file = e.target
    console.log(file.files[0]);
    setImage(file.files[0]);
  }

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (category && category.name) || "",
      parent_id: (category && category.parent_id) || "",
      description: (category && category.description) || "",
      status: (category && category.status) || "",
      icon: (category && category.icon) || "",
      order: (category && category.order) || "",
      is_featured: (category && category.is_featured) || "",
      is_default: (category && category.is_default) || "",
      image: (category && category.image) || {},
      image_url: (category && category.image_url) || ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      description: Yup.string().required("Entrer la description"),
      status: Yup.string().required("Selectionner le status"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCategory = {
          id: category.id,
          name: values.name,
          parent_id: values.parent_id,
          description: values.description,
          status: values.status,
          icon: values.icon,
          order: values.order,
          is_featured: values.is_featured,
          is_default: values.is_default,
          // image: values.image,
          image: image,
          image_url: values.image_url,
        };

        //update category
        dispatch(onUpdateCategory(updateCategory));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editCategoryApi(
          updateCategory.name,
          updateCategory.parent_id,
          updateCategory.description,
          updateCategory.status,
          updateCategory.icon,
          updateCategory.order,
          updateCategory.is_featured,
          updateCategory.is_default,
          updateCategory.image,
          updateCategory.image_url
        );
      } else {
        const newCategory = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          parent_id: values["parent_id"],
          description: values["description"],
          status: values["status"],
          icon: values["icon"],
          order: values["order"],
          is_featured: values["is_featured"],
          is_default: values["is_default"],
          // image: values["image"],
          image: image,
          image_url: values["image_url"],
        };
        // save new category

        // console.log(newCategory);
        // return false;

        setIsloading(true);
        dispatch(onAddNewCategory(newCategory));
        addCategoryApi(
          newCategory.name,
          newCategory.parent_id,
          newCategory.description,
          newCategory.status,
          newCategory.icon,
          newCategory.order,
          newCategory.is_featured,
          newCategory.is_default,
          newCategory.image,
          newCategory.image_url,
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addCategoryApi = async (
    name,
    parent_id,
    description,
    status,
    icon,
    order,
    is_featured,
    is_default,
    image,
    image_url
  ) => {
    await fetch(API_URL + "/categories", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        parent_id: parent_id,
        status: status,
        icon: icon,
        order: order,
        is_featured: is_featured,
        is_default: is_default,
        image: image,
        image_url: image_url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status === "201") {
          dispatch(addCategorySuccess(data.category));
        } else {
          dispatch(addCategoryFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deleteCategoryApi = async (category) => {
    await fetch(API_URL + "/categories/" + category.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteCategorySuccess(category));
      dispatch(deleteCategoryFail({ message: data.message }));
    });
  };

  const editCategoryApi = async (
    name,
    parent_id,
    description,
    status,
    icon,
    order,
    is_featured,
    is_default,
    image,
    image_url
  ) => {

    // const formData = new FormData();
    // formData.append("_method","PUT");
    // formData.append("name",name);
    // formData.append("description",description);
    // formData.append("image",image);

    await fetch(API_URL + "/categories/" + category.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
        // "Content-type": "multipart/form-data",
      },
       body:
          // formData
      JSON.stringify({
        name: name,
        description: description,
        parent_id: parent_id,
        status: status,
        icon: icon,
        order: order,
        is_featured: is_featured,
        is_default: is_default,
        image: image,
        image_url: image_url,
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        console.log(data);
        if (data.status === "200") {
          dispatch(updateCategorySuccess(data.category));
        } else {
          dispatch(updateCategoryFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
        console.log(e);
      });
  };

  const [categoryList, setCategoryList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setCategoryList(array);
        dispatch(getCategoriesSuccess(array));
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
                  src={ cellProps.image_url ? cellProps.image_url :  BASE_URL+'media/categories/'+cellProps.image}
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
                  const categoryData = cellProps.row.original;
                  handleCategoryClick(categoryData);
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
    if (categories && !categories.length) {
      dispatch(getCategoriesSuccess(categories));
      setIsEdit(false);
    }
  }, [dispatch, categories]);

  useEffect(() => {
    setCategoryList(categories);
    setIsEdit(false);
  }, [categories]);

  useEffect(() => {
    if (!isEmpty(categories) && !!isEdit) {
      setCategoryList(categories);
      setIsEdit(false);
    }
  }, [categories,isEdit]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleCategoryClick = (arg) => {
    const category = arg;

    setCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      parent_id: category.parent_id,
      status: category.status,
      icon: category.icon,
      order: category.order,
      is_featured: category.is_featured,
      is_default: category.is_default,
      image: category.image,
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

  const onClickDelete = (category) => {
    setCategory(category);
    setDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    dispatch(onDeleteCategory(category));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteCategoryApi(category);
  };

  const handleCategoryClicks = () => {
    setCategory("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCategory}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste des catégories"
          />

          {error.message ? <Alert color="danger">{error.message}</Alert> : null}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={categories}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleCategoryClicks}
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
                                {categoryList &&
                                  categoryList.map((cat) => (
                                    <option { ...cat.id === values.parent_id ? 'selected' : ""}  key={cat.id} value={cat.id}>
                                      {cat.name}
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
                            
                            <div className="mb-3  d-flex gap-2">
                              <Label className="form-label">Default</Label>
                              <Input
                                name="is_default"
                                type="checkbox"
                                checked={ validation.values.is_default === 1 ? true : false }
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

                              </Input>

                              {validation.touched.is_default &&
                              validation.errors.is_default ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.is_default}
                                </FormFeedback>
                              ) : null}
                            </div>
                            
                            <div className="mb-3 d-flex gap-2">
                              <Label className="form-label">Featured</Label>
                              <Input
                                name="is_featured"
                                type="checkbox"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                checked={ validation.values.is_featured === 1 ? true : false }
                                value={validation.values.is_featured || ""}
                                invalid={
                                  validation.touched.is_featured &&
                                  validation.errors.is_featured
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.is_featured &&
                              validation.errors.is_featured ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.is_featured}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Icon</Label>
                              <Input
                                name="icon"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.icon || ""}
                                invalid={
                                  validation.touched.icon &&
                                  validation.errors.icon
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.icon &&
                              validation.errors.icon ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.icon}
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
                                name="image_url"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.image_url || ""}
                                invalid={
                                  validation.touched.image_url &&
                                  validation.errors.image_url
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.image_url &&
                              validation.errors.image_url ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.image_url}
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
                                className="btn btn-success save-category"
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

export default ListCategories;
