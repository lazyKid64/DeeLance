import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import "./MyInternships.css";
import { useWeb3 } from "../context/Web3Context";
import { api } from "../api/client";
import {
  getProvider,
  getSigner,
  getOngoingInternships,
  submitWork,
  finalizeVoting,
  getVotingSession,
} from "../utils/contract";

function SubmitModal({ open, onClose, onSubmit, loading }) {
  const [desc, setDesc] = useState("");
  if (!open) return null;
  const handleSubmit = () => {
    if (!desc.trim() || loading) return;
    const d = desc;
    setDesc("");
    onSubmit(d);
  };
  return (
    <div className="mi-modalOverlay" onMouseDown={onClose}>
      <div className="mi-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mi-modalHead">
          <h3 className="mi-modalTitle">Submit work</h3>
          <button type="button" className="mi-modalClose" onClick={onClose}>✕</button>
        </div>
        <div className="mi-modalBody">
          <label className="mi-modalLabel">Description or link (GitHub, live URL, etc.)</label>
          <textarea
            className="mi-modalTextarea"
            placeholder="e.g. GitHub: https://github.com/... or Live: https://..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
          />
          <div className="mi-modalActions">
            <button type="button" className="mi-modalBtn secondary" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="mi-modalBtn primary"
              onClick={handleSubmit}
              disabled={loading || !desc.trim()}
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyInternships({ user }) {
  const { address, isConnected } = useWeb3();
  const [ongoingList, setOngoingList] = useState([]);
  const [dbList, setDbList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalizingId, setFinalizingId] = useState(null);
  const [votingSessions, setVotingSessions] = useState({});
  const addProjectRef = useRef(null);
  const [addProjectOpenId, setAddProjectOpenId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const load = useCallback(async () => {
    if (!isConnected || !address) {
      setOngoingList([]);
      return;
    }
    setLoading(true);
    try {
      const provider = getProvider();
      const [chain, db] = await Promise.all([
        getOngoingInternships(provider, address),
        api.getInternships().catch(() => []),
      ]);
      setOngoingList(Array.isArray(chain) ? chain : []);
      setDbList(Array.isArray(db) ? db : []);
      const vs = {};
      for (const it of chain || []) {
        try {
          const s = await getVotingSession(provider, it.id);
          vs[it.id] = s;
        } catch (_) {}
      }
      setVotingSessions(vs);
    } catch (e) {
      console.error(e);
      setOngoingList([]);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = (e) => {
      if (addProjectRef.current && !addProjectRef.current.contains(e.target)) {
        setAddProjectOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const metaByContractId = useMemo(() => {
    const m = {};
    for (const it of dbList) {
      const cid = it.contractInternshipId;
      if (cid != null) m[cid] = it;
    }
    return m;
  }, [dbList]);

  const handleSubmitWork = async (item, description) => {
    if (!description?.trim()) return;
    setSubmitting(true);
    try {
      const signer = await getSigner();
      await submitWork(signer, item.id, description.trim());
      setSubmitModal(null);
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async (id) => {
    setFinalizingId(id);
    try {
      const signer = await getSigner();
      await finalizeVoting(signer, id);
      load();
    } catch (e) {
      console.error(e);
      alert(e?.message ?? "Finalize failed.");
    } finally {
      setFinalizingId(null);
    }
  };

  const openSubmit = (item) => {
    setSubmitModal(item);
    setAddProjectOpenId(null);
  };

  const ongoing = ongoingList.map((it) => {
    const db = metaByContractId[it.id];
    const vs = votingSessions[it.id];
    const title = db?.internshipName ?? db?.name ?? `Internship #${it.id}`;
    const endsIn = it.startTime && it.duration1
      ? `First deadline: ${new Date(Number(it.startTime) * 1000 + Number(it.duration1) * 1000).toLocaleString()}`
      : "—";
    const hasSubmission = it.submissionHash && it.submissionHash !== "0x" + "0".repeat(64);
    const votingActive = vs?.isActive && !vs?.isFinalized && vs?.endTime && Number(vs.endTime) * 1000 >= Date.now();
    const votingEnded = vs?.isActive && !vs?.isFinalized && vs?.endTime && Number(vs.endTime) * 1000 < Date.now();
    return {
      ...it,
      title,
      type: "Internship",
      status: "Ongoing",
      endsIn,
      team: it.company ? `${String(it.company).slice(0, 10)}…` : "—",
      hasSubmission,
      votingActive,
      votingEnded,
    };
  });

  return (
    <div className="mi-wrap">
      <div className="mi-header">
        <h2 className="mi-title">My Internships</h2>
        <p className="mi-subtitle">Track ongoing internships and submit work.</p>
      </div>

      <section className="mi-section">
        <div className="mi-sectionHead">
          <h3 className="mi-sectionTitle">Ongoing</h3>
          <div className="mi-line" />
        </div>

        {!isConnected ? (
          <div className="mi-empty">Connect your wallet to see ongoing internships.</div>
        ) : loading ? (
          <div className="mi-empty">Loading…</div>
        ) : ongoing.length === 0 ? (
          <div className="mi-empty">No ongoing internships.</div>
        ) : (
          <div className="mi-grid">
            {ongoing.map((it) => (
              <div className="mi-card" key={it.id}>
                <div className="mi-cardTop">
                  <div>
                    <h4 className="mi-cardTitle">{it.title}</h4>
                    <p className="mi-cardSub">{it.type}</p>
                  </div>
                  <div className="mi-menuWrap">
                    <button
                      className="mi-dotBtn"
                      onClick={() => setMenuOpenId((prev) => (prev === it.id ? null : it.id))}
                    >
                      ⋮
                    </button>
                    {menuOpenId === it.id && (
                      <div className="mi-menu">
                        <button className="mi-menuItem" onClick={() => { setMenuOpenId(null); }}>
                          ✏️ Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mi-divider" />
                <div className="mi-infoRow">
                  <span className="mi-ic">📅</span>
                  <span className="mi-text">{it.endsIn}</span>
                </div>
                <div className="mi-infoRow">
                  <span className="mi-ic">👥</span>
                  <span className="mi-text">Company {it.team}</span>
                </div>
                <div className="mi-actions">
                  <div className="mi-addProjectWrap" ref={addProjectRef}>
                    <button
                      className="mi-actionBtn ghost"
                      onClick={() => setAddProjectOpenId((prev) => (prev === it.id ? null : it.id))}
                    >
                      Submit work
                    </button>
                    {addProjectOpenId === it.id && (
                      <div className="mi-addProjectMenu">
                        <button className="mi-menuItem" onClick={() => openSubmit(it)}>
                          📄 Submit description / link
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mi-actionRight">
                    {it.votingActive && (
                      <div className="mi-timerChip">Voting in progress</div>
                    )}
                    {it.votingEnded && (
                      <button
                        type="button"
                        className="mi-actionBtn solid"
                        onClick={() => handleFinalize(it.id)}
                        disabled={finalizingId === it.id}
                      >
                        {finalizingId === it.id ? "Finalizing…" : "Finalize voting"}
                      </button>
                    )}
                    {!it.votingActive && !it.votingEnded && (
                      <div className="mi-timerChip">
                        {it.hasSubmission ? "Submitted • awaiting votes" : "Submit before deadline"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mi-section">
        <div className="mi-sectionHead">
          <h3 className="mi-sectionTitle">Completed</h3>
          <div className="mi-line" />
        </div>
        <div className="mi-empty">Completed internships are cleared from the contract after payout.</div>
      </section>

      <SubmitModal
        open={!!submitModal}
        onClose={() => setSubmitModal(null)}
        onSubmit={(desc) => { if (submitModal && desc) handleSubmitWork(submitModal, desc); }}
        loading={submitting}
      />
    </div>
  );
}
