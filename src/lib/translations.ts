export type Lang = 'es' | 'en'

export const translations = {
  es: {
    nav: {
      menu: 'Menú',
      promotions: 'Promociones',
      games: 'Juegos',
      location: 'Ubicación',
      admin: 'Admin',
    },
    hero: {
      tagline: 'Tu lugar preferido',
      sub: 'Cerveza y amigos, la mezcla perfecta.',
      cta: 'Ver el menú',
      ctaSub: 'Escríbenos',
    },
    menu: {
      title: 'Lo que tenemos',
      subtitle: 'Desde una chela fría hasta algo que te pegue más fuerte.',
      available: 'Disponible',
      unavailable: 'Agotado',
      price: 'Precio',
      all: 'Todo',
    },
    promotions: {
      title: 'Promociones',
      subtitle: 'Aprecha las noches. Aprovecha los precios.',
      active: 'Vigente',
    },
    nights: {
      title: 'Horarios y Noches Especiales',
      subtitle: 'Cada noche tiene su rollo.',
      hoursTitle: 'Horarios',
      specialsTitle: 'Noches especiales',
    },
    games: {
      title: 'Juegos de Bar',
      subtitle: 'Para que la noche no se quede en silencio.',
      spinBottle: 'Pico Botella',
      spinBottleDesc: 'Gira la botella y que sea lo que sea.',
      caps: 'Juego de Tapas',
      capsDesc: 'Adivina cuántas tapas — el que falla, toma.',
      challenges: 'Retos Grupales',
      challengesDesc: 'Retos aleatorios para animar la mesa.',
      spin: 'Girar',
      draw: 'Sacar reto',
      guess: 'Adivinar',
      result: 'Resultado',
      tapas: 'tapas',
      newGame: 'Nuevo juego',
    },
    location: {
      title: 'Encuéntranos',
      subtitle: 'Ya sabes dónde es. Te esperamos.',
      address: 'Dirección',
      whatsapp: 'Escríbenos por WhatsApp',
    },
    footer: {
      tagline: 'Cerveza y amigos, la mezcla perfecta.',
      rights: 'Todos los derechos reservados.',
    },
    floating: {
      whatsapp: 'Escríbenos',
    },
    admin: {
      login: 'Acceso Admin',
      password: 'Contraseña',
      enter: 'Entrar',
      wrong: 'Contraseña incorrecta',
      logout: 'Salir',
      dashboard: 'Panel',
      menu: 'Menú',
      inventory: 'Inventario',
      promotions: 'Promociones',
      carousel: 'Carrusel',
      settings: 'Configuración',
    },
  },
  en: {
    nav: {
      menu: 'Menu',
      promotions: 'Specials',
      games: 'Games',
      location: 'Location',
      admin: 'Admin',
    },
    hero: {
      tagline: 'Your favorite spot',
      sub: 'Beer and friends, the perfect mix.',
      cta: 'See the menu',
      ctaSub: 'Message us',
    },
    menu: {
      title: 'What we have',
      subtitle: 'From a cold beer to something that hits harder.',
      available: 'Available',
      unavailable: 'Sold out',
      price: 'Price',
      all: 'All',
    },
    promotions: {
      title: 'Specials',
      subtitle: 'Make the most of the night. Make the most of the prices.',
      active: 'Active',
    },
    nights: {
      title: 'Hours & Special Nights',
      subtitle: "Every night has its vibe.",
      hoursTitle: 'Hours',
      specialsTitle: 'Special nights',
    },
    games: {
      title: 'Bar Games',
      subtitle: "So the night doesn't stay quiet.",
      spinBottle: 'Spin the Bottle',
      spinBottleDesc: 'Spin the bottle and see what happens.',
      caps: 'Caps Game',
      capsDesc: 'Guess how many caps — wrong guess, drink.',
      challenges: 'Group Challenges',
      challengesDesc: 'Random challenges to liven up the table.',
      spin: 'Spin',
      draw: 'Draw challenge',
      guess: 'Guess',
      result: 'Result',
      tapas: 'caps',
      newGame: 'New game',
    },
    location: {
      title: 'Find Us',
      subtitle: 'You know where it is. We will be here.',
      address: 'Address',
      whatsapp: 'Message us on WhatsApp',
    },
    footer: {
      tagline: 'Beer and friends, the perfect mix.',
      rights: 'All rights reserved.',
    },
    floating: {
      whatsapp: 'Message us',
    },
    admin: {
      login: 'Admin Login',
      password: 'Password',
      enter: 'Enter',
      wrong: 'Wrong password',
      logout: 'Logout',
      dashboard: 'Dashboard',
      menu: 'Menu',
      inventory: 'Inventory',
      promotions: 'Promotions',
      carousel: 'Carousel',
      settings: 'Settings',
    },
  },
} satisfies Record<string, unknown>

// Use a flexible type so both 'es' and 'en' are assignable
export type Translations = {
  nav: { menu: string; promotions: string; games: string; location: string; admin: string }
  hero: { tagline: string; sub: string; cta: string; ctaSub: string }
  menu: { title: string; subtitle: string; available: string; unavailable: string; price: string; all: string }
  promotions: { title: string; subtitle: string; active: string }
  nights: { title: string; subtitle: string; hoursTitle: string; specialsTitle: string }
  games: {
    title: string; subtitle: string; spinBottle: string; spinBottleDesc: string;
    caps: string; capsDesc: string; challenges: string; challengesDesc: string;
    spin: string; draw: string; guess: string; result: string; tapas: string; newGame: string
  }
  location: { title: string; subtitle: string; address: string; whatsapp: string }
  footer: { tagline: string; rights: string }
  floating: { whatsapp: string }
  admin: {
    login: string; password: string; enter: string; wrong: string; logout: string;
    dashboard: string; menu: string; inventory: string; promotions: string; carousel: string; settings: string
  }
}
