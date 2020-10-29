import React, { MouseEvent } from 'react';

import $ from 'jquery';
import Button from './components/Button';
import Category from './components/Category';
import Logo from '../../../../assets/avatar.png';

export default function LeftNav(props: {onChange: (event: MouseEvent, text:string) => void }) {
    function handleLeftNavBtnClick(event: MouseEvent, text: string) {
        $('.dash-left-nav-btn').removeClass('active');
        $(event.target).addClass('active');
        if (props.onChange) props.onChange(event, text);
    }

    return (
        <ul className="list-group w-100">
            <img className="dash-left-nav-logo" src={Logo}/>
            <Button className="dash-left-nav-btn" text="Frentes" onClick={handleLeftNavBtnClick}/>
            <Button className="dash-left-nav-btn" text="Gerenciar Reuniões" onClick={handleLeftNavBtnClick}/>
            <Button className="dash-left-nav-btn" text="Meu Perfil" onClick={handleLeftNavBtnClick}/> 
            <Category text="Coordenação" onClick={handleLeftNavBtnClick}> 
                <Button className="dash-left-nav-btn" text="Gerenciar usuários" onClick={handleLeftNavBtnClick}/>
                <Button className="dash-left-nav-btn" text="Gerenciar Solicitações" onClick={handleLeftNavBtnClick}/>
                <Button className="dash-left-nav-btn" text="Relatório de Presença" onClick={handleLeftNavBtnClick}/>
            </Category>
        </ul>
    );
}