import { useState, useEffect } from 'react'
import { socket } from '@/socket/socket'
import Map from '@/components/Map'
import { Box, Typography } from '@mui/material'
import Controls from '@/components/Controls'

function Home() {
  // get latest location from db using react query
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
    <Box component="main" className="flex flex-row justify-between" >
      <Box>
        <Typography variant="h5" color="text.primary">Current location</Typography>
        <Typography className="coords" color="text.secondary">
          {lat}, {lon}
        </Typography>
        <Controls />
      </Box>
      
      <Map lat={lat} lon={lon} />
    </Box>
  )
}

export default Home
