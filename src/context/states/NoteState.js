import React, { useState } from "react";
import noteContext from "./NoteContext";

const NoteState = (props) => {
  const defaultHost = "http://localhost:5000";

  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // GET ALL NOTES
  const getNotes = async () => {
    // API CALL to fetch notes from the backend
    const response = await fetch(`${defaultHost}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNotes(json); // Adding the fetched notes in the notes object array to display all the notes in the client side.
  }



  // ADD A NOTE
  const addNote = async (title, description, tag) => {
    // API CALL to edit note in the backend
    
    // This object is created because server is not being able to cast the parameters title, description and tag to String.
    const obj={
      title: String(title),
      description: String(description),
      tag: String(tag)
    }
    const response = await fetch(`${defaultHost}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      // body: JSON.stringify({ title, description, tag })
      body: JSON.stringify(obj)
    });
    const note= await response.json();

    // Adding this to fetch the notes in the client side.
    setNotes(notes.concat(note));
  }



  // DELETE A NOTE
  const deleteNote = async (id) => {
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    })
    setNotes(newNotes);

    // API CALL
    const response = await fetch(`${defaultHost}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
  }





  // UPDATE A NOTE
  const editNote = async (id, title, description, tag) => {
    // API CALL to edit note in the backend
    // This object is created because server is not being able to cast the parameters title, description and tag to String.
    const obj={
      title: String(title),
      description: String(description),
      tag: String(tag)
    }
    const response = await fetch(`${defaultHost}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      // body: JSON.stringify({ title, description, tag }),
      body: JSON.stringify(obj)
    });

    // Code for updating the note with the given id on the client side
    let newNote=JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNote.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  }


  // GET USER DETAILS
  const [detail, setDetail] = useState(null);
  const getUser = async () => {
    // API CALL to fetch details of the current logged in user from the backend
    const response = await fetch(`${defaultHost}/api/auth/getUser`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json();
    setDetail(json);  // Setting the details set with the current response.
  }
  




  // Passing the properties as context to the children of the NoteState component.
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes,getUser,detail }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;




