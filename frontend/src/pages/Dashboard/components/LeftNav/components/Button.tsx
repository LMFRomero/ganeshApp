import React from 'react';

export default function Button(props: {text: string, onClick: (event: React.MouseEvent, text: string) => void}) {
    return (
        <button 
            type="button" 
            className="dash-left-nav-btn list-group-item list-group-item-action"
            onClick={(e)=>{if(props.onClick) props.onClick(e, props.text)}}>
                {props.text}
        </button>

    );
}