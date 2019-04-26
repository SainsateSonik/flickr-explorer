import React from "react";
import { PropagateLoader } from "react-spinners";
import "./Spinner.css";

const spinner = () => (
    <div className="spinner">
        <PropagateLoader color="teal"/>
    </div>
);

export default spinner;