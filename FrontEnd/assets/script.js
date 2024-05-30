document.addEventListener('DOMContentLoaded', async () => {
    const myToken = localStorage.getItem("loginToken");
    const isAdmin = myToken?.length > 0;

    if (isAdmin) {
        await fetchWorks();
        setupModalButton();
    }
});

function setupModalButton() {
    const modalButton = document.getElementById('modal_button');
    if (modalButton) {
        modalButton.addEventListener('click', createModale);
    } else {
        console.error('Modal button not found.');
    }
}

async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error("Network error: " + response.statusText);
        }
        allWorks = await response.json();
        updateGalleries();
        categories = extractCategories(allWorks);
        createFilters(categories);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function extractCategories(works) {
    const categorySet = new Set();
    return works.reduce((acc, work) => {
        const { id, name } = work.category;
        if (!categorySet.has(id)) {
            acc.push({ id, name });
            categorySet.add(id);
        }
        return acc;
    }, []);
}

function addWorks(works) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = ''; // Clear existing works
    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}" id="${work.id}">
            <figcaption>${work.title}</figcaption>
        `;
        figure.id = work.categoryId;
        figure.className = work.id;
        gallery.appendChild(figure);
    });
}

function createFilters(categories) {
    const filters = document.getElementById("filtres");
    if (!filters) return;
    
    filters.innerHTML = ''; // Clear existing filters
    const resetButton = createButton("reset", "Tous");
    filters.appendChild(resetButton);

    categories.forEach(category => {
        const filterButton = createButton(category.id, category.name);
        filters.appendChild(filterButton);
    });

    addFilterListener();
}

function createButton(id, text) {
    const button = document.createElement("button");
    button.id = id;
    button.innerHTML = `<p>${text}</p>`;
    return button;
}

function addFilterListener() {
    const filterButtons = document.querySelectorAll("#filtres button");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("filtres-active"));
            button.classList.add("filtres-active");

            const gallery = document.querySelectorAll("#gallery figure");
            const filterId = button.id;

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

function addWorksToModale() {
    const modaleGallery = document.getElementById("modale_gallery");
    if (!modaleGallery) return;

    modaleGallery.innerHTML = ''; // Clear existing works in modaleGallery

    allWorks.forEach((work) => {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${work.imageUrl}" id="${work.id}">
            <div class="remove_work" id="${work.id}">
                <img src="./assets/icons/trashbin.svg" id="${work.id}">
            </div>
        `;
        modaleGallery.appendChild(figure);

        figure.querySelector('.remove_work').addEventListener('click', async (event) => {
            const removeWorkId = event.currentTarget.id; // Use event.currentTarget.id for div id
            try {
                const response = await fetch(`http://localhost:5678/api/works/${removeWorkId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network error: ${response.statusText} - ${errorText}`);
                }
                await fetchWorks();
            } catch (error) {
                console.error('Upload error:', error);
                alert(`Failed to remove work: ${error.message}`);
            }
        });
    });
}

function appendingOneWork() {
    const modaleAddPhotoButton = document.getElementById('modale_addPhoto_button');
    if (!modaleAddPhotoButton) return;

    modaleAddPhotoButton.addEventListener('click', () => {
        const modaleGallery = document.getElementById('modale_gallery');
        if (modaleGallery) modaleGallery.style.display = "none";

        modaleAddPhotoButton.style.display = "none";

        const modaleTitle = document.getElementById('modale_title');
        if (modaleTitle) modaleTitle.innerText = 'Ajout photo';

        const photoForm = createPhotoForm();
        const modaleWrapper = document.getElementById('modale_wrapper');
        if (modaleWrapper) modaleWrapper.appendChild(photoForm);

        photoForm.querySelector('#photo_upload_input').addEventListener('change', handleFileUpload);
        photoForm.addEventListener('submit', handleSubmit);

        toggleSubmitButtonState(photoForm);
    });
}

function createPhotoForm() {
    const form = document.createElement('form');
    form.id = 'photo_form';
    form.enctype = 'multipart/form-data';
    form.method = 'POST';

    form.innerHTML = `
        <div id="photo_preview">
            <img id="photo_preview_img" src="./assets/icons/default-upload-img.svg">
            <input type="file" id="photo_upload_input" name="image" accept="image/*">
            <p id="photo_upload_requirements">jpg, png: 4mo max</p>
        </div>
        <label id="photo_form_work_title">Titre</label>
        <input name="title" type="text" id="photo_form_work_title_input">
        <label id="photo_form_category_list_title">Catégorie</label>
        <select id="photo_form_category" name="category">
            ${categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
        </select>
        <button id="modale_confirm_addPhoto_button" type="submit" disabled>Valider</button>
    `;

    return form;
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const fileSize = file.size / (1024 * 1024);
        if (fileSize > 4) {
            alert('File size exceeds 4MB');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('photo_preview_img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network error: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        alert('Photo uploaded successfully!');
        event.target.reset();
        document.getElementById('photo_preview_img').src = './assets/icons/default-upload-img.svg';

        allWorks.push(result);
        updateGalleries(); // Update galleries with new photo

        // Reset modale
        const modaleGallery = document.getElementById('modale_gallery');
        const modaleAddPhotoButton = document.getElementById('modale_addPhoto_button');
        const modaleTitle = document.getElementById('modale_title');

        if (modaleGallery) modaleGallery.style.display = "flex";
        if (modaleAddPhotoButton) modaleAddPhotoButton.style.display = "flex";
        if (modaleTitle) modaleTitle.innerText = 'Galerie photo';
    } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload photo: ${error.message}`);
    }
}

function toggleSubmitButtonState(form) {
    const submitButton = form.querySelector('#modale_confirm_addPhoto_button');
    const imageInput = form.querySelector('#photo_upload_input');
    const titleInput = form.querySelector('#photo_form_work_title_input');

    function updateButtonState() {
        submitButton.disabled = !(imageInput.files.length > 0 && titleInput.value.trim().length > 0);
    }

    imageInput.addEventListener('change', updateButtonState);
    titleInput.addEventListener('input', updateButtonState);
}

function updateGalleries() {
    addWorks(allWorks);
    addWorksToModale();
}

function createModale() {
    const modaleWrapper = document.createElement("div");
    modaleWrapper.id = "modale_wrapper";
    modaleWrapper.innerHTML = `
        <div id="modale">
            <h2 id="modale_title">Galerie photo</h2>
            <div id="modale_gallery"></div>
            <div id="modale_addPhoto">
                <button id="modale_addPhoto_button">Ajouter une photo</button>
            </div>
        </div>
        <div id="modale_close"><img src="./assets/icons/cross.svg"></div>
    `;
    document.body.appendChild(modaleWrapper);

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

    document.getElementById("modale_close").addEventListener("click", () => {
        modaleWrapper.remove();
        overlay.remove();
        document.body.style.overflow = "auto";
        document.body.style.backgroundColor = "initial";
    });

    addWorksToModale();
    appendingOneWork();
}
