const express = require("express");
const router = express.Router();
const tableController = require("../controller/tableController");

router.post("/", tableController.createTable);
router.get("/", tableController.getAllTables);
router.get("/:table_id", tableController.getTableById);
router.put("/:table_id", tableController.updateTable);
router.delete("/:table_id", tableController.deleteTable);

module.exports = router;
