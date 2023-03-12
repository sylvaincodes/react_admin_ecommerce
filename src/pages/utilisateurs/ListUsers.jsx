import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "../../components/tables/TableContainer";
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
import { Name, Email } from "./ListUsersCol";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumb";
import DeleteModal from "../../components/modals/DeleteModal";
import { API_URL } from "../../data";
import { token } from "../../data";
import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
  getUsersSuccess,
  addUserSuccess,
  addUserFail,
  updateUserSuccess,
  updateUserFail,
  deleteUserSuccess,
  deleteUserFail,
} from "../../redux/users/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const ListUsers = (props) => {

  //meta title
  document.title = "Liste des utilisateurs | Admin ";

  const [isloading, setIsloading] = useState(false)
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const error = useSelector((state) => state.users.error);

  const navigate = useNavigate();
  //validation
  const validation = useFormik({
    //enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: (user && user.username) || "",
      password: (user && user.password) || "",
      password_confirmation: (user && user.password_confirmation) || "",
      email: (user && user.email) || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Entrer le nom d'utilisateur"),
      password: Yup.string().required("Entrer le mot de passe"),
      password_confirmation: Yup.string().required("Confirmer le mot de passe"),
      email: Yup.string().required("Entrer l'email"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateUser = {
          id: user.id,
          username: values.username,
          password: values.password,
          password_confirmation: values.password_confirmation,
          email: values.email,
        };

        //update user
        dispatch(onUpdateUser(updateUser));
        validation.resetForm();
        setIsEdit(false);
        setIsloading(true);
        editUserApi(
          updateUser.username,
          updateUser.password,
          updateUser.password_confirmation,
          updateUser.email
        );
      } else {
        const newUser = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          username: values["username"],
          password: values["password"],
          password_confirmation: values["password_confirmation"],
          email: values["email"],
        };
        // save new user
        setIsloading(true);
        dispatch(onAddNewUser(newUser));
        addUserApi(
          newUser.username,
          newUser.password,
          newUser.password_confirmation,
          newUser.email
        );
        validation.resetForm();
      }
      toggle();
    },
  });

  const addUserApi = async (
    username,
    password,
    password_confirmation,
    email
  ) => {
    await fetch(API_URL+"/users", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status == "201") {
          dispatch(addUserSuccess(data.user));
        } else {
          dispatch(addUserFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
      });
  };

  const deleteUserApi = async (user) => {
    await fetch(API_URL+"/users/" + user.id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      const data = response.json();
      setIsloading(false);
      dispatch(deleteUserSuccess(user));
      dispatch(deleteUserFail({ message: data.message }));
    });
  };

  const editUserApi = async (
    username,
    password,
    password_confirmation,
    email
  ) => {
    await fetch(API_URL+"/users/" + user.id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsloading(false);
        if (data.status == "200") {
          dispatch(updateUserSuccess(data.user));
          dispatch(updateUserFail({ message: data.message }));
        } else {
          dispatch(updateUserFail({ message: data.message }));
        }
      })
      .catch((e) => {
        setIsloading(true);
        console.log(e);
      });
  };

  const [userList, setUserList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(API_URL+"/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.status==401){
          navigate('')
        }
        setUserList(data);
        dispatch(getUsersSuccess(data));
      });
  }, []);

  const { users } = useSelector((state) => ({
    users: state.users.users,
  }));

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" />;
        },
      },
      {
        Header: "Avatar",
        accessor: "avatar_id",
        disableFilters: true,
        filterable: false,
        accessor: (cellProps) => (
          <>
            {!cellProps.avatar_id ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cellProps.username.charAt(0)}
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={cellProps.avatar_id}
                  alt=""
                />
              </div>
            )}
          </>
        ),
      },
      {
        Header: "Nom d'utilisateur",
        accessor: "username",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Type d'utilisateur",
        accessor: "type",
        filterable: true,
        accessor: (cellProps) => (
          <>
            {cellProps.type >= 1 ? (
              <span className="badge badge-soft-primary font-size-11 m-1 ">Admin</span>
            ) : cellProps.super_user >= 2 ? (
              <div>
                <span className="badge badge-soft-primary font-size-11 m-1 ">Super Admin</span>
              </div>
            ) : (
              <div>
                <span className="badge badge-soft-primary font-size-11 m-1 ">
                  Client
                </span>
              </div>
            )}
          </>
        ),
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
                  const userData = cellProps.row.original;
                  handleUserClick(userData);
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
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
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
    if (users && !users.length) {
      dispatch(onGetUsers());
      setIsEdit(false);
    }
  }, [dispatch, users]);

  useEffect(() => {
    setUser(users);
    setIsEdit(false);
  }, [users]);

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setUser(users);
      setIsEdit(false);
    }
  }, [users]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = (arg) => {
    const user = arg;

    setUser({
      id: user.id,
      username: user.username,
      password: user.password,
      password_confirmation: user.password_confirmation,
      email: user.email,
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

  const onClickDelete = (user) => {
    setUser(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(user));
    onPaginationPageChange(1);
    setDeleteModal(false);
    setIsloading(true);
    deleteUserApi(user);
  };

  const handleUserClicks = () => {
    setUser("");
    setIsEdit(false);
    toggle();
  };

  const keyField = "id";

  return (
    <React.Fragment>
      <LoadingSpinner isloading={isloading} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}

          <Breadcrumbs
            title="Ecommerce"
            breadcrumbItem="Liste des utilisateurs"
          />

          {error.message ? <Alert color="danger">{error.message}</Alert> : null}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={users}
                    isGlobalFilter={true}
                    isAddList={true}
                    handleAddNewClick={handleUserClicks}
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
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row form="true">
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">
                                Nom d'utilisateur
                              </Label>
                              <Input
                                name="username"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.username || ""}
                                invalid={
                                  validation.touched.username &&
                                  validation.errors.username
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.username &&
                              validation.errors.username ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.username}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Mot de passe</Label>
                              <Input
                                name="password"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.password || ""}
                                invalid={
                                  validation.touched.password &&
                                  validation.errors.password
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.password &&
                              validation.errors.password ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">
                                Confirmer mot de passe
                              </Label>
                              <Input
                                name="password_confirmation"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.password_confirmation || ""
                                }
                                invalid={
                                  validation.touched.password_confirmation &&
                                  validation.errors.password_confirmation
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.password_confirmation &&
                              validation.errors.password_confirmation ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.password_confirmation}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Input
                                name="email"
                                label="Email"
                                type="email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
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
                                className="btn btn-success save-user"
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

export default ListUsers;
