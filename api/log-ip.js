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

    // Discord webhook URL from environment variable
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL not configured');
      return res.status(200).json({ success: false, message: 'Webhook not configured' });
    }

    // Create Discord embed message
    const discordMessage = {
      embeds: [{
        title: '🌐 New Visitor Logged',
        color: 0x5865F2, // Discord Blurple
        fields: [
          {
            name: '📍 IP Address',
            value: `\`${ip}\``,
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
        ],
        timestamp: timestamp,
        footer: {
          text: 'IP Logger'
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

