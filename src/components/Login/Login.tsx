import * as React from 'react';
import { TextField, Grid, Button, Typography } from '@mui/material';
import { ContainerWithoutPadding } from 'components/Display/Container';
import { userStateAction } from 'stores/user/action';
import { User } from 'stores/types/User';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { withNotification, NotificationProps } from 'components/Dialog/Notification';
import { connect } from 'react-redux';
import { LoginForm } from 'interfaces/LoginForm';
import { AlignRightGrid } from 'components/Display/Grid';
import { mapSignRequest } from './LoginHelper';
import { signin } from 'services/LoginService';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface DispatchProps {
    setUser: (user: User) => void;
}

interface OwnProps {
}

interface FormValues {
    loginFields: LoginForm;
}

type FormProps = OwnProps & DispatchProps & NotificationProps & RouteComponentProps;
type Props = FormProps & FormikProps<FormValues>;

class LoginComponent extends React.PureComponent<Props, {}> {

    private usernameRef: any;

    constructor(props: Props) {
        super(props);
        this.usernameRef = React.createRef();
    }

    clearForm = () => {
        this.props.resetForm({ values: { loginFields: initialValue } });
        if (this.usernameRef && this.usernameRef.current) {
            this.usernameRef.current.focus();
        }
    }

    render() {
        const { values, handleChange, handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <ContainerWithoutPadding maxWidth="xs">
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Typography variant="h5">
                            Sign in
                        </Typography>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                inputRef={this.usernameRef}
                                name="loginFields.username"
                                label="username"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.loginFields.username}
                                autoFocus={true}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <TextField
                                type="password"
                                name="loginFields.password"
                                label="password"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChange}
                                value={values.loginFields.password}
                                size="small"
                            />
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="button"
                                size="small"
                                onClick={this.clearForm}
                            >
                                เริ่มใหม่
                        </Button>
                        </Grid>
                        <AlignRightGrid item sm={6} xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                            >
                                เข้าสู่ระบบ
                        </Button>
                        </AlignRightGrid>
                    </Grid>
                </ContainerWithoutPadding>
            </form>
        );
    }
}

const initialValue = {
    username: '',
    password: '',
};

const mapPropsToValues = (props: OwnProps) => {
    return {
        loginFields: initialValue,
    };
};

const handleSubmit = async (values: FormValues, { props, resetForm }: FormikBag<FormProps, FormValues>) => {
    console.log(values);
    const request = mapSignRequest(values.loginFields);
    const response = await signin(request);

    if (response.body) {
        props.setUser(response.body);
        props.history.push(`${application.contextRoot}`);
    } else {
        props.handleNotificationOpen();
        props.setBodyMessage('username หรือ password ผิด');
    }
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    setUser: (user: User) => dispatch(userStateAction.setUser(user)),
});

export const Login = withNotification(withRouter(connect<{}, DispatchProps, OwnProps>(null, mapDispatchToProps)(withFormik<FormProps, FormValues>({ mapPropsToValues, handleSubmit })(LoginComponent))), 'แจ้งเตือน');
