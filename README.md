# 🏦 Bakong KHQR Payment Integration

A modern Express.js web application for Cambodian payment processing using **Bakong KHQR** technology. This project demonstrates secure payment integration with real-time QR code generation and transaction verification.

## 🎯 Features

✅ **Dynamic QR Code Generation** - Generate KHQR payment codes instantly  
✅ **Real-time Payment Verification** - Check transaction status using MD5 hash  
✅ **Multi-Currency Support** - Accept payments in KHR (Riel) and USD  
✅ **Modern Responsive UI** - Built with Tailwind CSS  
✅ **Transaction Tracking** - Real-time countdown with expiration alerts  
✅ **Bank Account Integration** - Secure Bakong API integration  
✅ **Detailed Transaction Details** - Display complete payment information

## 📋 Prerequisites

- **Node.js v14+** and npm installed ([nodejs.org](https://nodejs.org/))
- **Bakong API Account** with API credentials
- **Environment variables** configured (.env file)

Verify your installation:

```bash
node -v
npm -v
```

## � Getting Bakong API Credentials

### Step 1: Register for Bakong API Access

1. Visit the Bakong API registration portal:  
   **[https://api-bakong.nbc.gov.kh/register](https://api-bakong.nbc.gov.kh/register)**

2. Fill in the registration form with:
   - Your email address
   - Organization name
   - Project name
   - Contact information

3. **Important:** Keep your email address secure as Bakong will send your API credentials there

### Step 2: Receive Credentials via Email

After registration, the Bakong system will automatically send an email to your registered email address containing:

- **Access Token (JWT)** - Your authentication token for API calls
- **Token Expiry Date** - When your token expires (typically 1 year from issuance)
- **Organization ID** - Your unique organization identifier
- **API Documentation** - Link to detailed API documentation

### Step 3: Store Your Credentials

When you receive the email:

1. Copy your **Access Token**
2. Note the **Token Expiry Timestamp** (Unix timestamp)
3. Add both to your `.env` file (see Configuration section below)
4. **⚠️ NEVER** commit your `.env` file to public repositories

### Step 4: Token Renewal

When your access token expires:

1. Log in to [https://api-bakong.nbc.gov.kh](https://api-bakong.nbc.gov.kh) (if available)
2. Or contact Bakong support for token renewal
3. Update your `.env` file with the new token

## �🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/net-specter/express-bakong-khqr
cd express-bakong
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root with your Bakong credentials:

```env
HOST=localhost
PORT=3000

# Bakong API Credentials (Received via email after registration)
BAKONG_EMAIL=your-bakong-email@gmail.com
BAKONG_ORGANIZATION=Your Organization Name (from registration)
BAKONG_PROJECT=Your Project Name (from registration)

# Bakong API Configuration (Received in email)
BAKONG_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (copy from email)
BAKONG_TOKEN_EXPIRY=1782985107 (Unix timestamp - copy from email)
BAKONG_BASE_URL=https://api-bakong.nbc.gov.kh

# Merchant Information (Your business details)
BAKONG_ACCOUNT_ID=your-account@bank-code (example: vichet_kao@aclb)
MERCHANT_NAME=Your Merchant Name
ACQUIRING_BANK=Your Bank Name (example: Acled Bank)
MERCHANT_CITY=Your City (example: Phnom Penh)
MOBILE_NUMBER=+855xxxxxxxxx (with country code)
```

**⚠️ Security Warning:**

- Never commit `.env` to Git. Add it to `.gitignore`
- Keep your access token confidential
- Rotate tokens before expiration date

### Step 4: Start the Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
✅ Bakong KHQR Payment Server listening at http://localhost:3000
```

## 📁 Project Structure

```
express-bakong/
├── src/
│   ├── app.js                    # Main Express application
│   ├── index.html                # Frontend payment interface
│   ├── config/
│   │   └── constants.js          # App constants
│   ├── controllers/
│   │   └── paymentController.js  # Payment logic
│   ├── routes/
│   │   ├── index.js              # Main routes
│   │   └── payments/
│   │       └── planPaymentRoutes.js
│   ├── services/
│   │   ├── bakongApiService.js   # Bakong API integration
│   │   └── bakongAuthService.js  # Authentication
│   └── utils/
│       ├── encryptUtils.js       # Encryption helpers
│       └── khqrUtils.js          # KHQR utilities
├── public/
│   └── images/                   # Static assets
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

## 🛠️ API Endpoints

### Initiate Payment

```http
POST /api/v1/payments/initiate-payment
Content-Type: application/json

{
  "amount": 1000,
  "currency": "KHR"
}
```

**Response:**

```json
{
  "md5Hash": "5b3f3466904534c7b60cf03c07bc76e7",
  "qrStand": "data:image/png;base64,..."
}
```

### Check Payment Status

```http
GET /api/v1/payments/check-status/{md5Hash}
```

**Response (Success):**

```json
{
  "status": "COMPLETED",
  "detail": {
    "hash": "5b3f3466904534c7b60cf03c07bc76e702b840c8b8e8d23800f876d49a95aa4c",
    "fromAccountId": "sender@bank",
    "toAccountId": "your-account@bank-code",
    "currency": "KHR",
    "amount": 1000,
    "externalRef": "100FT37288396719"
  }
}
```

## 🌐 Frontend Usage

1. Open `http://localhost:3000` in your browser
2. Enter payment amount and select currency
3. Click **Generate QR Code**
4. Scan QR code with Bakong mobile app
5. Complete payment on your phone
6. Click **Check Payment Status** to verify
7. View detailed transaction information

## 📦 Dependencies

```json
{
  "express": "^4.18.0",
  "axios": "^1.3.0",
  "dotenv": "^16.0.0",
  "qr-image": "^3.2.0"
}
```

## 🔐 Security Features

- JWT-based authentication with Bakong API
- MD5 hash transaction verification
- Environment variable protection
- CORS configuration
- Input validation and error handling

## 🐛 Troubleshooting

### DNS Resolution Error

```
Error: getaddrinfo ENOTFOUND api-bakong.nbc.gov.kh
```

**Solution:** Check your internet connection and verify `BAKONG_BASE_URL` in `.env`

### Invalid Token

```
Error: Invalid or expired Bakong token
```

**Solution:** Update your `BAKONG_ACCESS_TOKEN` with a fresh token from Bakong dashboard

### QR Code Not Displaying

**Solution:** Ensure your merchant account is properly configured in `.env`

## 📝 Development

For development with auto-reload:

```bash
npm run dev
```

This uses **Nodemon** to automatically restart the server when files change.

## 🚢 Deployment

For production deployment:

1. Install production dependencies:

   ```bash
   npm install --production
   ```

2. Set environment variables on your hosting platform

3. Start the server:
   ```bash
   npm start
   ```

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Kao Vichet**

- GitHub: [Net-Specter](https://github.com/net-specter)
- LinkedIn: [Vichet Kao](https://www.linkedin.com/in/vichet-kao/)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues or questions about Bakong API integration, visit:

- [Bakong Developer Documentation](https://bakong.nbc.gov.kh)
- [Cambodia National Bank](https://nbc.org.kh)
