document.addEventListener('DOMContentLoaded', async () => {
    const classesLi = document.getElementById('classesLi');
    const eventsLi = document.getElementById('eventsLi');
    const eventRequestLi = document.getElementById('events-requestLi');
    const locationsLi = document.getElementById('locationsLi');
    const main = document.getElementById('main');
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
    function createForms(objArray, collection = '') {
        const div = document.createElement('div');
        div.classList.add('form-conteiner');

        function inputsByType(obj, parentKey = '') {
            let formInputs = ``;

            for (const key in obj) {
                const uniqueKey = parentKey ? `${parentKey}_${key}` : key; // Add a parent prefix

                if (key === '_id') {
                    formInputs += `<h5>${obj[key]}</h5>`;
                }
                else if (Array.isArray(obj[key])) {
                    let formArray = ``;
                    obj[key].forEach((slot, index) => {
                        if (typeof slot === 'object') {
                            formArray += `<div class="form-arrayElement-conteiner">` +
                                inputsByType(slot, `${uniqueKey}_${index}`) +  // Include index for arrays
                                `</div>`;
                        }
                        else {
                            formArray += `<div class="form-arrayElement-conteiner">` +
                                `<input type="${typeof slot === 'number' ? 'number' : 'text'}" name="${uniqueKey}_${index}" id="${uniqueKey}_${index}" value="${slot}" disabled>` +
                                `</div>`;
                        }

                    });
                    formInputs += `<div class="form-elements-conteiner">` +
                        `<label for="${uniqueKey}">${key}:</label>` +
                        `<div id="${uniqueKey}" class="form-array-conteiner">` +
                        formArray +
                        `</div>` +
                        `</div>`;
                }
                else if (typeof obj[key] === 'object') {
                    formInputs += inputsByType(obj[key], uniqueKey);
                }
                else if (typeof obj[key] === 'string') {
                    formInputs += `<div class="form-elements-conteiner">` +
                        `<label for="${uniqueKey}">${key}:</label>` +
                        `<input type="text" name="${uniqueKey}" id="${uniqueKey}" value="${obj[key]}" disabled autocomplete="off">` +
                        `</div>`;
                }
                else if (typeof obj[key] === 'number') {
                    formInputs += `<div class="form-elements-conteiner">` +
                        `<label for="${uniqueKey}">${key}:</label>` +
                        `<input type="number" name="${uniqueKey}" id="${uniqueKey}" value="${obj[key]}" disabled>` +
                        `</div>`;
                }
                else if (typeof obj[key] === 'boolean') {
                    formInputs += `<div class="form-elements-conteiner">` +
                        `<label for="${uniqueKey}">${key}:</label>` +
                        `<input type="checkbox" name="${uniqueKey}" id="${uniqueKey}" value="${obj[key]}" disabled>` +
                        `</div>`;
                }
                else {
                    console.log(`${obj[key]} não é nada.`);
                }
            }

            return formInputs;
        }


        objArray.forEach((element) => {
            const form = document.createElement('form');
            form.classList.add(collection);

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const data = Object.fromEntries(new FormData(form).entries());
                console.log(data);
                if (form.classList.contains(`events-requests`)) {
                    await fetch('/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }).then(result => result.json()).then(data => console.log(data)).catch(error => console.log(error));
                    form.remove();
                };
            });

            form.innerHTML += inputsByType(element);
            if (form.classList.contains('events-requests')) {
                form.innerHTML += `<div class="form-buttons-conteiner">` +
                    `<button type="button" class="form-edit-button" onclick="editMode(this.parentElement.parentElement)">Editar</button>` +
                    `<button type="submit" class="form-save-button" disabled>Validar</button>` +
                    `</div>`;
            }
            else {
                form.innerHTML += `<div class="form-buttons-conteiner">` +
                    `<button type="button" class="form-edit-button" onclick="editMode(this.parentElement.parentElement)">Editar</button>` +
                    `<button type="submit" class="form-save-button" disabled>Salvar</button>` +
                    `</div>`;
            };

            div.appendChild(form);
        });

        return div;
    };

    classesLi.addEventListener('click', async () => {
        const data = await fetch('/api/classes').then(response => response.json()).then(data => {
            return data;
        }).catch(error => console.log(error));

        if (main.childElementCount == 0) {
            main.appendChild(createForms(data, 'classes'));
        }
        else {
            main.replaceChildren(createForms(data, 'classes'));
        };
    });
    eventsLi.addEventListener('click', async () => {
        const data = await fetch('/api/events').then(response => response.json()).then(data => {
            return data;
        }).catch(error => console.log(error));

        if (main.childElementCount == 0) {
            main.appendChild(createForms(data, 'events'));
        }
        else {
            main.replaceChildren(createForms(data, 'events'));
        };
    });
    eventRequestLi.addEventListener('click', async () => {
        const data = await fetch('/api/events-requests').then(response => response.json()).then(data => {
            return data;
        }).catch(error => console.log(error));

        if (main.childElementCount == 0) {
            main.appendChild(createForms(data, 'events-requests'));
        }
        else {
            main.replaceChildren(createForms(data, 'events-requests'));
        };
    });
    locationsLi.addEventListener('click', async () => {
        const data = await fetch('/api/locations').then(response => response.json()).then(data => {
            return data;
        }).catch(error => console.log(error));

        if (main.childElementCount == 0) {
            main.appendChild(createForms(data, 'locations'));
        }
        else {
            main.replaceChildren(createForms(data, 'locations'));
        };
    });
});