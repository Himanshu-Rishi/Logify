import React, { useEffect, useState } from "react";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { useAuthstore } from "../store/store";
import { Toaster, toast } from "react-hot-toast";
const Recovery = () => {
const { username } = useAuthstore((state) => state.auth);
const [OTP, setOTP] = useState();
const navigate = useNavigate();
useEffect(() => {
  generateOTP(username).then((OTP) => {
    // console.log(OTP);
    if (OTP) return toast.success("OTP has been send to your email!");
    return toast.error("Problem while generating OTP!");
  });
}, [username]);

async function onSubmit(e) {
  e.preventDefault();
  try {
    let { status } = await verifyOTP({ username, code: OTP });
    if (status === 201) {
      toast.success("Verify Successfully!");
      return navigate("/reset");
    }
  } catch (error) {
    return toast.error("Wront OTP! Check email again!");
  }
}

function resendOTP() {
  let sentPromise = generateOTP(username);

  toast.promise(sentPromise, {
    loading: "Sending...",
    success: <b>OTP has been send to your email!</b>,
    error: <b>Could not Send it!</b>,
  });

  // sentPromise.then((OTP) => {
  //   console.log(OTP);
  // });
}
  return (
    <div className="main__container">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="container glass">
        <div className="form__section">
          <div className="heading_section">
            <h1 className="section__title">Recovery</h1>
            <p className="section__subtitle">
              Enter OTP to recover the password.
            </p>
          </div>
          <div className="input__section">
            <form onSubmit={onSubmit}>
              <p className="section__subtitle">
                Enter 6 digit OTP sent to your email address.
              </p>
              <input
                onChange={(e) => setOTP(e.target.value)}
                type="text"
                placeholder="OTP"
                className="input__main"
              />
              <button className="submit__button" type="submit">
                Recover
              </button>
            </form>
            <div className="last__section">
              <span>
                Can't get OTP?{" "}
                <button className="lastbutton" onClick={resendOTP}>
                  Resend.
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
