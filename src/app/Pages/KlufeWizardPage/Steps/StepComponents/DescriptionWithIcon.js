import React from "react";

export default function DescriptionWithIcon (icon, textBeforeIcon="", textAfterIcon="", alt, width) {
    return <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        {textBeforeIcon}
        <img alt={alt}
             style={{width: width}}
             src={icon}/>
        {textAfterIcon}
    </div>
}