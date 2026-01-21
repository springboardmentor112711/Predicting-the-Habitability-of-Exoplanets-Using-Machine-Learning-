import express, { type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Backend API is running" })
})

// Prediction endpoint
app.post("/api/predict", async (req: Request, res: Response) => {
  try {
    const {
      stellar_temperature,
      stellar_radius,
      stellar_mass,
      planet_radius,
      planet_mass,
      orbital_period,
      orbital_distance,
      eccentricity,
    } = req.body

    // TODO: Integrate with ML model predictions
    // For now, return a mock response
    const habitabilityScore = Math.random() * 100
    const classification =
      habitabilityScore > 60
        ? "Potentially Habitable"
        : habitabilityScore > 30
          ? "Moderately Habitable"
          : "Non-Habitable"

    res.json({
      habitabilityScore: Number.parseFloat(habitabilityScore.toFixed(2)),
      classification,
      input: {
        stellar_temperature,
        stellar_radius,
        stellar_mass,
        planet_radius,
        planet_mass,
        orbital_period,
        orbital_distance,
        eccentricity,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" })
  }
})

// Example planets endpoint
app.get("/api/example-planets", (req: Request, res: Response) => {
  const examplePlanets = [
    {
      name: "Earth",
      stellar_temperature: 5778,
      stellar_radius: 1.0,
      stellar_mass: 1.0,
      planet_radius: 1.0,
      planet_mass: 1.0,
      orbital_period: 365.25,
      orbital_distance: 1.0,
      eccentricity: 0.0167,
    },
    {
      name: "Proxima Centauri b",
      stellar_temperature: 3042,
      stellar_radius: 0.1374,
      stellar_mass: 0.1205,
      planet_radius: 1.1,
      planet_mass: 1.27,
      orbital_period: 11.186,
      orbital_distance: 0.0485,
      eccentricity: 0.11,
    },
  ]
  res.json(examplePlanets)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
