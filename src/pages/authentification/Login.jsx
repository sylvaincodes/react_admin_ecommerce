import React, { useState, useEffect } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  Label,
  Row,
  Alert,
} from "reactstrap";
import toast from "react-hot-toast";

import login_header from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
  loginFailure,
  loginSuccess,
  loginRequest,
} from "../../redux/auth/login/actions";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../data";

const Login = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user") || localStorage.getItem("user") ) {
      navigate("/dashboard");
    }
  }, [navigate]);

  document.title = "Login | Admin Ecommerce";

  const dispatch = useDispatch();

  const [isloading, setIsloading] = useState(false);
  const error = useSelector((state) => state.login.error);
  const loginAuth = async (email, password) => {
    await fetch(API_URL + "/login", {
      method: "POST",
      // mode: 'no-cors',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {        
        if (data.status === "success") {
          localStorage.setItem("user", JSON.stringify(data));
          dispatch(loginSuccess(data.user));
          navigate("/");
        } else {
          toast.error(data.message);
          dispatch(
            loginFailure({ message: data.message, key: data.errors.key })
          );
        }
        setIsloading(false);
      })
      .catch((e) => {
        dispatch(loginFailure(e));
      });
       setIsloading(false);
  };

  const loginValidation = useFormik({
    initialValues: {
      email: "sylvaino@gmail.com",
      password: "secret22",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Entrer votre email"),
      password: Yup.string().required("Entrer votre mot de passe"),
    }),
    onSubmit: (values) => {
      loginAuth(values.email, values.password);
      dispatch(loginRequest(values));
      setIsloading(true);
    },
  });

  return (
    <>
      <div className="login mt-5 pt-5">
        <LoadingSpinner isloading={isloading} />
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} md={8} sm={10} xs={10}>
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary">
                  <Row className="py-3 align-items-center">
                    <Col xs={7} className="text-white">
                      <h5 className="">Bienvenue,</h5>
                      <p>Connectez-vous pour continuer.</p>
                    </Col>
                    <Col xs={5}>
                      <img src={login_header} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="position-absolute p-2 t-7 rounded-circle bg-light">
                    <img
                      src={logo}
                      alt=""
                      height={50}
                      className="rounded-circle"
                    />
                  </div>
                  <Container className="py-5">
                    <Form onSubmit={loginValidation.handleSubmit}>
                      {error.message ? (
                        <Alert color="danger">
                          {error.message} :
                          <ul>
                            {error.key.map((item) => {
                              return <li> {item} </li>;
                            })}
                          </ul>
                        </Alert>
                      ) : null}

                      <div className="mb-4">
                        <Label>Email</Label>
                        <Input
                          className={
                            loginValidation.errors.email ? "is-invalid" : ""
                          }
                          type="email"
                          name="email"
                          id="email"
                          onChange={loginValidation.handleChange}
                          value={loginValidation.values.email}
                        />
                        <FormFeedback
                          type="invalid"
                          className={
                            loginValidation.errors.email ? "d-block" : ""
                          }
                        >
                          {loginValidation.errors.email}
                        </FormFeedback>
                      </div>

                      <div className="mb-4">
                        <Label>Mot de passe</Label>
                        <Input
                          className={
                            loginValidation.errors.password ? "is-invalid" : ""
                          }
                          type="password"
                          name="password"
                          id="password"
                          onChange={loginValidation.handleChange}
                          value={loginValidation.values.password}
                        />
                        <FormFeedback
                          type="invalid"
                          className={
                            loginValidation.errors.password ? "d-block" : ""
                          }
                        >
                          {loginValidation.errors.password}
                        </FormFeedback>
                      </div>

                      <InputGroup className="">
                        <Input type="checkbox" name="" />
                        <Label className="ms-3">Se rappeler de moi</Label>
                      </InputGroup>

                      <div className="mt-3 d-grid">
                        <Button type="submit" className="bg-primary">
                          Se connecter
                        </Button>
                      </div>
                    </Form>
                  </Container>

                  <Row className="justify-content-center">
                    <Link to="/" className="fs-6 text-muted text-center">
                      <i className="mdi mdi-lock me-1" />
                      Mot de passe oublié
                    </Link>
                  </Row>
                </CardBody>
              </Card>
              <div></div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
