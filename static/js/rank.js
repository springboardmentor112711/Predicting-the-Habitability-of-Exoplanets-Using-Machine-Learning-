document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("rankTableBody");
    const totalSpan = document.getElementById("totalPlanets");
    const searchInput = document.getElementById("rankSearch");
    const sortButtons = document.querySelectorAll("[data-sort]");
    const pagination = document.getElementById("paginationControls");
    const pageLabel = document.getElementById("pageLabel");

    let planets = [];
    let filtered = [];
    let currentSort = { key: "habitability_probability", dir: "desc" };
    let currentPage = 1;
    const pageSize = 10; // Page 1 shows top 10 most habitable

    fetchRankData();

    async function fetchRankData() {
        try {
            const res = await fetch("/rank-data");
            const data = await res.json();
            planets = (data.planets || []).map(p => ({
                ...p,
                id: Number(p.id ?? p.planet_id ?? 0),
                radius: Number(p.radius ?? 0),
                mass: Number(p.mass ?? 0),
                temp: Number(p.temp ?? 0),
                habitability_probability: Number(p.habitability_probability ?? p.habitability ?? 0)
            }));
            updateTotal();
            applySort();
            applyFilter();
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Failed to load rank data.</td></tr>`;
        }
    }

    function updateTotal() {
        if (totalSpan) totalSpan.textContent = planets.length;
    }

    function applyFilter() {
        const q = (searchInput?.value || "").trim().toLowerCase();
        filtered = planets.filter(p => {
            if (!q) return true;
            return [p.radius, p.mass, p.temp].some(val => String(val).toLowerCase().includes(q));
        });
        currentPage = 1;
        render();
    }

    function applySort() {
        planets.sort((a, b) => compare(a, b, currentSort));
        filtered = [...planets];
    }

    function compare(a, b, sort) {
        const { key, dir } = sort;
        const mult = dir === "desc" ? -1 : 1;
        if (a[key] > b[key]) return mult;
        if (a[key] < b[key]) return -mult;
        return 0;
    }

    function render() {
        if (!tableBody) return;
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        const start = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);

        if (!pageItems.length) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No planets match your filter.</td></tr>`;
        } else {
            tableBody.innerHTML = pageItems.map((p, idx) => {
                const rank = start + idx + 1;
                const hab = (p.habitability_probability * 100).toFixed(2);
                return `
                    <tr data-planet-id="${p.id || ''}">
                        <td>${rank}</td>
                        <td>${p.radius}</td>
                        <td>${p.mass}</td>
                        <td>${p.temp}</td>
                        <td>${hab}%</td>
                    </tr>
                `;
            }).join("");
        }

        renderPagination(totalPages);
        if (pageLabel) pageLabel.textContent = `Page ${currentPage} / ${totalPages}`;
        updateSortButtons();
        attachRowClicks();
    }

    function attachRowClicks(){
        if(!tableBody) return;
        const rows = tableBody.querySelectorAll("tr[data-planet-id]");
        rows.forEach(row => {
            const planetId = row.dataset.planetId;
            if(!planetId) return;
            row.style.cursor = "pointer";
            row.addEventListener("click", ()=>{
                window.location.href = `/insights?planet_id=${planetId}`;
            });
        });
    }

    function renderPagination(totalPages) {
        if (!pagination) return;
        pagination.innerHTML = "";
        for (let p = 1; p <= totalPages; p++) {
            const li = document.createElement("li");
            li.className = `page-item ${p === currentPage ? "active" : ""}`;
            li.innerHTML = `<button class="page-link">${p}</button>`;
            li.addEventListener("click", () => {
                currentPage = p;
                render();
            });
            pagination.appendChild(li);
        }
    }

    function updateSortButtons() {
        sortButtons.forEach(btn => {
            const key = btn.dataset.sort;
            btn.classList.toggle("active", key === currentSort.key);
            btn.innerHTML = key === currentSort.key
                ? `${btn.dataset.label} ${currentSort.dir === "desc" ? "↓" : "↑"}`
                : btn.dataset.label;
        });
    }

    sortButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.sort;
            if (currentSort.key === key) {
                currentSort.dir = currentSort.dir === "desc" ? "asc" : "desc";
            } else {
                currentSort.key = key;
                currentSort.dir = key === "habitability_probability" ? "desc" : "asc";
            }
            applySort();
            applyFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            applyFilter();
        });
    }
});
