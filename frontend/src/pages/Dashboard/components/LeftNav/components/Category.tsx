import React, { FunctionComponent } from 'react';

import Button from './Button';

export default function Category(props: {text: string, onClick: (event: React.MouseEvent, text: string) => void, children: any[]}) {
    return (
        <React.Fragment>

            <button 
                type="button" 
                className="dash-left-nav-btn list-group-item list-group-item-action"
                onClick={(e)=>{if(props.onClick) props.onClick(e, props.text)}}>
                    {props.text}
            </button>

            {props.children}

        </React.Fragment>
    );
}