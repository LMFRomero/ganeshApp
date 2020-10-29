import React from 'react';
import Button from './Button';

export default function Category(props: {className?: string, text: string, onClick: (event: React.MouseEvent, text: string) => void, children: any[]}) {
    return (
        <React.Fragment>
            <Button className={props.className || ''} text={props.text} onClick={props.onClick}/>
            {props.children}
        </React.Fragment>
    );
}