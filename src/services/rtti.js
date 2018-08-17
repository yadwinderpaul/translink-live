import axios from 'axios'
window.axios = axios

const APIKEY = process.env.REACT_APP_RTTI_APIKEY
const client = axios.create({
  baseURL: 'https://api.translink.ca/rttiapi/v1/',
  timeout: 10000,
  params: { apikey: APIKEY },
  headers: { 'Accept': 'application/json' }
})

export default {
  async fetchBuses () {
    try {
      const buses = await client.get('buses')
      return buses
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.error('Error while getting buses', error.response.data)
      } else {
        console.error('Error while performing buses request', error.message)
      }
      throw error
    }
  }
}
