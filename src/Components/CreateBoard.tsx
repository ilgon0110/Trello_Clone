import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toDoState } from "../atom";
import styled from "styled-components";

interface IBoard {
  board: string;
}
const Form = styled.form`
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  width: 300px;
  height: 150px;
  background-color: #f0dc59;
  border-radius: 5px;
  padding-top: 20px;
  input {
    display: inherit;
    width: 80%;
    height: 30px;
    margin: 0 auto;
    text-align: center;
    border-radius: 5px;
    border: none;
    background-color: #cbcfd6;
  }
  button {
    display: inherit;
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
`;
function CreateBoard() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm();
  const onValid = ({ board }: IBoard) => {
    const newBoard = {
      [board]: [],
    };
    setToDos((prevBoard) => {
      return {
        ...prevBoard,
        ...newBoard,
      };
    });
    setValue("board", "");
  };

  return (
    <Form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("board", { required: true, maxLength: 10 })}
        type="text"
        placeholder="create a new board"
      ></input>
      <button>Add</button>
    </Form>
  );
}
export default CreateBoard;
