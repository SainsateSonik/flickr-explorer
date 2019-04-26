import React from "react";
import "./Modal.css";

const modal = (props) => (
    <div className="modal">
        <div className="modal-back-cover"
                onClick={props.collapsePhoto}></div>
        <div className="modal-wrapper">
            <img src={props.photo.url} alt={props.photo.title} />
            <p>{props.photo.title}</p>
        </div>
    </div>
);

export default modal;