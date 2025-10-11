import * as React from 'react';
import { Dialog, DialogTitle, Button, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { withRouter, RouteComponentProps } from 'react-router';

export interface NotificationProps {
    handleNotificationOpen: () => void;
    setBodyMessage: (message: string) => void;
    setRedirectUrl: (url: string) => void;
    setOpenNewTabUrl: (url: string) => void;
}

export function withNotification<P extends NotificationProps = NotificationProps>(WrappedComponent: React.ComponentType<P>, headerMessage: string) {

    interface State {
        isOpen: boolean;
        bodyMessage: string;
        redirectUrl?: string;
        newTabUrl?: string;
    }

    type Props = Omit<P, keyof NotificationProps> & RouteComponentProps;

    class ComponentWithNotification extends React.PureComponent<Props, State> {

        constructor(props
            
            
            : Props) {
            super(props);
            this.state = {
                isOpen: false,
                bodyMessage: '',
            };
        }

        handleNotificationOpen = () => this.setState({ isOpen: true });

        setBodyMessage = (message: string) => this.setState({ bodyMessage: message });

        setRedirectUrl = (url: string) => this.setState({ redirectUrl: url });

        setOpenNewTabUrl = (url: string) => this.setState({ newTabUrl: url });

        handleNotificationClose = () => {
            const { redirectUrl, newTabUrl } = this.state;
            this.setState({ isOpen: false });

            redirectUrl && this.props.history.push(redirectUrl);
            newTabUrl && window.open(newTabUrl, '_blank');
        };

        render() {
            const extendProps = {
                ...this.props,
                handleNotificationOpen: this.handleNotificationOpen,
                setBodyMessage: this.setBodyMessage,
                setRedirectUrl: this.setRedirectUrl,
                setOpenNewTabUrl: this.setOpenNewTabUrl,
            } as any;

            return (
                <React.Fragment>
                    <WrappedComponent {...extendProps} />
                    <Dialog
                        open={this.state.isOpen}
                        onClose={this.handleNotificationClose}
                        aria-labelledby="notification-dialog-title"
                        aria-describedby="notification-dialog-description"
                    >
                        <DialogTitle id="notification-dialog-title">
                            {headerMessage}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="notification-dialog-description">
                                {this.state.bodyMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={this.handleNotificationClose}
                                color="primary"
                                size="small"
                            >
                                ปิด
                        </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            );
        }
    }

    return withRouter(ComponentWithNotification);
}
