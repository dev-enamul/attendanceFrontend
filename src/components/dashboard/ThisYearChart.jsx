
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'];

const ThisYearChart = ({ data }) => {
  const chartData = [
    { name: 'Present', value: data.present },
    { name: 'Absent', value: data.absent },
    { name: 'Off Day', value: data.off_day },
    { name: 'Late', value: data.late },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThisYearChart;
