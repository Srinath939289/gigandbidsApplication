 # GigFlow — Frontend

 This is the frontend for the GigFlow project — a small marketplace where gig owners post gigs and freelancers place bids. It is built with React + Vite and pairs with an Express + MongoDB backend located in the `backend/` folder.

 ## Quick Start

 - Install dependencies and run the frontend (default: http://localhost:5173):

 ```bash
 cd frontend
 npm install
 npm run dev
 ```

 - Start the backend (default: http://localhost:5000):

 ```bash
 cd backend
 npm install
 node server.js
 ```

 ## Project Structure (frontend)

 - `src/pages` — page components: `Gigs`, `CreateGig`, `GigDetails`, `Login`, `Register`.
 - `src/components` — UI pieces like `GigCard`, `BidCard`.
 - `src/api` — axios wrapper and API helpers (`authApi`, `gigApi`, `bidApi`).
 - `src/context/AuthContext.jsx` — authentication state and helpers.

 ## Features

 - Login / Register (JWT returned and httpOnly cookie set by backend).
 - Create and list gigs.
 - Freelancers can submit bids on open gigs.
 - Gig owners can view bids and hire a freelancer.
 - Bid status shown to freelancers (pending / hired / rejected).

 ## API Notes

 - The frontend uses `src/api/axios.js` with baseURL `http://localhost:5000/api` and `withCredentials: true` so cookies are sent to the backend.
 - Key endpoints used:
	 - `POST /api/auth/login` — login (sets `token` cookie).
	 - `POST /api/gigs` — create gig (authenticated).
	 - `GET /api/gigs` — list open gigs.
	 - `POST /api/bids` — create a bid (authenticated freelancer).
	 - `GET /api/bids/:gigId` — owner-only: list all bids for a gig.
	 - `GET /api/bids/me/:gigId` — freelancer: list your bids for a gig.
	 - `PATCH /api/bids/:bidId/hire` — owner hires bidder.

 ## Common Troubleshooting

 - "No token, authorization denied": ensure you are logged in and that the `token` cookie exists (check DevTools → Application → Cookies). Restart backend after changes that affect auth.
 - If bids/hire status doesn't update immediately for freelancers, the frontend polls the freelancer bid endpoint every 5s — check Network tab for `GET /api/bids/me/:gigId` responses.
 - If hiring returned a Mongo transaction error, the backend uses an atomic fallback and does not require a replica set. Restart backend to use the latest controller code.

 ## Development Tips

 - Authentication state is in `AuthContext.jsx`; many components rely on `user._id` to determine owner vs freelancer behavior.
 - Form inputs use simple CSS classes located in `src/App.css` and per-page CSS under `src/pages`.

 ## Next Improvements (ideas)

 - Real-time updates via Socket.IO for instant bid/hire notifications.
 - Add tests and TypeScript for stronger guarantees.
 - Improve UX for errors and loading states.

 If you want, I can add a `CONTRIBUTING.md` or expand this README with setup details for Docker, environment variables, or a seed script.
