import React from 'react';

export default function DashboardFrontsList() { 
    return (
        <React.Fragment>
            <div className="card border border-info h-100">
                <div className="card-header">
                    Frentes
                </div>
                <div className="overflow-auto">
                    <div className="row py-2 no-gutters">
                        <div className="col">
                            <div className="card card-block mx-3">
                                <div className="card-body">
                                    <h5 className="card-title">WEB</h5>
                                    <p className="card-text"> Frente de estudos em segurança WEB</p>
                                </div>
                                <div className="card-body">
                                    <a href="#" className="card-link">Participar</a>
                                    {/* <a href="#" className="card-link">Another link</a> */}
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-block mx-3">
                                <div className="card-body">
                                    <h5 className="card-title">WEB</h5>
                                    <p className="card-text"> Frente de estudos em segurança WEB</p>
                                </div>
                                <div className="card-body">
                                    <a href="#" className="card-link">Card link</a>
                                    <a href="#" className="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row py-2 no-gutters">
                        <div className="col">
                            <div className="card card-block mx-3">
                                <div className="card-body">
                                    <h5 className="card-title">WEB</h5>
                                    <p className="card-text"> Frente de estudos em segurança WEB</p>
                                </div>
                                <div className="card-body">
                                    <a href="#" className="card-link">Card link</a>
                                    <a href="#" className="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-block mx-3">
                                <div className="card-body">
                                    <h5 className="card-title">WEB</h5>
                                    <p className="card-text"> Frente de estudos em segurança WEB</p>
                                </div>
                                <div className="card-body">
                                    <a href="#" className="card-link">Card link</a>
                                    <a href="#" className="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}
