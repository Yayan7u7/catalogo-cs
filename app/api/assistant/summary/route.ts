import { NextResponse } from "next/server";

import { getDrivers } from "@/lib/drivers";
import { getEmployees } from "@/lib/employees";

export async function GET() {
  const [employees, drivers] = await Promise.all([getEmployees(), getDrivers()]);

  return NextResponse.json({
    employees: {
      total: employees.length,
      available: employees.filter((employee) => employee.disponible).length,
    },
    drivers: {
      total: drivers.length,
      available: drivers.filter((driver) => driver.disponible).length,
    },
  });
}
