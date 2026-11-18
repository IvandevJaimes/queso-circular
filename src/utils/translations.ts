const CATEGORIAS_MAP: Record<string, string> = {
  Dessert: 'Postre',
  Vegetarian: 'Vegetariano',
  Starter: 'Entrada',
  Side: 'Guarnición',
  Pasta: 'Pasta',
  Miscellaneous: 'Varios',
  Seafood: 'Mariscos',
  Chicken: 'Pollo',
  Beef: 'Carne',
  Breakfast: 'Desayuno',
  Lamb: 'Cordero',
  Pork: 'Cerdo',
  Vegan: 'Vegano',
};

const ORIGENES_MAP: Record<string, string> = {
  Italian: 'Italiana',
  British: 'Británica',
  American: 'Estadounidense',
  French: 'Francesa',
  Greek: 'Griega',
  Polish: 'Polaca',
  Spanish: 'Española',
  Mexican: 'Mexicana',
  Unknown: 'Internacional',
};

const INGREDIENTES_MAP: Record<string, string> = {
  ricotta: 'Ricota',
  'ricotta cheese': 'Queso ricota',
  sugar: 'Azúcar',
  'caster sugar': 'Azúcar impalpable fina',
  'powdered sugar': 'Azúcar impalpable',
  'icing sugar': 'Azúcar impalpable',
  'brown sugar': 'Azúcar rubia',
  flour: 'Harina',
  'plain flour': 'Harina común',
  'all-purpose flour': 'Harina 0000',
  'self-raising flour': 'Harina leudante',
  eggs: 'Huevos',
  egg: 'Huevo',
  'egg yolks': 'Yemas de huevo',
  'egg yolk': 'Yema de huevo',
  'egg whites': 'Claras de huevo',
  butter: 'Manteca',
  'unsalted butter': 'Manteca sin sal',
  milk: 'Leche',
  'whole milk': 'Leche entera',
  salt: 'Sal',
  'sea salt': 'Sal marina',
  'olive oil': 'Aceite de oliva',
  'extra virgin olive oil': 'Aceite de oliva extra virgen',
  lemon: 'Limón',
  'lemon juice': 'Jugo de limón',
  'lemon zest': 'Ralladura de limón',
  honey: 'Miel',
  spinach: 'Espinaca',
  'baby spinach': 'Espinaca baby',
  garlic: 'Ajo',
  'garlic cloves': 'Dientes de ajo',
  parmesan: 'Queso parmesano',
  'parmesan cheese': 'Queso parmesano',
  'parmigiano-reggiano': 'Queso parmesano',
  'baking powder': 'Polvo de hornear',
  'vanilla extract': 'Esencia de vainilla',
  vanilla: 'Vainilla',
  cinnamon: 'Canela',
  nutmeg: 'Nuez moscada',
  'black pepper': 'Pimienta negra',
  pepper: 'Pimienta',
  water: 'Agua',
  onion: 'Cebolla',
  tomatoes: 'Tomates',
  'tomato sauce': 'Salsa de tomate',
  basil: 'Albahaca',
  parsley: 'Perejil',
  mozzarella: 'Queso mozzarella',
  'heavy cream': 'Crema de leche',
  'double cream': 'Crema doble',
  cream: 'Crema de leche',
  'pine nuts': 'Piñones',
  raisins: 'Pasas de uva',
  chocolate: 'Chocolate',
  'dark chocolate': 'Chocolate amargo',
  'orange zest': 'Ralladura de naranja',
  orange: 'Naranja',
  lasagna: 'Láminas de lasaña',
  'lasagne sheets': 'Láminas de lasaña',
};

const MEDIDAS_REEMPLAZOS: Array<[RegExp, string]> = [
  [/\btablespoons?\b/gi, 'cda.'],
  [/\btbsp\.?\b/gi, 'cda.'],
  [/\btbs\.?\b/gi, 'cda.'],
  [/\bteaspoons?\b/gi, 'cdita.'],
  [/\btsp\.?\b/gi, 'cdita.'],
  [/\bcups?\b/gi, 'taza'],
  [/\bfinely chopped\b/gi, 'picado fino'],
  [/\bchopped\b/gi, 'picado'],
  [/\bgrated\b/gi, 'rallado'],
  [/\bsliced\b/gi, 'en láminas'],
  [/\bto taste\b/gi, 'a gusto'],
  [/\bpinch\b/gi, 'pizca'],
  [/\blarge\b/gi, 'grande'],
  [/\bsmall\b/gi, 'pequeño'],
  [/\bmedium\b/gi, 'mediano'],
  [/\bfresh\b/gi, 'fresco'],
  [/\bhandful\b/gi, 'puñado'],
  [/\bsprigs?\b/gi, 'ramitas'],
  [/\bcloves?\b/gi, 'dientes'],
  [/\bcan\b/gi, 'lata'],
  [/\bpackage\b/gi, 'paquete'],
  [/\bpack\b/gi, 'paquete'],
  [/\boz\b/gi, 'oz'],
  [/\bmelted\b/gi, 'derretida'],
  [/\bsoftened\b/gi, 'blanda'],
  [/\bbeaten\b/gi, 'batido'],
];

export function traducirCategoria(categoria: string): string {
  const limpia = categoria.trim();
  return CATEGORIAS_MAP[limpia] ?? limpia;
}

export function traducirOrigen(origen: string): string {
  const limpio = origen.trim();
  return ORIGENES_MAP[limpio] ?? limpio;
}

export function traducirIngrediente(ingrediente: string): string {
  const limpio = ingrediente.trim();
  const clave = limpio.toLowerCase();
  if (INGREDIENTES_MAP[clave]) {
    return INGREDIENTES_MAP[clave];
  }
  return limpio;
}

export function traducirMedida(medida: string): string {
  const limpia = medida.trim();
  if (!limpia) return 'A gusto';
  let resultado = limpia;
  for (const [regex, reemplazo] of MEDIDAS_REEMPLAZOS) {
    resultado = resultado.replace(regex, reemplazo);
  }
  return resultado;
}
