import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import Loader from './components/Loader'

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN

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
    this.appContainer = React.createRef()
  }

  componentDidMount () {
    const node = this.appContainer.current || {}
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
        zoom: (zoom > 6) ? zoom - 1 : 6
      }
    })
  }

  render () {
    return (
      <div className="App">
        <div className="App-margin App-header">
          Spare Labs
        </div>
        <div className="App-container" ref={this.appContainer}>
          <ReactMapGL
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
