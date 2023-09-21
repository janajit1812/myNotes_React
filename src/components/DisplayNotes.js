import React from 'react'
import { useContext } from 'react';
import noteContext from '../context/states/NoteContext';
const DisplayNotes = (props) => {
    const context= useContext(noteContext);
    const {deleteNote}=context;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{props.title}</h5>
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{props.updateNote(props.note)}}></i>
                        <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(props.id); props.showAlert("Your note has been deleted successfully","success");}}></i>
                    </div>
                    <p className="card-text">{props.description}</p>
                </div>
            </div>

        </div>
    )
}

export default DisplayNotes;
