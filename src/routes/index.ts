const express = require("express");
import type { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("The Negarit Events API is Working Successfully!");
});

module.exports = router;
