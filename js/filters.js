/**
 * Douran Imóveis - Motor de Busca, Filtros Avançados e Favoritos
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

  const FilterEngine = {
    allProperties: [],
    favorites: new Set(),
    activeBandIndex: -1,
    activeFilters: {
      search: '',
      purpose: '',
      type: '',
      neighborhood: '',
      bedrooms: 0,
      sortBy: 'relevance',
      onlyTour: false
    },

    init() {
      this.allProperties = window.PORTLAND_DATA?.PROPERTIES || [];
      this.loadFavorites();
      this.populateNeighborhoods();
      this.renderPriceBands();
      this.bindInputs();
      this.render();
      this.updateFavoritesCount();
    },

    loadFavorites() {
      try {
        const saved = localStorage.getItem('douran_favorites');
        if (saved) {
          this.favorites = new Set(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Erro ao carregar favoritos:', e);
      }
    },

    saveFavorites() {
      try {
        localStorage.setItem('douran_favorites', JSON.stringify(Array.from(this.favorites)));
      } catch (e) {
        console.warn('Erro ao salvar favoritos:', e);
      }
      this.updateFavoritesCount();
    },

    toggleFavorite(id, btnElement) {
      if (this.favorites.has(id)) {
        this.favorites.delete(id);
        if (btnElement) {
          btnElement.classList.remove('active');
          btnElement.innerHTML = '<i data-lucide="heart"></i>';
        }
        window.Toast?.show('Imóvel removido dos favoritos.', 'info');
      } else {
        this.favorites.add(id);
        if (btnElement) {
          btnElement.classList.add('active');
          btnElement.innerHTML = '<i data-lucide="heart" fill="currentColor"></i>';
          btnElement.classList.add('heart-pop');
          setTimeout(() => btnElement.classList.remove('heart-pop'), 400);
        }
        window.Toast?.show('Imóvel salvo nos seus favoritos!', 'success');
        if (window.confetti) {
          window.confetti({ particleCount: 25, spread: 60, origin: { y: 0.8 } });
        }
      }
      this.saveFavorites();
      if (window.lucide) window.lucide.createIcons();
      this.renderFavoritesDrawer();
    },

    updateFavoritesCount() {
      const counters = document.querySelectorAll('.fav-count-badge');
      const count = this.favorites.size;
      counters.forEach(c => {
        c.textContent = count;
        c.style.display = count > 0 ? 'inline-flex' : 'none';
      });
    },

    populateNeighborhoods() {
      const select = document.getElementById('filter-neighborhood');
      const heroSelect = document.getElementById('hero-filter-neighborhood');
      if (!select && !heroSelect) return;

      const neighborhoods = [...new Set(this.allProperties.map(p => p.neighborhood))].sort();

      const optionsHtml = '<option value="">Todos os Bairros</option>' +
        neighborhoods.map(n => `<option value="${n}">${n}</option>`).join('');

      if (select) select.innerHTML = optionsHtml;
      if (heroSelect) heroSelect.innerHTML = optionsHtml;
    },

    renderPriceBands() {
      const container = document.getElementById('price-bands-container');
      const bands = window.PORTLAND_DATA?.PRICE_BANDS || [];
      if (!container || !bands.length) return;

      container.innerHTML = bands.map((band, idx) => `
        <button type="button" class="price-band-card" data-index="${idx}">
          <div class="band-tag">${band.tag}</div>
          <h4 class="band-title">${band.name}</h4>
          <span class="band-desc">${band.desc}</span>
          <div class="band-arrow"><i data-lucide="arrow-right"></i></div>
        </button>
      `).join('');

      container.querySelectorAll('.price-band-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          if (this.activeBandIndex === idx) {
            this.activeBandIndex = -1;
            btn.classList.remove('active');
          } else {
            this.activeBandIndex = idx;
            container.querySelectorAll('.price-band-card').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
          this.render();

          // Rolagem suave até a listagem
          const targetSection = (this.activeBandIndex === 3)
            ? document.getElementById('alto-padrao')
            : document.getElementById('imoveis');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      if (window.lucide) window.lucide.createIcons();
    },

    bindInputs() {
      const self = this;

      // Inputs de filtro principal
      const searchInput = document.getElementById('filter-search');
      const purposeSelect = document.getElementById('filter-purpose');
      const typeSelect = document.getElementById('filter-type');
      const neighborhoodSelect = document.getElementById('filter-neighborhood');
      const bedroomsSelect = document.getElementById('filter-bedrooms');
      const sortSelect = document.getElementById('filter-sort');
      const tourSwitch = document.getElementById('filter-tour-only');
      const resetBtn = document.getElementById('btn-reset-filters');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          self.activeFilters.search = e.target.value.trim().toLowerCase();
          self.render();
        });
      }

      if (purposeSelect) {
        purposeSelect.addEventListener('change', (e) => {
          self.activeFilters.purpose = e.target.value;
          self.render();
        });
      }

      if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
          self.activeFilters.type = e.target.value;
          self.render();
        });
      }

      if (neighborhoodSelect) {
        neighborhoodSelect.addEventListener('change', (e) => {
          self.activeFilters.neighborhood = e.target.value;
          self.render();
        });
      }

      if (bedroomsSelect) {
        bedroomsSelect.addEventListener('change', (e) => {
          self.activeFilters.bedrooms = Number(e.target.value);
          self.render();
        });
      }

      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          self.activeFilters.sortBy = e.target.value;
          self.render();
        });
      }

      if (tourSwitch) {
        tourSwitch.addEventListener('change', (e) => {
          self.activeFilters.onlyTour = e.target.checked;
          self.render();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          self.resetAllFilters();
        });
      }

      // Hero search bar integration
      const heroPurpose = document.getElementById('hero-filter-purpose');
      const heroType = document.getElementById('hero-filter-type');
      const heroNeighborhood = document.getElementById('hero-filter-neighborhood');
      const heroBtn = document.getElementById('hero-search-btn');

      if (heroBtn) {
        heroBtn.addEventListener('click', () => {
          if (heroPurpose) self.activeFilters.purpose = heroPurpose.value;
          if (heroType) self.activeFilters.type = heroType.value;
          if (heroNeighborhood) self.activeFilters.neighborhood = heroNeighborhood.value;

          // Sincroniza selects da barra de busca
          if (purposeSelect && heroPurpose) purposeSelect.value = heroPurpose.value;
          if (typeSelect && heroType) typeSelect.value = heroType.value;
          if (neighborhoodSelect && heroNeighborhood) neighborhoodSelect.value = heroNeighborhood.value;

          self.render();
          document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
        });
      }

      // Delegated clicks for cards (tour, favorite, view details)
      document.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.card-fav-btn');
        if (favBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = Number(favBtn.dataset.id);
          self.toggleFavorite(id, favBtn);
          return;
        }

        const tourBtn = e.target.closest('.card-tour-btn');
        if (tourBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = Number(tourBtn.dataset.id);
          const property = self.allProperties.find(p => p.id === id);
          if (property && window.VirtualTour) {
            window.VirtualTour.open(property);
          }
          return;
        }

        const detailsBtn = e.target.closest('.card-details-trigger');
        if (detailsBtn) {
          e.preventDefault();
          const id = Number(detailsBtn.dataset.id);
          const property = self.allProperties.find(p => p.id === id);
          if (property && window.PropertyModal) {
            window.PropertyModal.open(property);
          }
          return;
        }
      });
    },

    resetAllFilters() {
      this.activeBandIndex = -1;
      this.activeFilters = {
        search: '',
        purpose: '',
        type: '',
        neighborhood: '',
        bedrooms: 0,
        sortBy: 'relevance',
        onlyTour: false
      };

      const ids = ['filter-search', 'filter-purpose', 'filter-type', 'filter-neighborhood', 'filter-bedrooms', 'filter-sort'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      const tourSwitch = document.getElementById('filter-tour-only');
      if (tourSwitch) tourSwitch.checked = false;

      document.querySelectorAll('.price-band-card').forEach(b => b.classList.remove('active'));

      this.render();
    },

    getFilteredProperties() {
      const f = this.activeFilters;
      const bands = window.PORTLAND_DATA?.PRICE_BANDS || [];
      const currentBand = this.activeBandIndex >= 0 ? bands[this.activeBandIndex] : null;

      let list = this.allProperties.filter(p => {
        // Busca textual
        if (f.search) {
          const matchTitle = p.title.toLowerCase().includes(f.search);
          const matchNeigh = p.neighborhood.toLowerCase().includes(f.search);
          const matchDesc = p.description.toLowerCase().includes(f.search);
          if (!matchTitle && !matchNeigh && !matchDesc) return false;
        }

        // Finalidade
        if (f.purpose && p.purpose !== f.purpose) return false;

        // Tipo
        if (f.type && p.type !== f.type) return false;

        // Bairro
        if (f.neighborhood && p.neighborhood !== f.neighborhood) return false;

        // Quartos
        if (f.bedrooms > 0 && p.bedrooms < f.bedrooms) return false;

        // Somente tour virtual
        if (f.onlyTour && !p.hasTour) return false;

        // Faixa de preço (Band)
        if (currentBand) {
          if (p.purpose === 'Alugar') {
            // Se estiver filtrando aluguel, permite se a primeira faixa estiver selecionada
            if (this.activeBandIndex !== 0) return false;
          } else {
            if (p.price < currentBand.min || p.price >= currentBand.max) return false;
          }
        }

        return true;
      });

      // Ordenação
      if (f.sortBy === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (f.sortBy === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (f.sortBy === 'area-desc') {
        list.sort((a, b) => b.area - a.area);
      } else {
        // Relevância: destaques primeiro
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }

      return list;
    },

    createCardHtml(p) {
      const isFav = this.favorites.has(p.id);
      const isRental = p.purpose === 'Alugar';
      const isHighEnd = p.highEnd;

      let priceFormatted = '';
      let installmentSnippet = '';

      if (isRental) {
        priceFormatted = `${formatBRL(p.price)}<span class="price-period">/mês</span>`;
        installmentSnippet = `<span class="installment-badge"><i data-lucide="shield-check"></i> Sem fiador</span>`;
      } else {
        if (p.price >= 1000000) {
          priceFormatted = `R$ ${(p.price / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} Milhões`;
        } else {
          priceFormatted = formatBRL(p.price);
        }
        // Parcela estimada aproximada
        if (!isHighEnd) {
          const estimatedInstallment = Math.round((p.price * 0.8) * 0.0078);
          installmentSnippet = `<span class="installment-badge"><i data-lucide="calculator"></i> Parcela aprox: ${formatBRL(estimatedInstallment)}/mês</span>`;
        } else {
          installmentSnippet = `<span class="installment-badge luxury"><i data-lucide="sparkles"></i> Condições Private</span>`;
        }
      }

      const mainImg = p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

      const waMsg = isHighEnd
        ? `Olá! Gostaria de agendar uma consulta Private confidencial sobre o imóvel: ${p.title} (${p.neighborhood}) - Cód. #${p.id}`
        : `Olá! Tenho interesse no imóvel: ${p.title} (${p.neighborhood}) no valor de ${formatBRL(p.price)}. Poderiam me enviar mais fotos e agendar visita?`;

      return `
        <article class="property-card ${isHighEnd ? 'card-luxury' : ''} reveal-item" data-id="${p.id}">
          <div class="card-media">
            <img src="${mainImg}" alt="${p.title}" class="card-img" loading="lazy" />
            <div class="card-gradient-overlay"></div>
            
            <div class="card-badges-top">
              <span class="badge-tag ${isHighEnd ? 'gold' : 'brand'}">${p.badge || p.purpose}</span>
              ${p.purpose === 'Comprar' && p.price <= 300000 ? '<span class="badge-tag green">FGTS / Subsídio</span>' : ''}
            </div>

            <button type="button" class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${p.id}" aria-label="Salvar nos favoritos">
              <i data-lucide="heart" ${isFav ? 'fill="currentColor"' : ''}></i>
            </button>

            ${p.hasTour ? `
              <button type="button" class="card-tour-btn" data-id="${p.id}">
                <span class="tour-pulse-dot"></span>
                <i data-lucide="camera"></i>
                <span>Tour 360°</span>
              </button>
            ` : ''}

            <div class="card-photo-counter">
              <i data-lucide="image"></i>
              <span>${p.images?.length || 1} fotos</span>
            </div>
          </div>

          <div class="card-content">
            <div class="card-location">
              <i data-lucide="map-pin"></i>
              <span>${p.neighborhood}, Manaus</span>
            </div>

            <h3 class="card-title">
              <a href="#" class="card-details-trigger" data-id="${p.id}">${p.title}</a>
            </h3>

            <div class="card-specs">
              ${p.bedrooms > 0 ? `
                <div class="spec-item" title="${p.bedrooms} Quartos">
                  <i data-lucide="bed"></i>
                  <span>${p.bedrooms} qtos</span>
                </div>
              ` : ''}
              ${p.bathrooms > 0 ? `
                <div class="spec-item" title="${p.bathrooms} Banheiros">
                  <i data-lucide="bath"></i>
                  <span>${p.bathrooms} banh</span>
                </div>
              ` : ''}
              <div class="spec-item" title="Área total">
                <i data-lucide="maximize"></i>
                <span>${p.area} m²</span>
              </div>
              ${p.garage > 0 ? `
                <div class="spec-item" title="${p.garage} Vagas">
                  <i data-lucide="car"></i>
                  <span>${p.garage} vag</span>
                </div>
              ` : ''}
            </div>

            <div class="card-pricing-wrap">
              <div class="card-price">${priceFormatted}</div>
              ${installmentSnippet}
            </div>

            <div class="card-actions">
              <button type="button" class="btn btn-outline card-details-trigger" data-id="${p.id}">
                <i data-lucide="eye"></i>
                Ver Detalhes
              </button>
              <a href="${getWhatsAppUrl(waMsg)}" target="_blank" rel="noopener" class="btn ${isHighEnd ? 'btn-gold' : 'btn-primary'} card-wa-btn">
                <i data-lucide="message-circle"></i>
                ${isHighEnd ? 'Atendimento VIP' : 'Tenho Interesse'}
              </a>
            </div>
          </div>
        </article>
      `;
    },

    render() {
      const filtered = this.getFilteredProperties();

      const standardList = filtered.filter(p => !p.highEnd);
      const highEndList = filtered.filter(p => p.highEnd);

      const standardGrid = document.getElementById('properties-grid');
      const highEndGrid = document.getElementById('alto-padrao-grid');
      const counterEl = document.getElementById('properties-count');
      const standardSection = document.getElementById('imoveis');
      const highEndSection = document.getElementById('alto-padrao');

      if (counterEl) {
        counterEl.innerHTML = `<strong>${filtered.length}</strong> imóvel${filtered.length === 1 ? '' : 'is'} encontrado${filtered.length === 1 ? '' : 's'}`;
      }

      if (standardGrid) {
        if (standardList.length) {
          standardGrid.innerHTML = standardList.map(p => this.createCardHtml(p)).join('');
        } else if (!highEndList.length) {
          standardGrid.innerHTML = `
            <div class="empty-state-box">
              <div class="empty-icon"><i data-lucide="search-x"></i></div>
              <h3>Nenhum imóvel corresponde aos filtros selecionados</h3>
              <p>Não se preocupe! Nossos corretores possuem opções exclusivas fora da vitrine pública.</p>
              <div class="empty-actions">
                <button type="button" class="btn btn-outline" id="btn-empty-reset">Limpar Filtros</button>
                <a href="${getWhatsAppUrl('Olá! Não encontrei o imóvel exato no site. Podem fazer uma busca sob medida para o meu perfil?')}" target="_blank" class="btn btn-primary">
                  <i data-lucide="message-circle"></i>
                  Solicitar Busca Personalizada
                </a>
              </div>
            </div>
          `;
          document.getElementById('btn-empty-reset')?.addEventListener('click', () => this.resetAllFilters());
        } else {
          standardGrid.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1; padding: 2rem;">Os imóveis desta seleção estão no catálogo Private & Alto Padrão abaixo.</p>';
        }
      }

      if (highEndGrid) {
        if (highEndList.length) {
          highEndGrid.innerHTML = highEndList.map(p => this.createCardHtml(p)).join('');
        } else {
          highEndGrid.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1; padding: 2rem;">Nenhum imóvel de alto padrão com esses filtros. Fale diretamente com nossa mesa de atendimento Private.</p>';
        }
      }

      // Mostra ou esconde seções se houver filtro específico
      if (standardSection && highEndSection) {
        if (this.activeBandIndex === 3) {
          standardSection.style.display = 'none';
          highEndSection.style.display = 'block';
        } else if (this.activeBandIndex >= 0 && this.activeBandIndex < 3) {
          standardSection.style.display = 'block';
          highEndSection.style.display = 'none';
        } else {
          standardSection.style.display = 'block';
          highEndSection.style.display = 'block';
        }
      }

      if (window.lucide) window.lucide.createIcons();

      // Dispara animações GSAP de revelação suave
      if (window.gsap) {
        window.gsap.fromTo('.reveal-item',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
        );
      }
    },

    renderFavoritesDrawer() {
      const container = document.getElementById('favorites-drawer-list');
      const totalEl = document.getElementById('favorites-drawer-total');
      const countEl = document.getElementById('favorites-drawer-count');
      const waBtn = document.getElementById('favorites-drawer-wa');

      if (!container) return;

      const favProps = this.allProperties.filter(p => this.favorites.has(p.id));

      if (countEl) countEl.textContent = `${favProps.length} imóvel(is) salvo(s)`;

      if (!favProps.length) {
        container.innerHTML = `
          <div class="empty-fav-box">
            <i data-lucide="heart-off"></i>
            <p>Você ainda não favoritou nenhum imóvel.</p>
            <span>Toque no coração nos cartões para comparar seus favoritos aqui!</span>
          </div>
        `;
        if (totalEl) totalEl.textContent = 'R$ 0';
        if (waBtn) waBtn.style.display = 'none';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      let totalVal = 0;
      container.innerHTML = favProps.map(p => {
        totalVal += p.price;
        return `
          <div class="fav-item-row">
            <img src="${p.images?.[0]}" alt="${p.title}" class="fav-item-thumb" />
            <div class="fav-item-info">
              <h4>${p.title}</h4>
              <span class="fav-item-loc">${p.neighborhood} • ${p.area}m²</span>
              <div class="fav-item-price">${p.purpose === 'Alugar' ? formatBRL(p.price) + '/mês' : formatBRL(p.price)}</div>
            </div>
            <button type="button" class="btn-remove-fav" data-id="${p.id}" title="Remover dos favoritos">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `;
      }).join('');

      if (totalEl) totalEl.textContent = formatBRL(totalVal);

      if (waBtn) {
        waBtn.style.display = 'inline-flex';
        const titles = favProps.map(p => `• ${p.title} (${p.neighborhood}) - ${formatBRL(p.price)}`).join('\n');
        const msg = `Olá! Salvei ${favProps.length} imóveis nos meus favoritos no site da Douran:\n\n${titles}\n\nGostaria de mais informações e verificar a disponibilidade deles.`;
        waBtn.href = getWhatsAppUrl(msg);
      }

      container.querySelectorAll('.btn-remove-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = Number(e.currentTarget.dataset.id);
          this.toggleFavorite(id);
          this.render();
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }
  };

  window.FilterEngine = FilterEngine;
})();
