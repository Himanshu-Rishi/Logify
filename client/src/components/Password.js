import React from "react";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { passwordValidation } from "../helper/validate";
import useFetch from "../hook/fetch.hook.js";
import { useAuthstore } from "../store/store";
import { verfiypassword } from "../helper/helper";
import { useNavigate } from "react-router-dom";
const Password = () => {
  const Navigate = useNavigate();
  const { username } = useAuthstore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const avatar = "/assets/user.png";
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let login_promise = verfiypassword(username, values.password);
      toast.promise(login_promise, {
        loading: "Checking...",
        success: <b>Login Successfully...!</b>,
        error: <b>Password not match...!</b>,
      });
      login_promise.then((res) => {
        const { token } = res.data;
        localStorage.setItem("token", token);
        Navigate("/profile");
      });
    },
  });
  function recovery() {
    Navigate("/recovery");
  }
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
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

  return (
    <div className="main__container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">
              Hello <span> {apiData?.first_name || apiData?.username}</span>
            </h1>
            <p className="section__subtitle">
              Explore more by connecting with us.
            </p>
          </div>
          <div className="input__section">
            <form onSubmit={formik.handleSubmit}>
              <img
                src={apiData?.profile || avatar}
                alt="Profile"
                className="input__image"
              />
              <input
                type="text"
                placeholder="Password"
                className="input__main"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
              />
              <button className="submit__button" type="submit">
                Sign In
              </button>
            </form>
            <div className="last__section">
              <span>
                Forget password?{" "}
                <button className="lastbutton" onClick={recovery}>Recover Now.</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;
