import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import GigDetails from "./pages/GigDetails";
import CreateGig from "./pages/CreateGig";
import ProtectedRoute from "./protectedRoute/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Gigs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-gig" 
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gigs/:id" 
          element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
