import { ErrorMessage, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Navigate } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import { ProjectCreateModel } from "../../common/models/project";
import * as projectActions from "../../redux/actions/projectActions";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { apiCallsInProgress } from "../../redux/selectors/apiSelectors";
import { getProjectTags } from "../../redux/selectors/projectSelectors";
import { getUsername } from "../../redux/selectors/userSelectors";
import TagInput from "../shared/tagInput";
import { getIsLoggedIn } from "../../redux/selectors/authSelectors";

const NewProjectContainer = styled.div`
  margin: 0 auto;
  width: 696px;

  h1 {
    margin-bottom: 1rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;

  label {
    display: block;
  }

  input {
    margin-left: 0;
    width: 100%;

    &[type="checkbox"] {
      width: initial;
      margin-left: 1ch;
      vertical-align: middle;
    }
  }

  textarea {
    margin-left: 0;
  }

  button {
    margin-left: 0;
  }
`;

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Project name is required"),
  description: yup
    .string(),
  tags: yup
    .array()
    .of(yup.string()),
  startingBalance: yup
    .number()
    .positive()
});

const initialValues = {
  name: "",
  description: "",
  tags: [],
  startingBalance: ""
};

const NewProject = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const loading = useSelector((state) => apiCallsInProgress(state));
  const username = useSelector((state) => getUsername(state));
  const tagSuggestions = useSelector((state) => getProjectTags(state));
  const dispatch: PromiseDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (username && !tagSuggestions) {
      dispatch(projectActions.getProjects(username))
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [dispatch, tagSuggestions, username]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  if (loading) {
    return null;
  }

  const onSubmit = (data) => {
    const model: ProjectCreateModel = {
      name: data.name,
      description: data.description,
      tags: data.tags,
      starting_balance: data.startingBalance !== "" ? data.startingBalance : null
    };

    dispatch(projectActions.createProject(model))
      .then((res) => {
        toast.success("Project created.");
        navigate(res);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <NewProjectContainer className="mt-1">
      <h1>Create a new project</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        onSubmit={onSubmit}>
        {({ getFieldProps, setFieldValue, handleSubmit, values, touched, errors }) => (
          <form onSubmit={handleSubmit} onKeyPress={onKeyPress}>
            {/* Project name */}
            <InputGroup>
              <label htmlFor="projectName">Project name</label>
              <input
                type="text"
                name="projectName"
                aria-describedby="projectNameHelpBlock"
                className={touched.name && errors.name && "invalid"}
                {...getFieldProps("name")}
              />
              <div id="projectNameHelpBlock" className="m-1">
                <ErrorMessage name="name" />
              </div>
            </InputGroup>

            {/* Description */}
            <InputGroup>
              <label htmlFor="description">Description</label>
              <textarea
                rows={4}
                name="description"
                aria-describedby="descriptionHelpBlock"
                className={`${touched.description && errors.description && "invalid"}`}
                {...getFieldProps("description")}
              />
              <div id="descriptionHelpBlock">
                <ErrorMessage name="description" />
              </div>
            </InputGroup>

            {/* Starting balance */}
            <InputGroup>
              <label>Starting balance</label>
              <input
                type="number"
                name="startingBalance"
                placeholder="Enter an amount (optional)..."
                min="0"
                step="0.01"
                aria-describedby="balanceHelpBlock"
                className={touched.startingBalance && errors.startingBalance && "invalid"}
                {...getFieldProps("startingBalance")}
              />
              <div id="balanceHelpBlock">
                <ErrorMessage name="startingBalance" />
              </div>
            </InputGroup>

            {/* Tags */}
            <InputGroup>
              <label htmlFor="tags">Tags</label>
              <TagInput className="ml-0" tags={values.tags} setTags={(tags) => setFieldValue("tags", tags)}
                        suggestions={tagSuggestions} />
            </InputGroup>

            {/* Submit */}
            <InputGroup>
              <button type="submit" className="btn-green">Create project</button>
            </InputGroup>
          </form>
        )}
      </Formik>
    </NewProjectContainer>
  );
};

export default NewProject;