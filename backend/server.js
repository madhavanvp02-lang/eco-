import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let activities = [
  {
    id: 1,
    type: "Cycling",
    value: 8,
    unit: "km",
    impact: 1.8,
    points: 24,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    type: "Recycling",
    value: 2.5,
    unit: "kg",
    impact: 3.2,
    points: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    type: "Public transport",
    value: 12,
    unit: "km",
    impact: 2.7,
    points: 18,
    createdAt: new Date().toISOString()
  }
];

const multipliers = {
  Cycling: {
    impact: 0.23,
    points: 3
  },

  Walking: {
    impact: 0.21,
    points: 3
  },

  "Public transport": {
    impact: 0.23,
    points: 1.5
  },

  Recycling: {
    impact: 1.28,
    points: 8
  },

  Energy: {
    impact: 0.42,
    points: 2
  },

  Water: {
    impact: 0.002,
    points: 0.2
  }
};

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "EcoTrack API",
    status: "running"
  });
});

/* =========================
   GET ALL ACTIVITIES
========================= */

app.get("/api/activities", (req, res) => {
  res.json({
    success: true,
    activities
  });
});

/* =========================
   DASHBOARD
========================= */

app.get("/api/dashboard", (req, res) => {
  const carbonSaved = activities.reduce(
    (total, activity) => total + activity.impact,
    0
  );

  const points = activities.reduce(
    (total, activity) => total + activity.points,
    0
  );

  const ecoScore = Math.min(
    100,
    Math.round(58 + points * 0.7)
  );

  res.json({
    success: true,
    dashboard: {
      ecoScore,
      carbonSaved: Number(carbonSaved.toFixed(1)),
      points: Math.round(points),
      activities: activities.length,
      streak: 7
    }
  });
});

/* =========================
   ADD ACTIVITY
========================= */

app.post("/api/activities", (req, res) => {
  const { type, value } = req.body;

  const numericValue = Number(value);

  if (
    !type ||
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: "Activity type and positive value are required."
    });
  }

  const config = multipliers[type] || {
    impact: 0.1,
    points: 1
  };

  let unit = "km";

  if (type === "Recycling") {
    unit = "kg";
  }

  if (type === "Energy") {
    unit = "kWh";
  }

  if (type === "Water") {
    unit = "L";
  }

  const activity = {
    id: Date.now(),
    type,
    value: numericValue,
    unit,

    impact: Number(
      (numericValue * config.impact).toFixed(2)
    ),

    points: Math.max(
      1,
      Math.round(numericValue * config.points)
    ),

    createdAt: new Date().toISOString()
  };

  activities.unshift(activity);

  res.status(201).json({
    success: true,
    activity
  });
});

/* =========================
   DELETE ACTIVITY
========================= */

app.delete("/api/activities/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = activities.findIndex(
    (activity) => activity.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Activity not found."
    });
  }

  const deletedActivity = activities.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Activity deleted.",
    activity: deletedActivity
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found."
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `EcoTrack API running at http://localhost:${PORT}`
  );
});