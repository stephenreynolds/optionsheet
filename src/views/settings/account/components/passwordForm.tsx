import { ErrorMessage, Formik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { HelpBlock } from "../style";
import { updateUser } from "../../../../common/api/user";

const initialValues = {
  currentPassword: "",
  password: "",
  confirm: ""
};

const validationSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Please enter your current password."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters.")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter."
    )
    .matches(/(?=.*[0-9])/, "Password must contain at least one digit.")
    .matches(
      /(?=.*[^A-Za-z0-9])/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  confirm: yup
    .string()
    .when("password", {
      is: val => (val && val.length > 0),
      then: yup.string().oneOf(
        [yup.ref("password")],
        "Password must match."
      )
    })
    .required("Re-enter password.")
});

const isValid = (values, errors) => {
  return values.currentPassword.length && values.password.length &&
    values.confirm.length && !errors.currentPassword &&
    !errors.password && !errors.confirm;
};

const PasswordForm = () => {
  const onSubmit = (values, { resetForm }) => {
    updateUser(values)
      .then(() => {
        toast.success("Password changed.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ getFieldProps, handleSubmit, values, touched, errors }) => (
        <form onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            placeholder="Enter your current password..."
            aria-describedby="currentPasswordHelpBlock"
            className={touched.currentPassword && errors.currentPassword && "invalid"}
            {...getFieldProps("currentPassword")}
          />
          {touched.currentPassword && errors.currentPassword && (
            <HelpBlock id="currentPasswordHelpBlock" className="help-block text-red">
              <ErrorMessage name="currentPassword" />
            </HelpBlock>
          )}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter a password..."
            aria-describedby="passwordHelpBlock"
            className={touched.password && errors.password && "invalid"}
            {...getFieldProps("password")}
          />
          {touched.password && errors.password && (
            <HelpBlock id="passwordHelpBlock" className="help-block text-red">
              <ErrorMessage name="password" />
            </HelpBlock>
          )}

          <label>Confirm password</label>
          <input
            type="password"
            name="confirm"
            placeholder="Re-enter your password..."
            aria-describedby="confirmHelpBlock"
            className={touched.confirm && errors.confirm && "invalid"}
            {...getFieldProps("confirm")}
          />
          {touched.confirm && errors.confirm && (
            <HelpBlock id="confirmHelpBlock" className="help-block text-red">
              <ErrorMessage name="confirm" />
            </HelpBlock>
          )}

          <button type="submit" disabled={!isValid(values, errors)}>
            Change password
          </button>
        </form>
      )}
    </Formik>
  );
};

export default PasswordForm;