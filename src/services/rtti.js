import axios from 'axios'
window.axios = axios

const client = axios.create({
  baseURL: '/api/rttiapi/v1'
})

export default {
  async fetchBuses () {
    try {
      const result = await client.get('buses')
      return result.data || []
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
