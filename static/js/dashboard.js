document.addEventListener("DOMContentLoaded", () => {
    const singleInsights = document.getElementById("singleInsights");
    const singlePlaceholder = document.getElementById("singlePlaceholder");
    const allInsights = document.getElementById("allInsights");
    const habitabilityBar = document.getElementById("singleHabitabilityBar");
    const riskBadge = document.getElementById("riskBadge");
    const habitabilityReason = document.getElementById("habitabilityReason");
    const paramTable = document.getElementById("singlePlanetTable");
    const modeRadios = document.querySelectorAll("input[name='insightsMode']");

    const earthReference = {
        radius: 1,
        mass: 1,
        temp: 288,
        orbital_period: 365.25,
        distance_star: 1,
        star_temp: 5778,
        eccentricity: 0.0167,
        semi_major_axis: 1
    };

    let currentPlanet = null;
    const planetId = new URLSearchParams(window.location.search).get("planet_id");

    if (planetId) {
        loadSinglePlanet(planetId);
        document.getElementById("modeSingle").checked = true;
        toggleMode("single");
    } else {
        toggleMode("all");
    }

    modeRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            toggleMode(e.target.value);
        });
    });

    function toggleMode(mode) {
        if (mode === "single") {
            if (allInsights) allInsights.style.display = "none";
            if (currentPlanet) {
                if (singleInsights) singleInsights.style.display = "flex";
                if (singlePlaceholder) singlePlaceholder.style.display = "none";
            } else {
                if (singleInsights) singleInsights.style.display = "none";
                if (singlePlaceholder) singlePlaceholder.style.display = "flex";
            }
            if (!currentPlanet && planetId) {
                loadSinglePlanet(planetId);
            }
        } else {
            if (singleInsights) singleInsights.style.display = "none";
            if (singlePlaceholder) singlePlaceholder.style.display = "none";
            if (allInsights) allInsights.style.display = "flex";
            // Force Plotly to recalculate chart sizes after showing
            setTimeout(() => {
                Plotly.Plots.resize("featureImportanceChart");
                Plotly.Plots.resize("scoreDistributionChart");
                Plotly.Plots.resize("correlationHeatmap");
            }, 50);
        }
    }

    loadFeatureImportance();
    loadScoreDistribution();
    loadCorrelations();

    async function loadSinglePlanet(id){
        try{
            const res = await fetch(`/planet/${id}`);
            const data = await res.json();
            if(!res.ok || !data.planet){
                return;
            }
            currentPlanet = data.planet;
            renderSinglePlanet(currentPlanet);
        if (singlePlaceholder) singlePlaceholder.style.display = "none";
        }catch(err){
            console.error("Failed to load planet", err);
        }
    }

    function renderSinglePlanet(p){
        if(!singleInsights) return;
        singleInsights.style.display = "flex";
        const score = Number(p.habitability_probability || 0);
        const pct = Math.max(0, Math.min(1, score)) * 100;
        if(habitabilityBar){
            habitabilityBar.style.width = `${pct.toFixed(1)}%`;
            habitabilityBar.textContent = `${pct.toFixed(1)}%`;
        }

        const risk = pct >= 66 ? "Low" : pct >= 33 ? "Medium" : "High";
        if(riskBadge){
            riskBadge.textContent = risk;
            riskBadge.className = `badge ${risk === "Low" ? "bg-success" : risk === "Medium" ? "bg-warning text-dark" : "bg-danger"}`;
        }

        if(habitabilityReason){
            habitabilityReason.textContent = pct >= 50
                ? "Why this planet is habitable: parameters align closely with known habitable ranges."
                : "Why this planet is not habitable: parameters deviate from known habitable ranges.";
        }

        if(paramTable){
            const rows = [
                ["Radius", p.radius],
                ["Mass", p.mass],
                ["Temperature", p.temp],
                ["Orbital Period", p.orbital_period],
                ["Distance From Star", p.distance_star],
                ["Star Temperature", p.star_temp],
                ["Eccentricity", p.eccentricity],
                ["Semi Major Axis", p.semi_major_axis],
                ["Star Type", p.star_type]
            ];
            paramTable.innerHTML = rows.map(([label, value]) => `
                <tr>
                    <th class="text-info">${label}</th>
                    <td>${value ?? '--'}</td>
                </tr>
            `).join("");
        }

        renderEarthComparison(p);
    }

    function renderEarthComparison(p) {
        const metrics = [
            { 
                name: "Radius", 
                planet: (Number(p.radius) || 0) / earthReference.radius,
                earth: 1.0 
            },
            { 
                name: "Mass", 
                planet: (Number(p.mass) || 0) / earthReference.mass,
                earth: 1.0 
            },
            { 
                name: "Temperature", 
                planet: (Number(p.temp) || 0) / earthReference.temp,
                earth: 1.0 
            },
            { 
                name: "Orbital Period", 
                planet: (Number(p.orbital_period) || 0) / earthReference.orbital_period,
                earth: 1.0 
            }
        ];

        const trace1 = {
            x: metrics.map(m => m.name),
            y: metrics.map(m => m.planet),
            name: "This Planet",
            type: "bar",
            marker: { color: "#00e5ff" }
        };

        const trace2 = {
            x: metrics.map(m => m.name),
            y: metrics.map(m => m.earth),
            name: "Earth",
            type: "bar",
            marker: { color: "#0077ff" }
        };

        const layout = {
            title: "Planet vs Earth (Relative Comparison)",
            barmode: "group",
            xaxis: { title: "Metric" },
            yaxis: { title: "Relative to Earth (× Earth)" }
        };

        Plotly.newPlot("earthComparisonChart", [trace1, trace2], layout);
    }

    async function loadFeatureImportance() {
        const res=await fetch("/feature-importance");
        const data=await res.json();

        const features=data.feature_importance.map(f => f.feature);
        const importance=data.feature_importance.map(f => f.importance);

        const trace={
            x:importance,
            y:features,
            type:"bar",
            orientation:"h"
        };

        const layout ={
            title:"Feature Importance for Habitability Prediction",
            xaxis:{ title: "Importance Score"},
            margin:{ l:120}
        };

        Plotly.newPlot("featureImportanceChart",[trace],layout);
    }

    async function loadScoreDistribution() {
        const res=await fetch("/score-distribution");
        const data=await res.json();

        const trace={
            x:data.scores,
            type:"histogram"
        };

        const layout={
            title:"Habitability Score Distribution",
            xaxis:{title:"Habitability Probability"},
            yaxis:{title:"Number of Exoplanets"}
        };

        Plotly.newPlot("scoreDistributionChart",[trace],layout);
    }

    async function loadCorrelations() {
        const res =await fetch("/correlations");
        const data=await res.json();

        const trace={
            z:data.matrix,
            x:data.labels,
            y:data.labels,
            type:"heatmap"
        };

        const layout={
            title:"Star-Planet Correlation Heatmap"
        };

        Plotly.newPlot("correlationHeatmap",[trace],layout);
    }
});