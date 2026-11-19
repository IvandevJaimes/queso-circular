import type { Alternativa } from '../types/produccion.types';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const RENDIMIENTO_QUESO = 0.12;
export const RENDIMIENTO_SUERO = 0.88;
export const PORCENTAJE_QUESO = 12;
export const PORCENTAJE_SUERO = 88;

export const MAX_LITROS_OPERATIVO = 50000;
export const PRESETS_LITROS = [15, 50, 120, 250] as const;

export const UMBRAL_VOLUMEN_MUY_BAJO_SUERO = 20;
export const UMBRAL_VOLUMEN_BAJO_SUERO = 30;
export const UMBRAL_VOLUMEN_MEDIO_SUERO = 150;

export const ALTERNATIVAS: Alternativa[] = [
  {
    id: 'ricota',
    categoria: 'Alimentación humana',
    titulo: 'Elaboración de ricota',
    resumen:
      'Recupera proteínas séricas por calentamiento y acidificación suave para consumo directo o venta local.',
    descripcion:
      'El lactosuero dulce conserva proteínas de alto valor biológico precipitables entre 85 °C y 90 °C mediante coagulación ácida suave.',
    precaucion:
      'Respetar higiene alimentaria, control térmico y cadena de frío bajo 4 °C.',
    precaucionesLista: [
      'Controlar temperatura uniforme para evitar quemado proteico.',
      'Enfriar rápido tras el desuerado y refrigerar bajo 4 °C.',
      'Mantener utensilios sanitizados durante todo el proceso.',
    ],
    condicionesUso: [
      'Procesar suero fresco dentro de las 4 horas posteriores.',
      'Trabajar con baja acidez titulable en tina limpia.',
      'Escurrir en moldes o telas sanitizadas sin presión.',
    ],
    equipamientoBasico: [
      'Olla o tina térmica',
      'Termómetro (95 °C)',
      'Acidificante',
      'Moldes perforados',
    ],
    escalaIdeal: '> 30 L',
    icono: 'chef-hat',
  },
  {
    id: 'bebida_lactea',
    categoria: 'Alimentación humana',
    titulo: 'Bebidas lácteas frutadas y fermentadas',
    resumen:
      'Suero dulce pasteurizado combinado con pulpa de fruta o fermentos lácticos tipo kéfir refrescante.',
    descripcion:
      'Al pasteurizar el lactosuero dulce y combinarlo con jugos naturales o cultivos probióticos se obtienen bebidas proteicas ligeras de rápida salida comercial.',
    precaucion:
      'Pasteurizar siempre el suero antes de envasar y conservar refrigerado.',
    precaucionesLista: [
      'Pasteurizar a 72–75 °C antes de incorporar fruta.',
      'Envasar en botellas sanitizadas con cierre hermético.',
      'Mantener cadena de frío constante entre 2 y 4 °C.',
    ],
    condicionesUso: [
      'Partir de suero dulce sin sal añadida.',
      'Ajustar acidez y dulzor con fruta cítrica o miel.',
      'Consumir dentro de los 5 a 7 días refrigerado.',
    ],
    equipamientoBasico: [
      'Pasteurizador u olla',
      'Termómetro digital',
      'Licuadora industrial',
      'Envases herméticos',
    ],
    escalaIdeal: '> 20 L',
    icono: 'glass-water',
  },
  {
    id: 'dulce_suero',
    categoria: 'Alimentación humana',
    titulo: 'Dulce de suero caramelizado',
    resumen:
      'Concentración lenta con azúcar para elaborar untable lácteo estilo mysost o dulce artesanal.',
    descripcion:
      'La evaporación controlada de la lactosa y proteínas del suero dulce permite elaborar un dulce firme o untable muy valorado en ferias regionales.',
    precaucion:
      'Controlar el punto de ebullición y revolver continuo para evitar quemado.',
    precaucionesLista: [
      'Usar exclusivamente suero dulce libre de sal.',
      'Evitar fuego directo excesivo en la etapa final.',
      'Envasar en frascos esterilizados en caliente.',
    ],
    condicionesUso: [
      'Neutralizar acidez leve con bicarbonato de sodio.',
      'Agregar azúcar al 12–15% sobre el volumen inicial.',
      'Concentrar hasta alcanzar textura densa de dulce.',
    ],
    equipamientoBasico: [
      'Paila o cacerola gruesa',
      'Espátula de silicona',
      'Refractómetro o cuchara',
      'Frascos de vidrio',
    ],
    escalaIdeal: '20–100 L',
    icono: 'flame',
  },
  {
    id: 'panificados',
    categoria: 'Alimentación humana',
    titulo: 'Sustituto de agua en panadería',
    resumen:
      'Reemplazo líquido en masas de pan, pizza o focaccia que aporta esponjosidad, sabor y mejor corteza.',
    descripcion:
      'La lactosa y las proteínas del suero favorecen el dorado de Maillard en horneado y extienden la frescura natural de panificados caseros.',
    precaucion:
      'Ajustar la sal de la receta si el suero proviene de quesos salados.',
    precaucionesLista: [
      'Reducir sal agregada si el suero tiene salmuera.',
      'Utilizar suero del día o refrigerado limpio.',
      'Controlar tiempos de fermentación por mayor acidez.',
    ],
    condicionesUso: [
      'Sustituir entre el 50% y 100% del agua.',
      'Usar tibio (35 °C) para activar levaduras.',
      'Alianzas directas con panaderías locales.',
    ],
    equipamientoBasico: [
      'Amasadora o batea',
      'Bidones alimentarios',
      'Horno panadero',
    ],
    escalaIdeal: '< 50 L',
    icono: 'wheat',
  },
  {
    id: 'requeson_untable',
    categoria: 'Alimentación humana',
    titulo: 'Requesón cremoso y untables',
    resumen:
      'Emulsión de ricota fresca con crema, especias o hierbas para comercializar como queso crema artesanal.',
    descripcion:
      'Procesando la ricota recuperada del suero junto con una fracción de crema o aceite de oliva se logra un producto de mayor valor agregado y vida útil.',
    precaucion:
      'Procesar con equipamiento desinfectado y refrigerar de inmediato.',
    precaucionesLista: [
      'Desinfectar cuchillas y vasos antes de emulsionar.',
      'Usar especias deshidratadas o pasteurizadas.',
      'Etiquetar fecha de elaboración y vencimiento.',
    ],
    condicionesUso: [
      'Escurrir la ricota base hasta textura firme.',
      'Batir en procesadora hasta lograr pasta homogénea.',
      'Envasar en potes con tapa inviolable.',
    ],
    equipamientoBasico: [
      'Procesadora o mixer',
      'Balanza de precisión',
      'Potes alimentarios',
    ],
    escalaIdeal: '> 30 L',
    icono: 'cookie',
  },
  {
    id: 'vinagre_suero',
    categoria: 'Alimentación humana',
    titulo: 'Vinagre natural y fermento ácido',
    resumen:
      'Fermentación alcohólica y acética del suero desproteinizado para aderezos o coagulante propio.',
    descripcion:
      'Tras extraer la ricota, los azúcares del permeado pueden fermentarse con levaduras y bacterias acéticas para obtener vinagre suave o suero ácido reutilizable.',
    precaucion:
      'Mantener recipientes exclusivos rotulados para evitar contaminaciones cruzadas.',
    precaucionesLista: [
      'Separar el área de fermentación de la tina quesera.',
      'Controlar acidez antes de usar como aderezo.',
      'Filtrar y embotellar en vidrio limpio.',
    ],
    condicionesUso: [
      'Partir de suero claro desproteinizado y filtrado.',
      'Inocular levadura seleccionada en primera etapa.',
      'Oxigenar suavemente para la fase acética.',
    ],
    equipamientoBasico: [
      'Damajuanas o fermentadores',
      'Airlock o gasa limpia',
      'Tiras medidoras pH',
    ],
    escalaIdeal: '< 40 L',
    icono: 'flask',
  },
  {
    id: 'agricola',
    categoria: 'Agro y bioinsumos',
    titulo: 'Enmiendas agrícolas controladas',
    resumen:
      'Aporte dosificado de nutrientes y materia orgánica en suelos, pasturas o fertirriego diluido.',
    descripcion:
      'El suero diluido aporta fósforo, potasio y calcio al suelo, potenciando la actividad microbiana en planes de fertirriego controlado.',
    precaucion:
      'Controlar dosis por hectárea y distancia a napas para evitar salinización.',
    precaucionesLista: [
      'Evitar aplicar sobre suelos saturados o antes de lluvias.',
      'Respetar distancia mínima a cursos de agua superficiales.',
      'Monitorear pH y conductividad para evitar acidificación.',
    ],
    condicionesUso: [
      'Analizar pH y salinidad del suelo antes de aplicar.',
      'Diluir 1 parte de suero en 2 de agua.',
      'Aplicar de forma homogénea en parcelas definidas.',
    ],
    equipamientoBasico: [
      'Tanque de mezcla',
      'Bomba dosificadora',
      'Medidor de pH',
    ],
    escalaIdeal: '< 150 L',
    icono: 'sprout',
  },
  {
    id: 'compostaje',
    categoria: 'Agro y bioinsumos',
    titulo: 'Acelerador de compost y bocashi',
    resumen:
      'Humectación de pilas secas de rastrojo, hojas o viruta para activar microorganismos fermentativos.',
    descripcion:
      'El lactosuero aporta humedad, azúcares y bacterias lácticas que aceleran la descomposición de materiales ricos en carbono sin generar malos olores.',
    precaucion:
      'Equilibrar siempre con abundante material seco para evitar encharcamientos.',
    precaucionesLista: [
      'No saturar la pila; mantener humedad al 55%.',
      'Mezclar con paja, aserrín o restos secos.',
      'Voltear la pila semanalmente para airear.',
    ],
    condicionesUso: [
      'Aplicar en capas alternadas de material seco.',
      'Controlar temperatura interna entre 50 y 65 °C.',
      'Dejar madurar 45 a 60 días antes de usar.',
    ],
    equipamientoBasico: [
      'Regadera o aspersor',
      'Horquilla de volteo',
      'Termómetro de compost',
    ],
    escalaIdeal: '< 100 L',
    icono: 'recycle',
  },
  {
    id: 'biofertilizante_foliar',
    categoria: 'Agro y bioinsumos',
    titulo: 'Biofertilizante fermentado (Biol lácteo)',
    resumen:
      'Fermentación anaeróbica enriquecida con melaza y ceniza para nutrición foliar y control de hongos.',
    descripcion:
      'El suero actúa como base biológica rica en minerales y lactobacilos para producir bioles orgánicos que fortalecen cultivos hortícolas y frutales.',
    precaucion:
      'Usar válvula de escape de gases y diluir al 5–10% antes de pulverizar.',
    precaucionesLista: [
      'Instalar sello de agua para liberar gas metano/CO2.',
      'Nunca aplicar puro sobre hojas tiernas.',
      'Pulverizar al atardecer evitando sol fuerte.',
    ],
    condicionesUso: [
      'Fermentar en tanque cerrado durante 21 a 30 días.',
      'Agregar melaza y ceniza vegetal tamizada.',
      'Filtrar bien antes de cargar en mochila pulverizadora.',
    ],
    equipamientoBasico: [
      'Tambores de 200 L',
      'Manguera y botella sello',
      'Mochila pulverizadora',
    ],
    escalaIdeal: '20–120 L',
    icono: 'leaf',
  },
  {
    id: 'animal',
    categoria: 'Nutrición animal',
    titulo: 'Suplementación animal directa',
    resumen:
      'Complemento líquido energético en dietas balanceadas para ganado porcino o bovino bajo control.',
    descripcion:
      'Por su contenido de lactosa y minerales, el suero fresco se integra como suplemento energético en raciones animales planificadas.',
    precaucion:
      'Ajustar dosis diaria según especie y retirar cualquier partida fermentada.',
    precaucionesLista: [
      'Descartar suero con fermentación indeseada o contaminación.',
      'Lavar diariamente bebederos para evitar carga bacteriana.',
      'Introducir de forma gradual junto a ración seca.',
    ],
    condicionesUso: [
      'Suministrar suero fresco del día y estabilizado.',
      'Dosificar volumen máximo según especie y peso.',
      'Registrar consumo diario por lote animal.',
    ],
    equipamientoBasico: [
      'Bebederos lavables',
      'Bidones con tapa',
      'Planilla de lote',
    ],
    escalaIdeal: '< 150 L',
    icono: 'heart-pulse',
  },
  {
    id: 'ensilaje',
    categoria: 'Nutrición animal',
    titulo: 'Inoculante láctico para silaje',
    resumen:
      'Aspersión sobre pasturas o maíz picado al confeccionar microsilos para acelerar la conservación.',
    descripcion:
      'Las bacterias ácido-lácticas y la lactosa del suero fresco mejoran la caída rápida del pH en forrajes picados, reduciendo pérdidas por hongos en el silo.',
    precaucion:
      'Aplicar de forma uniforme al compactar para no generar bolsas de líquido.',
    precaucionesLista: [
      'No exceder 3–5 litros por cada 100 kg de forraje.',
      'Compactar muy bien para expulsar el oxígeno.',
      'Sellar herméticamente el silo el mismo día.',
    ],
    condicionesUso: [
      'Usar suero fresco sin conservantes químicos.',
      'Rociar capa por capa durante el picado.',
      'Dejar fermentar mínimo 30 días antes de abrir.',
    ],
    equipamientoBasico: [
      'Mochila o bomba rociadora',
      'Bolsas o silo trinchera',
      'Compactador o pisón',
    ],
    escalaIdeal: '30–200 L',
    icono: 'layers',
  },
  {
    id: 'intercambio',
    categoria: 'Energía y red',
    titulo: 'Intercambio entre productores',
    resumen:
      'Articulación con tambos, granjas o plantas vecinas para valorizar excedentes diarios a mayor escala.',
    descripcion:
      'Coordinar retiros programados con establecimientos cercanos transforma excedentes diarios en insumo compartido reduciendo costos.',
    precaucion:
      'Garantizar retiro diario, trazabilidad sanitaria y transporte en envases cerrados.',
    precaucionesLista: [
      'Retirar en el día para evitar acidificación excesiva.',
      'Desinfectar tanques y válvulas tras cada descarga.',
      'Cumplir normativa sanitaria local de traslado lácteo.',
    ],
    condicionesUso: [
      'Acordar frecuencia fija de recolección diaria.',
      'Disponer punto de carga con tanque cerrado.',
      'Emitir remito interno con volumen y destino.',
    ],
    equipamientoBasico: [
      'Tanque pulmón limpio',
      'Contenedores rotulados',
      'Remito de entrega',
    ],
    escalaIdeal: '> 150 L',
    icono: 'handshake',
  },
  {
    id: 'biogas',
    categoria: 'Energía y red',
    titulo: 'Biodigestión para biogás y bioabono',
    resumen:
      'Co-digestión anaeróbica con estiércol para generar gas térmico para la quesería y efluente estable.',
    descripcion:
      'La alta carga orgánica del lactosuero produce un elevado rendimiento de metano cuando se dosifica junto a estiércol en biodigestores rurales.',
    precaucion:
      'Dosificar gradualmente para evitar acidificación brusca del biodigestor.',
    precaucionesLista: [
      'No superar el 15–20% de suero en la mezcla diaria.',
      'Monitorear pH interno del digestor semanalmente.',
      'Instalar trampas de agua y sulfuro en línea de gas.',
    ],
    condicionesUso: [
      'Mezclar previamente con estiércol bovino o porcino.',
      'Cargar de manera diaria y constante.',
      'Reutilizar el biogás para calentar la tina quesera.',
    ],
    equipamientoBasico: [
      'Biodigestor tubular/fijo',
      'Tanque ecualizador',
      'Quemador de biogás',
    ],
    escalaIdeal: '> 300 L',
    icono: 'droplets',
  },
  {
    id: 'secado_concentrado',
    categoria: 'Energía y red',
    titulo: 'Acopio cooperativo para concentración',
    resumen:
      'Refrigeración y logística conjunta entre varias queserías para enviar suero a plantas industriales.',
    descripcion:
      'Agrupar la producción de varios pequeños elaboradores en un centro de frío permite alcanzar el volumen mínimo que exigen las plantas de suero en polvo o proteínas.',
    precaucion:
      'Enfriar inmediatamente bajo 4 °C para conservar la calidad industrial.',
    precaucionesLista: [
      'Enfriar a menos de 4 °C antes de 2 horas.',
      'Evitar mezcla de sueros con antibióticos o detergentes.',
      'Realizar análisis rápido de acidez en cada entrega.',
    ],
    condicionesUso: [
      'Contar con tanque enfriador comunitario en acero inoxidable.',
      'Coordinar camión cisterna cada 24 o 48 horas.',
      'Llevar registro de litros aportados por socio.',
    ],
    equipamientoBasico: [
      'Tanque enfriador',
      'Acidímetro Dornic',
      'Bomba sanitaria',
    ],
    escalaIdeal: '> 500 L',
    icono: 'factory',
  },
];
