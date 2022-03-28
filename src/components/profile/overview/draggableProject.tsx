import color from "color";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { TagPill } from "../../shared/pill";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord, Identifier } from "dnd-core";
import { useRef } from "react";

const CardContainer = styled.div`
  opacity: ${props => props.isDragging ? 0 : 1};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 6px;
  padding: 1em;

  .description {
    font-size: 12px;
    color: ${props => `${color(props.theme.dark.text).darken(0.2)}`};
    min-height: 2em;
    margin: 0.5em 0;
  }
`;

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableProject = ({ username, project, id, index, moveCard }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref));

  return (
    <CardContainer ref={ref} isDragging={isDragging} data-handler-id={handlerId}>
      <Link to={`/${username}/${project.name}`}>{username}/<b>{project.name}</b></Link>
      <p className="description">
        {project.description}
      </p>
      <div className="tags">
        {project.tags.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
      </div>
    </CardContainer>
  );
};

export default DraggableProject;