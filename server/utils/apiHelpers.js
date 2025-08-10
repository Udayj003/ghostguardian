const axios = require('axios');

class APIHelpers {
  
  // Generic API request with error handling
  static async makeRequest(url, options = {}) {
    try {
      const defaultOptions = {
        timeout: 10000,
        headers: {
          'User-Agent': 'GhostGuardian-Privacy-Scanner/1.0'
        }
      };
      
      const config = { ...defaultOptions, ...options };
      const response = await axios.get(url, config);
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Rate limiting helper
  static createRateLimiter(maxRequests = 10, timeWindow = 60000) {
    const requests = new Map();
    
    return (identifier) => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      // Remove old requests outside time window
      const validRequests = userRequests.filter(time => now - time < timeWindow);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      return true; // Request allowed
    };
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate IP address
  static isValidIP(ip) {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ip);
  }

  // Validate domain
  static isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  // Sanitize user input
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().toLowerCase().replace(/[<>\"']/g, '');
  }

  // Generate privacy score
  static calculatePrivacyScore(findings) {
    let score = 100; // Start with perfect score
    
    // Deduct points for each finding
    findings.breaches?.forEach(() => score -= 20);
    if (findings.gravatar?.exists) score -= 10;
    if (findings.ipInfo?.city) score -= 15;
    if (findings.mentions?.count > 0) score -= findings.mentions.count * 5;
    
    return Math.max(0, score); // Don't go below 0
  }

  // Format API response
  static formatResponse(success, data = null, message = '', errors = []) {
    return {
      success,
      data,
      message,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  // Log API usage for monitoring
  static logAPIUsage(endpoint, ip, duration) {
    console.log(`[API] ${new Date().toISOString()} - ${endpoint} - ${ip} - ${duration}ms`);
  }

  // Handle async errors
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Get client IP address
  static getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }

  // Privacy recommendations based on findings
  static generateRecommendations(findings) {
    const recommendations = [];
    
    if (findings.breaches && findings.breaches.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Change passwords immediately',
        reason: `Found in ${findings.breaches.length} data breach(es)`
      });
      recommendations.push({
        priority: 'HIGH', 
        action: 'Enable two-factor authentication',
        reason: 'Compromised accounts need extra security'
      });
    }
    
    if (findings.gravatar?.exists) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Review Gravatar privacy settings',
        reason: 'Public profile image found'
      });
    }
    
    if (findings.ipInfo?.city) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Consider using VPN',
        reason: 'Location data exposed'
      });
    }
    
    if (findings.mentions?.count > 3) {
      recommendations.push({
        priority: 'LOW',
        action: 'Review online presence',
        reason: 'Multiple mentions found online'
      });
    }
    
    return recommendations;
  }
}

module.exports = APIHelpers;