require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//Crear USER
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "El Nombre Completo es requerido" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ error: true, message: "El Email es requerido" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "La contraseña es requerida" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "El Usuario ya existe",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3600m",
    }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Usuario registrado con exitó",
  });
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El Email es requerido" });
  }
  if (!password) {
    return res.status(400).json({ message: "La contraseña es requerida" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({
      error: true,
      message: "Usuario no encontrado.",
    });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600m",
    });
    //dev 1 109
    return res.json({
      error: false,
      message: "Usuario ingresado con exito",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Credenciales Invalidas",
    });
  }
});

//Añadir Nota
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!content) {
    return res.status(400).json({ error: "El contenido es requerido." });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res
      .status(200)
      .json({ error: false, note, message: "Nota creada con exitó" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Error interno en el servidor" });
  }
});

//Editar Nota
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No hay cambios propuestos" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Nota no encontrada" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({ error: false, note, message: "Nota editada con exito" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Error interno en el servidor" });
  }
});

//Obtener todas las notas
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({ error: false, notes, message: "All notes" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Error interno en el servidor" });
  }
});

//Eliminar nota
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Nota no encontrada" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Nota eliminada con exitó",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Error interno en el servidor" });
  }
});

//Cambiar valor isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Nota no encontrada" });
    }

    note.isPinned = !note.isPinned;

    await note.save();

    return res.json({ error: false, note, message: "Nota editada con exito" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Error interno en el servidor" });
  }
});
app.listen(8000);

module.exports = app;
