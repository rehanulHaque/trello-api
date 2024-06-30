"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const BoardModel_1 = __importDefault(require("../models/BoardModel"));
const NoteModel_1 = __importDefault(require("../models/NoteModel"));
const router = express_1.default.Router();
router.get("/:boardId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqWithUser = req;
        const boardId = req.params.boardId;
        const notes = yield NoteModel_1.default.find({ boardId: boardId });
        res.json(notes);
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.post("/:boardId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const reqWithUser = req;
        const boardId = req.params.boardId;
        // STEP 1: Create the note
        const note = yield NoteModel_1.default.create({ title, description, boardId: boardId });
        // STEP 2: Find and update the user
        yield BoardModel_1.default.findOneAndUpdate({ _id: boardId }, { $push: { notes: { noteId: note._id } } });
        // STEP 3: Send the response
        res.json({ message: "Board Created", success: true, note });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message }); // Send error response
    }
}));
router.patch("/board/:boardId/note/:noteId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const noteId = req.params.noteId;
        const boardId = req.params.boardId;
        // STEP 1: Find and Update the note
        const updatedNote = yield NoteModel_1.default.findOneAndUpdate({ _id: noteId, boardId: boardId }, { title, description }, { new: true });
        // STEP 2: SEND RESPONSE
        res.json({ message: "Note Updated", sucess: true, updatedNote });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
router.delete("/board/:boardId/note/:noteId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.noteId;
        const boardId = req.params.boardId;
        // STEP 1: Find and Delete the note
        const deletedNote = yield NoteModel_1.default.findOneAndDelete({ _id: noteId, boardId: boardId });
        // STEP 2: UPDATE THE BOARD
        yield BoardModel_1.default.findOneAndUpdate({ _id: boardId }, { $pull: { notes: { noteId: noteId } } });
        // STEP 3: SEND RESPONSE
        res.json({ message: "Note Deleted", sucess: true });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
exports.default = router;
