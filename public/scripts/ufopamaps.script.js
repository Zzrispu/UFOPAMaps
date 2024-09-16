document.addEventListener('DOMContentLoaded', async () => {
    // Variaveis de Inicialização
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const center = { lat: -2.419894041482616, lng: -54.7407099735224 };
    const mapOptions = {
        maxZoom: 20,
        minZoom: 17,
        zoom: 18,
        center: center,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        mapId: 'ece9108468df5c5',
        mapTypeControl: false
    };

    // Variaveis de Estrutura
    const routeMarkers = [];
    let map = new Map(document.getElementById("map"), mapOptions);
    let directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        suppressInfoWindows: true,
        preserveViewport: true,
        polylineOptions: {
            strokeColor: '#2F71AB',
            strokeWeight: 8,
        },
    });
    let currentLocation;
    let isEditMode = false;

    // Elementos do HTML
    const searchInput = document.getElementById('search_input');
    const rowBox = document.querySelector('.searchRow');
    const routesBox = document.querySelector('.routesRow');
    const routeButton = document.querySelector('.tracarRota');
    const sideBar = document.getElementById('sideBar');
    const sbInstitutos = document.getElementById('sbInstitutos');
    const eventsDL = document.getElementById('eventsDL');

    const originInput = document.getElementById('originInput');
    const originDiv = originInput.parentElement;

    const destinationInput = document.getElementById('destinationInput');
    const destinationDiv = destinationInput.parentElement;

    const dropList = document.createElement('div');
    dropList.classList.add('dropList');

    const getLocationB = document.getElementById('getLocationB');

    const userButton = document.getElementById('userDiv').firstElementChild;

    // Funções de Inicialização

    userButton.innerHTML = user.username.charAt(0).toLocaleUpperCase();

    // Funções Basicas - início

    window.deleteMarker = (m, i) => {
        const marker = document.getElementById(m);
        const infoW = i.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        marker.parentElement.parentElement.remove();
        infoW.remove();
    };

    window.closeInfoWindow = (i, m) => {
        i.remove();

        if (m) {
            const marker = document.getElementById(m);
            marker.classList.remove('hidden');
        }
    };

    window.searchItem = (item) => {
        searchInput.value = item.innerHTML;
        createMarker(searchInput.value);
        rowBox.innerHTML = '';
    };

    window.toggleRoutesRow = () => {
        searchInput.value = '';
        rowBox.innerHTML = '';
        routesBox.classList.toggle('hidden');
    };

    window.cleanRoutesRow = () => {
        directionsRenderer.setMap(null);
        routeMarkers.forEach((marker) => {
            marker.setMap(null);
        });
        routeMarkers.splice(0, routeMarkers.length);
    }

    window.centralize = () => {
        map.setCenter(center);
        map.setZoom(18)
    }

    window.selectItem = (item) => {
        const div = item.parentElement.parentElement.parentElement
        const input = div.firstElementChild;
        input.value = item.innerHTML;
        div.removeChild(dropList);
    };

    window.hideSideBar = () => {
        sideBar.classList.add('offScreen');
    };

    window.showSideBar = () => {
        sideBar.classList.remove('offScreen');
    };

    window.openDropList = (list) => {
        list.classList.toggle('dlClosed')
    };

    window.slideRight = (slider) => {
        const slidersAmount = slider.childElementCount;
        const slidersIndex = Number(slider.style.transform.slice(11, 15).replace('%)', '')) / -100;

        if (slidersIndex < (slidersAmount - 1)) {
            slider.style.transform = `translateX(-${slidersIndex + 1}00%)`;
        }
        else {
            slider.style.transform = `translateX(0%)`;
        };
    };

    window.slideLeft = (slider) => {
        const slidersAmount = slider.childElementCount;
        const slidersIndex = Number(slider.style.transform.slice(11, 15).replace('%)', '')) / -100;

        if (slidersIndex == 0) {
            slider.style.transform = `translateX(-${slidersAmount - 1}00%)`;
        }
        else {
            slider.style.transform = `translateX(-${slidersIndex - 1}00%)`;
        };
    };
    /**
     * 
     * @param {HTMLButtonElement} button 
     */
    window.openUserPanel = (button) => {
        const div = button.parentElement;

        div.style.height = 'fit-content';
        div.style.borderRadius = '5px';
        div.style.flexDirection = 'column';
        div.style.height = '180px';
        div.style.padding = '10px';

        if (user.username === 'Guest') {
            div.innerHTML = `<img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="userPicture">` +
                `<h4>${user.username}</h4>` +
                `<a href="/login">Entar</a>` +
                `<a href="/register">Cadastrar</a>`;
        }
        else {
            div.innerHTML = `<img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="userPicture">` +
                `<h4>${user.username}</h4>` +
                `<div class="userInfo"><span>Pontos:</span><span>${user.points}</span></div>` +
                `<div class="userInteractionsButtons"><i onclick="toggleEditMode()" class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-ranking-star"></i></div>`;
        };
    };

    window.toggleEditMode = () => {
        if (isEditMode == false) {
            isEditMode = true;
        }
        else {
            isEditMode = false;
        };
    };

    function getPostionSuccess(position) {
        currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        originInput.value = `Localização atual`;
    };

    function getPositionError(error) {
        if (error.code == 1) {
            alert('Você negou o acesso a sua localização, redefina as permições do site para continuar.');
        }
        else if (error.code == 2) {
            alert('O acesso à sua localização não está disponivel. Ative-a para continar');
        }
        else {
            alert('Algo deu errado. Tente novamente em breve.');
        };
    };

    // Funções Basicas - final

    // Funções complexas - Início
    function drawRoute(org, dst) {
        new google.maps.DirectionsService().route({
            origin: org,
            destination: dst,
            travelMode: 'WALKING'

        }, (result, status) => {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);
            }
        })
    };

    function createRoute() {
        let org
        if (originInput.value === 'Localização atual') {
            org = currentLocation;
        }
        else {
            org = locations.find(lct => lct.rooms.find(room => originInput.value.toLocaleLowerCase().includes(room.name.toLocaleLowerCase()))).rooms.find(room => originInput.value.toLocaleLowerCase().includes(room.name.toLocaleLowerCase())).location;
        }

        const dst = locations.find(lct => lct.rooms.find(room => destinationInput.value.toLocaleLowerCase().includes(room.name.toLocaleLowerCase()))).rooms.find(room => destinationInput.value.toLocaleLowerCase().includes(room.name.toLocaleLowerCase())).location;

        if (org != undefined && dst != undefined) {
            drawRoute(org, dst);

            const orgContent = document.createElement('img');
            orgContent.setAttribute("src", "./src/ufopa-pin.png");
            orgContent.classList.add('markerIcon');
            const orgMarker = new AdvancedMarkerElement({
                map,
                position: org,
                content: orgContent,
                gmpClickable: false
            });

            const dstContent = document.createElement('img');
            dstContent.setAttribute("src", "./src/ufopa-pin.png");
            dstContent.classList.add('markerIcon');
            const dstMarker = new AdvancedMarkerElement({
                map,
                position: dst,
                content: dstContent,
                gmpClickable: false
            });
            routeMarkers.push(orgMarker);
            routeMarkers.push(dstMarker);

        } else {
            alert('Ao menos um dos lugares informados não está registrado.')
        }

    };

    window.createMarker = (location) => {
        const lct = locations.map((locat) => {
            const f_rooms = locat.rooms.filter(room => location.toLocaleLowerCase().endsWith(room.name.toLocaleLowerCase()));
            if (f_rooms.length > 0) return { ...locat, rooms: f_rooms };
            return null
        }).filter(locat => locat !== null);

        if (lct.length > 0) {
            const content = document.createElement('img');
            content.setAttribute("id", lct[0].rooms[0].name)
            content.setAttribute("src", "./src/ufopa-pin.png");
            content.setAttribute("class", "markerIcon");

            const marker = new AdvancedMarkerElement({
                map,
                position: lct[0].rooms[0].location,
                title: lct[0].rooms[0].name,
                content: content,
                gmpClickable: true
            });

            const iwContent = document.createElement('div');
            iwContent.classList.add('markerContent');
            iwContent.innerHTML = `
        <div class="header">
            <h1>${lct[0].block}, ${lct[0].rooms[0].name}</h1>
            <i class="fa-regular fa-circle-xmark" onclick="closeInfoWindow(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, '${lct[0].rooms[0].name}')"></i>
        </div>
        <input type="date" class="dateInput" onChange="updateTable(this)" value="${new Date().toISOString().slice(0, 10)}"/>
        <table class="aulas">
            <tbody>
                <tr class="hdr">
                    <td>Horário</td>
                    <td>Aulas</td>
                    <td>Professor(a)</td>
                </tr>
                <tr class="ctn">
                </tr>
            </tbody>
        </table>
        <i class="fa-solid fa-trash-can" onclick="deleteMarker('${lct[0].rooms[0].name}', this)"></i>
        `;

            const iW = new InfoWindow({
                content: iwContent,
                headerDisabled: true,
            });

            marker.addListener('click', () => {
                iW.open({
                    anchor: marker,
                    map
                });
                marker.content.classList.add('hidden');
            });

            updateTable(iwContent.getElementsByClassName('dateInput')[0]);

        }
    };

    window.updateTable = (input) => {
        const day = new Date(input.valueAsNumber).getDay();
        const location = input.parentElement.firstElementChild.firstElementChild.innerText;
        const aulas = classes.map(instituto => {
            const filteredGraduacoes = instituto.graduacoes.map(graduacao => {
                const filteredAulas = graduacao.aulas.filter(aula =>
                    aula.local.toLocaleLowerCase().endsWith(location.toLocaleLowerCase()) && aula.dias.includes(day)
                );
                if (filteredAulas.length > 0) {
                    return { ...graduacao, aulas: filteredAulas };
                }
                return null;
            }).filter(graduacao => graduacao !== null);

            if (filteredGraduacoes.length > 0) {
                return { ...instituto, graduacoes: filteredGraduacoes };
            }
            return null;
        }).filter(instituto => instituto !== null);

        const content = input.nextElementSibling.firstElementChild;
        content.lastChild.remove();

        if (aulas.length >= 1) {
            aulas.forEach(instituto => {
                const row = document.createElement('tr');
                row.classList.add('cnt');
                row.innerHTML = `
            <td>${instituto.graduacoes[0].aulas[0].horario}</td>
            <td>${instituto.graduacoes[0].aulas[0].nome}</td>
            <td>${instituto.graduacoes[0].aulas[0].prof}</td>`;

                content.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.classList.add('cnt');
            row.innerHTML = `
        <td>--:--</td>
        <td>N/A</td>
        <td>N/A</td>`;

            content.appendChild(row);
        }
    };
    // Funções complexas - Final

    // Eventos - início
    document.addEventListener('click', (e) => {
        const userDiv = document.getElementById('userDiv');

        if (e.target != userDiv && !userDiv.contains(e.target) && e.target.id != 'userButton') {
            const replaceDiv = document.createElement('div');
            replaceDiv.classList.add('userButton-div');
            replaceDiv.id = 'userDiv'
            replaceDiv.innerHTML = `<button id="userButton" onclick="openUserPanel(this)"></button>`;
            userDiv.parentNode.replaceChild(replaceDiv, userDiv);
            replaceDiv.firstElementChild.innerHTML = user.username.charAt(0).toLocaleUpperCase();
        };

        if (isEditMode) {
            const sbConteiners = sideBar.querySelectorAll('.sbDropDown');
            sbConteiners.forEach(element => {
                if (element.contains(e.target)) {
                    let editIcon = document.getElementById('editIcon');
                    if (!editIcon) {
                        editIcon = document.createElement('i');
                        editIcon.id = 'editIcon'
                        editIcon.setAttribute('class', 'fa-solid fa-pen-to-square');
                        editIcon.setAttribute('style', 'position: absolute; top: 5px; right: 5px; border: 1px white solid');
                    }
                    e.target.closest('li').append(editIcon);
                };
            });
        }
    });

    routeButton.addEventListener('click', () => {
        createRoute();
        originInput.value = '';
        destinationInput.value = '';
        toggleRoutesRow();
    });

    searchInput.onkeyup = () => {
        routesBox.classList.add('hidden');
        let result = []
        if (searchInput.value.length > 0) {
            result = locations.map((lct) => {
                const f_rooms = lct.rooms.filter((room) => room.name.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()) || lct.block.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()));
                if (f_rooms.length > 0) {
                    return { ...lct, rooms: f_rooms };
                };
                return null;
            }).filter((lct) => lct !== null);

            const rowContent = result.map(item => item.rooms.map(room => `<li onclick='searchItem(this)'>${item.block}, ${room.name}</li>`).join(''));
            rowBox.innerHTML = `<ul>${rowContent.join('')}</ul>`;

            if (result.length < 1) {
                rowBox.innerHTML = '';
            }
        }
        else {
            rowBox.innerHTML = '';
        }
    };

    originInput.onkeyup = () => {
        let result = []
        if (originInput.value.length > 0) {
            result = locations.map((lct) => {
                const f_rooms = lct.rooms.filter((room) => room.name.toLocaleLowerCase().includes(originInput.value.toLocaleLowerCase()) || lct.block.toLocaleLowerCase().includes(originInput.value.toLocaleLowerCase()));
                if (f_rooms.length > 0) {
                    return { ...lct, rooms: f_rooms };
                };
                return null;
            }).filter((lct) => lct !== null);

            const rowContent = result.map(item => item.rooms.map(room => `<li onclick='selectItem(this)'>${item.block}, ${room.name}</li>`).join(''));
            originDiv.appendChild(dropList);
            dropList.innerHTML = `<ul>${rowContent.join('')}</ul>`;

            if (result.length < 1) {
                if (originDiv.childElementCount >= 2) {
                    originDiv.removeChild(dropList);
                };
            }
        }
        else {
            if (originDiv.childElementCount >= 2) {
                originDiv.removeChild(dropList);
            };
        }
    };

    destinationInput.onkeyup = () => {
        let result = []
        if (destinationInput.value.length > 0) {
            result = locations.map((lct) => {
                const f_rooms = lct.rooms.filter((room) => room.name.toLocaleLowerCase().includes(destinationInput.value.toLocaleLowerCase()) || lct.block.toLocaleLowerCase().includes(destinationInput.value.toLocaleLowerCase()));
                if (f_rooms.length > 0) {
                    return { ...lct, rooms: f_rooms };
                };
                return null;
            }).filter((lct) => lct !== null);

            const rowContent = result.map(item => item.rooms.map(room => `<li onclick='selectItem(this)'>${item.block}, ${room.name}</li>`).join(''));
            destinationDiv.appendChild(dropList);
            dropList.innerHTML = `<ul>${rowContent.join('')}</ul>`;

            if (result.length < 1) {
                if (destinationDiv.childElementCount >= 2) {
                    destinationDiv.removeChild(dropList);
                };
            }
        }
        else {
            if (destinationDiv.childElementCount >= 2) {
                destinationDiv.removeChild(dropList);
            };
        }
    };

    searchInput.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            createMarker(searchInput.value);
        }
    });

    getLocationB.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPostionSuccess, getPositionError);
        }
        else {
            alert('O seu navegador não permite acesso a sua localização.');
        }
    });
    // Eventos - final

    // Construção da SideBar - início
    classes.forEach(instituto => {
        const elemento = document.createElement('li');
        elemento.style.position = `relative`;
        elemento.innerHTML = `
        <div class="sbIntstName">
            <span>${instituto.instituto}</span><i class="fa-solid fa-chevron-down"></i>
        </div>`;

        if (instituto.graduacoes.length > 0) {
            elemento.firstElementChild.setAttribute('onclick', 'openDropList(this.nextElementSibling)');

            const cursos = document.createElement('ul');
            cursos.classList.add('sbCursos');
            cursos.classList.add('dlClosed');

            instituto.graduacoes.forEach(graduacao => {
                const elemento = document.createElement('li');
                elemento.style.position = `relative`;
                elemento.innerHTML = `
              <div class="sbCursoName">
                <span>${graduacao.graduacao}</span><i class="fa-solid fa-chevron-down"></i>
              </div>`;

                cursos.appendChild(elemento);

                if (graduacao.aulas.length > 0) {
                    elemento.firstElementChild.setAttribute('onclick', 'openDropList(this.nextElementSibling)');

                    const aulas = document.createElement('ul');
                    aulas.classList.add('sbAulas');
                    aulas.classList.add('dlClosed');

                    graduacao.aulas.forEach(aula => {
                        const li = document.createElement('li');
                        li.style.position = `relative`;
                        li.innerHTML = `<i class="fa-solid fa-location-dot" onclick="createMarker('${aula.local}')"></i>` +
                            `<div>` +
                            `<h1>${aula.nome}</h1>` +
                            `<h2>Professor(a): ${aula.prof}</h2>` +
                            `<div style="display:flex;width:100%;flex-direction:row;justify-content:space-between;">` +
                            `<span>Próxima:${aula.dias.map((dia) => {
                                const date = new Date();
                                let diasRestantes = dia - date.getDay() + 1;
                                if (diasRestantes < 0) diasRestantes += 7;
                                date.setDate(date.getDate() + diasRestantes);
                                return ` ${date.toLocaleDateString('pt-BR')}`;
                            })}</span>` +
                            `<span>${aula.local}</span>` +
                            `</div>` +
                            `</div>`;
                        aulas.appendChild(li);
                    })

                    elemento.appendChild(aulas);
                };

            });

            elemento.appendChild(cursos);
        };

        sbInstitutos.appendChild(elemento);
    });

    events.forEach((event) => {
        const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const date = new Date(event.date + 'T00:00:00');
        const li = document.createElement('li');

        li.classList.add('eventLi');
        li.innerHTML = `<div style="background-color:white;margin:10px auto;height:40px;width:40px;text-align:center;border:#4e572a 2px solid;border-radius:5px;font-size:16px;font-weight:600;color:#4e572a"><div style="background-color:#86a138;color:white;font-size:12px;font-weight:600">${meses[date.getMonth()]}</div>${date.getDate()}</div><div style="display:flex;padding:8px 5px 8px 0;flex-direction:column;font-size:16px;width:85%"><span class="eventName">${event.name}</span><div style="display:flex;justify-content:space-between;flex:1"><span style="font-size:12px"><i class="fa-solid fa-location-dot" style="color:#86a138"></i> ${event.location}</span><a href="${event.url}" style="margin-top:5px;text-decoration:none;color:#86a138;font-size:14px;align-self:end">Saiba mais <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></div>`;

        eventsDL.appendChild(li);
    });

    // Construção da SideBar - final

    // Blocos
    function iwCiHTML(h1, li, imgs) {
        return `<div class="header">` +
            `<h1>${h1}</h1>` +
            `<i class="fa-regular fa-circle-xmark" onclick="closeInfoWindow(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"></i>` +
            `</div>` +
            `<div style="max-height:180px;min-height:180px;max-width:100%;margin-bottom:10px;overflow:hidden;position:relative">` +
            `<div style="display:flex;max-height:180px;min-height:180px;transform:translateX(-000%);transition: all 0.2s;">` +
            imgs +
            `</div>` +
            `<i style="right:5px;" onclick="slideRight(this.parentElement.firstElementChild)" class="fa-solid fa-chevron-right sliderArrow"></i>` +
            `<i style="left:5px;" onclick="slideLeft(this.parentElement.firstElementChild)" class="fa-solid fa-chevron-left sliderArrow"></i>` +
            `</div>` +
            `<ul style="border-radius:5px;list-style-type:none">` +
            li +
            `</ul>`
    };

    function iwCli(block) {
        return locations.find((lct) => lct.block == block).rooms.map(room => `<li class="iwCli"><i class="fa-solid fa-location-dot" onclick="createMarker('${room.name}'); closeInfoWindow(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)"></i><span>${room.name}</span></li>`).join('');
    };

    function iwCimgs(block, room) {
        let imgs = [];
        if (locations.find(lct => lct.block === block).imgs !== undefined) {
            for (let index = 0; index < locations.find(lct => lct.block === block).imgs; index++) {
                imgs.push(`<img style="width:100%;border-radius:5px" src="/src/${block}/${room}/${block}${room}${index}.png" alt="NSA img">`);
            };
        };
        return imgs.join('');
    }

    const b_bmt = new google.maps.Polygon({
        paths: locations.find((lct) => lct.block == 'BMT').polygon,
        strokeColor: "#4E572A",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#86a138",
        fillOpacity: 0.5,
    });

    b_bmt.addListener('click', (mouse) => {
        const iwContent = document.createElement('div');
        const li = iwCli('BMT');
        const imgs = iwCimgs('BMT', 'Block');
        iwContent.classList.add('markerContent');
        iwContent.innerHTML = iwCiHTML('Bloco Modular Tapajós (BMT)', li, imgs);

        const iw = new InfoWindow({
            content: iwContent,
            position: mouse.latLng,
            headerDisabled: true,
        });

        iw.open(map);

        iwContent.addEventListener('click', (event) => {
            if (event.target.nodeName !== 'I') return
            b_bmt.setOptions({
                clickable: true,
            });
        })

        b_bmt.setOptions({
            clickable: false,
        });
    });

    b_bmt.setMap(map);

    const b_nsa = new google.maps.Polygon({
        paths: locations.find((lct) => lct.block == 'NSA').polygon,
        strokeColor: "#4E572A",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#86a138",
        fillOpacity: 0.5,
    });

    b_nsa.addListener('click', (mouse) => {
        const iwContent = document.createElement('div');
        const li = iwCli('NSA');
        const imgs = iwCimgs('NSA', 'Block');
        iwContent.classList.add('markerContent');
        iwContent.innerHTML = iwCiHTML('Nucleo de Salas de Aula (NSA)', li, imgs);

        const iw = new InfoWindow({
            content: iwContent,
            position: mouse.latLng,
            headerDisabled: true,
        });

        iw.open(map);

        iwContent.addEventListener('click', (event) => {
            if (event.target.nodeName !== 'I') return
            b_nsa.setOptions({
                clickable: true,
            });
        })

        b_nsa.setOptions({
            clickable: false,
        });
    });
    b_nsa.setMap(map);

    const b_bse = new google.maps.Polygon({
        paths: locations.find((lct) => lct.block == 'BSE').polygon,
        strokeColor: "#4E572A",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#86a138",
        fillOpacity: 0.5,
    });

    b_bse.addListener('click', (mouse) => {
        const iwContent = document.createElement('div');
        const li = iwCli('BSE');
        const imgs = iwCimgs('BSE', 'Block');
        iwContent.classList.add('markerContent');
        iwContent.innerHTML = iwCiHTML('Laranjão - Bloco de Salas Especiais (BSE)', li, imgs);

        const iw = new InfoWindow({
            content: iwContent,
            position: mouse.latLng,
            headerDisabled: true,
        });

        iw.open(map);

        iwContent.addEventListener('click', (event) => {
            if (event.target.nodeName !== 'I') return
            b_bse.setOptions({
                clickable: true,
            });
        })

        b_bse.setOptions({
            clickable: false,
        });
    });
    b_bse.setMap(map);
});