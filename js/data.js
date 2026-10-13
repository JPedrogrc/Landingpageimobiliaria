/**
 * Douran Imóveis - Base de Dados de Imóveis Curados
 * Propriedades com alta resolução, metadados completos e dados para simulação
 */

const PRICE_BANDS = [
  { id: 'primeiro-imovel', name: 'Primeiro Imóvel', desc: 'Até R$ 300 mil', min: 0, max: 300000, tag: 'Subsidio / FGTS' },
  { id: 'familia', name: 'Para a Família', desc: 'R$ 300 mil a R$ 1 milhão', min: 300000, max: 1000000, tag: 'Mais Procurados' },
  { id: 'conforto', name: 'Premium & Conforto', desc: 'R$ 1 a R$ 3 milhões', min: 1000000, max: 3000000, tag: 'Bairros Nobres' },
  { id: 'alto-padrao', name: 'Private & Alto Padrão', desc: 'Acima de R$ 3 milhões', min: 3000000, max: 100000000, tag: 'Exclusividade' }
];

const NEIGHBORHOODS_DATA = [
  {
    name: 'Ponta Negra',
    headline: 'O metro quadrado mais nobre e a vista deslumbrante do Rio Negro',
    lifestyle: 'Sofisticação, Orla e Condomínios Fechados',
    tag: 'Alto Padrão',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    count: '18 imóveis disponíveis'
  },
  {
    name: 'Adrianópolis',
    headline: 'Tradição, alta gastronomia e as melhores escolas da cidade',
    lifestyle: 'Centralidade, Grife e Conveniência',
    tag: 'Nobre & Tradicional',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
    count: '24 imóveis disponíveis'
  },
  {
    name: 'Vieiralves',
    headline: 'Vida cosmopolita, cafés charmosos e fácil mobilidade',
    lifestyle: 'Restaurantes, Boutiques e Modernidade',
    tag: 'Trendy & Dinâmico',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    count: '15 imóveis disponíveis'
  },
  {
    name: 'Parque 10',
    headline: 'Parques arborizados, tranquilidade e excelente infraestrutura',
    lifestyle: 'Familiar, Verde e Acolhedor',
    tag: 'Familiar',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    count: '29 imóveis disponíveis'
  },
  {
    name: 'Tarumã',
    headline: 'Refúgio com a natureza, casas amplas e ar puro',
    lifestyle: 'Condomínios de Casas, Natureza e Espaço',
    tag: 'Natureza & Espaço',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    count: '12 imóveis disponíveis'
  }
];

const PROPERTIES = [
  {
    id: 1,
    title: 'Apartamento com Varanda e Vaga Coberta',
    neighborhood: 'Cidade Nova',
    type: 'Apartamento',
    purpose: 'Comprar',
    price: 189000,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    area: 52,
    garage: 1,
    highEnd: false,
    badge: 'Pronto para Morar',
    featured: false,
    hasTour: true,
    condoFee: 280,
    iptu: 450,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Excelente apartamento em condomínio com infraestrutura completa de lazer e portaria 24 horas. Sala em 2 ambientes, piso em porcelanato, iluminação em LED e vaga de garagem coberta. Financiamento com possibilidade de subsídio do Minha Casa Minha Vida e uso de FGTS.',
    amenities: [
      'Portaria 24 Horas',
      'Piscina Adulto e Infantil',
      'Salão de Festas Climatizado',
      'Churrasqueira Coletiva',
      'Playground Seguro',
      'Gás Encanado'
    ],
    highlights: ['Entrada facilitada', 'Aceita FGTS', 'Condomínio baixo']
  },
  {
    id: 2,
    title: 'Casa Térrea com Quintal Privativo e Espaço Gourmet',
    neighborhood: 'Novo Aleixo',
    type: 'Casa',
    purpose: 'Comprar',
    price: 235000,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    area: 90,
    garage: 1,
    highEnd: false,
    badge: 'Oportunidade',
    featured: false,
    hasTour: true,
    condoFee: 0,
    iptu: 390,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Casa aconchegante com quintal amplo nos fundos, ideal para quem busca liberdade, privacidade e espaço para pets. Cozinha com bancada de granito, quartos arejados e possibilidade de expansão para mais um cômodo.',
    amenities: [
      'Quintal Gramado',
      'Espaço Gourmet com Churrasqueira',
      'Garagem Coberta',
      'Portão Eletrônico',
      'Área de Serviço Independente',
      'Piso Cerâmico Retificado'
    ],
    highlights: ['Sem taxa de condomínio', 'Quintal amplo', 'Excelente ventilação']
  },
  {
    id: 3,
    title: 'Studio Compacto Design Decorado no Coração da Cidade',
    neighborhood: 'Centro',
    type: 'Apartamento',
    purpose: 'Alugar',
    price: 1800,
    bedrooms: 1,
    suites: 1,
    bathrooms: 1,
    area: 38,
    garage: 0,
    highEnd: false,
    badge: 'Totalmente Mobiliado',
    featured: false,
    hasTour: true,
    condoFee: 320,
    iptu: 250,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Studio contemporâneo, pensado para executivos, universitários ou investidores. Mobiliado com armários sob medida, ar-condicionado inverter, eletrodomésticos em inox e cama box baú queen size. Prédio com coworking e academia.',
    amenities: [
      'Totalmente Mobiliado',
      'Espaço Coworking com Wi-Fi',
      'Academia Equipada',
      'Lavanderia Coletiva OMO',
      'Rooftop com Vista Panorâmica',
      'Fechadura Digital com Senha'
    ],
    highlights: ['Pronto para morar', 'Próximo ao comércio', 'Contrato digital sem fiador']
  },
  {
    id: 4,
    title: 'Terreno Plano Pronto para Construir em Condomínio',
    neighborhood: 'Tarumã',
    type: 'Terreno',
    purpose: 'Comprar',
    price: 210000,
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    area: 360,
    garage: 0,
    highEnd: false,
    badge: 'Condomínio Fechado',
    featured: false,
    hasTour: false,
    condoFee: 380,
    iptu: 410,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Lote residencial 100% plano em um dos condomínios mais valorizados do Tarumã. Topografia impecável, sol da manhã, cercado de verde e segurança armada 24 horas. Projeto arquitetônico já aprovado na prefeitura incluído como cortesia.',
    amenities: [
      'Topografia Plana',
      'Condomínio com Clube Completo',
      'Segurança e Ronda Armada 24h',
      'Piscina Semiolímpica',
      'Quadra Poliesportiva e Beach Tennis',
      'Água de Poço Artesiano'
    ],
    highlights: ['Projeto arquitetônico incluso', 'Escriturado e Registrado', 'Fácil acesso']
  },
  {
    id: 5,
    title: 'Casa Térrea Moderna com Varanda Gourmet Integrada',
    neighborhood: 'Parque 10',
    type: 'Casa',
    purpose: 'Comprar',
    price: 540000,
    bedrooms: 3,
    suites: 2,
    bathrooms: 3,
    area: 150,
    garage: 2,
    highEnd: false,
    badge: 'Destaque da Semana',
    featured: true,
    hasTour: true,
    condoFee: 0,
    iptu: 720,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Casa térrea com arquitetura moderna, pé-direito duplo na sala e integração perfeita entre sala de estar, jantar e varanda gourmet com churrasqueira a carvão. Acabamento primoroso com porcelanato 84x84cm e bancadas em quartzo branco.',
    amenities: [
      'Pé-direito Duplo 4.20m',
      'Varanda Gourmet com Churrasqueira',
      '2 Suítes Espaçosas',
      'Esquadrias em Alumínio Preto',
      'Tubulação Pronta para Split',
      '2 Vagas Cobertas'
    ],
    highlights: ['Pé-direito duplo', 'Fino acabamento', 'Localização estratégica']
  },
  {
    id: 6,
    title: 'Apartamento 3 Quartos com Varanda Vista Livre',
    neighborhood: 'Adrianópolis',
    type: 'Apartamento',
    purpose: 'Comprar',
    price: 720000,
    bedrooms: 3,
    suites: 1,
    bathrooms: 3,
    area: 98,
    garage: 2,
    highEnd: false,
    badge: 'Andar Alto',
    featured: true,
    hasTour: true,
    condoFee: 780,
    iptu: 950,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'More no coração do Adrianópolis em um apartamento iluminado pelo sol da manhã. Varanda com ponto grill, sala espaçosa para 2 ambientes, suíte com closet planejado e móveis fixos de alta marcenaria inclusos.',
    amenities: [
      'Andar Alto com Vista Panorâmica',
      'Varanda com Churrasqueira Grill',
      'Piscina Aquecida com Raia',
      'Academia Climatizada LifeFitness',
      '2 Vagas Soltas e Cobertas',
      'Depósito Privativo na Garagem'
    ],
    highlights: ['Sol da manhã', 'Marcenaria Todeschini', '2 vagas soltas']
  },
  {
    id: 7,
    title: 'Apartamento Mobiliado e Decorado Perto da Av. Djalma',
    neighborhood: 'Vieiralves',
    type: 'Apartamento',
    purpose: 'Alugar',
    price: 3200,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    area: 72,
    garage: 1,
    highEnd: false,
    badge: 'Mobiliado Premium',
    featured: false,
    hasTour: true,
    condoFee: 540,
    iptu: 480,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Apartamento impecável para locação, decorado por arquiteto renomado. Totalmente mobiliado com smart TVs, sofás de couro, geladeira inverse, lava e seca, ar split em todos os cômodos e varanda fechada com cortina de vidro.',
    amenities: [
      'Decorado com Cortina de Vidro',
      'Eletrodomésticos Inox Novos',
      'Ar-condicionado Inverter 100%',
      'Cama Queen Size Hotelaria',
      'Garagem Coberta',
      'Portaria e Recepção 24h'
    ],
    highlights: ['Entrar e morar', 'Tudo novo e sob garantia', 'Rua tranquila e arborizada']
  },
  {
    id: 8,
    title: 'Casa Contemporânea em Condomínio Fechado com Piscina',
    neighborhood: 'Ponta Negra',
    type: 'Casa',
    purpose: 'Comprar',
    price: 1450000,
    bedrooms: 4,
    suites: 3,
    bathrooms: 5,
    area: 240,
    garage: 3,
    highEnd: false,
    badge: 'Condomínio Fechado',
    featured: true,
    hasTour: true,
    condoFee: 850,
    iptu: 1400,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Residência contemporânea no condomínio mais desejado da Ponta Negra. Área social integrada com sala de 3 ambientes, cozinha gourmet em ilha, piscina com cascata e hidromassagem, 3 amplas suítes com varanda e escritório privativo.',
    amenities: [
      'Piscina Privativa com Hidro e Cascata',
      'Cozinha Gourmet com Ilha Central',
      '3 Suítes Plenas com Closet',
      'Energia Solar Fotovoltaica Instalada',
      'Segurança Armada 24h e Ronda',
      '3 Vagas de Garagem'
    ],
    highlights: ['Energia solar instalada', 'Piscina aquecida privativa', 'Suíte master com 40m²']
  },
  {
    id: 9,
    title: 'Cobertura Linear com Vista Panorâmica 360° da Cidade',
    neighborhood: 'Adrianópolis',
    type: 'Apartamento',
    purpose: 'Comprar',
    price: 2300000,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    area: 210,
    garage: 3,
    highEnd: false,
    badge: 'Cobertura Exclusiva',
    featured: true,
    hasTour: true,
    condoFee: 1600,
    iptu: 2100,
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Cobertura linear com vista cinematográfica para o skyline de Adrianópolis. Amplo deck privativo com jacuzzi aquecida, espaço lounge com lareira ecológica, sala com pé-direito imponente e 3 suítes plenas com piso vinílico importado.',
    amenities: [
      'Deck Privativo com Jacuzzi Aquecida',
      'Vista 360 Graus Deslumbrante',
      'Lounge Gourmet com Churrasqueira',
      'Hall Social Privativo com Biometria',
      '3 Vagas de Garagem Cobertas',
      'Depósito Box no Subsolo'
    ],
    highlights: ['Jacuzzi e deck privativo', 'Elevador privativo', 'Vista eterna']
  },
  // ALTO PADRÃO / PRIVATE COLLECTION (Acima de R$ 3 Milhões)
  {
    id: 10,
    title: 'Cobertura Duplex Suspensa com Piscina de Borda Infinita',
    neighborhood: 'Vieiralves',
    type: 'Apartamento',
    purpose: 'Comprar',
    price: 4200000,
    bedrooms: 4,
    suites: 4,
    bathrooms: 6,
    area: 380,
    garage: 4,
    highEnd: true,
    badge: 'Private Collection',
    featured: true,
    hasTour: true,
    condoFee: 2400,
    iptu: 3800,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Uma verdadeira mansão suspensa no coração do Vieiralves. Piscina privativa de borda infinita com vista espetacular, 4 amplas suítes com closets italianos, automação completa de som, iluminação e climatização via smartphone, adega climatizada para 300 garrafas e 4 vagas livres.',
    amenities: [
      'Piscina Privativa com Borda Infinita',
      'Adega Climatizada para 300 Rótulos',
      'Automação Residencial Control4',
      'Suíte Master com Cuba Dupla e Banheira de Imersão',
      'Espaço Fitness Privativo',
      '4 Vagas Livres + Ponto Carregador Elétrico'
    ],
    highlights: ['Borda infinita privativa', 'Adega climatizada', 'Automação residencial completa']
  },
  {
    id: 11,
    title: 'Residência Neoclássica de Luxo com Spa e Paisagismo Burle Marx',
    neighborhood: 'Ponta Negra',
    type: 'Casa',
    purpose: 'Comprar',
    price: 5600000,
    bedrooms: 5,
    suites: 5,
    bathrooms: 7,
    area: 620,
    garage: 6,
    highEnd: true,
    badge: 'Luxo Absoluto',
    featured: true,
    hasTour: true,
    condoFee: 1900,
    iptu: 4900,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Obra de arte arquitetônica no condomínio mais exclusivo de Manaus. Mármore italiano em todos os ambientes sociais, living com pé-direito de 7 metros, cinema privativo com tratamento acústico, espaço spa com sauna úmida e seca, além de paisagismo exuberante com espelho d’água.',
    amenities: [
      'Pé-direito Quádruplo 7 Metros',
      'Cinema Privativo com 10 Poltronas Elétricas',
      'Spa com Sauna Úmida e Jacuzzi Integrada',
      'Espaço Gourmet Climatizado para 40 Pessoas',
      '6 Vagas Cobertas com Tomada Wallbox',
      'Guarita Blindada e Heliponto no Condomínio'
    ],
    highlights: ['Cinema privativo acústico', 'Mármore importado', 'Heliponto homologado']
  },
  {
    id: 12,
    title: 'Mansão de Frente para o Rio Negro com Pier Privativo e Heliponto',
    neighborhood: 'Ponta Negra',
    type: 'Casa',
    purpose: 'Comprar',
    price: 7800000,
    bedrooms: 6,
    suites: 6,
    bathrooms: 9,
    area: 900,
    garage: 8,
    highEnd: true,
    badge: 'Exclusividade Mundial',
    featured: true,
    hasTour: true,
    condoFee: 2800,
    iptu: 6800,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A joia mais cobiçada da Amazônia: mansão à beira-rio com 900m² construídos e pier privativo para atracar iates de grande porte. Pôr do sol incomparável direto da piscina com borda infinita que se funde com o Rio Negro. 6 suítes master, adega subterrânea, elevador panorâmico e heliponto particular.',
    amenities: [
      'Pier Náutico Privativo para Iates',
      'Piscina Borda Infinita com Visão do Rio Negro',
      'Heliponto Homologado',
      'Elevador Panorâmico Schindler',
      'Adega Subterrânea Climatizada',
      'Casa de Hóspedes Independente',
      '8 Vagas Cobertas'
    ],
    highlights: ['Pier para iates', 'Vista eterna do Rio Negro', 'Elevador panorâmico']
  }
];

// Dados das Cenas do Tour Virtual 360° Interativo
const TOUR_SCENES = {
  'Living Room / Sala': {
    name: 'Sala de Estar & Living',
    tag: 'Área Social Integrada',
    desc: 'Pé-direito duplo, porcelanato em grandes formatos e iluminação embutida em LED.',
    bg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    hotspots: [
      { x: 35, y: 45, label: 'Pé-direito de 4,20m', desc: 'Conforto térmico e amplitude visual impecável.' },
      { x: 72, y: 60, label: 'Varanda Integrada', desc: 'Abertura total com esquadrias invisíveis.' }
    ]
  },
  'Gourmet Kitchen': {
    name: 'Cozinha Gourmet & Ilha',
    tag: 'Design & Marcenaria',
    desc: 'Bancada em quartzo calacatta, cuba esculpida e eletrodomésticos embutidos.',
    bg: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85',
    hotspots: [
      { x: 42, y: 50, label: 'Ilha em Calacatta', desc: 'Resistência total a calor e manchas com acabamento acetinado.' },
      { x: 80, y: 35, label: 'Torre Quente Embutida', desc: 'Forno e micro-ondas de grife alemã com fechamento suave.' }
    ]
  },
  'Master Suite': {
    name: 'Suíte Master & Closet',
    tag: 'Privacidade & Descanso',
    desc: 'Isolamento acústico nas janelas, piso vinílico amadeirado e closet senhor e senhora.',
    bg: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
    hotspots: [
      { x: 50, y: 40, label: 'Vidros Termoacústicos', desc: 'Silêncio absoluto para o descanso da sua família.' },
      { x: 25, y: 55, label: 'Ar Condicionado Oculto', desc: 'Climatização duto que não interfere no design da parede.' }
    ]
  },
  'Varanda Gourmet': {
    name: 'Varanda Gourmet & Sunset',
    tag: 'Lazer & Confraternização',
    desc: 'Churrasqueira em inox com exaustão forçada, vista panorâmica e cortina de vidro.',
    bg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
    hotspots: [
      { x: 60, y: 50, label: 'Churrasqueira a Carvão', desc: 'Duto individual que elimina odores e fumaça.' },
      { x: 88, y: 40, label: 'Ponto de Chopp & Frigobar', desc: 'Infraestrutura completa para seus fins de semana.' }
    ]
  },
  'Piscina & Spa': {
    name: 'Piscina Privativa & Deck',
    tag: 'Relaxamento & Sol',
    desc: 'Revestimento em pedras naturais Hijau, cascata iluminada e hidromassagem.',
    bg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    hotspots: [
      { x: 45, y: 65, label: 'Borda Infinita', desc: 'Efeito espelho d’água contínuo.' },
      { x: 70, y: 75, label: 'Hidromassagem com Aquecimento', desc: '6 jatos de alta pressão acionados por controle.' }
    ]
  }
};

// Depoimentos Verificados
const TESTIMONIALS = [
  {
    name: 'Mariana Silveira',
    role: 'Compradora do 1º Imóvel • Parque 10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    quote: 'Comprar meu primeiro imóvel parecia assustador até eu falar com a equipe da Douran. Eles simularam todas as taxas, aprovaram meu crédito na Caixa em menos de 48 horas e o tour virtual me poupou visitas desnecessárias!',
    badge: 'Compra Concluída'
  },
  {
    name: 'Dr. Roberto Magalhães',
    role: 'Investidor & Médico • Adrianópolis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    quote: 'Atendimento impecável e estritamente sigiloso. Fechamos uma cobertura no Adrianópolis sem qualquer atrito contratual ou burocrático. A assessoria jurídica e tributária da Douran é de longe a melhor da região Norte.',
    badge: 'Private Broker'
  },
  {
    name: 'Fernanda & Carlos Leitão',
    role: 'Família • Ponta Negra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    quote: 'Estávamos procurando uma casa em condomínio há mais de 8 meses. A curadoria deles acertou em cheio na segunda opção que visitamos. Hoje meus filhos brincam com segurança e temos a casa dos nossos sonhos.',
    badge: 'Família Realizada'
  }
];

// Telefone do WhatsApp para atendimento
const WHATSAPP_PHONE = '5592999999999';

// Export global para navegador
window.PORTLAND_DATA = {
  PRICE_BANDS,
  NEIGHBORHOODS_DATA,
  PROPERTIES,
  TOUR_SCENES,
  TESTIMONIALS,
  WHATSAPP_PHONE
};
