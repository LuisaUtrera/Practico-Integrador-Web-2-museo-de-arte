


const URL_DEPARTAMENTOS = 'https://collectionapi.metmuseum.org/public/collection/v1/departments';
const URL_OBJETOS = `https://collectionapi.metmuseum.org/public/collection/v1/objects`;
const URL_OBJETO = `https://collectionapi.metmuseum.org/public/collection/v1/objects/`;
const URL_SEARCH_HAS_IMAGE = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=&hasImages=true`;
const URL_SEARCH = `https://collectionapi.metmuseum.org/public/collection/v1/search`;
const $imagenes = document.getElementById('imagenes');
const $botones = document.getElementById('botones');
const $departamentos = document.getElementById('departamentos');
const $localidades = document.getElementById('localidades');
const $keyword = document.getElementById('keyword');




async function cargarDatos(objectsId) {

$imagenes.innerHTML = '';
let imagenesPresentacion = "";
let cantidadObjetos = 0;
let paginaActual = 1;
let maximoImagenes = 20;
let paginas = []; 
console.log(objectsId);
//let misId = objectsId.objectsIDs;

for (const id of objectsId) {
    let url = URL_OBJETO + id;
    if (paginaActual > 3 ) break;

    if (cantidadObjetos >= maximoImagenes) {
        console.log(`pagina N°: ${paginaActual}`);
        paginas.push({ pagina: paginaActual, tarjetas: imagenesPresentacion });
        imagenesPresentacion = "";
        cantidadObjetos = 0;
        paginaActual++;
    }
try {
    let resultado = await fetch(url);
     json = await resultado.json();
    if (!resultado.ok) continue;

    let resTraduccion= await fetch('/traducir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
            titulo: json.title.trim() !== "" ? json.title : 'A stranger',
            cultura: json.culture.trim() !== "" ? json.culture : 'Not registered',
            dinastia: json.dynasty.trim() !== "" ? json.dynasty : 'Unknown',
            fecha: json.objectDate.trim() !== "" ? json.objectDate : 'A stranger',
        }])
    });

    if (!resTraduccion.ok) throw { status: resTraduccion.status, statusText: resTraduccion.statusText }
    let datosTraducidos = await resTraduccion.json();
    // console.log('Objeto traducido:', datosTraducidos[0].titulo);


   
   
      imagenesPresentacion += `
        <div class="col">
          <div class="card h-100">
            <img src="${json.primaryImageSmall !== "" ? json.primaryImageSmall : "default2.avif"}" class="card-img-top" alt="${json.title}" title="fecha: ${datosTraducidos[0].fecha}">
            <div class="card-body">
              <h5 class="card-title">${json.title.trim() === "" ? "Sin titulo" : datosTraducidos[0].titulo}</h5>
              <p class="card-text">cultura: ${json.culture.trim() === "" ? "Sin datos" : datosTraducidos[0].cultura}</p>
              <p class="card-text">dinastia: ${json.dynasty.trim() === "" ? "Sin datos" : datosTraducidos[0].dinastia}</p>
              ${json.additionalImages && json.additionalImages.length > 0 ?
                `<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalImg" onclick="cargarImagenesAdicionales(${json.id})">
                  Imagenes Adicionales
                </button>` : ''}
            </div>
          </div>
        </div>
      `;
    
      cantidadObjetos++;

    
    

//     imagenesPresentacion += `<div class="card mb-3 "  style="width: 18rem;">
//             <img src="${json.primaryImageSmall !== "" ? json.primaryImageSmall : "default2.avif" }" class="card-img-top" title="fecha: ${datosTraducidos[0].fecha}" >
//             <div class="card-body">
//               <h5 class="card-title"> ${json.title.trim()=="" ? "Sin titulo" : datosTraducidos[0].titulo}</h5>
//               <p class="card-text"> cultura: ${json.culture.trim()=="" ? "Sin datos" : datosTraducidos[0].cultura} </p>
//                <p class="card-text"> dinastia:${json.dynasty.trim()=="" ? "Sin datos" : datosTraducidos[0].dinastia}</p>
//               ${json.additionalImages && json.additionalImages.length > 0 ?
//               `<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalImg" onclick= "cargarImagenesAdicionales(${id})">
//                Imagenes Adicionales </button>` : ''}
//             </div>
//           </div> `;

// cantidadObjetos++;
console.log(cantidadObjetos);



} catch (error) { 
    let mensaje = error.statusText || "Ocurrio un error";
    console.log(mensaje);
}
   
};


if (cantidadObjetos > 0) {
    paginas.push({ pagina: paginaActual, tarjetas: imagenesPresentacion });
}

$imagenes.innerHTML = paginas[0].tarjetas;

crearBotones(paginas);
};

async function cargarImagenesAdicionales(objectID) {
console.log("Funcion cargar imagenes adicionales");
    try {

        let resObjeto = await fetch(URL_OBJETO + objectID);
        if (!resObjeto.ok) throw new Error(`Error al obtener el objeto: ${resObjeto.status} - ${resObjeto.statusText}`);

        let jsonObjeto = await resObjeto.json();
        console.log(jsonObjeto);
    

        if (jsonObjeto.additionalImages.length === 0) {
            throw new Error('No se encontraron imágenes adicionales.');
        }
        function cambiarTamañoImagen(url) { //funcion para cambiar la URL de las imagen para que me traiga las mas chicas y no las orginales
            console.log(url);
            let nuevaUrl = url.replace('/original/', '/web-large/');
            console.log(nuevaUrl);
            return nuevaUrl;
        }


        let imagenesHTML = jsonObjeto.additionalImages.map(img => `
            <div class="col-4">
                <img src="${cambiarTamañoImagen(img)}" class="img-fluid" alt="Imagen adicional">
            </div>
        `).join('');

       
        document.getElementById('modalImage').innerHTML = imagenesHTML;
    } catch (err) {
        console.error(`Error al cargar imágenes adicionales para el ID ${objectID}: ${err.message}`);
    }
}


function crearBotones(paginas) {
    const contenedorBotones = document.getElementById("botones");


    paginas.forEach(el => {
        let boton = document.createElement("button");
        boton.textContent = `Página ${el.pagina}`;
        boton.onclick = () => mostrarPaginas(el.tarjetas);
        contenedorBotones.appendChild(boton); 
    });
}


function mostrarPaginas(tarjetas) {
    $imagenes.innerHTML = "";
    $imagenes.innerHTML = tarjetas;
}


async function cargarDepartamentos() {
    const $fragmento = document.createDocumentFragment();
    

    try {
        let respuesta = await fetch(URL_DEPARTAMENTOS),
        json = await respuesta.json();
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        console.log(json);
        json.departments.forEach(departamento =>{  
            const option = document.createElement('option');
            option.value = departamento.departmentId;
            option.textContent = departamento.displayName;
          
            $fragmento.appendChild(option);

console.log(departamento.departmentId);
    });

         $departamentos.appendChild($fragmento);


    } catch (error) {    
        let mensaje = error.statusText || "Ocurrio un error";
        console.log(mensaje);
    }
} 

async function cargarLocalidades() {

    const $fragmentoLocalidades = document.createDocumentFragment();
    

    try {
        let respuesta = await fetch('localidades.json'),
        json = await respuesta.json();
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
       
        Object.values(json).forEach(localidades=>{  
            const option2 = document.createElement('option');
            option2.textContent = localidades;

            console.log(localidades);
            
          $fragmentoLocalidades.appendChild(option2);

    });

         $localidades.appendChild($fragmentoLocalidades);


    } catch (error) {    
        let mensaje = error.statusText || "Ocurrio un error";
        console.log(mensaje);
    }
}
    



document.getElementById("buscar").addEventListener("click", async (event) => {
    event.preventDefault();
    const departamento = document.getElementById("departamentos").value;
    const keyword = document.getElementById("keyword").value;
    const localizacion = document.getElementById("localidades").value;
    const paramLocalizacion = localizacion != '' ? `&geoLocation=${localizacion}` : "";
    const paramDepartamentos = departamento != '' ? `&departmentId=${departamento}` : "";

      console.log(paramDepartamentos, paramLocalizacion);
      console.log(URL_SEARCH + `?q=${keyword}${paramDepartamentos}${paramLocalizacion}`);


try { 
    let res =  await fetch(URL_SEARCH + `?q=${keyword}${paramDepartamentos}${paramLocalizacion}`),
jsonBuscar = await res.json(); 
console.log(res);
console.log(jsonBuscar);
console.log(jsonBuscar.objectIDs);
if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
let datos = jsonBuscar.objectIDs;
console.log(datos);

cargarDatos(datos);
    
} catch (error) { 
    let mensaje = error.statusText || "Ocurrio un error";
    console.log(mensaje);
   
    
}


});

cargarDepartamentos();
cargarLocalidades();
// Cargar departamentos al cargar la página

