export const SYNC_CURRENT_TIME = (state) => {
  state.currentTime = Date.now();
};

export const SET_USERDATA = (state, userData) => {
  state.userData = userData;
};
