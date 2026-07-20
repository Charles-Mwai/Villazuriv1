import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon paths when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom elegant pin for Villa Zuri
const villaIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
        ">
            <div style="
                background: #1a1a1a;
                color: #c8a96e;
                font-family: 'Cantata One', Georgia, serif;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.08em;
                white-space: nowrap;
                padding: 5px 10px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                border: 1px solid #c8a96e55;
            ">VILLA ZURI</div>
            <div style="
                width: 2px;
                height: 10px;
                background: #1a1a1a;
            "></div>
            <div style="
                width: 10px;
                height: 10px;
                background: #c8a96e;
                border-radius: 50%;
                border: 2px solid #1a1a1a;
            "></div>
        </div>
    `,
    iconAnchor: [40, 48],
    popupAnchor: [0, -50],
});

const LocationMap = ({ center, zoom = 15 }) => {
    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
            zoomControl={true}
            scrollWheelZoom={false}
            attributionControl={true}
        >
            {/* OpenStreetMap tile layer — free, no API key */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                maxZoom={19}
            />

            <Marker position={[center.lat, center.lng]} icon={villaIcon}>
                <Popup>
                    <div style={{
                        fontFamily: "'Cantata One', Georgia, serif",
                        textAlign: 'center',
                        padding: '4px 2px',
                        minWidth: '140px',
                    }}>
                        <strong style={{ fontSize: '13px', color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>
                            Villa Zuri
                        </strong>
                        <span style={{ fontSize: '11px', color: '#666', lineHeight: '1.5' }}>
                            Papa Remo Village<br />Watamu, Kenya
                        </span>
                        <br />
                        <a
                            href="https://www.openstreetmap.org/?mlat=-3.3533&mlon=40.0158#map=15/-3.3533/40.0158"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '11px', color: '#c8a96e', marginTop: '6px', display: 'inline-block' }}
                        >
                            Open in Maps ↗
                        </a>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default React.memo(LocationMap);
