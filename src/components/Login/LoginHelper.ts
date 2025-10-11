import { LoginForm, SigninRequest } from "interfaces/LoginForm";

export const mapSignRequest = (loginForm: LoginForm): SigninRequest => {
    return {
        ...loginForm,
    };
}