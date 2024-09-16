/**
 * 
 * @param {HTMLFormElement} form 
 */
window.editMode = (form) => {
    const inputs = form.getElementsByTagName('input');

    for (let index = 0; index < inputs.length; index++) {
        inputs.item(index).toggleAttribute('disabled');
    };

    const buttons = form.getElementsByTagName('button');

    if (buttons.item(0).classList.contains('form-edit-button')) { // Editar
        buttons.item(0).innerHTML = 'Cancelar';
        buttons.item(0).setAttribute('type', 'button');
        buttons.item(0).classList.toggle('form-edit-button');
        buttons.item(0).classList.toggle('form-cancel-button');
    }
    else { // Cancelar
        buttons.item(0).innerHTML = 'Editar';
        buttons.item(0).setAttribute('type', 'reset');
        buttons.item(0).classList.toggle('form-edit-button');
        buttons.item(0).classList.toggle('form-cancel-button');


    };

    for (let index = 1; index < buttons.length; index++) {
        buttons.item(index).toggleAttribute('disabled');
    };
};

/**
 * 
 * @param {Array} objArray 
 */
function createForms(objArray) {
    const div = document.createElement('div');
    div.classList.add('form-conteiner');

    function inputsByType(obj) {
        let formInputs = ``;

        for (const key in obj) {
            if (key === '_id') {
                formInputs += `<h5>${obj[key]}</h5>`;
            }
            else if (Array.isArray(obj[key])) { // Se for uma Array
                let formArray = ``;
                obj[key].forEach((slot) => {
                    formArray += `<div class="form-arrayElement-conteiner">`+
                    inputsByType(slot) +
                    `</div>`;
                });
                formInputs += `<div class="form-elements-conteiner">` +
                    `<label for="${key}">${key}:</label>` +
                    `<div id="${key}" class="form-array-conteiner">` +
                    formArray +
                    `</div>` +
                    `</div>`;
            }
            else if (typeof obj[key] === 'object') { // Se for um objeto
                formInputs += inputsByType(obj[key]);
            }
            else if (typeof obj[key] === 'string') { // Se for uma String
                formInputs += `<div class="form-elements-conteiner">` +
                    `<label for="${key}">${key}:</label>` +
                    `<input type="text" name="${key}" id="${key}" value="${obj[key]}" disabled autocomplete="off">` +
                    `</div>`;
            }
            else if (typeof obj[key] === 'number') { // Se for um número
                formInputs += `<div class="form-elements-conteiner">` +
                    `<label for="${key}">${key}:</label>` +
                    `<input type="number" name="${key}" id="${key}" value="${obj[key]}" disabled>` +
                    `</div>`;
            }
            else if (typeof obj[key] === 'boolean') { // Se for um Bolleano
                formInputs += `<div class="form-elements-conteiner">` +
                    `<label for="${key}">${key}:</label>` +
                    `<input type="checkbox" name="${key}" id="${key}" value="${obj[key]}" disabled>` +
                    `</div>`;
            }
            else { // Provavelmente nunca vai chegar aqui
                console.log(`${obj[key]} não é nada.`);
            }
        }

        return formInputs;
    };

    objArray.forEach((element) => {
        const form = document.createElement('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());
            console.log(data);
        });

        form.innerHTML += inputsByType(element);
        form.innerHTML += `<div class="form-buttons-conteiner">` +
            `<button type="button" class="form-edit-button" onclick="editMode(this.parentElement.parentElement)">Editar</button>` +
            `<button type="submit" class="form-save-button" disabled>Salvar</button>` +
            `</div>`;

        div.appendChild(form);
    });

    return div;
};

const body = document.getElementById('body');
body.append(createForms(classes));
body.append(createForms(events));
body.append(createForms(locations));