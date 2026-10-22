const router = require("express").Router();
const c = require("../controller/students.controller");

router.get("/", c.list);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.delete);
router.get("/:id", c.getOne);
module.exports = router;
