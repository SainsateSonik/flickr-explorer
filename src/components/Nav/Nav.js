import React from "react";
import "./Nav.css";

import storageKey from "../../static/localStorageKey";

const nav = (props) => {
    
    const priorContextList = JSON.parse(localStorage.getItem(storageKey));
    const recentSearchItems = priorContextList.map(context => (
        <li key={context}
            onClick={props.inputChangeHandler.bind(null, { target: { value: context } })}>
            {context}
        </li>
    ));

    return (
        <header>
            <h1>Search Photos</h1>
            <input  type="text" 
                    placeholder="Type here to search..."
                    autoFocus
                    value={props.searchContext}
                    onChange={props.inputChangeHandler}/>
            <ul className="recent-search">
                {recentSearchItems}
            </ul>
        </header>
    )
};



export default nav;