import { useEffect, useState } from "react";
import { fetchGigs } from "../api/gigApi";
import GigCard from "../components/GigCard";
import CreateGig  from "./CreateGig";
import "./Gigs.css"

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGigs()
      .then((res) => setGigs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading gigs...</p>;

  return (
    <div className="GigsContainer">
      <div className="two-column">
        <div className="left-col">
          {gigs.length !== 0 && <h2>Open Gigs</h2>}

          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>

        <div className="right-col">
          <CreateGig />
        </div>
      </div>
    </div>
  );
}
