async function loadRankings() {
    const res = await fetch("/rank-data");
    const data = await res.json();

    // Force sort: highest habitability first
    data.planets.sort((a,b) => b.habitability_probability - a.habitability_probability);

    const tbody = document.getElementById("rankTableBody");
    tbody.innerHTML = "";

    data.planets.forEach((p,i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${p.radius}</td>
            <td>${p.mass}</td>
            <td>${p.temp}</td>
            <td>${(p.habitability_probability * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

loadRankings();
