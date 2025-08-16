import { useState } from "react";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "./styles.css";

const mockLogin = async (email: string, password: string) => {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "passWord123") {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Invalid credentials" });
      }
    }, 1000);
  });
};

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter and one number"
    )
    .required("Password is required"),
});

const Credentials = () => (
  <div className="test-credentials" aria-live="polite">
    <p>
      <strong>Valid credentials:</strong>
    </p>
    <ul>
      <li>
        Email: <code>test@example.com</code>
      </li>
      <li>
        Password: <code>passWord123</code>
      </li>
    </ul>
  </div>
);

const LoginForm = () => {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setServerError("");
    const res = await mockLogin(values.email, values.password);
    setLoading(false);
    if (!res.success) {
      setServerError(res.message || "Login failed");
    } else {
      alert("Login successful!");
    }
  };

  return (
    <div className="login-container">
      <Credentials />
      <hr />

      <h1 className="login-title">Sign In</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form" noValidate>
            <label htmlFor="email">Email</label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              aria-describedby="email-error"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="error"
              id="email-error"
            />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <Field
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="error"
              id="password-error"
            />

            {serverError && (
              <div className="error server-error">{serverError}</div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
