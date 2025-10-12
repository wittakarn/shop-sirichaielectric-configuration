import * as React from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Drawer, Divider, List, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from 'styled-components';
import { TwoLevelMenu } from './TwoLevelMenu';
import { customerMenu, menuMenu, productMenu, quotationMenu, utilityMenu } from './MenuHelper';
import { connect } from 'react-redux';
import { mainStateAction } from 'stores/main/action';
import { PageState } from 'stores/types/PageState';
import { User } from 'stores/types/User';

const MenuAppBar = styled(AppBar) <any>`
    &.MuiAppBar-root{
        transition: ${props => props.open
        ? 'width 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms'
        : 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'};
        width: ${props => props.open ? '60%' : '100%'};

        @media (min-width: 600px){
            width: ${props => props.open ? '85%' : '100%'};
        }
    }
`;
MenuAppBar.displayName = 'MenuAppBar';

const MenuDrawer = styled(Drawer) <any>`
    & .MuiDrawer-paperAnchorLeft{
        text-align: right;

        width: 40%;
        @media (min-width: 600px){
            width: 15%;
        }
    }
`;
MenuDrawer.displayName = 'MenuDrawer';

const MenuBackIconWrapper = styled.div`
    background-color: #3f51b5;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);

    height: 56px;
    @media (min-width: 600px){
        height: 64px;
    }
`;
MenuBackIconWrapper.displayName = 'MenuBackIconWrapper';

const MenuBackIcon = styled(IconButton)`
    &.MuiIconButton-root{
        color: #fff;

        padding: 16px;
        @media (min-width: 600px){
            padding: 20px;
        }
    }
`;
MenuBackIcon.displayName = 'MenuBackIcon';

const MenuIconButton = styled(IconButton) <any>`
    &.MuiButtonBase-root{
        display: ${props => props.open ? 'none' : ''};
    }
`;
MenuIconButton.displayName = 'MenuIconButton';

const SignInInfoIcon = styled(Typography) <any>`
    &.MuiTypography-root{
        flex: 1;
    }
`;
SignInInfoIcon.displayName = 'SignInInfoIcon';

const AccountIcon = styled(AccountCircleIcon) <any>`
    &.MuiSvgIcon-root{
        margin: 0 5px;
        vertical-align: middle;
    }
`;
AccountIcon.displayName = 'AccountIcon';

interface StateProps {
    loggedInUser: User | null;
}

interface DispatchProps {
    clearPageStore: () => void,
}

type Props = MainMenuProps & StateProps & DispatchProps;

const MainMenuComponent: React.FC<Props> = (props: Props) => {

    const menuIcon = props.loggedInUser ? (
        <MenuIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            open={props.isMenuOpen}
            onClick={props.handleDrawerOpen}
        >
            <MenuIcon />
        </MenuIconButton>
    ) : null;

    const signinInfo = props.loggedInUser ? (
        <SignInInfoIcon
            component="div"
            align="right"
            noWrap
        >
            <AccountIcon />
            <Typography
                component="span"
                variant="body1"
                noWrap>
                {props.loggedInUser.fullName}
            </Typography>
        </SignInInfoIcon>
    ) : null;

    const menuItems = props.loggedInUser ? (
        <React.Fragment>
            <MenuBackIconWrapper>
                <MenuBackIcon onClick={props.handleDrawerClose}>
                    <ChevronLeftIcon />
                </MenuBackIcon>
            </MenuBackIconWrapper>
            <Divider />
            <List>
                <TwoLevelMenu {...menuMenu} onLinkClick={props.clearPageStore} />
                <TwoLevelMenu {...productMenu} onLinkClick={props.clearPageStore} />
                {application.quotationAvailable && <TwoLevelMenu {...customerMenu} onLinkClick={props.clearPageStore} />}
                {application.quotationAvailable && <TwoLevelMenu {...quotationMenu} onLinkClick={props.clearPageStore} />}
                <TwoLevelMenu {...utilityMenu} onLinkClick={props.clearPageStore} />
            </List>
        </React.Fragment>
    ) : null;

    return (
        <React.Fragment>
            <CssBaseline />
            <MenuAppBar
                position="fixed"
                open={props.isMenuOpen}
            >
                <Toolbar>
                    {menuIcon}
                    <Typography variant="h6" noWrap>
                        SirichaiElectric configuration
                    </Typography>
                    {signinInfo}
                </Toolbar>
            </MenuAppBar>
            <MenuDrawer
                variant="persistent"
                anchor="left"
                open={props.isMenuOpen}
            >
                {menuItems}
            </MenuDrawer>
        </React.Fragment>
    );
};

const mapStateToProps = (state: PageState): StateProps => ({
    loggedInUser: state.user.loggedInUser,
});

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    clearPageStore: () => dispatch(mainStateAction.clearPageStore),
});

MainMenuComponent.displayName = 'MainMenuComponent';
const MainMenu = connect(mapStateToProps, mapDispatchToProps)(MainMenuComponent);

export { MainMenu };
