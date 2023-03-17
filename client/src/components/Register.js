import React, { useState } from "react";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { registerValidation } from "../helper/validate.js";
import  convertToBase64 from "../helper/convert.js";
import { useNavigate } from "react-router-dom";
import { register } from "../helper/helper.js";
const Register = () => {
  const Navigate = useNavigate();
  function userlogin() {
    Navigate("/");
  }
  const [file, setFile] = useState();
  const avatar = '/assets/user.png';
  const formik = useFormik(
  {
    initialValues: {
      username: '',
      password: '',
      email: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values=>
    {
      values =  Object.assign(values, { profile: file || "" });
      let register_promise = register(values);
      toast.promise(register_promise, {
        loading: "Creating...",
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register...!</b>
      })
      register_promise.then(()=>
      {
        Navigate("/");
      })
    }
  })
   const onUpload = async (e) => {
     const base64 = await convertToBase64(e.target.files[0]);
     setFile(base64);
   };
  return (
    <div className="main__container">
      <Toaster reverseOrder="false" position="top-center" />
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">Welcome Back.</h1>
            <p className="section__subtitle">Happy to join you.</p>
          </div>
          <div className="input__section">
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt="profile_image"
                  className="input__image"
                />
              </label>

              <input onChange={onUpload} type="file" id="profile" />
              <input
                type="text"
                placeholder="Email*"
                className="input__main register__email"
                onChange={formik.handleChange}
                value={formik.values.email}
                name="email"
              />
              <input
                type="text"
                placeholder="Username*"
                className="input__main register__username"
                onChange={formik.handleChange}
                value={formik.values.username}
                name="username"
              />
              <input
                type="text"
                placeholder="Password*"
                className="input__main register__password"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
              />
              <button className="submit__button" type="submit">
                Register
              </button>
            </form>
            <div className="last__section">
              <span>
                Already member?{" "}
                <button className="lastbutton" onClick={userlogin}>
                  Log in.
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
