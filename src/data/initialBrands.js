import { TARANIS_SKILLS, PENELOPE_SKILLS } from './initialSkills';

export const INITIAL_BRANDS = [
  {
    id: 'taranis-black',
    name: 'Taranis Black',
    tagline: 'Mobiliario Corporativo de Alta Performance & Ergonomía Activa (NR-17)',
    industry: 'Mobiliario Corporativo B2B & Home Office Premium D2C (Brasil / LatAm)',
    accentColor: '#6C3A83',
    targetAudience: 'Decisores B2B (C-Level, Directores de RR. HH., Facilities, Arquitectos) y Profesionales en Trabajo Híbrido',
    teamContext: 'Equipo de Marketing de 4 personas gestionando LinkedIn, Instagram, TikTok, Blog y E-mail en simultáneo (Encuesta Clima REG-009 y REG-010).',
    nngProfile: 'Seria con calidez humana · Formal-Ejecutiva pero accesible · Respetuosa · Factual y fundamentada',
    skills: TARANIS_SKILLS,
    kpis: [
      { label: 'Horas Liberadas / Mes', value: '~102 h/mes', sub: '>25 h/mes por cada uno de los 4 integrantes' },
      { label: 'Velocidad Multicanal', value: '-70 %', sub: 'De 6 horas a <1,5 h por campaña en 5 canales' },
      { label: 'Ahorro Diseño Freelance', value: '-60 %', sub: 'De 5 días de espera a <30 min in-house (Gem 06)' },
      { label: 'SLA Respuesta en Redes', value: '<15 min', sub: 'Antes >24h (<2h en escalamiento B2B humano)' }
    ],
    executiveSummary: {
      to: 'Directora Ejecutiva (CEO), Taranis Black',
      from: 'Julia Daniela Rodriguez (Estrategia de IA en Marketing)',
      subject: 'Plan de IA en Marketing: Escalamiento Multicanal, Dirección Visual y ROI Operativo',
      diagnosis: 'Nuestro equipo de Marketing (4 personas) gestiona LinkedIn, Instagram, TikTok, Blog y E-mail en simultáneo (encuesta REG-009), generando 3 dolores: inconsistencia en los 4 pilares de tono de voz, retrasos de 5 días por depender de freelancers gráficos y respuestas en redes >24 horas.',
      initiatives: [
        'Quick Win 1 (IA Generativa Texto): Suite de Skills/Gems (Tono, Guionista, Multiplicador, SEO) para adaptar artículos NR-17.',
        'Quick Win 2 (IA Visual): Estudio In-House (Gem 06) para crear imágenes arquitectónicas internamente en minutos.',
        'Proyecto Estratégico (IA Tradicional + Predictiva): Triaje automatizado en redes (<15 min) y Lead Scoring.'
      ],
      impact: 'Liberaremos ~102 h/mes (>25h/persona), reduciendo 70 % tiempos de producción, 60 % gasto freelance y respuesta en redes a <2h (+23 % consistencia de marca), bajo auditoría del Comité de IA y cumplimiento LGPD / Ley 25.326 (cero alucinaciones NR-17).'
    },
    ruta0Cases: [
      {
        id: 'caso-1',
        title: '1. Guardián del Tono de Voz y Multiplicador Multicanal («Taranis Content Engine»)',
        pain: 'Solo 4 personas mantienen 5 canales a la vez; el equipo vive «apagando incendios» (REG-009) y el tono de voz pierde consistencia.',
        aiType: 'IA Generativa de Texto (LLMs + RAG)',
        aiJustification: 'Exige comprender matices semánticos, auditar los 4 pilares con score 1-10 y redactar contenido nativo por red social.',
        hitl: 'Revisión editorial pre-publicación del especialista de marketing para verificar exactitud de normas NR-17, ABERGO e ISO 23351-1.',
        quadrant: 'Quick Win (Prioridad 1 — Mes 1)',
        hoursSaved: '48 h/mes'
      },
      {
        id: 'caso-2',
        title: '2. Estudio de Dirección Creativa y Activos Visuales In-House (Gem 06)',
        pain: 'Dependencia de diseñadores freelancers externos que tardan 4 a 5 días hábiles en entregar imágenes, frenando campañas.',
        aiType: 'IA Generativa Multimodal (Texto a Imagen)',
        aiJustification: 'Permite sintetizar escenas arquitectónicas en proporciones 4:5, 9:16 y 16:9 con protocolo Pensar → Generar en 7 bloques.',
        hitl: 'Curaduría de dirección de arte para validar fidelidad ergonómica (soporte lumbar 3D, brazos 4D) y diversidad humana real.',
        quadrant: 'Quick Win Creativo (Prioridad 2 — Mes 1-2)',
        hoursSaved: '24 h/mes'
      },
      {
        id: 'caso-3',
        title: '3. Triaje Automatizado en Redes (<24h) y Predicción de Campañas (Lead Scoring)',
        pain: 'Las respuestas en redes demoran más de 24 horas, enfriando prospectos B2B y compradores D2C.',
        aiType: 'IA Tradicional (Reglas) + IA Predictiva (Machine Learning)',
        aiJustification: 'Reglas deterministas responden precios, flete CIF/FOB y garantías con 100 % de exactitud; ML predice conversión de leads y pautas.',
        hitl: 'Escalamiento obligatorio a Consultor B2B humano (<2h) en cotizaciones corporativas (>30 posiciones) + auditoría mensual de sesgos.',
        quadrant: 'Proyecto Estratégico (Prioridad 3 — Meses 2-4)',
        hoursSaved: '30 h/mes'
      }
    ],
    pillars: [
      {
        id: 'p1',
        name: '1. Científico y fundamentado',
        definition: 'Basamos argumentos en biomecánica, laudos técnicos de NR-17, certificaciones ABERGO, normas ISO 23351-1 y estudios clínicos (Univ. de Pittsburgh, UC Irvine). Cero adjetivos vacíos.',
        exampleYes: 'La línea ErgoPro fue proyectada con soporte lumbar 3D dinámico que mantiene la alineación de las vértebras L4-L5 y S1 durante 8h de trabajo.',
        exampleNo: 'Esta silla es muy suave, cómoda y es la más revolucionaria del mercado.'
      },
      {
        id: 'p2',
        name: '2. Empático y humano',
        definition: 'Entendemos la fatiga estática (caída del 40 % de circulación lumbar tras 3h), el dolor cervical, la pérdida de foco en el open-space (23m15s) y el costo invisible del ausentismo (3x salario).',
        exampleYes: 'Invertir en ergonomía preventiva protege la salud de tu equipo y reduce el ausentismo por LER/DORT.',
        exampleNo: 'Ponte de pie para quemar calorías mientras trabajas y nunca más te quedes dormido frente a la computadora.'
      },
      {
        id: 'p3',
        name: '3. Sofisticado y premium',
        definition: 'Diseño minimalista, acabados nobles (aluminio pulido, roble FSC, mesh alemán) y vocabulario ejecutivo para hablar de igual a igual con C-Level, RR. HH., Facilities y Arquitectos.',
        exampleYes: 'Nuestras cabinas acústicas garantizan 32 dB de atenuación certificada ISO, creando islas de privacidad ejecutiva sin obras civiles.',
        exampleNo: 'Compra una caja de madera con vidrio para esconderte del ruido de tus compañeros y dejar tu rinconcito lindo.'
      },
      {
        id: 'p4',
        name: '4. Sencillo y accesible',
        definition: 'Traducimos ingeniería avanzada y normativa legal en claridad inmediata y ROI directo para la toma de decisiones, sin jerga médica hermética.',
        exampleYes: 'Con los escritorios elevables SmartDesk cambias de postura en menos de 10 segundos con un botón, elevando la energía cognitiva un 22 %.',
        exampleNo: '¡Aprovecha nuestra gran liquidación de sillas de oficina con descuento espectacular por tiempo limitado! ¡Compra AHORA!'
      }
    ],
    approvedWords: [
      'ergonomía activa', 'alternancia postural (Sit-Stand)', 'fatiga estática', 'exoesqueleto funcional',
      'conformidad integral NR-17', 'laudo ABERGO', 'atenuación acústica 32 dB ISO', 'estado de Flow',
      'retorno sobre la inversión (ROI)', 'Costo Total de Propiedad (TCO)', 'vértebras L4-L5 y S1', 'capital humano'
    ],
    forbiddenWords: [
      'rinconcito lindo', 'acogedor', 'liquidación', 'descuento espectacular', 'oferta imperdible',
      'compra ahora', 'última oportunidad', 'quemar calorías', 'esconderte del ruido',
      'caja de madera', 'milagroso', 'cura definitiva', 'barato', 'revolucionario'
    ],
    catalogRules: 'ErgoPro Executive (USD 3.490, garantía 5 años, hasta 150kg, laudo ABERGO/NR-17) | ErgoPro Specialist (USD 2.490, garantía 5 años, TCO < USD 1,90/día) | ErgoPro Core (USD 1.890) | SmartDesk Pro Dual 160 (USD 4.800, <43 dB, madera FSC) | SmartDesk Studio 140 (USD 3.600) | SmartDesk Compact 120 (USD 2.700) | Silence Quad 4p (USD 28.000, 32 dB ISO 23351-1, renovación aire 90s, LED 4000K) | Silence Duo 2p (USD 21.000) | Silence Solo (USD 14.500). Reglas B2B: Flete CIF gratis en pedidos > USD 35.000 (capitales Sur/Sudeste); Plazo Sur/Sudeste 5-8 días hábiles; Facturación 30/60/90 días; Personalización sin costo + bloques BIM en >30 posiciones.',
    knowledgeDocs: [
      {
        name: '03_Marketing_Articulo_base_y_guia_de_tono.pdf',
        type: 'PDF (Pre-cargado)',
        pages: 4,
        charCount: 8420,
        content: 'Artículo-Semente: La nueva frontera del Bem-Estar Corporativo: Cómo la Ergonomía Activa y la NR-17 Redefinen Retención, Foco y Productividad en el Trabajo Híbrido. 1. Coste oculto LER/DORT: hasta 3x salario mensual. 2. Fatiga estática: -40% circulación lumbar tras 3h; ErgoPro protege L4-L5 y S1. 3. Sit-Stand (Univ. Pittsburgh): +15% a 22% energía cognitiva en <10s con SmartDesk. 4. Acústica (UC Irvine): 23m15s para recuperar foco; cabinas Silence 32 dB ISO. 5. ROI y protección NR-17 con garantía 5 años.'
      },
      {
        name: '01_Catalogo_de_productos_y_precios_Taranis_Black.pdf',
        type: 'PDF (Pre-cargado)',
        pages: 3,
        charCount: 6850,
        content: 'Catálogo Oficial Taranis Black FY2026: Líneas ErgoPro (USD 1.890 a 3.490), SmartDesk (USD 2.700 a 4.800) y Silence (USD 14.500 a 28.000). Políticas B2B: Facturación 30/60/90 días, Flete CIF bonificado > USD 35.000 en capitales Sur/Sudeste, Laudo NR-17 individualizado firmado por Ingeniero de Seguridad y Ergonomista acreditado.'
      }
    ]
  },
  {
    id: 'penelope-skincare',
    name: 'Penélope · Belleza en Cuidar',
    tagline: 'Skincare Brasileño Accesible-Premium — Belleza como Autocuidado',
    industry: 'Cosméticos & Skincare D2C (Caso de Estudio del Curso)',
    accentColor: '#C2185B',
    targetAudience: 'Mujeres de 25 a 45 años (Personas: Camila 28 años y Renata 38 años) que buscan rutinas simples, transparentes y eficaces',
    teamContext: 'Marca del curso de Marketing de Contenidos con IA. Posee sus propias 6 Skills exclusivas creadas durante las clases.',
    nngProfile: 'Ligeramente relajada · Casual con inteligencia · Respetuosa · Entusiasmada sin exageración',
    skills: PENELOPE_SKILLS,
    kpis: [
      { label: 'Engagement Educativo', value: '3x', sub: 'Más guardados en posts de ingredientes que de venta' },
      { label: 'Crecimiento Segmento', value: '+18 %', sub: 'Crecimiento anual skincare en Brasil (ABIHPEC)' },
      { label: 'Regla de Oro Editorial', value: '3 : 1', sub: '3 contenidos de valor por cada post comercial' },
      { label: 'Consistencia Verbal', value: '+23 %', sub: 'Impacto en ingresos por coherencia de marca' }
    ],
    executiveSummary: {
      to: 'Dirección de Marca — Penélope Skincare',
      from: 'Julia Daniela Rodriguez (AI Content Architect)',
      subject: 'Ecosistema de Gems Penélope: Escalamiento de Contenido Educativo y Guardián de Tono',
      diagnosis: 'El mercado de belleza suele usar la inseguridad femenina como disparador de venta. Penélope necesita escalar contenido educativo sobre activos (ácido hialurónico, ceramidas, vitamina C) garantizando cero promesas milagrosas.',
      initiatives: [
        'Gem 01 & 02: Brainstorming por pilares (Educar 40%, Inspirar 30%, Involucrar 30%) y Guardián del Tono de Voz.',
        'Gem 03 & 04: Guionista de Reels/Carruseles y Multiplicador hacia Blog, E-mail, LinkedIn y Newsletter.',
        'Gem 05 & 06: Especialista SEO/GEO con búsqueda web y Director Creativo Visual (magenta #C2185B + piel real).'
      ],
      impact: 'Consistencia del 100 % en el posicionamiento «Belleza en Cuidar», pieles reales sin filtros plásticos y multiplicación multicanal automatizada.'
    },
    ruta0Cases: [
      {
        id: 'pen-1',
        title: '1. Guardián del Tono Empático y Multiplicador de Rutinas',
        pain: 'Riesgo de caer en clichés cosméticos («elimina imperfecciones», «anti-aging milagroso») al escalar redacción.',
        aiType: 'IA Generativa de Texto (LLMs)',
        aiJustification: 'Audita borradores del 1 al 10 bloqueando vocabulario que refuerce inseguridades.',
        hitl: 'Validación humana del equipo de contenido antes de publicar.',
        quadrant: 'Quick Win (Mes 1)',
        hoursSaved: '40 h/mes'
      }
    ],
    pillars: [
      {
        id: 'pen-p1',
        name: '1. Claridad ante todo',
        definition: 'Frases cortas, vocabulario accesible, ingredientes explicados de forma simple sin jerga química intimidante.',
        exampleYes: 'Este sérum hidrata sin pesar. El ácido hialurónico funciona mejor sobre la piel húmeda.',
        exampleNo: 'Activo biotecnológico de alta concentración para remodelación del contorno facial.'
      },
      {
        id: 'pen-p2',
        name: '2. Afecto sin exageración',
        definition: 'Cuidado genuino como una amiga de confianza, sin euforia artificial ni exceso de signos de exclamación.',
        exampleYes: 'Porque mereces una rutina que tenga sentido para ti, en tu tiempo.',
        exampleNo: '¡¡¡Nuestro nuevo hidratante va a dejar tu piel INCREÍBLE, corre a comprarlo YA!!!'
      },
      {
        id: 'pen-p3',
        name: '3. Autoridad ligera',
        definition: 'Educa antes de vender. Comparte ciencia del skincare como una recomendación entre amigas, sin dar cátedra.',
        exampleYes: 'Aplica el hidratante justo después de lavar el rostro, con la piel todavía húmeda.',
        exampleNo: 'Descubre la solución definitiva con resultados garantizados en 7 días.'
      },
      {
        id: 'pen-p4',
        name: '4. Posicionamiento con propósito',
        definition: 'Belleza como autocuidado, nunca como obligación ni corrección. Celebra la piel real con poros e historia.',
        exampleYes: 'Tu piel no necesita perfección. Necesita atención. Belleza en cuidar.',
        exampleNo: 'Elimina tus imperfecciones y esconde tus manchas con nuestra fórmula anti-aging.'
      }
    ],
    approvedWords: [
      'cuidar', 'rutina', 'tu piel', 'ingredientes transparentes', 'resultado real',
      'piel saludable', 'a tu manera', 'belleza en cuidar', 'autocuidado', 'amable', 'eficaz'
    ],
    forbiddenWords: [
      'imperfecciones', 'perfecta', 'perfección', 'elimina', 'corregir', 'esconder',
      'disimular', 'milagro', 'milagroso', 'revolucionario', 'resultados garantizados',
      'anti-aging', 'rejuvenecedor', 'compra ahora', 'última oportunidad'
    ],
    catalogRules: 'Sérum Ácido Hialurónico, Hidratante con Ceramidas, Sérum Vitamina C, Protector Solar Piel Oleosa. Ticket promedio R$ 80 a R$ 350. Paleta visual: Magenta (#C2185B), Blanco (#FFFFFF) y Lima-neón (#C6E62C). Fotografía: piel real con poros visibles, luz natural.',
    knowledgeDocs: [
      {
        name: 'PENELOPE_Tono_de_Voz_ES.txt',
        type: 'TXT (Pre-cargado)',
        pages: 1,
        charCount: 5200,
        content: 'Penélope habla como una amiga que entiende de skincare: cercana, honesta y empoderada. Nunca promete piel perfecta ni usa la inseguridad como disparador de venta.'
      }
    ]
  }
];
