import { useCallback, useEffect, useState } from "react";
import TextButton from "../../shared/textButton";
import PinnedProjectsModal from "./pinnedProjectsModal";
import { getPinnedProjects } from "../../../common/api/user";
import { toast } from "react-toastify";
import styled from "styled-components";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import DraggableProject from "./draggableProject";
import { setPinnedProjects as updatePinnedProjects } from "../../../common/api/user";
import { useSelector } from "react-redux";
import { getUsername } from "../../../redux/selectors/userSelectors";

const PinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
`;

const PinnedProjects = ({ username }) => {
  const myUsername = useSelector((state) => getUsername(state));
  const myProfile = myUsername === username;

  const [loaded, setLoaded] = useState(false);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [showCustomizePinsModel, setShowCustomizePinsModel] = useState(false);

  const onCustomizePinsClick = () => {
    setShowCustomizePinsModel(prevState => !prevState);
  };

  useEffect(() => {
    getPinnedProjects(username)
      .then((result) => {
        setPinnedProjects(result.data);
        setLoaded(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    if (loaded) {
      const projectIds = pinnedProjects
        .map((project) => project.id);

      updatePinnedProjects(projectIds)
        .then()
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [pinnedProjects]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setPinnedProjects(prevState => {
      const pins = prevState.slice();
      const draggedItem = pins[dragIndex];
      pins[dragIndex] = pins[hoverIndex];
      pins[hoverIndex] = draggedItem;
      return pins;
    });
  }, []);

  return (
    <>
      <div className="d-flex space-between">
        <h3>Pinned</h3>
        {myProfile && <TextButton onClick={onCustomizePinsClick}>Customize your pins</TextButton>}
      </div>

      {pinnedProjects.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <PinGrid>
            {pinnedProjects.map((project, i) => (
              <DraggableProject key={project.id} username={username} project={project} index={i} id={project.id}
                                moveCard={moveCard} />
            ))}
          </PinGrid>
        </DndProvider>
      ) : <h3 className="text-center">No pinned projects.</h3>}

      {showCustomizePinsModel && <PinnedProjectsModal show={showCustomizePinsModel} setShow={setShowCustomizePinsModel}
                                                      pinnedProjects={pinnedProjects} setPinned={setPinnedProjects} />}
    </>
  );
};

export default PinnedProjects;