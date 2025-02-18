import React from "react";
import { AppState, Alert, StatusBar } from "react-native";
import { ThemeProvider } from "styled-components";
import { NavigationActions } from "react-navigation";
import { inject, observer, PropTypes } from "mobx-react";
import UserInactivity from "react-native-user-inactivity";
import styled from "styled-components/native";
import stripe from "tipsi-stripe";
import AppNavigationContainer from "./navigation/main.navigator";
import { 
  hasCachedAuthentication,
  requestTouchID,
  removeAuthentication,
} from "./services/authentication";
import { colors } from "./utils/constants";

stripe.setOptions({
  publishableKey: "pk_test_icZtWoaCwbJCemzBqBdTV6Cb", // test key
  // publishableKey: "pk_live_2YK7fEg9qnlrawyTukjyVUs9', // live key
  androidPayMode: "test" // "production"
});

const Root = styled.View`
  flex: 1;
  background-color: ${props => props.theme.WHITE};
`;

@inject("store")
@observer
class RootContainer extends React.Component {
  static propTypes = {
    store: PropTypes.observableObject.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      firstTime: true,
      active: true,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);

    const {
      store: {
        currentUserStore: { apiKey }
      }
    } = this.props;
    if (apiKey) {
      this.showTouchId(false);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState =>{
    if (hasCachedAuthentication() && this.state.appState.match(/background/) && nextAppState === 'active') {
      this.showTouchId(true);
    }

    this.setState({appState: nextAppState});
  }

  componentWillReceiveProps(nextProps) {
    const {
      store: {
        currentUserStore: { apiKey }
      }
    } = this.props;
    const {
      store: { currentUserStore: nextUserStore }
    } = nextProps;

    if (apiKey !== nextUserStore.apiKey && nextUserStore.apiKey) {
      this.showTouchId(false);
    }
  }

  showTouchId = active => {
    const { firstTime } = this.state;

    if (firstTime || active) {
      this.setState({ firstTime: false });

      const onFail = (error) => {
        console.tron.log("TouchID error", error);
        removeAuthentication();
        const navRef = this.navigatorRef;
        navRef.dispatch(
          NavigationActions.navigate({
            routeName: "Authenticating"
          })
        );      
      };

      requestTouchID({ onFail })
    }
  };

  onAction = value => {
    const {
      store: {
        currentUserStore: { apiKey }
      }
    } = this.props;
    const { active } = this.state;

    if (console.tron) {
      // console.tron.log("Active now!", value, apiKey);
    }

    this.setState({
      active: value
    });

    if (active || !apiKey) {
      return false;
    }

    this.showTouchId(value);

    return true;
  };

  render() {
    return (
      <UserInactivity
        timeForInactivity={15 * 60 * 1000}
        onAction={this.onAction}
      >
        <ThemeProvider theme={colors}>
          <Root>
            <StatusBar />
            <AppNavigationContainer 
              ref={navigatorRef => {
                this.navigatorRef = navigatorRef;
              }}
            />
          </Root>
        </ThemeProvider>
      </UserInactivity>
    );
  }
}

export default RootContainer;
