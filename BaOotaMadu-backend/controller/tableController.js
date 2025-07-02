const Table = require("../models/tableModel");
const Activity = require("../models/activityModel");
const Order = require("../models/orderModel");

let io; // Socket.IO instance holder

const setIO = (ioInstance) => {
  io = ioInstance;
};

const logActivity = async (message, restaurant_id, type = "info") => {
  const activity = {
    message,
    restaurant_id,
    type,
    time: new Date(),
  };

  if (io) {
    io.emit("updateRecent", activity);
  }

  await Activity.create(activity); // Save to DB
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { restaurant_id, table_number, qr_code = null, capacity = 4 } = req.body;

    if (!restaurant_id || !table_number) {
      return res.status(400).json({ message: "Restaurant ID and table number are required." });
    }

    const newTable = await Table.create({
      restaurant_id,
      table_number,
      //qr_code,
      capacity
    });

    res.status(201).json({ message: "Table created successfully", table: newTable });
  } catch (error) {
    console.error("Error in createTable:", error);
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

exports.clearTable = async (req, res) => {
  try {
    const { table_id } = req.params;
    //const tableId = "685c19cb8e1c72ac877beeb2";
    // Update table status
    const updatedTable = await Table.findByIdAndUpdate(
      table_id,
      { status: "available" },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Mark linked orders as cleared
    const result = await Order.updateMany(
      { table_id: table_id, status: { $ne: "cleared" } },
      { status: "cleared", payment_status: "cleared" }
    );

    res.status(200).json({
      message: `Table ${table_id} marked as available, and ${result.modifiedCount} linked orders cleared`,
      table: updatedTable,
    });

  } catch (error) {
    console.error("Error in clearTable:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.occupyTable = async (req, res) => {
  try {
    const { table_id } = req.params;  // Use dynamic tableId
    //tableId = "685c19cb8e1c72ac877beeb2";
    // Check current table status
 const { status } = req.body;
 const table = await Table.findByIdAndUpdate(table_id, { status }, { new: true });
 if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status === "occupied") {
      return res.status(400).json({ message: "Table is already occupied" });
    }

    // ✅ Removed the uncleared orders check

    // Mark as occupied
    table.status = "occupied";
    await table.save();

    res.status(200).json({
      message: `Table ${table_id} marked as occupied`,
      table,
    });
  } catch (error) {
    console.error("Error in occupyTable:", error);
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

    await logActivity(
      `Table ${deletedTable.table_number} deleted`,
      deletedTable.restaurant_id,
      "table"
    );

    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTable:", error);
    res.status(500).json({ error: error.message });
  }
};