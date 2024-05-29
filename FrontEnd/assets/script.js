var all_works = [];
var categories = [];

document.addEventListener('DOMContentLoaded', async () => {

    const myToken = localStorage.getItem("loginToken");

    const isAdmin = myToken?.length > 0 ? true : false;

    console.log("isAdmin ===>",isAdmin)
    console.log("myToken ===>",myToken)

    
   //isAdmin = true;
   if (isAdmin) {
       await fetching_works(); // Wait for the data to be fetched
       create_modale(); // Prepare modale to be called once data is fetched
   }



});

async function fetching_works() {
    try {
        let fetched_works = await fetch("http://localhost:5678/api/works");
        if (!fetched_works.ok) {
            throw new Error("Network error" + fetched_works.statusText);
        }
        all_works = await fetched_works.json();
        console.log(all_works);
        add_works(all_works);
        const categories = extractCategories(all_works); // Store categories
        create_filtres(categories); // Pass categories to create_filtres
        create_modale(all_works);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


function extractCategories(all_works) {
    categories = [];
    const categoryIds = new Set();

    all_works.forEach(work => {
        const { id, name } = work.category;
        if (!categoryIds.has(id)) {
            categories.push({ id, name });
            categoryIds.add(id);
        }
});
return categories; // Return categories
}


function add_works(works) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    works.forEach(work => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        image.src = work.imageUrl;
        image.alt = work.title;
        image.id = work.id;
        figure.id = work.categoryId;
        figure.className = work.id;
        figcaption.innerText = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Generate filter buttons
// Generate reset filter button first
function create_filtres(categories) {
    const filtres = document.getElementById("filtres");
    let filtre_reset = document.createElement("button");
    filtre_reset.id = "reset";
    let filtre_reset_text = document.createElement("p");
    filtre_reset_text.textContent = "Tous";
    filtre_reset.appendChild(filtre_reset_text);
    filtres.appendChild(filtre_reset);
// Generate each other button based on category
    categories.forEach(category => {
        let filtre_button = document.createElement("button");
        filtre_button.id = category.id;
        let filtre_button_text = document.createElement("p");
        filtre_button_text.textContent = category.name;
        filtre_button.appendChild(filtre_button_text);
        filtres.appendChild(filtre_button);
    });
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


function add_works_to_modale() {
    const modale_gallery = document.getElementById("modale_gallery");
    all_works.forEach((work, i) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const remove_work = document.createElement("div");
        const remove_work_icon = document.createElement("img");

        img.src = work.imageUrl;
        figure.id = work.categoryId;
        figure.className = work.id;
        remove_work.id = `remove_work_${i}`;
        remove_work.className = "remove_work";
        remove_work_icon.id = work.id;
        remove_work_icon.src = "./assets/icons/trashbin.svg";

        figure.appendChild(img);
        figure.appendChild(remove_work);
        remove_work.appendChild(remove_work_icon);
        modale_gallery.appendChild(figure);

        remove_work.addEventListener('click', async function (event) {
            console.log('Remove work clicked:', event.target.id);
            // Get id of the clicked remove_work
            const remove_work_id = event.target.id;
            console.log('Clicked element ID:', remove_work_id);

            console.log('remove_work_id ==>',remove_work_id)
            try {
                const response = await fetch('http://localhost:5678/api/works/'+work.id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network error: ${response.statusText} - ${errorText}`);
                }

                fetching_works();
            } catch (error) {
                console.error('Upload error:', error);
                alert(`Failed to remove work: ${error.message}`);
            }
        });
    });
}



function appending_one_work() {
    document.getElementById('modale_addPhoto_button').addEventListener('click', function() {
        const modale_gallery = document.getElementById('modale_gallery');
        if (modale_gallery) modale_gallery.style.display = "none";
        const modale_addPhoto_button = document.getElementById('modale_addPhoto_button');
        if (modale_addPhoto_button) modale_addPhoto_button.style.display = "none";
        const modale_title = document.getElementById('modale_title');
        if (modale_title) modale_title.innerText = 'Ajout photo';

        const photo_form = document.createElement('form');
        photo_form.id = 'photo_form';
        photo_form.enctype = 'multipart/form-data';
        photo_form.method = 'POST';

        const photo_preview = document.createElement('div');
        photo_preview.id = 'photo_preview';
        const photo_preview_img = document.createElement('img');
        photo_preview_img.id = 'photo_preview_img';
        photo_preview_img.src = './assets/icons/default-upload-img.svg';

        const photo_upload_input = document.createElement('input');
        photo_upload_input.type = 'file';
        photo_upload_input.id = 'photo_upload_input';
        photo_upload_input.name = 'image';
        photo_upload_input.accept = 'image/*';

        const photo_upload_requirements = document.createElement('p');
        photo_upload_requirements.id = 'photo_upload_requirements';
        photo_upload_requirements.innerText = 'jpg, png: 4mo max';

        const photo_form_work_title = document.createElement('label');
        photo_form_work_title.id = 'photo_form_work_title';
        photo_form_work_title.textContent = 'Titre';
        const photo_form_work_title_input = document.createElement('input');
        photo_form_work_title_input.name = 'title';
        photo_form_work_title_input.type = 'text';
        photo_form_work_title_input.id = 'photo_form_work_title_input';

        const photo_form_category_list_title = document.createElement('label');
        photo_form_category_list_title.id = 'photo_form_category_list_title';
        photo_form_category_list_title.textContent = 'Catégorie';
        const photo_form_category_list = document.createElement('select');
        photo_form_category_list.id = 'photo_form_category';
        photo_form_category_list.name = 'category';
        categories.forEach(category => {
            const photo_form_category = document.createElement('option');
            photo_form_category.value = category.id;
            photo_form_category.textContent = category.name;
            photo_form_category_list.appendChild(photo_form_category);
        });

        const modale_confirm_addPhoto_button = document.createElement('button');
        modale_confirm_addPhoto_button.id = 'modale_confirm_addPhoto_button';
        modale_confirm_addPhoto_button.type = 'submit';
        modale_confirm_addPhoto_button.innerText = 'Valider';

        const modale_wrapper = document.getElementById('modale_wrapper');
        modale_wrapper.appendChild(photo_form);

        photo_form.appendChild(photo_preview);
        photo_preview.appendChild(photo_preview_img);
        photo_preview.appendChild(photo_upload_input);
        photo_preview.appendChild(photo_upload_requirements);
        photo_form.appendChild(photo_form_work_title);
        photo_form.appendChild(photo_form_work_title_input);
        photo_form.appendChild(photo_form_category_list_title);
        photo_form.appendChild(photo_form_category_list);
        photo_form.appendChild(modale_confirm_addPhoto_button);

        photo_upload_input.addEventListener('change', () => {
            const file = photo_upload_input.files[0];
            if (file) {
                const fileSize = file.size / (1024 * 1024); // Convert to MB
                if (fileSize > 4) {
                    alert('File size exceeds 4MB');
                    photo_upload_input.value = ''; // Clear the input
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    photo_preview_img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        photo_form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission
            const formData = new FormData(photo_form);


            console.log('My form ===>',formData)

            // Append additional fields as required by the API
            // formData.append('title', photo_form_work_title_input.value);
            // formData.append('category', photo_form_category_list.value); // Ensure 'category' is used instead of 'categoryId'
            // formData.append('image', photo_upload_input.files[0]); // Ensure 'image' is used instead of 'imageUrl'
            console.log (formData);
            let loginToken = localStorage.getItem('loginToken');
            console.log (typeof loginToken);

            console.log("FormData entries:");
                formData.forEach((value, key) => {
                    console.log(key, value);
                });

                console.log("the strange token ",localStorage.getItem('userId', 'loginToken'))
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
                console.log('Upload successful:', result);
                alert('Photo uploaded successfully!');

                photo_form.reset();
                photo_preview_img.src = './assets/icons/default-upload-img.svg';
                modale_gallery.style.display = "flex";
                modale_addPhoto_button.style.display = "flex";
                modale_title.innerText = 'Galerie photo';

                all_works.push(result);
                add_works([result]);
            } catch (error) {
                console.error('Upload error:', error);
                alert(`Failed to upload photo: ${error.message}`);
            }
        });
    });
}
function create_modale(all_works) {
    document.getElementById("edit_button").addEventListener("click", function() {
        if (document.getElementById("modale_wrapper")) return; // Prevent multiple modals
        
        console.log(all_works);

        const modale_wrapper = document.createElement("div");
        modale_wrapper.id = "modale_wrapper";
        const modale_title = document.createElement("h2");
        modale_title.id = "modale_title";
        modale_title.innerText = "Galerie photo";
        const modale_gallery = document.createElement("div");
        modale_gallery.id = "modale_gallery";
        const modale_addPhoto = document.createElement("div");
        modale_addPhoto.id = "modale_addPhoto";
        const modale_addPhoto_button = document.createElement("button");
        modale_addPhoto_button.id = 'modale_addPhoto_button';
        modale_addPhoto_button.textContent = "Ajoutez une photo";
        const modale_close = document.createElement("div");
        const modale_close_icon = document.createElement("img");
        modale_close_icon.src = "./assets/icons/cross.svg";
        modale_close.id = "modale_close";
        modale_wrapper.appendChild(modale_title);
        modale_wrapper.appendChild(modale_gallery);
        modale_wrapper.appendChild(modale_addPhoto);
        modale_addPhoto.appendChild(modale_addPhoto_button);
        modale_wrapper.appendChild(modale_close);
        modale_close.appendChild(modale_close_icon);
        document.body.appendChild(modale_wrapper);

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

        modale_close.addEventListener("click", function() {
            modale_wrapper.remove();
            overlay.remove();

            // Restore background
            document.body.style.overflow = "auto";
            document.body.style.backgroundColor = "initial";
        });

       
        add_works_to_modale();

       
        appending_one_work();
    });
}


