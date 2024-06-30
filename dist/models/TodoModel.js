"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TodoSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: String,
        default: false
    },
    boardId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    }
}, { timestamps: true });
const Todo = mongoose_1.default.model('Todo', TodoSchema);
exports.default = Todo;
