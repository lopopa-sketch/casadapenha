(function () {
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function nl2br(str) {
    return esc(str).replace(/\n/g, '<br>');
  }

  function renderSite(data) {
    // Hero
    if (data.hero) {
      const heroImg = document.getElementById('heroImg');
      if (heroImg && data.hero.image) {
        heroImg.src = data.hero.image;
        heroImg.alt = data.hero.title || '';
      }
      const heroContent = document.getElementById('heroContent');
      if (heroContent) {
        heroContent.innerHTML =
          '<span class="eyebrow">' + esc(data.hero.eyebrow) + '</span>' +
          '<h1>' + esc(data.hero.title) + '</h1>' +
          '<p class="hero-sub">' + esc(data.hero.subtitle) + '</p>' +
          '<a href="#casa" class="scroll-cue" aria-label="Descer"><span></span></a>';
      }
    }

    // Intro
    if (data.intro) {
      const introInner = document.getElementById('introInner');
      if (introInner) {
        const paragraphs = (data.intro.paragraphs || []).map(function (p) {
          return '<p>' + esc(p) + '</p>';
        }).join('');
        introInner.innerHTML =
          '<div class="intro-text">' +
            '<span class="eyebrow">' + esc(data.intro.eyebrow) + '</span>' +
            '<h2>' + nl2br(data.intro.title) + '</h2>' +
            paragraphs +
          '</div>' +
          '<div class="intro-image">' +
            '<img src="' + esc(data.intro.image) + '" alt="' + esc(data.intro.eyebrow) + '" loading="lazy">' +
          '</div>';
      }
    }

    // Photo strip
    if (Array.isArray(data.strip)) {
      const strip = document.getElementById('stripContainer');
      if (strip) {
        strip.innerHTML = data.strip.map(function (item) {
          return '<div class="strip-item"><img src="' + esc(item.image) + '" alt="' + esc(item.alt) + '" loading="lazy"></div>';
        }).join('');
      }
    }

    // Rooms section head
    if (data.roomsIntro) {
      const head = document.getElementById('roomsSectionHead');
      if (head) {
        head.innerHTML =
          '<span class="eyebrow">' + esc(data.roomsIntro.eyebrow) + '</span>' +
          '<h2>' + esc(data.roomsIntro.title) + '</h2>' +
          '<p class="section-lede">' + esc(data.roomsIntro.lede) + '</p>';
      }
    }

    // Bathrooms strip
    if (Array.isArray(data.bathStrip)) {
      const bathStrip = document.getElementById('bathStrip');
      if (bathStrip) {
        bathStrip.innerHTML = data.bathStrip.map(function (item) {
          return '<img src="' + esc(item.image) + '" alt="' + esc(item.alt) + '" loading="lazy">';
        }).join('');
      }
    }

    // Amenities
    if (data.amenities) {
      const head = document.getElementById('amenitiesSectionHead');
      if (head) {
        head.innerHTML =
          '<span class="eyebrow">' + esc(data.amenities.eyebrow) + '</span>' +
          '<h2>' + esc(data.amenities.title) + '</h2>' +
          '<p class="section-lede">' + esc(data.amenities.lede) + '</p>';
      }
      const grid = document.getElementById('amenitiesGrid');
      if (grid && Array.isArray(data.amenities.categories)) {
        grid.innerHTML = data.amenities.categories.map(function (cat) {
          const items = (cat.items || []).map(function (item) {
            return '<li>' + esc(item) + '</li>';
          }).join('');
          const footnote = cat.footnote ? '<p class="amenity-note">' + esc(cat.footnote) + '</p>' : '';
          return '<div class="amenity-card">' +
            '<h3>' + esc(cat.title) + '</h3>' +
            '<ul>' + items + '</ul>' +
            footnote +
          '</div>';
        }).join('');
      }
    }

    // Garden
    if (data.garden) {
      const bg = document.getElementById('gardenBg');
      if (bg && data.garden.bgImage) {
        bg.src = data.garden.bgImage;
      }
      const content = document.getElementById('gardenContent');
      if (content) {
        content.innerHTML =
          '<span class="eyebrow light">' + esc(data.garden.eyebrow) + '</span>' +
          '<h2>' + esc(data.garden.title) + '</h2>' +
          '<p>' + esc(data.garden.text) + '</p>';
      }
      const gallery = document.getElementById('gardenGallery');
      if (gallery && Array.isArray(data.garden.gallery)) {
        gallery.innerHTML = data.garden.gallery.map(function (item) {
          return '<img src="' + esc(item.image) + '" alt="' + esc(item.alt) + '" loading="lazy">';
        }).join('');
      }
    }

    // Location
    if (data.location) {
      const head = document.getElementById('locationSectionHead');
      if (head) {
        head.innerHTML =
          '<span class="eyebrow">' + esc(data.location.eyebrow) + '</span>' +
          '<h2>' + esc(data.location.title) + '</h2>';
      }
      const text = document.getElementById('locationText');
      if (text) {
        text.innerHTML = (data.location.paragraphs || []).map(function (p) {
          return '<p>' + esc(p) + '</p>';
        }).join('');
      }
      const list = document.getElementById('locationList');
      if (list && Array.isArray(data.location.points)) {
        list.innerHTML = data.location.points.map(function (pt) {
          return '<div class="loc-item' + (pt.highlight ? ' highlight' : '') + '">' +
            '<span class="loc-name">' + esc(pt.name) + '</span>' +
            '<span class="loc-dist">' + esc(pt.dist) + '</span>' +
          '</div>';
        }).join('');
      }
    }

    // Contact
    if (data.contact) {
      const contact = document.getElementById('contactInner');
      if (contact) {
        contact.innerHTML =
          '<span class="eyebrow">' + esc(data.contact.eyebrow) + '</span>' +
          '<h2>' + esc(data.contact.title) + '</h2>' +
          '<p>' + esc(data.contact.text) + '</p>' +
          '<a href="' + esc(data.contact.linkUrl) + '" class="contact-link" target="_blank" rel="noopener">' + esc(data.contact.linkText) + '</a>';
      }
    }

    // Footer
    if (data.footer) {
      const footerLoc = document.getElementById('footerLoc');
      if (footerLoc) footerLoc.textContent = data.footer.location || '';
    }
  }

  function renderRooms(data) {
    const container = document.getElementById('roomBlocks');
    if (!container || !Array.isArray(data.rooms)) return;

    container.innerHTML = data.rooms.map(function (room) {
      const images = (room.images || []).map(function (img, i) {
        return '<img src="' + esc(img.image) + '" alt="' + esc(img.alt) + '" loading="lazy"' + (i === 0 ? ' class="big"' : '') + '>';
      }).join('');

      return '<div class="room-block' + (room.reverse ? ' reverse' : '') + '">' +
        '<div class="room-gallery">' + images + '</div>' +
        '<div class="room-caption">' +
          '<h3>' + esc(room.title) + '</h3>' +
          '<p>' + esc(room.caption) + '</p>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  Promise.all([
    fetch('content/site.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
    fetch('content/rooms.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (results) {
    const site = results[0];
    const rooms = results[1];
    if (site) renderSite(site);
    if (rooms) renderRooms(rooms);
    if (window.initGalleries) window.initGalleries();
  });
})();
