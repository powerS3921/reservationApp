import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const initialValues = {
    username: "",
    password: "",
    email: "",
  };

  const navigateTo = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/auth", data)
      .then((response) => {
        navigateTo("/login");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            alert(error.response.data.error);
          } else {
            console.error("Server Error:", error.response.status);
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };
  return (
    <div className="registrationContainer">
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className="formContainer">
          <label htmlFor="email">E-mail:</label>
          <ErrorMessage name="email" component="span" />
          <Field autoComplete="off" id="inputEmail" name="email" placeholder="(Ex. John123@wp.pl)" />
          <label htmlFor="username">Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field autoComplete="off" id="inputUsername" name="username" placeholder="(Ex. John123..)" />
          <label htmlFor="password">Paswword:</label>
          <ErrorMessage name="password" component="span" />
          <Field type="password" autoComplete="off" id="inputPassword" name="password" placeholder="(Password..)" />
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
