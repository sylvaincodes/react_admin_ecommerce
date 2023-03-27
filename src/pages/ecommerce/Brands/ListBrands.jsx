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
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Name } from "./ListBrandsCol";
import Breadcrumbs from "../../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../../components/modals/DeleteModal";
import { API_URL, BASE_URL, token } from "../../../data";
import {
  getBrands as onGetBrands,
  addNewBrand as onAddNewBrand,
  updateBrand as onUpdateBrand,
  deleteBrand as onDeleteBrand,
  getBrandsSuccess,
  addBrandSuccess,
  addBrandFail,
  updateBrandSuccess,
  updateBrandFail,
  deleteBrandSuccess,
  deleteBrandFail,
} from "../../../redux/brands/actions";

import { isEmpty, values } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import { errorsInArray } from "../../../helpers/functions";

const ListBrands = (props) => {
  //meta title
  // no-dupe-keys
  document.title = "Liste des catégories | Admin ";

  const [isloading, setIsloading] = useState(false);
  const [logo, setImage] = useState({});
  const dispatch = useDispatch();
  const [brand, setBrand] = useState();
  const [brandList, setBrandList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const checkboxRef = useRef("");


  const handleChangeCheckbox = (e) => {
    // setCheckbox(checkboxRef.current.checked);
    console.log(e.target.value);
    //e.target.checked=false;
    e.target.setAttribute("className","false");
  };

  const error = useSelector( state => state.brands.error);

  const { brands } = useSelector((state) => ({
    brands: state.brands.brands,
  }));

  const imageHandle = (e) =>  {
    const file = e.target
    setImage(file.files[0]);
  }

  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (brand && brand.name) || "",
      description: (brand && brand.description) || "",
      status: (brand && brand.status) || "",
      website: (brand && brand.website) || "",
      is_featured: (brand && brand.is_featured) || "",
      logo: (brand && brand.logo) || {},
      order: (brand && brand.order) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Entrer le libelle"),
      description: Yup.string().required("Entrer la description"),
      status: Yup.string().required("Selectionner le status"),
      is_featured: Yup.string().required("Selectionner"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateBrand = {
          id: brand.id,
          name: values.name,
          description: values.description,
          status: values.status,
          website: values.website,
          is_featured: values.is_featured ,
          logo: logo,
          order: values.order,
        };

        //  console.log(updateBrand);
        //  return false;
        
        //update brand
        dispatch(onUpdateBrand(updateBrand));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editBrandApi(
          updateBrand.name,
          updateBrand.description,
          updateBrand.status,
          updateBrand.website,
          updateBrand.is_featured,
          updateBrand.logo,
          updateBrand.order,
        );

      } else {
        const newBrand = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          description: values["description"],
          status: values["status"],
          website: values["website"],
          is_featured: values.is_featured,
          logo:  logo,
          order: values["order"],
        };
        // save new brand

 
        setIsloading(true);
        dispatch(onAddNewBrand(newBrand));
        addBrandApi(
          newBrand.name,
          newBrand.description,
          newBrand.status,
          newBrand.website,
          newBrand.is_featured,
          newBrand.logo,
          newBrand.order,
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addBrandApi = async (
    name,
    description,
    status,
    website,
    is_featured,
    logo,
    order,
  ) => {
    await fetch(API_URL + "/brands", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
        status: status,
        website: website,
        is_featured: is_featured,
        logo: logo,
        order: order,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
       
        if (data.status === 201) {
          dispatch(addBrandSuccess(data.brand));
        } else {
          dispatch(addBrandFail({ message: data.message , key : errorsInArray(data) }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deleteBrandApi = async (brand) => {
    await fetch(API_URL + "/brands/" + brand.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteBrandSuccess(brand));
    });
  };

  const editBrandApi = async (
    name,
    description,
    status,
    website,
    is_featured,
    logo,
    order,
  ) => {

    await fetch(API_URL + "/brands/" + brand.id, {
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
        website: website,
        is_featured: is_featured,
        logo: logo,
        order: order,
      }),
      
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        console.log(data);
        if (data.status === 200) {
          dispatch(updateBrandSuccess(data.brand));
        } else {
          dispatch(updateBrandFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  useEffect(() => {
    fetch(API_URL + "/brands", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        setBrandList(array);
        console.log(array);
        dispatch(getBrandsSuccess(array));
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
        accessor: "logo",
        disableFilters: true,
        filterable: false,

        accessor: (cellProps) => (
          <>
            {!cellProps.logo ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cellProps.name.charAt(0)}
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={ cellProps.url ? cellProps.url :  BASE_URL+'media/brands/'+cellProps.logo}
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
                  const brandData = cellProps.row.original;
                  handleBrandClick(brandData);
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
                  const brandData = cellProps.row.original;
                  onClickDelete(brandData);
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
    if (brands) {
      dispatch(getBrandsSuccess(brands));
      setIsEdit(false);
    }
  }, [dispatch, brands]);

  useEffect(() => {
    setBrandList(brands);
    setIsEdit(false);
  }, [brands]);

  useEffect(() => {
    if (!isEmpty(brands) && !!isEdit) {
      setBrandList(brands);
      setIsEdit(false);
    }
  }, [brands]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleBrandClick = (arg) => {
    const brand = arg;

    setBrand({
      id: brand.id,
      name: brand.name,
      description: brand.description,
      status: brand.status,
      website: brand.website,
      is_featured: brand.is_featured,
      logo: brand.logo,
      order: brand.order,
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

  const onClickDelete = (brand) => {
    setBrand(brand);
    setDeleteModal(true);
  };

  const handleDeleteBrand = () => {
    dispatch(onDeleteBrand(brand));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteBrandApi(brand);
  };

  const handleBrandClicks = () => {
    setBrand("");
    setIsEdit(false);
    toggle();
  };

  // const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBrand}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste des marques"
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
                    data={brands}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleBrandClicks}
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
                              <Label className="form-label">Website</Label>
                              <Input
                                name="website"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                
                                value={validation.values.website || ""}
                                invalid={
                                  validation.touched.website &&
                                  validation.errors.website
                                    ? true
                                    : false
                                }
                              ></Input>

                              {validation.touched.website &&
                              validation.errors.website ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.website}
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
                              <Label className="form-label">Logo</Label>
                              <Input id="logo"
                                name="logo"
                                type="file"
                                onChange={ imageHandle}
                                onBlur={validation.handleBlur}
                                // value={validation.values.logo || ""}
                                invalid={
                                  validation.touched.logo &&
                                  validation.errors.logo
                                    ? true
                                    : false
                                }
                              />
                             
                            </div> 

                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-brand"
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

export default ListBrands;
