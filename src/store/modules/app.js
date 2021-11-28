export default {
  state() {
    return {
      isActivation: true,
    };
  },
  mutations: {
    setIsActivation(state, status) {
      state.isActivation = status;
    },
  },
};
