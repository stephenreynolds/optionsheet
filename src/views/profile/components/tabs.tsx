import { faBookOpen, faDiagramProject, faStar } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { PageTabs, StyledIcon } from "../style";

const ProfileTabs = () => {
  const [params, setParams] = useSearchParams();

  const resetTab = () => {
    const updatedParams = new URLSearchParams();
    setParams(updatedParams.toString());
  };

  const goToTab = (tab: string) => {
    const updatedParams = new URLSearchParams({"tab": tab});
    setParams(updatedParams.toString());
  };

  const currentTab = params.get("tab");

  return (
    <PageTabs>
      <ul>
        <li onClick={resetTab}>
          <a className={(!currentTab || currentTab !== "projects" && currentTab !== "stars") ? "selected" : undefined}>
            <StyledIcon icon={faBookOpen} />
            <span>Overview</span>
          </a>
        </li>
        <li onClick={() => goToTab("projects")}>
          <a className={currentTab === "projects" ? "selected" : undefined}>
            <StyledIcon icon={faDiagramProject} />
            <span>Projects</span>
          </a>
        </li>
        <li onClick={() => goToTab("stars")}>
          <a className={currentTab === "stars" ? "selected" : undefined}>
            <StyledIcon icon={faStar} />
            <span>Stars</span>
          </a>
        </li>
      </ul>
    </PageTabs>
  );
};

export default ProfileTabs;