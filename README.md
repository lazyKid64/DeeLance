# 🚀 DeeLance — Decentralized Freelance Internship Platform

<div align="center">

![Solidity](https://img.shields.io/badge/Solidity-^0.8.28-363636?logo=solidity)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-blue)

```
    ____                 __                               
   / __ \ ___   ___     / /  ____ _  ____   _____ ___ 
  / / / // _ \ / _ \   / /  / __ `/ / __ \ / ___// _ \
 / /_/ //  __//  __/  / /  / /_/ / / / / // /__ /  __/
/_____/ \___/ \___/  /_/   \__,_/ /_/ /_/ \___/ \___/ 
```

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

## 🧭 Choose Your Interface Role
*Click a section below to explore platform functionality based on user type.*

<details>
<summary><b>🏢 For Companies (Securing Talent & Deliverables)</b></summary>

*   **Post Internships** — Create internship listings with a title, description, required skills, duration, and ETH reward pool.
*   **Stake ETH** — Lock ETH safely into the smart contract as a trustless guarantee of payment.
*   **Track Progress** — Seamlessly monitor intern submissions and track milestone deadlines on-chain.
*   **Decentralized Dispute Resolution** — If deliverables are contested, community voting steps in to decide fair outcomes.
</details>

<details>
<summary><b>👨‍💻 For Freelancers & Interns (Sovereign Work & Guaranteed Pay)</b></summary>

*   **Browse & Claim** — Explore available internship pools, filter opportunities by skills, and claim tasks with your own collateral ETH stake to prove skin-in-the-game.
*   **Submit Work** — Upload cryptographic submission hashes (IPFS-ready) directly on-chain.
*   **Earn Rewards** — Get paid automatically directly from the contract's staked pool upon successful completion.
*   **Reputation System** — Build an unalterable, on-chain track record of your successfully completed internships.
</details>

---

## ✨ System Features

### ⛓️ Smart Contract Protocols
*   **Progressive Slashing** — Missed deadlines trigger escalating penalty protocols ($20\% \rightarrow 40\% \rightarrow 60\% \rightarrow 80\% \rightarrow 100\%$ of the remaining pool balance) back to the client.
*   **Proportional Reward Splitting** — Voting pool rewards are algorithmically calculated and distributed proportionally based on total stake weight.
*   **Decentralized Voting** — Community members audit contested submissions and vote with skin-in-the-game via staked votes.
*   **Voter Incentives** — Consensus winners get proportional rewards; consensus losers forfeit $80\%$ of their submitted stake.
*   **Automatic Payouts** — The core smart contract handles all ETH transfers trustlessly without manual intervention.

### 🔐 Multi-Layer Security
*   **Bcrypt Password Hashing** — Industry-standard blowfish cipher password security for Web2 user accounts.
*   **Helmet.js** — Secure HTTP headers configuration to prevent cross-site scripting and injection attacks.
*   **CORS Protection** — Restricted and whitelisted API access filters.
*   **Input Validation** — Strict server-side validation processing on all endpoints.
*   **MetaMask Integration** — Secure cryptographic wallet-based authentication for all blockchain node interactions.

---

## 🛠️ Tech Stack Matrix

| Layer | Technology | Operational Function |
| :--- | :--- | :--- |
| **Frontend** | React 19, React Router v7, Bootstrap 5, Ethers.js v6 | Interactive views, custom styling with glassmorphism, dark mode, cyber-punk aesthetic, and wallet provider states. |
| **Backend** | Node.js, Express 5, Mongoose 9, bcryptjs | API orchestration, secure routing, application controller architecture. |
| **Database** | MongoDB Atlas (Cloud) | Hybrid off-chain storage for caching platform metrics and user structures. |
| **Blockchain**| Solidity ^0.8.28, Sepolia Testnet | Core immutable logic, escrow engines, slashing execution layers. |
| **Wallet** | MetaMask (Injected Provider) | Crytographic key handling and web3 application handshake validation. |

---

## 📁 Project Blueprint & Structure

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

## 🚀 Quick Start & Environment Local Deployment

### Prerequisites
*   Node.js v18+ Installed
*   MetaMask Web Browser Extension
*   Sepolia testnet ETH

### 1. Clone & Core Dependencies Installation

```bash
git clone [https://github.com/lazyKid64/DeeLance.git](https://github.com/lazyKid64/DeeLance.git)
cd DeeLance

# Install backend dependencies
cd backend
npm install

# Install frontend UI dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Secrets

Create a `.env` dashboard configuration inside your backend ecosystem root directory `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
```

### 3. Initialize Run Engines

```bash
# Terminal Module 1 — Run Backend Server
cd backend
node server.js

# Terminal Module 2 — Boot Frontend UI App
cd frontend
npm start
```
Navigate your browser to **http://localhost:3000** and interface with your MetaMask container set to the Sepolia test network.

---

## 💎 Smart Contract Registry

| Detail | Value |
|--------|-------|
| **Network** | Sepolia Testnet |
| **Address** | `0x4Db592199321A85cb1BbAaDC0B5D95969100f391` |
| **Solidity Version** | ^0.8.28 |
| **Functions Available** | 16 External Functional Interfaces |

### Key Contract Functions Matrix

| Function Signature | Protocol Description |
|:---|:---|
| `addInternship()` | Company initializes a project bucket and securely locks the baseline ETH reward stake. |
| `claimInternship()` | Freelancer binds to the task by providing collateral assurance matching stake requirements. |
| `submitInternship()` | Intern uploads and logs the finished deliverable payload hash. |
| `startVotingSession()` | Triggered by companies to pass verification into decentralized community consensus. |
| `castVote()` | Allows ecosystem nodes to weigh in on dispute resolutions with staked voting tokens. |
| `finalizeVoting()` | Processes consensus metrics, resolves the contract status, and executes capital distribution. |
| `InternshipTimeCheckerAndPayer_ForCompany()` | On-chain cron-like verification ensuring progressive slashing execution on overdue milestones. |

---

## 🎨 Frontend Preview Layouts

### 1. Login Page
An active cyber-punk styled user matrix featuring smooth interface element loading animations and MetaMask wallet provider handshakes.

### 2. Company Dashboard
A streamlined operations station where clients execute new contract deployments, specify milestones, and escrow ETH pools via gas transactions.

### 3. Freelancer Dashboard
A clean workspace displaying available open pools, current project milestone status, and integrated interface buttons for uploading final IPFS deliverables.

---

## 🗄️ Database Architecture & Schemas

### Users Collection Structure
```json
{
  "handle": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "type": "freelance | company",
  "walletAddress": "string (optional)"
}
```

### Internships Collection Structure
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

## 🤝 Core Engine Pipeline Flow

```
Company                    Smart Contract                  Freelancer
   │                           │                               │
   ├── Post Internship ───────►│                               │
   │   (stake ETH)             │                               │
   │                           │◄──── Claim Internship ────────┤
   │                           │      (stake ETH)              │
   │                           │                               │
   │                           │◄──── Submit Work ─────────────┤
   │                           │                               │
   ├── Start Voting ──────────►│                               │
   │                           │◄──── Community Votes ─────────┤
   │                           │                               │
   │                           ├──── Distribute Rewards ──────►│
   │                           │     (ETH to winner)           │
   └───────────────────────────┴───────────────────────────────┘
```

---

## 📄 License

This system codebase engine is fully open-source and initialized under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ at Stack2Deep Hackathon — BlocSoc, IIT Roorkee**

*DeeLance — Where Web3 meets Talent*

</div>
