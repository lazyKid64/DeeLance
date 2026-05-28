# DeeLance – Stepwise Run Instructions

Follow these steps **in order** to run the frontend, backend, and use the Web3 integration.

---

## Prerequisites

- **Node.js** (v18+)
- **npm**
- **MetaMask** (browser extension)
- **MongoDB** – ensure your `backend/.env` has a valid `MONGO_URI`

---

## Step 1: Backend (MongoDB + API)

Use the **root** `backend` folder (not `frontend\backend`).

1. Open a terminal.

2. Go to the backend folder (absolute path):

   ```
   cd c:\Users\ychha\Downloads\StackTooDeep-v3.0-main\StackTooDeep-v3.0-main\backend
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Ensure `backend\.env` exists and contains:

   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=5000
   ```

5. Start the backend server:

   ```
   npm start
   ```

   You should see: `Server running on port 5000` and `MongoDB connected`.

6. Keep this terminal open. The backend must stay running.

---

## Step 2: Frontend (React + ethers.js)

1. Open a **new** terminal.

2. Go to the frontend folder:

   ```
   cd c:\Users\ychha\Downloads\StackTooDeep-v3.0-main\StackTooDeep-v3.0-main\frontend
   ```

3. Install dependencies (this installs `ethers` and other packages):

   ```
   npm install
   ```

   If you see **"Can't resolve 'ethers'"** when starting the app, run `npm install` again (or `npm install ethers`) in the **frontend** folder, then `npm start`.

4. **(Optional)** If you use a different API URL, create `frontend\.env`:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

   Default is `http://localhost:5000` if not set.

5. Start the React app:

   ```
   npm start
   ```

   The app will open at `http://localhost:3000`. Keep this terminal open.

---

## Step 3: Contract config

- Contract **address**, **ABI**, and **RPC URL** are in:
  - **Project root:** `c:\Users\ychha\Downloads\StackTooDeep-v3.0-main\StackTooDeep-v3.0-main\details.js`
  - **Frontend copy:** `c:\Users\ychha\Downloads\StackTooDeep-v3.0-main\StackTooDeep-v3.0-main\frontend\src\config\details.js`

- The frontend uses the **config** copy. If you change the deployed contract or RPC, update **both** files so they stay in sync.

---

## Step 4: MetaMask

1. Install **MetaMask** and create or import a wallet.
2. Switch to **Sepolia Testnet** (or the network your contract uses).
3. Get test ETH from a faucet if needed.

---

## Step 5: Using the app

### Login (backend auth)

1. Open `http://localhost:3000`.
2. Choose **Company** or **Freelance**.
3. Enter **Handle**, **Email**, **Password** → **Sign In**.
4. First-time email → register; existing → login.

### Connect wallet & balance

- **Navbar:** When logged in, use **Connect Wallet** and **⟠ X.XX ETH** (balance) next to it.
- **Company dashboard:** Same **Connect Wallet** + **Show balance** in the hero section.
- **Freelancer dashboard:** Same in the top bar.

### Company

- Connect wallet → **New internship** / **+ Add Internship**.
- Fill form (name, description, skills, ETH reward, duration, gaps) → **Create Internship**.
- Confirm the transaction in MetaMask (you stake ETH).
- Internship is created on-chain and stored in MongoDB.
- **Your Internships:** open (unclaimed) and ongoing (claimed). **Remove** open ones; **Check deadlines** for ongoing.

### Freelancer

- **Browse Internships:** open (claimable), voting (vote), in-progress.
- **Apply Now** on open ones: you stake 7.5% of the company reward; confirm in MetaMask.
- **Voting:** open a voting card → enter stake (0.01–0.05 ETH) → **Approve** or **Reject** → confirm.
- **My Internships:** **Submit work** (description/link) → **Finalize voting** when the voting period has ended (if you’re the intern or company).

---

## File paths (absolute)

| Purpose | Path |
|--------|------|
| Project root | `c:\Users\ychha\Downloads\StackTooDeep-v3.0-main\StackTooDeep-v3.0-main` |
| Contract config (root) | `c:\...\StackTooDeep-v3.0-main\details.js` |
| Contract config (frontend) | `c:\...\StackTooDeep-v3.0-main\frontend\src\config\details.js` |
| Contract integration | `c:\...\StackTooDeep-v3.0-main\frontend\src\utils\contract.js` |
| API client | `c:\...\StackTooDeep-v3.0-main\frontend\src\api\client.js` |
| Web3 context | `c:\...\StackTooDeep-v3.0-main\frontend\src\context\Web3Context.jsx` |
| Backend server | `c:\...\StackTooDeep-v3.0-main\backend\server.js` |
| Backend env | `c:\...\StackTooDeep-v3.0-main\backend\.env` |

---

## Quick checklist

- [ ] Backend: `cd backend` → `npm install` → `npm start` (port 5000).
- [ ] Frontend: `cd frontend` → `npm install` → `npm start` (port 3000).
- [ ] MetaMask on Sepolia (or correct network), with test ETH.
- [ ] Login → Connect wallet → use **Show balance** and contract features as above.

---

## Troubleshooting

- **"Can't resolve 'ethers'"** → Run `npm install` in the **frontend** folder (`frontend`), then `npm start` again. Ensure `ethers` is in `frontend\package.json` dependencies.
- **"MetaMask not found"** → Install MetaMask and reload the app.
- **Login / API errors** → Backend running? Correct `REACT_APP_API_URL`? MongoDB connected?
- **Contract / RPC errors** → Check `details.js` and `frontend\src\config\details.js` (address, ABI, RPC).
- **Port in use** → Change `PORT` in `backend\.env` or use `PORT=3001 npm start` in frontend.
