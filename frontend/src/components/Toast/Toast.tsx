import React from 'react';

import $ from 'jquery';

export interface ToastOptions {
    //Apply a CSS fade transition to the toast. default: true
    animation?: boolean
    //Auto hide the toast. default: true
    autohide?: boolean
    //Delay hiding the toast (ms). default: 500
    delay?: number
}

export interface ToastContent {
    imgSrc?: string
    imgWidth?: number
    title?: string
    topRightInfo?: string
    body?: string
}


export type ToastProps = ToastContent & ToastOptions & {
    id: string
};

export function showToast(toastID: string) {
    if (!toastID.startsWith('#')) toastID = '#' + toastID;
    //@ts-ignore
    $(toastID).toast('show');
}

export function hideToast(toastID: string) {
    if (!toastID.startsWith('#')) toastID = '#' + toastID;
    //@ts-ignore
    $(toastID).toast('hide');
}

export function setToastOptions(toastID: string, options: ToastOptions) {
    if (!toastID.startsWith('#')) toastID = '#' + toastID;
    //@ts-ignore
    $(toastID).toast(options);
}

const registeredTokens : {[id: string]: React.RefObject<Toast>} = {};


export default class Toast extends React.Component<ToastProps> { 
    state: ToastProps
    constructor(props: ToastProps) {
        super(props);
        this.state = {
            ...props
        }
    }

    public getID() {
        return this.state.id;
    }

    public show() {
        showToast(this.state.id);
    }

    public hide() {
        hideToast(this.state.id);
    }

    public setOptions(options: ToastOptions) {
        setToastOptions(this.state.id, options);
    }

    public setContent(content: ToastContent) {
        this.setState({ 
            ...this.props,
            ...content
        })
    }

    public showContent(content: ToastContent) {
        this.setContent(content);
        this.show();
    }
    
    componentDidMount() {
        registeredTokens[this.props.id] = React.createRef();
        console.log(registeredTokens[this.props.id])
        const { animation, autohide, delay } = this.props;
        setToastOptions(this.props.id, {
            animation: animation ?? true, 
            autohide: autohide ?? true, 
            delay: delay ?? 500 
        });
    }

    render() {
        return (
            <div id={this.state.id} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    {this.state.imgSrc ? <img src={this.state.imgSrc} width={this.state.imgWidth ?? 30} className="img rounded mr-2" alt="..."/> : '    '}
                    <strong className="mr-auto">{this.state.title ?? ''}</strong>
                    <small>{this.state.topRightInfo ?? ''}</small>
                    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="toast-body text-dark">
                    {this.state.body ?? ''}
                </div>
            </div>
        );
    }
}