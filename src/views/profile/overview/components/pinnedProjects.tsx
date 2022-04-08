import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPinnedProjects, setPinnedProjects as updatePinnedProjects } from "../../../../common/api/user";
import { getUsername } from "../../../../redux/selectors/userSelectors";
import TextButton from "../../../../components/textButton";
import DraggableProject from "./draggableProject";
import PinnedProjectsModal from "./pinnedProjectsModal";
import { PinGrid } from "../style";

interface Props {
  username: string;
}

const PinnedProjects = ({ username }: Props) => {
  const myUsername = useSelector((state) => getUsername(state));
  const myProfile = myUsername === username;

  const [loading, setLoading] = useState(true);
  const [orderUpdated, setOrderUpdated] = useState(false);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [showCustomizePinsModel, setShowCustomizePinsModel] = useState(false);

  const onCustomizePinsClick = () => {
    setShowCustomizePinsModel(prevState => !prevState);
  };

  useEffect(() => {
    getPinnedProjects(username)
      .then((data) => {
        setPinnedProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const onDropped = () => {
    const projectIds = pinnedProjects
      .map((project) => project.id);

    updatePinnedProjects(projectIds)
      .then(() => {
        setOrderUpdated(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setPinnedProjects(prevState => {
      const pins = prevState.slice();
      const draggedItem = pins[dragIndex];
      pins[dragIndex] = pins[hoverIndex];
      pins[hoverIndex] = draggedItem;
      return pins;
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="d-flex space-between align-center" style={{ marginBottom: "1em" }}>
        <div className="d-flex" style={{ alignItems: "baseline" }}>
          <h3 className="m-0">Pinned</h3>
          {orderUpdated && <small style={{ marginLeft: "1ch" }}>Order updated.</small>}
        </div>
        {myProfile && <TextButton onClick={onCustomizePinsClick}>Customize your pins</TextButton>}
      </div>

      {pinnedProjects.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <PinGrid>
            {pinnedProjects.map((project, i) => (
              <DraggableProject key={project.id} username={username} project={project} index={i} id={project.id}
                                moveCard={moveCard} onDropped={onDropped} />
            ))}
          </PinGrid>
        </DndProvider>
      ) : <h3 className="text-center">No pinned projects.</h3>}

      {showCustomizePinsModel && <PinnedProjectsModal show={showCustomizePinsModel} setShow={setShowCustomizePinsModel}
                                                      pinnedProjects={pinnedProjects}
                                                      setPinnedProjects={setPinnedProjects} />}
    </>
  );
};

export default PinnedProjects;