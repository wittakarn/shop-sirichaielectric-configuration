import * as React from 'react';
import { User } from 'stores/types/User';
import { PageState } from 'stores/types/PageState';
import { connect } from 'react-redux';

interface StateProps {
    loggedInUser: User | null;
}

interface OwnProps {
}

type Props = OwnProps & StateProps;

class HomeComponent extends React.PureComponent<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return this.props.loggedInUser ? <h2>ยินดีต้อนรับ {this.props.loggedInUser.fullName}</h2> : null;
    }
}

const mapStateToProps = (state: PageState): StateProps => ({
    loggedInUser: state.user.loggedInUser,
});

export const Home = connect(mapStateToProps)(HomeComponent);
