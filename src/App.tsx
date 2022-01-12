import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Wrapper = styled.div`
  display: grid;
  max-width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
const Boards = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
`;
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

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    console.log(info);
    if (!destination) return;
    //Delete board Movement
    if (destination?.droppableId === "Delete") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        console.log(boardCopy);
        boardCopy.splice(source.index, 1);
        console.log(boardCopy);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination?.droppableId === source.droppableId) {
      //same board movements.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (
      destination.droppableId !== source.droppableId &&
      destination.droppableId !== "Delete"
    ) {
      //other board movements
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  useEffect(() => {
    const toDoList = localStorage.getItem("toDoList");
    if (toDoList === null) return;
    setToDos(JSON.parse(toDoList));
  }, []);
  useEffect(() => {
    localStorage.setItem("toDoList", JSON.stringify(toDos));
  }, [toDos]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <CreateBoard />
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
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
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
