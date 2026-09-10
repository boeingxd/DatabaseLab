const router = require("express").Router();
const c = require("../controller/students.controller");

router.get("/", c.list);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.exports = router;
