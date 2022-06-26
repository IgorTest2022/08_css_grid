"use strict"
const openSearch = document.querySelector('.header-btn');
const closeSearch = document.querySelector('.form-button--close');
const search = document.querySelector('.form-search');

openSearch.addEventListener('click', () => {
  search.classList.add('active')
});

closeSearch.addEventListener('click', () => {
  search.classList.remove('active')
});

const contactsBlock2 = document.querySelector('.contacts-block2');
const contactsBlock = document.querySelector('.contacts-block');


contactsBlock2.addEventListener('click', () => {
  contactsBlock.classList.add('open');
})
