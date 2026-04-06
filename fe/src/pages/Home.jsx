import { useState, useEffect } from 'react'
import { socket } from '@/socket/socket'
import Map from '@/components/Map'
import { Box, Typography } from '@mui/material'
import Controls from '@/components/Controls'

function Home() {
  // get latest location from db using react query
  const [location, setLocation] = useState({ lat: 0, lon: 0 })
  const [mode, setMode] = useState('rectangle')
  const [rectangle, setRectangle] = useState({
    north: '',
    south: '',
    east: '',
    west: '',
    rotation: 0,
  })
  const [rectangleAnchor, setRectangleAnchor] = useState(null)
  const [landmark, setLandmark] = useState({
    name: 'home',
    lat: '',
    lon: '',
    radius: 100,
  })

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

  const onMapPickPoint = ({ lat: pickedLat, lng: pickedLon }) => {
    if (mode === 'landmark') {
      setLandmark((prev) => ({
        ...prev,
        lat: pickedLat.toFixed(6),
        lon: pickedLon.toFixed(6),
      }))
      return
    }

    if (!rectangleAnchor) {
      setRectangleAnchor({ lat: pickedLat, lon: pickedLon })
      setRectangle({
        north: pickedLat.toFixed(6),
        south: pickedLat.toFixed(6),
        east: pickedLon.toFixed(6),
        west: pickedLon.toFixed(6),
        rotation: 0,
      })
      return
    }

    const north = Math.max(rectangleAnchor.lat, pickedLat)
    const south = Math.min(rectangleAnchor.lat, pickedLat)
    const east = Math.max(rectangleAnchor.lon, pickedLon)
    const west = Math.min(rectangleAnchor.lon, pickedLon)

    setRectangle({
      north: north.toFixed(6),
      south: south.toFixed(6),
      east: east.toFixed(6),
      west: west.toFixed(6),
      rotation: Number(rectangle.rotation) || 0,
    })
    setRectangleAnchor(null)
  }

  const onRectangleChange = (nextRectangle) => {
    setRectangle((prev) => ({
      ...prev,
      ...nextRectangle,
      rotation: Number.isFinite(Number(nextRectangle.rotation))
        ? Number(nextRectangle.rotation)
        : Number(prev.rotation) || 0,
    }))
  }

  const onLandmarkChange = (nextLandmark) => {
    setLandmark((prev) => ({ ...prev, ...nextLandmark }))
  }

  return (
    <Box component="main" className="flex flex-row gap-2 justify-between" >
      <Box>
        <Typography variant="h5" color="text.primary">Current location</Typography>
        <Typography className="coords" color="text.secondary">
          {lat}, {lon}
        </Typography>
        <Controls
          mode={mode}
          setMode={setMode}
          rectangle={rectangle}
          setRectangle={setRectangle}
          landmark={landmark}
          setLandmark={setLandmark}
          onResetRectangleAnchor={() => setRectangleAnchor(null)}
        />
      </Box>

      <Map
        lat={lat}
        lon={lon}
        mode={mode}
        rectangle={rectangle}
        landmark={landmark}
        onPickPoint={onMapPickPoint}
        onRectangleChange={onRectangleChange}
        onLandmarkChange={onLandmarkChange}
      />
    </Box>
  )
}

export default Home
