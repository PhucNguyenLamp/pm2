import { Box } from '@mui/material'
import { useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import L from 'leaflet'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import {
    Circle,
    MapContainer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet'

const M_PER_DEG_LAT = 110540
const MIN_HALF_SIDE_M = 5

const personIcon = L.divIcon({
    html: renderToString(<PersonPinIcon style={{ color: '#d97706', fontSize: '40px', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.4))' }} />),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
})

const rotateIcon = L.divIcon({
    html: renderToString(<RotateRightIcon style={{ color: '#2563eb', fontSize: '28px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', padding: '2px' }} />),
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
})

const toRadians = (deg) => (deg * Math.PI) / 180
const toDegrees = (rad) => (rad * 180) / Math.PI

const metersPerDegLon = (lat) => {
    const value = 111320 * Math.cos(toRadians(lat))
    return Math.abs(value) > 1e-6 ? value : 1e-6
}

const normalizeAngle = (angleDeg) => {
    let next = angleDeg
    while (next > 180) next -= 360
    while (next <= -180) next += 360
    return next
}

const rotateVector = (x, y, angleRad) => {
    const cosA = Math.cos(angleRad)
    const sinA = Math.sin(angleRad)
    return {
        x: x * cosA - y * sinA,
        y: x * sinA + y * cosA,
    }
}

const toXY = (lat, lon, refLat) => ({
    x: lon * metersPerDegLon(refLat),
    y: lat * M_PER_DEG_LAT,
})

const fromXY = (x, y, refLat) => ({
    lat: y / M_PER_DEG_LAT,
    lon: x / metersPerDegLon(refLat),
})

const buildRectangleModel = (rectangle) => {
    const north = Number(rectangle?.north)
    const south = Number(rectangle?.south)
    const east = Number(rectangle?.east)
    const west = Number(rectangle?.west)

    if (![north, south, east, west].every(Number.isFinite) || north < south || east < west) {
        return null
    }

    const centerLat = (north + south) / 2
    const centerLon = (east + west) / 2
    const mLon = metersPerDegLon(centerLat)
    const halfWidthM = Math.max(((east - west) * mLon) / 2, MIN_HALF_SIDE_M)
    const halfHeightM = Math.max(((north - south) * M_PER_DEG_LAT) / 2, MIN_HALF_SIDE_M)
    const angleDeg = Number(rectangle?.rotation) || 0

    return {
        centerLat,
        centerLon,
        halfWidthM,
        halfHeightM,
        angleDeg,
    }
}

const getLocalPoint = (model, localX, localY) => {
    const rotated = rotateVector(localX, localY, toRadians(model.angleDeg))
    const mLon = metersPerDegLon(model.centerLat)
    return [
        model.centerLat + rotated.y / M_PER_DEG_LAT,
        model.centerLon + rotated.x / mLon,
    ]
}

const buildRectangleVisual = (model) => {
    const topLeft = getLocalPoint(model, -model.halfWidthM, model.halfHeightM)
    const topRight = getLocalPoint(model, model.halfWidthM, model.halfHeightM)
    const bottomRight = getLocalPoint(model, model.halfWidthM, -model.halfHeightM)
    const bottomLeft = getLocalPoint(model, -model.halfWidthM, -model.halfHeightM)

    const rotateHandleDistance = Math.max(model.halfHeightM * 0.35, 40)
    const topMid = getLocalPoint(model, 0, model.halfHeightM)
    const rotateHandle = getLocalPoint(model, 0, model.halfHeightM + rotateHandleDistance)

    return {
        corners: [topLeft, topRight, bottomRight, bottomLeft],
        topLeft,
        bottomRight,
        topMid,
        rotateHandle,
    }
}

const modelToRectanglePayload = (centerLat, centerLon, halfWidthM, halfHeightM, angleDeg) => {
    const mLon = metersPerDegLon(centerLat)
    return {
        north: (centerLat + halfHeightM / M_PER_DEG_LAT).toFixed(6),
        south: (centerLat - halfHeightM / M_PER_DEG_LAT).toFixed(6),
        east: (centerLon + halfWidthM / mLon).toFixed(6),
        west: (centerLon - halfWidthM / mLon).toFixed(6),
        rotation: normalizeAngle(angleDeg),
    }
}

const updateRectangleFromDiagonal = (topLeft, bottomRight, angleDeg) => {
    const refLat = (topLeft.lat + bottomRight.lat) / 2
    const pTL = toXY(topLeft.lat, topLeft.lng, refLat)
    const pBR = toXY(bottomRight.lat, bottomRight.lng, refLat)

    const d = {
        x: pTL.x - pBR.x,
        y: pTL.y - pBR.y,
    }

    const angleRad = toRadians(angleDeg)
    const u = { x: Math.cos(angleRad), y: Math.sin(angleRad) }
    const v = { x: -Math.sin(angleRad), y: Math.cos(angleRad) }

    const halfWidthM = Math.max(Math.abs((d.x * u.x + d.y * u.y) / 2), MIN_HALF_SIDE_M)
    const halfHeightM = Math.max(Math.abs((d.x * v.x + d.y * v.y) / 2), MIN_HALF_SIDE_M)

    const centerXY = {
        x: (pTL.x + pBR.x) / 2,
        y: (pTL.y + pBR.y) / 2,
    }
    const center = fromXY(centerXY.x, centerXY.y, refLat)

    return modelToRectanglePayload(center.lat, center.lon, halfWidthM, halfHeightM, angleDeg)
}

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

function MapClickSelector({ onPickPoint }) {
    useMapEvents({
        click: (event) => {
            onPickPoint?.(event.latlng)
        },
    })

    return null
}

export default function Map({
    lat,
    lon,
    mode,
    rectangle,
    landmark,
    onPickPoint,
    onRectangleChange,
    onLandmarkChange,
}) {
    const parsedLat = Number(lat)
    const parsedLon = Number(lon)
    const rectangleModel = buildRectangleModel(rectangle)
    const rectangleVisual = rectangleModel ? buildRectangleVisual(rectangleModel) : null
    const hasRectangle = Boolean(rectangleModel)

    const centerLat = Number(landmark?.lat)
    const centerLon = Number(landmark?.lon)
    const radius = Number(landmark?.radius)
    const hasLandmark =
        Number.isFinite(centerLat) && Number.isFinite(centerLon) && Number.isFinite(radius) && radius > 0

    const circleHandle = hasLandmark
        ? [
            centerLat,
            centerLon + radius / metersPerDegLon(centerLat),
        ]
        : null

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
                <MapClickSelector onPickPoint={onPickPoint} />
                <RecenterOnLocation lat={parsedLat} lon={parsedLon} />
                <Marker position={[parsedLat, parsedLon]} icon={personIcon}>
                    <Popup>Live GPS point</Popup>
                </Marker>

                {mode === 'rectangle' && hasRectangle && rectangleVisual && (
                    <>
                        <Polygon
                            positions={rectangleVisual.corners}
                            pathOptions={{ color: '#2563eb', fillOpacity: 0.12, weight: 2 }}
                        />

                        <Polyline
                            positions={[rectangleVisual.topMid, rectangleVisual.rotateHandle]}
                            pathOptions={{ color: '#2563eb', weight: 1.5, dashArray: '4 4' }}
                        />

                        <Marker
                            position={rectangleVisual.topLeft}
                            draggable
                            eventHandlers={{
                                dragend: (event) => {
                                    const dragged = event.target.getLatLng()
                                    const fixed = {
                                        lat: rectangleVisual.bottomRight[0],
                                        lng: rectangleVisual.bottomRight[1],
                                    }
                                    const payload = updateRectangleFromDiagonal(
                                        { lat: dragged.lat, lng: dragged.lng },
                                        fixed,
                                        rectangleModel.angleDeg,
                                    )
                                    onRectangleChange?.(payload)
                                },
                            }}
                        >
                            <Popup>Top-left handle</Popup>
                        </Marker>

                        <Marker
                            position={rectangleVisual.bottomRight}
                            draggable
                            eventHandlers={{
                                dragend: (event) => {
                                    const dragged = event.target.getLatLng()
                                    const fixed = {
                                        lat: rectangleVisual.topLeft[0],
                                        lng: rectangleVisual.topLeft[1],
                                    }
                                    const payload = updateRectangleFromDiagonal(
                                        fixed,
                                        { lat: dragged.lat, lng: dragged.lng },
                                        rectangleModel.angleDeg,
                                    )
                                    onRectangleChange?.(payload)
                                },
                            }}
                        >
                            <Popup>Bottom-right handle</Popup>
                        </Marker>

                        <Marker
                            position={rectangleVisual.rotateHandle}
                            draggable
                            icon={rotateIcon}
                            eventHandlers={{
                                dragend: (event) => {
                                    const dragged = event.target.getLatLng()
                                    const dx = (dragged.lng - rectangleModel.centerLon) * metersPerDegLon(rectangleModel.centerLat)
                                    const dy = (dragged.lat - rectangleModel.centerLat) * M_PER_DEG_LAT
                                    const angleDeg = normalizeAngle(toDegrees(Math.atan2(dy, dx)) - 90)
                                    onRectangleChange?.({ rotation: angleDeg })
                                },
                            }}
                        >
                            <Popup>Rotate handle</Popup>
                        </Marker>
                    </>
                )}

                {mode === 'landmark' && hasLandmark && (
                    <>
                        <Circle
                            center={[centerLat, centerLon]}
                            radius={radius}
                            pathOptions={{ color: '#16a34a', fillOpacity: 0.14, weight: 2 }}
                        />
                        <Marker
                            position={[centerLat, centerLon]}
                            draggable
                            eventHandlers={{
                                dragend: (event) => {
                                    const next = event.target.getLatLng()
                                    onLandmarkChange?.({
                                        lat: next.lat.toFixed(6),
                                        lon: next.lng.toFixed(6),
                                    })
                                },
                            }}
                        >
                            <Popup>Landmark center</Popup>
                        </Marker>

                        {circleHandle && (
                            <Marker
                                position={circleHandle}
                                draggable
                                eventHandlers={{
                                    dragend: (event) => {
                                        const next = event.target.getLatLng()
                                        const dx = (next.lng - centerLon) * metersPerDegLon(centerLat)
                                        const dy = (next.lat - centerLat) * M_PER_DEG_LAT
                                        const nextRadius = Math.max(Math.sqrt(dx * dx + dy * dy), 5)
                                        onLandmarkChange?.({ radius: Math.round(nextRadius) })
                                    },
                                }}
                            >
                                <Popup>Radius handle</Popup>
                            </Marker>
                        )}
                    </>
                )}
            </MapContainer>
        </Box>
    )
}
