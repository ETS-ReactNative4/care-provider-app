/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React from "react";
import { inject, observer, PropTypes as MobXPropTypes } from "mobx-react";
import { withNavigation } from "react-navigation";
import { StyledText } from "@components/text";
import { ContainerView, View, ContentWrapper } from "@components/views";
import { ScrollView } from "@components/views/scroll-view";
import { VisitDetailCard } from "@components/cards";
import { colors } from "@utils/constants";
import { DeeplinkHandler } from "@components/deeplink-handler";

const imgFox = require("../../../assets/images/Fox.png");

@inject("store")
@observer
class PastVisitsScreen extends React.Component {
  static propTypes = {
    store: MobXPropTypes.observableObject.isRequired
  };

  render() {
    const {
      navigation: { navigate },
      store: { visitsStore }
    } = this.props;

    const visits = visitsStore.visits
      .filter(v => v.state === "completed")
      .sort(
        (a, b) => new Date(b.appointment_time) - new Date(a.appointment_time)
      );

    const visitsDisplayStack = [];
    const addedTimes = [];
    const dayOptions = { month: "long", day: "numeric" };
    const timeOptions = { day: undefined, hour: "numeric", minute: "2-digit" };

    visits.map(visit => {
      const { appointment_time } = visit;
      const dateAsObject = new Date(appointment_time);
      const dateDay = dateAsObject.toLocaleString("en-US", dayOptions);
      if (!addedTimes.includes(dateDay)) {
        addedTimes.push(dateDay);
        visitsDisplayStack.push(
          <StyledText key={dateDay} fontSize={16} color={colors.BLACK60}>
            {dateDay}
          </StyledText>
        );
      }

      const formattedTime = dateAsObject
        .toLocaleDateString("en-US", timeOptions)
        .split(", ");

      const childName = visit.child.first_name
        ? `${visit.child.first_name} ${visit.child.last_name}`
        : "N/A";

      return visitsDisplayStack.push(
        <View key={`visit-detail-wrapper-${visit.id}`} style={{ marginBottom: 9 }}>
          <VisitDetailCard
            key={`visit-detail-${visit.id}`}
            avatarImg={imgFox}
            name={childName}
            illness={visit.reason}
            time={formattedTime[1]}
            address={{ street: visit.address.street }}
            onPress={() =>
              navigate("VisitsVisitDetails", {
                visitID: visit.id
              })
            }
          />
        </View>
      );
    });

    return (
      <ContainerView style={{ marginTop: 0 }}>
        <DeeplinkHandler navigation={this.props.navigation}/>
        <ScrollView padding={0}>
          <View style={{ paddingTop: 24 }}>
            <ContentWrapper>{visitsDisplayStack}</ContentWrapper>
          </View>
        </ScrollView>
      </ContainerView>
    );
  }
}

export default withNavigation(PastVisitsScreen);
