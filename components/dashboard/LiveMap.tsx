"use client";

import type { Driver, Employee } from "@/lib/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type Props = {
  employees: Employee[];
  drivers: Driver[];
};

function toPosition(lat?: string | null, lng?: string | null) {
  if (!lat || !lng) return null;

  const position: [number, number] = [Number(lat), Number(lng)];

  if (Number.isNaN(position[0]) || Number.isNaN(position[1])) {
    return null;
  }

  return position;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LiveMap({ employees, drivers }: Props) {
  const driverIcon = L.divIcon({
    html: `
    <div style="
    background:#22c55e;
    width:18px;
    height:18px;
    border-radius:999px;
    border:3px solid white;
    ">
    </div>
    `,
    className: "",
  });

  const employeeIcon = L.divIcon({
    html: `
    <div style="
    background:#a855f7;
    width:18px;
    height:18px;
    border-radius:999px;
    border:3px solid white;
    ">
    </div>
    `,
    className: "",
  });
  const driverMarkers = drivers
    .map((driver) => ({
      ...driver,
      position: toPosition(driver.ubicacionLat, driver.ubicacionLng),
    }))
    .filter(
      (driver): driver is typeof driver & { position: [number, number] } =>
        Boolean(driver.position),
    );
  const employeeMarkers = employees
    .map((employee) => ({
      ...employee,
      position: toPosition(employee.ubicacionLat, employee.ubicacionLng),
    }))
    .filter(
      (employee): employee is typeof employee & { position: [number, number] } =>
        Boolean(employee.position),
    );
  const center =
    driverMarkers[0]?.position ??
    employeeMarkers[0]?.position ??
    ([20.5235, -100.8157] as [number, number]);

  return (
    <div className="h-[550px] overflow-hidden rounded-2xl border border-zinc-800">
      <MapContainer
        center={center}
        zoom={13}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterMap center={center} />

        {driverMarkers.map((driver) => (
          <Marker key={driver.id} position={driver.position} icon={driverIcon}>
            <Popup>
              Driver
              <br />
              {driver.nombre}
            </Popup>
          </Marker>
        ))}

        {employeeMarkers.map((employee) => (
          <Marker
            key={employee.id}
            position={employee.position}
            icon={employeeIcon}
          >
            <Popup>
              Employee
              <br />
              {employee.nombreArtistico}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
