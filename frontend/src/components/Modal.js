import React, { useState } from 'react';

import $ from 'jquery';

function generateDummyModalID() {
    return 'modal-' + (new Date()).getUTCMilliseconds();
}

export function showModal(modalID) {
    if (!modalID.startsWith('#')) modalID = '#' + modalID;
    $(modalID).modal();
}

export default function Modal(props) {
    const [modalID, setModalID] = useState(props.id);

    if (!modalID) setModalID(generateDummyModalID());

    return (
        <div className="modal fade" id={modalID} tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        {/* <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5> */}
                        <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.body}
                    </div>
                    <div className="modal-footer">
                        {props.footer}
                    </div>
                    </div>
                </div>
            </div>
    )
}