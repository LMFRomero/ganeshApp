import React, { MouseEvent } from 'react';

import $ from 'jquery';
import Button from './components/Button';

export default function LeftNav(props: {onChange: (event: MouseEvent, text:string) => void }) {
    function handleLeftNavBtnClick(event: MouseEvent, text: string) {
        $('.dash-left-nav-btn').removeClass('active');
        $(event.target).addClass('active');
        if (props.onChange) props.onChange(event, text);
    }

    return (
        <ul className="list-group w-100">
            <Button text="Feed Geral" onClick={handleLeftNavBtnClick}/>
            <Button text="Materiais" onClick={handleLeftNavBtnClick}/>
            <Button text="Reuniões" onClick={handleLeftNavBtnClick}/>
            <Button text="Apresentações" onClick={handleLeftNavBtnClick}/>
            <Button text="Gerenciar Membros" onClick={handleLeftNavBtnClick}/>
        </ul>
    );
}