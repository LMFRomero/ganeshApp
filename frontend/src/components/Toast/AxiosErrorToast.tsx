import React from 'react'
import Toast, {ToastProps} from './Toast';
import { AxiosError } from 'axios';

interface ErrorMessages {
    onTimeout: string,
    on409: string,
    on403: string,
    on401: string
}

const defaultErrorMessageHandler: ErrorMessages = {
    onTimeout: "Timeout: Não foi possível se conectar ao servidor, tente novamente",
    on409: "409: Houve um conflito de dados com o servidor",
    on403: "403: Acesso negado",
    on401: "401: Não autorizado"
}   

function getErrorMessage(error: AxiosError, messageHandler: ErrorMessages): string {
    return error.message === 'Network Error' ? messageHandler.onTimeout: 'TODO: implement other error messages';
}

export default class AxiosErrorToast extends Toast{
    _toast: React.RefObject<Toast>
    constructor(props: ToastProps) {
        super(props);
        this._toast = React.createRef()
    }

    public showAxiosError(error: AxiosError, messageHanlder: ErrorMessages = defaultErrorMessageHandler) {
        this._toast.current?.showContent({
            body: getErrorMessage(error, messageHanlder)
        });
    }

    render() {
        return <Toast {...this.props} ref={this._toast}/>
    }
}