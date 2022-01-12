import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";
import DeleteBoard from "./Components/DeleteBoard";

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

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
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
        <DeleteBoard />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
