/* eslint-disable no-console */
/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import { Alert, Linking } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { CheckBox } from "react-native-elements";
import stripe from "tipsi-stripe";
import { inject, observer, PropTypes } from "mobx-react";
import { FormTextInput, StyledText } from "../../../components/text";
import { NavHeader } from "../../../components/nav-header";
import { ServiceButton } from "../../../components/service-button";
import { FormWrapper } from "../../../components/views";
import { FormInputView } from "../../../components/views/keyboard-view";
import { KeyboardScrollView } from "../../../components/views/keyboard-scroll-view";
import { colors } from "../../../utils/constants";

import { createBankAccountProvider, updateCareProvider } from "../../../services/opear-api";
import { DeeplinkHandler } from "@components/deeplink-handler";

const { BLUE } = colors;

@inject("store")
@observer
class EditBankScreen extends React.Component {
  propTypes = {
    store: PropTypes.observableObject.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      accountNumber: "",
      routingNumber: "",
      loading: false,
      acceptedStripeTOS: false
    };
  }

  saveBankHandler = async () => {
    const {
      navigation: { goBack },
      store: { currentUserStore }
    } = this.props;
    const { id } = currentUserStore;
    const { accountNumber, routingNumber, acceptedStripeTOS } = this.state;

    if (!acceptedStripeTOS) {
      return Alert.alert("Error", "Please review the Stripe Terms of Service.");
    }

    const params = {
      accountNumber,
      routingNumber,
      countryCode: "us",
      currency: "usd",
      accountHolderType: "individual",
      // eslint-disable-next-line prettier/prettier
      accountHolderName: `${currentUserStore.first_name} ${
        currentUserStore.last_name
      }`
    };
    this.setState({ loading: true });
    try {
      const token = await stripe.createTokenWithBankAccount(params);
      createBankAccountProvider(
        id,
        {
          payout_account: {
            token_id: token.tokenId
          }
        },
        res => {
          currentUserStore.setPayoutAccount(res.data);
          this.setState({ loading: false });

          console.tron.log("createBankAccountProvider succeeded");
          goBack();
        },
        () => {
          this.setState({ loading: false });
        }
      );
    } catch (e) {
      console.tron.log("error with validating bank account with Stripe: ", e);
      this.setState({ loading: false });

      return Alert.alert(
        "Bank Account Error",
        "There was an error validating your bank account information. Please try again."
      );
    }

    const data = {
      care_provider: {
        accepted_stripe_tos: acceptedStripeTOS
      }
    };

    const successHandler = () => {
      currentUserStore.setAcceptedStripeTOS(true);
    };

    const errorHandler = err => {
      Alert.alert(
        "Error",
        "There was an error saving your bank account information. Please try again."
      );

      console.tron.log("Error saving bank account:", err);
    };

    return updateCareProvider(id, data, { successHandler, errorHandler });
  };

  render() {
    const {
      navigation: { goBack }
    } = this.props;
    const {
      accountNumber,
      routingNumber,
      loading,
      acceptedStripeTOS
    } = this.state;
    return (
      <KeyboardScrollView padding={16}>
        <DeeplinkHandler navigation={this.props.navigation}/>
        <NavHeader
          title="Edit bank"
          size="medium"
          hasBackButton
          onPressBackButton={() => goBack()}
        />
        <FormWrapper>
          <FormInputView>
            <FormTextInput
              label="Routing Number"
              placeholder="110000000"
              value={routingNumber}
              keyboardType="number-pad"
              onChangeText={value => this.setState({ routingNumber: value })}
            />
          </FormInputView>
          <FormInputView>
            <FormTextInput
              label="Account Number"
              leftIcon={<FontAwesome name="bank" size={30} color={BLUE} />}
              placeholder="000123456789"
              value={accountNumber}
              keyboardType="number-pad"
              onChangeText={value => this.setState({ accountNumber: value })}
            />
          </FormInputView>
          <FormInputView>
            <StyledText
              style={{
                fontSize: 16,
                color: colors.BLACK60
              }}
            >
              By adding your account, you agree to the{" "}
              <StyledText
                style={{
                  color: colors.BLUE,
                  textDecorationLine: "underline",
                  textDecorationColor: colors.BLUE,
                  fontSize: 16
                }}
                onPress={() =>
                  Linking.openURL(
                    "https://www.stripe.com/connect-account/legal"
                  )
                }
              >
                Stripe Connected Account Agreement
              </StyledText>
              .
            </StyledText>
            <CheckBox
              title="I have read and accept"
              checked={acceptedStripeTOS}
              onPress={() => {
                this.setState({
                  acceptedStripeTOS: !acceptedStripeTOS
                });
              }}
              size={36}
              textStyle={{ fontSize: 18 }}
              containerStyle={{
                backgroundColor: colors.WHITE,
                borderColor: colors.WHITE,
                paddingLeft: 0,
                marginLeft: 0
              }}
              checkedIcon="check-square"
              uncheckedIcon="square-o"
              checkedColor={colors.SEAFOAMBLUE}
            />
          </FormInputView>
          <FormInputView>
            <ServiceButton
              title="Save Bank"
              onPress={async () => {
                await this.saveBankHandler();
              }}
              loading={loading}
            />
          </FormInputView>
        </FormWrapper>
      </KeyboardScrollView>
    );
  }
}

export default EditBankScreen;
