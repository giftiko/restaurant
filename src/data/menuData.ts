import { MenuItem } from '../types/menu';

export const HERO_IMAGE = '/src/assets/images/hero_artisanal_kitchen_1791397328356.jpg';

export const CATEGORIES = [
  { id: 'all', label: 'All Offerings', count: 12 },
  { id: 'starters', label: 'Starters & Crudo', count: 2 },
  { id: 'hearth-mains', label: 'Hearth & Cuts', count: 2 },
  { id: 'wood-fired', label: 'Wood-Fired Hearth', count: 2 },
  { id: 'fresh-pastas', label: 'Artisanal Pastas', count: 2 },
  { id: 'desserts', label: 'Pastry & Sweets', count: 2 },
  { id: 'mixology', label: 'Botanical Bar', count: 2 },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'wagyu-ribeye',
    name: 'A5 Miyazaki Wagyu Ribeye',
    categoryId: 'hearth-mains',
    price: 78.00,
    description: 'Dry-aged Wagyu ribeye seared over white oak coals, accompanied by charred rosemary, slow-roasted garlic bulbs, Maldon sea salt crystals, and vintage red wine truffle reduction.',
    image: '/src/assets/images/dish_prime_wagyu_ribeye_1791397342326.jpg',
    prepTime: '22 min',
    calories: '740 kcal',
    isChefSpecial: true,
    dietary: ['Gluten-Free'],
    pairingRecommendation: 'Pair with 2018 Barolo Serralunga d’Alba',
    customizationOptions: {
      doneness: ['Rare', 'Medium Rare (Recommended)', 'Medium', 'Medium Well'],
      addOns: [
        { name: 'Shaved Périgord Black Truffle', price: 14.00 },
        { name: 'Bone Marrow Herb Butter', price: 6.00 },
        { name: 'Smoked Maldon Salt Extra Flakes', price: 2.00 }
      ],
      substitutions: ['Truffle Jus on Side', 'Extra Charred Herb Infusion']
    }
  },
  {
    id: 'woodfired-burrata-pizza',
    name: 'Wood-Fired Burrata & San Marzano',
    categoryId: 'wood-fired',
    price: 26.50,
    description: 'Naturally fermented 72-hour dough fired at 850°F, topped with crushed DOP San Marzano tomatoes, fresh pugliese burrata heart, Genovese basil leaves, and cold-pressed unfiltered olive oil.',
    image: '/src/assets/images/dish_woodfired_burrata_pizza_1791397355845.jpg',
    prepTime: '14 min',
    calories: '610 kcal',
    isChefSpecial: true,
    dietary: ['Vegetarian'],
    pairingRecommendation: 'Pair with Etna Rosso Tenuta delle Terre Nere',
    customizationOptions: {
      addOns: [
        { name: '24-Month Prosciutto di Parma', price: 7.00 },
        { name: 'Hot Calabrian Chili Oil Drizzle', price: 2.50 },
        { name: 'Extra Basilico & Fior di Latte', price: 4.00 }
      ],
      substitutions: ['Crispy Thin Crust', 'Gluten-Friendly Fermented Crust']
    }
  },
  {
    id: 'truffle-tagliatelle',
    name: 'Hand-Cut Winter Truffle Tagliatelle',
    categoryId: 'fresh-pastas',
    price: 34.00,
    description: 'Silky golden double-zero egg pasta twirled in organic alpine butter, 36-month Vacche Rosse Parmigiano-Reggiano, finished with fresh winter truffle shavings and aromatic chervil.',
    image: '/src/assets/images/dish_truffle_tagliatelle_1791397366077.jpg',
    prepTime: '16 min',
    calories: '580 kcal',
    isChefSpecial: true,
    dietary: ['Vegetarian'],
    pairingRecommendation: 'Pair with Gaja Ca’Marcanda Promis',
    customizationOptions: {
      addOns: [
        { name: 'Double Shaved Black Truffle', price: 12.00 },
        { name: 'Crispy Guanciale Cracklings', price: 5.50 },
        { name: 'Poached Organic Farm Egg Yolk', price: 3.50 }
      ],
      substitutions: ['Al Dente Firm', 'Extra Creamy Butter Emulsion']
    }
  },
  {
    id: 'hamachi-crudo',
    name: 'Hamachi Yellowtail Crudo',
    categoryId: 'starters',
    price: 24.00,
    description: 'Sashimi-grade Pacific yellowtail sashimi, blood orange discs, pickled shallots, white soy yuzu vinaigrette, purple edible violas, and crunchy pink peppercorn.',
    image: '/src/assets/images/dish_hamachi_crudo_1791397377610.jpg',
    prepTime: '10 min',
    calories: '310 kcal',
    isChefSpecial: false,
    dietary: ['Pescatarian', 'Gluten-Free', 'Dairy-Free'],
    pairingRecommendation: 'Pair with Sancerre Domaine Vacheron',
    customizationOptions: {
      addOns: [
        { name: 'Oscietra Royal Caviar (5g)', price: 18.00 },
        { name: 'Smoked Sea Salt Pearls', price: 2.00 }
      ],
      substitutions: ['Mild Citrus Dressing', 'Extra Micro Florals']
    }
  },
  {
    id: 'matcha-pistachio-gateau',
    name: 'Pistachio & Uji Matcha Entremet',
    categoryId: 'desserts',
    price: 18.00,
    description: 'Velvety Bronte pistachio praline sponge layered with ceremonial Uji matcha mousse, emerald mirror glaze, raspberry compote coulis, and edible 24k gold leaf.',
    image: '/src/assets/images/dish_matcha_pistachio_dessert_1791397388312.jpg',
    prepTime: '8 min',
    calories: '420 kcal',
    isChefSpecial: true,
    dietary: ['Vegetarian'],
    pairingRecommendation: 'Pair with Chateau d’Yquem Sauternes',
    customizationOptions: {
      addOns: [
        { name: 'Madagascar Vanilla Bean Gelato Scoop', price: 4.50 },
        { name: 'Extra Wild Berry Coulis', price: 2.00 }
      ],
      substitutions: ['Low Sweetness', 'Extra Toasted Pistachio Crumbs']
    }
  },
  {
    id: 'smoked-rosemary-old-fashioned',
    name: 'Hearth-Smoked Botanical Old Fashioned',
    categoryId: 'mixology',
    price: 21.00,
    description: 'Small-batch high-rye bourbon infused with charred Mediterranean rosemary, orange peel bitters, turbinado demerara syrup, smoked under glass with French oak shavings.',
    image: '/src/assets/images/drink_smoked_botanical_cocktail_1791397398003.jpg',
    prepTime: '6 min',
    calories: '190 kcal',
    isChefSpecial: false,
    dietary: ['Gluten-Free', 'Vegan'],
    pairingRecommendation: 'Ideal digestif before or following Hearth Cuts',
    customizationOptions: {
      addOns: [
        { name: 'Hand-Cut Diamond Ice Sphere', price: 2.00 },
        { name: 'Luxardo Maraschino Cherry Pair', price: 3.00 }
      ],
      substitutions: ['Light Smoke Infusion', 'Double Charred Smoke Infusion']
    }
  },
  {
    id: 'hearth-octopus',
    name: 'Spanish Charred Octopus Tentacle',
    categoryId: 'hearth-mains',
    price: 36.00,
    description: 'Tender braised Galician octopus seared crispy over charcoal embers, smoked paprika pimentón oil, fingerling potato confit, and saffron garlic aioli.',
    image: '/src/assets/images/dish_prime_wagyu_ribeye_1791397342326.jpg', // clean fallback
    prepTime: '18 min',
    calories: '490 kcal',
    isChefSpecial: false,
    dietary: ['Pescatarian', 'Gluten-Free'],
    pairingRecommendation: 'Pair with Albariño de Fefiñanes',
    customizationOptions: {
      addOns: [
        { name: 'Extra Charred Citrus Wedges', price: 1.50 },
        { name: 'Saffron Aioli Pot', price: 3.00 }
      ]
    }
  },
  {
    id: 'fig-gorgonzola-flatbread',
    name: 'Mission Fig & Dolce Gorgonzola Hearth Bread',
    categoryId: 'wood-fired',
    price: 24.00,
    description: 'Caramelized black mission figs, creamy Gorgonzola Dolce, wild baby arugula, wildflower mountain honey, and toasted pine nuts on blistered wood-fired sourdough.',
    image: '/src/assets/images/dish_woodfired_burrata_pizza_1791397355845.jpg',
    prepTime: '13 min',
    calories: '540 kcal',
    isChefSpecial: false,
    dietary: ['Vegetarian'],
    pairingRecommendation: 'Pair with Franciacorta Brut',
    customizationOptions: {
      addOns: [
        { name: 'Duck Confit Shreds', price: 6.00 },
        { name: 'Aged Balsamic Reduction', price: 2.00 }
      ]
    }
  },
  {
    id: 'artisan-agnolotti',
    name: 'Piedmontese Braised Short Rib Agnolotti',
    categoryId: 'fresh-pastas',
    price: 32.00,
    description: 'Hand-pinched pasta pillows stuffed with 12-hour Barolo-braised beef short rib, glossy rosemary jus reduction, and aged pecorino gran riserva shavings.',
    image: '/src/assets/images/dish_truffle_tagliatelle_1791397366077.jpg',
    prepTime: '17 min',
    calories: '650 kcal',
    isChefSpecial: false,
    pairingRecommendation: 'Pair with Nebbiolo d’Alba Vietti',
    customizationOptions: {
      addOns: [
        { name: 'Extra Braised Jus Pot', price: 3.00 },
        { name: 'Shaved Truffle Butter', price: 8.00 }
      ]
    }
  },
  {
    id: 'wild-mushroom-carpaccio',
    name: 'Woodland Chanterelle & Porcini Tartare',
    categoryId: 'starters',
    price: 22.00,
    description: 'Shaved raw matsutake and seared chanterelle mushrooms, cured egg yolk shavings, toasted hazelnut crunch, and warm brown-butter hazelnut vinaigrette.',
    image: '/src/assets/images/dish_hamachi_crudo_1791397377610.jpg',
    prepTime: '11 min',
    calories: '280 kcal',
    isChefSpecial: false,
    dietary: ['Vegetarian', 'Gluten-Free'],
    pairingRecommendation: 'Pair with Burgundy Chardonnay',
    customizationOptions: {
      addOns: [
        { name: 'Crumbled Sheep Feta', price: 3.50 }
      ]
    }
  },
  {
    id: 'smoked-vanilla-souffle',
    name: 'Warm Hearth Smoked Vanilla Bean Soufflé',
    categoryId: 'desserts',
    price: 19.50,
    description: 'Fluffy oven-risen soufflé scented with Tahitian vanilla bean and delicate birch smoke, served with warm Valrhona 70% dark chocolate ganache pour.',
    image: '/src/assets/images/dish_matcha_pistachio_dessert_1791397388312.jpg',
    prepTime: '20 min',
    calories: '460 kcal',
    isChefSpecial: true,
    dietary: ['Vegetarian'],
    pairingRecommendation: 'Pair with 20-Year Tawny Port'
  },
  {
    id: 'yuzu-bergamot-spritz',
    name: 'Amalfi Bergamot & Yuzu Zero-Proof Spritz',
    categoryId: 'mixology',
    price: 15.00,
    description: 'Pressed Japanese yuzu, chilled Italian bergamot sparkling tonic, clarifying cucumber ribbons, sparkling elderflower, and fresh mountain mint bouquet.',
    image: '/src/assets/images/drink_smoked_botanical_cocktail_1791397398003.jpg',
    prepTime: '5 min',
    calories: '85 kcal',
    isChefSpecial: false,
    dietary: ['Gluten-Free', 'Vegan'],
    pairingRecommendation: 'Refreshing palate cleanser during starters'
  }
];

export const INITIAL_ACTIVE_ORDER = {
  id: 'ord-8839',
  orderNumber: 'H-3082',
  createdAt: 'Just now',
  diningType: 'Dine-In' as const,
  tableNumber: 'Table 08 (Garden Veranda)',
  guestName: 'Eleanor Vance',
  items: [
    {
      cartItemId: 'init-1',
      menuItem: MENU_ITEMS[0], // Wagyu
      quantity: 1,
      options: {
        doneness: 'Medium Rare (Recommended)',
        selectedAddOns: [{ name: 'Shaved Périgord Black Truffle', price: 14.00 }],
        specialInstructions: 'Maldon salt on side'
      },
      itemTotalPrice: 92.00
    },
    {
      cartItemId: 'init-2',
      menuItem: MENU_ITEMS[1], // Pizza
      quantity: 1,
      options: {
        selectedAddOns: [{ name: 'Hot Calabrian Chili Oil Drizzle', price: 2.50 }],
        specialInstructions: 'Extra crispy leopard crust'
      },
      itemTotalPrice: 29.00
    },
    {
      cartItemId: 'init-3',
      menuItem: MENU_ITEMS[5], // Cocktail
      quantity: 2,
      options: {
        selectedAddOns: [{ name: 'Hand-Cut Diamond Ice Sphere', price: 2.00 }],
        specialInstructions: 'Heavy smoke infusion'
      },
      itemTotalPrice: 46.00
    }
  ],
  subtotal: 167.00,
  tax: 14.20,
  serviceFee: 5.00,
  tip: 30.00,
  total: 216.20,
  stage: 'wood_fired_hearth' as const,
  estimatedRemainingSeconds: 520, // ~8.5 mins
  totalEstimatedSeconds: 1200,
  stationName: 'Oak Hearth Station & Wood Oven 2',
  stationTemp: '840°F White Oak Fire',
  stationChef: 'Chef Laurent & Sous Chef Marco',
  logs: [
    {
      id: 'log-1',
      timestamp: '11:15 AM',
      stage: 'received' as const,
      title: 'Order Ticket Sent & Station Assigned',
      detail: 'Table 08 ticket acknowledged by Kitchen Display System. Prep prioritized.',
      station: 'Kitchen Expo & Pass'
    },
    {
      id: 'log-2',
      timestamp: '11:18 AM',
      stage: 'mise_en_place' as const,
      title: 'Mise en Place & Wagyu Tempering',
      detail: 'Miyazaki A5 cut brought to room temperature; 72-hour pizza dough opened by hand.',
      station: 'Cold Larder & Butcher'
    },
    {
      id: 'log-3',
      timestamp: '11:22 AM',
      stage: 'wood_fired_hearth' as const,
      title: 'Placed into 840°F Hearth Ember Bed',
      detail: 'Wagyu ribeye seared over white oak coals; burrata pizza placed in station oven #2.',
      station: 'Oak Hearth Station'
    }
  ]
};
