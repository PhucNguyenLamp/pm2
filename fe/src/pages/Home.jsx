import { useState, useEffect, useRef } from 'react'
import { socket } from '@/socket/socket'
import Map from '@/components/Map'
import { Box, Typography } from '@mui/material'
import Controls from '@/components/Controls'
import toast from 'react-hot-toast'
import { useLocation, useSafezones } from '@/hooks/useLocation'
import { useQueryClient } from '@tanstack/react-query'
function Home() {
  const queryClient = useQueryClient()
  const hasHydratedSafezones = useRef(false)
  // get latest location from db using react query
  // const [location, setLocation] = useState({ lat: 0, lon: 0 })
  const { data: location = { lat: 0, lon: 0 } } = useLocation();
  const { data: safezones = { rectangleSafezone: null, circleSafezone: null } } = useSafezones();
  const rectangleSafezone = safezones.rectangleSafezone
  const circleSafezone = safezones.circleSafezone

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
    if (hasHydratedSafezones.current) {
      return
    }

    if (rectangleSafezone || circleSafezone) {
      if (rectangleSafezone) {
        setRectangle({
          north: String(rectangleSafezone.north ?? ''),
          south: String(rectangleSafezone.south ?? ''),
          east: String(rectangleSafezone.east ?? ''),
          west: String(rectangleSafezone.west ?? ''),
          rotation: Number(rectangleSafezone.rotation) || 0,
        })
      }

      if (circleSafezone) {
        setLandmark((prev) => ({
          ...prev,
          lat: String(circleSafezone.lat ?? ''),
          lon: String(circleSafezone.lon ?? ''),
          radius: Number(circleSafezone.radius) || prev.radius,
        }))
      }

      hasHydratedSafezones.current = true
    }
  }, [circleSafezone, rectangleSafezone])

  useEffect(() => {
    const onLocation = (loc) => {
      queryClient.setQueryData(['location'], loc)
    }
    socket.on('location', onLocation) // update

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
