document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  const track = document.querySelector('.carousel-track');
  if(track){
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    let index = 0;
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');

    function update(){
      const itemW = items[0].getBoundingClientRect().width + 10;
      track.style.transform = `translateX(${-index * itemW}px)`;
      // animación de opacidad
      items.forEach((item,i)=>{
        item.style.transition = 'opacity .4s, transform .4s';
        item.style.opacity = (i === index) ? '1' : '0.7';
        item.style.transform = (i === index) ? 'scale(1.08)' : 'scale(1)';
      });
    }
    window.addEventListener('resize', update);

    prev && prev.addEventListener('click', ()=>{
      index = Math.max(0, index - 1);
      update();
    });
    next && next.addEventListener('click', ()=>{
      index = Math.min(items.length - 1, index + 1);
      update();
    });

    setInterval(()=>{
      index = (index + 1) % items.length;
      update();
    }, 3500);
    update();
  }

  // Animación de entrada para cards y secciones
  const fadeInEls = document.querySelectorAll('.card, .about, .productos-home, .hero');
  fadeInEls.forEach((el,i)=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    setTimeout(()=>{
      el.style.transition = 'opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1)';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 200 + i*120);
  });
});
