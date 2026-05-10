import { useEffect, useState } from "react";
import "./App.css";
function App() {

  const [message, setMessage] = useState("Checking backend...");
  const [page, setPage] = useState("home");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [artworks, setArtworks] = useState([]);
  async function fetchArtworks() {
    const res = await fetch("http://localhost:5000/api/upload/artworks");
    const data = await res.json();
    setArtworks(data);
  }
  async function handleUpload() {
    if (!file) {
      setUploadMessage("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("artwork", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:5000/api/upload/artwork", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadMessage(data.message || data.error || "Upload complete ✅");
    } catch {
      setUploadMessage("Upload failed ❌ — is the backend running?");
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend not connected ❌"));
  }, []);
  useEffect(() => {
    if (page === "dashboard") {
      fetchArtworks();
    }
  }, [page]);
  async function handleSignup() {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setAuthMessage(data.message || data.error);
  }

  async function handleLogin() {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("artguard_token", data.token);
      setAuthMessage("Login successful ✅");
      setPage("dashboard");
    } else {
      setAuthMessage(data.error || "Login failed ❌");
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <h2 onClick={() => setPage("home")}>🎨 ArtGuard</h2>

        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("upload")}>Upload</button>
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("signup")}>Sign Up</button>
        </nav>
      </header>

      {page === "home" && (
        <>
          <section className="hero">
            <p className="tag">Protect your artwork from AI misuse</p>
            <h1>Your art. Your effort. Your ownership.</h1>
            <p>
              ArtGuard helps artists protect their work from scraping,
              unauthorized copying, and unapproved AI training.
            </p>
            <button className="primary-btn" onClick={() => setPage("upload")}>
              Upload Artwork
            </button>
          </section>

          <section className="status-card">
            <h3>Backend Status</h3>
            <p>{message}</p>
          </section>
        </>
      )}

      {page === "dashboard" && (
        <section className="dashboard">
          {artworks.length === 0 ? (
            <div className="card">
              <h3>No artworks yet</h3>
              <p>Upload your first artwork</p>
            </div>
          ) : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {artworks.map((art: any) => (
              <div
                key={art.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition duration-300"
              >
                <img
                  src={`http://localhost:5000${art.image_url}`}
                  alt="Artwork"
                  className="w-full h-60 object-cover"
                />

                <div className="p-4">
                  <img src={`http://localhost:5000${art.image_url}`} />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {art.title || "Untitled"}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {art.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </section>
      )}


      {page === "upload" && (
        <section className="form-box">
          <h2>Upload Artwork</h2>

          <input
            type="text"
            placeholder="Artwork title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artwork description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <button className="primary-btn" onClick={handleUpload}>
            Upload
          </button>

          <p>{uploadMessage}</p>
        </section>
      )}

      {page === "login" && (
        <section className="form-box">
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn" onClick={handleLogin}>
            Login
          </button>

          <p>{authMessage}</p>

          <p>
            Don’t have an account?{" "}
            <span onClick={() => setPage("signup")}>Sign up</span>
          </p>
        </section>
      )}

      {page === "signup" && (
        <section className="form-box">
          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn" onClick={handleSignup}>
            Sign Up
          </button>

          <p>{authMessage}</p>

          <p>
            Already have an account?{" "}
            <span onClick={() => setPage("login")}>Login</span>
          </p>
        </section>
      )}
    </div>
  );
}

export default App;

function handleDelete(_id: any): void {
  throw new Error("Function not implemented.");
}
