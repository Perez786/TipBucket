# 🪣 TipBucket

**A comprehensive tip distribution application for restaurants and hospitality businesses**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 Features

### 💼 Two Powerful Workflows
- **Express Version**: Quick, one-time tip calculations without saving data
- **Template Version**: Save and reuse employee rosters and distribution rules

### 🧮 Advanced Calculation Scenarios
- **Hours Worked**: Distribute tips proportionally based on hours worked
- **Points System**: Assign point values to different positions
- **Percentage Split**: Fixed percentage distribution by position
- **Tip-Out System**: Traditional tip-out model
- **Hybrid Model**: Combine hours and points for flexible distribution

### 📊 Comprehensive Reporting
- **Employee Breakdown**: Individual earnings with hourly rates
- **Position Summary**: Aggregated data by job position
- **Daily Breakdown**: Day-by-day analysis with employee details
- **Tip Type Separation**: Credit card, cash, and service charge tracking

### 🔐 Secure Authentication
- Google OAuth integration
- Magic link email authentication
- User-specific data isolation

### 📱 Modern UI/UX
- Responsive design for all devices
- Intuitive multi-step forms
- Real-time calculations
- Clean, professional interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google OAuth credentials (optional)
- Email service (Resend API key)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Perez786/TipBucket.git
   cd TipBucket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_CALLBACK_URL=http://localhost:3000/dashboard
   FRONTEND_URL=http://localhost:3000
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email service
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM='TipBucket <noreply@yourdomain.com>'
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Express Flow
1. **Sign in** to your account
2. **Choose "Express Version"** from the dashboard
3. **Enter daily tips** for your time period (weekly/bi-weekly)
4. **Add employees** and their worked hours
5. **Select distribution scenario** and configure parameters
6. **View comprehensive results** with breakdowns

### Template Flow
1. **Create templates** with employee rosters and scenarios
2. **Save reusable configurations** for regular use
3. **Use templates** for quick calculations with pre-filled data
4. **Edit templates** as your team changes
5. **Manage multiple templates** for different shifts or periods

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Email**: Resend API

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   ├── express/           # Express flow
│   ├── templates/         # Template management
│   └── use-template/      # Template usage flow
├── components/            # Reusable components
│   ├── express-flow/      # Express-specific components
│   ├── template-flow/     # Template-specific components
│   └── templates/         # Template management components
├── models/                # MongoDB schemas
└── lib/                   # Utility functions
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ |
| `RESEND_API_KEY` | Email service API key | ✅ |
| `EMAIL_FROM` | Sender email address | ✅ |

### Database Setup
The application uses MongoDB with the following collections:
- `users` - User authentication data
- `templates` - Saved tip distribution templates

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Full Next.js support
- **Railway**: Great for full-stack apps
- **Render**: MongoDB-friendly hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database powered by [MongoDB](https://www.mongodb.com/)

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Made with ❤️ for the hospitality industry**
