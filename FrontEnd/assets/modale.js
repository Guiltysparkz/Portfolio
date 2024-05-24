//defunct attempt to make import work lord help me :"gunyum"

export function create_modale(all_works) {
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

        function add_works_to_modale() {
            const modale_gallery = document.getElementById("modale_gallery");
            all_works.forEach((work, i) => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const remove_work = document.createElement("div");
                const remove_work_icon = document.createElement("img");

                img.src = work.imageUrl;
                figure.id = work.categoryId;
                remove_work.id = `remove_work_${i}`;
                remove_work.className = "remove_work";
                remove_work_icon.id = "remove_work_icon";
                remove_work_icon.src = "./assets/icons/trashbin.svg";

                figure.appendChild(img);
                figure.appendChild(remove_work);
                remove_work.appendChild(remove_work_icon);
                modale_gallery.appendChild(figure);
            });
        }
        add_works_to_modale();

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
        
                const photo_preview = document.createElement('div');
                photo_preview.id = 'photo_preview';
                const photo_preview_img = document.createElement('img');
                photo_preview_img.id = 'photo_preview_img';
                photo_preview_img.src = './assets/icons/default-upload-img.svg';
        
                const photo_upload_button = document.createElement('button');
                photo_upload_button.id = 'photo_upload_button';
                photo_upload_button.innerText = '+ Ajouter photo';
                const photo_upload_requirements = document.createElement('p');
                photo_upload_requirements.id = 'photo_upload_requirements';
                photo_upload_requirements.innerText = 'jpg, png: 4mo max';
        
                const photo_form_work_title = document.createElement('label');
                photo_form_work_title.id = 'photo_form_work_title';
                photo_form_work_title.textContent = 'Titre';
                const photo_form_work_title_input = document.createElement('input');
                photo_form_work_title_input.type = 'text';
                photo_form_work_title_input.id = 'photo_form_work_title_input';
        
                const photo_form_category_list_title = document.createElement('label');
                photo_form_category_list_title.id = 'photo_form_category_list_title';
                photo_form_category_list_title.textContent = 'Catégorie';
                const photo_form_category_list = document.createElement('select');
                photo_form_category_list.id = 'photo_form_category';
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
                photo_preview.appendChild(photo_upload_button);
                photo_preview.appendChild(photo_upload_requirements);
                photo_form.appendChild(photo_form_work_title);
                photo_form.appendChild(photo_form_work_title_input);
                photo_form.appendChild(photo_form_category_list_title);
                photo_form.appendChild(photo_form_category_list);
                photo_form.appendChild(modale_confirm_addPhoto_button);
            });
        }
        appending_one_work();
    });
}


