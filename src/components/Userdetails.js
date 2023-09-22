import React, { useContext } from 'react';
import './userdetails.css';
import noteContext from '../context/states/NoteContext';

const Userdetails = (props) => {
    let context=useContext(noteContext);
    const {detail}=context;
  return (
    <div>
      <div className="user container">
        <h2>User Details</h2>
        <p style={{"padding":"10px 0px 0px 0px"}}>Name: {detail.name}</p>
        <p>Email: {detail.email}</p>
      </div>
    </div>
  )
}

export default Userdetails;
