import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function App() {
  const [employee, setEmployee] = useState('');
  const [project, setProject] = useState('');
  const [date, setDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState('table'); // NEW: tab state

  const fetchLogs = async () => {
    let query = [];
    if (employee) query.push(`employee=${employee}`);
    if (project) query.push(`project=${project}`);
    if (date) query.push(`date=${date}`);
    const queryString = query.length ? `?${query.join('&')}` : '';

    const response = await fetch(`https://pdm-time-parsero.onrender.com/logs${queryString}`);
    const data = await response.json();
    setLogs(data);
  };

  // Utility: Calculate hours from time strings
  const calculateHours = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh + em / 60) - (sh + sm / 60);
  };

  // Summarize hours by employee
  const hoursByEmployee = logs.reduce((acc, log) => {
    const hours = calculateHours(log.startTime, log.endTime);
    acc[log.employee] = (acc[log.employee] || 0) + hours;
    return acc;
  }, {});
  const employeeChartData = Object.entries(hoursByEmployee).map(([name, hours]) => ({ name, hours }));

  // Summarize hours by project
  const hoursByProject = logs.reduce((acc, log) => {
    const hours = calculateHours(log.startTime, log.endTime);
    acc[log.project] = (acc[log.project] || 0) + hours;
    return acc;
  }, {});
  const projectChartData = Object.entries(hoursByProject).map(([name, hours]) => ({ name, hours }));

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">🕓 PDM Time Log Viewer</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="border rounded px-3 py-2 w-48" placeholder="Employee" value={employee} onChange={(e) => setEmployee(e.target.value)} />
        <input className="border rounded px-3 py-2 w-48" placeholder="Project" value={project} onChange={(e) => setProject(e.target.value)} />
        <input type="date" className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={fetchLogs}>Load Logs</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => exportToCSV()}>Export CSV</button>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <button onClick={() => setTab('table')} className={`mr-4 px-4 py-2 rounded ${tab === 'table' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Table</button>
        <button onClick={() => setTab('charts')} className={`px-4 py-2 rounded ${tab === 'charts' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Charts</button>
      </div>

      {/* Conditional content */}
      {tab === 'table' ? (
        logs.length > 0 ? (
          <div className="overflow-x-auto shadow border rounded-lg">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-blue-600 text-white uppercase text-sm">
                <tr>
                  <th className="border px-4 py-3">Employee</th>
                  <th className="border px-4 py-3">Date</th>
                  <th className="border px-4 py-3">Start</th>
                  <th className="border px-4 py-3">End</th>
                  <th className="border px-4 py-3">Task</th>
                  <th className="border px-4 py-3">Project</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{log.employee}</td>
                    <td className="border px-4 py-2">{log.date}</td>
                    <td className="border px-4 py-2">{log.startTime}</td>
                    <td className="border px-4 py-2">{log.endTime}</td>
                    <td className="border px-4 py-2">{log.task}</td>
                    <td className="border px-4 py-2">{log.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-600 mt-6 text-center">No logs found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Hours by Employee</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-2">Hours by Project</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
