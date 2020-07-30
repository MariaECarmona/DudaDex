import { showList, showDetail } from './navigation.js';
import { listItemTemplate, typeTemplate } from './templates.js';
import { capitalize } from './capitalize.js';
import { friendlyFetch } from './data.js';

// endereço da API: usado para fazer as requisições
const api = 'https://pokeapi.co/api/v2/';

// pega todos os elementos HTML que serão necessários
const listEl = document.querySelector('#list');
const detailEl = document.querySelector('#detail-section');
const backEl = document.querySelector('.back-to-list');
const avatarImgEl = document.querySelector('#avatar-img');
const detailAvatarImgEl = detailEl.querySelector('.item-avatar-img');
const detailNumberEl = detailEl.querySelector('.number');
const detailNameEl = detailEl.querySelector('.name');
const detailTitleEl = detailEl.querySelector('#detail-title');
const detailWeightEl = detailEl.querySelector('#detail-weight');
const detailHeightEl = detailEl.querySelector('#detail-height');
const detailTypesEl = detailEl.querySelector('#detail-types');

// lista com todos os pokemons
let pokemons = [];

//Ex01
friendlyFetch(`${api}pokemon/?limit=151`).then(resposta => {
    pokemons = resposta.results;
    listEl.innerHTML = '';
    for(let i=0; i<pokemons.length;i++){
        const id = i+1;
        const dadosPokemon = {
            number : id,
            imageUrl : 'imgs/placeholder.png',
            name: capitalize(pokemons[i].name)
        }

        listEl.innerHTML += listItemTemplate(dadosPokemon);

        friendlyFetch(`${api}pokemon/${id}`)
        .then(resposta => {
            const imgPokemon = document.querySelector(`li[data-id="${id}"] img.item-avatar-img`);
            imgPokemon.src = resposta.sprites.front_default;
        });
    }

    //Ex02
    const pokemonsLista = document.querySelectorAll('li.list-item');

    pokemonsLista.forEach(pokemonEl => {
        pokemonEl.addEventListener('click', (e) => {
            const clicadoEl = e.target.offsetParent;
            const idPokemon = clicadoEl.dataset.id;
            const selecionado = document.querySelector('li.list-item.selected');
            if(selecionado){
                selecionado.classList.remove("selected");
            }

            clicadoEl.classList.add('selected');
            showDetail();
            fetch(`${api}pokemon/${idPokemon}`)
            .then((resposta) => resposta.json())
            .then((detalhes) => {
                avatarImgEl.src = detalhes.sprites.front_default;
                detailAvatarImgEl.src = detalhes.sprites.front_default;
                detailNumberEl.innerHTML = String(detalhes.id).padStart(3,"0");
                detailNameEl.innerHTML = capitalize(detalhes.name);
                detailHeightEl.innerHTML = detalhes.height;
                detailWeightEl.innerHTML = detalhes.weight;
                detailTypesEl.innerHTML = "";
                
                for(let tipo of detalhes.types){
                    detailTypesEl.innerHTML += typeTemplate(tipo.type.name);
                }
            });
        });
    });
    backEl.addEventListener("click",showList);
});
