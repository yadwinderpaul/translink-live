import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import Loader from './components/Loader'

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v9'
const INIT_GEO_JSON = {
  type: 'FeatureCollection',
  features: []
}
const POLLING_INTERVAL_IN_SECONDS = 10

function mapCoordinatesToGeoJson (coordinates = []) {
  return {
    type: 'FeatureCollection',
    features: coordinates.map(coordinate => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            coordinate.longitude,
            coordinate.latitude
          ]
        }
      }
    })
  }
}

class App extends Component {
  constructor (props) {
    super(props)

    // define state
    this.state = {
      mapLoaded: false,
      viewport: {
        visible: false,
        width: 400,
        height: 400,
        latitude: 49.2577143,
        longitude: -123.1939437,
        zoom: 12
      }
    }

    // define refs
    this.appRef = React.createRef()
    this.mapRef = React.createRef()

    this.map = null
  }

  /**
   * make map full screen
   * when component mounted on dom
   */
  componentDidMount () {
    const node = this.appRef.current || {}
    const width = node.scrollWidth || 400
    const height = node.scrollHeight || 400
    this.setState({
      viewport: {
        ...this.state.viewport,
        width,
        height,
        visible: true
      }
    })
  }

  /**
   * update map with latest data
   * when busCoordinates updatedAt changes
   */
  componentDidUpdate (prevProps) {
    if (this.props.updatedAt !== prevProps.updatedAt) {
      if (this.map) {
        const newGeoJson = mapCoordinatesToGeoJson(this.props.busCoordinates)
        this.map.getSource('bus-locations').setData(newGeoJson)
      }
    }
  }

  _getStatusText () {
    const time = this.props.updatedAt.toLocaleString().split(', ')[1]
    let text = `Updated At: ${time}`
    if (this.props.status === 'INIT') {
      text = 'Initializing...'
    } else if (this.props.status === 'LOADING') {
      text = 'Getting Data...'
    } else if (this.props.status === 'ERRORED') {
      text = 'Error in Updating...'
    }
    return text
  }

  /**
   * called when visible map tiles are loaded
   */
  handleMapLoad () {
    this.setState({ mapLoaded: true })

    // save reference to map instance
    this.map = this.mapRef.current &&
      this.mapRef.current.getMap &&
      this.mapRef.current.getMap()

    // add geojson data layer
    this.map.addSource('bus-locations', {
      type: 'geojson',
      data: INIT_GEO_JSON
    })
    this.map.addLayer({
      id: 'bus-locations',
      source: 'bus-locations',
      type: 'symbol',
      layout: { 'icon-image': 'bus-11' }
    })

    // start data polling
    this._updateBusLocations()
  }

  async _updateBusLocations () {
    await this.props.fetchBuses()
    if (this.props.status !== 'ERRORED') {
      setTimeout(() => {
        this._updateBusLocations()
      }, POLLING_INTERVAL_IN_SECONDS * 1000)
    }
  }

  handleRetryClick (event) {
    this._updateBusLocations()
  }

  handleZoomInClick (event) {
    const zoom = this.state.viewport.zoom
    this.setState({
      viewport: {
        ...this.state.viewport,
        zoom: (zoom < 19) ? zoom + 1 : 20
      }
    })
  }

  handleZoomOutClick (event) {
    const zoom = this.state.viewport.zoom
    this.setState({
      viewport: {
        ...this.state.viewport,
        zoom: (zoom > 4) ? zoom - 1 : 4
      }
    })
  }

  render () {
    return (
      <div className="App">
        <div className="App-margin header">
          <div className="title">
            Translink Live
          </div>
          <div className="info">
            {this._getStatusText()}
            {
              this.props.status === 'ERRORED'
                ? <button
                  className="ml-10"
                  onClick={this.handleRetryClick.bind(this)}>
                  Retry
                </button>
                : ''
            }
          </div>
        </div>
        <div className="App-container" ref={this.appRef}>
          <ReactMapGL
            ref={this.mapRef}
            mapStyle={MAP_STYLE}
            {...this.state.viewport}
            mapboxApiAccessToken={TOKEN}
            onViewportChange={(viewport) => this.setState({viewport})}
            onLoad={() => this.handleMapLoad()}
          />
          {
            !this.state.mapLoaded
              ? <div className="overlay">
                <Loader />
              </div> : ''
          }
        </div>
        <div className="App-margin">
          <div className="button-group">
            <button onClick={this.handleZoomInClick.bind(this)}>
              Zoom In
            </button>
            <button onClick={this.handleZoomOutClick.bind(this)}>
              Zoom Out
            </button>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  busCoordinates: PropTypes.array,
  updatedAt: PropTypes.instanceOf(Date),
  status: PropTypes.string,
  fetchBuses: PropTypes.func
}

export default App
