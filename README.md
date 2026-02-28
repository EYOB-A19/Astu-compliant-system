# ASTU Smart Complaint and Issue Tracking System (React Frontend)

React-only frontend with a clean structure and role-based complaint workflow.

## Features

- Landing page
- Sign up and sign in
- Role-based dashboard (Student, Department Staff, Admin)
- Complaint submission and tracking
- Ticket status updates and remarks
- Admin user/category management
- Simple AI chatbot assistant
- LocalStorage-backed mock data and session

## Project Structure

```text
eyoba/
  index.html
  package.json
  vite.config.js
  src/
    App.jsx
    main.jsx
    styles.css
    lib/
      storage.js
    pages/
      LandingPage.jsx
      LoginPage.jsx
      SignupPage.jsx
      DashboardPage.jsx
    components/
      Message.jsx
      OverviewSection.jsx
      TicketsSection.jsx
      StudentComplaintSection.jsx
      StudentChatSection.jsx
      AdminUsersSection.jsx
      AdminCategoriesSection.jsx
```

## Tech Stack

- React
- React Router
- Vite
- Plain CSS

## Demo Accounts

- `student@astu.edu / 123456`
- `staff@astu.edu / 123456`
- `admin@astu.edu / 123456`

## Run Locally

```powershell
cd c:\Users\LENOVO\Desktop\eyoba
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build

```powershell
npm run build
npm run preview
```

## Main Source Files

- `src/pages/LandingPage.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/SignupPage.jsx`
- `src/pages/DashboardPage.jsx`
- `src/lib/storage.js`
- `src/styles.css`
