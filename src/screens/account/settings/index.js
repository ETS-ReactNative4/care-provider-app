/* eslint-disable import/no-unresolved */
import React from "react";
import { inject, observer, PropTypes } from "mobx-react";
import { Avatar } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-picker";
import { removeAuthentication } from "@services/authentication";
import { StyledText } from "../../../components/text";
import { NavHeader } from "../../../components/nav-header";
import { InputButton } from "../../../components/input-button";
import { ServiceButton } from "../../../components/service-button";
import { KeyboardAvoidingView } from "../../../components/views/keyboard-view";

import { HeaderWrapper, ViewCentered, View } from "../../../components/views";
import { ScrollView } from "../../../components/views/scroll-view";
import { colors } from "../../../utils/constants";

const { GREEN, MIDGREY } = colors;
const imgDoctor = require("../../../../assets/images/Doctor.png");

@inject("store")
@observer
class SettingsScreen extends React.Component {
  static propTypes = {
    store: PropTypes.observableObject.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      avatarSource: null
    };
  }

  onAddAvatar = () => {
    const options = {
      title: "Select Profile Picture"
    };

    ImagePicker.showImagePicker(options, response => {
      console.tron.log("Response = ", response);

      if (response.didCancel) {
        console.tron.log("User cancelled image picker");
      } else if (response.error) {
        console.tron.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.tron.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  };

  logOut = () => {
    const {
      navigation: { navigate }
    } = this.props;

    removeAuthentication();

    navigate("AccountSignIn");
  };

  render() {
    const {
      navigation: { navigate },
      store: {
        currentUserStore: {
          firstName,
          lastName,
          email,
          phone,
          address,
          application: { biography, specialties }
        }
      }
    } = this.props;
    const name = `${firstName} ${lastName}`;
    const { avatarSource } = this.state;
    const avatarOptions = avatarSource
      ? {
          source: { uri: avatarSource.uri }
        }
      : {
          // icon: { name: "user", type: "font-awesome" }
          source: imgDoctor
        };

    return (
      <KeyboardAvoidingView enabled>
        <HeaderWrapper>
          <NavHeader
            title="Settings"
            size="medium"
            hasBackButton
            onPressBackButton={() => navigate("AccountDefault")}
          />
        </HeaderWrapper>
        <ScrollView>
          <ViewCentered paddingTop={0}>
            <Avatar
              {...avatarOptions}
              rounded
              size={120}
              showEditButton
              editButton={{
                containerStyle: {
                  backgroundColor: GREEN,
                  borderRadius: 12
                },
                size: 24,
                onPress: this.onAddAvatar
              }}
            />
          </ViewCentered>
          <View>
            <StyledText fontSize={24}>Personal Information</StyledText>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Name"
                value={name}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditName")}
              />
            </View>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Address"
                value={address.street}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditAddress")}
              />
            </View>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Email"
                value={email}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditEmail")}
              />
            </View>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Phone Number"
                value={phone}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditPhoneNumber")}
              />
            </View>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Specialties"
                value={specialties.join(", ")}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditSpecialties")}
              />
            </View>
            <View style={{ padding: 16 }}>
              <InputButton
                label="Short Biography"
                value={biography}
                icon={
                  <FontAwesome name="angle-right" size={24} color={MIDGREY} />
                }
                onPress={() => navigate("AccountEditBio")}
              />
            </View>
          </View>
          <View style={{ marginTop: 32, marginBottom: 32 }}>
            <ServiceButton title="Log Out" onPress={this.logOut} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default SettingsScreen;
