import { create, getposts } from "../controllers/post.conteroller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);

export default router;
