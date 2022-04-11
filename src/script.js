'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Naming elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navContainer = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const tabsBtn = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const sectionsAll = document.querySelectorAll('.section');

// Modal window
const modalWindow = function () {
  // Functions
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  // Event handlers
  btnOpenModal.forEach(mod => mod.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
modalWindow();

// Button Scrolling
const btnScrollTo = function () {
  // Event handler
  btnScroll.addEventListener('click', function () {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
};
btnScrollTo();

// Page Navigation
const pageNav = function () {
  // Event handler
  nav.addEventListener('click', function (e) {
    e.preventDefault();

    // Matching Strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
};
pageNav();

// Menu fade
const menuFade = function () {
  // Function
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = e.target.closest('nav').querySelectorAll('.nav__link');
      const navLogo = e.target.closest('nav').querySelector('.nav__logo');

      siblings.forEach(sib => {
        if (sib !== link) sib.style.opacity = this;
      });
      navLogo.style.opacity = this;
    }
  };

  // Event handlers
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
};
menuFade();

// StickyNav
const stickyNav = function () {
  const navHeight = nav.getBoundingClientRect().height;

  // Function
  const stickyNav = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');

    // observer.unobserve(entry.target);
  };

  // IntersectioN API
  const navObs = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });
  navObs.observe(header);
};
stickyNav();

// Lazy Loading images
const lazyLoad = function () {
  const targetImgs = document.querySelectorAll('img[data-src]');

  // Function
  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };

  // Intersection API
  const imgObs = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  targetImgs.forEach(img => {
    imgObs.observe(img);
  });
};
lazyLoad();

// Tabbed Components
const tabs = function () {
  // Event handler
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    console.log(clicked);

    if (!clicked) return;

    // Removing Active classes
    tabsBtn.forEach(tab => {
      tab.classList.remove('operations__tab--active');
    });
    tabsContent.forEach(tab => {
      tab.classList.remove('operations__content--active');
    });

    // Active tab
    clicked.classList.add('operations__tab--active');

    // Active content
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
tabs();

// Slider
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    curSlide = (curSlide + 1) % maxSlide;
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    curSlide = (curSlide - 1 + maxSlide) % maxSlide;
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // Init function
  const init = function () {
    createDots();
    activateDots(0);
    goToSlide(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      curSlide = parseInt(slide, 10);
      activateDots(slide);
    }
  });
};
slider();

// Reveal Sections
const revealSec = function () {
  // Function
  const secReveal = function (entries, observer) {
    const [entry] = entries;
    console.log(entry);

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  // Intersection API
  const secObds = new IntersectionObserver(secReveal, {
    root: null,
    threshold: 0.15,
  });

  sectionsAll.forEach(sec => {
    sec.classList.add('section--hidden');
    secObds.observe(sec);
  });
};
revealSec();
