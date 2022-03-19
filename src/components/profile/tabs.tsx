import { faBookOpen, faDiagramProject, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
  color: ${props => props.theme.dark.borderLight};
  font-size: 1.1em;
`;

const PageTabs = styled.nav`
  box-shadow: inset 0 -1px 0 ${props => props.theme.dark.border};
  padding: 0 32px;
  margin-top: 1rem;

  ul {
    list-style-type: none;
    margin: 0 auto;
    padding: 0;
    display: flex;
    align-items: center;
    width: fit-content;

    li {
      a {
        padding: 1rem;
        color: ${props => props.theme.dark.text};
        text-decoration: none;
        transition: box-shadow 0.12s ease-out;
        display: inline-flex;
        align-items: center;

        &:hover {
          cursor: pointer;
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.borderLight};
        }

        [data-content] {
          &::before {
            content: attr(data-content);
            font-weight: 600;
            display: block;
            height: 0;
            visibility: hidden;
          }
        }

        &.selected {
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.accent};
          font-weight: 600;

          ${StyledIcon} {
            color: ${props => props.theme.dark.text}
          }
        }
      }
    }

    button {
      margin-left: 1rem;
    }
  }
`;

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
          <a className={(!currentTab || currentTab !== "projects" && currentTab !== "stars") && "selected"}>
            <StyledIcon icon={faBookOpen} />
            <span>Overview</span>
          </a>
        </li>
        <li onClick={() => goToTab("projects")}>
          <a className={currentTab === "projects" && "selected"}>
            <StyledIcon icon={faDiagramProject} />
            <span>Projects</span>
          </a>
        </li>
        <li onClick={() => goToTab("stars")}>
          <a className={currentTab === "stars" && "selected"}>
            <StyledIcon icon={faStar} />
            <span>Stars</span>
          </a>
        </li>
      </ul>
    </PageTabs>
  );
};

export default ProfileTabs;