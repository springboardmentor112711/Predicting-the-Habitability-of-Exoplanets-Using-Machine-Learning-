//addEventListener for DOMContentLoaded to ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("rankTableBody");//tbody element for the rank table
    const totalSpan = document.getElementById("totalPlanets");//span element to show total number of planets
    const searchInput = document.getElementById("rankSearch");//input element for searching/filtering planets
    const sortButtons = document.querySelectorAll("[data-sort]");//buttons for sorting the table
    const pagination = document.getElementById("paginationControls");//page numbers
    const pageLabel = document.getElementById("pageLabel");//label to show current page

    //state variables
    //planets->all fetched planets
    //filtered->planets after applying search filter
    //currentSort->object holding current sort key and direction
    //currentPage->current page number in pagination
    //pageSize->number of items per page
    let planets = [];
    let filtered = [];
    let currentSort = { key: "habitability_probability", dir: "desc" };
    //sort by habitability_probability descending by default
    //struct sort{ char* key, char* dir;}
    let currentPage = 1;
    const pageSize = 10; // Page 1 shows top 10 most habitable

    fetchRankData();//kick off data fetching


//fetch rank data from server + filter planets array +sorting
    async function fetchRankData() {
        try {
            const res = await fetch("/rank-data");//fetch data from server endpoint
            const data = await res.json();//parse JSON response
            planets = (data.planets || []).map(p => ({//ensures safe number conversion and consistent property names
                ...p,
                id: Number(p.id ?? p.planet_id ?? 0),//if p.id exists,use else 0
                radius: Number(p.radius ?? 0),//if p.radius exists,use else 0
                mass: Number(p.mass ?? 0),//if p.mass exists,use else 0
                temp: Number(p.temp ?? 0),//if p.temp exists,use else 0
                habitability_probability: Number(p.habitability_probability ?? p.habitability ?? 0)//if p.habitability_probability exists,use else 0
            }));
            updateTotal();
            applySort();
            applyFilter(); //the pipeline counts planets,sort and apply filter and render table
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Failed to load rank data.</td></tr>`;
        }
    }
//updating total count of planets in UI
    function updateTotal() {
        if (totalSpan) totalSpan.textContent = planets.length;
    }

    //filter logic based on search input
    function applyFilter() {
        const q = (searchInput?.value || "").trim().toLowerCase();//converts search query to lowercase for case-insensitive matching
        filtered = planets.filter(p => {//loops over all planets
            if (!q) return true;
            return [p.radius, p.mass, p.temp].some(val => String(val).toLowerCase().includes(q));
        });//searches in radius,mass,temp properties of planet containing the query string
        currentPage = 1;
        render();
    }

    //sorting logic based on currentSort state
    function applySort() {
        planets.sort((a, b) => compare(a, b, currentSort));
        filtered = [...planets];//sorted planets are copied to filtered array
    }

    function compare(a, b, sort) {//compare function for sorting
        const { key, dir } = sort;
        const mult = dir === "desc" ? -1 : 1;//ascending or descending multiplier
        if (a[key] > b[key]) return mult;
        if (a[key] < b[key]) return -mult;
        return 0;
    }

    //rendering the table based on filtered and paginated data
    function render() {
        if (!tableBody) return;
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));//total number of pages
        const start = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize);//extracts items for current page

        if (!pageItems.length) {//shows message if no items match filter
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No planets match your filter.</td></tr>`;
        } else {
            tableBody.innerHTML = pageItems.map((p, idx) => {//creates rows for each planet in current page
                const rank = start + idx + 1;
                const hab = (p.habitability_probability * 100).toFixed(2);//convert to percentage with 2 decimal places
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

    //clickable rows to navigate to insights page
    function attachRowClicks(){
        if(!tableBody) return;
        const rows = tableBody.querySelectorAll("tr[data-planet-id]");
        rows.forEach(row => {
            const planetId = row.dataset.planetId;
            if(!planetId) return;
            row.style.cursor = "pointer";
            row.addEventListener("click", ()=>{
                window.location.href = `/insights?planet_id=${planetId}`;//navigate to insights page
            });
        });
    }

    function renderPagination(totalPages) {//pagination controls rendering
        if (!pagination) return;
        pagination.innerHTML = "";
        for (let p = 1; p <= totalPages; p++) {
            const li = document.createElement("li");
            li.className = `page-item ${p === currentPage ? "active" : ""}`;
            li.innerHTML = `<button class="page-link">${p}</button>`;
            li.addEventListener("click", () => {
                currentPage = p;
                render();//page change triggers re-render
            });
            pagination.appendChild(li);
        }
    }
//sort button state update
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
            //as user types in search box,currentPage resets to 1 and filter is applied
            currentPage = 1;
            applyFilter();
        });
    }
});

//This script dynamically fetches ranked exoplanet data from the backend, 
// maintains client-side state for sorting, filtering, and pagination, renders the data into an interactive table,
//  and enables navigation to detailed analytics through event-driven DOM manipulation.