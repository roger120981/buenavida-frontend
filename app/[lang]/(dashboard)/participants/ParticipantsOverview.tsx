"use client";

import { Docs, DocsCheck, DocsArrow } from "@/components/svg";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import AreaChart from "./area-chart";
import { useState, useEffect } from "react";
import { Participant } from "@/lib/types/participants";

const ParticipantsOverview = ({ data }: { data: Participant[] }) => {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    // Calcular métricas basadas en los datos
    const totalParticipants = data.length;
    const activeParticipants = data.filter((p) => p.isActive).length;
    const inactiveParticipants = totalParticipants - activeParticipants;
    // Simulación de cambio mensual (puedes ajustar con datos reales de createdAt)
    const changePercentage = 5; // Porcentaje simulado

    const statsData = [
      {
        id: 1,
        title: "Total Participants",
        amount: totalParticipants,
        percentage: changePercentage,
        icon: <Docs className="w-4 h-4 text-primary-foreground" />,
        isUp: true,
        color: "primary",
        series: [{ data: [80, 90, 100, 95, 100, 100] }],
      },
      {
        id: 2,
        title: "Active Participants",
        amount: activeParticipants,
        percentage: changePercentage,
        icon: <DocsCheck className="w-4 h-4 text-primary-foreground" />,
        isUp: true,
        color: "success",
        series: [{ data: [70, 80, 80, 75, 80, 80] }],
      },
      {
        id: 3,
        title: "Inactive Participants",
        amount: inactiveParticipants,
        percentage: changePercentage,
        icon: <DocsArrow className="w-4 h-4 text-warning" />,
        isUp: false,
        color: "warning",
        series: [{ data: [10, 10, 20, 20, 20, 20] }],
      },
    ];

    setStats(statsData);
  }, [data]);

  return (
    <div className="mb-8"> {/* Margen inferior para separar de la tabla */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Participants Overview</h2> {/* Título dentro del contenedor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item) => (
            <div
              key={`participant-stats-${item.id}`}
              className={cn(
                "rounded-lg p-4 w-full shadow-md", // Bordes redondeados y sombra
                {
                  "bg-blue-50": item.color === "primary",
                  "bg-green-50": item.color === "success",
                  "bg-orange-50": item.color === "warning",
                  "bg-red-50": item.color === "destructive",
                }
              )}
            >
              <div className="flex gap-2">
                <div className="flex-1 text-sm font-medium text-gray-800">
                  {item.title}
                </div>
                <div
                  className={cn(
                    "flex-none h-7 w-7 rounded-sm flex justify-center items-center",
                    {
                      "bg-blue-500": item.color === "primary",
                      "bg-green-500": item.color === "success",
                      "bg-orange-500": item.color === "warning",
                      "bg-red-500": item.color === "destructive",
                    }
                  )}
                >
                  {item.icon}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="mt-2">
                    <div
                      className={cn({
                        "text-blue-600": item.color === "primary",
                        "text-green-600": item.color === "success",
                        "text-orange-600": item.color === "warning",
                        "text-red-600": item.color === "destructive",
                      })}
                    >
                      <span className="text-2xl font-semibold">{item.amount}</span>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span
                        className={cn("text-sm font-medium flex items-center", {
                          "text-blue-600": item.color === "primary",
                          "text-green-600": item.color === "success",
                          "text-orange-600": item.color === "warning",
                          "text-red-600": item.color === "destructive",
                        })}
                      >
                        {item.isUp ? "+" : "-"}
                        {item.percentage}%
                        {item.isUp ? (
                          <Icon
                            icon="heroicons:arrow-trending-up"
                            className="w-3.5 h-3.5"
                          />
                        ) : (
                          <Icon
                            icon="heroicons:arrow-trending-down"
                            className="w-3.5 h-3.5"
                          />
                        )}
                      </span>
                      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                        than last month
                      </span>
                    </div>
                  </div>
                </div>
                <div className="self-end flex-none w-[70px]">
                  <AreaChart series={item.series} color={item.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsOverview;