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
const TodoModel_1 = __importDefault(require("../models/TodoModel"));
const router = express_1.default.Router();
router.get("/:boardId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.boardId;
        const todos = yield TodoModel_1.default.find({ boardId: boardId });
        res.json(todos);
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.post("/:boardId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const boardId = req.params.boardId;
        // STEP 1: Create the note
        const todo = yield TodoModel_1.default.create({ title, boardId: boardId });
        // STEP 2: Find and update the board
        yield BoardModel_1.default.findOneAndUpdate({ _id: boardId }, { $push: { todos: { todoId: todo._id } } });
        // STEP 3: Send the response
        res.json({ message: "Todo Created", success: true, todo });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message }); // Send error response
    }
}));
router.patch("/board/:boardId/todo/:todoId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, completed } = req.body;
        const todoId = req.params.todoId;
        const boardId = req.params.boardId;
        let updateData = {};
        if (title)
            updateData.title = title;
        if (completed)
            updateData.completed = completed;
        // STEP 1: Find and Update the todo
        const updatedTodo = yield TodoModel_1.default.findOneAndUpdate({ _id: todoId, boardId: boardId }, updateData, { new: true });
        // STEP 2: SEND RESPONSE
        res.json({ message: "Todo Updated", sucess: true, updatedTodo });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
router.delete("/board/:boardId/todo/:todoId", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = req.params.todoId;
        const boardId = req.params.boardId;
        // STEP 1: Find and Delete the note
        yield TodoModel_1.default.findOneAndDelete({ _id: todoId, boardId: boardId });
        // STEP 2: UPDATE THE BOARD
        yield BoardModel_1.default.findOneAndUpdate({ _id: boardId }, { $pull: { todos: { todoId: todoId } } });
        // STEP 3: SEND RESPONSE
        res.json({ message: "Todo Deleted", sucess: true });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
exports.default = router;
