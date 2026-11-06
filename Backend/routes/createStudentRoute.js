const express = require("express");
const router = express.Router();
const { createStudent } = require("../controllers/createStudentController");

router.post("/students", createStudent);

module.exports = router;