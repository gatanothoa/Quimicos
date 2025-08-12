// Efecto parallax sutil al mover el mouse sobre el fondo
document.addEventListener('mousemove', function(e) {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
});

// Redesigned main JS - simple client-side search and small interactions

// Animación de entrada para productos y tarjetas
function animateOnLoad(selector, delay=60) {
  const items = document.querySelectorAll(selector);
  items.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = 1;
      el.style.transform = 'none';
    }, delay * i + 200);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  animateOnLoad('.product');
  animateOnLoad('.card,aside.card', 120);
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');

  // Búsqueda dinámica en reactivos.html y vidrieria.html
  let productosDinamicos = null;
  async function cargarProductosDinamicos() {
    if(productosDinamicos) return productosDinamicos;
    productosDinamicos = [];
    const paginas = [
      { url: 'categorias/reactivos.html', cat: 'Reactivos' },
      { url: 'categorias/vidrieria.html', cat: 'Vidriería' }
    ];
    for(const pag of paginas) {
      try {
        const res = await fetch(pag.url);
        const html = await res.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;
        temp.querySelectorAll('.product').forEach(prod => {
          const nombre = prod.querySelector('.product-title')?.textContent?.trim() || '';
          const desc = prod.querySelector('.product-desc')?.textContent?.trim() || '';
          productosDinamicos.push({ nombre, desc, cat: pag.cat, url: pag.url });
        });
      } catch(e) {}
    }
    return productosDinamicos;
  }

  async function mostrarResultados(q) {
    if(!searchResults) return;
    searchResults.innerHTML = '';
    if(!q || q.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    // Función para normalizar y quitar acentos/diacríticos
      function normalizar(str) {
        return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    const ql = normalizar(q);
    const productos = await cargarProductosDinamicos();
      const resultados = productos.filter(item => {
        const nombreNorm = normalizar(item.nombre);
        const descNorm = normalizar(item.desc);
        const catNorm = normalizar(item.cat);
        return nombreNorm.includes(ql) || descNorm.includes(ql) || catNorm.includes(ql);
      });
    // Función para escapar caracteres peligrosos
    function escapeHTML(str) {
      return str.replace(/[&<>"']/g, function(tag) {
        const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
        return chars[tag] || tag;
      });
    }
    if(resultados.length === 0) {
      searchResults.innerHTML = '<div style="color:var(--accent);background:#fff3f3;padding:16px 10px;border-radius:8px;text-align:center;font-weight:600;">No se encontraron productos para tu búsqueda.</div>';
    } else {
      searchResults.innerHTML = resultados.map(item =>
        `<div style='margin-bottom:10px'>
          <a href='../${escapeHTML(item.url)}' style='font-weight:600;color:var(--primary);text-decoration:none'>${escapeHTML(item.nombre)}</a><br>
          <span style='font-size:0.95em;color:var(--muted)'>${escapeHTML(item.cat)}</span><br>
          <span style='font-size:0.95em;'>${escapeHTML(item.desc)}</span>
        </div>`
      ).join('');
    }
    searchResults.style.display = 'block';
  }

  if(searchInput && searchResults){
    searchInput.addEventListener('input', function(e){
      mostrarResultados(e.target.value);
    });
    if(searchBtn){
      searchBtn.addEventListener('click', function(){
        mostrarResultados(searchInput.value);
      });
    }
    if(searchInput.form){
      searchInput.form.addEventListener('submit', function(e){
        e.preventDefault();
        mostrarResultados(searchInput.value);
      });
    }
  }
  // Scroll suave para anclas

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });
  if(window.initCarousel) window.initCarousel = null;
});
