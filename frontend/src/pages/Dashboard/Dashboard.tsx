import React, { useState } from 'react';

import './Dashboard.css';
import AvatarWhite from '../../assets/avatar_white.png'
import UserIcon from '../../assets/user_icon.png'

import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import DashboardFrontsList from './components/CardTypes/DashboardFrontsList';
import DashboardMeetingsList from './components/CardTypes/DashboardMeetingsList';
import DashboardCard from './components/DashboardCard';

export default function Dashboard() {

    return (
        <React.Fragment>
            <div className="dasboard-upper-bar row">
                <div className="col-33 col-sm-25 text-center align-self-center">
                    <img src={AvatarWhite} alt="Ganesh Logo versão branca" width="30px"/>
                    <span className="ml-3">
                        GANESH APP - Alpha v0.0.1
                    </span>
                </div>
                <div className="col-34 col-sm-50 text-center align-self-center" onClick={()=>{
                    ($ as any)('#exampleModal').modal();
                }}> 
                    <button type="button" className="btn btn-success">Registrar presença</button>
                </div>
                <div className="col-33 col-sm-25 text-center align-self-center">
                    <img src={UserIcon} alt="Ganesh Logo versão branca" width="30px"/>
                    <span className="ml-2">
                        Marucs
                    </span>
                </div>
            </div>
            <div className="dashboard-body row">
                <div className="col-5 col-sm-15">
                    
                </div>
                <div className="dashboard-content col-90 col-sm-70 shadow">
                    <div className="row mt-3">
                        <div className="col ml-3 p-0">
                            <DashboardCard height={300}>
                                <DashboardMeetingsList/>
                            </DashboardCard>
                        </div>
                        <div className="col ml-3 mr-3 p-0">
                            <DashboardCard height={300}>
                                <DashboardFrontsList/>
                            </DashboardCard>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col border border-warning ml-3 mr-3">
                            .<br/>.<br/>.<br/>.<br/>..<br/>.<br/>.<br/>.<br/>.
                        </div>
        
                    </div>
                    <div className="row mt-3">
                        <div className="col-66 border border-warning ml-3">
                            .<br/>.<br/>.<br/>.<br/>..<br/>.<br/>.<br/>.<br/>.
                        </div>
                        <div className="col border border-warning ml-3 mr-3">
                            .<br/>.<br/>.<br/>.<br/>..<br/>.<br/>.<br/>.<br/>.
                        </div>
                    </div>
                </div>
                <div className="col-5 col-sm-15">

                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header" style={{backgroundColor: "#666666", color: "white"}}>
                        <h5 className="modal-title" id="exampleModalLabel">Registrar Presença</h5>
                        <button type="button" className="close" style={{color: "white", opacity: 1}} data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Digite o código de presença da reunião</label>
                            <input type="number" className="form-control" name="presenceCode" min="1000" max="9999" placeholder="Código de 4 dígitos"/>
                            <small className="form-text text-muted">O código tem 4 dígitos numéricos e acompanha o QR code</small>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success">Registrar presença</button>
                    </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}   