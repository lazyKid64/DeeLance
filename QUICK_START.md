# Quick Start Guide - DeeLance Web3 Integration

## Exact Step-by-Step Process to Run

### Step 1: Navigate to Frontend Directory
```bash
cd /Users/aradhya/Downloads/StackTooDeep-v3.0-main/frontend-main
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all dependencies including `ethers` (already added to package.json).

### Step 3: Verify Contract Configuration
Ensure the file exists at:
```
/Users/aradhya/Downloads/StackTooDeep-v3.0-main/contract_address_and_ABI_and_RPCURL.js
```

Verify it contains:
- `contractAddress`: Your deployed contract address
- `RPC_URL`: Your RPC endpoint (e.g., Infura/Alchemy)
- `ABI`: The contract ABI array

### Step 4: Start Development Server
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### Step 5: Setup MetaMask

1. **Install MetaMask** (if not installed):
   - Visit https://metamask.io/
   - Install browser extension

2. **Add Sepolia Testnet**:
   - Open MetaMask
   - Click network dropdown → "Add Network"
   - Or use: Network Name: "Sepolia Testnet", RPC URL: (from your config), Chain ID: 11155111

3. **Get Test ETH**:
   - Visit https://sepoliafaucet.com/ or similar
   - Request test ETH to your MetaMask address

### Step 6: Use the Application

#### As Company:
1. Login → Select "Company"
2. Enter any credentials (simulated login)
3. Click "Connect Wallet" → Approve MetaMask
4. Click "New internship" → Fill form → Create
5. Approve MetaMask transaction

#### As Freelancer:
1. Login → Select "Freelance"
2. Enter any credentials
3. Click "Connect Wallet" → Approve MetaMask
4. Browse internships → Click "View Details"
5. Click "Claim Internship" → Approve transaction (stake 7.5% of company stake)
6. Go to "My Internships" → Submit work when ready
7. Vote on other submissions (stake 0.01-0.05 ETH)

## Troubleshooting

### Issue: "Module not found: ethers"
**Solution**: Run `npm install` again in the frontend-main directory

### Issue: "Contract configuration file not found"
**Solution**: Ensure `contract_address_and_ABI_and_RPCURL.js` exists at project root

### Issue: "MetaMask is not installed"
**Solution**: Install MetaMask browser extension and refresh page

### Issue: Transaction fails
**Solution**: 
- Check you have sufficient ETH
- Verify you're on Sepolia Testnet
- Check contract address is correct

### Issue: Port 3000 already in use
**Solution**: 
```bash
PORT=3001 npm start
```

## File Structure Reference

```
StackTooDeep-v3.0-main/
├── contract_address_and_ABI_and_RPCURL.js  ← Contract config (ROOT)
├── frontend-main/
│   ├── src/
│   │   ├── utils/
│   │   │   └── contract.js                 ← Blockchain integration
│   │   ├── components/
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── FreelancerDashboard.jsx
│   │   │   └── BrowseInternships.jsx
│   │   └── pages/
│   │       └── MyInternships.jsx
│   └── package.json                         ← Dependencies
├── SETUP_INSTRUCTIONS.md                    ← Detailed guide
├── INTEGRATION_SUMMARY.md                   ← What was done
└── QUICK_START.md                          ← This file
```

## Important Commands

```bash
# Install dependencies
cd /Users/aradhya/Downloads/StackTooDeep-v3.0-main/frontend-main
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Network Information

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Currency**: SepoliaETH (test ETH)
- **Contract**: Deployed at address in config file

---

**Ready to use!** Follow the steps above to get started.
