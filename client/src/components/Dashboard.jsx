import { useState, useEffect } from 'react'

function Dashboard({ user, onStartScan, scanResults }) {
  const [stats, setStats] = useState({
    totalScans: 0,
    lastScan: null,
    riskLevel: 'Unknown'
  })

  useEffect(() => {
    // Update stats when scan results change
    if (scanResults) {
      setStats({
        totalScans: stats.totalScans + 1,
        lastScan: new Date().toLocaleString(),
        riskLevel: scanResults.riskLevel || 'Unknown'
      })
    }
  }, [scanResults])

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return '#ff4444'
      case 'medium': return '#ffaa00'
      case 'low': return '#44aa44'
      case 'minimal': return '#00aa44'
      default: return '#666666'
    }
  }

  const getQuickTips = () => {
    return [
      "🔒 Use unique passwords for each account",
      "📱 Enable two-factor authentication",
      "🌐 Review privacy settings regularly",
      "🔄 Update software and apps frequently",
      "👀 Monitor your online presence"
    ]
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🏠 Privacy Dashboard</h2>
        <p>Monitor and protect your digital footprint</p>
      </div>

      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="dashboard-card stats-card">
          <h3>📊 Your Privacy Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalScans}</div>
              <div className="stat-label">Total Scans</div>
            </div>
            <div className="stat-item">
              <div 
                className="stat-number"
                style={{ color: getRiskColor(stats.riskLevel) }}
              >
                {stats.riskLevel}
              </div>
              <div className="stat-label">Current Risk</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {stats.lastScan ? '✅' : '❓'}
              </div>
              <div className="stat-label">Last Scan</div>
            </div>
          </div>
        </div>

        {/* Scan Action */}
        <div className="dashboard-card scan-card">
          <h3>🔍 Start New Scan</h3>
          <p>Discover what information is publicly available about you</p>
          <button 
            className="scan-button"
            onClick={onStartScan}
          >
            🚀 Run Privacy Scan
          </button>
          <small>Scans email: {user.email}</small>
        </div>

        {/* Recent Results */}
        {scanResults && (
          <div className="dashboard-card results-card">
            <h3>📋 Latest Scan Results</h3>
            <div className="result-summary">
              <div className="result-score">
                <span className="score-label">Privacy Score:</span>
                <span 
                  className="score-value"
                  style={{ color: getRiskColor(scanResults.riskLevel) }}
                >
                  {100 - (scanResults.riskScore || 0)}/100
                </span>
              </div>
              <div className="result-findings">
                <strong>Findings:</strong> {scanResults.findings?.length || 0} issues found
              </div>
              <div className="result-time">
                Scanned: {stats.lastScan}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tips */}
        <div className="dashboard-card tips-card">
          <h3>💡 Privacy Tips</h3>
          <ul className="tips-list">
            {getQuickTips().map((tip, index) => (
              <li key={index} className="tip-item">{tip}</li>
            ))}
          </ul>
        </div>

        {/* Profile Info */}
        <div className="dashboard-card profile-card">
          <h3>👤 Profile Information</h3>
          <div className="profile-info">
            <div className="profile-item">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="profile-item">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="profile-item">
              <strong>Joined:</strong> {user.joinedDate}
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="dashboard-card security-card">
          <h3>🛡️ Security Status</h3>
          <div className="security-items">
            <div className="security-item">
              <span className="security-icon">🔍</span>
              <span>Breach Monitoring: Active</span>
            </div>
            <div className="security-item">
              <span className="security-icon">🌐</span>
              <span>Profile Scanning: Enabled</span>
            </div>
            <div className="security-item">
              <span className="security-icon">📍</span>
              <span>Location Tracking: Detected</span>
            </div>
            <div className="security-item">
              <span className="security-icon">🔒</span>
              <span>Privacy Mode: Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard