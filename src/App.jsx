import { useState } from 'react';

function App() {
  const [employee, setEmployee] = useState('');
  const [project, setProject] = useState('');
  const [date, setDate] = useState('');
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    let query = [];
    if (employee) query.push(`employee=${employee}`);
    if (project) query.push(`project=${project}`);
    if (date) query.push(`date=${date}`);
    const queryString = query.length ? `?${query.join('&')}` : '';

    const response = await fetch(`http://localhost:3000/logs${queryString}`);
    const data = await response.json();
    setLogs(data);
  };

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        🕓 PDM Time Log Viewer
      </h1>

      {/* Input section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 w-48"
          placeholder="Employee"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded px-3 py-2 w-48"
          placeholder="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchLogs}
        >
          Load Logs
        </button>
      </div>

      {/* Table section */}
      {logs.length > 0 ? (
        <div className="overflow-x-auto shadow border border-gray-300 rounded-lg">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white uppercase text-sm">
                <th className="border border-gray-300 px-4 py-3">Employee</th>
                <th className="border border-gray-300 px-4 py-3">Date</th>
                <th className="border border-gray-300 px-4 py-3">Start Time</th>
                <th className="border border-gray-300 px-4 py-3">End Time</th>
                <th className="border border-gray-300 px-4 py-3">Task</th>
                <th className="border border-gray-300 px-4 py-3">Project</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{log.employee}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.startTime}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.endTime}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.task}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-6 text-center">No logs found.</p>
      )}
    </div>
  );
}

export default App;
