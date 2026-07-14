import DriverCard from "@/components/drivers/driver-card";
import PageHeader from "@/components/ui/page-header";
import { getDrivers } from "@/lib/drivers";

export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <>
      <PageHeader
        title="Drivers"
        description={`${drivers.length} choferes cargados desde BackendCitas.`}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            id={driver.id}
            name={driver.nombre}
            phone={driver.telefono}
            available={driver.disponible}
            latitude={driver.ubicacionLat}
            longitude={driver.ubicacionLng}
          />
        ))}
      </div>
    </>
  );
}
