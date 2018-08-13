import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import Loader from './components/Loader'

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v9'
const busLocationsData = {}

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
        zoom: 8
      }
    }

    // define refs
    this.appRef = React.createRef()
    this.mapRef = React.createRef()

    this.map = null
  }

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

  mapLoaded () {
    this.setState({ mapLoaded: true })
    this.map = this.mapRef.current &&
      this.mapRef.current.getMap &&
      this.mapRef.current.getMap()
    this.addDataLayer()
  }

  addDataLayer () {
    this.map.addSource('bus-locations', {
      type: 'geojson',
      data: busLocationsData
    })
    this.map.addLayer({
      id: 'bus-locations',
      source: 'bus-locations',
      type: 'symbol',
      layout: {
        'icon-image': '{icon}-15',
        'text-field': '{title}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top'
      }
    })

    this.updateData(this.map)
  }

  updateData (map) {
    function animateMarker (timestamp) {
      map.getSource('bus-locations').setData(busLocationsData)
      window.requestAnimationFrame(animateMarker)
    }

    animateMarker(0)
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
        <div className="App-margin App-header">
          Translink Live
        </div>
        <div className="App-container" ref={this.appRef}>
          <ReactMapGL
            ref={this.mapRef}
            mapStyle={MAP_STYLE}
            {...this.state.viewport}
            mapboxApiAccessToken={TOKEN}
            onViewportChange={(viewport) => this.setState({viewport})}
            onLoad={() => this.mapLoaded()}
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
            <button onClick={this.handleZoomInClick.bind(this)}>Zoom In</button>
            <button onClick={this.handleZoomOutClick.bind(this)}>Zoom Out</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App
