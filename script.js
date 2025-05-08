let currentOpenFAQ = null;
let currentOpenProduct = null;

function renderMainMenu() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 40px;">
        <img src="./logo.svg" alt="Logo" style="width: 120px; height: auto; margin-bottom: 30px;">
        <ul class="menu-list" style="width: 100%; max-width: 400px; padding: 0; margin: 0;">
            <li onclick="showSection('Школьная мебель')" style="width: 100%; text-align: center; padding: 15px 0; cursor: pointer; border-bottom: 1px solid #ddd;">Школьная мебель</li>
            <li onclick="showSection('Детская мебель')" style="width: 100%; text-align: center; padding: 15px 0; cursor: pointer; border-bottom: 1px solid #ddd;">Детская мебель</li>
            
            <li onclick="showSection('qa')" style="width: 100%; text-align: center; padding: 15px 0; cursor: pointer;">Вопросы и ответы</li>
            <li onclick="showSection('about')" style="width: 100%; text-align: center; padding: 15px 0; cursor: pointer; border-bottom: 1px solid #ddd;">Про нас</li>
        </ul>
        </div>
    `;
}


function addBackButton(container) {
  const backBtn = document.createElement('button');
  backBtn.className = 'back-button';
  backBtn.textContent = '← Назад';
  backBtn.onclick = () => renderMainMenu();
  container.appendChild(backBtn);
}

async function showSection(section) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  addBackButton(content);

  if (section === 'about') {
    const aboutHeading = document.createElement('h2');
    aboutHeading.textContent = 'Belsi';
    const aboutText = document.createElement('p');
    aboutText.textContent = 'Тут можно кратенько написать про магазин';
    content.appendChild(aboutHeading);
    content.appendChild(aboutText);
    return;
  
  }

  if (section === 'qa') {
    const res = await fetch('faq.json');
    const faqs = await res.json();

    faqs.forEach((faq, index) => {
      const div = document.createElement('div');
      div.className = 'faq-item';
      div.innerHTML = `<div class="faq-question">${faq.question}</div><div class="faq-answer">${faq.answer}</div>`;

      div.querySelector('.faq-question').addEventListener('click', () => {
        if (currentOpenFAQ && currentOpenFAQ !== div) {
          currentOpenFAQ.querySelector('.faq-answer').style.display = 'none';
        }
        const answer = div.querySelector('.faq-answer');
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        currentOpenFAQ = answer.style.display === 'block' ? div : null;
      });

      content.appendChild(div);
    });
    return;
  }

  const res = await fetch('products.json');
  const products = await res.json();
  const items = products[section];
  const heading = document.createElement('h2');
  heading.textContent = section.charAt(0).toUpperCase() + section.slice(1);
  content.appendChild(heading);

  items.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `<div class="product-name">${item.name}</div>`;

    const details = document.createElement('div');
    details.className = 'product-details';

    item.images.forEach(img => {
      const image = document.createElement('img');
      image.src = img;
      image.alt = item.name;
      image.style.width = '100%';
      image.style.maxWidth = '300px';
      image.style.marginBottom = '5px';
      details.appendChild(image);
    });

    const priceEl = document.createElement('p');
    priceEl.textContent = `Цена: ${item.price} руб.`;
    details.appendChild(priceEl);

    const buyBtn = document.createElement('button');
    buyBtn.className = 'buy-button';
    buyBtn.textContent = 'Заказать';
    buyBtn.setAttribute('data-id', `${section}-${idx}`);
    details.appendChild(buyBtn);

    div.appendChild(details);

    div.querySelector('.product-name').addEventListener('click', () => {
      if (currentOpenProduct && currentOpenProduct !== div) {
        currentOpenProduct.querySelector('.product-details').style.display = 'none';
      }
      const display = details.style.display === 'block';
      details.style.display = display ? 'none' : 'block';
      currentOpenProduct = !display ? div : null;
    });

    content.appendChild(div);
  });

}

renderMainMenu();