import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./CompanyDashboard.css";
import { useWeb3 } from "../context/Web3Context";
import { api } from "../api/client";
import {
  getProvider,
  getSigner,
  getOpenInternshipsWithIds,
  getOngoingInternships,
  createInternship,
  removeInternship,
  checkDeadlinesAndPay,
  buildDetailString,
  formatETH,
} from "../utils/contract";

const WEB_DEV_SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express.js",
  "MongoDB", "PostgreSQL", "MySQL", "Firebase", "REST API", "GraphQL",
  "WebSockets", "Tailwind CSS", "Bootstrap", "CSS", "HTML", "Solidity",
  "Hardhat", "Foundry", "Ethers.js", "Web3.js", "IPFS", "The Graph",
  "Smart Contracts", "Security Audit", "UI/UX", "Figma",
];

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="cmodal-overlay" onMouseDown={onClose}>
      <div className="cmodal-card" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

export default function CompanyDashboard({ user }) {
  const { address, balance, loading: walletLoading, connect, refreshBalance, isConnected } = useWeb3();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    rewardEth: "",
    durationDays: "",
    gaps: "5",
    skills: [],
  });
  const [internships, setInternships] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [dbInternships, setDbInternships] = useState([]);

  const selectedSkillsText = useMemo(() => {
    return form.skills.length ? form.skills.join(", ") : "No skills selected";
  }, [form.skills]);

  const toggleSkill = (skill) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", rewardEth: "", durationDays: "", gaps: "5", skills: [] });
  };

  const loadDbInternships = useCallback(async () => {
    try {
      const list = await api.getInternships();
      setDbInternships(Array.isArray(list) ? list : []);
    } catch {
      setDbInternships([]);
    }
  }, []);

  const loadChainInternships = useCallback(async () => {
    if (!isConnected || !address) {
      setInternships([]);
      return;
    }
    setListLoading(true);
    try {
      const provider = getProvider();
      const addr = address.toLowerCase();
      const open = await getOpenInternshipsWithIds(provider);
      const myOpen = open.filter((o) => (o.company || "").toString().toLowerCase() === addr);
      const ongoing = await getOngoingInternships(provider, address);
      const merged = [];
      for (const it of myOpen) {
        merged.push({ ...it, status: "Open", isOpen: true });
      }
      for (const it of ongoing) {
        merged.push({ ...it, status: "Ongoing", isOpen: false });
      }
      merged.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setInternships(merged);
    } catch (e) {
      console.error(e);
      setInternships([]);
    } finally {
      setListLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    loadDbInternships();
  }, [loadDbInternships]);

  useEffect(() => {
    loadChainInternships();
  }, [loadChainInternships]);

  const refreshAll = useCallback(() => {
    loadChainInternships();
    loadDbInternships();
    refreshBalance();
  }, [loadChainInternships, loadDbInternships, refreshBalance]);

  const handleCreate = async () => {
    if (!form.name?.trim()) return alert("⚠ Please enter internship name");
    if (!form.description?.trim()) return alert("⚠ Please enter description");
    if (!form.rewardEth) return alert("⚠ Please enter ETH reward");
    if (!form.durationDays) return alert("⚠ Please enter duration (days)");
    if (!isConnected) return alert("⚠ Connect your wallet first");
    setCreateLoading(true);
    try {
      const signer = await getSigner();
      const detailStr = buildDetailString({
        name: form.name,
        description: form.description,
        skills: form.skills,
      });
      const { internshipId } = await createInternship(signer, {
        firstDurationDays: Number(form.durationDays),
        gapDays: Number(form.gaps) || 5,
        detailHash: detailStr,
        valueEth: form.rewardEth,
      });
      await api.createInternship({
        internshipName: form.name,
        description: form.description,
        skillsRequired: form.skills,
        ethRewardPool: Number(form.rewardEth),
        durationDays: Number(form.durationDays),
        durationGaps: Number(form.gaps) || 5,
        companyHandle: user?.handle ?? "Company",
        contractInternshipId: internshipId,
      });
      setModalOpen(false);
      resetForm();
      refreshAll();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to create internship.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!isConnected) return alert("Connect wallet first");
    if (!window.confirm("Remove this internship? Your stake will be refunded minus 2%.")) return;
    try {
      const signer = await getSigner();
      await removeInternship(signer, id);
      refreshAll();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Remove failed.");
    }
  };

  const handleCheckDeadlines = async (id) => {
    if (!isConnected) return alert("Connect wallet first");
    try {
      const signer = await getSigner();
      await checkDeadlinesAndPay(signer, id);
      refreshAll();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Check deadlines failed.");
    }
  };

  const meta = useMemo(() => {
    const m = {};
    for (const it of dbInternships) {
      const cid = it.contractInternshipId;
      if (cid != null) m[cid] = it;
    }
    return m;
  }, [dbInternships]);

  return (
    <div className="cd-wrap">
      <section className="cd-hero">
        <div className="cd-heroLeft">
          <h1 className="cd-title">JOIN<br />TRANSFORM<br />GROW</h1>
          <p className="cd-subtitle">
            Create internships, set ETH rewards, and find the best talent for your web3 + frontend builds.
          </p>
          <div className="d-flex align-items-center gap-2 mt-3" style={{ flexWrap: "nowrap" }}>
            {!isConnected ? (
              <button className="cd-walletBtn" onClick={connect} disabled={walletLoading}>
                <span className="cd-walletIcon">🔗</span>
                {walletLoading ? "Connecting…" : "Connect Wallet"}
              </button>
            ) : (
              <>
                <button className="cd-walletBtn" disabled>
                  {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connected"}
                </button>
                <button
                  type="button"
                  className="cd-walletBtn cd-balanceBtn"
                  onClick={refreshBalance}
                  title="Refresh balance"
                >
                  ⟠ {balance || "0"} ETH
                </button>
              </>
            )}
          </div>
        </div>
        <div className="cd-heroRight">
          <div className="cd-newCard">
            <div className="cd-newCardTop">
              <div className="cd-newCardBar" />
              <div className="cd-newCardBar small" />
              <div className="cd-plusCircle" onClick={() => setModalOpen(true)}>+</div>
            </div>
            <button className="cd-newBtn" onClick={() => setModalOpen(true)}>
              <span className="cd-folder">📁</span> New internship
            </button>
            <p className="cd-newHint">Start a brand new internship</p>
          </div>
        </div>
      </section>

      <section className="cd-list">
        <div className="cd-listTop">
          <h2 className="cd-sectionTitle">Your Internships</h2>
          <button className="cd-primaryBtn" onClick={() => setModalOpen(true)}>+ Add Internship</button>
        </div>
        {listLoading ? (
          <div className="cd-empty">Loading…</div>
        ) : internships.length === 0 ? (
          <div className="cd-empty">
            No internships yet. Connect wallet and click <b>New internship</b> to create one.
          </div>
        ) : (
          <div className="cd-grid">
            {internships.map((it) => {
              const db = meta[it.id];
              const name = db?.internshipName ?? db?.name ?? `Internship #${it.id}`;
              const description = db?.description ?? "";
              const rewardEth = db?.ethRewardPool ?? (it.companyStake ? formatETH(it.companyStake) : "—");
              const durationDays = db?.durationDays ?? (it.duration1 ? Math.round(Number(it.duration1) / 86400) : "—");
              const gaps = db?.durationGaps ?? (it.gapBetweenDurations ? Math.round(Number(it.gapBetweenDurations) / 86400) : "—");
              const skills = db?.skillsRequired ?? db?.skills ?? [];
              const open = it.isOpen ?? it.status === "Open";
              return (
                <div className="cd-card" key={it.id}>
                  <div className="cd-cardHead">
                    <div>
                      <h3 className="cd-cardTitle">{name}</h3>
                      <p className="cd-cardSub">
                        Status: <span className="cd-status">{it.status}</span>
                      </p>
                    </div>
                    <div className="cd-pill">{rewardEth} ETH</div>
                  </div>
                  <p className="cd-desc">{description || "No description."}</p>
                  <div className="cd-metaRow">
                    <span>⏱ {durationDays} days</span>
                    <span>🧩 {gaps} gaps</span>
                  </div>
                  <div className="cd-tags">
                    {(skills || []).slice(0, 6).map((s) => (
                      <span key={s} className="cd-tag">{s}</span>
                    ))}
                    {(skills || []).length > 6 && <span className="cd-tag">+{skills.length - 6}</span>}
                  </div>
                  {open && (
                    <div className="cd-cardActions mt-3">
                      <button
                        type="button"
                        className="cd-actionBtn danger"
                        onClick={() => handleRemove(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {!open && (
                    <div className="cd-cardActions mt-3">
                      <button
                        type="button"
                        className="cd-actionBtn"
                        onClick={() => handleCheckDeadlines(it.id)}
                      >
                        Check deadlines
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="cmodal-head">
          <h3 className="cmodal-title">Start adding a new internship</h3>
          <button className="cmodal-close" onClick={() => setModalOpen(false)}>✕</button>
        </div>
        <div className="cmodal-body">
          <div className="cmodal-field">
            <label>Internship Name</label>
            <input
              type="text"
              placeholder="e.g. Frontend dApp Integration"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="cmodal-field">
            <label>Description</label>
            <textarea
              placeholder="Write internship details, milestones, responsibilities…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="cmodal-field">
            <label>Skills Required</label>
            <div className="cmodal-skillBox">
              <div className="cmodal-skillSelected">{selectedSkillsText}</div>
              <div className="cmodal-skillGrid">
                {WEB_DEV_SKILLS.map((skill) => {
                  const active = form.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      className={`cmodal-skillTag ${active ? "active" : ""}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="cmodal-row3">
            <div className="cmodal-field">
              <label>ETH Reward Pool</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 0.1"
                value={form.rewardEth}
                onChange={(e) => setForm({ ...form, rewardEth: e.target.value })}
              />
            </div>
            <div className="cmodal-field">
              <label>Duration (days)</label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
              />
            </div>
            <div className="cmodal-field">
              <label>Duration Gaps</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={form.gaps}
                onChange={(e) => setForm({ ...form, gaps: e.target.value })}
              />
            </div>
          </div>
          <div className="cmodal-actions">
            <button className="cmodal-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="cmodal-primary" onClick={handleCreate} disabled={createLoading}>
              {createLoading ? "Creating…" : "Create Internship"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
