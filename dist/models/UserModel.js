"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    boards: [{
            boardId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Board',
                required: true
            }
        }]
}, { timestamps: true });
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
