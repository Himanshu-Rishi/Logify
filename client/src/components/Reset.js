import React from "react";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { passwordValidation } from "../helper/validate";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hook/fetch.hook";
import { useAuthstore } from "../store/store";
import { resetPassword } from "../helper/helper";
const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: ""
    },
    validate: passwordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: "Updating...",
        success: <b>Reset Successfully...!</b>,
        error: <b>Could not Reset!</b>,
      });

      resetPromise.then(function () {
        navigate("/password");
      });
    },
  });
  const { username } = useAuthstore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] =
    useFetch("createResetSession");


  if (isLoading) return <h1 className="loader">Loading...</h1>;
  if (serverError)
    return (
      <div className="vertical-center">
        <div className="container">
          <div id="notfound" className="text-center ">
            <h1>😮</h1>
            <h2>Oops! Page Not Be Found</h2>
            <p>Sorry but the page you are looking for does not exist.</p>
            <a href="/">Back to homepage</a>
          </div>
        </div>
      </div>
    );
  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>;

function login() {
  navigate('/');
}
  return (
    <div className="main__container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">Reset Password</h1>
            <p className="section__subtitle">
              Enter your new password.
            </p>
          </div>
          <div className="input__section">
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Password"
                className="input__main"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
              />
              <input
                type="text"
                placeholder="Repeat Password"
                className="input__main"
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
                name="confirm_password"
              />
              <button className="submit__button" type="submit">
                Reset
              </button>
            </form>
            <div className="last__section">
              <span>
                Want to login?{" "}
                <button className="lastbutton" onClick={login}>
                  Login Now.
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;
