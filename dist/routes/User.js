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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const hash_1 = require("../utils/hash");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqWithUser = req;
        const users = yield UserModel_1.default.findById(reqWithUser.user);
        res.json(users);
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const newPassword = yield (0, hash_1.hashPassword)(password);
        const user = yield UserModel_1.default.create({ username, password: newPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ message: "User Created", sucess: true, user, token });
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield UserModel_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = yield (0, hash_1.matchPassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ message: "Login Sucessfull", sucess: true, user, token });
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.patch("/:id", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const userId = req.params.id;
        const reqWithUser = req;
        if (reqWithUser.user !== userId)
            return res.status(401).json({ message: "Unauthorized" });
        const newPassword = yield (0, hash_1.hashPassword)(password);
        if (!userId)
            return res.status(400).json({ message: "User does not exist or provide a valid id" });
        const user = yield UserModel_1.default.findByIdAndUpdate(userId, { username, password: newPassword }, { new: true });
        res.json({ message: "User Updated", sucess: true, user });
    }
    catch (error) {
        console.log(error.message);
    }
}));
router.delete("/:id", auth_1.authMidd, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const reqWithUser = req;
        if (reqWithUser.user !== userId)
            return res.status(401).json({ message: "Unauthorized" });
        yield UserModel_1.default.findByIdAndDelete(userId);
        res.json({ message: "User Deleted", sucess: true });
    }
    catch (error) {
        console.log(error.message);
    }
}));
exports.default = router;
