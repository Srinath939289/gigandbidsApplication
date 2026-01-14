export default function BidCard({ bid, canHire, onHire, gigStatus }) {
  const status = bid.status || "pending";
  const statusColor =
    status === "hired" ? "#16a34a" : status === "rejected" ? "#dc2626" : "#6b7280";

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: 12, marginBottom: 12, borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0 }}><strong>Message:</strong> {bid.message}</p>
          <p style={{ margin: 0 }}><strong>Price:</strong> ₹{bid.price}</p>
          {bid.createdAt && (
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Placed: {new Date(bid.createdAt).toLocaleString()}
            </p>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "inline-block", padding: "6px 10px", borderRadius: 20, background: statusColor, color: "white", fontWeight: 600 }}>
            {status.toUpperCase()}
          </div>

          {canHire && gigStatus === "open" && status === "pending" && (
            <div style={{ marginTop: 8 }}>
              <button onClick={() => onHire(bid._id)}>Hire</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}