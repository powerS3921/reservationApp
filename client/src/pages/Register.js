import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Register.sass";

const Register = ({ showNav }) => {
  const initialValues = {
    username: "",
    password: "",
    email: "",
    privacyPolicy: false, // New field for the checkbox
  };

  const navigateTo = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, "Username must be at least 3 characters").max(15, "Username cannot exceed 15 characters").required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").max(20, "Password cannot exceed 20 characters").required("Password is required"),
    privacyPolicy: Yup.boolean().oneOf([true], "You must accept the privacy policy").required("Privacy policy acceptance is required"),
  });

  const onSubmit = async (data) => {
    try {
      // Wysyłanie danych rejestracyjnych
      const registerResponse = await axios.post("http://localhost:3001/auth", data);

      // Wysłanie e-maila potwierdzającego
      await axios.post("http://localhost:3001/auth/send-confirmation-email", {
        email: data.email,
      });

      alert("Rejestracja zakończona! Sprawdź swoją skrzynkę pocztową, aby potwierdzić konto.");
      navigateTo("/login");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "Wystąpił błąd podczas rejestracji");
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="mainWrapperRegister" style={showNav ? { marginTop: "-6vh" } : { marginTop: "0vh" }}>
      <div className="registerContainer">
        <h1 className="registerTitle">Create Account</h1>
        <p className="registerSubtitle">Join GameGalaxy and start your adventure!</p>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form className="registerForm">
            <div className="formGroup">
              <label htmlFor="email">E-mail</label>
              <Field className="defaultInput" autoComplete="off" id="inputEmail" name="email" placeholder="Ex. John123@wp.pl" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="formGroup">
              <label htmlFor="username">Username</label>
              <Field className="defaultInput" autoComplete="off" id="inputUsername" name="username" placeholder="Ex. John123.." />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <Field className="defaultInput" type="password" autoComplete="off" id="inputPassword" name="password" placeholder="Your Password..." />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="formGroup privacyPolicyGroup">
              <label>
                <Field type="checkbox" name="privacyPolicy" />
                <p className="privacyPolicy">Akceptuję politykę prywatności</p>
              </label>
              <ErrorMessage name="privacyPolicy" component="div" className="error" />
            </div>
            <button type="submit" className="button">
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
