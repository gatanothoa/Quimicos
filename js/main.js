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
  if(searchInput){
    searchInput.addEventListener('input', function(e){
      const q = e.target.value.toLowerCase();
      let found = false;
      document.querySelectorAll('.product').forEach(p => {
        const name = p.querySelector('.product-title')?.textContent?.toLowerCase() || '';
        const cat = p.dataset.cat?.toLowerCase() || '';
        const match = (name.includes(q) || cat.includes(q));
        p.style.display = match ? 'flex' : 'none';
        if(match) found = true;
      });
      // Feedback visual si no hay resultados
      if(!found && q.length > 0){
        if(!document.getElementById('noResultsMsg')){
          const msg = document.createElement('div');
          msg.id = 'noResultsMsg';
          msg.textContent = 'No se encontraron productos.';
          msg.style = 'color:var(--muted);margin:18px 0 0 0;text-align:center;font-size:1.1em;';
          document.getElementById('productsGrid').appendChild(msg);
        }
      }else{
        const msg = document.getElementById('noResultsMsg');
        if(msg) msg.remove();
      }
    });
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
