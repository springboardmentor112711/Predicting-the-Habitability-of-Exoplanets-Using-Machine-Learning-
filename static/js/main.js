// =====CONTEXT AWARE UI LOGIC ==//

//Get elements
//getElementById --fetches HTML elements connects JS<==> HTML
const autofillCheckbox = document.getElementById("autofill");
const advancedFields =document.getElementById("advanced-fields");

//Safety check -------
if( autofillCheckbox && advancedFields){

    //Default state: autofill OFF ->show advanced fields
    advancedFields.style.display="block";

//addEventListener --fires whenever checkbox is checked
    autofillCheckbox.addEventListener("change",()=>{
        if(autofillCheckbox.checked){
            advancedFields.style.display="none";
        }else{
            advancedFields.style.display="block";
        }
    });
}

// =====FORM SUBMISSION LOGIC =====//

const predictForm = document.getElementById("predictForm");
const resultDiv = document.getElementById("result");

if(predictForm){
    predictForm.addEventListener("submit", async (event)=>{
        event.preventDefault(); //prevent default form submission

        //clear previous result
        resultDiv.innerHTML="";

        //collect compulsory fields
        const payload = {
            radius: parseFloat(document.getElementById("radius").value),
            mass: parseFloat(document.getElementById("mass").value),
            temp: parseFloat(document.getElementById("temp").value),
            autofill: document.getElementById("autofill").checked
        };

        //if autofill is OFF,collect all fields --parsefloat to send only numbers
        if (!payload.autofill) {
            payload.orbital_period = parseFloat(document.getElementById("orbital_period").value);
            payload.distance_star = parseFloat(document.getElementById("distance_star").value);
            payload.star_temp = parseFloat(document.getElementById("star_temp").value);
            payload.eccentricity = parseFloat(document.getElementById("eccentricity").value);
            payload.semi_major_axis = parseFloat(document.getElementById("semi_major_axis").value);
            payload.star_type = document.getElementById("star_type").value;
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
//response.ok to handle validation errors
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

    let message = "";
    let alertClass = "";

    if (data.habitable === 1) {
        message = "🌍 This planet is likely HABITABLE!";
        alertClass = "alert-success";
    } else {
        message = "🪐 This planet is likely NOT habitable.";
        alertClass = "alert-warning";
    }

    resultDiv.innerHTML = `
        <div class="alert ${alertClass}">
            <h5>${message}</h5>
            <p><strong>Mode:</strong> ${data.mode}</p>
            <p><strong>Habitability Score:</strong> ${(data.habitability_score * 100).toFixed(2)}%</p>
        </div>
    `;
}


