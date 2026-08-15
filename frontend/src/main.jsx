import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "https://ecotrack-api-5v9b.onrender.com/api";

function App() {
  const [dashboard, setDashboard] = useState({
    ecoScore: 0,
    carbonSaved: 0,
    points: 0,
    activities: 0,
    streak: 0,
  });

  const [activities, setActivities] = useState([]);

  const [type, setType] = useState("Cycling");
  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load dashboard.");
      }

      setDashboard(data.dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Could not connect to the EcoTrack backend.");
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/activities`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load activities.");
      }

      setActivities(data.activities);
    } catch (error) {
      console.error("Activities error:", error);
      setError("Could not load activities.");
    }
  };

  useEffect(() => {
    loadDashboard();
    loadActivities();
  }, []);

  const addActivity = async (event) => {
    event.preventDefault();

    setError("");

    const numericValue = Number(value);

    if (!type) {
      setError("Please select an activity.");
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setError("Please enter a value greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          value: numericValue,
        }),
      });

      const data = await response.json();

      console.log("EcoTrack upload:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Could not add activity."
        );
      }

      setValue("");

      await loadDashboard();
      await loadActivities();
    } catch (error) {
      console.error("Upload failed:", error);

      setError(
        error.message ||
          "Could not connect to the EcoTrack backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/activities/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Could not delete activity."
        );
      }

      await loadDashboard();
      await loadActivities();
    } catch (error) {
      console.error("Delete failed:", error);
      setError(error.message || "Could not delete activity.");
    }
  };

  const getUnit = () => {
    if (type === "Recycling") return "kg";
    if (type === "Energy") return "kWh";
    if (type === "Water") return "L";
    return "km";
  };

  return (
    <div className="app">

      {/* Animated background */}

      <div className="parallax-bg bg-one"></div>
      <div className="parallax-bg bg-two"></div>
      <div className="parallax-bg bg-three"></div>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">♻</span>
          <span>EcoTrack</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#cycle">EcoCycle</a>
          <a href="#tracker">Track</a>
          <a href="#impact">Impact</a>
          <a href="#about">About</a>
        </div>

        <a className="nav-button" href="#tracker">
          Start Tracking
        </a>

      </nav>

      <main>

        {/* HERO */}

        <section className="hero" id="home">

          <div className="hero-content">

            <div className="badge">
              🌱 Sustainable living starts here
            </div>

            <h1>
              Track your impact.
              <br />
              <span>Protect our planet.</span>
            </h1>

            <p>
              EcoTrack helps you understand your environmental
              impact, build greener habits, and become part of
              a more sustainable future.
            </p>

            <div className="hero-buttons">

              <a
                className="primary-button"
                href="#tracker"
              >
                Explore EcoTrack →
              </a>

              <a
                className="secondary-button"
                href="#about"
              >
                Learn More
              </a>

            </div>

            <div className="stats">

              <div>
                <strong>12.8K+</strong>
                <span>Eco Users</span>
              </div>

              <div>
                <strong>{dashboard.activities}</strong>
                <span>Habits Tracked</span>
              </div>

              <div>
                <strong>{dashboard.ecoScore}%</strong>
                <span>Eco Score</span>
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="planet-card">

              <div className="planet">🌍</div>

              <div className="floating-card card-one">
                <span>🌱</span>

                <div>
                  <small>CO₂ Saved</small>
                  <strong>
                    {dashboard.carbonSaved} kg
                  </strong>
                </div>
              </div>

              <div className="floating-card card-two">
                <span>♻</span>

                <div>
                  <small>Activities</small>
                  <strong>
                    {dashboard.activities}
                  </strong>
                </div>
              </div>

              <div className="floating-card card-three">
                <span>🚲</span>

                <div>
                  <small>Eco Points</small>
                  <strong>
                    {dashboard.points}
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ECOCYCLE */}

        <section
          className="cycle-section"
          id="cycle"
        >

          <div className="section-heading">

            <div className="badge">
              ♻ ECOCYCLE
            </div>

            <h2>
              One cycle.
              <br />
              <span>Many positive changes.</span>
            </h2>

            <p>
              EcoTrack turns everyday environmental actions
              into a simple circular journey.
            </p>

          </div>

          <div className="cycle">

            <div className="cycle-item">

              <div className="cycle-icon">
                📊
              </div>

              <h3>Track</h3>

              <p>
                Record your daily environmental activities.
              </p>

            </div>

            <div className="cycle-arrow">
              →
            </div>

            <div className="cycle-item">

              <div className="cycle-icon">
                🌱
              </div>

              <h3>Improve</h3>

              <p>
                Discover better and greener alternatives.
              </p>

            </div>

            <div className="cycle-arrow">
              →
            </div>

            <div className="cycle-item">

              <div className="cycle-icon">
                ♻
              </div>

              <h3>Recycle</h3>

              <p>
                Turn waste into resources whenever possible.
              </p>

            </div>

            <div className="cycle-arrow">
              →
            </div>

            <div className="cycle-item">

              <div className="cycle-icon">
                🌍
              </div>

              <h3>Impact</h3>

              <p>
                See how your actions help the planet.
              </p>

            </div>

          </div>

        </section>

        {/* TRACKER */}

        <section
          className="tracker-section"
          id="tracker"
        >

          <div className="section-heading">

            <div className="badge">
              ADD ACTIVITY
            </div>

            <h2>
              Track your
              <br />
              <span>green habits.</span>
            </h2>

            <p>
              Add your environmental actions and watch
              your impact grow.
            </p>

          </div>

          <form
            className="tracker-card"
            onSubmit={addActivity}
          >

            <div className="form-group">

              <label>
                Activity
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >

                <option value="Cycling">
                  Cycling
                </option>

                <option value="Walking">
                  Walking
                </option>

                <option value="Public transport">
                  Public transport
                </option>

                <option value="Recycling">
                  Recycling
                </option>

                <option value="Energy">
                  Energy
                </option>

                <option value="Water">
                  Water
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Amount ({getUnit()})
              </label>

              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={`Enter ${getUnit()}`}
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
              />

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              className="primary-button tracker-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Activity →"}
            </button>

          </form>

        </section>

        {/* ACTIVITY HISTORY */}

        <section className="history-section">

          <div className="section-heading">

            <div className="badge">
              ACTIVITY HISTORY
            </div>

            <h2>
              Your green
              <br />
              <span>journey.</span>
            </h2>

          </div>

          <div className="activity-list">

            {activities.length === 0 ? (

              <div className="empty-state">
                No activities yet. Start tracking!
              </div>

            ) : (

              activities.map((activity) => (

                <div
                  className="activity-card"
                  key={activity.id}
                >

                  <div className="activity-icon">

                    {activity.type === "Cycling" && "🚲"}

                    {activity.type === "Walking" && "🚶"}

                    {activity.type === "Public transport" &&
                      "🚌"}

                    {activity.type === "Recycling" &&
                      "♻"}

                    {activity.type === "Energy" &&
                      "⚡"}

                    {activity.type === "Water" &&
                      "💧"}

                  </div>

                  <div className="activity-info">

                    <h3>
                      {activity.type}
                    </h3>

                    <p>
                      {activity.value}{" "}
                      {activity.unit}
                    </p>

                  </div>

                  <div className="activity-impact">

                    <strong>
                      +{activity.points}
                    </strong>

                    <span>
                      points
                    </span>

                  </div>

                  <div className="activity-carbon">

                    <strong>
                      {activity.impact}
                    </strong>

                    <span>
                      kg CO₂
                    </span>

                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteActivity(activity.id)
                    }
                    type="button"
                  >
                    ×
                  </button>

                </div>

              ))

            )}

          </div>

        </section>

        {/* IMPACT */}

        <section
          className="impact-section"
          id="impact"
        >

          <div>

            <div className="badge">
              YOUR IMPACT
            </div>

            <h2>
              Small actions.
              <br />
              <span>Big difference.</span>
            </h2>

            <p>
              Every reusable bottle, recycled item,
              bike ride, and energy-saving action
              contributes to a healthier planet.
            </p>

            <a
              className="primary-button"
              href="#tracker"
            >
              Improve My Impact →
            </a>

          </div>

          <div className="impact-card">

            <div className="impact-top">

              <span>
                🌍 Your Eco Score
              </span>

              <strong>
                {dashboard.ecoScore}
              </strong>

            </div>

            <div className="progress">

              <div
                style={{
                  width: `${dashboard.ecoScore}%`,
                }}
              ></div>

            </div>

            <div className="impact-row">

              <span>
                🌱 Sustainable habits
              </span>

              <strong>
                {dashboard.activities}
              </strong>

            </div>

            <div className="impact-row">

              <span>
                ♻ Items tracked
              </span>

              <strong>
                {dashboard.activities}
              </strong>

            </div>

            <div className="impact-row">

              <span>
                💧 Water saved
              </span>

              <strong>
                —
              </strong>

            </div>

            <div className="impact-row">

              <span>
                🌱 CO₂ reduced
              </span>

              <strong>
                {dashboard.carbonSaved} kg
              </strong>

            </div>

          </div>

        </section>

        {/* ABOUT */}

        <section
          className="about-section"
          id="about"
        >

          <div className="about-card">

            <span className="big-leaf">
              🌱
            </span>

            <h2>
              Make sustainability a habit.
            </h2>

            <p>
              EcoTrack is designed to make environmental
              awareness simple, visual, and motivating.
            </p>

            <a
              className="primary-button"
              href="#tracker"
            >
              Begin Your Journey →
            </a>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer>

        <div className="logo">

          <span className="logo-icon">
            ♻
          </span>

          <span>
            EcoTrack
          </span>

        </div>

        <p>
          Track. Improve. Recycle. Impact. 🌍
        </p>

        <span>
          © 2026 EcoTrack
        </span>

      </footer>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);