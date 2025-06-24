const Table = require("../models/tableModel");

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { restaurant_id, table_number, qr_code, capacity } = req.body;

    if (!restaurant_id || !table_number) {
      return res.status(400).json({ message: "Restaurant ID and table number are required." });
    }

    const newTable = await Table.create({ restaurant_id, table_number, qr_code });

    res.status(201).json({ message: "Table created successfully", table: newTable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate("restaurant_id", "name");

    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTableById = async (req, res) => {
  try {
    const { table_id } = req.params;

    const table = await Table.findById(table_id).populate("restaurant_id", "name");

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    const { table_number, qr_code } = req.body;

    const updatedTable = await Table.findByIdAndUpdate(
      table_id,
      { table_number, qr_code },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({ message: "Table updated", table: updatedTable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteTable = async (req, res) => {
  try {
    const { table_id } = req.params;

    const deletedTable = await Table.findByIdAndDelete(table_id);

    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }
    io.emit("updateRecent", {
      message: `Table ${deletedTable.table_number} deleted`,
      time: new Date().toISOString(),
    });
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
