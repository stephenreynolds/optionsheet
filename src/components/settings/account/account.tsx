import { useState } from "react";
import styled from "styled-components";
import DeleteAccount from "./delete";
import EmailForm from "./emailForm";
import PasswordForm from "./passwordForm";
import UsernameForm from "./usernameForm";

const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 100%;
  }
`;

const AccountSettings = () => {
  const[showDeleteAccount, setShowDeleteAccount] = useState(false);

  const toggleDeleteModal = () => {
    setShowDeleteAccount(!showDeleteAccount);
  };

  return (
    <div className="w-100">
      <h1>Account</h1>
      <hr />

      {/* Username */}
      <InputGroup>
        <UsernameForm />
      </InputGroup>

      {/* Password */}
      <InputGroup>
        <EmailForm />
      </InputGroup>

      {/* Password */}
      <InputGroup>
        <PasswordForm />
      </InputGroup>

      {/* Delete account */}
      <InputGroup>
        <button className="text-red" onClick={toggleDeleteModal}>Delete account</button>
        <DeleteAccount show={showDeleteAccount} toggleVisibility={toggleDeleteModal} />
      </InputGroup>
    </div>
  );
};

export default AccountSettings;