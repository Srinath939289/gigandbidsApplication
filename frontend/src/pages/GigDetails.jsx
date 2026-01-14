import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGigs } from "../api/gigApi";
import { createBid, getBids, getMyBids, hireBid } from "../api/bidApi";
import { useAuth } from "../context/AuthContext";
import BidCard from "../components/BidCard";

export default function GigDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [form, setForm] = useState({ message: "", price: "" });
  const [loading, setLoading] = useState(true);

  const loadGig = async () => {
    const res = await fetchGigs();
    const found = res.data.find((g) => g._id === id);
    setGig(found);
    setLoading(false);
  };

  useEffect(() => {
    loadGig();
  }, [id]);

  const loadBids = async () => {
    try {
      const res = await getBids(id);
      setBids(res.data);
    } catch (err) {
      setBids([]);
    }
  };

  const loadMyBids = async () => {
    try {
      const res = await getMyBids(id);
      setBids(res.data || []);
    } catch (err) {
      setBids([]);
    }
  };

  // Fetch bids (ONLY FOR OWNER) - compare IDs as strings to avoid type mismatches
  useEffect(() => {
    const ownerMatch = gig && user && String(gig.ownerId) === String(user._id);
    if (ownerMatch) {
      loadBids();
    } else if (gig && user) {
      // show freelancer's own bids for this gig (rejected/hired/pending)
      loadMyBids();
    } else {
      setBids([]);
    }
  }, [gig, user, id]);

  // Poll freelancer's bids so they see status updates (hired/rejected) shortly after owner action
  useEffect(() => {
    if (!gig || !user) return;
    const isOwner = String(gig.ownerId) === String(user._id);
    if (isOwner) return; // owner doesn't need this polling

    const interval = setInterval(() => {
      loadMyBids();
    }, 5000);

    return () => clearInterval(interval);
  }, [gig, user, id]);

  // Submit bid (FREELANCER)
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createBid({
        gigId: id,
        message: form.message,
        price: form.price,
      });
      alert(res.data?.message || "Bid submitted successfully");
      setForm({ message: "", price: "" });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || "Failed to submit bid";
      alert(serverMsg);
    }
  };

  // Hire bid (OWNER)
  const handleHire = async (bidId) => {
    try {
      const res = await hireBid(bidId);
      alert(res.data?.message || "Freelancer hired successfully");
      // Optimistically update UI: mark chosen bid as hired and others rejected
      setBids((prev) =>
        prev.map((b) => ({ ...b, status: String(b._id) === String(bidId) ? "hired" : "rejected" }))
      );
      setGig((g) => ({ ...g, status: "assigned" }));

      // Also refresh from server in background to stay in sync
      loadGig().catch(() => {});
      loadBids().catch(() => {});
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || "Failed to hire freelancer";
      alert(serverMsg);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!gig) return <p>Gig not found</p>;

  const isOwner = user && String(gig.ownerId) === String(user._id);

  return (
    <div className="two-column">
      <div className="left-col">
        <div className="form-card">
          <h2>{gig.title}</h2>
          <p className="small-muted">{gig.description}</p>
          <p>Budget: ₹{gig.budget}</p>
          <p>Status: {gig.status}</p>

          {/* FREELANCER BID FORM */}
          {user && !isOwner && gig.status === "open" && (
            <form onSubmit={handleBidSubmit}>
              <h3>Submit a Bid</h3>

              <textarea
                className="form-textarea"
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />

              <input
                className="form-input"
                type="number"
                placeholder="Your price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />

              <button>Place Bid</button>
            </form>
          )}

          {!user && <p>Login to place a bid</p>}
          {gig.status === "assigned" && <p>This gig is already assigned</p>}
        </div>
      </div>

      <div className="right-col">
        <div className="form-card">
          {isOwner && (
            <>
              <h3>Bids</h3>

              {bids.length === 0 && <p>No bids yet</p>}

              {bids.map((bid) => (
                <BidCard
                  key={bid._id}
                  bid={bid}
                  gigStatus={gig.status}
                  canHire={true}
                  onHire={handleHire}
                />
              ))}
            </>
          )}

          {!isOwner && user && (
            <>
              <h3>Your Bids</h3>
              {bids.length === 0 && <p>You have not placed any bids for this gig</p>}
              {bids.map((bid) => (
                <BidCard key={bid._id} bid={bid} gigStatus={gig.status} canHire={false} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}