import { connect } from 'react-redux'
import { fetchBuses } from '../actions'
import App from './component'

const mapStateToProps = (state, ownProps) => {
  return {
    busCoordinates: state.buses.map(bus => {
      return {
        latitude: bus.Latitude,
        longitude: bus.Longitude
      }
    }),
    updatedAt: state.updatedAt,
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
