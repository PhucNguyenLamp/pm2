import React, { useMemo } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

export default function Controls({
  mode,
  setMode,
  rectangle,
  setRectangle,
  landmark,
  setLandmark,
  onResetRectangleAnchor,
}) {

  const isRectangleValid = useMemo(() => {
    const n = Number(rectangle.north)
    const s = Number(rectangle.south)
    const e = Number(rectangle.east)
    const w = Number(rectangle.west)

    return [n, s, e, w].every(Number.isFinite) && n > s && e > w
  }, [rectangle])

  const isLandmarkValid = useMemo(() => {
    const lat = Number(landmark.lat)
    const lon = Number(landmark.lon)
    const radius = Number(landmark.radius)
    return Number.isFinite(lat) && Number.isFinite(lon) && radius > 0
  }, [landmark])

  const canSave = mode === 'rectangle' ? isRectangleValid : isLandmarkValid

  const handleModeChange = (_, nextMode) => {
    if (nextMode) {
      setMode(nextMode)
      onResetRectangleAnchor?.()
    }
  }

  const handleSave = () => {
    const payload =
      mode === 'rectangle'
        ? { mode, ...rectangle }
        : { mode, ...landmark, radius: Number(landmark.radius) }

    // TODO: call your API/socket here
    console.log('Saving geofence settings:', payload)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        width: { xs: '100%', md: 420 },
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Safety Zone Controls
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure where your child can move and send these rules to the backend.
          </Typography>
        </Box>

        <ToggleButtonGroup
          exclusive
          fullWidth
          value={mode}
          onChange={handleModeChange}
          size="small"
        >
          <ToggleButton value="rectangle">Rectangle Zone</ToggleButton>
          <ToggleButton value="landmark">Landmark Radius</ToggleButton>
        </ToggleButtonGroup>

        {mode === 'rectangle' && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Safe rectangle boundaries
            </Typography>
            <Alert severity="success">
              Click two points to create, then drag top-left or bottom-right handles. Use the rotate handle to rotate.
            </Alert>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="North latitude"
                value={rectangle.north}
                onChange={(e) => setRectangle((prev) => ({ ...prev, north: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="South latitude"
                value={rectangle.south}
                onChange={(e) => setRectangle((prev) => ({ ...prev, south: e.target.value }))}
                fullWidth
                size="small"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="East longitude"
                value={rectangle.east}
                onChange={(e) => setRectangle((prev) => ({ ...prev, east: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="West longitude"
                value={rectangle.west}
                onChange={(e) => setRectangle((prev) => ({ ...prev, west: e.target.value }))}
                fullWidth
                size="small"
              />
            </Stack>
            {!isRectangleValid && (
              <Alert severity="info">
                Enter valid coordinates where North is greater than South and East is greater than West.
              </Alert>
            )}
          </Stack>
        )}

        {mode === 'landmark' && (
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Landmark center and allowed radius
            </Typography>
            <Alert severity="success">
              Click once to create, then drag the center handle or radius handle on the map.
            </Alert>
            <TextField
              select
              label="Landmark"
              value={landmark.name}
              onChange={(e) => setLandmark((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              size="small"
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="park">Park</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Center latitude"
                value={landmark.lat}
                onChange={(e) => setLandmark((prev) => ({ ...prev, lat: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="Center longitude"
                value={landmark.lon}
                onChange={(e) => setLandmark((prev) => ({ ...prev, lon: e.target.value }))}
                fullWidth
                size="small"
              />
            </Stack>
            <TextField
              label="Radius (meters)"
              type="number"
              value={landmark.radius}
              onChange={(e) => setLandmark((prev) => ({ ...prev, radius: e.target.value }))}
              fullWidth
              size="small"
              inputProps={{ min: 1 }}
            />
            {!isLandmarkValid && (
              <Alert severity="info">
                Enter valid coordinates and a radius greater than 0.
              </Alert>
            )}
          </Stack>
        )}

        <Divider />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="contained"
            fullWidth
            disabled={!canSave}
            onClick={handleSave}
          >
            Save settings
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setRectangle({ north: '', south: '', east: '', west: '', rotation: 0 })
              setLandmark({ name: 'home', lat: '', lon: '', radius: 100 })
              onResetRectangleAnchor?.()
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
