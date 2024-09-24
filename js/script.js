const apiUrl = 'https://japceibal.github.io/japflix_api/movies-data.json';

window.onload = () => {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      window.movieData = data; // Guardamos los datos en una variable global
      console.log('Datos obtenidos:', movieData);
    })
    .catch(error => console.error('Error al obtener los datos:', error));
};

document.getElementById('btnBuscar').addEventListener('click', () => {
  const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
  if (query) {
    buscarPeliculas(query);
  }
});

const buscarPeliculas = (query) => {
  const resultados = window.movieData.filter(pelicula => {
    return pelicula.title.toLowerCase().includes(query) ||
           pelicula.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
           (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query)) ||
           pelicula.overview.toLowerCase().includes(query);
  });

  mostrarPeliculas(resultados);
};

const mostrarPeliculas = (peliculas) => {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiamos la lista de resultados previos

  peliculas.forEach(pelicula => {
    const item = document.createElement('li');
    item.className = 'list-group-item bg-dark text-light mb-2 d-flex justify-content-between align-items-center';
    
    const contenido = `
      <div>
        <h5>${pelicula.title}</h5>
        <p class="text-muted">${pelicula.tagline || 'Sin descripción'}</p>
      </div>
    `;

    item.innerHTML = contenido;
    item.appendChild(generarEstrellas(pelicula.vote_average)); // Agregamos estrellas

    item.addEventListener('click', () => mostrarDetalles(pelicula));
    lista.appendChild(item);
  });
};

const generarEstrellas = (rating) => {
    const contenedorEstrellas = document.createElement('div');
    const estrellasLlenas = Math.round(rating); // Ahora el rango es 0-10
    const estrellasVacias = 10 - estrellasLlenas;
  
    // Generamos estrellas llenas
    for (let i = 0; i < estrellasLlenas; i++) {
      const estrella = document.createElement('i');
      estrella.classList.add('fa', 'fa-star', 'text-warning');
      contenedorEstrellas.appendChild(estrella);
    }
  
    // Generamos estrellas vacías
    for (let i = 0; i < estrellasVacias; i++) {
      const estrella = document.createElement('i');
      estrella.classList.add('fa', 'fa-star-o', 'text-warning');
      contenedorEstrellas.appendChild(estrella);
    }
  
    return contenedorEstrellas;
  };
  

const mostrarDetalles = (pelicula) => {
  document.getElementById('detalle-pelicula').classList.remove('d-none');
  document.getElementById('detalle-titulo').innerText = pelicula.title;
  document.getElementById('detalle-overview').innerText = pelicula.overview;
  
  const generos = pelicula.genres.map(genre => genre.name).join(' - ');
  document.getElementById('detalle-generos').innerText = generos;

  document.getElementById('detalle-ano').innerText = `Año: ${pelicula.release_date.split('-')[0]}`;
  document.getElementById('detalle-runtime').innerText = `Duración: ${pelicula.runtime} mins`;
  document.getElementById('detalle-budget').innerText = `Presupuesto: $${pelicula.budget.toLocaleString()}`;
  document.getElementById('detalle-revenue').innerText = `Ganancias: $${pelicula.revenue.toLocaleString()}`;
};

document.getElementById('btnCerrar').addEventListener('click', () => {
  document.getElementById('detalle-pelicula').classList.add('d-none');
});
