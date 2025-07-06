'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxRoute({ source, destination }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!source || !destination || !mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [source.lng, source.lat],
      zoom: 10,
    });

    map.on('load', () => {
      const bounds = new mapboxgl.LngLatBounds();

      // Source marker + label
      const sourceEl = document.createElement('div');
      sourceEl.innerHTML = `<div class="text-xs bg-green-600 text-white px-2 py-1 rounded shadow">Source</div>`;
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat([source.lng, source.lat])
        .setPopup(new mapboxgl.Popup().setText('Source'))
        .addTo(map);

      new mapboxgl.Marker({ element: sourceEl })
        .setLngLat([source.lng, source.lat])
        .addTo(map);

      // Destination marker + label
      const destEl = document.createElement('div');
      destEl.innerHTML = `<div class="text-xs bg-red-600 text-white px-2 py-1 rounded shadow">Destination</div>`;
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([destination.lng, destination.lat])
        .setPopup(new mapboxgl.Popup().setText('Destination'))
        .addTo(map);

      new mapboxgl.Marker({ element: destEl })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map);

      bounds.extend([source.lng, source.lat]);
      bounds.extend([destination.lng, destination.lat]);
      map.fitBounds(bounds, { padding: 80 });
    });

    return () => map.remove();
  }, [source, destination]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] mt-4 rounded-xl border shadow-sm"
    />
  );
}
