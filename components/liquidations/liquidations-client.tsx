"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getLiquidationsRecords, getEmployeesAndUsers } from "@/app/admin/liquidations/actions";
import { calculateCutReport, getStartAndEndOfWeek } from "@/lib/calculations";
import PageHeader from "@/components/ui/page-header";
import WeekSelector from "./week-selector";
import LiquidationSummary from "./liquidation-summary";
import LiquidationBreakdown from "./liquidation-breakdown";
import CutComparison from "./cut-comparison";
import DebtManager from "./debt-manager";

export default function LiquidationsClient() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeekRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { start, end } = getStartAndEndOfWeek(currentDate);
      
      const [recs, usr] = await Promise.all([
        getLiquidationsRecords(start.toISOString(), end.toISOString()),
        getEmployeesAndUsers(),
      ]);
      
      setRecords(recs || []);
      setUsers(usr || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchWeekRecords();
  }, [fetchWeekRecords]);

  // Group employees
  const employeeGroups = useMemo(() => {
    if (!users || !records) return [];

    const activeNames = new Set(
      records.filter((r) => r.nombre_empleada).map((r) => r.nombre_empleada),
    );

    const allEmps = users.filter((u) => u.rol === "empleada");
    const jefes = users.filter((u) => u.rol === "jefe" && u.estado !== "inactivo");

    const groups: Record<string, any> = {};
    jefes.forEach((jefe) => {
      groups[jefe.id] = {
        id: jefe.id,
        name: `👤 ${jefe.nombre}`,
        employees: [],
      };
    });
    groups["sin_asignar"] = { id: "sin_asignar", name: "📋 Sin Asignar", employees: [] };

    allEmps.forEach((emp) => {
      const hasActivity = activeNames.has(emp.nombre);
      if (!hasActivity) return; // Only show active

      const jefesDeEsta = emp.jefes_asignados || [];
      const isShared = jefesDeEsta.length > 1;
      const empData = { name: emp.nombre, hasActivity, isShared };

      if (jefesDeEsta.length > 0) {
        jefesDeEsta.forEach((j: any) => {
          if (groups[j.jefe_id]) {
            groups[j.jefe_id].employees.push(empData);
          }
        });
      } else {
        groups["sin_asignar"].employees.push(empData);
      }
    });

    return Object.values(groups).filter((g) => g.employees.length > 0);
  }, [users, records]);

  useEffect(() => {
    if (selectedEmployee && records.length > 0) {
      const data = calculateCutReport(records, selectedEmployee);
      setReport(data);
    } else {
      setReport(null);
    }
  }, [selectedEmployee, records]);

  const changeWeek = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  const selectedEmployeeData = users.find((u) => u.nombre === selectedEmployee);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <PageHeader title="Liquidaciones (Cortes)" description="Gestión financiera unificada" />
        {loading && <span className="text-sm text-brand-gold animate-pulse">Actualizando...</span>}
      </div>

      <div className="flex justify-center w-full">
        <WeekSelector
          currentDate={currentDate}
          onPrev={() => changeWeek(-7)}
          onNext={() => changeWeek(7)}
        />
      </div>

      {!loading && (
        <div className="space-y-6">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-md">
            <h3 className="text-zinc-400 font-medium text-sm mb-4">SELECCIONA EMPLEADA (ACTIVAS ESTA SEMANA)</h3>
            <div className="flex flex-wrap gap-2">
              {employeeGroups.map((group, idx) => (
                <div key={idx} className="flex gap-2 items-center mr-4">
                  <span className="text-xs text-brand-gold font-semibold uppercase">{group.name}:</span>
                  {group.employees.map((emp: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEmployee(emp.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        selectedEmployee === emp.name
                          ? "bg-brand-gold text-black border-brand-gold"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-brand-gold/50"
                      }`}
                    >
                      {emp.name} {emp.isShared && "🔄"}
                    </button>
                  ))}
                </div>
              ))}
              {employeeGroups.length === 0 && <span className="text-zinc-500 text-sm">No hay actividad esta semana.</span>}
            </div>
          </div>

          {report && selectedEmployeeData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CutComparison
                    report={report}
                    records={records.filter((r) => r.nombre_empleada === selectedEmployee)}
                  />
                </div>
                <div className="space-y-6">
                  <LiquidationSummary
                    cut={report.finalCut}
                    employeeName={selectedEmployee}
                  />
                  <LiquidationBreakdown cut={report.finalCut} />
                </div>
              </div>

              <div className="mt-12">
                <DebtManager employeeId={selectedEmployeeData.id} employeeName={selectedEmployee} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
