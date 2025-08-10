import { useState } from 'react'
import Dashboard from './components/Dashboard'
import FootprintScanner from './components/FootprintScanner'
import Login from './components/Login'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('login')
  const [user, setUser] = useState(null)
  const [scanResults, setScanResults] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView('dashboard')
  }

  const handleScanComplete = (results) => {
    setScanResults(results)
    setCurrentView('results')
  }

  const handleLogout = () => {
    setUser(null)
    setScanResults(null)
    setCurrentView('login')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            👻 GhostGuardian
          </h1>
          {user && (
            <div className="header-actions">
              <span className="user-welcome">Welcome, {user.name}!</span>
              <button 
                className="nav-btn"
                onClick={() => setCurrentView('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className="nav-btn"
                onClick={() => setCurrentView('scanner')}
              >
                Scan
              </button>
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === 'login' && (
          <Login onLogin={handleLogin} />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            user={user}
            onStartScan={() => setCurrentView('scanner')}
            scanResults={scanResults}
          />
        )}
        
        {currentView === 'scanner' && (
          <FootprintScanner 
            user={user}
            onScanComplete={handleScanComplete}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'results' && scanResults && (
          <div className="results-container">
            <div className="results-header">
              <h2>🔍 Scan Results</h2>
              <button 
                className="back-btn"
                onClick={() => setCurrentView('dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="risk-overview">
              <div className={`risk-score risk-${scanResults.riskLevel?.toLowerCase()}`}>
                <h3>Privacy Risk: {scanResults.riskLevel}</h3>
                <div className="risk-number">{scanResults.riskScore}/100</div>
              </div>
            </div>

            <div className="findings-section">
              <h3>🚨 Findings ({scanResults.findings?.length || 0})</h3>
              {scanResults.findings?.map((finding, index) => (
                <div key={index} className="finding-item">
                  {finding}
                </div>
              ))}
            </div>

            <div className="recommendations-section">
              <h3>💡 Recommendations</h3>
              {scanResults.recommendations?.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  {rec}
                </div>
              ))}
            </div>

            <div className="details-section">
              {scanResults.breaches?.length > 0 && (
                <div className="detail-card">
                  <h4>Data Breaches Found</h4>
                  <p>{scanResults.breaches.length} breach(es) found</p>
                </div>
              )}
              
              {scanResults.gravatar?.exists && (
                <div className="detail-card">
                  <h4>Gravatar Profile</h4>
                  <img src={scanResults.gravatar.imageUrl} alt="Profile" width="100" />
                  <p>Public profile found</p>
                </div>
              )}
              
              {scanResults.ipInfo?.city && (
                <div className="detail-card">
                  <h4>Location Data</h4>
                  <p>{scanResults.ipInfo.city}, {scanResults.ipInfo.region}</p>
                  <p>ISP: {scanResults.ipInfo.org}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

