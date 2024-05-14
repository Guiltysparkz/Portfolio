// Fetch all works
let all_works = [];
async function fetching_works() {
    try {
        let fetched_works = await fetch("http://localhost:5678/api/works");
        if (!fetched_works.ok) {
            throw new Error("Network error" + fetched_works.statusText); // For network errors
        }
        all_works = await fetched_works.json(); // Object creation waits for fetch to finish
        add_works(all_works); // Pass the fetched works to add_works function
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Add all works
function add_works(works) {
    const gallery = document.getElementById("gallery");
    for (let i = 0; i < works.length; i++) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figcaption = document.createElement("figcaption");
        img.src = works[i].imageUrl;
        figcaption.textContent = works[i].title;
        figure.id = works[i].categoryId;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Fetch categories to enable filtering
let all_categories = [];
async function fetching_categories() {
    try {
        let fetched_categories = await fetch("http://localhost:5678/api/categories");
        if (!fetched_categories.ok) {
            throw new Error("Network error: " + fetched_categories.statusText);
        }
        all_categories = await fetched_categories.json();
        create_filtres(all_categories);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Generate filter buttons
function create_filtres(categories) {
    const filtres = document.getElementById("filtres");
    let filtre_reset = document.createElement("button");
    filtre_reset.id = "reset";
    let filtre_reset_text = document.createElement("p");
    filtre_reset_text.textContent = "Tous";
    filtre_reset.appendChild(filtre_reset_text);
    filtres.appendChild(filtre_reset);

    for (let i = 0; i < categories.length; i++) {
        let filtre_button = document.createElement("button");
        filtre_button.id = categories[i].id;
        let filtre_button_text = document.createElement("p");
        filtre_button_text.textContent = categories[i].name;
        filtre_button.appendChild(filtre_button_text);
        filtres.appendChild(filtre_button);
    }
    add_filtre_listener();
}

// Add listeners to all filter buttons
function add_filtre_listener() {
    const filtres_buttons = document.querySelectorAll("#filtres button");

    filtres_buttons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove the active class from all buttons
            filtres_buttons.forEach(btn => btn.classList.remove("filtres-active"));
            // Add the active class to the clicked button
            this.classList.add("filtres-active");
            // Filter the gallery items
            const gallery = document.querySelectorAll("#gallery figure");
            const filterId = this.id;
            // For each figure if button id is reset or same as figure id remove hide
            // else hide
            gallery.forEach(figure => {
                if (filterId === "reset" || figure.id === filterId) {
                    figure.classList.remove("figure-hide");
                } else {
                    figure.classList.add("figure-hide");
                }
            });
        });
    });
}

fetching_works();
fetching_categories();