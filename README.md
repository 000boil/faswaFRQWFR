# IP Logger to Discord Webhook

A simple website that logs visitor IP addresses to a Discord webhook when they visit the page.

## Features

- 🌐 Captures visitor IP addresses
- 🔒 **VPN/Proxy Detection** - Automatically detects if visitor is using a VPN or proxy
- 🌍 **Location Tracking** - Shows visitor's city and country
- 📱 Blank white page (stealth mode)
- 🚀 Serverless architecture (Vercel-ready)
- 💬 Sends formatted Discord notifications with:
  - IP Address
  - VPN/Proxy status (with color coding)
  - Location information
  - Timestamp
  - User Agent
  - Referrer information

## Setup Instructions

### 1. Get Your Discord Webhook URL

1. Open Discord and go to your server
2. Go to **Server Settings** > **Integrations** > **Webhooks**
3. Click **New Webhook** or edit an existing one
4. Copy the **Webhook URL**

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Add your Discord webhook URL as an environment variable:
   ```bash
   vercel env add DISCORD_WEBHOOK_URL
   ```
   Then paste your Discord webhook URL when prompted.

5. Deploy to production:
   ```bash
   vercel --prod
   ```

#### Option B: Deploy via Vercel Dashboard

1. Push this code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click **Add New** > **Project**

4. Import your repository

5. Before deploying, add the environment variable:
   - Go to **Settings** > **Environment Variables**
   - Add `DISCORD_WEBHOOK_URL` with your Discord webhook URL
   - Click **Save**

6. Click **Deploy**

### 3. Optional: ProxyCheck.io API Key (For Higher Limits)

The VPN detection works without an API key (1,000 free checks per day). To increase to 100,000 daily checks:

1. Go to [proxycheck.io](https://proxycheck.io/) and sign up (free)
2. Get your API key from the dashboard
3. Add it to Vercel environment variables as `PROXYCHECK_API_KEY`

### 4. Test Your Site

Visit your deployed Vercel URL. You should see:
- A blank white page (stealth mode)
- A notification in your Discord channel with:
  - The visitor's IP
  - VPN/Proxy status (Red = VPN detected, Green = Clean IP)
  - Location information
  - User agent and referrer

## Local Development

1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Discord webhook URL

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── api/
│   └── log-ip.js          # Serverless function to capture IPs
├── public/
│   └── index.html         # Frontend webpage
├── .env.example           # Environment variables template
├── vercel.json            # Vercel configuration
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## How It Works

1. When someone visits your website, they see a blank white page
2. JavaScript automatically makes a POST request to `/api/log-ip`
3. The serverless function:
   - Captures the visitor's IP address
   - Checks if it's a VPN/proxy using ProxyCheck.io
   - Gets location information
   - Formats the data with color coding (Red=VPN, Green=Clean)
4. Sends everything to your Discord webhook
5. You receive a detailed notification in Discord

## Discord Message Colors

- 🟢 **Green** - Clean IP (no VPN/proxy detected)
- 🔴 **Red** - VPN/Proxy detected
- 🔵 **Blue** - VPN check failed or unknown

## Privacy Notice

This application logs IP addresses. Make sure to:
- Inform visitors that their data is being collected
- Comply with privacy laws (GDPR, CCPA, etc.)
- Use this responsibly and ethically

## Customization

### Change the Website Design

Edit `public/index.html` to customize the look and feel of your page.

### Modify Discord Message Format

Edit `api/log-ip.js` to change the Discord embed format and fields.

## Troubleshooting

**Not receiving Discord notifications?**
- Verify your webhook URL is correct in environment variables
- Check that the webhook hasn't been deleted in Discord
- Look at the Vercel function logs for errors

**Status shows "Connection Issue"?**
- Check Vercel function logs
- Ensure environment variables are set in Vercel dashboard
- Verify the webhook URL is valid

## License

MIT License - Feel free to use and modify as needed.

