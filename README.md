# IP Logger to Discord Webhook

A simple website that logs visitor IP addresses to a Discord webhook when they visit the page.

## Features

- 🌐 Captures visitor IP addresses
- 📱 Responsive modern UI
- 🚀 Serverless architecture (Vercel-ready)
- 💬 Sends formatted Discord notifications with:
  - IP Address
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

### 3. Test Your Site

Visit your deployed Vercel URL. You should see:
- A beautiful welcome page
- A "✓ Connected" status
- A notification in your Discord channel with the visitor's IP information

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

1. When someone visits your website, the HTML page loads
2. JavaScript automatically makes a POST request to `/api/log-ip`
3. The serverless function captures the visitor's IP address
4. It formats the data and sends it to your Discord webhook
5. You receive a notification in Discord with all the visitor info

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

