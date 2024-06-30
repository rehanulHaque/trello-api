"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BoardSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    notes: [{
            noteId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Note',
                required: true
            }
        }],
    todos: [{
            todoId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Todo',
                required: true
            }
        }]
}, { timestamps: true });
const Board = mongoose_1.default.model('Board', BoardSchema);
exports.default = Board;
