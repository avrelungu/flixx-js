const global = {
    currentPage: window.location.pathname,
    popularMovies: document.querySelector('#popular-movies'),
    popularTvShows: document.querySelector('#popular-shows') 
}

const spinner = document.querySelector('.spinner');

const highlightActiveLink = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        if(link.getAttribute('href') == global.currentPage) link.classList.add('active')
    })
}

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
    const API_KEY = 'a85ec55fd8b834d8bbafd8cbf6011ec7';
    const API_URL = 'https://api.themoviedb.org/3/'

    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)

    hideSpinner();

    return await response.json();
}

const displayPopularMovies = async () => {
    const { results } = await fetchAPIData('movie/popular');

    results.forEach(movie => addMovieToList(movie))
}

const displayPopularTvShows = async () => {
    const { results } = await fetchAPIData('tv/popular');

    results.forEach(tvshow => addTvShowToList(tvshow))
}

const addMovieToList = (movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('card');
    movieCard.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;

    global.popularMovies.appendChild(movieCard)
}

const addTvShowToList = (show) => {
    const tvshowCard = document.createElement('div');
    tvshowCard.classList.add('card');
    tvshowCard.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>
        `;

    global.popularTvShows.appendChild(tvshowCard)
}

const showSpinner = () => {
    spinner.classList.add('show');
}

const hideSpinner = () => {
    spinner.classList.remove('show');
}

const displayBackgroundImage = (type, path) => {
    const container = document.createElement('div');

    container.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${path})`
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.backgroundRepeat = 'no-repeat'
    container.style.height = '100vh';
    container.style.width = '100vw'
    container.style.position = 'absolute';
    container.style.top = '0'
    container.style.left = '0'
    container.style.zIndex = '-1'
    container.style.opacity = '0.1'

    document.querySelector(`#${type}-details`).appendChild(container);
    
}

const displayMovieDetails = async () => {
    const id = window.location.search.split('=')[1];

    const movie = await fetchAPIData(`movie/${id}`)

    // Display overview for background
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
        <div class="details-top">
            <div>
                ${
                  movie.poster_path
                    ? `<img
                  src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                  class="card-img-top"
                  alt="${movie.title}"
                />`
                      : `<img
                  src="../images/no-image.jpg"
                  class="card-img-top"
                  alt="${movie.title}"
                />`
                }
            </div>
            <div>
              <h2>${movie.title}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)} / 10
              </p>
              <p class="text-muted">Release Date: ${movie.release_date}</p>
              <p>${movie.overview}</p>
              <h5>Genres</h5>
              <ul class="list-group">
                ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
              </ul>
              <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>
          <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
              <li><span class="text-secondary">Budget:</span> $${addComasToNumers(movie.budget)}</li>
              <li><span class="text-secondary">Revenue:</span> $${addComasToNumers(movie.revenue)}</li>
              <li><span class="text-secondary">Runtime:</span> ${addComasToNumers(movie.runtime)}</li>
              <li><span class="text-secondary">Status:</span> ${addComasToNumers(movie.status)}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies.map(company => company.name).join(', ')}</div>
        </div>
    `;

    const movieDetails = document.querySelector('#movie-details');

    movieDetails.appendChild(div);
}

const displayTvShowDetails = async () => {
	const id = window.location.search.split('=')[1];

    const show = await fetchAPIData(`tv/${id}`)

	console.log(show);

    // Display overview for background
    displayBackgroundImage('show', show.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `
	<div class="details-top">
		<div>
		${
			show.poster_path
			  ? `<img
			src="https://image.tmdb.org/t/p/w500${show.poster_path}"
			class="card-img-top"
			alt="${show.name}"
			/>`
					: `<img
				src="../images/no-image.jpg"
				class="card-img-top"
				alt="${show.name}"
			/>`
		  }
		</div>
		<div>
		<h2>${show.name}</h2>
		<p>
			<i class="fas fa-star text-primary"></i>
			${show.vote_average.toFixed(1)} / 10
		</p>
		<p class="text-muted">Release Date: ${show.first_air_date}</p>
		<p>
			${show.overview}
		</p>
		<h5>Genres</h5>
		<ul class="list-group">
			${show.genres.map((genre) => `<li> ${genre.name} </li>`).join('')}
		</ul>
		<a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
		</div>
	</div>
	<div class="details-bottom">
		<h2>Show Info</h2>
		<ul>
		<li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
		<li>
			<span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
		</li>
		<li><span class="text-secondary">Status:</span> ${show.status}</li>
		</ul>
		<h4>Production Companies</h4>
		<div class="list-group">${show.production_companies.map((company) => company.name).join(', ')}</div>
	</div>
	`;

	document.querySelector('#show-details').appendChild(div)
}

const addComasToNumers = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App
const init = () => {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            console.log('home');
            break;
        case '/shows.html':
            displayPopularTvShows();
            console.log('shows');
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayTvShowDetails();
            break;
        case '/search.html':
            console.log('search');
            break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);