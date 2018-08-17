import { connect } from 'react-redux'
import { fetchBuses } from '../actions'
import App from './component'

const mapStateToProps = (state, ownProps) => {
  return {
    busLocations: state.buses.map(bus => {
      return [bus.Longitude, bus.Latitude]
    }),
    isLoading: state.status === 'LOADING'
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchBuses () {
      dispatch(fetchBuses(...arguments))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
