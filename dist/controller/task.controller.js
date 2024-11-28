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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.change = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const paginationHelper_1 = __importDefault(require("../helpers/paginationHelper"));
const searchHelper_1 = __importDefault(require("../helpers/searchHelper"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    const paginationObject = (0, paginationHelper_1.default)(initPagination, req.query, countTasks);
    let searchObject = (0, searchHelper_1.default)(req.query);
    if (req.query.keyword) {
        find.title = searchObject.regex;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(paginationObject.limitItems)
        .skip(paginationObject.skip);
    res.json({
        tasks: tasks,
        totalPages: paginationObject.totalPage,
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({
        _id: id,
        deleted: false,
    });
    res.json(task);
});
exports.detail = detail;
const change = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({
            _id: id,
            deleted: false,
        }, {
            status: status,
        });
        res.json({
            code: 200,
            message: "Cập nhật thành công",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại ",
        });
    }
});
exports.change = change;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        let status;
        (function (status) {
            status["STATUS"] = "status";
            status["DELETED"] = "delete";
        })(status || (status = {}));
        if (key == "status") {
            const arrStatus = [
                "initial",
                "doing",
                "finish",
                "pending",
                "notFinish",
            ];
            const checkStatus = arrStatus.includes(value.toString());
            if (!checkStatus) {
                res.status(400).json({
                    code: 400,
                    message: "Không có trạng thái đó",
                });
                return;
            }
        }
        else if (key == "delete") {
            const arrDelete = ["true", "false"];
            const checkStatus = arrDelete.includes(value.toString());
            if (!checkStatus) {
                res.status(400).json({
                    code: 400,
                    message: "Không có trạng thái đó",
                });
                return;
            }
        }
        switch (key) {
            case status.STATUS: {
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                    deleted: false,
                }, {
                    status: value,
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công",
                });
                break;
            }
            case status.DELETED: {
                yield task_model_1.default.updateMany({
                    _id: { $in: ids },
                    deleted: false,
                }, {
                    deleted: true,
                });
                res.json({
                    code: 200,
                    message: "Xóa thành công",
                });
                break;
            }
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại",
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: data,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Tạo thất bại",
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
            data: data,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật  thất bại",
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại",
        });
    }
});
exports.deleteTask = deleteTask;
