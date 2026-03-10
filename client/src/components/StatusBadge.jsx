import React from 'react';

export function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Applied':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Interview':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Offer':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>

      {status}
    </span>);

}