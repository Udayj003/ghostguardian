import { useState } from 'react'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields')
      setIsLoading(false)
      return
    }   

    if (!formData.email.includes('@')) {
      alert('Please enter a valid email')
      setIsLoading(false)
      return
    }

    // Simulate login process
    setTimeout(() => {
      onLogin({
        name: formData.name,
        email: formData.email,
        joinedDate: new Date().toLocaleDateString()
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleDemoLogin = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@example.com'
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🔐 Welcome to GhostGuardian</h2>
          <p>Discover and protect your digital footprint</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
            <small className="form-help">
              We'll scan this email for data breaches and digital traces
            </small>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Start Privacy Scan →'}
          </button>

          <button 
            type="button" 
            className="demo-btn"
            onClick={handleDemoLogin}
          >
            Fill Demo Data
          </button>
        </form>

        <div className="login-features">
          <h3>What GhostGuardian does:</h3>
          <ul>
            <li>🔍 Scans for data breaches</li>
            <li>🌐 Finds public profile information</li>
            <li>📍 Reveals location exposure</li>
            <li>🛡️ Provides privacy recommendations</li>
            <li>📊 Calculates your privacy risk score</li>
          </ul>
        </div>

        <div className="privacy-notice">
          <p>🔒 Your privacy is protected. We don't store personal data.</p>
        </div>
      </div>
    </div>
  )
}

export default Login