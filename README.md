# 🚀 DeeLance — Decentralized Freelance Internship Platform

<div align="center">

![Solidity](https://img.shields.io/badge/Solidity-^0.8.28-363636?logo=solidity)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-blue)

**A Web3-powered platform where companies post internships with ETH-staked rewards, and freelancers claim, deliver, and earn — all governed by smart contracts with progressive slashing and decentralized voting.**

🏆 *Built for the **Stack2Deep Hackathon** organized by **BlocSoc, IIT Roorkee***

</div>

---

## 👥 Team

This project was built by a team of 4 during the **Stack2Deep Hackathon** organized by **BlocSoc, IIT Roorkee**:

**Ishant** · **Aradhya** · **Yash** · **Ayush**

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **🟢 Website** | [dee-lance-five.vercel.app](https://dee-lance-five.vercel.app) |
| **🟢 Backend API** | [deelance.onrender.com](https://deelance.onrender.com) |
| **🟢 Smart Contract** | [`0x4Db592...f391`](https://sepolia.etherscan.io/address/0x4Db592199321A85cb1BbAaDC0B5D95969100f391) (Sepolia) |

---

## ✨ Features

### 🏢 For Companies
- **Post Internships** — Create internship listings with title, description, required skills, duration, and ETH reward pool
- **Stake ETH** — Lock ETH into the smart contract as a guarantee of payment
- **Track Progress** — Monitor intern submissions and milestone deadlines
- **Decentralized Dispute Resolution** — Community voting decides contested outcomes

### 👨‍💻 For Freelancers
- **Browse & Claim** — Explore available internships, filter by skills, and claim with your own ETH stake
- **Submit Work** — Upload submission hashes (IPFS-ready) directly on-chain
- **Earn Rewards** — Get paid automatically from the staked pool upon successful completion
- **Reputation System** — On-chain track record of completed internships

### ⛓️ Smart Contract Features
- **Progressive Slashing** — Missed deadlines trigger escalating penalties (20% → 40% → 60% → 80% → 100% of remaining pool)
- **Proportional Reward Splitting** — Voting rewards distributed proportionally based on stake
- **Decentralized Voting** — Community members vote on disputed submissions with skin-in-the-game (staked votes)
- **Voter Incentives** — Winners get proportional rewards; losers forfeit 80% of their stake
- **Automatic Payouts** — Smart contract handles all ETH transfers trustlessly

### 🔐 Security
- **Bcrypt Password Hashing** — Industry-standard password security
- **Helmet.js** — HTTP security headers
- **CORS Protection** — Restricted API access
- **Input Validation** — Server-side validation on all endpoints
- **MetaMask Integration** — Secure wallet-based authentication for blockchain interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Bootstrap 5, Ethers.js v6 |
| **Backend** | Node.js, Express 5, Mongoose 9, bcryptjs |
| **Database** | MongoDB Atlas (Cloud) |
| **Blockchain** | Solidity ^0.8.28, Sepolia Testnet |
| **Wallet** | MetaMask (Injected Provider) |
| **Styling** | Custom CSS with glassmorphism, dark mode, cyber-punk theme |

---

## 📁 Project Structure

```
DeeLance/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── LoginPage.jsx           # Auth page with animations
│   │   │   ├── CompanyDashboard.jsx    # Company management view
│   │   │   ├── FreelancerDashboard.jsx # Freelancer dashboard
│   │   │   ├── BrowseInternships.jsx   # Internship marketplace
│   │   │   ├── Navbar.jsx              # Navigation with wallet info
│   │   │   └── WalletConnectPopup.jsx  # MetaMask connection modal
│   │   ├── context/
│   │   │   └── Web3Context.jsx  # Web3 state management
│   │   ├── config/
│   │   │   └── details.js       # Contract ABI & address
│   │   ├── api/
│   │   │   └── client.js        # Backend API client
│   │   └── App.js               # Root routing & auth
│   └── package.json
│
├── backend/                    # Express backend
│   ├── controllers/
│   │   ├── authController.js    # Login/register logic
│   │   └── internshipController.js  # CRUD for internships
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Internship.js        # Internship schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── internshipRoutes.js  # Internship endpoints
│   ├── server.js                # Express server entry
│   └── package.json
│
├── contracts/
│   └── DEELANCE.sol             # Solidity smart contract
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Sepolia testnet ETH ([faucet](https://sepoliafaucet.com))

### 1. Clone & Install

```bash
git clone https://github.com/lazyKid64/DeeLance.git
cd DeeLance

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm start
```

Open **http://localhost:3000** and connect MetaMask (Sepolia network).

---

## 📜 Smart Contract

| Detail | Value |
|--------|-------|
| **Network** | Sepolia Testnet |
| **Address** | `0x4Db592199321A85cb1BbAaDC0B5D95969100f391` |
| **Solidity** | ^0.8.28 |
| **Functions** | 16 external functions |

### Key Contract Functions

| Function | Description |
|----------|-------------|
| `addInternship()` | Company creates internship with ETH stake |
| `claimInternship()` | Freelancer claims with their own stake |
| `submitInternship()` | Intern submits work hash |
| `startVotingSession()` | Company initiates community vote |
| `castVote()` | Community members vote with staked ETH |
| `finalizeVoting()` | Resolve vote, distribute rewards |
| `InternshipTimeCheckerAndPayer_ForCompany()` | Progressive slashing for missed deadlines |

---

## 🎨 Screenshots

### Login Page
Cyber-punk themed login with animated background and wallet connection.

### Company Dashboard
Create and manage internships with ETH staking via MetaMask.

### Freelancer Dashboard
Browse available internships, track claimed projects, and submit work.

---

## 🗄️ Database Schema

### Users Collection
```json
{
  "handle": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "type": "freelance | company",
  "walletAddress": "string (optional)"
}
```

### Internships Collection
```json
{
  "internshipName": "string",
  "description": "string",
  "skillsRequired": ["string"],
  "ethRewardPool": "number",
  "durationDays": "number",
  "durationGaps": "number",
  "companyHandle": "string",
  "contractInternshipId": "number (on-chain link)"
}
```

---

## 🤝 How It Works

```
Company                    Smart Contract                 Freelancer
   │                            │                             │
   ├── Post Internship ────────►│                             │
   │   (stake ETH)              │                             │
   │                            │◄──── Claim Internship ──────┤
   │                            │      (stake ETH)            │
   │                            │                             │
   │                            │◄──── Submit Work ───────────┤
   │                            │                             │
   ├── Start Voting ───────────►│                             │
   │                            │◄──── Community Votes ───────┤
   │                            │                             │
   │                            ├──── Distribute Rewards ────►│
   │                            │     (ETH to winner)         │
   └────────────────────────────┴─────────────────────────────┘
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ at Stack2Deep Hackathon — BlocSoc, IIT Roorkee**

*DeeLance — Where Web3 meets Talent*

</div>
