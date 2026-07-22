import { useState } from 'react'
import axios from 'axios'
import { Activity, Server, AlertTriangle, CheckCircle } from 'lucide-react'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  // Simulated live server metrics matching a heavily loaded system
  const currentMetrics = {
    cpu_usage_percent: 78.5,
    ram_usage_percent: 85.0,
    network_io_mbps: 120.5,
    active_connections: 4200,
    error_rate_percent: 0.8
  }

  const runDiagnostics = async () => {
    setPrediction(null)
    setLoading(true)
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', currentMetrics)
      setPrediction(response.data)
    } catch (error) {
      console.error("API Connection Error", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nodex AutoScale Engine</h1>
              <p className="text-slate-400">Live Infrastructure Telemetry</p>
            </div>
          </div>
          <button 
            onClick={runDiagnostics}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
          >
            {loading ? <span>Analyzing...</span> : <span>Run ML Diagnostics</span>}
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Current Metrics Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2" /> Current Node Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Active Connections</span>
                <span className="font-mono">{currentMetrics.active_connections}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">RAM Usage</span>
                <span className="font-mono text-yellow-400">{currentMetrics.ram_usage_percent}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Network I/O</span>
                <span className="font-mono">{currentMetrics.network_io_mbps} Mbps</span>
              </div>
            </div>
          </div>

          {/* AI Prediction Results Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">AI Predictive Analysis</h2>
            
            {!prediction ? (
              <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-700 rounded-lg">
                Waiting for diagnostic run...
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <span className="text-slate-400">Predicted Future Load</span>
                  <span className="text-3xl font-bold font-mono text-white">
                    {prediction.predicted_cpu_load}%
                  </span>
                </div>

                {prediction.trigger_scale_up ? (
                  <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                    <div>
                      <p className="font-bold">Overload Imminent</p>
                      <p className="text-sm opacity-80">Auto-scaling sequence triggered.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <p className="font-bold">System Stable</p>
                      <p className="text-sm opacity-80">No scaling action required.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App