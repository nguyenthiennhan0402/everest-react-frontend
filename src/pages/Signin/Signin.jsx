import { Spin, message } from "antd";
import axios from "api/axiosClient";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "styles/Signin/Signin.css";

const LOGIN_URL = "/api/v1/auth/login";

const Signin = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.code === 200) {
        setEmail("");
        localStorage.setItem("accessToken", response?.data?.access_token);
        localStorage.setItem("refreshToken", response?.data?.refresh_token);
        localStorage.setItem("access_token_expires", response?.data?.access_token_expires_in);
        localStorage.setItem("last_logged_time", Date.now());
        localStorage.setItem("username", response?.data?.username);
        setPassword("");
        message.success(response?.data?.message);
        navigate("/campaign");
      } else if (response.data.code === 400) {
        const errorMessage = response?.data?.message || "Login Failed";
        message.error(errorMessage);
        errRef.current.focus();
      } else {
        message.error("No Server Response");
        errRef.current.focus();
      }
      setLoading(false);
    } catch (e) {
      message.error("Unknown error. Contact your administrator for support.");
    } finally {
      setLoading(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className="container">
      <Spin spinning={loading}>
        <div className="form-container">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-title">WELCOME</div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
              {errMsg}
            </p>
            <div className="form-group">
              <input
                type="email"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                required
              />
              {formik.touched.email && formik.errors.email ? <p className="error">{formik.errors.email}</p> : null}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
              ) : null}
            </div>

            <div className="login-butons">
              <button type="submit">Sign In</button>
              <div className="login-social">
                <button className="fb-login">Facebook</button>
                <button className="google-login">Google</button>
              </div>
            </div>
          </form>
        </div>
      </Spin>
    </div>
  );
};

export default Signin;
