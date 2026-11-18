export type RecetaCategoria =
  | 'Postres'
  | 'Masas y Panificados'
  | 'Entradas y Platos Principales'
  | 'Aprovechamiento';

export type RecetaDificultad = 'Fácil' | 'Media' | 'Avanzada';

export interface RecetaLocal {
  id: string;
  titulo: string;
  categoria: RecetaCategoria;
  tiempoPreparacion: string;
  dificultad: RecetaDificultad;
  porciones: string;
  imagenUrl: string;
  ingredientes: string[];
  instrucciones: string[];
  consejoCircular: string;
}

export const RECETAS_QUESO_CIRCULAR: RecetaLocal[] = [
  {
    id: 'ricota-casera-tradicional',
    titulo: 'Ricota Fresca Artesanal a partir de Suero y Leche',
    categoria: 'Aprovechamiento',
    tiempoPreparacion: '30 minutos',
    dificultad: 'Fácil',
    porciones: '1,2 kg de ricota',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Ricotte_fresche.jpg/960px-Ricotte_fresche.jpg',
    ingredientes: [
      '10 litros de lactosuero dulce residual',
      '1 litro de leche entera fresca',
      '30 ml de vinagre de manzana o jugo de limón',
      '1 cucharada sopera de sal fina',
    ],
    instrucciones: [
      'Calentar el lactosuero en una olla grande hasta alcanzar los 80 °C.',
      'Incorporar el litro de leche entera y mezclar suavemente.',
      'Añadir el vinagre o jugo de limón de forma lenta y uniforme mientras se revuelve despacio.',
      'Apagar el fuego al observar la separación del suero translúcido y los grumos blancos.',
      'Dejar reposar tapado durante 15 minutos para que la cuajada ascienda.',
      'Colocar un lienzo limpio sobre un colador y verter la preparación para escurrir el suero restante.',
      'Dejar colgado o escurriendo por 20 minutos según la humedad deseada y salar a gusto.',
    ],
    consejoCircular:
      'Aprovecha el suero secundario resultante (permeado) para regar huertas diluido 1:2 o como base líquida para amasar pan.',
  },
  {
    id: 'noquis-de-ricota-suaves',
    titulo: 'Ñoquis Caseros de Ricota sin TACC / Tradicionales',
    categoria: 'Entradas y Platos Principales',
    tiempoPreparacion: '45 minutos',
    dificultad: 'Media',
    porciones: '4 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Gnocchi_alla_sorrentina.jpg/960px-Gnocchi_alla_sorrentina.jpg',
    ingredientes: [
      '500 g de ricota fresca bien escurrida',
      '1 huevo de campo',
      '150 g de harina común (o harina de arroz para opción sin gluten)',
      '50 g de queso rallado tipo parmesano',
      'Sal, pimienta negra y nuez moscada a gusto',
    ],
    instrucciones: [
      'Colocar la ricota en un bol amplio y pisar con tenedor o tamizar para eliminar grumos grandes.',
      'Incorporar el huevo, el queso rallado, la sal, la pimienta y la nuez moscada.',
      'Agregar la harina de forma gradual integrando sin amasar en exceso para evitar que queden duros.',
      'Formar rollos sobre una mesada enharinada y cortar trozos de 2 cm.',
      'Pasar por un ñoquero o tenedor para darles textura.',
      'Cocinar en abundante agua hirviendo con sal; retirar un minuto después de que floten en la superficie.',
    ],
    consejoCircular:
      'Utilizar ricota bien escurrida reduce la cantidad de harina necesaria y mejora notablemente la textura suave del ñoqui.',
  },
  {
    id: 'tarta-frola-ricota',
    titulo: 'Tarta Húmeda de Ricota, Limón y Canela',
    categoria: 'Postres',
    tiempoPreparacion: '50 minutos',
    dificultad: 'Fácil',
    porciones: '8 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Crostata_Ricotta_e_Cannella.jpg/960px-Crostata_Ricotta_e_Cannella.jpg',
    ingredientes: [
      '400 g de ricota fresca',
      '3 huevos',
      '120 g de azúcar',
      'Ralladura de 1 limón orgánico y 1/2 cucharadita de canela',
      '1 cucharadita de esencia de vainilla',
      '2 cucharadas colmadas de almidón de maíz',
      '1 masa sablée o masa quebrada para tarta',
    ],
    instrucciones: [
      'Forrar un molde de tarta desmontable con la masa elegida y reservar en frío.',
      'Batir los huevos con el azúcar hasta lograr una mezcla homogénea y ligeramente espumosa.',
      'Integrar la ricota previamente pisada, la ralladura de limón, la canela y la vainilla.',
      'Añadir el almidón de maíz disuelto en una cucharada de leche o suero para evitar grumos.',
      'Verter la preparación sobre la masa cruda y decorar con tiras de masa si se desea.',
      'Hornear a 180 °C durante 35 a 40 minutos hasta que el relleno esté firme y levemente dorado.',
    ],
    consejoCircular:
      'Una alternativa comercial de alta rotación para dar salida semanal al excedente de ricota fresca artesanal.',
  },
  {
    id: 'pan-casero-lactosuero',
    titulo: 'Pan Artesanal Tierno Hidratado con Lactosuero',
    categoria: 'Masas y Panificados',
    tiempoPreparacion: '2 horas',
    dificultad: 'Fácil',
    porciones: '2 hogazas medianas',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Sourdough_Bread_Loaf.jpg/960px-Sourdough_Bread_Loaf.jpg',
    ingredientes: [
      '500 g de harina de trigo 000',
      '320 ml de lactosuero dulce tibio (35 °C)',
      '10 g de levadura fresca (o 4 g de levadura seca)',
      '2 cucharadas de aceite neutro o manteca blanda',
      '8 g de sal fina',
      '1 cucharadita de azúcar o miel',
    ],
    instrucciones: [
      'Disolver la levadura y la miel en el lactosuero tibio y dejar activar durante 10 minutos.',
      'Colocar la harina con la sal en un bol y hacer un hueco en el centro.',
      'Incorporar el suero activado y el aceite, integrando hasta formar un bollo liso.',
      'Amasar durante 8 minutos sobre la mesada hasta lograr elasticidad.',
      'Dejar leudar tapado en lugar cálido hasta que duplique su volumen (aprox. 50 minutos).',
      'Desgasificar suave, dar forma de hogaza, dejar reposar 20 minutos y hornear a 200 °C por 35 minutos.',
    ],
    consejoCircular:
      'Sustituir el 100% del agua por lactosuero aporta lactosa y minerales que doran mejor la corteza y prolongan la frescura.',
  },
  {
    id: 'focaccia-suero-romero',
    titulo: 'Focaccia Esponjosa de Suero, Oliva y Romero',
    categoria: 'Masas y Panificados',
    tiempoPreparacion: '1 hora 45 minutos',
    dificultad: 'Media',
    porciones: '6 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Focaccia_con_rosmarino.jpg/960px-Focaccia_con_rosmarino.jpg',
    ingredientes: [
      '500 g de harina 000',
      '350 ml de lactosuero fresco tibio',
      '15 g de levadura fresca',
      '4 cucharadas de aceite de oliva',
      '10 g de sal gruesa o entrefina',
      '2 ramitas de romero fresco',
    ],
    instrucciones: [
      'Mezclar el suero tibio con la levadura y 2 cucharadas de aceite de oliva.',
      'Integrar con la harina y la sal hasta obtener una masa húmeda y blanda sin amasado intenso.',
      'Realizar 3 pliegues sobre sí misma cada 20 minutos dentro del recipiente aceitado.',
      'Volcar sobre una placa aceitada, estirar suave con las yemas de los dedos y dejar leudar 30 minutos.',
      'Hundir los dedos formando hoyuelos, rociar con aceite de oliva, agua o suero y romero fresco.',
      'Hornear a 220 °C durante 20 a 25 minutos hasta obtener base crocante y superficie dorada.',
    ],
    consejoCircular:
      'Si el suero proviene de quesos ligeramente salados, reduce a la mitad la sal añadida a la masa.',
  },
  {
    id: 'canelones-espinaca-ricota',
    titulo: 'Canelones Gratinados de Espinaca y Ricota',
    categoria: 'Entradas y Platos Principales',
    tiempoPreparacion: '55 minutos',
    dificultad: 'Media',
    porciones: '6 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Baked_cannelloni%2C_Rauenthal.jpg/960px-Baked_cannelloni%2C_Rauenthal.jpg',
    ingredientes: [
      '450 g de ricota fresca',
      '300 g de espinaca fresca picada',
      '12 láminas de pasta o panqueques salados',
      '1 diente de ajo picado fino',
      '400 ml de salsa de tomate casera',
      '80 g de queso rallado para gratinar',
      'Sal, pimienta y nuez moscada',
    ],
    instrucciones: [
      'Saltear brevemente el ajo y la espinaca en una sartén hasta que pierda volumen y escurrir bien.',
      'Mezclar la espinaca picada con la ricota, la mitad del queso rallado, sal, pimienta y nuez moscada.',
      'Rellenar cada lámina o panqueque y enrollar formando los canelones.',
      'Cubrir la base de una fuente con salsa de tomate y acomodar los canelones uno junto al otro.',
      'Bañar con el resto de la salsa de tomate y espolvorear con queso rallado.',
      'Hornear a 190 °C durante 25 minutos hasta que burbujee y gratine la superficie.',
    ],
    consejoCircular:
      'Puedes aprovechar el suero restante en lugar de leche para preparar la masa de panqueques salados.',
  },
  {
    id: 'budin-citrico-ricota',
    titulo: 'Budín Húmedo de Ricota, Limón y Glaseado',
    categoria: 'Postres',
    tiempoPreparacion: '55 minutos',
    dificultad: 'Fácil',
    porciones: '10 rebanadas',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Glazed_lemon_pound_cake_in_basket.jpg/960px-Glazed_lemon_pound_cake_in_basket.jpg',
    ingredientes: [
      '250 g de ricota fresca tamizada',
      '3 huevos',
      '150 g de azúcar',
      '200 g de harina leudante',
      '80 ml de aceite suave',
      'Jugo y ralladura de 1 limón',
      '1 cucharadita de esencia de vainilla',
    ],
    instrucciones: [
      'Batir los huevos junto con el azúcar y el aceite hasta blanquear ligeramente.',
      'Agregar la ricota pisada, la ralladura y el jugo de limón, más la vainilla.',
      'Incorporar la harina leudante tamizada con movimientos suaves hasta no ver grumos.',
      'Volcar en un molde de budín enmantecado y enharinado.',
      'Hornear a 175 °C durante 40 a 45 minutos o hasta que al insertar un palillo salga seco.',
      'Dejar entibiar 10 minutos antes de desmoldar sobre rejilla y glasear con azúcar impalpable y limón.',
    ],
    consejoCircular:
      'La ricota reemplaza gran parte de la materia grasa pesada y mantiene el budín húmedo por más días.',
  },
  {
    id: 'requeson-untable-hierbas',
    titulo: 'Requesón Cremoso Untable con Hierbas y Oliva',
    categoria: 'Aprovechamiento',
    tiempoPreparacion: '15 minutos',
    dificultad: 'Fácil',
    porciones: '450 g de untable',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Cream_crackers_with_cheese_spread.jpg/960px-Cream_crackers_with_cheese_spread.jpg',
    ingredientes: [
      '350 g de ricota fresca',
      '60 ml de aceite de oliva virgen extra (o crema de leche)',
      '2 cucharadas de lactosuero dulce o leche',
      '1 cucharadita de ciboulette o perejil picado',
      '1 pizca de ajo en polvo o ralladura de limón',
      'Sal marina y pimienta blanca a gusto',
    ],
    instrucciones: [
      'Colocar la ricota en una procesadora o mixer de mano junto con el aceite de oliva.',
      'Procesar durante 2 minutos agregando de a poco el lactosuero hasta obtener crema lisa y aireada.',
      'Condimentar con sal marina, pimienta blanca, hierbas frescas picadas y ralladura cítrica.',
      'Mezclar brevemente sin sobrecalentar la preparación.',
      'Envasar en frascos o potes herméticos limpios y refrigerar 1 hora antes de servir con galletas.',
    ],
    consejoCircular:
      'Transforma ricota granulada común en un producto gourmet untable de mayor valor por kilogramo.',
  },
  {
    id: 'dulce-de-suero-artesanal',
    titulo: 'Dulce de Suero Caramelizado (Estilo Quesero)',
    categoria: 'Aprovechamiento',
    tiempoPreparacion: '1 hora 30 minutos',
    dificultad: 'Avanzada',
    porciones: '600 g de dulce',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/DulceDeLeche.jpg/960px-DulceDeLeche.jpg',
    ingredientes: [
      '4 litros de lactosuero dulce fresco (sin sal)',
      '500 g de azúcar común',
      '1/2 cucharadita de bicarbonato de sodio',
      '1 cucharadita de esencia de vainilla',
    ],
    instrucciones: [
      'Filtrar el lactosuero dulce recién separado para quitar restos sólidos.',
      'Colocar en una olla de fondo grueso junto con el bicarbonato de sodio y llevar a hervor suave.',
      'Incorporar el azúcar cuando el volumen se haya reducido aproximadamente a la mitad.',
      'Continuar la cocción a fuego bajo revolviendo con cuchara de madera para evitar que se pegue.',
      'Cuando espese, tome color caramelo claro y se vea el fondo al pasar la cuchara, retirar del fuego.',
      'Agregar la vainilla, batir vigorosamente 2 minutos para dar brillo y envasar en frascos limpios.',
    ],
    consejoCircular:
      'Permite aprovechar el 100% de la lactosa del suero sin descartar una sola gota al ambiente.',
  },
  {
    id: 'masa-pizza-suero',
    titulo: 'Masa Crujiente de Pizza Hidratada con Lactosuero',
    categoria: 'Masas y Panificados',
    tiempoPreparacion: '1 hora 20 minutos',
    dificultad: 'Fácil',
    porciones: '3 prepizzas',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Pizza-napoletana.jpg/960px-Pizza-napoletana.jpg',
    ingredientes: [
      '600 g de harina 000',
      '360 ml de lactosuero tibio',
      '15 g de levadura fresca',
      '3 cucharadas de aceite de oliva',
      '10 g de sal fina',
    ],
    instrucciones: [
      'Entibiar el lactosuero y disolver allí la levadura fresca sin que supere los 38 °C.',
      'Mezclar la harina con la sal, sumar el suero y el aceite de oliva.',
      'Amasar hasta lograr una masa lisa que no se pegue a las manos.',
      'Dividir en 3 bollos iguales y dejar descansar tapados durante 40 minutos.',
      'Estirar sobre pizzeras aceitadas, cubrir con salsa de tomate y precocinar 8 minutos a 220 °C.',
      'Completar con queso fresco o ricota condimentada y hornear 6 minutos más hasta fundir.',
    ],
    consejoCircular:
      'Las proteínas residuales del suero mejoran la elasticidad de la masa y el dorado parejo en el horno.',
  },
  {
    id: 'flan-cremoso-ricota',
    titulo: 'Flan Casero Cremoso de Ricota y Caramelo',
    categoria: 'Postres',
    tiempoPreparacion: '1 hora',
    dificultad: 'Fácil',
    porciones: '6 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Homemade_Flan.jpg/960px-Homemade_Flan.jpg',
    ingredientes: [
      '300 g de ricota fresca',
      '400 ml de leche o mezcla de leche y suero dulce',
      '4 huevos',
      '140 g de azúcar (más 100 g extra para el caramelo)',
      '1 cucharadita de esencia de vainilla',
    ],
    instrucciones: [
      'Preparar un caramelo dorado con los 100 g de azúcar y cubrir el fondo de una flanera.',
      'Licuar la ricota con la leche, los huevos, el azúcar restante y la vainilla hasta lograr crema lisa.',
      'Verter la preparación en la flanera acaramelada pasando por un colador fino.',
      'Cocinar a baño María en horno moderado (160 °C) durante 45 a 50 minutos hasta que cuaje.',
      'Dejar enfriar completamente y llevar a heladera por 4 horas antes de desmoldar.',
    ],
    consejoCircular:
      'La ricota aporta cremosidad firme y reduce la necesidad de usar crema de leche comercial.',
  },
  {
    id: 'ravioles-ricota-espinaca',
    titulo: 'Ravioles Artesanales de Ricota y Espinaca',
    categoria: 'Entradas y Platos Principales',
    tiempoPreparacion: '1 hora 15 minutos',
    dificultad: 'Media',
    porciones: '4 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Spinach_and_ricotta_ravioli_%286994028593%29.jpg/960px-Spinach_and_ricotta_ravioli_%286994028593%29.jpg',
    ingredientes: [
      '350 g de ricota bien escurrida',
      '200 g de espinaca cocida y picada fina',
      '300 g de harina 0000 y 3 huevos para la masa',
      '60 g de queso rallado estacionado',
      'Sal, pimienta negra y nuez moscada',
    ],
    instrucciones: [
      'Amasar la harina con los huevos y una pizca de sal hasta obtener masa firme; descansar 30 minutos.',
      'Mezclar la ricota escurrida con la espinaca bien exprimida, el queso rallado y los condimentos.',
      'Estirar dos láminas finas de masa, distribuir montoncitos de relleno y humedecer los bordes.',
      'Cubrir con la segunda lámina, presionar sacando el aire y cortar los ravioles con ruedita.',
      'Hervir en abundante agua con sal durante 3 a 4 minutos y servir con manteca de salvia o salsa suave.',
    ],
    consejoCircular:
      'Combinar la ricota del día con vegetales de huerta local duplica el valor comercial de un plato listo.',
  },
  {
    id: 'sopa-crema-calabaza-suero',
    titulo: 'Sopa Crema de Calabaza y Lactosuero con Ricota',
    categoria: 'Entradas y Platos Principales',
    tiempoPreparacion: '35 minutos',
    dificultad: 'Fácil',
    porciones: '4 platos',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Cream_of_pumpkin_soup.jpg/960px-Cream_of_pumpkin_soup.jpg',
    ingredientes: [
      '700 g de calabaza o zapallo anco pelado en cubos',
      '500 ml de lactosuero dulce fresco',
      '1 cebolla mediana picada',
      '2 cucharadas de aceite de oliva o manteca',
      '100 g de ricota fresca para coronar',
      'Sal, pimienta y tomillo a gusto',
    ],
    instrucciones: [
      'Rehogar la cebolla en aceite o manteca durante 5 minutos hasta transparentar.',
      'Sumar los cubos de calabaza, cubrir con el lactosuero fresco y salpimentar.',
      'Cocinar tapado a fuego medio durante 20 minutos hasta que la calabaza esté bien tierna.',
      'Procesar con mixer hasta obtener una crema aterciopelada y corregir consistencia con más suero tibio.',
      'Servir caliente decorando cada plato con una cucharada de ricota fresca y tomillo.',
    ],
    consejoCircular:
      'Reemplazar el caldo o la crema por lactosuero suma cuerpo proteico y aprovecha lotes pequeños sin desperdicio.',
  },
  {
    id: 'salsa-cremosa-ricota-pasta',
    titulo: 'Salsa Cremosa de Ricota, Oliva y Hierbas para Pastas',
    categoria: 'Aprovechamiento',
    tiempoPreparacion: '15 minutos',
    dificultad: 'Fácil',
    porciones: '4 porciones',
    imagenUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Barilla_pasta_2026-07-14_Ricotta_sauce_01.jpg/960px-Barilla_pasta_2026-07-14_Ricotta_sauce_01.jpg',
    ingredientes: [
      '250 g de ricota fresca',
      '80 ml de lactosuero dulce tibio o agua de cocción',
      '2 cucharadas de aceite de oliva extra virgen',
      '1 diente de ajo machacado y albahaca fresca',
      '40 g de queso rallado y pimienta negra recién molida',
    ],
    instrucciones: [
      'Perfumar el aceite de oliva con el ajo a fuego muy bajo durante 2 minutos y retirar el ajo.',
      'En un bol amplio, batir la ricota con el aceite tibio y el lactosuero hasta formar salsa sedosa.',
      'Incorporar el queso rallado, hojas de albahaca picadas y abundante pimienta negra.',
      'Mezclar directamente con la pasta recién cocida y servir de inmediato.',
    ],
    consejoCircular:
      'Permite preparar salsas ligeras de gran cremosidad utilizando únicamente ricota fresca y suero tibio sin crema.',
  },
];
