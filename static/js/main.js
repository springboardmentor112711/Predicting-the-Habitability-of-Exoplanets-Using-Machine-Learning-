// ===== PLANETARY REFERENCE DATA (used for comparative mode) ===== //
//this is used to store planet ref data,control ui behavior,collect user inputs and recieve response

// Initialize Bootstrap tooltips when page loads
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

const planetReference = { //const means constant and planetReference is an object storing data about different planets
    //like Map<string, object>
    Earth: { //Earth is the key and its value is another object with various properties
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
    } //this is used for comparative mode to get reference values for different planets
};

// ===== UI ELEMENTS =====//
//DOM access so that JS can read values,change visibility and attach events
const autofillCheckbox = document.getElementById("autofill");
const advancedFields = document.getElementById("advanced-fields");
const advancedNumeric = document.getElementById("advanced-numeric");
const advancedComparative = document.getElementById("advanced-comparative");
const numericFields = document.getElementById("numeric-fields");
const comparativeFields = document.getElementById("comparative-fields");
//querySelectorAll finds all inputs with inputMode and returns a list
const modeRadios = document.querySelectorAll("input[name='inputMode']");
const numericRequired = [
    document.getElementById("radius"),
    document.getElementById("mass"),
    document.getElementById("temp")
];
const comparativeRequired = [ //for comparative mode
    document.getElementById("radiusComparative"),
    document.getElementById("massComparative"),
    document.getElementById("tempComparative")
];

//this part handles mode switching and field visibility logic
function getCurrentMode(){
    const checked = document.querySelector("input[name='inputMode']:checked");
    return checked ? checked.value : "numeric";
}
//this function checks if input mode is numeric or comparative and shows/hides advanced fields accordingly

function toggleAdvancedByMode(mode){
    if(!advancedFields){
        return;
    }

    if(autofillCheckbox && autofillCheckbox.checked){
        advancedFields.style.display = "none";
        return; //if autofill is checked, hide advanced fields
    }

    advancedFields.style.display = "block"; //if autofill is off, show advanced fields
    if(advancedNumeric){
        advancedNumeric.style.display = mode === "numeric" ? "block" : "none";
    }//If mode is numeric → show numeric advanced fields
    if(advancedComparative){
        advancedComparative.style.display = mode === "comparative" ? "block" : "none";
    }
}

//this function toggles visibility of sections based on selected mode
function toggleModeSections(){
    const mode = getCurrentMode();
    if(numericFields){
        numericFields.style.display = mode === "numeric" ? "block" : "none";
    }//If mode is numeric → show numeric fields
    if(comparativeFields){
        comparativeFields.style.display = mode === "comparative" ? "block" : "none";
    }//If mode is comparative → show comparative fields
    updateRequiredFields(mode);
    toggleAdvancedByMode(mode);
}

function updateRequiredFields(mode){ //handles HTML 'required' attribute based on mode
    numericRequired.forEach(el => {
        if(el){ el.required = mode === "numeric"; } //loops over numeric fields and if mode is numeric->required and true
    });
    comparativeRequired.forEach(el => {
        if(el){ el.required = mode === "comparative"; }
    });
}

// Initial visibility setup and listeners
toggleModeSections(); //this runs once page loads to set initial visibility

// ===== EVENT LISTENERS =====//
//what are Eventisteners? They wait for user actions like clicks or changes and then run specified functions
if(modeRadios){
    modeRadios.forEach(radio => {
        radio.addEventListener("change", toggleModeSections);
    });//for every radiobutton chnage,recalculate ui by calling toggleModeSections
}

if(autofillCheckbox){
    autofillCheckbox.addEventListener("change", ()=>{
        toggleAdvancedByMode(getCurrentMode());
    });//when autofill checkbox changes, recalculate advanced fields visibility
}

// =====FORM SUBMISSION LOGIC =====//
//Data leaves the browser->Goes to Flask->Comes back->And is shown to the user

const predictForm = document.getElementById("predictForm");
const resultDiv = document.getElementById("result");

// --- Request debouncing to prevent duplicate submissions ---
let isSubmitting = false;
const SUBMIT_DELAY = 1000; // Minimum 1 second between requests

function getComparativeValue(selectId, key){
    //This function:
//Takes a dropdown ID->Takes a feature name->Returns a numeric value from planetReference
    const select = document.getElementById(selectId);
    const planetKey = select ? select.value : null;
    const reference = planetKey ? planetReference[planetKey] : null;
    return reference ? reference[key] : NaN;
}
//when the form is submitted, prevent default behavior and handle submission with JS
if(predictForm){
    predictForm.addEventListener("submit", async (event)=>{ //async because we will use await inside
        event.preventDefault(); //prevent default form submission

        // Prevent duplicate submissions (debounce)
        if (isSubmitting) {
            console.log("Request already in progress, ignoring duplicate click");
            return;
        }

        //clear previous result
        resultDiv.innerHTML="";

        const mode = getCurrentMode();
        const autofill = autofillCheckbox ? autofillCheckbox.checked : false;
        const payload = { autofill };

        if(mode === "numeric"){ //parseFloat converts "123.45" to 123.45
            payload.radius = parseFloat(document.getElementById("radius").value);
            payload.mass = parseFloat(document.getElementById("mass").value);
            payload.temp = parseFloat(document.getElementById("temp").value);

            if (!payload.autofill) { //if autofill is off, get advanced numeric inputs
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

            if (!payload.autofill) { //if autofill is off, get advanced comparative inputs
                payload.orbital_period = getComparativeValue("orbital_period_comp","orbital_period");
                payload.distance_star = getComparativeValue("distance_star_comp","distance_star");
                payload.star_temp = getComparativeValue("star_temp_comp","star_temp");
                payload.eccentricity = getComparativeValue("eccentricity_comp","eccentricity");
                payload.semi_major_axis = getComparativeValue("semi_major_axis_comp","semi_major_axis");
                payload.star_type = getComparativeValue("star_type_comp","star_type");
            }
        }

        // Send data to server
        try {
            // Mark submission as in progress
            isSubmitting = true;
            
            const response = await fetch("/predict", { //similar to POST/predict
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
//wait for server response
            const data = await response.json();
            //Flask returns smtg like {habitable: 1, mode: "numeric", habitability_score: 0.85}
            // response.ok to handle validation errors
            if (!response.ok) {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger">
                        ${data.error || "Prediction failed"}
                    </div>
                `;
                isSubmitting = false;
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
        } finally {
            // Re-enable submission after delay
            setTimeout(() => {
                isSubmitting = false;
            }, SUBMIT_DELAY);
        }
    });
}

function clearForm() {
    // Clear numeric input fields
    document.getElementById("radius").value = "";
    document.getElementById("mass").value = "";
    document.getElementById("temp").value = "";
    document.getElementById("orbital_period").value = "";
    document.getElementById("distance_star").value = "";
    document.getElementById("star_temp").value = "";
    document.getElementById("eccentricity").value = "";
    document.getElementById("semi_major_axis").value = "";

    // Clear comparative input fields
    document.getElementById("radiusComparative").value = "Earth";
    document.getElementById("massComparative").value = "Earth";
    document.getElementById("tempComparative").value = "Earth";
    document.getElementById("orbital_period_comp").value = "Earth";
    document.getElementById("distance_star_comp").value = "Earth";
    document.getElementById("eccentricity_comp").value = "Earth";
    document.getElementById("semi_major_axis_comp").value = "Earth";
    document.getElementById("star_temp_comp").value = "Earth";
    document.getElementById("star_type_comp").value = "Earth";

    // Reset mode toggle to numeric
    document.getElementById("modeNumeric").checked = true;
    toggleModeSections();

    // Uncheck autofill
    const autofillCheckbox = document.getElementById("autofill");
    if (autofillCheckbox) {
        autofillCheckbox.checked = false;
    }

    // Clear result div
    resultDiv.innerHTML = "";

    // Scroll to form
    document.getElementById("predictForm").scrollIntoView({ behavior: "smooth" });
}

function displayResult(data) {
    const color = data.habitable === 1 ? "success" : "warning";
    const duplicateMessage = data.duplicate
        ? `<p class="mb-2 text-muted">⚠️ This planet already exists in the database. Check the rank page.</p>`
        : "";
    const insightsLink = data.planet_id
        ? `/insights?planet_id=${data.planet_id}`
        : "/insights";

    resultDiv.innerHTML = `
        <div class="alert alert-${color}">
            <h5>${data.habitable ? "🌍 This planet is likely HABITABLE!" : "🪐 This planet is likely NOT habitable."}</h5>
            <p><strong>Mode:</strong> ${data.mode}</p>
            <p><strong>Habitability Score:</strong> ${(data.habitability_score * 100).toFixed(2)}%</p>
            ${duplicateMessage}
            <a href="${insightsLink}" class="btn btn-info mt-2">View Analytics</a>
            <button onclick="clearForm()" class="btn btn-primary mt-2 ms-2">Predict Another</button>
        </div>
    `;
}

// ===== FACTS CAROUSEL LOGIC =====//
async function loadFactsCarousel(){ //async because we will use await inside
    const res = await fetch("/exoplanet-facts");
    const facts = await res.json();

    const container = document.getElementById("factsContainer");
    container.innerHTML = "";

    facts.forEach((item, index) => { //create carousel items dynamically
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

loadFactsCarousel(); //call the function to load facts when page loads

//multi line comment explaining data flow
//HTML form
//   ↓
//JavaScript collects input
//   ↓
//fetch() sends JSON
//   ↓
//Flask /predict
//   ↓
//ML model
//   ↓
//JSON response
//   ↓
//JavaScript updates UI
