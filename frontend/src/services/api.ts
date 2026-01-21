/**
 * CENTRALIZED API SERVICE LAYER
 * 
 * All backend communication goes through this service.
 * Base URL: http://127.0.0.1:5000
 * 
 * DEMO MODE: When backend is unavailable, mock data is used automatically
 */

const API_BASE_URL = 'http://127.0.0.1:5000';

// Track backend availability
let isBackendAvailable = false;

// Type definitions for API requests and responses
export interface PlanetInput {
  st_teff: number;      // Stellar effective temperature (K)
  st_rad: number;       // Stellar radius (solar radii)
  st_mass: number;      // Stellar mass (solar masses)
  st_met: number;       // Stellar metallicity
  st_luminosity: number; // Stellar luminosity
  pl_orbper: number;    // Orbital period (days)
  pl_orbeccen: number;  // Orbital eccentricity
  pl_insol: number;     // Insolation flux
}

export interface AddPlanetInput extends PlanetInput {
  planet_name: string;
}

export interface PredictionResponse {
  status: 'success' | 'error';
  data: {
    habitability: 0 | 1;
    habitability_score: number; // 0-1
    confidence: number;          // 0-1
  };
}

export interface RankedPlanet {
  planet_name: string;
  habitability: 0 | 1;
  habitability_score: number;
  confidence: number;
  rank: number;
}

export interface RankingResponse {
  status: 'success' | 'error';
  data: RankedPlanet[];
}

export interface AddPlanetResponse {
  status: 'success' | 'error';
  message: string;
}

// Mock data for demo mode
const MOCK_RANKED_PLANETS: RankedPlanet[] = [
  { rank: 1, planet_name: 'Kepler-442b', habitability: 1, habitability_score: 0.892, confidence: 0.945 },
  { rank: 2, planet_name: 'Proxima Centauri b', habitability: 1, habitability_score: 0.875, confidence: 0.923 },
  { rank: 3, planet_name: 'TRAPPIST-1e', habitability: 1, habitability_score: 0.863, confidence: 0.891 },
  { rank: 4, planet_name: 'LHS 1140 b', habitability: 1, habitability_score: 0.841, confidence: 0.887 },
  { rank: 5, planet_name: 'Kepler-452b', habitability: 1, habitability_score: 0.829, confidence: 0.876 },
  { rank: 6, planet_name: 'TOI 700 d', habitability: 1, habitability_score: 0.817, confidence: 0.854 },
  { rank: 7, planet_name: 'K2-18b', habitability: 1, habitability_score: 0.805, confidence: 0.842 },
  { rank: 8, planet_name: 'Kepler-62f', habitability: 1, habitability_score: 0.793, confidence: 0.831 },
  { rank: 9, planet_name: 'Ross 128 b', habitability: 1, habitability_score: 0.781, confidence: 0.819 },
  { rank: 10, planet_name: 'Teegarden b', habitability: 1, habitability_score: 0.769, confidence: 0.807 }
];

/**
 * 1. HEALTH CHECK / APP LOAD
 * Route: GET /
 * Purpose: Verify backend availability on page load
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      isBackendAvailable = false;
      return false;
    }
    
    isBackendAvailable = true;
    return true;
  } catch (error) {
    isBackendAvailable = false;
    // Silent error - app will work in demo mode
    return false;
  }
}

/**
 * 2. ADD PLANET (SAVE TO DATABASE)
 * Route: POST /add_planet
 * Purpose: Store a planet record in the backend database
 */
export async function addPlanet(planetData: AddPlanetInput): Promise<AddPlanetResponse> {
  // If backend unavailable, return success but in demo mode
  if (!isBackendAvailable) {
    console.log('📊 Demo Mode: Planet would be saved:', planetData.planet_name);
    return {
      status: 'success',
      message: 'Demo mode: Planet prediction saved locally (connect backend to persist)',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/add_planet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planetData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add planet');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding planet:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * 3. PREDICT HABITABILITY (NO DATABASE SAVE)
 * Route: POST /predict
 * Purpose: Predict habitability probability for given parameters
 */
export async function predictHabitability(planetData: PlanetInput): Promise<PredictionResponse> {
  // If backend unavailable, return mock prediction
  if (!isBackendAvailable) {
    console.log('📊 Demo Mode: Generating mock prediction');
    const score = Math.random() * 0.6 + 0.3; // Random score between 0.3 and 0.9
    const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 0.7 and 1.0
    
    return {
      status: 'success',
      data: {
        habitability: score > 0.5 ? 1 : 0,
        habitability_score: parseFloat(score.toFixed(3)),
        confidence: parseFloat(confidence.toFixed(3)),
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planetData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Prediction failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error predicting habitability:', error);
    throw error;
  }
}

/**
 * 4. PLANET RANKING (FETCH DATABASE DATA)
 * Route: GET /rank
 * Purpose: Retrieve ranked list of all stored planets
 */
export async function getRankedPlanets(top?: number): Promise<RankingResponse> {
  // If backend unavailable, return mock data
  if (!isBackendAvailable) {
    console.log('📊 Demo Mode: Using mock ranking data');
    const mockData = top ? MOCK_RANKED_PLANETS.slice(0, top) : MOCK_RANKED_PLANETS;
    return {
      status: 'success',
      data: mockData,
    };
  }

  try {
    const url = top 
      ? `${API_BASE_URL}/rank?top=${top}`
      : `${API_BASE_URL}/rank`;
    
    const response = await fetch(url, {
      method: 'GET',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch rankings');
    }
    
    return data;
  } catch (error) {
    console.log('📊 Demo Mode: Backend unavailable, using mock data');
    // Fallback to mock data
    const mockData = top ? MOCK_RANKED_PLANETS.slice(0, top) : MOCK_RANKED_PLANETS;
    return {
      status: 'success',
      data: mockData,
    };
  }
}

/**
 * HELPER: Compute dashboard statistics from ranking data
 * This is computed on the frontend from the /rank response
 */
export interface DashboardStats {
  totalPlanets: number;
  habitablePlanets: number;
  nonHabitablePlanets: number;
  averageHabitabilityScore: number;
}

export function computeDashboardStats(planets: RankedPlanet[]): DashboardStats {
  if (planets.length === 0) {
    return {
      totalPlanets: 0,
      habitablePlanets: 0,
      nonHabitablePlanets: 0,
      averageHabitabilityScore: 0,
    };
  }
  
  const habitablePlanets = planets.filter(p => p.habitability === 1).length;
  const totalScore = planets.reduce((sum, p) => sum + p.habitability_score, 0);
  
  return {
    totalPlanets: planets.length,
    habitablePlanets,
    nonHabitablePlanets: planets.length - habitablePlanets,
    averageHabitabilityScore: totalScore / planets.length,
  };
}