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
const multer_1 = __importDefault(require("multer"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
// Define routes with proper type handling
router.post("/", upload.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, productController_1.createProduct)(req, res);
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, productController_1.getProducts)(req, res);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, productController_1.getProduct)(req, res);
}));
router.put("/:id", upload.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, productController_1.updateProduct)(req, res);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, productController_1.deleteProduct)(req, res);
}));
exports.default = router;
