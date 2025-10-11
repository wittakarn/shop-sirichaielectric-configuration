import * as React from 'react';
import styled from 'styled-components';
import { Store } from 'redux';
import { withRouter, Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Container } from '@mui/material';
import { Provider } from 'react-redux';
import { PageState } from 'stores/types/PageState';
import { getStore } from 'stores/getStore';
import { MainMenu } from 'components/Menu/MainMenu';
import { Home } from 'components/HomePage/Home';
import { Login } from 'components/Login/Login';
import { MainMenuManagement } from 'components/Menu/Management/MainMenuManagement';
import { SearchMenu } from 'components/Menu/Management/SearchMenu';
import { SearchProduct } from 'components/Product/SearchProduct';
import { UpdateProduct } from 'components/Product/UpdateProduct';
import { ManageProductGroup } from 'components/Product/Group/ManageGroup';
import { SearchProductGroup } from 'components/Product/Group/SearchGroup';
import { EditProductName } from 'components/Product/EditProductName';
import CustomerManagement from 'components/Customer/CustomerManagement';
import SearchCustomer from 'components/Customer/SearchCustomer';
import SelectCustomer from 'components/Quotation/SelectCustomer';
import CreateQuotation from 'components/Quotation/CreateQuotation';

const MenuContainer = styled(Container)`
    padding-bottom: 64px;
`;
MenuContainer.displayName = 'MenuContainer';

const BodyContainer = styled(Container) <any>`
    padding-top: 2%;
    &.MuiContainer-root{        
        transition: ${props => props.open
        ? 'width 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms'
        : 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'};
        width: ${props => props.open ? '90%' : '100%'};
    }
`;
BodyContainer.displayName = 'BodyContainer';

const PageComponent = withRouter(props => {
    console.log(application.contextRoot);
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path={application.contextRoot} exact={true} component={Home} />
                <Route path={`${application.contextRoot}spa/login/signin`} exact={true} component={Login} />
                <Route path={`${application.contextRoot}spa/customer/management`} exact={true} component={CustomerManagement} />
                <Route path={`${application.contextRoot}spa/customer/search`} exact={true} component={SearchCustomer} />
                <Route path={`${application.contextRoot}spa/menu/management`} exact={true} component={MainMenuManagement} />
                <Route path={`${application.contextRoot}spa/menu/search`} exact={true} component={SearchMenu} />
                <Route path={`${application.contextRoot}spa/product-group/search`} exact={true} component={SearchProductGroup} />
                <Route path={`${application.contextRoot}spa/product-group/management`} exact={true} component={ManageProductGroup} />
                <Route path={`${application.contextRoot}spa/product/search`} exact={true} component={SearchProduct} />
                <Route path={`${application.contextRoot}spa/product/update`} exact={true} component={UpdateProduct} />
                <Route path={`${application.contextRoot}spa/product/edit-product-name`} exact={true} component={EditProductName} />
                <Route path={`${application.contextRoot}spa/quotation/select-customer`} exact={true} component={SelectCustomer} />
                <Route path={`${application.contextRoot}spa/quotation/create`} exact={true} component={CreateQuotation} />
            </Switch>
        </React.Suspense>
    );
})

interface OwnProps {

}

interface State {
    isMenuOpen: boolean;
}

type Props = OwnProps;

class BaseLayoutComponent extends React.PureComponent<Props, State> {
    static displayName = 'BaseLayout';
    private store: Store<PageState>;
    constructor(props: Props) {
        super(props);
        this.store = getStore();
        this.state = {
            isMenuOpen: false,
        };
    }

    setOpen = (isMenuOpen: boolean) => {
        this.setState({
            isMenuOpen
        });
    }

    handleDrawerOpen = () => {
        this.setOpen(true);
    };

    handleDrawerClose = () => {
        this.setOpen(false);
    };

    render() {

        const menuProps: MainMenuProps = {
            handleDrawerOpen: this.handleDrawerOpen,
            handleDrawerClose: this.handleDrawerClose,
            isMenuOpen: this.state.isMenuOpen,
        }

        return (
            <Container>
                <Provider store={this.store}>
                    <BrowserRouter>
                        <Switch>
                            <Route>
                                <MenuContainer>
                                    <MainMenu {...menuProps} />
                                </MenuContainer>
                                <BodyContainer open={this.state.isMenuOpen}>
                                    <PageComponent />
                                </BodyContainer>
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </Container>
        );
    }
}

export const BaseLayout = BaseLayoutComponent;