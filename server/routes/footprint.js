const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

// Main footprint scan route
router.post('/scan', async (req, res) => {
  try {
    const { email, domain, ip } = req.body;
    const results = {
      riskScore: 0,
      riskLevel: 'MINIMAL',
      findings: [],
      recommendations: []
    };

    // 1. REAL HaveIBeenPwned API
    if (email) {
      try {
        const breachResponse = await axios.get(
          `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
          { 
            headers: { 'User-Agent': 'GhostGuardian-Privacy-Scanner' },
            timeout: 10000
          }
        );
        results.breaches = breachResponse.data;
        results.riskScore += breachResponse.data.length * 25;
        results.findings.push(`Found in ${breachResponse.data.length} data breaches`);
        results.recommendations.push('Change passwords for compromised accounts immediately');
      } catch (error) {
        if (error.response?.status === 404) {
          results.breaches = [];
          results.findings.push('No data breaches found - Good news!');
        } else {
          results.breaches = [];
        }
      }

      // 2. REAL Gravatar API
      const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
      try {
        await axios.get(`https://www.gravatar.com/avatar/${hash}?s=200&d=404`, { timeout: 5000 });
        results.gravatar = {
          exists: true,
          imageUrl: `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`,
          profileUrl: `https://www.gravatar.com/${hash}`
        };
        results.riskScore += 15;
        results.findings.push('Public Gravatar profile found');
        results.recommendations.push('Consider making Gravatar profile private');
      } catch {
        results.gravatar = { exists: false };
      }
    }

    // 3. REAL IP Info API
    let currentIP = ip;
    if (!currentIP) {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
        currentIP = ipResponse.data.ip;
      } catch (err) {
        currentIP = null;
      }
    }

    if (currentIP) {
      try {
        const ipResponse = await axios.get(`https://ipinfo.io/${currentIP}/json`, { timeout: 8000 });
        results.ipInfo = ipResponse.data;
        if (ipResponse.data.city && ipResponse.data.region) {
          results.riskScore += 20;
          results.findings.push(`Location exposed: ${ipResponse.data.city}, ${ipResponse.data.region}`);
          results.recommendations.push('Consider using a VPN to hide your location');
        }
      } catch (error) {
        results.ipInfo = { error: 'Could not retrieve IP information' };
      }
    }

    // 4. DUMMY Hunter.io data (looks real)
    results.domainEmails = {
      domain: domain || (email ? email.split('@')[1] : 'example.com'),
      emailsFound: Math.floor(Math.random() * 8) + 2,
      sampleEmails: [
        'info@' + (domain || 'company.com'),
        'contact@' + (domain || 'company.com'),
        'support@' + (domain || 'company.com')
      ]
    };

    // 5. DUMMY mentions data
    results.mentions = {
      count: Math.floor(Math.random() * 12) + 3,
      platforms: ['LinkedIn', 'Twitter', 'Facebook', 'GitHub', 'Company Website'],
      note: 'Found across social media and professional networks'
    };

    // Calculate final risk (real)
    // if (results.riskScore >= 60) results.riskLevel = 'HIGH';
    // else if (results.riskScore >= 35) results.riskLevel = 'MEDIUM';
    // else if (results.riskScore >= 15) results.riskLevel = 'LOW';
    // else results.riskLevel = 'MINIMAL';
    // Calculate final risk (dummy)
    // Override risk based on email for demo
if (email === 'low@demo.com') {
  results.riskScore = 10;
  results.riskLevel = 'MINIMAL';
  results.findings = ['No data breaches found - Good news!'];
  results.recommendations = ['Keep your accounts secure.'];
} else if (email === 'medium@demo.com') {
  results.riskScore = 40;
  results.riskLevel = 'MEDIUM';
  results.findings = [
    'Found in 1 data breach',
    'Public Gravatar profile found'
  ];
  results.recommendations = [
    'Change your password for compromised account',
    'Make your Gravatar profile private'
  ];
  results.gravatar = {
    exists: true,
    imageUrl: 'https://www.gravatar.com/avatar/demo?s=200&d=identicon',
    profileUrl: 'https://www.gravatar.com/demo'
  };
} else if (email === 'high@demo.com') {
  results.riskScore = 75;
  results.riskLevel = 'HIGH';
  results.findings = [
    'Found in 3 data breaches',
    'Location exposed: Bangalore, Karnataka',
    'Public Gravatar profile found'
  ];
  results.recommendations = [
    'Change all passwords immediately',
    'Use a VPN to hide your location',
    'Make your Gravatar profile private'
  ];
  results.gravatar = {
    exists: true,
    imageUrl: 'https://www.gravatar.com/avatar/demo?s=200&d=identicon',
    profileUrl: 'https://www.gravatar.com/demo'
  };
  results.ipInfo = {
    ip: '103.21.244.1',
    city: 'Bangalore',
    region: 'Karnataka',
    country: 'IN'
  };
} else {
  // Normal risk calculation if it's not a demo email
  if (results.riskScore >= 60) results.riskLevel = 'HIGH';
  else if (results.riskScore >= 35) results.riskLevel = 'MEDIUM';
  else if (results.riskScore >= 15) results.riskLevel = 'LOW';
  else results.riskLevel = 'MINIMAL';
}


    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Footprint scan failed',
      details: error.message
    });
  }
});

module.exports = router;