# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bipolar Mood Tracker TMA** - A Telegram Mini App (TMA) for tracking mood in patients with bipolar affective disorder. The app uses a simple interface for daily mood assessment (scale from -5 to +5) and notes, storing data in Telegram CloudStorage without a dedicated database.

## Tech Stack

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Mobile-first, minimalist approach)
- **UI Components:** Shadcn/UI or Radix UI (for sliders and modals)
- **Routing:** React Router DOM (bottom navigation)
- **Charts:** Recharts (for mood visualization)
- **Telegram SDK:** `@twa-dev/sdk` or `window.Telegram.WebApp`
- **Backend (Notifications):** Google Apps Script (separate deployment for reminders)

## Data Storage Architecture

All data is stored in **Telegram CloudStorage** with special key grouping to work around storage limitations:

### Storage Keys
- **Mood data:** `mood_YYYY_MM` (e.g., `mood_2023_10`)
- **User settings:** `user_settings`

### Data Format

Mood data is grouped by month as JSON strings:
```json
{
  "2023-10-01": {
    "score": 2,          // Number: -5 to +5
    "note": "Text...",   // String
    "timestamp": 1696156800000
  }
}
```

User settings:
```json
{
  "reminderTime": "20:00",
  "onboarded": true
}
```

## Application Structure

### Navigation
4-tab bottom navigation bar (visible on all screens except modals):
1. 🏠 Home - Main entry point for daily mood input
2. ⏰ Reminders/Settings - Time picker for daily notifications
3. 📈 Chart - Mood visualization (platform-adaptive)
4. ℹ️ Help - Instructions and video tutorial

### Key User Flows

**Home → Input Flow:**
- Check if today's entry exists in CloudStorage
- If exists: show confirmation modal for editing
- If not: proceed to 2-step wizard (Score → Note)

**Chart Screen (Platform-Adaptive):**
- **Mobile:** Simple chart with notice to use desktop for detailed analysis
- **Desktop:** Full interactive chart with hover tooltips showing date, score, and notes
- **AI Export button:** Generates JSON/CSV with pre-formatted prompt for AI analysis

**Settings Screen:**
- Shows on first app launch (onboarding)
- Sends webhook to Google Apps Script with: `{ chatId, time, timezone }`

## File Structure

```
src/
  components/
    layout/
      BottomNav.tsx       # Bottom navigation bar
      Header.tsx          # App header
    ui/
      MoodSlider.tsx      # -5 to +5 mood input slider
      ChartDesktop.tsx    # Interactive chart for desktop
      ChartMobile.tsx     # Simplified chart for mobile
      VimeoEmbed.tsx      # Video player component
  pages/
    Home.tsx              # Main screen with daily entry button
    InputWizard.tsx       # 2-step mood + note input flow
    Settings.tsx          # Reminder time configuration
    ChartPage.tsx         # Platform-adaptive chart display
    Help.tsx              # Instructions and video
  services/
    storage.ts            # CloudStorage wrapper (month-grouped keys)
    notifications.ts      # Google Apps Script webhook integration
    aiExport.ts           # Data export formatting for AI analysis
```

## Development Commands

Since this is a new project without package.json yet, typical Vite + React commands will be:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Important Implementation Notes

1. **Platform Detection:** Use `Telegram.WebApp.platform` to differentiate mobile/desktop UI
2. **Theme Integration:** Utilize Telegram theme variables (`var(--tg-theme-bg-color)`, etc.)
3. **CloudStorage Service:** Must handle month-based key grouping (`mood_YYYY_MM`) to avoid key limits
4. **Mood Scale:** Always use integers from -5 to +5 (11 total values including 0)
5. **AI Export Prompt Template:** Include standardized prompt with exported data for bipolar disorder analysis
6. **Google Apps Script:** Mock webhook URL in config for notifications setup

## Design Philosophy

- Minimalist, non-distracting interface for daily tracking
- Clean, calm design adapted to Telegram light/dark themes
- Mobile-first approach with enhanced desktop features
- Focus on simplicity to encourage daily usage

---

## Implementation Log (2025-12-05)

### Project Initialization
1. **Created project configuration files:**
   - `package.json` - Project dependencies and scripts
   - `tsconfig.json` & `tsconfig.node.json` - TypeScript configuration
   - `vite.config.ts` - Vite bundler configuration
   - `tailwind.config.js` & `postcss.config.js` - Tailwind CSS setup
   - `index.html` - Main HTML with Telegram WebApp script
   - `.gitignore` - Git ignore rules

2. **Installed dependencies:**
   - React 18.2.0 with TypeScript support
   - React Router DOM 6.20.0 for navigation
   - Recharts 2.10.3 for chart visualization
   - @twa-dev/sdk 7.0.0 for Telegram integration
   - Tailwind CSS 3.3.6 for styling
   - Build passed successfully (569.93 kB bundle)

### Core Services Implementation
3. **Created type definitions** (`src/types.ts`):
   - MoodEntry interface (score, note, timestamp)
   - MonthData interface for grouped storage
   - UserSettings interface (reminderTime, onboarded)
   - Platform type for device detection

4. **Implemented CloudStorage service** (`src/services/storage.ts`):
   - Month-based key grouping: `mood_YYYY_MM`
   - Methods: getEntry, saveEntry, getTodayEntry, saveTodayEntry, getAllData
   - User settings management: getUserSettings, saveUserSettings
   - Handles JSON serialization/deserialization
   - Error handling for storage operations

5. **Created notification service** (`src/services/notifications.ts`):
   - Google Apps Script webhook integration
   - setupReminder function with chatId, time, timezone
   - Mock webhook URL: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

6. **Built AI export service** (`src/services/aiExport.ts`):
   - generateAIExport function with Russian prompt template
   - downloadAIExport for file download
   - copyAIExportToClipboard for clipboard copy
   - Sorts entries by date and formats as JSON

### UI Components & Layout
7. **Created layout components:**
   - `BottomNav.tsx` - 4-tab navigation with active state highlighting
   - `Header.tsx` - Page title header
   - `Layout.tsx` - Main layout wrapper with conditional navigation

8. **Implemented UI components:**
   - `MoodSlider.tsx` - Range slider from -5 to +5 with emoji and color coding
   - `ChartMobile.tsx` - Simple Recharts LineChart with 30-day data
   - `ChartDesktop.tsx` - Interactive chart with custom tooltips showing notes
   - `VimeoEmbed.tsx` - Responsive video embed (16:9 aspect ratio)

### Pages Implementation
9. **Home page** (`src/pages/Home.tsx`):
   - Large "Как прошел сегодняшний день?" button
   - Checks for existing today's entry
   - Shows confirmation modal if entry exists
   - Navigates to InputWizard for new/edit entry

10. **InputWizard** (`src/pages/InputWizard.tsx`):
    - Step 1: MoodSlider for score selection (-5 to +5)
    - Step 2: Textarea for notes (500 char limit)
    - Loads existing entry for editing
    - Saves to CloudStorage with timestamp
    - Returns to Home after save

11. **Settings page** (`src/pages/Settings.tsx`):
    - Time picker for reminder configuration
    - Forced display on first launch (onboarding)
    - Saves to CloudStorage and sends to GAS webhook
    - Gets user timezone automatically
    - Shows save confirmation

12. **ChartPage** (`src/pages/ChartPage.tsx`):
    - Platform detection using Telegram.WebApp.platform
    - Renders ChartMobile or ChartDesktop based on platform
    - AI Export button with copy/download functionality
    - Shows data statistics (total entries count)
    - Empty state for no data

13. **Help page** (`src/pages/Help.tsx`):
    - Vimeo video embed (ID: 76979871)
    - 4-step instructions with numbered icons
    - Information about bipolar disorder
    - Usage tips section

### App Structure & Routing
14. **Main App** (`src/App.tsx`):
    - Router setup with BrowserRouter
    - Onboarding flow check on mount
    - Conditional routing based on onboarding status
    - Initializes Telegram WebApp on load
    - Loading state during settings fetch

15. **Styling** (`src/index.css`):
    - Tailwind directives
    - Telegram theme CSS variables as fallbacks
    - Custom utility classes: tg-bg, tg-text, tg-hint, tg-link, tg-button
    - Responsive layout with flexbox

### Build & Testing
16. **Build process:**
    - Fixed TypeScript error in MoodSlider (Record<string> type)
    - Successful production build
    - Bundle size: 569.93 kB (166.55 kB gzipped)
    - All TypeScript checks passed
    - Vite build warnings about chunk size (expected for Recharts)

### Key Features Implemented
- ✅ Month-grouped CloudStorage with automatic key generation
- ✅ Full mood tracking workflow (Home → Input → Save)
- ✅ Platform-adaptive chart (mobile/desktop)
- ✅ AI export with Russian prompt template
- ✅ Onboarding flow with Settings
- ✅ Bottom navigation with active states
- ✅ Telegram theme integration
- ✅ GAS webhook integration for reminders
- ✅ Modal confirmations for editing entries
- ✅ Responsive design with Tailwind

### Configuration Notes
- **Google Apps Script URL**: Located in `src/services/notifications.ts` - replace `YOUR_SCRIPT_ID` with actual script ID
- **Vimeo Video ID**: Currently set to `76979871` in Help page - update with actual instructional video
- **Theme Variables**: Telegram theme CSS variables are defined in `src/index.css` with fallback values
- **Platform Detection**: Checks for `macos`, `tdesktop`, `web`, `webk`, `weba` as desktop platforms
