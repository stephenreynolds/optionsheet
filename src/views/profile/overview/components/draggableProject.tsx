import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Identifier, XYCoord } from "dnd-core";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";
import { Project } from "../../../../common/models/project";
import { TagPill } from "../../../../components/pill";
import { CardContainer, DragHandle } from "../style";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface Props {
  username: string;
  project: Project;
  id: number;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onDropped: () => void;
}

const DraggableProject = ({ username, project, id, index, moveCard, onDropped }: Props) => {
  const dragRef = useRef(null);
  const previewRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item: DragItem, monitor) {
      if (!previewRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
    drop() {
      onDropped();
    }
  });

  drag(dragRef);
  drop(preview(previewRef));

  return (
    <CardContainer ref={previewRef} isDragging={isDragging} data-handler-id={handlerId}>
      <div className="d-flex space-between">
        <Link to={`/${username}/${project.name}`}>{username}/<b>{project.name}</b></Link>
        <DragHandle ref={dragRef}>
          <FontAwesomeIcon icon={faGripVertical} />
        </DragHandle>
      </div>
      <p className="description">
        {project.description}
      </p>
      <div className="tags">
        {project.tags.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
        {project.stars > 0 && (
          <span style={{ marginLeft: "1em" }}>
            <FontAwesomeIcon icon={faStar} /> {project.stars}
          </span>
        )}
      </div>
    </CardContainer>
  );
};

export default DraggableProject;