import {
  create,
  deletepost,
  getposts,
<<<<<<< HEAD
  updatepost,
=======
>>>>>>> cc6eccc2ca60d9fdc6579ac817875679815b56b7
} from "../controllers/post.conteroller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
<<<<<<< HEAD
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
=======
>>>>>>> cc6eccc2ca60d9fdc6579ac817875679815b56b7

export default router;
