import Image from "../../../assets/Spinner.gif";
import React from "react";

export default function Loading() {
    return (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <img alt="loading"
             style={{width: 100, marginTop: 50}}
             src={Image}/>
    </div>)
}