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
const UserModel_1 = __importDefault(require("../models/UserModel"));
const router = express_1.default.Router();
router.get("/", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqWithUser = req;
        const boards = yield BoardModel_1.default.find({ owner: reqWithUser.user });
        res.json(boards);
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.post("/", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const reqWithUser = req;
        // Step 1: Create the board
        const board = yield BoardModel_1.default.create({ title, owner: reqWithUser.user });
        // Step 2: Find and update the user
        yield UserModel_1.default.findOneAndUpdate({ _id: reqWithUser.user }, { $push: { boards: { boardId: board._id } } } // Add the new board's ID to the boards array
        );
        // Step 3: Send the response
        res.json({ message: "Board Created", success: true, board });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message }); // Send error response
    }
}));
router.patch("/:id", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const boardId = req.params.id;
        const reqWithUser = req;
        const board = yield BoardModel_1.default.findOneAndUpdate({ _id: boardId, owner: reqWithUser.user }, { title }, { new: true });
        res.json({ message: "Board Updated", sucess: true, board });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
router.delete("/:id", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.id;
        const reqWithUser = req;
        // Setp 1: Find And Delete the board
        const deletedBoard = yield BoardModel_1.default.findOneAndDelete({ _id: boardId, owner: reqWithUser.user });
        if (!deletedBoard) {
            return res.status(404).json({ message: "Board not found or you're not the owner", success: false });
        }
        // Step 2: Update the user to remove the board ID from their boards array
        yield UserModel_1.default.findOneAndUpdate({ _id: reqWithUser.user }, { $pull: { boards: { boardId: boardId } } });
        res.json({ message: "Board Deleted", sucess: true });
    }
    catch (error) {
        console.log(error.messsage);
    }
}));
exports.default = router;
