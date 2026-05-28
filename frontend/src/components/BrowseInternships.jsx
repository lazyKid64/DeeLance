import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./BrowseInternships.css";
import { useWeb3 } from "../context/Web3Context";
import { api } from "../api/client";
import {
  getProvider,
  getSigner,
  getBrowseableInternships,
  claimInternship,
  castVote,
  getMinStake,
  getMaxStake,
  internStakeFromCompanyStake,
  formatETH,
  parseETH,
} from "../utils/contract";

const filters = ["All", "Voting"];

function StatusBadge({ status }) {
  if (status === "Voting") return <span className="bi-status voting">Voting</span>;
  const isOpen = status === "Open";
  return <span className={`bi-status ${isOpen ? "open" : "inprogress"}`}>{status}</span>;
}

export default function BrowseInternships() {
  const { isConnected } = useWeb3();
  const [active, setActive] = useState("All");
  const [openCardId, setOpenCardId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusMode, setStatusMode] = useState("Open");
  const [rawList, setRawList] = useState([]);
  const [dbList, setDbList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState(null);
  const [voteStake, setVoteStake] = useState("");
  const [votingId, setVotingId] = useState(null);
  const [minStakeEth, setMinStakeEth] = useState("0.01");
  const [maxStakeEth, setMaxStakeEth] = useState("0.05");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [chain, db] = await Promise.all([
        getBrowseableInternships(getProvider()).catch(() => []),
        api.getInternships().catch(() => []),
      ]);
      setRawList(Array.isArray(chain) ? chain : []);
      setDbList(Array.isArray(db) ? db : []);
      const p = getProvider();
      const [min, max] = await Promise.all([getMinStake(p), getMaxStake(p)]);
      setMinStakeEth(formatETH(min));
      setMaxStakeEth(formatETH(max));
    } catch (e) {
      console.error(e);
      setRawList([]);
      setDbList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const metaByContractId = useMemo(() => {
    const m = {};
    for (const it of dbList) {
      const cid = it.contractInternshipId;
      if (cid != null) m[cid] = it;
    }
    return m;
  }, [dbList]);

  const list = useMemo(() => {
    let source;

    if (rawList.length > 0) {
      // Normal mode: chain data + DB metadata
      source = rawList.map((it) => {
        const db = metaByContractId[it.id];
        const title = db?.internshipName ?? db?.name ?? `Internship #${it.id}`;
        const company = db?.companyHandle ?? (typeof it.company === "string" ? `${it.company.slice(0, 6)}…${it.company.slice(-4)}` : "—");
        const category = "Internship";
        const tags = db?.skillsRequired ?? db?.skills ?? [];
        const reward = it.companyStake != null ? `${formatETH(it.companyStake)} ETH` : "—";
        const duration1 = it.duration1 != null ? `${Math.round(Number(it.duration1) / 86400)} days` : "—";
        const milestones = it.gapBetweenDurations ? Math.max(1, Math.round(Number(it.gapBetweenDurations) / 86400)) : 5;
        return {
          ...it,
          title,
          company,
          category,
          desc: db?.description ?? "No description.",
          tags,
          reward,
          duration: duration1,
          applicants: "—",
          milestones,
        };
      });
    } else {
      // Demo/fallback mode: show backend-only listings when blockchain is empty
      source = dbList.map((db, idx) => ({
        id: db.contractInternshipId ?? `db-${db._id ?? idx}`,
        title: db.internshipName ?? db.name ?? "Untitled",
        company: db.companyHandle ?? "—",
        category: "Internship",
        desc: db.description ?? "No description.",
        tags: db.skillsRequired ?? db.skills ?? [],
        reward: db.ethRewardPool ? `${db.ethRewardPool} ETH` : "—",
        duration: db.durationDays ? `${db.durationDays} days` : "—",
        milestones: db.durationGaps ? Math.max(1, db.durationGaps) : 5,
        applicants: "—",
        status: db.status ?? "Open",
        isOpen: true,
        companyStake: null,
        isDemo: true,
      }));
    }

    let filtered = source;
    if (active === "Voting") filtered = filtered.filter((x) => x.status === "Voting");
    else if (active === "Status") filtered = filtered.filter((x) => x.status === statusMode);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (x) =>
          (x.title || "").toLowerCase().includes(q) ||
          (x.company || "").toLowerCase().includes(q) ||
          (x.tags || []).join(" ").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [rawList, dbList, metaByContractId, active, statusMode, search]);

  const toggleCard = (id) => {
    setOpenCardId((prev) => (prev === id ? null : id));
    setVotingId(null);
    setVoteStake("");
  };

  const handleClaim = async (job) => {
    if (!isConnected) return alert("Connect your wallet first.");
    const requiredWei = internStakeFromCompanyStake(job.companyStake ?? 0n);
    if (requiredWei <= 0n) return alert("Invalid stake.");
    setClaimingId(job.id);
    try {
      const signer = await getSigner();
      await claimInternship(signer, job.id, requiredWei);
      toggleCard(job.id);
      load();
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Claim failed.");
    } finally {
      setClaimingId(null);
    }
  };

  const handleVote = async (job, vote) => {
    if (!isConnected) return alert("Connect your wallet first.");
    const eth = voteStake.trim();
    if (!eth) return alert(`Enter stake (${minStakeEth}–${maxStakeEth} ETH).`);
    let wei;
    try {
      wei = parseETH(eth);
    } catch {
      return alert("Invalid stake amount.");
    }
    const min = parseETH(minStakeEth);
    const max = parseETH(maxStakeEth);
    if (wei < min || wei > max) return alert(`Stake must be between ${minStakeEth} and ${maxStakeEth} ETH.`);
    setVotingId(job.id);
    try {
      const signer = await getSigner();
      await castVote(signer, job.id, vote, wei);
      setVoteStake("");
      setVotingId(null);
      toggleCard(job.id);
      load();
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Vote failed.");
    } finally {
      setVotingId(null);
    }
  };

  return (
    <section className="bi-wrap">
      <section className="hiw-wrap">
        <h2 className="hiw-title">How It Works</h2>
        <div className="hiw-grid">
          <div className="hiw-card">
            <div className="hiw-step">1</div>
            <h3 className="hiw-heading">Companies Stake</h3>
            <p className="hiw-text">
              Post internships and stake ETH as the reward pool. Funds are locked
              in a smart contract until work completion. After the work is
              verified, the staked ETH is distributed to freelancers.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-step">2</div>
            <h3 className="hiw-heading">Freelancers Commit</h3>
            <p className="hiw-text">
              Apply and stake 7.5% of the reward as commitment. Every freelancer
              is given deadlines and missing them triggers progressive slashing:
              (20% → 40% → 60% → 80% → 100%).
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-step">3</div>
            <h3 className="hiw-heading">Community Verifies</h3>
            <p className="hiw-text">
              Other freelancers vote on work submissions. Voters earn small
              incentives upon being in the majority, ensuring fair and
              decentralized verification.
            </p>
          </div>
        </div>
      </section>

      <div className="bi-topbar">
        <div className="bi-titlebox">
          <h2 className="bi-title">Browse <span>Internships</span></h2>
          <p className="bi-subtitle">{list.length} opportunities available</p>
        </div>
        <div className="bi-filters">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setActive(f); setOpenCardId(null); }}
              className={`bi-filter-btn ${active === f ? "active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bi-tools">
        <div className="bi-searchBox">
          <span className="bi-searchIcon">⌕</span>
          <input
            type="text"
            placeholder="Search internships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bi-searchInput"
          />
        </div>
        <div className="bi-statusToggleWrap">
          <span className="bi-toggleLabel">Status</span>
          <div className="bi-statusToggle">
            <button
              className={`bi-statusTab openTab ${active === "Status" && statusMode === "Open" ? "active" : ""}`}
              onClick={() => { setStatusMode("Open"); setActive("Status"); setOpenCardId(null); }}
            >
              Open
            </button>
            <button
              className={`bi-statusTab progTab ${active === "Status" && statusMode === "In-Progress" ? "active" : ""}`}
              onClick={() => { setStatusMode("In-Progress"); setActive("Status"); setOpenCardId(null); }}
            >
              In-Progress
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bi-loading">Loading…</div>
      ) : (
        <div className="bi-grid">
          {list.map((job) => {
            const isOpen = openCardId === job.id;
            const isVoting = job.status === "Voting";
            const canClaim = job.status === "Open" && !isVoting;

            return (
              <div className="bi-card" key={job.id}>
                <div className="bi-cardHeader">
                  <div className="bi-cardLeft">
                    <h3 className="bi-card-title">{job.title}</h3>
                    <p className="bi-company">{job.company}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="bi-desc">{job.desc}</p>
                <div className="bi-tags">
                  {(job.tags || []).map((tag, idx) => (
                    <span key={idx} className="bi-tag">{tag}</span>
                  ))}
                </div>
                <div className="bi-divider" />
                <div className="bi-stats">
                  <div className="bi-stat">
                    <div className="bi-stat-icon">⟠</div>
                    <div>
                      <p className="bi-stat-value">{job.reward}</p>
                      <p className="bi-stat-label">Pool Reward</p>
                    </div>
                  </div>
                  <div className="bi-stat">
                    <div className="bi-stat-icon">⏱</div>
                    <div>
                      <p className="bi-stat-value">{job.duration}</p>
                      <p className="bi-stat-label">Duration</p>
                    </div>
                  </div>
                </div>
                <div className="bi-bottom">
                  <span>{job.milestones} milestones</span>
                </div>
                <div className="bi-actions">
                  <button className="bi-btn" onClick={() => toggleCard(job.id)}>
                    {isOpen ? "Close" : "View Details"}
                  </button>
                </div>

                <div className={`bi-dropup ${isOpen ? "show" : ""}`}>
                  <div className="bi-dropupHeader">
                    <div>
                      <p className="bi-dropupTitle">{job.title}</p>
                      <p className="bi-dropupSub">{job.company} • {job.category} • {job.duration}</p>
                    </div>
                    <button className="bi-dropupClose" onClick={() => toggleCard(job.id)}>✕</button>
                  </div>
                  <div className="bi-dropupGrid single">
                    <div className="bi-leftPanel">
                      <div className="bi-leftBox">
                        <p className="bi-boxTitle">What Company Offers</p>
                        <div className="bi-offerRow">
                          <span className="bi-offerLabel">Reward</span>
                          <span className="bi-offerValue">{job.reward}</span>
                        </div>
                        <div className="bi-offerRow">
                          <span className="bi-offerLabel">Duration</span>
                          <span className="bi-offerValue">{job.duration}</span>
                        </div>
                        <div className="bi-offerRow">
                          <span className="bi-offerLabel">Milestones</span>
                          <span className="bi-offerValue">{job.milestones}</span>
                        </div>
                      </div>
                      <div className="bi-leftBox">
                        <p className="bi-boxTitle">Internship Details</p>
                        <p className="bi-boxText">{job.desc}</p>
                        <div className="bi-tags big">
                          {(job.tags || []).map((tag, idx) => (
                            <span key={idx} className="bi-tag">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {isVoting && (
                        <div className="bi-voteBox">
                          <p className="bi-boxTitle">Vote on Submission</p>
                          <p className="bi-voteHint">Stake {minStakeEth}–{maxStakeEth} ETH to vote.</p>
                          <input
                            type="text"
                            placeholder={`e.g. ${minStakeEth}`}
                            value={votingId === job.id ? voteStake : ""}
                            onChange={(e) => { setVotingId(job.id); setVoteStake(e.target.value); }}
                            className="bi-voteInput"
                          />
                          <div className="bi-voteBtns">
                            <button
                              className="bi-voteBtn up"
                              onClick={() => handleVote(job, true)}
                              disabled={votingId === job.id && !voteStake.trim()}
                            >
                              👍 Approve
                            </button>
                            <button
                              className="bi-voteBtn down"
                              onClick={() => handleVote(job, false)}
                              disabled={votingId === job.id && !voteStake.trim()}
                            >
                              👎 Reject
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        className="bi-applyNowBig"
                        onClick={() => canClaim && handleClaim(job)}
                        disabled={!canClaim || claimingId === job.id || !isConnected}
                      >
                        {isVoting ? "✅ Voting" : canClaim ? (claimingId === job.id ? "Claiming…" : "✅ Apply Now (stake 7.5%)") : "—"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
