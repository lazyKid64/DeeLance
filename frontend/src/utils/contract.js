/**
 * DeeLance – ethers.js integration with deployed DEELANCE contract.
 * Uses contract config from frontend src/config/details.js.
 */

import { ethers } from "ethers";
import { contractAddress, RPC_URL, ABI } from "../config/details.js";

const MAX_INTERNSHIP_IDS = 500;

function toBigInt(x) {
  // eslint-disable-next-line no-undef
  return typeof x === "bigint" ? x : BigInt(String(x ?? 0));
}

export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getContract(signerOrProvider) {
  return new ethers.Contract(contractAddress, ABI, signerOrProvider);
}

/**
 * Connect wallet (MetaMask). Returns { address, provider } or throws.
 */
export async function connectWallet() {
  if (!window?.ethereum) throw new Error("MetaMask not found. Please install it.");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  const address = accounts?.[0];
  if (!address) throw new Error("No accounts returned.");
  return { address, provider };
}

/**
 * Get signer for sending txs. Requires wallet to be connected.
 */
export async function getSigner() {
  const provider = getProvider();
  if (!provider || !window?.ethereum) throw new Error("MetaMask not found. Please install it.");
  return provider.getSigner();
}

/**
 * Get ETH balance for address (in ETH string, e.g. "1.234").
 */
export async function getBalance(address) {
  if (!address) return "0";
  const provider = getProvider();
  const bal = await provider.getBalance(address);
  return ethers.formatEther(bal);
}

/**
 * Parse ETH string to wei BigInt.
 */
export function parseETH(ethStr) {
  return ethers.parseEther(String(ethStr || "0"));
}

/**
 * Format wei to ETH string.
 */
export function formatETH(wei) {
  try {
    return ethers.formatEther(toBigInt(wei));
  } catch {
    return "0";
  }
}

/**
 * Build deterministic detail string for contract. Contract hashes this internally.
 */
export function buildDetailString({ name, description, skills }) {
  return JSON.stringify({
    name: (name || "").trim(),
    description: (description || "").trim(),
    skills: Array.isArray(skills) ? skills : [],
  });
}

/**
 * Create internship (company). Stakes ETH.
 * detailHash must be a string (e.g. from buildDetailString). Returns { internshipId } from event.
 */
export async function createInternship(
  signer,
  { firstDurationDays, gapDays, detailHash, valueEth }
) {
  const contract = getContract(signer);
  const valueWei = parseETH(valueEth);
  const tx = await contract.addInternship_ForCompany(
    Number(firstDurationDays),
    Number(gapDays),
    String(detailHash ?? ""),
    { value: valueWei }
  );
  const receipt = await tx.wait();
  const iface = new ethers.Interface(ABI);
  let internshipId;
  for (const log of receipt.logs || []) {
    try {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (parsed && parsed.name === "InternshipAdded") {
        internshipId = Number(parsed.args?.internshipId ?? parsed.args?.[0]);
        break;
      }
    } catch (_) {}
  }
  if (internshipId == null) {
    const open = await getOpenInternshipsWithIds(signer.provider);
    internshipId = open.length ? Math.max(...open.map((o) => o.id)) + 1 : 1;
  }
  return { internshipId, txHash: receipt.hash };
}

/**
 * Get open internships with ids by iterating viewOneInternshipDetails.
 */
export async function getOpenInternshipsWithIds(provider) {
  const p = provider || getProvider();
  const contract = getContract(p);
  let total = 0;
  try {
    total = Number(await contract.totalInternships());
  } catch (_) {
    total = 0;
  }
  if (total === 0) return [];
  const list = [];
  for (let id = 1; id <= Math.min(total, MAX_INTERNSHIP_IDS); id++) {
    try {
      const d = await contract.viewOneInternshipDetails(id);
      const company = d?.s_company ?? d?.[0];
      const isOpen = d?.s_isOpen ?? d?.[9];
      if (!company || company === ethers.ZeroAddress) continue;
      if (!isOpen) continue;
      list.push({
        id,
        company,
        intern: d?.s_intern ?? d?.[1],
        startTime: d?.s_startTime ?? d?.[2],
        companyStake: d?.s_companyStake ?? d?.[3],
        internStake: d?.s_internStake ?? d?.[4],
        duration1: d?.s_duration1 ?? d?.[5],
        gapBetweenDurations: d?.s_gapBetweenTwoDurations ?? d?.[6],
        detailHash: d?.s_detailHash ?? d?.[7],
        submissionHash: d?.s_submissionHash ?? d?.[8],
        isOpen: !!isOpen,
      });
    } catch (_) {
      continue;
    }
  }
  return list;
}

/**
 * Get ongoing internships for user (company or intern). Pass provider + user address.
 */
export async function getOngoingInternships(provider, userAddress) {
  const p = provider || getProvider();
  const contract = getContract(p);
  const user = (userAddress || "").toLowerCase();
  let total = 0;
  try {
    total = Number(await contract.totalInternships());
  } catch (_) {
    total = 0;
  }
  if (total === 0) return [];
  const list = [];
  for (let id = 1; id <= Math.min(total, MAX_INTERNSHIP_IDS); id++) {
    try {
      const d = await contract.viewOneInternshipDetails(id);
      const company = (d?.s_company ?? d?.[0] ?? "").toString().toLowerCase();
      const intern = (d?.s_intern ?? d?.[1] ?? "").toString().toLowerCase();
      const isOpen = !!(d?.s_isOpen ?? d?.[9]);
      if (!company || company === "0x0000000000000000000000000000000000000000") continue;
      if (isOpen) continue;
      if (company !== user && intern !== user) continue;
      list.push({
        id,
        company: d?.s_company ?? d?.[0],
        intern: d?.s_intern ?? d?.[1],
        startTime: d?.s_startTime ?? d?.[2],
        companyStake: d?.s_companyStake ?? d?.[3],
        internStake: d?.s_internStake ?? d?.[4],
        duration1: d?.s_duration1 ?? d?.[5],
        gapBetweenDurations: d?.s_gapBetweenTwoDurations ?? d?.[6],
        detailHash: d?.s_detailHash ?? d?.[7],
        submissionHash: d?.s_submissionHash ?? d?.[8],
        isOpen: false,
      });
    } catch (_) {
      continue;
    }
  }
  return list;
}

/**
 * Get open internships (for freelancers) with ids.
 */
export async function getOpenInternships(provider) {
  return getOpenInternshipsWithIds(provider || getProvider());
}

/**
 * Get all browseable internships: open (claimable), voting (voteable), in-progress (claimed, no voting).
 */
export async function getBrowseableInternships(provider) {
  const p = provider || getProvider();
  const contract = getContract(p);

  // First check how many internships actually exist to avoid 500 useless RPC calls
  let total = 0;
  try {
    total = Number(await contract.totalInternships());
  } catch (_) {
    // If totalInternships() is not public (old contract), fall back to scanning
    // but with a much smaller limit
    total = 0;
  }
  if (total === 0) return [];

  const open = [];
  const voting = [];
  const inProgress = [];
  for (let id = 1; id <= Math.min(total, MAX_INTERNSHIP_IDS); id++) {
    try {
      const d = await contract.viewOneInternshipDetails(id);
      const company = d?.s_company ?? d?.[0];
      const isOpen = !!(d?.s_isOpen ?? d?.[9]);
      if (!company || company === ethers.ZeroAddress) continue;
      const row = {
        id,
        company,
        intern: d?.s_intern ?? d?.[1],
        startTime: d?.s_startTime ?? d?.[2],
        companyStake: d?.s_companyStake ?? d?.[3],
        internStake: d?.s_internStake ?? d?.[4],
        duration1: d?.s_duration1 ?? d?.[5],
        gapBetweenDurations: d?.s_gapBetweenTwoDurations ?? d?.[6],
        detailHash: d?.s_detailHash ?? d?.[7],
        submissionHash: d?.s_submissionHash ?? d?.[8],
        isOpen,
      };
      if (isOpen) {
        open.push({ ...row, status: "Open" });
      } else {
        const vs = await getVotingSession(p, id);
        if (vs?.isActive && !vs?.isFinalized) {
          voting.push({ ...row, status: "Voting", votingSession: vs });
        } else {
          inProgress.push({ ...row, status: "In-Progress" });
        }
      }
    } catch (_) {
      continue;
    }
  }
  return [...open, ...voting, ...inProgress];
}

/**
 * View one internship by id.
 */
export async function getInternshipDetails(provider, internshipId) {
  const contract = getContract(provider || getProvider());
  const d = await contract.viewOneInternshipDetails(Number(internshipId));
  return {
    id: Number(internshipId),
    company: d?.s_company ?? d?.[0],
    intern: d?.s_intern ?? d?.[1],
    startTime: d?.s_startTime ?? d?.[2],
    companyStake: d?.s_companyStake ?? d?.[3],
    internStake: d?.s_internStake ?? d?.[4],
    duration1: d?.s_duration1 ?? d?.[5],
    gapBetweenDurations: d?.s_gapBetweenTwoDurations ?? d?.[6],
    detailHash: d?.s_detailHash ?? d?.[7],
    submissionHash: d?.s_submissionHash ?? d?.[8],
    isOpen: !!(d?.s_isOpen ?? d?.[9]),
  };
}

/**
 * Claim internship (freelancer). Must send 7.5% of company stake.
 */
export async function claimInternship(signer, internshipId, valueWei) {
  const contract = getContract(signer);
  const tx = await contract.claimInternship_ForIntern(Number(internshipId), {
    value: toBigInt(valueWei),
  });
  await tx.wait();
  return { txHash: tx.hash };
}

/**
 * Submit work (intern). Starts voting.
 */
export async function submitWork(signer, internshipId, description) {
  const contract = getContract(signer);
  const tx = await contract.submitInternshipWork_ForIntern(
    Number(internshipId),
    String(description ?? "")
  );
  await tx.wait();
  return { txHash: tx.hash };
}

/**
 * Compute 7.5% of company stake (intern stake required to claim).
 */
export function internStakeFromCompanyStake(companyStakeWei) {
  const n = toBigInt(companyStakeWei);
  return (n * 75n) / 1000n;
}

/**
 * Cast vote. Stake between MIN and MAX (0.01–0.05 ETH).
 */
export async function castVote(signer, internshipId, vote, valueWei) {
  const contract = getContract(signer);
  const v = toBigInt(valueWei);
  const tx = await contract.castVote(Number(internshipId), Boolean(vote), { value: v });
  await tx.wait();
  return { txHash: tx.hash };
}

/**
 * Finalize voting (company or intern).
 */
export async function finalizeVoting(signer, internshipId) {
  const contract = getContract(signer);
  const tx = await contract.finalizeVoting(Number(internshipId));
  await tx.wait();
  return { txHash: tx.hash };
}

/**
 * Get voting session for a task.
 */
export async function getVotingSession(provider, taskId) {
  const contract = getContract(provider || getProvider());
  const r = await contract.getVotingSession(Number(taskId));
  return {
    startTime: r?.startTime ?? r?.[0],
    endTime: r?.endTime ?? r?.[1],
    isActive: !!(r?.isActive ?? r?.[2]),
    isFinalized: !!(r?.isFinalized ?? r?.[3]),
    yesVotes: r?.yesVotes ?? r?.[4],
    noVotes: r?.noVotes ?? r?.[5],
  };
}

export async function getMinStake(provider) {
  const contract = getContract(provider || getProvider());
  const v = await contract.MIN_STAKE();
  return toBigInt(v);
}

export async function getMaxStake(provider) {
  const contract = getContract(provider || getProvider());
  const v = await contract.MAX_STAKE();
  return toBigInt(v);
}

/**
 * Remove unsubmitted internship (company).
 */
export async function removeInternship(signer, internshipId) {
  const contract = getContract(signer);
  const tx = await contract.removeInternship_ForCompany_Unsubmitted(Number(internshipId));
  await tx.wait();
  return { txHash: tx.hash };
}

/**
 * Check deadlines and process slashing/payment (company).
 */
export async function checkDeadlinesAndPay(signer, internshipId) {
  const contract = getContract(signer);
  const tx = await contract.InternshipTimeCheckerAndPayer_ForCompany(Number(internshipId));
  await tx.wait();
  return { txHash: tx.hash };
}

export { contractAddress, RPC_URL, ABI };
