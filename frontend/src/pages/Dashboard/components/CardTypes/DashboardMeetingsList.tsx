import React from 'react';

export default function DashboardMeetingsList() { 
    return (
        <React.Fragment>
            <div className="card w-100" style={{width: "18rem"}}>
                <div className="card-header">
                    Próximas Reuniões
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                        <div className="row no-gutters">
                            <div className="col text-center p-0"> 12/11/2020 - 19:59 </div>
                            <div className="col text-center p-0"> WEB </div>
                            <div className="col text-center p-0"> Pedro Guerra </div>
                            {/* TODO: admin activate */}
                            <div className="col-20 d-none"> 
                                <div className="row no-gutters">
                                    <div className="col-50 text-center p-0"> EDIT </div>
                                    <div className="col-50 text-center p-0"> DEL </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li>
                </ul>
            </div>
        </React.Fragment>
    );
}
