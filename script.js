const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2c50eab4e32d54b929b198f39b5f4166';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=2c50eab4e32d54b929b198f39b5f4166&query="';

const GET_GENRE = 'https://api.themoviedb.org/3/genre/movie/list?api_key=2c50eab4e32d54b929b198f39b5f4166';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const buttons_wrapper = document.querySelector('.button-wrapper');


// Get initial movies
getMovies(API_URL);
var genre_key_value;

async function getGenre(){
    const genre = await fetch(GET_GENRE);
    const genre_data = await genre.json();

    return genre_data;
}


async function getMovies(url, start, end, id){
    const res = await fetch(url);
    const data = await res.json();
    addPagination(url, data.total_pages, start, end, id);
    showMovies(data.results);
}

async function showMovies(movies){
    await getGenre().then(data => {
        genre_key_value = JSON.parse(JSON.stringify(data.genres));
    })
    main.innerHTML = '';

    if (movies.length == 0){
        main.innerHTML = `<div class="no-result">No result found</div>`;
    } 

    movies.forEach((movie) => {
        const { original_title, poster_path, genre_ids, vote_average, overview, release_date } = movie
        // console.log(release_date);
        console.log(poster_path);
        if (poster_path == null) return;
        let results = genre_key_value.filter(o1 => genre_ids.some(o2 => o1.id === o2));
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = 
        ` 
        <div class="img-holder">
        <img src="${IMG_PATH + poster_path}" alt="${original_title}">
        <div class="release-date">${release_date}</div>
        </div>
        <div class="movie-info">
          <h3>${original_title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            
        </div>
        
        <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
      `;
      const another = document.createElement('div');
      another.classList.add('ss');
      results.forEach(result => {
            another.innerHTML += `<span class="genre">${result.name}</span>`
        });

      main.appendChild(movieEl);
      movieEl.appendChild(another);

    })
}

function getClassByRate(vote){
    if (vote >= 8){
        return 'green';
    }else if (vote >= 5) {
        return 'orange';
    }else {
        return 'red';
    }
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== ''){
        getMovies(SEARCH_API + searchTerm, undefined, undefined, undefined);

        search.value = '';
    }else {
        window.location.reload();
    }
})


function addPagination(URL, totalPages, start, end, id){
    buttons_wrapper.innerHTML = '';

    if (typeof start === 'undefined'){
        start = 1
        id = 1
    }
    if (typeof end === 'undefined'){
        if (totalPages > 5){
            end = 5;
        }else {
            end = totalPages;
        }
    }

    for (let i = start; i <= end; i++){
        let button = document.createElement('button');
        if (i == start) button.setAttribute('id', 'first');
        if (i == end) button.setAttribute('id', 'last');
        if (i == id) button.classList.add('active');
        button.classList.add('btn');
        button.innerText = i;
        buttons_wrapper.appendChild(button);
    }

    document.querySelector('.text-index').textContent = `Page ${id} of ${totalPages}`;
    const buttons = document.querySelectorAll(".btn");
    console.log(buttons);
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
        
            e.preventDefault();
            if (button.id == 'last'){
                if (Number(button.textContent) + 2 <= totalPages && button.textContent - 5 >= 0){
                    end = Number(button.textContent) + 2;
                    start = Number(button.textContent) - 2;
                    console.log("end", end);
                }else if (Number(button.textContent) + 1 <= totalPages){
                    end = Number(button.textContent) + 1;
                    start = Number(button.textContent) - 3;
                }
            }
            if (button.id == 'first'){
                if (Number(button.textContent) - 2 >= 1){
                    start = Number(button.textContent) - 2;
                    end = Number(button.textContent) + 2;
                }
                else if (Number(button.textContent) - 1 == 1){
                    start = Number(button.textContent) - 1;
                    end = Number(button.textContent) + 3;
                }
            }
            let page = "&page=" + button.textContent;
            getMovies(URL + page, start, end, button.textContent);
        })
    });

}


document.getElementById('logo').addEventListener('click', () =>  window.location.reload());

  