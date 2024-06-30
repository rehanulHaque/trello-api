import express from "express";
import { authMidd, CustomRequest } from "../middleware/auth";
import Board from "../models/BoardModel";
import Note from "../models/NoteModel";


const router = express.Router();

router.get("/:boardId", authMidd, async (req, res) => {
  try {
    const reqWithUser = req as CustomRequest;
    const boardId = req.params.boardId;

    const notes = await Note.find({ boardId: boardId });
    res.json(notes);
  } catch (error: any) {
    console.log(error.message);
  }
});

router.post("/:boardId", authMidd, async (req, res) => {
  try {
    const { title, description } = req.body;
    const reqWithUser = req as CustomRequest;
    const boardId = req.params.boardId;

    // STEP 1: Create the note
    const note = await Note.create({ title, description, boardId: boardId})

    // STEP 2: Find and update the user
    await Board.findOneAndUpdate({ _id: boardId }, { $push: { notes: { noteId: note._id } } });

    // STEP 3: Send the response
    res.json({ message: "Board Created", success: true, note });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message }); // Send error response
  }
});

router.patch("/board/:boardId/note/:noteId", authMidd, async (req, res) => {
  try {
    const { title, description } = req.body;
    const noteId = req.params.noteId;
    const boardId = req.params.boardId;

    // STEP 1: Find and Update the note
    const updatedNote = await Note.findOneAndUpdate({ _id: noteId, boardId: boardId }, { title, description }, { new: true });
    
    // STEP 2: SEND RESPONSE
    res.json({ message: "Note Updated", sucess: true, updatedNote });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

router.delete("/board/:boardId/note/:noteId", authMidd, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const boardId = req.params.boardId;

    // STEP 1: Find and Delete the note
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, boardId: boardId });

    // STEP 2: UPDATE THE BOARD
    await Board.findOneAndUpdate(
      { _id: boardId },
      { $pull: { notes: { noteId: noteId } } }
    );

    // STEP 3: SEND RESPONSE
    res.json({ message: "Note Deleted", sucess: true });
  } catch (error: any) {
    console.log(error.messsage);
  }
});

export default router;
