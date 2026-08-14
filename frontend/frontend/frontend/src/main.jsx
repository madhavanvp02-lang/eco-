import React, {
  useEffect,
  useState
} from "react";

import {
  createRoot
} from "react-dom/client";

import {
  Leaf,
  ArrowRight,
  Bike,
  Recycle,
  Droplets,
  Zap,
  Trees,
  BarChart3,
  Target,
  Sparkles,
  Plus,
  X,
  Menu,
  Globe2
} from "lucide-react";

import "./styles.css";


const API =
  "http://localhost:5000/api";


/* =========================
   ECOCYCLE DATA
========================= */

const ecoCycle = [

  {
    number: "01",
    title: "Track",
    description:
      "Log transportation, recycling, energy and water activities.",
    icon: BarChart3
  },

  {
    number: "02",
    title: "Measure",
    description:
      "Convert your everyday activities into environmental metrics.",
    icon: Globe2
  },

  {
    number: "03",
    title: "Improve",
    description:
      "Discover practical ways to improve your environmental habits.",
    icon: Target
  },

  {
    number: "04",
    title: "Repeat",
    description:
      "Keep the cycle moving until sustainable actions become habits.",
    icon: Leaf
  }

];


/* =========================
   FEATURE CARDS
========================= */

const features = [

  {
    title: "Carbon Footprint",

    description:
      "Understand the estimated impact of your transportation and daily activities.",

    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",

    icon: Globe2
  },

  {
    title: "Circular Waste",

    description:
      "Track materials that you recycle and keep useful resources in circulation.",

    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",

    icon: Recycle
  },

  {
    title: "Clean Energy",

    description:
      "Monitor energy habits and find opportunities to reduce unnecessary usage.",

    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",

    icon: Zap
  }

];


/* =========================
   PARALLAX BACKGROUND
========================= */

function ParallaxBackground() {

  useEffect(() => {

    function handleMouseMove(event) {

      const x =
        event.clientX / window.innerWidth - 0.5;

      const y =
        event.clientY / window.innerHeight - 0.5;

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${x * 25}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${y * 20}px`
      );

    }

    window.addEventListener(
      "pointermove",
      handleMouseMove
    );

    return () => {

      window.removeEventListener(
        "pointermove",
        handleMouseMove
      );

    };

  }, []);


  return (

    <div
      className="parallax-background"
      aria-hidden="true"
    >

      <div className="green-orb"></div>

      <div className="blue-orb"></div>

      <div className="background-grid"></div>

      <div className="floating-particle particle-one">
        ✦
      </div>

      <div className="floating-particle particle-two">
        ✿
      </div>

      <div className="floating-particle particle-three">
        ❋
      </div>

    </div>

  );

}


/* =========================
   STAT COMPONENT
========================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description
}) {

  return (

    <div className="stat-card">

      <Icon />

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {description}
      </small>

    </div>

  );

}


/* =========================
   ACTIVITY ICON
========================= */

function ActivityIcon({
  type
}) {

  if (type === "Cycling") {
    return <Bike />;
  }

  if (type === "Recycling") {
    return <Recycle />;
  }

  if (type === "Water") {
    return <Droplets />;
  }

  if (type === "Energy") {
    return <Zap />;
  }

  return <Leaf />;
}


/* =========================
   MAIN APP
========================= */

function App() {

  const [
    dashboard,
    setDashboard
  ] = useState({

    ecoScore: 82,

    carbonSaved: 42.8,

    points: 2480,

    activities: 147,

    streak: 7

  });


  const [
    activities,
    setActivities
  ] = useState([]);


  const [
    showModal,
    setShowModal
  ] = useState(false);


  const [
    mobileMenu,
    setMobileMenu
  ] = useState(false);


  /* =========================
     LOAD API DATA
  ========================= */

  async function loadDashboard() {

    try {

      const [
        dashboardResponse,
        activitiesResponse
      ] = await Promise.all([

        fetch(
          `${API}/dashboard`
        ),

        fetch(
          `${API}/activities`
        )

      ]);


      const dashboardData =
        await dashboardResponse.json();


      const activityData =
        await activitiesResponse.json();


      setDashboard(
        dashboardData
      );


      setActivities(
        activityData
      );

    }

    catch (error) {

      console.log(
        "Backend not running yet."
      );

    }

  }


  useEffect(() => {

    loadDashboard();

  }, []);


  /* =========================
     ADD ACTIVITY
  ========================= */

  async function addActivity(
    event
  ) {

    event.preventDefault();


    const form =
      new FormData(
        event.currentTarget
      );


    const type =
      form.get("type");


    const value =
      form.get("value");


    await fetch(
      `${API}/activities`,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          type,
          value
        })

      }
    );


    event.currentTarget.reset();


    setShowModal(false);


    loadDashboard();

  }


  return (

    <div className="app">

      <ParallaxBackground />


      {/* =========================
          NAVIGATION
      ========================= */}

      <header className="navbar shell">

        <a
          className="logo"
          href="#"
        >

          <span className="logo-icon">
            <Leaf />
          </span>

          Eco<span>Track</span>

        </a>


        <nav
          className={
            mobileMenu
              ? "navigation mobile-open"
              : "navigation"
          }
        >

          <a href="#features">
            Features
          </a>

          <a href="#ecocycle">
            EcoCycle
          </a>

          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#impact">
            Impact
          </a>

        </nav>


        <button
          className="nav-button"
          onClick={() =>
            setShowModal(true)
          }
        >

          Start tracking

          <ArrowRight />

        </button>


        <button
          className="menu-button"
          onClick={() =>
            setMobileMenu(
              !mobileMenu
            )
          }
        >

          {mobileMenu
            ? <X />
            : <Menu />
          }

        </button>

      </header>


      <main>


        {/* =========================
            HERO
        ========================= */}

        <section className="hero shell">

          <div className="hero-content">

            <div className="eyebrow">

              <Sparkles />

              PERSONAL ENVIRONMENTAL
              INTELLIGENCE

            </div>


            <h1>

              Track your impact.

              <br />

              <em>
                Grow the change.
              </em>

            </h1>


            <p>

              EcoTrack turns everyday
              choices into clear
              environmental insights,
              helping you build habits
              that are better for the planet.

            </p>


            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  setShowModal(true)
                }
              >

                Log an eco action

                <ArrowRight />

              </button>


              <a
                href="#ecocycle"
                className="secondary-button"
              >

                Explore EcoCycle

                <Leaf />

              </a>

            </div>


            <div className="hero-proof">

              <div>

                <strong>
                  {dashboard.activities}
                </strong>

                actions tracked

              </div>


              <div>

                <strong>
                  {dashboard.carbonSaved} kg
                </strong>

                CO₂ saved

              </div>


              <div>

                <strong>
                  {dashboard.streak}
                </strong>

                day streak

              </div>

            </div>

          </div>


          {/* =========================
              HERO DASHBOARD
          ========================= */}

          <div className="hero-dashboard">

            <div className="planet-glow"></div>


            <div className="dashboard-preview">

              <div className="dashboard-top">

                YOUR ECO SCORE

                <span>
                  LIVE
                </span>

              </div>


              <div className="score-number">

                {dashboard.ecoScore}

                <small>
                  /100
                </small>

              </div>


              <div className="score-ring">

                <div>

                  <Leaf />

                  <strong>
                    Excellent
                  </strong>

                  <small>
                    Keep going
                  </small>

                </div>

              </div>


              <div className="dashboard-mini">

                <div>

                  <small>
                    CO₂ SAVED
                  </small>

                  <strong>
                    {dashboard.carbonSaved} kg
                  </strong>

                </div>


                <div>

                  <small>
                    ECO POINTS
                  </small>

                  <strong>
                    {dashboard.points}
                  </strong>

                </div>

              </div>


              <div className="chart-bars">

                {[40, 65, 50, 80, 55, 72, 90, 68, 95].map(
                  (height, index) => (

                    <span
                      key={index}
                      style={{
                        height:
                          `${height}%`
                      }}
                    />

                  )
                )}

              </div>

            </div>


            <div className="floating-card floating-one">

              <Bike />

              8 km cycling

            </div>


            <div className="floating-card floating-two">

              <Recycle />

              2.5 kg recycled

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section
          id="features"
          className="section shell"
        >

          <div className="section-heading">

            <div>

              <div className="eyebrow">

                ONE PLACE FOR YOUR IMPACT

              </div>

              <h2>

                Small actions,

                <br />

                <em>
                  measurable change.
                </em>

              </h2>

            </div>


            <p>

              EcoTrack brings your
              environmental habits into
              one calm, visual dashboard.

            </p>

          </div>


          <div className="feature-grid">

            {features.map(
              feature => {

                const Icon =
                  feature.icon;

                return (

                  <article
                    className="feature-card"
                    key={feature.title}
                  >

                    <img
                      src={feature.image}
                      alt=""
                    />


                    <div className="feature-overlay"></div>


                    <div className="feature-content">

                      <Icon />

                      <h3>
                        {feature.title}
                      </h3>

                      <p>
                        {feature.description}
                      </p>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </section>


        {/* =========================
            ECOCYCLE
        ========================= */}

        <section
          id="ecocycle"
          className="ecocycle-section"
        >

          <div className="shell">

            <div className="section-heading">

              <div>

                <div className="eyebrow">

                  THE ECOTRACK METHOD

                </div>

                <h2>

                  The

                  <em>
                    EcoCycle
                  </em>

                </h2>

              </div>


              <p>

                Track → Measure → Improve
                → Repeat.

                A continuous loop
                that turns awareness
                into action.

              </p>

            </div>


            <div className="ecocycle-wheel">

              <div className="cycle-orbit"></div>


              <div className="cycle-center">

                <Leaf />

                <strong>
                  ECOTRACK
                </strong>

                <small>
                  EVERY ACTION COUNTS
                </small>

              </div>


              {ecoCycle.map(
                (item, index) => {

                  const Icon =
                    item.icon;

                  return (

                    <article
                      className={`cycle-card cycle-${index + 1}`}
                      key={item.title}
                    >

                      <div className="cycle-icon">

                        <Icon />

                      </div>

                      <small>
                        {item.number}
                      </small>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                    </article>

                  );

                }
              )}

            </div>

          </div>

        </section>


        {/* =========================
            DASHBOARD
        ========================= */}

        <section
          id="dashboard"
          className="section shell"
        >

          <div className="section-heading">

            <div>

              <div className="eyebrow">

                YOUR COMMAND CENTER

              </div>

              <h2>

                A dashboard built for

                <em>
                  progress.
                </em>

              </h2>

            </div>


            <button
              className="primary-button"
              onClick={() =>
                setShowModal(true)
              }
            >

              <Plus />

              Add activity

            </button>

          </div>


          <div className="stats-grid">

            <StatCard
              icon={Leaf}
              label="Eco Score"
              value={`${dashboard.ecoScore}/100`}
              description="+6 this month"
            />


            <StatCard
              icon={Globe2}
              label="CO₂ Saved"
              value={`${dashboard.carbonSaved} kg`}
              description="estimated"
            />


            <StatCard
              icon={Sparkles}
              label="Eco Points"
              value={dashboard.points}
              description="all time"
            />


            <StatCard
              icon={Target}
              label="Active Streak"
              value={`${dashboard.streak} days`}
              description="personal best"
            />

          </div>


          <div className="activity-panel">

            <div className="activity-header">

              <div>

                <div className="eyebrow">
                  RECENT ACTIVITY
                </div>

                <h3>
                  Your eco trail
                </h3>

              </div>


              <button
                onClick={() =>
                  setShowModal(true)
                }
              >

                + Log action

              </button>

            </div>


            {activities.map(
              activity => (

                <div
                  className="activity-row"
                  key={activity.id}
                >

                  <div className="activity-icon">

                    <ActivityIcon
                      type={
                        activity.type
                      }
                    />

                  </div>


                  <div className="activity-info">

                    <strong>
                      {activity.type}
                    </strong>

                    <small>

                      {activity.value}

                      {" "}

                      {activity.unit}

                    </small>

                  </div>


                  <strong className="points">
                    +{activity.points} pts
                  </strong>

                </div>

              )
            )}

          </div>

        </section>


        {/* =========================
            IMPACT
        ========================= */}

        <section
          id="impact"
          className="impact-section"
        >

          <div className="shell impact-content">

            <Trees />

            <div className="eyebrow">

              THE BIGGER PICTURE

            </div>


            <h2>

              Your data becomes a

              <br />

              <em>
                better habit.
              </em>

            </h2>


            <p>

              EcoTrack makes
              sustainability actionable,
              not overwhelming.

            </p>


            <button
              className="primary-button"
              onClick={() =>
                setShowModal(true)
              }
            >

              Start your EcoCycle

              <ArrowRight />

            </button>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer shell">

        <a
          className="logo"
          href="#"
        >

          <span className="logo-icon">
            <Leaf />
          </span>

          Eco<span>Track</span>

        </a>


        <span>
          Track. Measure. Improve.
          Repeat. © 2026 EcoTrack.
        </span>

      </footer>


      {/* =========================
          ACTIVITY MODAL
      ========================= */}

      {showModal && (

        <div
          className="modal-background"
          onMouseDown={() =>
            setShowModal(false)
          }
        >

          <form
            className="activity-modal"
            onSubmit={addActivity}
            onMouseDown={event =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setShowModal(false)
              }
            >

              <X />

            </button>


            <div className="eyebrow">

              NEW ECO ACTION

            </div>


            <h2>
              Log your impact
            </h2>


            <label>

              Activity

              <select name="type">

                <option>
                  Cycling
                </option>

                <option>
                  Walking
                </option>

                <option>
                  Public transport
                </option>

                <option>
                  Recycling
                </option>

                <option>
                  Energy
                </option>

                <option>
                  Water
                </option>

              </select>

            </label>


            <label>

              Amount

              <input
                name="value"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 5"
                required
              />

            </label>


            <button
              className="primary-button modal-submit"
            >

              Add to EcoCycle

              <ArrowRight />

            </button>

          </form>

        </div>

      )}

    </div>

  );

}


createRoot(
  document.getElementById("root")
).render(
  <App />
);