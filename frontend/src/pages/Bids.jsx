import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGigs } from "../api/gigApi";
import { createBid, getBids, hireBid } from "../api/bidApi";
import { useAuth } from "../context/AuthContext";
import BidCard from "../components/BidCard";

export default function Bids() {
  const { id } = useParams(); // gig id
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [form, setForm] = useState({ message: "", price: "" });
  const [loading, setLoading] = useState(true);

  const loadGig = async () => {
    try {
      const res = await fetchGigs();
      const found = res.data.find((g) => g._id === id);
      setGig(found);
    } catch (err) {
      setGig(null);
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const res = await getBids(id);
      setBids(res.data || []);
    } catch (err) {
      setBids([]);
    }
  };

  useEffect(() => {
    loadGig();
  }, [id]);

  // Only load bids for owner (server may enforce this)
  useEffect(() => {
    if (gig && user && gig.ownerId === user._id) {
      loadBids();
    } else {
      setBids([]);
    }
  }, [gig, user, id]);

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

  const handleHire = async (bidId) => {
    try {
      const res = await hireBid(bidId);
      alert(res.data?.message || "Freelancer hired successfully");
      setGig((g) => ({ ...g, status: "assigned" }));
      await loadBids();
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || "Failed to hire freelancer";
      alert(serverMsg);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!gig) return <p>Gig not found</p>;

  const isOwner = user && gig.ownerId === user._id;

  return (
    <div>
      <h2>{gig.title}</h2>
      <p>{gig.description}</p>
      <p>Budget: ₹{gig.budget}</p>
      <p>Status: {gig.status}</p>

      {/* FREELANCER BID FORM */}
      {user && !isOwner && gig.status === "open" && (
        <form onSubmit={handleBidSubmit} style={{ marginBottom: 20 }}>
          <h3>Submit a Bid</h3>

          <div>
            <textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Your price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <button>Place Bid</button>
        </form>
      )}

      {!user && <p>Login to place a bid</p>}
      {gig.status === "assigned" && <p>This gig is already assigned</p>}

      {/* CLIENT BID LIST + HIRE */}
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
    </div>
  );
}
