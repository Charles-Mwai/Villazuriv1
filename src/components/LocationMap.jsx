import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

// Luxury B&W / Minimalist Map Style
const defaultMapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#bdbdbd" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#dadada" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#c9c9c9" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        }
    ]
};

const LocationMap = ({ center, zoom = 14 }) => {
    // Falls back to a placeholder loading state if no key is present ultimately
    // But we need to supply *some* string to avoid immediate crash if env is missing
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const options = useMemo(() => defaultMapOptions, []);

    if (loadError) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eee',
                color: '#666',
                fontFamily: 'sans-serif',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div>
                    <p>Map cannot be loaded right now.</p>
                    <small>Check API Key configuration.</small>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{ width: '100%', height: '100%', background: '#eee' }} />
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={options}
        >
            <Marker position={center} title="Villa Zuri" />
        </GoogleMap>
    );
};

export default React.memo(LocationMap);
