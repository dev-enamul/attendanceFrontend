
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecentAttendanceTrendChart = ({ data }) => {
  const chartData = data.slice(-7).map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Present: d.present,
    Absent: d.absent,
    Late: d.late,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Present" fill="#10B981" />
          <Bar dataKey="Absent" fill="#EF4444" />
          <Bar dataKey="Late" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecentAttendanceTrendChart;
