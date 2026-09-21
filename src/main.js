import './style.css';
import services from './data/services.json';
import oils from './data/oils.json';

const faqs = [
  ['Как часто нужно менять масло?', 'Замена масла в двигателе согласно рекомендаций завода-изготовителя подходит только для идеальных условий. Езда по городу к таким условиям не относится. Качество моторного масла, при эксплуатации автомобиля в городе, теряет свои качества в 3–4 раза быстрее, чем на трассе при равном пробеге. Pro Масло рекомендует менять масло не реже 10 000 км или один раз в год.'],
  ['Какое масло лучше заливать в двигатель?', 'При выборе моторного масла для автомобиля, следует обратить внимание на класс вязкости, класс качества и допуск для вашего авто. Не менее важное при выборе — производитель, которому Вы доверяете. Высокое качество моторного масла и его своевременная замена — один из главных факторов, который обеспечивает долгосрочную работу двигателя без возникновения неисправностей. Pro Масло — это только оригинальные масла с высоким классом качества.'],
  ['Есть ли у вас в продаже масло и фильтры?', 'В Pro Масло имеются в продаже оригинальные масла мировых производителей моторных масел: ELF, Shell, Castrol, Liqui Moly, Mobil, а также фильтры MANN и Filtron.'],
  ['Чем вы лучше остальных сервисов?', 'У нас вы можете наблюдать за процессом смены масла. Низкие цены, дешевле чем в «замена бесплатно». Удобно, доступно. В Pro Масло только оригинальные фильтры и масла известных производителей.']
];

document.querySelector('#oil-prices').innerHTML = services.oilChangePrices
  .map(({ name, price, note }) => `<article class="price-row"><div><h3>${name}</h3>${note ? `<p>${note}</p>` : ''}</div><strong>${price}</strong></article>`)
  .join('');

document.querySelector('#tire-rows').innerHTML = services.tirePrices
  .map(({ diameter, passenger, crossoverMinivan }) => `<div class="tire-row"><span>${diameter}</span><span>${passenger}</span><span>${crossoverMinivan}</span></div>`)
  .join('');

document.querySelector('#oil-grid').innerHTML = oils
  .map(({ name, price, description, specifications }, index) => `<article class="oil-card"><div class="oil-card-top"><span>${String(index + 1).padStart(2, '0')}</span><strong>${price}</strong></div><h3>${name}</h3><p>${description}</p>${specifications ? `<details><summary>Характеристики <span>+</span></summary><p>${specifications}</p></details>` : ''}</article>`)
  .join('');

document.querySelector('#faq-list').innerHTML = faqs
  .map(([question, answer], index) => `<details ${index === 0 ? 'open' : ''}><summary>${question}<span>+</span></summary><p>${answer}</p></details>`)
  .join('');

document.querySelector('#year').textContent = new Date().getFullYear();

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const track = carousel.querySelector('.gallery-track');
  const slides = [...carousel.querySelectorAll('.gallery-slide')];
  const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
  const current = carousel.querySelector('[data-carousel-current]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  let activeIndex = 0;
  let pointerStart = null;

  const renderSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === activeIndex) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    current.textContent = String(activeIndex + 1).padStart(2, '0');
  };

  previous.addEventListener('click', () => renderSlide(activeIndex - 1));
  next.addEventListener('click', () => renderSlide(activeIndex + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => renderSlide(Number(dot.dataset.carouselDot))));

  const viewport = carousel.querySelector('.gallery-viewport');
  viewport.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
  viewport.addEventListener('pointerup', (event) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 40) renderSlide(activeIndex + (distance < 0 ? 1 : -1));
    pointerStart = null;
  });
  viewport.addEventListener('pointercancel', () => { pointerStart = null; });

  renderSlide(0);
}

const watcher = new IntersectionObserver(
  (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }),
  { threshold: 0.12 },
);
document.querySelectorAll('.reveal, .service-card, .price-row, .oil-card').forEach((element) => watcher.observe(element));
