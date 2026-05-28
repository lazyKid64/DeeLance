# Setup Instructions for DeeLance Web3 Integration

This document provides step-by-step instructions to set up and run the DeeLance internship platform with ethers.js blockchain integration.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**
- **MetaMask** browser extension (for wallet connection)
- A web browser (Chrome, Firefox, or Brave recommended)

## Step 1: Install Dependencies

1. Navigate to the frontend directory:
   ```bash
   cd /Users/aradhya/Downloads/StackTooDeep-v3.0-main/frontend-main
   ```

2. Install the required npm packages:
   ```bash
   npm install
   ```

3. Install ethers.js (if not already installed):
   ```bash
   npm install ethers
   ```

## Step 2: Verify Contract Configuration

1. Verify that the contract configuration file exists at the project root:
   ```
   /Users/aradhya/Downloads/StackTooDeep-v3.0-main/contract_address_and_ABI_and_RPCURL.js
   ```

2. Ensure the file contains:
   - `contractAddress`: Your deployed contract address
   - `RPC_URL`: Your RPC endpoint URL (e.g., Infura, Alchemy)
   - `ABI`: The contract ABI array

## Step 3: Configure MetaMask

1. **Install MetaMask** (if not already installed):
   - Visit https://metamask.io/
   - Install the browser extension
   - Create a new wallet or import an existing one

2. **Connect to the Correct Network**:
   - Open MetaMask
   - Click on the network dropdown (usually shows "Ethereum Mainnet")
   - Select "Sepolia Testnet" (or the network your contract is deployed on)
   - If Sepolia is not listed, add it manually:
     - Network Name: Sepolia Testnet
     - RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
     - Chain ID: 11155111
     - Currency Symbol: ETH

3. **Get Test ETH** (for testnet):
   - Visit a Sepolia faucet (e.g., https://sepoliafaucet.com/)
   - Request test ETH to your MetaMask address
   - Wait for the transaction to complete

## Step 4: Start the Development Server

1. From the `frontend-main` directory, run:
   ```bash
   npm start
   ```

2. The application should automatically open in your browser at `http://localhost:3000`
   - If it doesn't open automatically, navigate to this URL manually

3. You should see the login page of the DeeLance platform

## Step 5: Using the Application

### For Companies:

1. **Login as Company**:
   - On the login page, select "Company" mode
   - Enter any handle, email, and password (authentication is simulated)
   - Click "Sign In"

2. **Connect Wallet**:
   - Click "Connect Wallet" button
   - MetaMask will prompt you to connect
   - Approve the connection
   - Your wallet address will be displayed

3. **Create an Internship**:
   - Click "New internship" or "+ Add Internship"
   - Fill in the form:
     - Internship Name
     - Description
     - Skills Required (select from the list)
     - ETH Reward Pool (amount to stake)
     - Duration (days)
     - Duration Gaps (days between deadlines)
   - Click "Create Internship"
   - MetaMask will prompt you to confirm the transaction
   - Approve and wait for confirmation

4. **Manage Internships**:
   - View all your created internships
   - Remove unsubmitted internships (if needed)
   - Check deadlines for ongoing internships

### For Freelancers:

1. **Login as Freelancer**:
   - On the login page, select "Freelance" mode
   - Enter any handle, email, and password
   - Click "Sign In"

2. **Connect Wallet**:
   - Click "Connect Wallet" button
   - Approve MetaMask connection

3. **Browse Internships**:
   - View all open internships on the dashboard
   - Use filters: "All", "Voting", "Open", "In-Progress"
   - Search for specific internships

4. **Claim an Internship**:
   - Click "View Details" on an open internship
   - Click "Claim Internship"
   - Confirm the transaction (you'll need to stake 7.5% of the company's stake)
   - Wait for transaction confirmation

5. **Submit Work**:
   - Go to "My Internships" page (from navigation)
   - Find your ongoing internship
   - Click "Submit Work"
   - Enter work description
   - Submit and wait for confirmation

6. **Vote on Submissions**:
   - Browse internships with "Voting" status
   - Click "View Details"
   - Enter stake amount (0.01 to 0.05 ETH)
   - Click "Approve" or "Reject"
   - Confirm transaction

## Step 6: Troubleshooting

### Common Issues:

1. **"MetaMask is not installed" error**:
   - Ensure MetaMask extension is installed and enabled
   - Refresh the page

2. **"User rejected the connection request"**:
   - Make sure you approve the MetaMask connection prompt

3. **Transaction fails**:
   - Check you have sufficient ETH in your wallet
   - Ensure you're on the correct network (Sepolia Testnet)
   - Verify the contract address is correct

4. **"Failed to load internships"**:
   - Check your internet connection
   - Verify the RPC URL in `contract_address_and_ABI_and_RPCURL.js` is correct
   - Ensure the contract is deployed and accessible

5. **Module not found errors**:
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

6. **Port 3000 already in use**:
   - Stop other processes using port 3000, or
   - Set a different port: `PORT=3001 npm start`

## Step 7: File Structure

Important files and their locations:

```
StackTooDeep-v3.0-main/
├── contract_address_and_ABI_and_RPCURL.js  (Contract config - ROOT)
├── frontend-main/
│   ├── src/
│   │   ├── utils/
│   │   │   └── contract.js                 (Blockchain integration)
│   │   ├── components/
│   │   │   ├── CompanyDashboard.jsx         (Company interface)
│   │   │   ├── FreelancerDashboard.jsx     (Freelancer interface)
│   │   │   └── BrowseInternships.jsx       (Browse & vote)
│   │   └── pages/
│   │       └── MyInternships.jsx            (My internships page)
│   └── package.json                         (Dependencies)
└── SETUP_INSTRUCTIONS.md                    (This file)
```

## Step 8: Production Build (Optional)

To create a production build:

1. From the `frontend-main` directory:
   ```bash
   npm run build
   ```

2. The build files will be in the `build/` directory
3. Deploy the `build/` folder to your hosting service

## Additional Notes

- **Gas Fees**: All transactions require gas fees. On testnet, use test ETH.
- **Network**: Ensure you're always on the correct network (Sepolia Testnet for testing).
- **Contract Address**: The contract address in `contract_address_and_ABI_and_RPCURL.js` must match your deployed contract.
- **RPC URL**: The RPC URL must be accessible and point to the correct network.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all configuration files are correct
3. Ensure MetaMask is properly configured
4. Check that you have sufficient ETH for transactions

---

**Last Updated**: January 25, 2026
