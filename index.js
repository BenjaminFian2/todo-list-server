require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  //
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // to use the depreciated function findByIdAndUpdate()
});

const ToDo = mongoose.model("Todo", {
  title: String,
});

app.post("/create", async (req, res) => {
  try {
    const toDo = new ToDo({ title: req.fields.title });
    await toDo.save();
    res.status(200).json({ message: "new task created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const toDos = await ToDo.find();
    res.status(200).json(toDos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/update", async (req, res) => {
  try {
    await ToDo.findByIdAndUpdate(
      req.fields.id,
      {
        title: req.fields.title,
      },
      { new: true }
    );
    res.status(200).json({ message: "task successfully updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await ToDo.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "task successfully deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/byName", async (req, res) => {
  try {
    const toDo = await ToDo.findOne({ title: req.query.title });
    res.status(200).json(toDo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "this path does not exist !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
