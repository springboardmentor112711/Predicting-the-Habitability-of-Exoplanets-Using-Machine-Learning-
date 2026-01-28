function getInputData() {
    return {
        pl_rade: parseFloat(pl_rade.value),
        pl_bmasse: parseFloat(pl_bmasse.value),
        pl_orbsmax: parseFloat(pl_orbsmax.value),
        st_teff: parseFloat(st_teff.value),
        st_met: parseFloat(st_met.value),
        st_luminosity: parseFloat(st_luminosity.value),
        pl_luminosity: parseFloat(pl_luminosity.value),
        stellar_compatibility_index: parseFloat(stellar_compatibility_index.value)
    };
}

function predict() {
    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getInputData())
    })
    .then(res => res.json())
    .then(data => {
        const card = document.getElementById("resultCard");
        card.classList.remove("d-none");

        document.getElementById("resultClass").innerText =
            data.habitability_class;

        document.getElementById("resultProb").innerText =
            `Probability: ${data.habitability_probability}`;
    });
}

function loadRanking() {
    fetch("/rank")
        .then(res => res.json())
        .then(data => {
            let table = document.getElementById("rankingTable");
            table.innerHTML = "";

            data.forEach(p => {
                table.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.habitability_score.toFixed(3)}</td>
                    </tr>
                `;
            });
        });
}
