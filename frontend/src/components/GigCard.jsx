import { Link } from "react-router-dom";

export default function GigCard({ gig }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
      <h3>{gig.title}</h3>
      <p>{gig.description}</p>
      <p>Budget: ₹{gig.budget}</p>

      <Link to={`/gigs/${gig._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}
