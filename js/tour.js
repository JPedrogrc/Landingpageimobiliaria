/**
 * Douran Imóveis - Experiência Imersiva de Tour Virtual 360°
 * Panoramas em alta definição, navegação multi-cômodos e hotspots interativos
 */

(function () {
  'use strict';

  function getWhatsAppUrl(text) {
    const phone = window.PORTLAND_DATA?.WHATSAPP_PHONE || '5592999999999';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  const VirtualTour = {
    dialog: null,
    panoContainer: null,
    roomsNav: null,
    currentRoom: null,
    currentProperty: null,
    autoDriftInterval: null,
    driftSpeed: 0.6,
    driftDir: 1,
    isDragging: false,
    dragStart: 0,
    scrollStart: 0,
    isPlaying: true,

    init() {
      this.dialog = document.getElementById('tour-dialog');
      this.panoContainer = document.getElementById('tour-pano');
      this.roomsNav = document.getElementById('tour-rooms-nav');
      this.closeBtn = document.getElementById('tour-close-btn');
      this.playPauseBtn = document.getElementById('tour-toggle-drift');
      this.scheduleBtn = document.getElementById('tour-schedule-btn');

      if (!this.dialog || !this.panoContainer) return;

      this.bindEvents();
    },

    bindEvents() {
      const self = this;

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => self.close());
      }

      this.dialog.addEventListener('click', (e) => {
        if (e.target === self.dialog) self.close();
      });

      // Pointer drag interaction
      this.panoContainer.addEventListener('pointerdown', (e) => {
        self.isDragging = true;
        self.dragStart = e.clientX;
        self.scrollStart = self.panoContainer.scrollLeft;
        self.panoContainer.setPointerCapture(e.pointerId);
        self.stopDrift();
      });

      this.panoContainer.addEventListener('pointermove', (e) => {
        if (!self.isDragging) return;
        const delta = e.clientX - self.dragStart;
        self.panoContainer.scrollLeft = self.scrollStart - delta;
      });

      const endDrag = (e) => {
        if (self.isDragging) {
          self.isDragging = false;
          if (self.isPlaying) self.startDrift();
        }
      };

      this.panoContainer.addEventListener('pointerup', endDrag);
      this.panoContainer.addEventListener('pointercancel', endDrag);

      // Play/Pause button
      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener('click', () => {
          self.isPlaying = !self.isPlaying;
          if (self.isPlaying) {
            self.startDrift();
            self.playPauseBtn.innerHTML = '<i data-lucide="pause"></i> Pausar Giro';
          } else {
            self.stopDrift();
            self.playPauseBtn.innerHTML = '<i data-lucide="play"></i> Continuar Giro';
          }
          if (window.lucide) window.lucide.createIcons();
        });
      }
    },

    open(property) {
      this.currentProperty = property;
      const titleEl = document.getElementById('tour-title');
      const subtitleEl = document.getElementById('tour-subtitle');

      if (titleEl) {
        titleEl.textContent = `Tour Virtual 360° • ${property.title}`;
      }
      if (subtitleEl) {
        subtitleEl.textContent = `${property.neighborhood} • ${property.area} m² • ${property.price >= 1000000 ? 'R$ ' + (property.price / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' Milhões' : 'R$ ' + property.price.toLocaleString('pt-BR')}`;
      }

      if (this.scheduleBtn) {
        const msg = `Olá! Acabei de fazer o tour virtual pelo imóvel "${property.title}" (${property.neighborhood}) e fiquei muito interessado. Gostaria de agendar uma visita presencial exclusiva.`;
        this.scheduleBtn.href = getWhatsAppUrl(msg);
      }

      const scenes = window.PORTLAND_DATA?.TOUR_SCENES || {};
      const sceneKeys = Object.keys(scenes);

      // Render room buttons
      if (this.roomsNav) {
        this.roomsNav.innerHTML = sceneKeys.map((key, i) => {
          const s = scenes[key];
          return `
            <button type="button" class="tour-room-pill ${i === 0 ? 'active' : ''}" data-room="${key}">
              <i data-lucide="eye"></i>
              <span>${s.name}</span>
            </button>
          `;
        }).join('');

        this.roomsNav.querySelectorAll('.tour-room-pill').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const roomKey = e.currentTarget.dataset.room;
            this.roomsNav.querySelectorAll('.tour-room-pill').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            this.showRoom(roomKey);
          });
        });
      }

      if (window.lucide) window.lucide.createIcons();

      this.dialog.showModal();
      this.showRoom(sceneKeys[0]);
      this.isPlaying = true;
      this.startDrift();
    },

    showRoom(roomKey) {
      const scenes = window.PORTLAND_DATA?.TOUR_SCENES || {};
      const scene = scenes[roomKey];
      if (!scene) return;

      this.currentRoom = scene;

      // Monta imagem panorâmica widescreen com hotspots interativos
      const hotspotsHtml = (scene.hotspots || []).map((h, i) => `
        <div class="tour-hotspot" style="left: ${h.x}%; top: ${h.y}%;" tabindex="0">
          <div class="tour-hotspot-pin">
            <span class="pulse"></span>
            <i data-lucide="info"></i>
          </div>
          <div class="tour-hotspot-tooltip">
            <strong>${h.label}</strong>
            <p>${h.desc}</p>
          </div>
        </div>
      `).join('');

      this.panoContainer.innerHTML = `
        <div class="tour-scene-wrap">
          <img src="${scene.bg}" alt="${scene.name}" class="tour-scene-img" draggable="false" />
          <div class="tour-overlay-gradient"></div>
          ${hotspotsHtml}
          <div class="tour-scene-badge">
            <span class="tag-ambient">${scene.tag}</span>
            <h4>${scene.name}</h4>
            <p>${scene.desc}</p>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Centraliza visão inicial
      requestAnimationFrame(() => {
        const maxScroll = this.panoContainer.scrollWidth - this.panoContainer.clientWidth;
        this.panoContainer.scrollLeft = maxScroll / 2;
      });
    },

    startDrift() {
      this.stopDrift();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      this.autoDriftInterval = setInterval(() => {
        const maxScroll = this.panoContainer.scrollWidth - this.panoContainer.clientWidth;
        if (maxScroll <= 0) return;

        this.panoContainer.scrollLeft += this.driftDir * this.driftSpeed;
        if (this.panoContainer.scrollLeft >= maxScroll - 2) {
          this.driftDir = -1;
        } else if (this.panoContainer.scrollLeft <= 2) {
          this.driftDir = 1;
        }
      }, 20);
    },

    stopDrift() {
      if (this.autoDriftInterval) {
        clearInterval(this.autoDriftInterval);
        this.autoDriftInterval = null;
      }
    },

    close() {
      this.stopDrift();
      if (this.dialog && this.dialog.open) {
        this.dialog.close();
      }
    }
  };

  window.VirtualTour = VirtualTour;
})();
