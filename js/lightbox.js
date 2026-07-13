(function () {
  var overlay, imgEl, counterEl, prevBtn, nextBtn;
  var currentGroup = [];
  var currentIndex = 0;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Fechar">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Anterior">&#10094;</button>' +
      '<figure class="lightbox-frame">' +
        '<img class="lightbox-img" alt="">' +
        '<span class="lightbox-counter"></span>' +
      '</figure>' +
      '<button class="lightbox-next" aria-label="Seguinte">&#10095;</button>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.lightbox-img');
    counterEl = overlay.querySelector('.lightbox-counter');
    prevBtn = overlay.querySelector('.lightbox-prev');
    nextBtn = overlay.querySelector('.lightbox-next');

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { show(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  function show(index) {
    var len = currentGroup.length;
    currentIndex = (index + len) % len;
    var item = currentGroup[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    counterEl.textContent = (currentIndex + 1) + ' / ' + len;
    var multi = len > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
    counterEl.style.display = multi ? '' : 'none';
  }

  function open(group, index) {
    currentGroup = group;
    show(index);
    overlay.classList.add('open');
    document.body.classList.add('lightbox-lock');
  }

  function close() {
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-lock');
  }

  function collectGroups() {
    var groups = [];
    ['.intro-image', '.strip', '.bath-strip', '.garden-gallery'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) {
        var imgs = Array.prototype.slice.call(el.querySelectorAll('img'));
        if (imgs.length) groups.push(imgs);
      }
    });
    Array.prototype.slice.call(document.querySelectorAll('.room-gallery')).forEach(function (el) {
      var imgs = Array.prototype.slice.call(el.querySelectorAll('img'));
      if (imgs.length) groups.push(imgs);
    });
    return groups;
  }

  window.initGalleries = function () {
    if (!overlay) buildOverlay();
    var groups = collectGroups();
    groups.forEach(function (imgs) {
      var group = imgs.map(function (img) {
        return { src: img.currentSrc || img.src, alt: img.alt };
      });
      imgs.forEach(function (img, i) {
        img.classList.add('is-clickable');
        img.addEventListener('click', function () {
          open(group, i);
        });
      });
    });
  };
})();
