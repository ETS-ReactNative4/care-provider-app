/* eslint-disable no-param-reassign */
import { types } from "mobx-state-tree";
import { OnboardingData } from "./onboarding";

export const ProviderStore = types
  .model("ProviderStore", {
    appointment: types.boolean,
    readyProviders: types.boolean,
    outstandingAppointment: types.boolean,
    completeApplication: types.boolean,
    arrived: types.boolean,
    active: types.boolean,
    onboardingData: types.optional(OnboardingData, {
      email: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      password: "",
      bankToken: ""
      // facebook_uid: ""
    })
  })
  .actions(self => ({
    setAppointment(value) {
      self.appointment = value;
    },
    setReadyProviders(value) {
      self.readyProviders = value;
    },
    setOutstandingAppointment(value) {
      self.outstandingAppointment = value;
    },
    setCompleteApplication(value) {
      self.completeApplication = value;
    },
    setArrived(value) {
      self.arrived = value;
    },
    setActive(value) {
      self.active = value;
    }
  }));
