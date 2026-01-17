async function loadRankings() {
    const res = await fetch("/rank-data");
    const data = await res.json();

    const tbody = document.getElementById("rankTableBody");
    tbody.innerHTML = "";

    data.planets.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.rank}</td>
            <td>${p.radius}</td>
            <td>${p.mass}</td>
            <td>${p.temp}</td>
            <td>${(p.habitability_probability * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(row);
    });
}

loadRankings();
