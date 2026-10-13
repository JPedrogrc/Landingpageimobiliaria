/**
 * Douran Imóveis - Script Principal
 * Controla Modais, Drawer de Favoritos, Formulários, GSAP e Efeitos Visuais
 */

(function () {
  'use strict';

  function formatBRL(value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  }

  function getWhatsAppUrl(text) {
    const phone = window.PORTLAND_DATA?.WHATSAPP_PHONE || '5592999999999';
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  // Sistema de Notificações Toast
  const Toast = {
    container: null,
    init() {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
    show(message, type = 'info') {
      this.init();
      const toast = document.createElement('div');
      toast.className = `toast-item toast-${type}`;
      toast.innerHTML = `
        <div class="toast-icon">
          <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
        </div>
        <div class="toast-text">${message}</div>
      `;
      this.container.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      requestAnimationFrame(() => toast.classList.add('visible'));

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }
  };
  window.Toast = Toast;

  // Modal de Detalhes Completos do Imóvel
  const PropertyModal = {
    dialog: null,
    currentProperty: null,

    init() {
      this.dialog = document.getElementById('property-modal-dialog');
      this.closeBtn = document.getElementById('property-modal-close');
      if (!this.dialog) return;

      this.closeBtn?.addEventListener('click', () => this.close());
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) this.close();
      });
    },

    open(property) {
      this.currentProperty = property;
      const isHighEnd = property.highEnd;
      const isRental = property.purpose === 'Alugar';

      const priceStr = isRental
        ? `${formatBRL(property.price)}<small>/mês</small>`
        : (property.price >= 1000000
          ? `R$ ${(property.price / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} Milhões`
          : formatBRL(property.price));

      const galleryHtml = (property.images || []).map((img, i) => `
        <div class="modal-gallery-item ${i === 0 ? 'active' : ''}">
          <img src="${img}" alt="${property.title} - Foto ${i + 1}" loading="lazy" />
        </div>
      `).join('');

      const thumbsHtml = (property.images || []).map((img, i) => `
        <button type="button" class="modal-thumb-btn ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${img}" alt="Miniatura ${i + 1}" />
        </button>
      `).join('');

      const amenitiesHtml = (property.amenities || []).map(a => `
        <li class="modal-amenity-item">
          <i data-lucide="check-circle-2"></i>
          <span>${a}</span>
        </li>
      `).join('');

      const highlightsHtml = (property.highlights || []).map(h => `
        <span class="modal-highlight-chip">
          <i data-lucide="sparkles"></i> ${h}
        </span>
      `).join('');

      const modalContent = document.getElementById('property-modal-body');
      if (!modalContent) return;

      const waMsg = isHighEnd
        ? `Olá! Gostaria de uma apresentação detalhada e agendamento privativo para o imóvel: ${property.title} (${property.neighborhood}) - Cód. #${property.id}`
        : `Olá! Vi o imóvel "${property.title}" (${property.neighborhood}) no site por ${formatBRL(property.price)} e gostaria de agendar uma visita.`;

      modalContent.innerHTML = `
        <div class="modal-detail-layout">
          <!-- Galeria de Imagens -->
          <div class="modal-media-col">
            <div class="modal-main-gallery" id="modal-main-gallery">
              ${galleryHtml}
              <div class="modal-badge-float ${isHighEnd ? 'gold' : ''}">${property.badge || property.purpose}</div>
              ${property.hasTour ? `
                <button type="button" class="btn-tour-float" id="modal-tour-direct">
                  <i data-lucide="camera"></i>
                  <span>Abrir Tour Virtual 360°</span>
                </button>
              ` : ''}
            </div>
            <div class="modal-thumbs-row" id="modal-thumbs-row">
              ${thumbsHtml}
            </div>
          </div>

          <!-- Informações e Ações -->
          <div class="modal-info-col">
            <div class="modal-header-meta">
              <span class="modal-neigh"><i data-lucide="map-pin"></i> ${property.neighborhood}, Manaus</span>
              <span class="modal-code">Cód. #${property.id}</span>
            </div>

            <h2 class="modal-title">${property.title}</h2>

            <div class="modal-highlights-wrap">
              ${highlightsHtml}
            </div>

            <div class="modal-pricing-box">
              <div class="modal-price-val">${priceStr}</div>
              <div class="modal-fees-row">
                ${property.condoFee ? `<span>Condomínio: ${formatBRL(property.condoFee)}/mês</span>` : ''}
                ${property.iptu ? `<span>IPTU: ${formatBRL(property.iptu)}/ano</span>` : ''}
              </div>
            </div>

            <div class="modal-specs-grid">
              ${property.bedrooms > 0 ? `
                <div class="modal-spec-card">
                  <i data-lucide="bed"></i>
                  <b>${property.bedrooms} Quartos</b>
                  <span>${property.suites || 0} suítes</span>
                </div>
              ` : ''}
              ${property.bathrooms > 0 ? `
                <div class="modal-spec-card">
                  <i data-lucide="bath"></i>
                  <b>${property.bathrooms} Banheiros</b>
                  <span>Completo</span>
                </div>
              ` : ''}
              <div class="modal-spec-card">
                <i data-lucide="maximize"></i>
                <b>${property.area} m²</b>
                <span>Área Privativa</span>
              </div>
              ${property.garage > 0 ? `
                <div class="modal-spec-card">
                  <i data-lucide="car"></i>
                  <b>${property.garage} Vagas</b>
                  <span>Cobertas</span>
                </div>
              ` : ''}
            </div>

            <div class="modal-desc-block">
              <h3>Sobre o Imóvel</h3>
              <p>${property.description}</p>
            </div>

            <div class="modal-amenities-block">
              <h3>Comodidades e Lazer</h3>
              <ul class="modal-amenities-list">
                ${amenitiesHtml}
              </ul>
            </div>

            <!-- Botões de Ação Imediata -->
            <div class="modal-actions-cta">
              <a href="${getWhatsAppUrl(waMsg)}" target="_blank" rel="noopener" class="btn btn-gold btn-lg btn-full">
                <i data-lucide="message-circle"></i>
                ${isHighEnd ? 'Falar com Private Banker via WhatsApp' : 'Agendar Visita com Corretor'}
              </a>
              <button type="button" class="btn btn-outline btn-full" id="modal-quick-simulate">
                <i data-lucide="calculator"></i>
                Simular Financiamento Deste Imóvel
              </button>
            </div>
          </div>
        </div>
      `;

      // Eventos das miniaturas da galeria
      const thumbBtns = modalContent.querySelectorAll('.modal-thumb-btn');
      const galleryItems = modalContent.querySelectorAll('.modal-gallery-item');
      thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.index);
          thumbBtns.forEach(b => b.classList.remove('active'));
          galleryItems.forEach(g => g.classList.remove('active'));
          btn.classList.add('active');
          if (galleryItems[idx]) galleryItems[idx].classList.add('active');
        });
      });

      // Atalho para tour virtual direto do modal
      const tourDirectBtn = modalContent.querySelector('#modal-tour-direct');
      if (tourDirectBtn) {
        tourDirectBtn.addEventListener('click', () => {
          this.close();
          if (window.VirtualTour) window.VirtualTour.open(property);
        });
      }

      // Atalho para o simulador
      const simQuickBtn = modalContent.querySelector('#modal-quick-simulate');
      if (simQuickBtn) {
        simQuickBtn.addEventListener('click', () => {
          this.close();
          const simRange = document.getElementById('sim-val-range');
          if (simRange) {
            simRange.value = property.price;
            window.Simulator?.calculate();
          }
          document.getElementById('financiar')?.scrollIntoView({ behavior: 'smooth' });
        });
      }

      if (window.lucide) window.lucide.createIcons();
      this.dialog.showModal();
    },

    close() {
      if (this.dialog && this.dialog.open) {
        this.dialog.close();
      }
    }
  };
  window.PropertyModal = PropertyModal;

  // Drawer de Favoritos
  const FavoritesDrawer = {
    drawer: null,
    backdrop: null,

    init() {
      this.drawer = document.getElementById('favorites-drawer');
      this.backdrop = document.getElementById('favorites-backdrop');
      const triggers = document.querySelectorAll('.favorites-drawer-trigger');
      const closeBtn = document.getElementById('favorites-drawer-close');

      triggers.forEach(t => t.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      }));

      closeBtn?.addEventListener('click', () => this.close());
      this.backdrop?.addEventListener('click', () => this.close());
    },

    open() {
      if (window.FilterEngine) window.FilterEngine.renderFavoritesDrawer();
      this.drawer?.classList.add('open');
      this.backdrop?.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.drawer?.classList.remove('open');
      this.backdrop?.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // WhatsApp Concierge Flutuante com Mensagem Inteligente
  const WhatsAppConcierge = {
    init() {
      const toggle = document.getElementById('wa-concierge-toggle');
      const card = document.getElementById('wa-concierge-card');
      const close = document.getElementById('wa-concierge-close');
      const quickBtns = document.querySelectorAll('.wa-quick-prompt');

      if (!toggle || !card) return;

      toggle.addEventListener('click', () => {
        card.classList.toggle('open');
      });

      close?.addEventListener('click', () => {
        card.classList.remove('open');
      });

      quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const prompt = e.currentTarget.dataset.prompt;
          window.open(getWhatsAppUrl(prompt), '_blank');
          card.classList.remove('open');
        });
      });
    }
  };

  // Canvas Skyline & Ambient Lighting (Hero Background)
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let particles = [];
    const particleCount = 60;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          speedY: Math.random() * 0.4 + 0.1,
          speedX: (Math.random() - 0.5) * 0.2
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Fundo em gradiente noturno profundo com verde esmeralda e dourado suave
      const bgGrad = ctx.createRadialGradient(
        width / 2 + (mouse.x - width / 2) * 0.1,
        height * 0.4 + (mouse.y - height * 0.4) * 0.1,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#102e2b');
      bgGrad.addColorStop(0.5, '#0a1d1b');
      bgGrad.addColorStop(1, '#050f0e');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Partículas flutuantes de luz dourada/esmeralda
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 185, 115, ${p.alpha * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(218, 185, 115, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(render);
    }

    resize();
    render();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
  }

  // Formulário de Contato e Captação
  function initContactForm() {
    const form = document.getElementById('lead-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('nome') || 'Cliente';
      const phone = fd.get('telefone') || '';
      const interest = fd.get('interesse') || 'Comprar Imóvel';
      const budget = fd.get('faixa') || 'Não especificada';
      const msg = fd.get('mensagem') || '';

      const text = `Olá! Meu nome é ${name} (${phone}).
Interesse: ${interest}
Faixa de Valor: ${budget}
Mensagem: ${msg || 'Gostaria de falar com um corretor para encontrar as melhores opções.'}`;

      window.Toast?.show('Redirecionando para atendimento WhatsApp...', 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }

      setTimeout(() => {
        window.open(getWhatsAppUrl(text), '_blank');
      }, 700);
    });
  }

  // Animações GSAP de scroll e contadores
  function initGSAPAnimations() {
    if (!window.gsap) return;

    // Header fixo com efeito de vidro ao rolar
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Contadores numéricos
    const counterElements = document.querySelectorAll('.stat-number');
    if (window.ScrollTrigger && counterElements.length) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      counterElements.forEach(el => {
        const target = Number(el.dataset.target) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';

        window.ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            window.gsap.to({ val: 0 }, {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                const current = Math.floor(this.targets()[0].val);
                el.textContent = `${prefix}${current.toLocaleString('pt-BR')}${suffix}`;
              }
            });
          }
        });
      });
    }

    // Hero title reveal
    window.gsap.from('.hero-badge-tag', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
    window.gsap.from('.hero-main-title', { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: 'power3.out' });
    window.gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
    window.gsap.from('.hero-search-console', { opacity: 0, y: 30, duration: 0.9, delay: 0.8, ease: 'power2.out' });
  }

  // Inicialização geral ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones Lucide
    if (window.lucide) window.lucide.createIcons();

    initHeroCanvas();
    PropertyModal.init();
    FavoritesDrawer.init();
    WhatsAppConcierge.init();
    initContactForm();

    if (window.FilterEngine) window.FilterEngine.init();
    if (window.Simulator) window.Simulator.init();
    if (window.VirtualTour) window.VirtualTour.init();

    initGSAPAnimations();

    // Mobile nav toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    const mobileClose = document.getElementById('mobile-nav-close');

    menuBtn?.addEventListener('click', () => mobileNav?.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));
    mobileNav?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav?.classList.remove('open'));
    });
  });
})();
