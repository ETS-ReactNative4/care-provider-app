import { createStackNavigator } from "react-navigation";
import AccountScreen from "../screens/account";
import SettingsScreen from "../screens/account/settings";
import EditNameScreen from "../screens/account/edit-name";
import EditEmailScreen from "../screens/account/edit-email";
import EditAddressScreen from "../screens/account/edit-address";
import EditPhoneNumberScreen from "../screens/account/edit-phonenumber";
import PayoutsScreen from "../screens/account/payouts";
import EditCardScreen from "../screens/account/edit-card";
import EditBankScreen from "../screens/account/edit-bank";
import AddBankScreen from "../screens/account/add-bank";
import UpdateApplicationScreen from "../screens/account/update-application";
import ScanCardScreen from "../screens/account/scan-card";
import SignInScreen from "../screens/auth/signin";
import ForgotPwdScreen from "../screens/auth/forgotPwd";
import NewPwdScreen from "../screens/auth/enterNewPwd";

const AccountNavigator = createStackNavigator(
  {
    AccountDefault: {
      screen: AccountScreen
    },
    AccountSettings: {
      screen: SettingsScreen
    },
    AccountEditName: {
      screen: EditNameScreen
    },
    AccountEditEmail: {
      screen: EditEmailScreen
    },
    AccountEditAddress: {
      screen: EditAddressScreen
    },
    AccountEditPhoneNumber: {
      screen: EditPhoneNumberScreen
    },
    AccountPayouts: {
      screen: PayoutsScreen
    },
    AccountEditCard: {
      screen: EditCardScreen
    },
    AccountEditBank: {
      screen: EditBankScreen
    },
    AccountAddBank: {
      screen: AddBankScreen
    },
    AccountUpdateApplication: {
      screen: UpdateApplicationScreen
    },
    AccountScanCard: {
      screen: ScanCardScreen
    },
    AccountSignIn: {
      screen: SignInScreen
    },
    AccountForgotPwd: {
      screen: ForgotPwdScreen
    },
    AccountNewPwd: {
      screen: NewPwdScreen
    }
  },
  {
    initialRouteName: "AccountDefault",
    headerMode: "none",
    defaultNavigationOptions: {
      headerBackTitle: null
    }
  }
);

export default AccountNavigator;
