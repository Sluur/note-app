/* eslint-disable react/prop-types */
import { useState } from "react";
import TagInput from "./../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import * as Yup from "yup";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || "");

  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Nota añadida con éxito");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.message) {
        setError(error.response.message);
      }
    }
  };
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Nota editada con éxito");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.message) {
        setError(error.response.message);
      }
    }
  };

  
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Por favor ingrese un contenido."),
    title: Yup.string().required("Por favor ingrese un titulo."),
  });

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ title, content });
      setError("");
      if (type === "edit") {
        editNote();
      } else {
        addNewNote();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500 transition duration-300 group"
          onClick={onClose}
        >
          <MdClose className="text-xl text-slate-400 group-hover:text-white" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="input-label">
          TITULO
        </label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Ir al Gimnasio a las 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label htmlFor="" className="input-label">
          CONTENIDO
        </label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded "
          placeholder="Contenido"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label htmlFor="" className="input-label">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "EDITAR" : "AÑADIR"}
      </button>
    </div>
  );
};

export default AddEditNotes;
