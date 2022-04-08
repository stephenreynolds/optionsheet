import { ErrorMessage, Formik } from "formik";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { getUsername } from "../../../../redux/selectors/userSelectors";
import { HelpBlock } from "../style";
import { checkCredentials } from "../../../../common/api/auth";
import { updateUser } from "../../../../common/api/user";

const UsernameForm = () => {
  const username = useSelector((state) => getUsername(state));

  if (!username) {
    return null;
  }

  const initialValues = {
    username
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Username is required.")
      .test(
        "checkUsername",
        "That username is not available.",
        async (value) => value && (value === username || await checkCredentials({ username: value }))
      )
  });

  const onSubmit = (values) => {
    updateUser(values)
      .then(() => {
        toast.success("Username changed.");
      })
      .catch((error) => {
        toast.error(error.message);
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
          <label>Name</label>

          <input
            type="text"
            name="username"
            aria-describedby="usernameHelpBlock"
            className={touched.username && errors.username && "invalid"}
            {...getFieldProps("username")}
          />

          {errors.username && (
            <HelpBlock id="usernameHelpBlock" className="help-block text-red">
              <ErrorMessage name="username" />
            </HelpBlock>
          )}

          <button type="submit" disabled={!!errors.username || values.username === username}>
            Change name
          </button>
        </form>
      )}
    </Formik>
  );
};

export default UsernameForm;