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
exports.detail = exports.login = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generateHelper_1 = require("../helpers/generateHelper");
const md5_1 = __importDefault(require("md5"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        const emailExist = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (emailExist) {
            res.json({
                code: 400,
                message: "Email đã tồn tại",
            });
            return;
        }
        const token = (0, generateHelper_1.generateRandomString)(30);
        const user = new user_model_1.default({
            fullName: fullName,
            email: email,
            password: (0, md5_1.default)(password),
            token: token
        });
        yield user.save();
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Tạo tài khoản thành công",
            token: token
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Tạo tài khoản thất bại",
        });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (!user) {
            return res.json({
                code: 400,
                message: "Email không tồn tại",
            });
        }
        if ((0, md5_1.default)(password) != user.password) {
            return res.json({
                code: 400,
                message: "Mật khẩu không chính xác",
            });
        }
        res.cookie("token", user.token);
        res.json({
            code: 200,
            message: "Đăng nhập thành công",
            token: user.token,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Đăng nhập thất bại",
        });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield user_model_1.default.findOne({
            _id: id,
            deleted: false
        }).select("-password -token");
        res.json({
            code: 200,
            user: user
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lấy thông tin thất bại",
        });
    }
});
exports.detail = detail;
