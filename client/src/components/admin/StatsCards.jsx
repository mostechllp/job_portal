import React from "react";
import {
  BriefcaseIcon,
  UsersIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from "lucide-react";
export function StatsCards({ stats }) {
  const cards = [
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: BriefcaseIcon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: UsersIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "New Today",
      value: stats.newToday,
      icon: UserPlusIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Hired",
      value: stats.hired,
      icon: CheckCircleIcon,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}
            >
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
