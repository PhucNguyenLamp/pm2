import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket/socket'
import Map from './components/Map'

function App() {
  const [location, setLocation] = useState({ lat: 0, lon: 0 })
  const { lat, lon } = location
  useEffect(() => {
    const onLocation = (loc) => {
      setLocation(loc)
      console.log('Received location:', loc)
    }
    socket.on('location', onLocation) // mốt fetch từ database. tạm thời là lấy trực tiếp từ backend luôn
    return () => {
      socket.off('location', onLocation)
    }
  }, [])

  return (
    <main className="map-page">
      <h1>Current location</h1>
      <p className="coords">
        {lat}, {lon}
      </p>

      <Map lat={lat} lon={lon} />
    </main>
  )
}

export default App
