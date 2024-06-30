import express from "express";
import { authMidd, CustomRequest } from "../middleware/auth";
import Board from "../models/BoardModel";
import User from "../models/UserModel";

const router = express.Router();

router.get("/", authMidd, async (req, res) => {
  try {
    const reqWithUser = req as CustomRequest;
    const boards = await Board.find({ owner: reqWithUser.user });
    res.json(boards);
  } catch (error: any) {
    console.log(error.message);
  }
});

router.post("/", authMidd, async (req, res) => {
  try {
    const { title } = req.body;
    const reqWithUser = req as CustomRequest;

    // Step 1: Create the board
    const board = await Board.create({ title, owner: reqWithUser.user });

    // Step 2: Find and update the user
    await User.findOneAndUpdate(
      { _id: reqWithUser.user },
      { $push: { boards: { boardId: board._id } } } // Add the new board's ID to the boards array
    );

    // Step 3: Send the response
    res.json({ message: "Board Created", success: true, board });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message }); // Send error response
  }
});

router.patch("/:id", authMidd, async (req, res) => {
  try {
    const { title } = req.body;
    const boardId = req.params.id;
    const reqWithUser = req as CustomRequest;

    const board = await Board.findOneAndUpdate({ _id: boardId, owner: reqWithUser.user }, { title }, { new: true });

    res.json({ message: "Board Updated", sucess: true, board });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

router.delete("/:id", authMidd, async (req, res) => {
  try {
    const boardId = req.params.id;
    const reqWithUser = req as CustomRequest;

    // Setp 1: Find And Delete the board
    const deletedBoard = await Board.findOneAndDelete({_id: boardId, owner: reqWithUser.user});
    if (!deletedBoard) {
      return res.status(404).json({ message: "Board not found or you're not the owner", success: false });
    }

    // Step 2: Update the user to remove the board ID from their boards array
    await User.findOneAndUpdate(
      { _id: reqWithUser.user },
      { $pull: { boards: { boardId: boardId } } }
    );


    res.json({ message: "Board Deleted", sucess: true });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

export default router;
