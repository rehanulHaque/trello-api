"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMidd = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMidd = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const validateToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!validateToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const reqWithUser = req;
        reqWithUser.user = validateToken.id;
        next();
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authMidd = authMidd;
