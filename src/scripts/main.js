'use strict';

const siteHeader = document.querySelector('.site-header');
const menuButton = document.querySelector('.site-header__menu-button');
const mobileLinks = document.querySelectorAll('.site-header__mobile-link');
const shopTabs = document.querySelectorAll('.shop__tab');
const shopProducts = document.querySelector('#shop-products');
const prevArrow = document.querySelector('.shop__arrow--prev');
const nextArrow = document.querySelector('.shop__arrow--next');
const contactForm = document.querySelector('.contact__form');
const contactStatus = document.querySelector('.contact__status');

const productsByCategory = {
  face: [
    {
      category: 'Face',
      title: 'Hydrophilic oil',
      description:
        'A soft cleansing oil that melts makeup and leaves skin calm and nourished.',
      price: '160 UAH',
      image: 'src/images/hydrophilic-oil.jpg',
      alt: 'Hydrophilic oil bottle on an earthy surface',
    },
    {
      category: 'Face',
      title: 'Face cream',
      description:
        'Daily cream with a rich texture for restoring comfort and moisture balance.',
      price: '210 UAH',
      image: 'src/images/face-cream.jpg',
      alt: 'Face cream jar styled with natural materials',
    },
    {
      category: 'Face',
      title: 'Ubtan',
      description:
        'A powder cleanser made for brightening the skin and refining texture naturally.',
      price: '160 UAH',
      image: 'src/images/ubtan.jpg',
      alt: 'Ubtan powder in a natural skincare setup',
    },
  ],
  body: [
    {
      category: 'Body',
      title: 'Silk body balm',
      description:
        'Deeply softening balm with plant oils for dry areas and evening rituals.',
      price: '240 UAH',
      image: 'src/images/main-img.jpg',
      alt: 'Natural body care products arranged in a minimal composition',
    },
    {
      category: 'Body',
      title: 'Herbal scrub',
      description:
        'A gentle exfoliating blend that polishes the skin without stripping it.',
      price: '190 UAH',
      image: 'src/images/hydrophilic-oil.jpg',
      alt: 'Herbal scrub inspired body product',
    },
    {
      category: 'Body',
      title: 'Restoring butter',
      description:
        'Dense nourishing butter that helps protect skin after sun, wind or cold.',
      price: '225 UAH',
      image: 'src/images/face-cream.jpg',
      alt: 'Restoring body butter packaging in eco style',
    },
  ],
  hair: [
    {
      category: 'Hair',
      title: 'Scalp serum',
      description:
        'A botanical serum for calmer roots and lightweight daily nourishment.',
      price: '230 UAH',
      image: 'src/images/main-img.jpg',
      alt: 'Hair serum presented among eco cosmetics products',
    },
    {
      category: 'Hair',
      title: 'Herbal shampoo',
      description:
        'Low-foam natural cleansing with a fresh herbal finish and soft touch.',
      price: '180 UAH',
      image: 'src/images/ubtan.jpg',
      alt: 'Herbal shampoo product styled in a warm palette',
    },
    {
      category: 'Hair',
      title: 'Conditioning mask',
      description:
        'A richer treatment that smooths lengths and supports everyday recovery.',
      price: '250 UAH',
      image: 'src/images/candle-small.jpg',
      alt: 'Conditioning mask presented in eco-friendly packaging',
    },
  ],
  candles: [
    {
      category: 'Candles',
      title: 'Moonlight amber',
      description:
        'A warm soy candle with resin notes and a slow, meditative burn.',
      price: '280 UAH',
      image: 'src/images/candle-big.jpg',
      alt: 'Large soy candle with natural decor',
    },
    {
      category: 'Candles',
      title: 'Forest ritual',
      description:
        'A smaller candle with green notes for quiet mornings and slow evenings.',
      price: '170 UAH',
      image: 'src/images/candle-small.jpg',
      alt: 'Small eco candle on a soft neutral surface',
    },
    {
      category: 'Candles',
      title: 'Gift set',
      description:
        'A curated ritual set with candlelight and natural care essentials.',
      price: '420 UAH',
      image: 'src/images/main-img.jpg',
      alt: 'Gift set with eco cosmetics and candles',
    },
  ],
};

let currentCategory = 'face';
let currentPage = 0;
let lastScrollY = window.scrollY;

function closeMenu() {
  siteHeader.classList.remove('site-header--menu-open');
  document.body.classList.remove('body--menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

function getSlidesPerView() {
  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 640) {
    return 2;
  }

  return 1;
}

function updateSliderControls(totalProducts) {
  const slidesPerView = getSlidesPerView();
  const maxPage = Math.max(0, Math.ceil(totalProducts / slidesPerView) - 1);

  prevArrow.disabled = currentPage === 0;
  nextArrow.disabled = currentPage >= maxPage;
}

function renderProducts() {
  const slidesPerView = getSlidesPerView();
  const products = productsByCategory[currentCategory];
  const maxPage = Math.max(0, Math.ceil(products.length / slidesPerView) - 1);

  if (currentPage > maxPage) {
    currentPage = maxPage;
  }

  const startIndex = currentPage * slidesPerView;
  const visibleProducts = products.slice(startIndex, startIndex + slidesPerView);

  shopProducts.innerHTML = visibleProducts
    .map(
      ({
        alt,
        category,
        description,
        image,
        price,
        title,
      }) => `
        <li class="shop__product">
          <article class="product-card">
            <div class="product-card__media">
              <img
                class="product-card__image"
                src="${image}"
                alt="${alt}"
              >
            </div>
            <div class="product-card__content">
              <p class="product-card__category">${category}</p>
              <h3 class="product-card__title">${title}</h3>
              <p class="product-card__description">${description}</p>
              <div class="product-card__footer">
                <p class="product-card__price">${price}</p>
                <a class="product-card__button" href="#contact">Buy now</a>
              </div>
            </div>
          </article>
        </li>
      `,
    )
    .join('');

  updateSliderControls(products.length);
}

function updateActiveTab(nextCategory) {
  currentCategory = nextCategory;
  currentPage = 0;

  shopTabs.forEach((tab) => {
    const isActive = tab.dataset.category === nextCategory;

    tab.classList.toggle('shop__tab--active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  renderProducts();
}

function handleHeaderOnScroll() {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;

  siteHeader.classList.toggle('site-header--scrolled', currentScrollY > 10);

  if (!siteHeader.classList.contains('site-header--menu-open')) {
    siteHeader.classList.toggle(
      'site-header--hidden',
      isScrollingDown && currentScrollY > 140,
    );
  }

  lastScrollY = currentScrollY;
}

menuButton.addEventListener('click', () => {
  const willOpen = !siteHeader.classList.contains('site-header--menu-open');

  siteHeader.classList.toggle('site-header--menu-open', willOpen);
  document.body.classList.toggle('body--menu-open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

shopTabs.forEach((tab) => {
  tab.addEventListener('click', () => updateActiveTab(tab.dataset.category));
});

prevArrow.addEventListener('click', () => {
  currentPage = Math.max(0, currentPage - 1);
  renderProducts();
});

nextArrow.addEventListener('click', () => {
  const slidesPerView = getSlidesPerView();
  const maxPage = Math.max(
    0,
    Math.ceil(productsByCategory[currentCategory].length / slidesPerView) - 1,
  );

  currentPage = Math.min(maxPage, currentPage + 1);
  renderProducts();
});

window.addEventListener('scroll', handleHeaderOnScroll, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    closeMenu();
  }

  renderProducts();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    contactStatus.textContent = '';

    return;
  }

  contactStatus.textContent =
    'Thanks! Your message has been sent. We will contact you soon.';
  contactForm.reset();
});

renderProducts();
handleHeaderOnScroll();
