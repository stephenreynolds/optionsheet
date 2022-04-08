import { useState } from "react";
import { InputGroup } from "../style";
import DeleteAccount from "./components/delete";
import EmailForm from "./components/emailForm";
import PasswordForm from "./components/passwordForm";
import UsernameForm from "./components/usernameForm";

const AccountSettings = () => {
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

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