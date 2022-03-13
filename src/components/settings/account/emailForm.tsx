import { ErrorMessage, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { checkEmailAvailable, getEmail } from "../../../common/userApi";
import { changeEmail } from "../../../redux/actions/userActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { HelpBlock } from "../utils";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email address.")
    .required("Email address is required.")
    .test(
      "checkEmail",
      "That email is already in use.",
      async (value) => value && !(await checkEmailAvailable(value))
    )
});

const EmailForm = () => {
  const dispatch: PromiseDispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getEmail()
      .then((response) => {
        setEmail(response.data.email);
        setConfirmed(response.data.confirmed);
      })
      .catch((error) => {
        toast.error(`Failed to get user email: ${error.messsage}`);
      });
  }, []);

  if (!email.length) {
    return null;
  }

  const initialValues = {
    email
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(changeEmail(values.email))
      .then(() => {
        toast.success("Email address changed.");
        setEmail(values.email);
      })
      .catch((error) => {
        toast.error(error.message);
        resetForm();
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ getFieldProps, handleSubmit, values, touched, errors }) => (
        <form onSubmit={handleSubmit}>
          <label>Email address</label>

          <input
            type="text"
            name="email"
            placeholder="Enter an email address..."
            aria-describedby="emailHelpBlock"
            className={touched.email && errors.email && "invalid"}
            {...getFieldProps("email")}
          />

          {errors.email && (
            <HelpBlock id="emailHelpBlock" className="help-block text-red">
              <ErrorMessage name="email" />
            </HelpBlock>
          )}

          {!confirmed && <HelpBlock>This email address is not confirmed.</HelpBlock>}

          <button type="submit" disabled={!(!errors.email && values.email.length) || values.email === email}>
            Change email address
          </button>
        </form>
      )}
    </Formik>
  );
};

export default EmailForm;