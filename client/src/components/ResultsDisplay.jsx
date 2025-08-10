import React from 'react'

function ResultsDisplay({ results, onBack }) {
  if (!results) return null

  const { breaches, gravatar, ipInfo, mentions, riskScore, recommendations } = results

  return (
    <div className="results-container">
      <div className="results-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Scanner
        </button>
        <h2>🧾 Scan Results</h2>
        <p>Summary of your digital footprint</p>
      </div>

      <div className="result-section">
        <h3>🔐 Breach Report</h3>
        {breaches && breaches.length > 0 ? (
          <ul>
            {breaches.map((b, idx) => (
              <li key={idx}>
                <strong>{b.site}</strong> — {b.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>✅ No known data breaches found</p>
        )}
      </div>

      <div className="result-section">
        <h3>👤 Gravatar Profile</h3>
        {gravatar?.found ? (
          <div className="gravatar-profile">
            <img src={gravatar.imageUrl} alt="Gravatar" />
            <p>Email linked to a public Gravatar profile.</p>
          </div>
        ) : (
          <p>❌ No public Gravatar profile found</p>
        )}
      </div>

      <div className="result-section">
        <h3>📍 IP Information</h3>
        {ipInfo ? (
          <ul>
            <li><strong>IP:</strong> {ipInfo.ip}</li>
            <li><strong>City:</strong> {ipInfo.city}</li>
            <li><strong>Region:</strong> {ipInfo.region}</li>
            <li><strong>Country:</strong> {ipInfo.country}</li>
            <li><strong>ISP:</strong> {ipInfo.org}</li>
          </ul>
        ) : (
          <p>❌ IP info not available</p>
        )}
      </div>

      <div className="result-section">
        <h3>🔎 Online Mentions</h3>
        {mentions && mentions.length > 0 ? (
          <ul>
            {mentions.map((m, idx) => (
              <li key={idx}>
                <a href={m.url} target="_blank" rel="noopener noreferrer">
                  {m.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>✅ No significant mentions found</p>
        )}
      </div>

      <div className="result-section">
        <h3>⚠️ Risk Score</h3>
        <p>
          Your overall risk score is: <strong>{riskScore || 'N/A'}</strong>
        </p>
      </div>

      <div className="result-section">
        <h3>🛡️ Privacy Recommendations</h3>
        {recommendations && recommendations.length > 0 ? (
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>✅ {rec}</li>
            ))}
          </ul>
        ) : (
          <p>🎉 No urgent recommendations at this time</p>
        )}
      </div>
    </div>
  )
}

export default ResultsDisplay
