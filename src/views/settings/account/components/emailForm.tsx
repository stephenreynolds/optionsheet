import { ErrorMessage, Formik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { HelpBlock } from "../style";
import { getEmail } from "../../../../redux/selectors/userSelectors";
import { checkCredentials } from "../../../../common/api/auth";
import { updateUser } from "../../../../common/api/user";

const EmailForm = () => {
  const currentEmail = useSelector(state => getEmail(state));

  const [email, setEmail] = useState(currentEmail);
  const [confirmed] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email address.")
      .required("Email address is required.")
      .test(
        "checkEmail",
        "That email is already in use.",
        async (value) => value && (value === currentEmail || await checkCredentials({ email: value }))
      )
  });

  if (!(email && email.length)) {
    return null;
  }

  const initialValues = {
    email
  };

  const onSubmit = (values, { resetForm }) => {
    updateUser(values)
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