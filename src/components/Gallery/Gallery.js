import React from "react";
import "./Gallery.css";

import Spinner from "../Spinner/Spinner";

const gallery = (props) => {

    let photos = null;

    // creates the images that gets diplayed to the client
    if(props.photosURL.length > 0) {
        photos = props.photosURL.map((photo, index) => (
            <li key={`${photo.id}_${index}`}>
                <img src={photo.url}
                     alt={photo.title}
                     onClick={props.enlargePhoto.bind(null, photo)} />
            </li>
        ))
    };
    
    // if there is anything to search for AND there is some result/images for the same
    if(props.searchContext && photos) {
        return (
            <div className="gallery">
                <ul className="gallery-stack">{photos}</ul>
                <div className="loader-wrapper" id="loader-wrapper">
                    { !props.isLastPage ? 
                        <Spinner/> :
                        <p>No more results!</p>
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div className="no-photos">
                No images yet, go ahead and search...
            </div>
        );
    }
};

export default gallery;