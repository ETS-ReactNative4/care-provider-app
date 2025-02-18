import React, { Component } from "react";
import ReactPropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Alert, Modal } from "react-native";
import MapView from "react-native-maps";
import haversine from "haversine";
import { updateVisit } from "@services/opear-api";
import {
  ModalWrapper,
  ViewCentered,
  ContentWrapper,
  View,
  FlexView
} from "../../../components/views";
import { StyledText } from "../../../components/text";
import { VisitDetailCard } from "../../../components/cards";
import { ModalButton } from "../../../components/modal-button";
import { colors } from "../../../utils/constants";
import { GoogleMapsService } from "@services";
import { ScrollView } from "@components/views/scroll-view";

const imgDog = require("../../../../assets/images/Dog.png");

@inject("store")
@observer
class RequestVisitModalComponent extends Component {

  state = {
    visit: null,
    modalVisible: false,
    distance: "-",
    region: null,
    userInfo: null,
    loading: false
  };

  static propTypes = {
    onAccept: ReactPropTypes.func.isRequired,
    onCancel: ReactPropTypes.func.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalVisible !== prevState.modalVisible) {
      return { modalVisible: nextProps.modalVisible,
        visit: nextProps.visit,
        userInfo: nextProps.userInfo,
        region: nextProps.region,
        distance: nextProps.distance };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.state.visit && (!this.state.region || !this.state.region.loaded) && !this.state.loading) {
      this.setState({ loading: true });
      this.getVisitGeoInfo();
    }
  }

  onRegionChange = region => {
    this.setState({ region });
  };

  getVisitGeoInfo = () => {
    const {
      visit: { address }
    } = this.state;
    if (address) {

      GoogleMapsService.getGeo(
        `${address.street} ,${address.city}${
        address.state ? `, ${address.state}` : ""
        }`,
        innerRes => {
          const { data } = innerRes;
          if (data && data.results && data.results[0].geometry) {
            const { lat, lng } = data.results[0].geometry.location;
            this.setState({
              region: {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.09,
                longitudeDelta: 0.09
              },
              loaded: true
            });
          } else {
            this.setState({
              region: null
            });
          }
        },
        () => {
          this.setState({
            region: null
          });
        }
      );

      const { userInfo } = this.state;

      GoogleMapsService.getGeo(
        `${userInfo.address.street} ,${userInfo.address.city}${
        userInfo.address.state ? `, ${userInfo.address.state} ${userInfo.address.zip}` : ""
        }`,
        innerRes => {
          const { data } = innerRes;
          const { region } = this.state;
          if (data && data.results && data.results[0].geometry) {
            const { lat, lng } = data.results[0].geometry.location;

            const fromCoordinate = {
              latitude: lat,
              longitude: lng
            };

            const toCoordinate = {
              latitude: region.latitude,
              longitude: region.longitude
            };

            const distance =
              (haversine(fromCoordinate, toCoordinate, {
                unit: "mile"
              }) || 0
              ).toFixed(2);

            this.setState({ distance: `${distance} miles away` });
          }
        });
    }

  };

  accept = () => {
    const { onAccept } = this.props;
    const {
      visit: { id }
    } = this.state;

    const successHandler = () => onAccept();
    // TODO: move this to a secure and specific endpoint like /visit/{id}/accept
    updateVisit(id, { state: "scheduled" }, { successHandler });
  };

  close = () => {
    const { onCancel } = this.props;
    const {
      visit: { id }
    } = this.state;

    const successHandler = () => onCancel();
    // TODO: move this to a secure and specific endpoint like /visit/{id}/cancel
    updateVisit(id, { state: "pending" }, { successHandler });
  };

  render() {
    const { modalVisible, distance, region } = this.state;

    if (!modalVisible) return null;

    const {
      visit: {
        name,
        illness,
        symptoms,
        time,
        allergies,
        parentNotes,
        address,
        date
      }
    } = this.state;

    return (
      <Modal animationType="slide" transparent={false}>
        <ModalWrapper>
          <ScrollView>
            <ViewCentered paddingTop={16} paddingBottom={16}>
              <StyledText
                fontSize={24}
                fontFamily="FlamaMedium"
                color={colors.BLACK87}
              >
                {"Request: "}
                {illness}
              </StyledText>
              {distance && (
                <StyledText fontSize={14} color={colors.MIDGREY}>
                  {distance}
                </StyledText>
              )}
            </ViewCentered>
            {region && (
              <MapView
                style={{ alignSelf: "stretch", height: 160 }}
                initialRegion={region}
                region={region}
                onRegionChange={this.onRegionChange}
              />
            )}
            <View style={{ paddingTop: 32, paddingBottom: 16 }}>
              <VisitDetailCard
                avatarImg={imgDog}
                name={name}
                illness={illness}
                time={time}
                address={address}
              />
            </View>
            <ContentWrapper>
              <View style={{ marginTop: 8 }}>
                <FlexView
                  justifyContent="start"
                  style={{ paddingTop: 6, paddingBottom: 6 }}
                >
                  <View style={{ width: 100 }}>
                    <StyledText fontSize={14} fontFamily="FlamaMedium">
                      Date
                    </StyledText>
                  </View>
                  <StyledText fontSize={14}>{date ? date : "-"}</StyledText>
                </FlexView>
                <FlexView
                  justifyContent="start"
                  style={{ paddingTop: 6, paddingBottom: 6 }}
                >
                  <View style={{ width: 100 }}>
                    <StyledText fontSize={14} fontFamily="FlamaMedium">
                      Allergies
                    </StyledText>
                  </View>
                  <StyledText fontSize={14}>{allergies || "-"}</StyledText>
                </FlexView>
                <FlexView
                  justifyContent="start"
                  style={{
                    paddingTop: 6,
                    paddingBottom: 12,
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <StyledText fontSize={14} fontFamily="FlamaMedium">
                      Other
                    </StyledText>
                  </View>
                  <StyledText
                    fontSize={14}
                    style={{ flexWrap: "wrap", flex: 2 }}
                  >
                    {parentNotes || "-"}
                  </StyledText>
                </FlexView>
                <FlexView
                  justifyContent="start"
                  style={{
                    paddingTop: 6,
                    paddingBottom: 12,
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <StyledText fontSize={14} fontFamily="FlamaMedium">
                      Visit Reason
                    </StyledText>
                  </View>
                  <StyledText
                    fontSize={14}
                    style={{ flexWrap: "wrap", flex: 2 }}
                  >
                    {symptoms.length ? symptoms.join(", ") : "-"}
                  </StyledText>
                </FlexView>
              </View>
            </ContentWrapper>
          </ScrollView>
          <FlexView>
            <ModalButton label="Accept" pos="left" onPress={this.accept} />
            <ModalButton
              label="Decline"
              pos="right"
              reversed
              onPress={this.close}
            />
          </FlexView>
        </ModalWrapper>
      </Modal>
    );
  }
}

export default RequestVisitModalComponent;
