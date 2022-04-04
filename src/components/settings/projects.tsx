import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { getDefaultProjectSettings, updateDefaultProjectSettings } from "../../common/api/user";
import { DefaultProjectSettingsModel } from "../../common/models/user";
import { toast } from "react-toastify";

const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 100%;
  }
`;

const ProjectSettings = () => {
  const [loading, setLoading] = useState(true);
  const [newStartingBalance, setNewStartingBalance] = useState<number | string>("");
  const [newRisk, setNewRisk] = useState<number | string>("");

  useEffect(() => {
    getDefaultProjectSettings()
      .then((data) => {
        setNewStartingBalance(data.defaultStartingBalance ?? "");
        setNewRisk(data.defaultRisk ?? "");
        setLoading(false);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const onStartingBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewStartingBalance(e.target.value);
  };

  const onRiskChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewRisk(e.target.value);
  };

  const onSave = () => {
    const model: DefaultProjectSettingsModel = {
      defaultStartingBalance: newStartingBalance === "" ? null : Number(newStartingBalance),
      defaultRisk: newRisk === "" ? null : Number(newRisk)
    };

    updateDefaultProjectSettings(model)
      .then(() => {
        toast.success("Updated defaults.");
      })
      .catch((error) => toast.error(error.message));
  };

  if (loading) {
    return null;
  }

  return (
    <div className="w-100">
      <h1>Default Project Settings</h1>
      <hr />

      {/* Starting balance */}
      <InputGroup>
        <label>Starting balance</label>
        <input
          type="number"
          name="startingBalance"
          placeholder="Enter an amount..."
          min="0"
          step="0.01"
          value={newStartingBalance}
          onChange={onStartingBalanceChange}
        />
      </InputGroup>

      {/* Risk % */}
      <InputGroup>
        <label>Risk %</label>
        <input
          type="number"
          name="risk"
          placeholder="Enter an amount..."
          min="0"
          step="0.01"
          value={newRisk}
          onChange={onRiskChange}
        />
      </InputGroup>

      <button className="btn-green" onClick={onSave}>Update settings</button>
    </div>
  );
};

export default ProjectSettings;