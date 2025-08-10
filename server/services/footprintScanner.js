const axios = require('axios');
const crypto = require('crypto');

class FootprintScanner {
  
  // Comprehensive scan function
  static async performFullScan(userData) {
    const { email, domain, ip, name } = userData;
    const results = {
      riskScore: 0,
      findings: [],
      recommendations: []
    };

    try {
      // Email-based scans
      if (email) {
        const breaches = await this.checkDataBreaches(email);
        const gravatar = await this.checkGravatar(email);
        
        results.breaches = breaches;
        results.gravatar = gravatar;
        
        // Calculate risk
        if (breaches.length > 0) {
          results.riskScore += breaches.length * 20;
          results.findings.push(`Found in ${breaches.length} data breach(es)`);
          results.recommendations.push('Consider changing passwords for affected services');
        }
        
        if (gravatar.exists) {
          results.riskScore += 10;
          results.findings.push('Public profile picture found');
          results.recommendations.push('Consider making Gravatar profile private');
        }
      }

      // Domain-based scans
      if (domain) {
        const emails = await this.findDomainEmails(domain);
        results.domainEmails = emails;
      }

      // IP-based scans
      if (ip) {
        const ipData = await this.getLocationData(ip);
        results.ipInfo = ipData;
        
        if (ipData.city && ipData.region) {
          results.riskScore += 15;
          results.findings.push(`Location exposed: ${ipData.city}, ${ipData.region}`);
          results.recommendations.push('Consider using VPN to hide location');
        }
      }

      // Search for online mentions
      if (name || email) {
        const mentions = await this.searchOnlineMentions(name || email);
        results.mentions = mentions;
        
        if (mentions.count > 0) {
          results.riskScore += mentions.count * 5;
          results.findings.push(`Found ${mentions.count} online mention(s)`);
        }
      }

      // Set risk level
      results.riskLevel = this.calculateRiskLevel(results.riskScore);
      
      return results;

    } catch (error) {
      console.error('Full scan error:', error);
      throw new Error('Footprint scan failed');
    }
  }

  // Individual API methods
  static async checkDataBreaches(email) {
    try {
      const response = await axios.get(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
        {
          headers: { 'User-Agent': 'GhostGuardian-Privacy-Scanner' },
          timeout: 10000
        }
      );
      return response.data || [];
    } catch (error) {
      if (error.response?.status === 404) {
        return []; // No breaches found - good news!
      }
      console.error('Breach check failed:', error.message);
      return [];
    }
  }

  static async checkGravatar(email) {
    try {
      const hash = crypto.createHash('md5')
        .update(email.toLowerCase().trim())
        .digest('hex');
      
      const testUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=404`;
      
      await axios.get(testUrl, { timeout: 5000 });
      
      return {
        exists: true,
        imageUrl: `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`,
        profileUrl: `https://www.gravatar.com/${hash}`,
        hash: hash
      };
    } catch (error) {
      return { exists: false };
    }
  }

  static async getLocationData(ip) {
    try {
      const response = await axios.get(`https://ipinfo.io/${ip}/json`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('IP lookup failed:', error.message);
      return { error: 'Could not retrieve IP information' };
    }
  }

  static async findDomainEmails(domain) {
    // Placeholder for Hunter.io - would need API key
    return {
      domain: domain,
      emails: [],
      note: 'Hunter.io integration requires API key'
    };
  }

  static async searchOnlineMentions(query) {
    // Placeholder for Google Custom Search - would need API key  
    return {
      query: query,
      count: Math.floor(Math.random() * 10), // Mock data for demo
      results: [],
      note: 'Google Search integration requires API key'
    };
  }

  // Risk calculation
  static calculateRiskLevel(score) {
    if (score >= 80) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 15) return 'LOW';
    return 'MINIMAL';
  }

  // Get user's IP address
  static async getCurrentUserIP() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json', {
        timeout: 5000
      });
      return response.data.ip;
    } catch (error) {
      return null;
    }
  }
}

module.exports = FootprintScanner;