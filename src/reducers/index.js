const initialState = {
  status: 'INIT', // INIT, LOADING, LOADED, ERRORED
  buses: []
}

const store = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_BUSES_START':
      return {
        ...state,
        status: 'LOADING'
      }
    case 'UPDATE_BUSES_SUCCESS':
      return {
        ...state,
        status: 'LOADED'
      }
    case 'UPDATE_BUSES_ERRORED':
      return {
        ...state,
        status: 'ERRORED'
      }
    case 'UPDATE_BUSES':
      return {
        ...state,
        buses: action.buses
      }
    default:
      return state
  }
}

export default store
