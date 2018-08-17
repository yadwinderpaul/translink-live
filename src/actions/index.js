import rtti from '../services/rtti'

export function updateBusesStart () {
  return {
    type: 'UPDATE_BUSES_START'
  }
}

export function updateBusesSuccess (results) {
  return {
    type: 'UPDATE_BUSES_SUCCESS'
  }
}

export function updateBusesErrored () {
  return {
    type: 'UPDATE_BUSES_ERRORED'
  }
}

export function updateBuses (buses) {
  return {
    type: 'UPDATE_BUSES', buses
  }
}

export function fetchBuses () {
  return async function (dispatch) {
    try {
      dispatch(updateBusesStart())
      const buses = await rtti.fetchBuses()
      dispatch(updateBuses(buses))
      dispatch(updateBusesSuccess())
    } catch (error) {
      dispatch(updateBusesErrored())
    }
  }
}
