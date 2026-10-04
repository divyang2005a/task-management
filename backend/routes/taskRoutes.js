const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "task title required",
    });
  }

  const sql = `insert into tasks (title,description,status)values(?,?,?)`;

  const values = [title, description || null, status || "pending"];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "failed to create task",
        error: err.message,
      });
    }
    res.status(201).json({
      message: "task created successfully",
      taskId: result.insertId,
    });
  });
});

router.get("/", (req, res) => {
  const sql = "select * from tasks order by id desc";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "failed to get tasks",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "select * from tasks where id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "failed to get tasks",
        error: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    res.status(200).json(results[0]);
  });
});

// update

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "task is required..",
    });
  }

  const sql = `update tasks set title = ? , description = ?, status = ? where id = ?`;

  const values = [title, description || null, status || "pending", id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "failed to update task",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "data not found",
      });
    }
    res.status(200).json({
      message: "task updated successfully..",
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "delete from tasks where id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "failed to delete task",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "data not found",
      });
    }
    res.status(200).json({
      message: "delete task successfully",
    });
  });
});
module.exports = router;
