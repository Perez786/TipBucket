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

## 🚀 Deployed with Vercel

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google OAuth credentials (optional)
- Email service (Resend API key)

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database powered by [MongoDB](https://www.mongodb.com/)


---

**Made with ❤️ for the hospitality industry**
