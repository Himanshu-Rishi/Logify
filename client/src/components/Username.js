import React from "react";
import { useFormik } from "formik";
import {Toaster} from 'react-hot-toast'
import { usernameValidation } from "../helper/validate";
import { useAuthstore } from "../store/store.js";
import { useNavigate } from "react-router-dom";
const Username = () => {
  const Navigate = useNavigate();
  function userregister() {
    Navigate("/register");
  }
  const avatar = '/assets/user.png';
  const setusername = useAuthstore(state => state.setusername)
   const formik = useFormik({
     initialValues: {
       username: ''
     },
     validate: usernameValidation,
     validateOnBlur: false,
     validateOnChange: false,
     onSubmit: async values => {
       setusername(values.username);
       Navigate('/password')
     }
    });

  return (
    <div className="main__container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">
              Welcome to <span>Logify</span>
            </h1>
            <p className="section__subtitle">
              Explore more by connecting with us.
            </p>
          </div>
          <div className="input__section">
            <form onSubmit={formik.handleSubmit}>
              <img src={avatar} alt="Profile" className="input__image" />
              <input
                type="text"
                placeholder="Username"
                className="input__main"
                onChange={formik.handleChange}
                value={formik.values.username}
                name="username"
              />
              <button className="submit__button" type="submit">
                Let's go
              </button>
            </form>
            <div className="last__section">
              <span>
                Not a member?{" "}
                <button className="lastbutton" onClick={userregister}>
                  Register Now.
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Username;