/**
 * Douran Imóveis - Simulador Financeiro Imobiliário Avançado
 * Suporta Tabela SAC (parcelas decrescentes) e Tabela PRICE (parcelas fixas)
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

  const Simulator = {
    elements: {},
    system: 'SAC', // 'SAC' ou 'PRICE'

    init() {
      this.elements = {
        valInput: document.getElementById('sim-val-range'),
        valOutput: document.getElementById('sim-val-out'),
        downInput: document.getElementById('sim-down-range'),
        downOutput: document.getElementById('sim-down-out'),
        downAmount: document.getElementById('sim-down-amount'),
        termInput: document.getElementById('sim-term-range'),
        termOutput: document.getElementById('sim-term-out'),
        rateAnnual: document.getElementById('sim-rate-annual'),

        // Outputs calculados
        financedVal: document.getElementById('sim-res-financed'),
        firstInstallment: document.getElementById('sim-res-first'),
        lastInstallment: document.getElementById('sim-res-last'),
        lastInstWrap: document.getElementById('sim-res-last-wrap'),
        minIncome: document.getElementById('sim-res-income'),
        badgeType: document.getElementById('sim-badge-type'),
        noteBox: document.getElementById('sim-note-text'),

        // Botões de amortização
        btnSac: document.getElementById('btn-system-sac'),
        btnPrice: document.getElementById('btn-system-price'),
        btnWhatsApp: document.getElementById('sim-cta-whatsapp'),

        // Quick down payment buttons
        quickPills: document.querySelectorAll('.quick-down-btn')
      };

      if (!this.elements.valInput) return;

      this.bindEvents();
      this.calculate();
    },

    bindEvents() {
      const self = this;

      [this.elements.valInput, this.elements.downInput, this.elements.termInput].forEach(el => {
        if (el) {
          el.addEventListener('input', () => self.calculate());
        }
      });

      if (this.elements.btnSac) {
        this.elements.btnSac.addEventListener('click', () => {
          self.system = 'SAC';
          self.elements.btnSac.classList.add('active');
          self.elements.btnPrice?.classList.remove('active');
          self.calculate();
        });
      }

      if (this.elements.btnPrice) {
        this.elements.btnPrice.addEventListener('click', () => {
          self.system = 'PRICE';
          self.elements.btnPrice.classList.add('active');
          self.elements.btnSac?.classList.remove('active');
          self.calculate();
        });
      }

      this.elements.quickPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          const pct = Number(e.currentTarget.dataset.pct);
          if (self.elements.downInput) {
            self.elements.downInput.value = pct;
            self.elements.quickPills.forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            self.calculate();
          }
        });
      });
    },

    calculate() {
      const propertyValue = Number(this.elements.valInput.value);
      const downPercent = Number(this.elements.downInput.value) / 100;
      const downPaymentValue = propertyValue * downPercent;
      const financedAmount = propertyValue - downPaymentValue;
      const years = Number(this.elements.termInput.value);
      const months = years * 12;

      // Taxa estimada: 9.8% a.a. => ~0.78% a.m.
      const monthlyRate = 0.0078;

      // Atualiza textos dos inputs
      this.elements.valOutput.textContent = formatBRL(propertyValue);
      this.elements.downOutput.textContent = `${Math.round(downPercent * 100)}%`;
      if (this.elements.downAmount) {
        this.elements.downAmount.textContent = formatBRL(downPaymentValue);
      }
      this.elements.termOutput.textContent = `${years} anos (${months}x)`;
      if (this.elements.financedVal) {
        this.elements.financedVal.textContent = formatBRL(financedAmount);
      }

      // Se for Alto Padrão (>= 3 milhões), oferecer linha Private sob medida
      if (propertyValue >= 3000000) {
        this.elements.firstInstallment.textContent = 'Sob Medida';
        if (this.elements.lastInstWrap) {
          this.elements.lastInstWrap.style.display = 'none';
        }
        if (this.elements.minIncome) {
          this.elements.minIncome.textContent = 'Private Banking';
        }
        if (this.elements.noteBox) {
          this.elements.noteBox.innerHTML = '<strong>Consultoria Private:</strong> Para imóveis de alto padrão, desenhamos estruturação de pagamento personalizada com carência, permuta qualificada ou crédito com garantia.';
        }
        if (this.elements.btnWhatsApp) {
          const msg = `Olá! Tenho interesse em uma assessoria para imóvel de alto padrão de ${formatBRL(propertyValue)}. Gostaria de falar com um Private Banker da Douran.`;
          this.elements.btnWhatsApp.href = getWhatsAppUrl(msg);
          this.elements.btnWhatsApp.innerHTML = '<i data-lucide="shield-check"></i> Falar com Private Banker';
          if (window.lucide) window.lucide.createIcons();
        }
        return;
      }

      if (this.elements.lastInstWrap) {
        this.elements.lastInstWrap.style.display = this.system === 'SAC' ? 'block' : 'none';
      }

      let firstParcel = 0;
      let lastParcel = 0;

      if (this.system === 'SAC') {
        // Amortização constante
        const amort = financedAmount / months;
        const firstInterest = financedAmount * monthlyRate;
        firstParcel = amort + firstInterest;

        // Última parcela
        const lastInterest = amort * monthlyRate;
        lastParcel = amort + lastInterest;

        this.elements.firstInstallment.textContent = `${formatBRL(firstParcel)}/mês`;
        if (this.elements.lastInstallment) {
          this.elements.lastInstallment.textContent = `${formatBRL(lastParcel)}/mês`;
        }
        if (this.elements.badgeType) {
          this.elements.badgeType.textContent = 'Tabela SAC (Parcelas Decrescentes)';
        }
      } else {
        // Tabela PRICE (Prestação fixa)
        firstParcel = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        this.elements.firstInstallment.textContent = `${formatBRL(firstParcel)}/mês`;
        if (this.elements.badgeType) {
          this.elements.badgeType.textContent = 'Tabela PRICE (Parcelas Fixas)';
        }
      }

      // Renda mínima recomendada (parcela não exceder 30% da renda familiar)
      const recommendedIncome = firstParcel / 0.30;
      if (this.elements.minIncome) {
        this.elements.minIncome.textContent = formatBRL(recommendedIncome);
      }

      // Nota explicativa
      if (this.elements.noteBox) {
        const canFgts = propertyValue <= 1500000;
        this.elements.noteBox.innerHTML = `Estimativa com taxa balcão de ~9.8% a.a. ${canFgts ? 'Você pode utilizar seu saldo de <strong>FGTS</strong> na entrada ou amortização.' : ''} Sujeito à análise de crédito pelos bancos parceiros (Caixa, Itaú, Bradesco e Santander).`;
      }

      // Link do WhatsApp com a proposta exata
      if (this.elements.btnWhatsApp) {
        const msg = `Olá! Fiz uma simulação no site da Douran:
- Imóvel: ${formatBRL(propertyValue)}
- Entrada (${Math.round(downPercent * 100)}%): ${formatBRL(downPaymentValue)}
- Prazo: ${years} anos (${this.system})
- 1ª Parcela Estimada: ${formatBRL(firstParcel)}
Gostariam de me ajudar a aprovar meu crédito com as melhores taxas?`;
        this.elements.btnWhatsApp.href = getWhatsAppUrl(msg);
        this.elements.btnWhatsApp.innerHTML = '<i data-lucide="badge-percent"></i> Aprovar Meu Financiamento no WhatsApp';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  };

  window.Simulator = Simulator;
})();
