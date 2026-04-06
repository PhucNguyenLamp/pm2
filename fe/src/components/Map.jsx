import { Box } from '@mui/material'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

function RecenterOnLocation({ lat, lon }) {
    const map = useMap()

    useEffect(() => {
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return
        }

        map.setView([lat, lon], map.getZoom(), { animate: true })
    }, [lat, lon, map])

    return null
}

export default function Map({ lat, lon }) {
    const parsedLat = Number(lat)
    const parsedLon = Number(lon)

    return (
        <Box
            className="map-card border-2 border-white"
            sx={{
                width: { xs: '100%', md: 'min(900px, 68vw)' },
                minWidth: { md: 520 },
                height: { xs: 360, md: 520 },
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <MapContainer
                center={[parsedLat, parsedLon]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterOnLocation lat={parsedLat} lon={parsedLon} />
                <Marker position={[parsedLat, parsedLon]}>
                    <Popup>Live GPS point</Popup>
                </Marker>
            </MapContainer>
        </Box>
    )
}
