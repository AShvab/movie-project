const scrollEl = document.querySelector('.upward');
scrollEl.addEventListener('click', scrollTopTop);


//кнопка буде показуватися, коли користувач прокручує вниз на більше половини висоти вікна браузера
window.addEventListener('scroll', function () {
    const windowHeight = window.innerHeight;
    scrollEl.classList.toggle('active', window.scrollY > windowHeight * 0.5);
});

function scrollTopTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}