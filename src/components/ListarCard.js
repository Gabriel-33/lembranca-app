import React from "react";
import {useMemo } from "react";

export const ListarCard =(props)=>{
    const imageElements = useMemo(() => props.map(image => 
        <img key={props.id} src={props.url} alt={props.name}/>
        ), [props]);
        return <div>{imageElements}</div>
}
export const MemoizedListarCard = React.memo(ListarCard);

