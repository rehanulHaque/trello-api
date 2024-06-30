import express from "express";
import { authMidd, CustomRequest } from "../middleware/auth";
import Board from "../models/BoardModel";
import Todo from "../models/TodoModel";


const router = express.Router();

router.get("/:boardId", authMidd, async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const todos = await Todo.find({ boardId: boardId });
    res.json(todos);
  } catch (error: any) {
    console.log(error.message);
  }
});

router.post("/:boardId", authMidd, async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.boardId;

    // STEP 1: Create the note
    const todo = await Todo.create({ title, boardId: boardId})

    // STEP 2: Find and update the board
    await Board.findOneAndUpdate({ _id: boardId }, { $push: { todos: { todoId: todo._id } } });

    // STEP 3: Send the response
    res.json({ message: "Todo Created", success: true, todo });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message }); // Send error response
  }
});

router.patch("/board/:boardId/todo/:todoId", authMidd, async (req, res) => {
  try {
    const { title, completed } = req.body;
    const todoId = req.params.todoId;
    const boardId = req.params.boardId;

    let updateData: {title?: string, completed?: boolean} = {}
    if(title) updateData.title = title
    if(completed) updateData.completed = completed

    // STEP 1: Find and Update the todo
    const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId, boardId: boardId }, updateData, { new: true });
    
    // STEP 2: SEND RESPONSE
    res.json({ message: "Todo Updated", sucess: true, updatedTodo });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

router.delete("/board/:boardId/todo/:todoId", authMidd, async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const boardId = req.params.boardId;

    // STEP 1: Find and Delete the note
    await Todo.findOneAndDelete({ _id: todoId, boardId: boardId });

    // STEP 2: UPDATE THE BOARD
    await Board.findOneAndUpdate(
      { _id: boardId },
      { $pull: { todos: { todoId: todoId } } }
    );

    // STEP 3: SEND RESPONSE
    res.json({ message: "Todo Deleted", sucess: true });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

export default router;
