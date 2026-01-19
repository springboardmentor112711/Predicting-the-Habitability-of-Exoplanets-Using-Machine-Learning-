// ===== PLANETARY REFERENCE DATA (used for comparative mode) ===== //
const planetReference = {
    Earth: {
        radius: 1,
        mass: 1,
        temp: 288,
        orbital_period: 365.25,
        distance_star: 1,
        star_temp: 5778,
        eccentricity: 0.0167,
        semi_major_axis: 1,
        star_type: "G"
    },
    Venus: {
        radius: 0.9499,
        mass: 0.815,
        temp: 737,
        orbital_period: 224.7,
        distance_star: 0.723,
        star_temp: 5778,
        eccentricity: 0.0068,
        semi_major_axis: 0.723,
        star_type: "G"
    },
    Mars: {
        radius: 0.532,
        mass: 0.107,
        temp: 210,
        orbital_period: 686.98,
        distance_star: 1.524,
        star_temp: 5778,
        eccentricity: 0.0934,
        semi_major_axis: 1.524,
        star_type: "G"
    },
    Jupiter: {
        radius: 11.21,
        mass: 317.8,
        temp: 165,
        orbital_period: 4332.59,
        distance_star: 5.204,
        star_temp: 5778,
        eccentricity: 0.0489,
        semi_major_axis: 5.204,
        star_type: "G"
    }
};

// ===== UI ELEMENTS =====//
const autofillCheckbox = document.getElementById("autofill");
const advancedFields = document.getElementById("advanced-fields");
const advancedNumeric = document.getElementById("advanced-numeric");
const advancedComparative = document.getElementById("advanced-comparative");
const numericFields = document.getElementById("numeric-fields");
const comparativeFields = document.getElementById("comparative-fields");
const modeRadios = document.querySelectorAll("input[name='inputMode']");
const numericRequired = [
    document.getElementById("radius"),
    document.getElementById("mass"),
    document.getElementById("temp")
];
const comparativeRequired = [
    document.getElementById("radiusComparative"),
    document.getElementById("massComparative"),
    document.getElementById("tempComparative")
];

function getCurrentMode(){
    const checked = document.querySelector("input[name='inputMode']:checked");
    return checked ? checked.value : "numeric";
}

function toggleAdvancedByMode(mode){
    if(!advancedFields){
        return;
    }

    if(autofillCheckbox && autofillCheckbox.checked){
        advancedFields.style.display = "none";
        return;
    }

    advancedFields.style.display = "block";
    if(advancedNumeric){
        advancedNumeric.style.display = mode === "numeric" ? "block" : "none";
    }
    if(advancedComparative){
        advancedComparative.style.display = mode === "comparative" ? "block" : "none";
    }
}

function toggleModeSections(){
    const mode = getCurrentMode();
    if(numericFields){
        numericFields.style.display = mode === "numeric" ? "block" : "none";
    }
    if(comparativeFields){
        comparativeFields.style.display = mode === "comparative" ? "block" : "none";
    }
    updateRequiredFields(mode);
    toggleAdvancedByMode(mode);
}

function updateRequiredFields(mode){
    numericRequired.forEach(el => {
        if(el){ el.required = mode === "numeric"; }
    });
    comparativeRequired.forEach(el => {
        if(el){ el.required = mode === "comparative"; }
    });
}

// Initial visibility setup and listeners
toggleModeSections();

if(modeRadios){
    modeRadios.forEach(radio => {
        radio.addEventListener("change", toggleModeSections);
    });
}

if(autofillCheckbox){
    autofillCheckbox.addEventListener("change", ()=>{
        toggleAdvancedByMode(getCurrentMode());
    });
}

// =====FORM SUBMISSION LOGIC =====//

const predictForm = document.getElementById("predictForm");
const resultDiv = document.getElementById("result");

function getComparativeValue(selectId, key){
    const select = document.getElementById(selectId);
    const planetKey = select ? select.value : null;
    const reference = planetKey ? planetReference[planetKey] : null;
    return reference ? reference[key] : NaN;
}

if(predictForm){
    predictForm.addEventListener("submit", async (event)=>{
        event.preventDefault(); //prevent default form submission

        //clear previous result
        resultDiv.innerHTML="";

        const mode = getCurrentMode();
        const autofill = autofillCheckbox ? autofillCheckbox.checked : false;
        const payload = { autofill };

        if(mode === "numeric"){
            payload.radius = parseFloat(document.getElementById("radius").value);
            payload.mass = parseFloat(document.getElementById("mass").value);
            payload.temp = parseFloat(document.getElementById("temp").value);

            if (!payload.autofill) {
                payload.orbital_period = parseFloat(document.getElementById("orbital_period").value);
                payload.distance_star = parseFloat(document.getElementById("distance_star").value);
                payload.star_temp = parseFloat(document.getElementById("star_temp").value);
                payload.eccentricity = parseFloat(document.getElementById("eccentricity").value);
                payload.semi_major_axis = parseFloat(document.getElementById("semi_major_axis").value);
                payload.star_type = document.getElementById("star_type").value;
            }
        }else{
            // Comparative selections translated into numeric values
            payload.radius = getComparativeValue("radiusComparative","radius");
            payload.mass = getComparativeValue("massComparative","mass");
            payload.temp = getComparativeValue("tempComparative","temp");

            if (!payload.autofill) {
                payload.orbital_period = getComparativeValue("orbital_period_comp","orbital_period");
                payload.distance_star = getComparativeValue("distance_star_comp","distance_star");
                payload.star_temp = getComparativeValue("star_temp_comp","star_temp");
                payload.eccentricity = getComparativeValue("eccentricity_comp","eccentricity");
                payload.semi_major_axis = getComparativeValue("semi_major_axis_comp","semi_major_axis");
                payload.star_type = getComparativeValue("star_type_comp","star_type");
            }
        }

        try {
            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            // response.ok to handle validation errors
            if (!response.ok) {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger">
                        ${data.error || "Prediction failed"}
                    </div>
                `;
                return;
            }

            // Display result
            displayResult(data);

        } catch (error) {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    Server error. Please try again.
                </div>
            `;
        }
    });
}

function displayResult(data) {
    const color = data.habitable === 1 ? "success" : "warning";

    resultDiv.innerHTML = `
        <div class="alert alert-${color}">
            <h5>${data.habitable ? "🌍 This planet is likely HABITABLE!" : "🪐 This planet is likely NOT habitable."}</h5>
            <p><strong>Mode:</strong> ${data.mode}</p>
            <p><strong>Habitability Score:</strong> ${(data.habitability_score * 100).toFixed(2)}%</p>
            <a href="/insights" class="btn btn-info mt-2">View Analytics</a>
        </div>
    `;
}

async function loadFactsCarousel(){
    const res = await fetch("/exoplanet-facts");
    const facts = await res.json();

    const container = document.getElementById("factsContainer");
    container.innerHTML = "";

    facts.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "carousel-item" + (index === 0 ? " active" : "");

        div.innerHTML = `
            <div class="fact-card">
                <h4>${item.title}</h4>
                <p>${item.fact}</p>
                <div class="mt-3">
                    <a href="/predict" class="btn btn-primary">Predict Habitability</a>
                    <a href="/insights" class="btn btn-outline-info">View Insights</a>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

loadFactsCarousel();
