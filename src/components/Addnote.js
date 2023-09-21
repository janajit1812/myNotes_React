import React, {useContext, useState} from 'react'
import noteContext from '../context/states/NoteContext';

const Addnote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({title: "", description: "", tag: ""});

    const handleDelete=()=>{
        localStorage.removeItem('token');
    }

    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title: "", description: "", tag: ""});
        props.showAlert("Your note has been added successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:[e.target.value]});
    }

  return (
    <div>
      <div className="container mt-5">
                <h2 className='my-2'>Add a Note</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag} minLength={5} required/>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" onClick={handleClick}>Add</button>
                </form>
                
            </div>
            <h2 className='my-2'>Your Notes</h2>
    </div>
  )
}

export default Addnote;
