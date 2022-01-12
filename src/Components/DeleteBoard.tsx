import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Delete = styled.div<IAreaProps>`
  margin-top: -50px;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "red"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "white"};
  text-align: center;
  span {
    line-height: 90px;
    font-size: 40px;
  }
`;

function DeleteBoard() {
  return (
    <Droppable droppableId="Delete">
      {(magic, info) => (
        <Delete
          isDraggingOver={info.isDraggingOver}
          isDraggingFromThis={Boolean(info.draggingFromThisWith)}
          ref={magic.innerRef}
          {...magic.droppableProps}
        >
          <span>🗑️</span>
          {magic.placeholder}
        </Delete>
      )}
    </Droppable>
  );
}

export default DeleteBoard;
