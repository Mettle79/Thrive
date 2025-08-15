# 🏆 Thrive - Cybersecurity Escape Room (Updated)

An interactive cybersecurity escape room challenge built with Next.js, featuring 8 progressive tasks that test participants' knowledge of digital security concepts. Complete with a real-time leaderboard system powered by Supabase.

## 🎯 Project Overview

Thrive is a web-based escape room experience that challenges participants to complete 8 cybersecurity-themed tasks. Each task focuses on different aspects of digital security, from password strength to phishing awareness. The system tracks completion times and maintains a competitive leaderboard.

## ✨ Features

### 🎮 Core Gameplay
- **8 Progressive Tasks**: Each task builds upon cybersecurity concepts
- **Real-time Timer**: Tracks individual task and total completion times
- **Progress Tracking**: Visual progress indicators throughout the experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🏆 Leaderboard System
- **Real-time Updates**: Live leaderboard with automatic refresh
- **Pagination**: Handles large numbers of participants efficiently
- **Spectator Mode**: Perfect for viewing scores without participating
- **Persistent Storage**: Supabase-powered backend for reliable data storage
- **Time Formatting**: Displays times in hr-min-sec format

### 🎨 User Experience
- **Clean Interface**: Modern, dark theme with orange accents
- **Name Registration**: Required player name entry before starting
- **Task Integration**: Seamless flow between tasks with progress tracking
- **Success Feedback**: Immediate completion time display for each task

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL database)
- **Deployment**: Azure Static Web Apps
- **State Management**: React hooks with localStorage/sessionStorage

## 📋 Task Overview

1. **PIN Entry Challenge** - Basic access control
2. **Email Security** - Phishing awareness and email validation
3. **Cryptography** - Encryption/decryption concepts
4. **Password Strength** - Multi-step password creation
5. **Two-Factor Authentication** - 2FA code validation
6. **QR Code Security** - Safe vs. unsafe QR code identification
7. **Image Safety Review** - Malware and security threat recognition
8. **Final Encryption** - Decryption challenge to complete the escape room

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for leaderboard functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mettle79/Thrive.git
   cd Thrive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Follow the instructions in `SUPABASE_SETUP.md`
   - Run the SQL script in `test_data_insert.sql` for test data

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[LEADERBOARD_README.md](LEADERBOARD_README.md)** - Comprehensive leaderboard system documentation
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Step-by-step Supabase configuration guide
- **[TASK_INTEGRATION_GUIDE.md](TASK_INTEGRATION_GUIDE.md)** - Guide for integrating new tasks
- **[SUPABASE_IMPLEMENTATION_SUMMARY.md](SUPABASE_IMPLEMENTATION_SUMMARY.md)** - Technical implementation overview

## 🏗️ Project Structure

```
thrive/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # PIN entry page
│   │   ├── welcome/           # Welcome screen with name input
│   │   ├── task1/ - task8/    # Individual task pages
│   │   └── leaderboard/       # Leaderboard display
│   ├── components/            # Reusable React components
│   │   ├── Banner.tsx         # Navigation banner
│   │   ├── ProgressTracker.tsx # Timer and progress display
│   │   └── ui/               # Radix UI components
│   └── lib/                  # Utility libraries
│       ├── leaderboard.ts    # Leaderboard management logic
│       └── test-supabase.ts  # Supabase testing utilities
├── public/                   # Static assets
├── docs/                     # Documentation files
└── test_data_insert.sql     # Database test data
```

## 🎯 Usage

### For Participants
1. Enter the PIN code to access the challenge
2. Enter your name or team name on the welcome screen
3. Complete all 8 tasks in sequence
4. View your final time and ranking on the leaderboard

### For Spectators
1. Navigate directly to the leaderboard page
2. Enable auto-refresh to see real-time updates
3. Watch as participants complete the challenge

### For Administrators
- Use the SQL script to add test data for pagination testing
- Monitor the Supabase dashboard for real-time submissions
- Clear data between sessions using the database management tools

## 🔧 Development

### Adding New Tasks
1. Create a new task page in `src/app/taskX/`
2. Follow the pattern in `TASK_INTEGRATION_GUIDE.md`
3. Integrate with the `LeaderboardManager` for timing
4. Add the task to the progress tracking system

### Customizing the Theme
- Modify Tailwind classes in components
- Update color schemes in `tailwind.config.js`
- Adjust styling in individual task pages

### Database Schema
The leaderboard table structure:
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  total_time INTEGER NOT NULL,
  task_times JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL
);
```

## 🚀 Deployment

### Azure Static Web Apps
1. Connect your GitHub repository to Azure Static Web Apps
2. Configure build settings for Next.js static export
3. Set environment variables in Azure
4. Deploy automatically on push to main branch

### Environment Variables
Ensure these are set in your deployment environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

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
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)

---

**Ready to test your cybersecurity skills? Start the challenge at the PIN entry page!** 🔐
