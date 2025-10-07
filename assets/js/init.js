// Hamburger toggle
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  let isOpen = false;

  menuToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      menu.classList.remove('max-h-0', 'p-0');
      menu.classList.add('max-h-[600px]', 'p-6');
    } else {
      menu.classList.remove('max-h-[600px]', 'p-6');
      menu.classList.add('max-h-0', 'p-0');
    }
  });
// Hamburger toggle

// Lightbox
  function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  image.src = src;
  lightbox.classList.remove('hidden');
  }

  function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  }

  // ✅ Close on background click
  document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
  });

  // ✅ Optional: close with Esc key
  document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  });
//Lightbox