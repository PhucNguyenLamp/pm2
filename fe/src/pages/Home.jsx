import { useState, useEffect, useRef } from 'react'
import { socket } from '@/socket/socket'
import Map from '@/components/Map'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import Controls from '@/components/Controls'
import toast from 'react-hot-toast'
import { useLocation, useInsideSafezone, useSafezones } from '@/hooks/useLocation'
import { useQueryClient } from '@tanstack/react-query'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ShieldIcon from '@mui/icons-material/Shield'

function Home() {
  const queryClient = useQueryClient()
  const hasHydratedSafezones = useRef(false)

  const { data: location = { lat: 0, lon: 0 } } = useLocation()
  const { data: safezones = { rectangleSafezone: null, circleSafezone: null } } = useSafezones()
  const { data: safezoneStatus = { inside: true } } = useInsideSafezone()

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

  const isInside = safezoneStatus.inside

  return (
    <Box component="main" sx={{ py: 3 }}>
      {/* Status Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LocationOnIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              Current Location
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
              {Number(lat).toFixed(6)}, {Number(lon).toFixed(6)}
            </Typography>
          </Box>
        </Stack>

        <Chip
          icon={<ShieldIcon />}
          label={isInside ? 'Inside Safe Zone' : 'Outside Safe Zone'}
          color={isInside ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.85rem', py: 2 }}
        />
      </Paper>

      {/* Main Content: Controls + Map */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        <Controls
          mode={mode}
          setMode={setMode}
          rectangle={rectangle}
          setRectangle={setRectangle}
          landmark={landmark}
          setLandmark={setLandmark}
          onResetRectangleAnchor={() => setRectangleAnchor(null)}
        />

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
    </Box>
  )
}

export default Home
