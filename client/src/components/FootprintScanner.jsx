import { useState } from 'react'
import axios from 'axios'

function FootprintScanner({ user, onScanComplete, onBack }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [scanData, setScanData] = useState({
    email: user.email,
    domain: '',
    ip: '',
    includeIP: true
  })

  const scanSteps = [
    'Initializing scan...',
    'Checking data breaches...',
    'Scanning Gravatar profiles...',
    'Analyzing IP information...',
    'Searching online mentions...',
    'Calculating risk score...',
    'Generating recommendations...',
    'Scan complete!'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setScanData({
      ...scanData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const startScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    try {
      // Simulate progressive scanning
      for (let i = 0; i < scanSteps.length; i++) {
        setCurrentStep(scanSteps[i])
        setScanProgress(((i + 1) / scanSteps.length) * 100)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Get user's IP if needed
      let userIP = scanData.ip
      if (scanData.includeIP && !userIP) {
        try {
          const ipResponse = await axios.get('https://api.ipify.org?format=json')
          userIP = ipResponse.data.ip
        } catch (err) {
          console.log('Could not get IP:', err.message)
        }
      }

      // Prepare scan payload
      const scanPayload = {
        email: scanData.email,
        domain: scanData.domain || null,
        ip: userIP || null
      }

      // Call backend API
      const response = await axios.post('http://localhost:5000/api/footprint/scan', scanPayload)
      
      if (response.data.success) {
        onScanComplete(response.data.data)
      } else {
        throw new Error('Scan failed')
      }

    } catch (error) {
      console.error('Scan error:', error)
      alert('Scan failed: ' + error.message)
      setIsScanning(false)
      setScanProgress(0)
    }
  }

  const extractDomainFromEmail = (email) => {
    return email.split('@')[1] || ''
  }

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2>🔍 Digital Footprint Scanner</h2>
        <p>Comprehensive analysis of your online presence</p>
      </div>

      {!isScanning ? (
        <div className="scanner-form">
          <div className="form-section">
            <h3>📧 Email Analysis</h3>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={scanData.email}
                onChange={handleInputChange}
                placeholder="Enter email to scan"
              />
              <small>We'll check for data breaches and public profiles</small>
            </div>
          </div>

          <div className="form-section">
            <h3>🌐 Domain Analysis (Optional)</h3>
            <div className="form-group">
              <label>Company/Organization Domain</label>
              <input
                type="text"
                name="domain"
                value={scanData.domain}
                onChange={handleInputChange}
                placeholder={`e.g., ${extractDomainFromEmail(scanData.email)}`}
              />
              <small>Find associated email addresses and company info</small>
            </div>
          </div>

          <div className="form-section">
            <h3>📍 Location Analysis</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="includeIP"
                  checked={scanData.includeIP}
                  onChange={handleInputChange}
                />
                Analyze my current IP address location
              </label>
              <small>Shows what location information is exposed</small>
            </div>

            {scanData.includeIP && (
              <div className="form-group">
                <label>Specific IP Address (Optional)</label>
                <input
                  type="text"
                  name="ip"
                  value={scanData.ip}
                  onChange={handleInputChange}
                  placeholder="Leave blank to use your current IP"
                />
              </div>
            )}
          </div>

          <div className="scan-info">
            <h3>🔍 What we'll scan:</h3>
            <ul>
              <li>✅ Data breach databases (HaveIBeenPwned)</li>
              <li>✅ Public profile pictures (Gravatar)</li>
              <li>✅ IP address location data</li>
              <li>✅ Associated email addresses</li>
              <li>✅ Online mentions and traces</li>
            </ul>
          </div>

          <button 
            className="start-scan-btn"
            onClick={startScan}
            disabled={!scanData.email}
          >
            🚀 Start Comprehensive Scan
          </button>
        </div>
      ) : (
        <div className="scanning-progress">
          <div className="progress-header">
            <h3>🔄 Scanning in Progress...</h3>
            <p>Analyzing your digital footprint</p>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{Math.round(scanProgress)}%</div>
          </div>

          <div className="current-step">
            <div className="step-icon">⚡</div>
            <div className="step-text">{currentStep}</div>
          </div>

          <div className="scanning-animation">
            <div className="scan-lines"></div>
            <div className="scanning-text">
              Please wait while we analyze your data...
            </div>
          </div>

          <div className="scan-details">
            <h4>Currently scanning:</h4>
            <ul>
              <li>📧 Email: {scanData.email}</li>
              {scanData.domain && <li>🌐 Domain: {scanData.domain}</li>}
              {scanData.includeIP && <li>📍 Location data</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default FootprintScanner