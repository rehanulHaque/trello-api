"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NoteSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: false
    },
    boardId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    }
}, { timestamps: true });
const Note = mongoose_1.default.model('Note', NoteSchema);
exports.default = Note;
