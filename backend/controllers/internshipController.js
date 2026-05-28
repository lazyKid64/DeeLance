const Internship = require("../models/Internship");
const { isDbConnected } = require("../config/db");

// In-memory internship store (fallback when MongoDB is unavailable)
const memoryInternships = [
  {
    _id: "demo-1",
    internshipName: "DeFi Protocol Smart Contract Developer",
    description: "Build and audit Solidity smart contracts for our decentralized lending protocol. You will work on implementing flash loan mechanics, liquidation bots, and yield optimization strategies. Strong understanding of ERC-20, ERC-721, and DeFi composability required.",
    skillsRequired: ["Solidity", "Hardhat", "DeFi", "OpenZeppelin"],
    ethRewardPool: "0.5",
    durationDays: 30,
    durationGaps: 7,
    companyHandle: "AetherFinance",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-25").toISOString(),
  },
  {
    _id: "demo-2",
    internshipName: "Web3 Frontend Engineer — React + Ethers.js",
    description: "Design and implement responsive dApp interfaces using React and ethers.js v6. Integrate MetaMask wallet connection, real-time on-chain data displays, and transaction signing flows. Experience with Web3 UX patterns and gas optimization is a plus.",
    skillsRequired: ["React", "Ethers.js", "TypeScript", "Web3"],
    ethRewardPool: "0.35",
    durationDays: 21,
    durationGaps: 5,
    companyHandle: "NexusLabs",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-26").toISOString(),
  },
  {
    _id: "demo-3",
    internshipName: "NFT Marketplace Backend Developer",
    description: "Build the backend infrastructure for a cross-chain NFT marketplace. Implement indexing services for ERC-721/1155 events, IPFS metadata pinning, and a GraphQL API for efficient querying. You'll also help design the royalty enforcement system.",
    skillsRequired: ["Node.js", "GraphQL", "IPFS", "MongoDB"],
    ethRewardPool: "0.45",
    durationDays: 28,
    durationGaps: 7,
    companyHandle: "MetaVault",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-27").toISOString(),
  },
  {
    _id: "demo-4",
    internshipName: "Blockchain Security Auditor Intern",
    description: "Perform security audits on Solidity smart contracts. Identify vulnerabilities including reentrancy, integer overflow, access control issues, and economic exploits. Write detailed audit reports with severity classifications and remediation steps.",
    skillsRequired: ["Solidity", "Security", "Slither", "Foundry"],
    ethRewardPool: "0.6",
    durationDays: 45,
    durationGaps: 10,
    companyHandle: "ShieldDAO",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-28").toISOString(),
  },
  {
    _id: "demo-5",
    internshipName: "DAO Governance & Tokenomics Researcher",
    description: "Research and model governance mechanisms for our DAO. Analyze voting systems (quadratic, conviction, holographic consensus), design token distribution curves, and simulate attack vectors. Deliverables include a governance whitepaper and Solidity implementation.",
    skillsRequired: ["Tokenomics", "Game Theory", "Python", "Solidity"],
    ethRewardPool: "0.4",
    durationDays: 35,
    durationGaps: 7,
    companyHandle: "GovernX",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-24").toISOString(),
  },
  {
    _id: "demo-6",
    internshipName: "Zero-Knowledge Proof Circuit Designer",
    description: "Design and implement ZK circuits using circom/snarkjs for our privacy-preserving identity verification system. Build proof generation and verification pipelines, optimize constraint counts, and integrate with on-chain verifier contracts.",
    skillsRequired: ["ZK-Proofs", "Circom", "Rust", "Cryptography"],
    ethRewardPool: "0.75",
    durationDays: 60,
    durationGaps: 14,
    companyHandle: "PrivacyNet",
    contractInternshipId: null,
    status: "Open",
    createdAt: new Date("2026-05-23").toISOString(),
  },
];

exports.createInternship = async (req, res) => {
  try {
    const {
      internshipName,
      description,
      skillsRequired,
      ethRewardPool,
      durationDays,
      durationGaps,
      companyHandle,
      contractInternshipId,
    } = req.body;

    if (!internshipName || !description || !companyHandle) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (isDbConnected()) {
      const internship = await Internship.create({
        internshipName,
        description,
        skillsRequired: skillsRequired || [],
        ethRewardPool,
        durationDays,
        durationGaps,
        companyHandle,
        contractInternshipId: contractInternshipId ?? null,
      });
      res.status(201).json(internship);
    } else {
      // In-memory fallback for demo
      const internship = {
        _id: Date.now().toString(),
        internshipName,
        description,
        skillsRequired: skillsRequired || [],
        ethRewardPool,
        durationDays,
        durationGaps,
        companyHandle,
        contractInternshipId: contractInternshipId ?? null,
        createdAt: new Date().toISOString(),
      };
      memoryInternships.push(internship);
      res.status(201).json(internship);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternships = async (req, res) => {
  try {
    if (isDbConnected()) {
      const internships = await Internship.find().sort({ createdAt: -1 });
      res.json(internships);
    } else {
      // In-memory fallback
      const sorted = [...memoryInternships].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      res.json(sorted);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
