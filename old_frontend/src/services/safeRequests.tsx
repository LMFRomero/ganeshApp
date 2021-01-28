import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface SafeResponse<T = any> {
    type: 'Success' | 'Error',
    response: AxiosResponse<T> & {data: T} | null,
    error: AxiosError<T> | null
};

function createSuccess(response: AxiosResponse): SafeResponse {
    return { type: 'Success', response, error: null };
}

function createError(error: AxiosError): SafeResponse {
    return { type: 'Error', error, response: null };
}

export async function safePost<T>(axios: AxiosInstance, url: string, data?: any, config?: AxiosRequestConfig, errorMessage: string = "Error while safe posting"): Promise<SafeResponse<T>>{
    try {
        return createSuccess(await axios.post(url, data, config))
    } catch (error) {
        console.error(errorMessage, '\nMore details below:');
        console.error(error.message);
        return createError(error);
    }
}

export async function safeGet<T>(axios: AxiosInstance, url: string, config?: AxiosRequestConfig, errorMessage: string = "Error while safe getting"): Promise<SafeResponse<T>>{
    try {
        return createSuccess(await axios.post(url, config))
    } catch (error) {
        console.error(errorMessage, '\nMore details below:');
        console.error(error.message);
        return createError(error);
    }
}
