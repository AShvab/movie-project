
import {genres} from './genres.js';

const API_KEY = 'api_key=a3ba6241cf3e8caa1456599894b81cc2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev');
const current = document.getElementById('current');
const next = document.getElementById('next');

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 1000;


let selectedGenre = [];
setGenre();

function setGenre(){
    tagsEl.innerHTML = '';
    genres.forEach(({id, name}) =>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = id;
        t.innerText = name;
        t.addEventListener('click', ()=>{
            if(selectedGenre.length ===0){
                selectedGenre.push(id);
            }else{
                if(selectedGenre.includes(id)){
                    selectedGenre = selectedGenre.filter(genreId => genreId !== id);
                }else{
                    selectedGenre.push(id);  
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection();
        })
        tagsEl.append(t);
    })
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length !== 0){
        selectedGenre.forEach(id =>{
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('clear-btn');
    } else {
        let clear = document.createElement('div');
        clear.classList.add("tag", "clear-btn");
        clear.id = 'clear';
        clear.innerText = 'Clear X';
        clear.addEventListener('click', () =>{
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tags.append(clear);
    }
}


getMovies(API_URL);
function getMovies(url){
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        // console.log(data)
        if(data.results.length !== 0){
            showMovies(data.results);
            
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;
            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled');                
            } else if(currentPage >= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled');  
            }else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled');  
            }
            tagsEl.scrollIntoView({behavior: 'smooth'})

        }else{
            main.innerHTML = `<h2 class="no-results">No results found</h2>`;
        }                
    })
}

function showMovies(data){
    main.innerHTML='';
    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}" width="300" height="450">
        <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>        
        </div>

        <div class="overview">
        <h3>Overview</h3>
        ${overview}
        </div>
        `
        main.appendChild(movieEl);
    })
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener ('submit', (e) =>{
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm);
    }else{
        getMovies(API_URL);
    }
})

prev.addEventListener ('click', () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})


next.addEventListener ('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page){    
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if(key[0] !== page){
        let url = lastUrl + "&page=" + page
        getMovies(url)
    } else {
        key[1] = page.toString()
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}


// const prev = document.getElementById('prev');
// const next = document.getElementById('next');

// let currentPage = 1;

// prev.addEventListener('click', () => {
//   if (currentPage > 1) {
//     currentPage--;
//     updatePagination();
//   }
// });

// next.addEventListener('click', () => {
//   if (currentPage < totalPages) {
//     currentPage++;
//     updatePagination();
//   }
// });

// function updatePagination() {
//   const page1 = document.getElementById('page-1');
//   const page2 = document.getElementById('page-2');
//   const page3 = document.getElementById('page-3');
//   const page4 = document.getElementById('page-4');
//   const page5 = document.getElementById('page-5');

//   if (currentPage <= 3) {
//     page1.innerText = '1';
//     page2.innerText = '2';
//     page3.innerText = '3';
//     page4.innerText = '4';
//     page5.innerText = '5';
//   } else if (currentPage >= totalPages - 2) {
//     page1.innerText = totalPages - 4;
//     page2.innerText = totalPages - 3;
//     page3.innerText = totalPages - 2;
//     page4.innerText = totalPages - 1;
//     page5.innerText = totalPages;
//   } else {
//     page1.innerText = currentPage - 2;
//     page2.innerText = currentPage - 1;
//     page3.innerText = currentPage;
//     page4.innerText = currentPage + 1;
//     page5.innerText = currentPage + 2;
//   }

//   const current = document.querySelector('.current');
//   current.classList.remove('current');
//   const currentEl = document.getElementById(`page-${currentPage}`);
//   currentEl.classList.add('current');

//   if (currentPage === 1) {
//     prev.classList.add('disabled');
//   } else {
//     prev.classList.remove('disabled');
//   }

//   if (currentPage === totalPages) {
//     next.classList.add('disabled');
//   } else {
//     next.classList.remove('disabled');
//   }
// }

// updatePagination();
