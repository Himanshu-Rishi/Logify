import React, { useState } from "react";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { profileValidation } from "../helper/validate.js";
import convertToBase64 from "../helper/convert.js";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../helper/helper.js";
import useFetch from "../hook/fetch.hook.js";
const Profile = () => {
  const Navigate = useNavigate();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [file, setFile] = useState();
  const avatar = "/assets/user.png";
  const formik = useFormik({
    initialValues: {
      first_name: apiData?.first_name || "",
      last_name: apiData?.last_name || "",
      mobile_number: apiData?.mobile_number || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let profile_promise = updateUser(values);
      toast.promise(profile_promise, {
        loading: "Updating...",
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not Update...!</b>,
      });
      profile_promise.then(() => {
        Navigate("/");
      });
    },
  });
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
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
  function userLogout() {
    localStorage.removeItem("token");
    Navigate("/");
  }
  return (
    <div className="main__container">
      <Toaster reverseOrder="false" position="top-center" />
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">Profile</h1>
            <p className="section__subtitle">You can update the details.</p>
          </div>
          <div className="input__section">
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || avatar}
                  alt="profile_image"
                  className="input__image"
                />
              </label>

              <input onChange={onUpload} type="file" id="profile" />
              <div className="first">
                <input
                  type="text"
                  placeholder="FirstName"
                  className="input__main update_firstname"
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                  name="first_name"
                />
                <input
                  type="text"
                  placeholder="LastName"
                  className="input__main update_lastname"
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                  name="last_name"
                />
              </div>
              <div className="second">
                <input
                  type="text"
                  placeholder="Mobile No."
                  className="input__main update_mobileno"
                  onChange={formik.handleChange}
                  value={formik.values.mobile_number}
                  name="mobile_number"
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="input__main update_email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                className="input__main update_address"
                onChange={formik.handleChange}
                value={formik.values.address}
                name="address"
              />
              <button className="submit__button" type="submit">
                Update
              </button>
            </form>
            <div className="last__section">
              <span>
                Come back later?{" "}
                <button className="lastbutton" onClick={userLogout}>
                  Logout.
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
