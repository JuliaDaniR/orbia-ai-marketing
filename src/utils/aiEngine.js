import { compileSkillMarkdown } from '../data/initialSkills.js';

export const AI_PROVIDERS = [
  {
    id: 'local-sim',
    name: '⚡ Simulador Inteligente Local (Sin API Key · Solo Lectura)',
    models: ['respuestas-reales-validadas-v3'],
    requiresKey: false,
    description: 'Respuestas de muestra pre-validadas de cada Gem/Skill sin consumir saldo.'
  },
  {
    id: 'openrouter',
    name: '🌐 OpenRouter (Modelos Gratuitos :free & Multi-Proveedor)',
    models: [
      'nvidia/nemotron-3.5-lightning:free',
      'nvidia/nemotron-3.5-super-vl:free',
      'dots-studio/dots-3-note-preview:free',
      'xingchen-agi/xing4.0-29b-a4b:free',
      'recursive/flint-v1.0:free',
      'liquid/lfm-2.5-2.6b:free',
      'openrouter/free'
    ],
    requiresKey: true,
    keyPlaceholder: 'sk-or-v1-... (Clave gratuita en openrouter.ai/keys)',
    helpUrl: 'https://openrouter.ai/keys',
    description: 'Acceso a modelos de frontera y modelos 100 % gratuitos con etiqueta :free.'
  },
  {
    id: 'gemini',
    name: '✨ Google Gemini API (Google AI Studio)',
    models: [
      'gemini-3.8-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3-flash-preview',
      'gemini-2.5-flash'
    ],
    requiresKey: true,
    keyPlaceholder: 'AIzaSy... (Obtén tu clave en aistudio.google.com)',
    helpUrl: 'https://aistudio.google.com/app/apikey',
    description: 'Nuevos modelos Gemini Flash de última generación.'
  },
  {
    id: 'openai',
    name: '🧠 OpenAI API (GPT-4o & DALL-E 3)',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    requiresKey: true,
    keyPlaceholder: 'sk-proj-... (platform.openai.com/api-keys)',
    helpUrl: 'https://platform.openai.com/api-keys',
    description: 'Conecta tu OpenAI API Key para GPT-4o y generación con DALL-E 3.'
  },
  {
    id: 'groq',
    name: '🚀 Groq Cloud API (Llama 3.3 70B Ultra-Fast)',
    models: ['llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'],
    requiresKey: true,
    keyPlaceholder: 'gsk_... (console.groq.com/keys)',
    helpUrl: 'https://console.groq.com/keys',
    description: 'Inferencia ultra-rápida (500+ tokens/segundo) con modelos Open Source de frontera.'
  }
];

/**
 * Casos de prueba específicos por cada Skill
 */
export function getSkillSamplePrompts(skill, brand) {
  if (!skill) return [];
  const slug = (skill.slug || '').toLowerCase();
  const code = skill.code || '';
  const isPenelope =
    (brand?.id || '').includes('penelope') ||
    (brand?.name || '').toLowerCase().includes('penélope') ||
    (brand?.name || '').toLowerCase().includes('penelope') ||
    (skill?.id || '').startsWith('pen-') ||
    (skill?.name || '').toLowerCase().includes('penélope') ||
    (skill?.name || '').toLowerCase().includes('penelope') ||
    slug.includes('penelope');

  const isTaranis =
    (brand?.id || '') === 'taranis-black' ||
    (brand?.name || '').toLowerCase().includes('taranis') ||
    (skill?.id || '').startsWith('tar-') ||
    (skill?.name || '').toLowerCase().includes('taranis');

  const isCustomBrand = !isPenelope && !isTaranis;
  const brandName = brand?.name || 'la empresa';
  const brandTagline = brand?.tagline || 'Soluciones de alta calidad';
  const brandTarget = brand?.targetAudience || 'nuestro público objetivo';
  const brandIndustry = brand?.industry || 'nuestro sector';

  if (code === '00' || slug.includes('orquestador')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-orq-1',
          label: '🌸 Caso 1: Orquestar Campaña de Lanzamiento Sérum Vitamina C',
          prompt: 'Planifica la secuencia de skills y valida las reglas editoriales de Penélope para lanzar el nuevo Sérum Vitamina C en Instagram, E-mail y Blog.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-orq-1',
          label: `📩 Caso 1: Orquestar y Validar Solicitud de Cliente B2B (${brandName})`,
          prompt: `Hola ${brandName}, nos gustaría evaluar la implementación de sus soluciones para optimizar las operaciones de nuestro equipo de 40 colaboradores. ¿Cuál es su propuesta y metodología de adopción?`
        },
        {
          id: 'cust-orq-2',
          label: `📅 Caso 2: Planificar Campaña Multicanal para ${brandName}`,
          prompt: `Diseña la ruta de skills recomendada para publicar una campaña estratégica sobre ${brandTagline} en LinkedIn B2B, Instagram y Email.`
        }
      ];
    }
    return [
      {
        id: 'orq-1',
        label: '📩 Caso 1: Orquestar y Validar DM Urgente LinkedIn (80 Programadores)',
        prompt:
          'Hola Taranis Black, soy Director de RR. HH. de una empresa de software en São Paulo con 80 programadores. Tenemos un 15 % más de bajas médicas por dolor lumbar este trimestre y mucho ruido en las reuniones virtuales, pero mi CFO dice que sus sillas cuestan un 30 % más que las de las tiendas tradicionales. ¿Qué nos proponen y cuánto tardan en entregar?'
      },
      {
        id: 'orq-2',
        label: '📅 Caso 2: Planificar Pipeline para Campaña del Artículo-Semente NR-17',
        prompt:
          'Necesitamos programar la campaña mensual basada en el Artículo-Semente sobre Ergonomía Activa, método Sit-Stand y norma NR-17 para LinkedIn, Carrusel de Instagram y E-mail Marketing. Indica por qué secuencia de Skills debe pasar y valida las 6 reglas de gobernanza.'
      }
    ];
  }

  if (code === '01' || slug.includes('brainstorming')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-br-1',
          label: '❄️ Caso 1: 5 ideas de contenido para Penélope en invierno',
          prompt: 'Dame 5 ideas de contenido para Penélope en invierno variando formatos y pilares (Educar, Inspirar, Involucrar).'
        },
        {
          id: 'pen-br-2',
          label: '💧 Caso 2: Ideas de Skincare Simple para Camila (28) y Renata (38)',
          prompt: 'Genera 4 ideas estratégicas de contenido educativo sobre activos (ácido hialurónico, vitamina C) orientadas a Camila (28) y Renata (38) bajo la Regla de Oro 3:1.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-br-1',
          label: `💡 Caso 1: 4 Ideas Estratégicas para ${brandName} (${brandIndustry})`,
          prompt: `Genera 4 ideas estratégicas de contenido para ${brandName} enfocadas en resolver las principales necesidades de ${brandTarget} bajo la regla 3:1 (Educar, Inspirar e Involucrar).`
        },
        {
          id: 'cust-br-2',
          label: `📈 Caso 2: Ideas de Contenido de Autoridad en LinkedIn para ${brandName}`,
          prompt: `Propón 3 ideas de publicaciones ejecutivas para LinkedIn B2B posicionando a ${brandName} como referente en ${brandTagline}.`
        }
      ];
    }
    return [
      {
        id: 'br-1',
        label: '💡 Caso 1: Ideas B2B/D2C sobre Retorno Híbrido, Dolor Lumbar y Foco',
        prompt:
          'Genera 4 ideas estratégicas de contenido para Taranis Black enfocadas en reducir el ausentismo por dolor lumbar (NR-17), la alternancia postural Sit-Stand (SmartDesk) y el aislamiento acústico en oficinas híbridas (Silence).'
      },
      {
        id: 'br-2',
        label: '🏛️ Caso 2: Ideas para Arquitectos y Facilities en LinkedIn',
        prompt:
          'Necesito 3 ideas de publicaciones para LinkedIn dirigidas a estudios de arquitectura y gerentes de Facilities sobre especificación de cabinas acústicas Taranis Silence y bloques BIM.'
      }
    ];
  }

  if (code === '02' || slug.includes('guardian') || slug.includes('tono')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-gt-1',
          label: '❌ Caso 1: Auditar borrador con palabras prohibidas de Penélope',
          prompt:
            'Audita este texto: "¡ELIMINA tus imperfecciones con nuestra fórmula anti-aging revolucionaria! Resultados garantizados en 7 días para una piel perfecta. ¡Compra AHORA!"'
        },
        {
          id: 'pen-gt-2',
          label: '⚠️ Caso 2: Auditar copy comercial agresivo y poco empático',
          prompt:
            'Audita este borrador: "¡No dejes que los años arruinen tu rostro! Corre a comprar nuestro kit con descuento antes de que se agote."'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-gt-1',
          label: `❌ Caso 1: Auditar borrador comercial fuera de tono para ${brandName}`,
          prompt: `Audita y ajusta este borrador para asegurar que cumpla con los pilares de tono de ${brandName} y no contenga palabras prohibidas: "¡Compra YA nuestra solución barata, liquidación total antes de que se acabe!"`
        },
        {
          id: 'cust-gt-2',
          label: `⚠️ Caso 2: Auditar borrador técnico poco claro para ${brandTarget}`,
          prompt: `Audita este texto técnico para ${brandName} haciéndolo más empático, claro y convincente para decisores clave.`
        }
      ];
    }
    return [
      {
        id: 'gt-1',
        label: '❌ Caso 1: Auditar borrador comercial fuera de tono (Liquidación / Rinconcito)',
        prompt:
          'Audita y corrige este borrador antes de publicarlo: "¡Aprovecha nuestra gran liquidación de sillas y escritorios con descuento espectacular! Nuestra silla es muy suave y va a dejar tu rinconcito lindo y acogedor. Ponte de pie para quemar calorías mientras trabajas y compra una caja de madera con vidrio para esconderte del ruido. ¡Compra AHORA, última oportunidad!"'
      },
      {
        id: 'gt-2',
        label: '⚠️ Caso 2: Auditar post de LinkedIn superficial (Falta rigor científico)',
        prompt:
          'Audita este borrador para LinkedIn B2B: "En Taranis Black tenemos las mejores sillas y mesas del mercado para que tus empleados estén felices y cómodos en la oficina. Escríbenos para comprar."'
      }
    ];
  }

  if (code === '03' || slug.includes('guionista')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-gu-1',
          label: '🎬 Caso 1: Guion Reels 60s sobre aplicación de ácido hialurónico en piel húmeda',
          prompt: 'Crea un guion de Reels de 60 segundos sobre cómo aplicar hidratante con ácido hialurónico sobre la piel húmeda con gancho en los primeros 3 segundos.'
        },
        {
          id: 'pen-gu-2',
          label: '📱 Caso 2: Guion Carrusel Instagram (5 Slides) — Poros Reales y Piel Auténtica',
          prompt: 'Crea un guion de Carrusel de Instagram de 5 slides (formato 4:5) sobre por qué la piel real tiene textura y poros visibles, desafiando el filtro de Photoshop.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-gu-1',
          label: `🎬 Caso 1: Guion Reels / Video Corto (45s) para ${brandName}`,
          prompt: `Crea un guion de Reels de 45 segundos con gancho en los primeros 3 segundos mostrando cómo ${brandName} (${brandTagline}) optimiza las operaciones de ${brandTarget}.`
        },
        {
          id: 'cust-gu-2',
          label: `📱 Caso 2: Guion Carrusel (5 Slides 4:5) para ${brandName}`,
          prompt: `Diseña un carrusel educativo de 5 diapositivas que explique paso a paso las ventajas de ${brandTagline}.`
        }
      ];
    }
    return [
      {
        id: 'gu-1',
        label: '📱 Caso 1: Guion Carrusel IG (6 Slides) — ¿Qué pasa tras 3h sentado?',
        prompt:
          'Crea un guion de Carrusel de Instagram de 6 slides (formato 4:5) sobre la fatiga estática (caída del 40 % en circulación lumbar tras la 3.ª hora sentado) y cómo actúa el soporte lumbar 3D de Taranis ErgoPro.'
      },
      {
        id: 'gu-2',
        label: '🎬 Caso 2: Guion Reels / TikTok (45s) — Cambio Sit-Stand en <10 segundos',
        prompt:
          'Crea un guion de Reels/TikTok de 45 segundos mostrando cómo el escritorio elevable SmartDesk Pro Dual 160 cambia de postura en menos de 10 segundos (<43 dB) y eleva la energía cognitiva un 22 %.'
      }
    ];
  }

  if (code === '04' || slug.includes('multiplicador')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-mu-1',
          label: '🔄 Caso 1: Multiplicar Guion de Ácido Hialurónico (Blog + Email + LinkedIn + Newsletter)',
          prompt:
            'Transforma el guion educativo sobre aplicación de ácido hialurónico en piel húmeda en las 4 piezas completas de Penélope: 1) Artículo para Blog SEO con E-E-A-T, 2) E-mail Marketing educativo (<200 palabras, cierre "Con cuidado, Penélope"), 3) Post reflexivo para LinkedIn sobre Clean Beauty y 4) Newsletter íntima Cuidados de la Semana.'
        },
        {
          id: 'pen-mu-2',
          label: '✉️ Caso 2: Multiplicar Rutina Esencial de 3 Pasos a Carta Íntima de Domingo',
          prompt:
            'Adapta la rutina de 3 pasos (Limpiar suave, Sérum en piel húmeda y Crema barrera) en un email íntimo de autocuidado y un post reflexivo para LinkedIn sobre Clean Beauty.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-mu-1',
          label: `🔄 Caso 1: Multiplicar Artículo de ${brandName} a 3 Canales (LinkedIn + IG + Email)`,
          prompt: `Transforma nuestro artículo principal sobre "${brandTagline}" en las 3 adaptaciones completas para ${brandName}: Post de LinkedIn B2B, Carrusel de Instagram de 5 slides y E-mail Marketing para ${brandTarget}.`
        }
      ];
    }
    return [
      {
        id: 'mu-1',
        label: '🔄 Caso 1: Multiplicar el Artículo-Semente Oficial (LinkedIn + IG + Email)',
        prompt:
          'Transforma el Artículo-Semente oficial de Taranis Black Labs ("La nueva frontera del Bem-Estar Corporativo: Cómo la Ergonomía Activa y la NR-17 Redefinen Retención, Foco y Productividad en el Trabajo Híbrido") en las 3 adaptaciones completas: Post de LinkedIn B2B, Carrusel de Instagram de 6 slides y E-mail Marketing B2B.'
      }
    ];
  }

  if (code === '05' || slug.includes('seo')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-seo-1',
          label: '🔍 Caso 1: Estructura SEO & GEO para "Skincare simple para piel madura"',
          prompt:
            'Realiza la investigación de tendencias y estructura SEO + GEO (AI Overviews) en Google Brasil para un artículo educativo de Penélope sobre "rutina de skincare simple para piel madura con ácido hialurónico y vitamina C", incluyendo preguntas frecuentes (People Also Ask), título H1, meta descripción, H2/H3 y directrices E-E-A-T sin promesas irreales.'
        },
        {
          id: 'pen-seo-2',
          label: '❓ Caso 2: People Also Ask sobre orden de aplicación: Vitamina C vs Ácido Hialurónico',
          prompt:
            'Investiga y estructura las respuestas directas en 45 palabras para Google AI Overviews sobre cuál activo se aplica primero en una rutina matutina de skincare.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-seo-1',
          label: `🔍 Caso 1: Estructura SEO & GEO para "${brandTagline}"`,
          prompt: `Realiza la investigación y estructura SEO + GEO (AI Overviews) para posicionar un artículo pilar sobre "${brandTagline}" de ${brandName}, incluyendo People Also Ask, H1, Meta Description, H2/H3 y criterios E-E-A-T.`
        }
      ];
    }
    return [
      {
        id: 'seo-1',
        label: '🔍 Caso 1: Estructura SEO & GEO para "Ergonomía Activa y NR-17"',
        prompt:
          'Realiza la investigación y estructura SEO + GEO (AI Overviews) para posicionar un artículo pilar sobre "ergonomía activa y cumplimiento NR-17 en oficinas híbridas", incluyendo People Also Ask, H1, Meta Description, H2/H3 y criterios E-E-A-T.'
      }
    ];
  }

  if (code === '06' || slug.includes('director') || slug.includes('visual') || slug.includes('imagen')) {
    if (isPenelope) {
      return [
        {
          id: 'pen-vis-1',
          label: '🌸 Escena 1: Sérum Vitamina C Penélope en mármol con luz matinal (4:5)',
          prompt:
            'Genera el concepto visual y el prompt técnico en 7 bloques para el Sérum Vitamina C de Penélope en frasco minimalista con detalles en magenta (#C2185B) y lima (#C6E62C) sobre una encimera de baño con luz natural de mañana.'
        },
        {
          id: 'pen-vis-2',
          label: '✨ Escena 2: Retrato de mujer brasileña (30 años) con piel real y poros visibles (4:5)',
          prompt:
            'Genera el concepto visual y el prompt técnico en 7 bloques para un retrato editorial de primer plano de una mujer brasileña de 30 años con piel luminosa natural, poros reales visibles y sin filtros plásticos.'
        },
        {
          id: 'pen-vis-3',
          label: '🧴 Escena 3: Tarro de crema hidratante barrera en travertino con gotas de agua (16:9)',
          prompt:
            'Genera el concepto visual y el prompt técnico en 7 bloques para la Crema Barrera Reparadora de Penélope en tarro de vidrio esmerilado sobre piedra travertino natural con gotas de agua y ramitas de eucalipto.'
        }
      ];
    }
    if (isCustomBrand) {
      return [
        {
          id: 'cust-vis-1',
          label: `🎨 Escena 1: Fotografía de Entorno Profesional para ${brandName} (16:9)`,
          prompt: `Genera el concepto visual y el prompt técnico en 7 bloques para una fotografía profesional de alta gama representando a ${brandName} (${brandTagline}) en un espacio de trabajo moderno y minimalista.`
        }
      ];
    }
    return [
      {
        id: 'vis-1',
        label: '🪑 Escena 1: Silla Taranis ErgoPro Executive (Carrusel IG 4:5)',
        prompt:
          'Genera el concepto visual, el prompt técnico en 7 bloques y la imagen de producto de la silla Taranis ErgoPro Executive (malla termoplástica alemana negra mate, soporte lumbar 3D y base de aluminio pulido) en una oficina ejecutiva minimalista en São Paulo durante la hora dorada.'
      },
      {
        id: 'vis-detail',
        label: '🔍 Escena 2: Detalle Macro Soporte Lumbar 3D y Malla Alemana (1:1)',
        prompt:
          'Genera el concepto visual, prompt técnico en 7 bloques y activo de detalle macro del soporte lumbar 3D dinámico de la silla ErgoPro Specialist, resaltando la ingeniería biomecánica y el tejido termoplástico alemán.'
      },
      {
        id: 'vis-2',
        label: '💻 Escena 3: Escritorio Taranis SmartDesk Pro Dual 160 (16:9)',
        prompt:
          'Genera el concepto visual, el prompt técnico en 7 bloques y la imagen de producto del escritorio motorizado Taranis SmartDesk Pro Dual 160 (tapa de roble natural certificado FSC y columnas telescópicas en negro mate) en un home-office ejecutivo minimalista con ventanal a un jardín zen con luz matutina suave.'
      },
      {
        id: 'vis-3',
        label: '🔇 Escena 4: Cabina Acústica Taranis Silence Solo Phone Booth (16:9)',
        prompt:
          'Genera el concepto visual, el prompt técnico en 7 bloques y la imagen de producto de la cabina acústica individual Taranis Silence Solo (Phone Booth 1 persona, estructura en aluminio anodizado negro mate, vidrio acústico laminado, interior en fieltro gris antracita e iluminación LED cálida 4000K) instalada en el lobby arquitectónico de hormigón visto y plantas biofílicas de un estudio de arquitectura en Buenos Aires durante una noche lluviosa.'
      },
      {
        id: 'vis-showroom',
        label: '🏢 Escena 5: Showroom Corporativo Taranis en São Paulo (16:9)',
        prompt:
          'Genera el concepto visual, prompt técnico en 7 bloques y activo fotográfico del showroom corporativo Taranis Black en São Paulo, integrando la silla ErgoPro, escritorio SmartDesk y cabina Silence en un entorno arquitectónico minimalista con luz cálida de hora dorada.'
      }
    ];
  }

  if (code === '07' || slug.includes('triaje')) {
    if (isCustomBrand) {
      return [
        {
          id: 'cust-tr-1',
          label: `⚡ Caso 1: Consulta Comercial Entrante para ${brandName}`,
          prompt: `Consulta entrante: "Hola ${brandName}, estamos interesados en su propuesta de ${brandTagline} para nuestro equipo de 40 colaboradores pero queremos evaluar costos y tiempos de implementación. ¿Qué nos recomiendan?"`
        }
      ];
    }
    return [
      {
        id: 'tr-1',
        label: '⚡ Caso 1: DM LinkedIn — 80 Programadores + Objeción CFO Precio 30% mayor',
        prompt:
          'DM entrante en LinkedIn: "Hola Taranis Black, soy Director de RR. HH. de una empresa de software en São Paulo con 80 programadores. Tenemos un 15 % más de bajas médicas por dolor lumbar este trimestre y mucho ruido en las reuniones virtuales, pero mi CFO dice que sus sillas cuestan un 30 % más que las de las tiendas tradicionales. ¿Qué nos proponen y cuánto tardan en entregar?"'
      },
      {
        id: 'tr-2',
        label: '💳 Caso 2: Comentario/DM — Presupuesto CAPEX congelado por Finanzas (OBJ-02)',
        prompt:
          'DM entrante: "Somos una empresa SaaS de 110 colaboradores. Queremos renovar 50 puestos con SmartDesk y ErgoPro para retener desarrolladores, pero nuestro CFO congeló el presupuesto de CAPEX de este semestre."'
      }
    ];
  }

  if (code === '08' || slug.includes('roi') || slug.includes('diagnostico')) {
    if (isCustomBrand) {
      return [
        {
          id: 'cust-roi-1',
          label: `📊 Caso 1: Diagnóstico de Eficiencia y ROI para Cliente de ${brandName}`,
          prompt: `Genera un informe ejecutivo de Retorno de Inversión (ROI) y horas de productividad ganadas implementando las soluciones de ${brandName} (${brandTagline}) en un equipo de 30 personas.`
        }
      ];
    }
    return [
      {
        id: 'roi-1',
        label: '📊 Caso 1: Diagnóstico ROI para Fintech de 80 colaboradores en São Paulo',
        prompt:
          'Genera el Pre-Diagnóstico Ejecutivo de ROI Ergonómico y NR-17 para FinCloud Soluções (Fintech en São Paulo, 80 colaboradores en modelo híbrido, salario promedio USD 3.200/mes, aumento del 15 % en certificados médicos de columna y pérdida de foco por ruido en open-space).'
      }
    ];
  }

  return [
    {
      id: 'gen-1',
      label: `✨ Solicitud para ${skill.name}`,
      prompt: `Ejecuta la habilidad "${skill.name}" para ${brandName} (${brandTagline}) orientada a ${brandTarget}.`
    }
  ];
}

/**
 * Traduce conceptos de marca ficticios a descriptores físicos tangibles para modelos de difusión visual (Google Imagen 3, DALL-E 3, Flux)
 */
function translateBrandConceptsToPhysical(text) {
  let res = text || '';

  // Silence acoustic booths
  res = res.replace(
    /taranis silence solo|silence solo/gi,
    'standalone modern glass soundproof office privacy phone booth pod with sleek black matte aluminum frame, transparent acoustic glass door and warm 4000K interior LED light'
  );
  res = res.replace(
    /taranis silence duo|silence duo/gi,
    'modern 2-person soundproof acoustic office meeting booth pod with glass door, dark acoustic felt interior and warm interior LED light'
  );
  res = res.replace(
    /taranis silence quad|silence quad/gi,
    'large 4-person corporate soundproof acoustic meeting booth pod with clear glass walls, interior acoustic panels and warm 4000K interior LED lighting'
  );
  res = res.replace(/cabina acústica individual|phone booth 1 persona/gi, 'standalone soundproof office phone booth pod');
  res = res.replace(/cabina acústica|cabina/gi, 'soundproof acoustic privacy booth pod');

  // SmartDesk motorized desks
  res = res.replace(
    /taranis smartdesk compact 120|smartdesk compact 120|smartdesk compact/gi,
    'modern minimalist motorized height-adjustable standing desk with natural light oak solid wood top, bevel edge, and sleek matte black dual telescopic metal legs'
  );
  res = res.replace(
    /taranis smartdesk pro dual 160|smartdesk pro dual 160|smartdesk pro dual|smartdesk/gi,
    'modern dual-motor height-adjustable motorized sit-stand desk with solid natural FSC oak wood desktop and matte black telescopic columns'
  );
  res = res.replace(/escritorio elevable|escritorio motorizado/gi, 'motorized height-adjustable sit-stand desk');

  // ErgoPro chairs
  res = res.replace(
    /taranis ergopro executive|ergopro executive/gi,
    'high-end ergonomic executive task chair with black breathable mesh backrest, dynamic 3D lumbar support exoskeleton frame and polished aluminum 5-star wheeled base'
  );
  res = res.replace(
    /taranis ergopro specialist|ergopro specialist/gi,
    'high-performance ergonomic task chair with black breathable mesh and precision adjustable lumbar support'
  );
  res = res.replace(/taranis ergopro core|ergopro core/gi, 'minimalist ergonomic office chair with breathable black mesh');
  res = res.replace(/taranis black|taranis/gi, 'architectural minimalist high-performance');

  // Penélope skincare
  res = res.replace(
    /sérum vitamina c de penélope|sérum vitamina c|serum vitamina c/gi,
    'frosted glass cosmetic dropper bottle of golden Vitamin C facial serum with clean minimalist white label, magenta (#C2185B) and lime (#C6E62C) accent details'
  );
  res = res.replace(
    /crema hidratante barrera|crema barrera reparadora|crema hidratante|crema barrera/gi,
    'minimalist frosted glass jar of rich moisturizing facial barrier cream with clean white label and subtle magenta (#C2185B) accent'
  );
  res = res.replace(
    /ácido hialurónico|acido hialuronico/gi,
    'pure crystal water droplets and hydrating facial serum with clear glass dropper pipette resting on light travertine natural stone'
  );
  res = res.replace(
    /retrato editorial de mujer|mujer brasileña|piel real y poros visibles|piel real/gi,
    'close-up editorial beauty portrait of authentic 30-year-old Brazilian woman with radiant dewy bare skin, natural visible pores, soft morning window light, zero photoshop retouch'
  );
  res = res.replace(/penélope · belleza en cuidar|penélope/gi, 'clean beauty skincare');

  return res;
}

/**
 * Extrae y estructura el prompt visual en inglés desde los 7 bloques generados por el LLM
 */
export function extractPhysicalVisualPrompt(aiTextResponse, fallbackUserInput, brand) {
  const cleanText = aiTextResponse || '';

  // Extrae bloques específicos ignorando NEGATIVE PROMPT y JUSTIFICACIÓN
  const subjectMatch = cleanText.match(/(?:\[SUBJECT\]|\*\*\[SUBJECT\]\*\*:?)\s*([^\n\r]+(?:\n(?!\*|\n|\[)[^\n\r]+)*)/i);
  const settingMatch = cleanText.match(/(?:\[SETTING\]|\*\*\[SETTING\]\*\*:?)\s*([^\n\r]+(?:\n(?!\*|\n|\[)[^\n\r]+)*)/i);
  const lightingMatch = cleanText.match(/(?:\[LIGHTING\]|\*\*\[LIGHTING\]\*\*:?)\s*([^\n\r]+(?:\n(?!\*|\n|\[)[^\n\r]+)*)/i);
  const styleMatch = cleanText.match(/(?:\[STYLE\]|\*\*\[STYLE\]\*\*:?)\s*([^\n\r]+(?:\n(?!\*|\n|\[)[^\n\r]+)*)/i);
  const technicalMatch = cleanText.match(/(?:\[TECHNICAL\]|\*\*\[TECHNICAL\]\*\*:?)\s*([^\n\r]+(?:\n(?!\*|\n|\[)[^\n\r]+)*)/i);

  const parts = [];
  if (subjectMatch) parts.push(subjectMatch[1].trim());
  if (settingMatch) parts.push(settingMatch[1].trim());
  if (lightingMatch) parts.push(lightingMatch[1].trim());
  if (styleMatch) parts.push(styleMatch[1].trim());
  if (technicalMatch) parts.push(technicalMatch[1].trim());

  let prompt = parts.join(', ');
  if (!prompt || prompt.length < 25) {
    prompt = `${fallbackUserInput}, architectural photography, minimalist design, natural lighting, photorealistic 8k, clean background`;
  }

  // Limpieza de caracteres markdown y saltos redundantes
  prompt = prompt.replace(/\*+/g, '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();

  // Traduce nombres de marcas abstractas a objetos físicos tangibles reconocibles por modelos de difusión
  prompt = translateBrandConceptsToPhysical(prompt);

  return prompt.slice(0, 850);
}

/**
 * Genera una imagen NUEVA en vivo cuando se usa IA real en la Skill 06 (Director Creativo Visual):
 * 1) Modo Local: Devuelve activos de marca validados (Penélope para Penélope, Taranis para Taranis).
 * 2) Modo IA Real:
 *    - Si es Gemini: Invoca Google Imagen 3 (imagen-3.0-generate-002:predict) con el prompt físico en inglés.
 *    - Si es OpenAI: Invoca DALL-E 3.
 *    - Fallback: Síntesis visual en vivo Flux de alta definición.
 */
export async function generateDynamicVisualForSkill06({ skill, userInput, aiTextResponse, brand, aiConfig }) {
  const slug = (skill?.slug || '').toLowerCase();
  const isVisualSkill =
    skill?.code === '06' || slug.includes('director') || slug.includes('visual') || slug.includes('imagen');
  if (!isVisualSkill) return [];

  const isPenelopeBrand =
    (brand?.id || '').includes('penelope') ||
    (brand?.name || '').toLowerCase().includes('penélope') ||
    (brand?.name || '').toLowerCase().includes('penelope') ||
    slug.includes('penelope');

  // A. MODO SIMULACIÓN LOCAL (Sin API Key): devuelve el activo visual específico para el caso probado
  if (aiConfig.provider === 'local-sim' || !aiConfig.apiKey?.trim()) {
    const lower = (userInput || '').toLowerCase();

    // 1. Si la marca es Penélope Skincare:
    if (isPenelopeBrand) {
      if (lower.includes('retrato') || lower.includes('mujer') || lower.includes('piel real') || lower.includes('poros') || lower.includes('rostro')) {
        return [
          {
            src: './assets/penelope_05_radiant_portrait.jpg',
            title: 'Penélope · Retrato Editorial Piel Real (30 años)',
            caption: 'Piel real brasileña con poros visibles y textura natural sin retoque de Photoshop (Paleta #C2185B).'
          }
        ];
      }
      if (lower.includes('crema') || lower.includes('barrera') || lower.includes('tarro') || lower.includes('hidratante')) {
        return [
          {
            src: './assets/penelope_04_moisturizer_cream.jpg',
            title: 'Penélope · Crema Barrera Reparadora',
            caption: 'Frasco de vidrio esmerilado con detalles lima (#C6E62C) y magenta (#C2185B) sobre travertino.'
          }
        ];
      }
      if (lower.includes('agua') || lower.includes('hialurónico') || lower.includes('gotas') || lower.includes('travertino')) {
        return [
          {
            src: './assets/penelope_02_water_hydration.jpg',
            title: 'Penélope · Gotas de Agua & Activos Puros',
            caption: 'Gotas de agua purificada, manzanilla y aloe vera reposando sobre piedra travertino natural.'
          }
        ];
      }
      return [
        {
          src: './assets/penelope_serum_cuidar.jpg',
          title: 'Penélope · Sérum Vitamina C Hidratante (Caso de Estudio del Curso)',
          caption: 'Fotografía editorial de skincare consciente · Paleta Magenta (#C2185B) + Lima (#C6E62C) con luz natural de mañana.'
        }
      ];
    }

    // 2. Si es Taranis Black:
    if (lower.includes('lumbar') || lower.includes('columna') || lower.includes('malla') || lower.includes('exoesqueleto')) {
      return [
        {
          src: './assets/04_lumbar_detail.jpg',
          title: 'Taranis ErgoPro — Soporte Lumbar 3D Dinámico (Detalle Macro)',
          caption: 'Exoesqueleto funcional en malla termoplástica alemana con laudo ABERGO / NR-17.'
        }
      ];
    }
    if (lower.includes('showroom') || lower.includes('oficina') || lower.includes('espacio') || lower.includes('estudio')) {
      return [
        {
          src: './assets/05_showroom.jpg',
          title: 'Showroom Corporativo Taranis Black (São Paulo)',
          caption: 'Perspectiva arquitectónica completa en hora dorada con luz natural 4000K.'
        }
      ];
    }
    if (lower.includes('smartdesk') || lower.includes('escritorio') || lower.includes('sit-stand')) {
      return [
        {
          src: './assets/02_smartdesk_sitstand.jpg',
          title: 'Taranis SmartDesk Pro Dual 160 — Alternancia Postural Sit-Stand (Demo Pre-generada)',
          caption: 'Tapa de roble FSC con motor dual silencioso (<43 dB) para alternancia en <10s.'
        }
      ];
    }
    if (lower.includes('silence') || lower.includes('cabina') || lower.includes('booth')) {
      return [
        {
          src: './assets/03_silence_quad_booth.jpg',
          title: 'Taranis Silence Quad (4 Lugares) — Isla Acústica 32 dB ISO (Demo Pre-generada)',
          caption: 'Aislamiento acústico de 32 dB ISO 23351-1 con renovación de aire cada 90s.'
        }
      ];
    }
    return [
      {
        src: './assets/01_ergopro_executive.jpg',
        title: 'Taranis ErgoPro Executive — Soporte Lumbar 3D (Demo Pre-generada)',
        caption: 'Silla ejecutiva de alta performance con soporte lumbar 3D y laudo ABERGO / NR-17.'
      }
    ];
  }

  // B. MODO IA REAL CON API KEY: ¡Genera una imagen NUEVA específica para el prompt que escribió el usuario!
  const visualPrompt = extractPhysicalVisualPrompt(aiTextResponse, userInput, brand);

  // Intento 1: Si usa Gemini API Key, invoca Google Imagen 3 (imagen-3.0-generate-002)
  if (aiConfig.provider === 'gemini' && aiConfig.apiKey?.trim()) {
    try {
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${aiConfig.apiKey.trim()}`;
      const res = await fetch(imagenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: visualPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            outputMimeType: 'image/jpeg'
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          return [
            {
              src: `data:image/jpeg;base64,${b64}`,
              title: `✨ Fotografía Fotorrealista Generada por Google Imagen 3 (${brand.name})`,
              caption: `Motor: Google Imagen 3 (imagen-3.0-generate-002) · Prompt: "${visualPrompt.slice(0, 160)}..."`
            }
          ];
        }
      }
    } catch {
      // Si el proyecto de la key no tiene activado Imagen 3, continúa al fallback
    }
  }

  // Intento 2: Si usa OpenAI API Key, invoca DALL-E 3
  if (aiConfig.provider === 'openai' && aiConfig.apiKey?.trim()) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${aiConfig.apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: visualPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      });
      if (res.ok) {
        const data = await res.json();
        const url = data?.data?.[0]?.url;
        if (url) {
          return [
            {
              src: url,
              title: `🧠 Fotografía Generada en Vivo por OpenAI DALL-E 3 (${brand.name})`,
              caption: `Motor: DALL-E 3 · Prompt: "${visualPrompt.slice(0, 160)}..."`
            }
          ];
        }
      }
    } catch {
      // Continúa al fallback
    }
  }

  // Intento 3: Motor Generativo Visual en Vivo (Flux High-Definition) con descriptores físicos traducidos
  const seed = Math.floor(Math.random() * 999999);
  const liveImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    visualPrompt
  )}?width=1024&height=768&nologo=true&model=flux&seed=${seed}`;

  return [
    {
      src: liveImageUrl,
      title: `🎨 Fotografía Sintetizada en Vivo para: "${userInput.slice(0, 60)}..."`,
      caption: `Generada a partir del Prompt Físico de 7 Bloques de ${aiConfig.provider.toUpperCase()} (${aiConfig.model}).`
    }
  ];
}

export function analyzeToneLive(text, brand) {
  const lower = (text || '').toLowerCase();
  const detectedForbidden = (brand.forbiddenWords || []).filter((w) => w && lower.includes(w.toLowerCase()));
  const detectedApproved = (brand.approvedWords || []).filter((w) => w && lower.includes(w.toLowerCase()));

  let score = 8;
  score -= detectedForbidden.length * 2;
  score += Math.min(2, detectedApproved.length);
  if (!text || text.trim().length < 15) score = 0;
  else score = Math.max(1, Math.min(10, score));

  const passedGatekeeper = score >= 9 && detectedForbidden.length === 0;

  return {
    score,
    detectedForbidden,
    detectedApproved,
    passedGatekeeper
  };
}

export function getSampleDraftsForBrand(brand) {
  if (brand.id === 'taranis-black') {
    return [
      {
        label: '❌ Prueba 1: Borrador Fuera de Tono (Con vocabulario prohibido)',
        text: '¡Aprovecha nuestra gran liquidación de sillas de oficina con descuento espectacular! Esta silla es muy suave y va a dejar tu rinconcito lindo y acogedor. Ponte de pie en la mesa para quemar calorías y compra una caja de madera para esconderte del ruido. ¡Compra ahora, última oportunidad!'
      },
      {
        label: '⚠️ Prueba 2: Borrador Intermedio (Falta rigor científico NR-17)',
        text: 'Nuestras sillas ErgoPro y escritorios SmartDesk son excelentes para trabajar cómodo en la oficina o en casa. Ayudan a cuidar la postura durante el trabajo híbrido. ¡Compra ahora en nuestro sitio!'
      },
      {
        label: '✅ Prueba 3: Texto Alineado 10/10 (Tono Oficial Taranis Black)',
        text: 'Invertir en ergonomía activa es una estrategia de retorno sobre la inversión (ROI) directo: la línea ErgoPro actúa como un exoesqueleto funcional que protege las vértebras L4-L5 y S1 con conformidad integral NR-17 y laudo ABERGO, mientras nuestras cabinas garantizan atenuación acústica 32 dB ISO para proteger el estado de Flow.'
      }
    ];
  }

  if (brand.id === 'penelope-skincare') {
    return [
      {
        label: '❌ Prueba 1: Borrador Fuera de Tono (Inseguridad y promesas irreales)',
        text: '¡Elimina tus imperfecciones con nuestra fórmula anti-aging revolucionaria! Resultados garantizados en 7 días para una piel perfecta sin arrugas. ¡Compra AHORA, última oportunidad!'
      },
      {
        label: '⚠️ Prueba 2: Borrador Superficial (Falta educación de activos)',
        text: 'Nuestros productos de skincare son lindos y te van a gustar mucho para tu rutina. Pruébalos hoy.'
      },
      {
        label: '✅ Prueba 3: Texto Alineado 10/10 (Tono Oficial Penélope)',
        text: 'Tu piel no necesita perfección, necesita atención. Porque cuidar es un acto de afecto diario, nuestro hidratante con ácido hialurónico retiene el agua cuando lo aplicas sobre la piel todavía húmeda. Belleza en cuidar.'
      }
    ];
  }

  return [
    {
      label: '📝 Borrador de prueba estándar',
      text: `En ${brand.name} trabajamos para ofrecer soluciones de calidad a ${brand.targetAudience}.`
    }
  ];
}

export async function executeSkillWithAI({ skill, userInput, brand, aiConfig, targetLanguage = 'es' }) {
  const baseSystemPrompt = compileSkillMarkdown(skill, brand);
  const { provider, model, apiKey } = aiConfig;

  const langDirectives = {
    es: 'IDIOMA OBLIGATORIO DE RESPUESTA: ESPAÑOL NEUTRO PROFESIONAL (LATAM). Prohibido responder en portugués o portuñol. Redacta toda la respuesta, títulos y explicaciones en español impecable, preservando intactos únicamente los nombres oficiales de productos (ErgoPro, SmartDesk, Silence) y términos técnicos/normativos (NR-17, ABERGO, ISO 23351-1, LGPD).',
    pt: 'IDIOMA OBRIGATÓRIO DE RESPOSTA: PORTUGUÊS CORPORATIVO IMPECÁVEL (BRASIL). Redija toda a resposta, títulos e justificativas em português executivo formal e natural, preservando as nomenclaturas de produto e conformidades legais.',
    en: 'MANDATORY OUTPUT LANGUAGE: GLOBAL B2B EXECUTIVE ENGLISH. Provide all responses, headings, arguments, and justifications strictly in professional business English, preserving official product names and technical compliance standards.'
  };

  const systemPrompt = `${baseSystemPrompt}

============================================================
DIRECTRIZ DE IDIOMA Y PROFUNDIDAD EJECUTIVA OBLIGATORIA:
============================================================
${langDirectives[targetLanguage] || langDirectives.es}

PROFUNDIDAD, EXHAUSTIVIDAD Y ESTRUCTURA:
- Desarrolla cada sección con máxima exhaustividad profesional y rigor corporativo. No sintetices ni omitas detalles.
- Incluye argumentos biomecánicos completos, cifras de retorno sobre inversión (TCO diario < USD 1,90, 5 años de garantía, ausentismo 3x salario, tiempos de entrega y flete CIF), y justificaciones estratégicas completas.
- Formatea la salida en Markdown enriquecido con títulos (###), viñetas estructuradas y checklists [✅] para la auditoría de gobernanza.`;

  // 1. MODO CON API KEY REAL
  if (provider !== 'local-sim' && apiKey && apiKey.trim() !== '') {
    if (provider === 'gemini') {
      let cleanModel = (model || 'gemini-3.8-flash').replace(/^models\//, '');
      if (cleanModel === 'gemini-2.5-pro' || cleanModel === 'gemini-1.5-pro' || !cleanModel) {
        cleanModel = 'gemini-3.8-flash';
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userInput }] }],
          generationConfig: { maxOutputTokens: 4096, temperature: 0.5 }
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Error HTTP ${res.status} al conectar con Google Gemini API`);
      }
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textOutput = parts.map((p) => p.text || '').join('').trim();
      if (!textOutput) {
        throw new Error('El modelo de Gemini no devolvió texto en esta solicitud. Intenta con gemini-3.8-flash.');
      }
      return textOutput;
    }

    if (provider === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
          'X-Title': 'Taranis AI Marketing OS'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          max_tokens: model.includes('openrouter/free') ? 2048 : 4096,
          temperature: 0.5
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Error HTTP ${res.status} al conectar con OpenRouter`);
      }

      const data = await res.json();
      if (data?.error) {
        throw new Error(data.error.message || `Error en la respuesta de OpenRouter: ${JSON.stringify(data.error)}`);
      }

      const choice = data?.choices?.[0];
      let reply = '';

      if (typeof choice?.message?.content === 'string' && choice.message.content.trim()) {
        reply = choice.message.content;
      } else if (Array.isArray(choice?.message?.content)) {
        reply = choice.message.content.map((p) => (typeof p === 'string' ? p : p.text || '')).join('');
      } else if (choice?.message?.reasoning) {
        reply = choice.message.reasoning;
      } else if (choice?.text) {
        reply = choice.text;
      }

      if (!reply.trim()) {
        // En lugar de fallar o dejar pantalla en blanco, simulamos la respuesta contextual de la skill
        return await simulateSkillExecution({ skill, userInput, brand, targetLanguage });
      }

      return reply.trim();
    }

    if (provider === 'openai' || provider === 'groq') {
      const endpoint =
        provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : 'https://api.groq.com/openai/v1/chat/completions';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          max_tokens: 4096,
          temperature: 0.5
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Error HTTP ${res.status} al conectar con ${provider.toUpperCase()}`);
      }
      const data = await res.json();
      const out = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
      if (!out || out.trim() === '' || out === 'Sin respuesta del modelo.') {
        return await simulateSkillExecution({ skill, userInput, brand, targetLanguage });
      }
      return out.trim();
    }
  }

  // 2. SIMULADOR INTELIGENTE LOCAL — RESPUESTAS REALES PRE-VALIDADAS DE CADA SKILL
  await new Promise((r) => setTimeout(r, 380));
  const liveAudit = analyzeToneLive(userInput, brand);
  const slug = (skill.slug || '').toLowerCase();
  const code = skill.code || '';

  // CASO ESPECIAL: PENÉLOPE SKINCARE (CURSO)
  const isPenelopeBrand =
    (brand?.id || '').includes('penelope') ||
    (brand?.name || '').toLowerCase().includes('penélope') ||
    (brand?.name || '').toLowerCase().includes('penelope') ||
    slug.includes('penelope');

  if (isPenelopeBrand) {
    if (code === '01' || slug.includes('brainstorming')) {
      return `💡 BRAINSTORMING ESTRATÉGICO DE CONTENIDO — PENÉLOPE · BELLEZA EN CUIDAR
(Protocolo Oficial del Curso · Segmentación por Personas: Camila 28 años y Renata 38 años · Regla de Oro 3:1)

---
• Idea 1: Ácido hialurónico en piel seca vs. piel húmeda: La diferencia que nadie te contó
- Formato: Reels de 60 segundos (Proporción 9:16)
- Pilar Editorial: Educar (40 %)
- Persona: Camila (28 años, busca practicidad y entender el porqué de los ingredientes)
- Gancho (0-3s): "¿Por qué tu sérum hidratante parece que no funciona? Quizás lo estás aplicando sobre la piel completamente seca."
- Ángulo Estratégico y Justificación: Desmitifica un error cotidiano de aplicación sin juzgar a la usuaria. Enseña que el ácido hialurónico actúa como un imán que necesita moléculas de agua para retener hidratación. Refuerza el pilar 'Claridad ante todo' con demostración práctica en video.

---
• Idea 2: Poros reales tienen textura: Desafiando el filtro de Instagram
- Formato: Carrusel de 5 slides (Proporción 4:5)
- Pilar Editorial: Inspirar (30 %)
- Persona: Renata (38 años, cansada de promesas anti-aging imposibles y pieles plásticas)
- Gancho (Slide 1): "Tu piel respira, reacciona y vive. La textura no es un defecto que debas esconder."
- Ángulo Estratégico y Justificación: Conecta directamente con el pilar 'Posicionamiento con propósito', celebrando la piel brasileña auténtica con poros visibles y líneas de expresión naturales. Cero retoque plástico, generando identificación y alto volumen de guardados.

---
• Idea 3: Rutina de 3 pasos para mañanas con prisa
- Formato: Stories Interactivos con encuestas de paso a paso
- Pilar Editorial: Involucrar (30 %)
- Persona: Camila y Renata en días de trabajo híbrido
- Gancho: "¿Cuánto tiempo real le dedicas a tu rostro al despertar? Menos de 3 minutos es todo lo que necesitas."
- Ángulo Estratégico y Justificación: Aterriza el skincare a la vida real: limpiar suavemente, hidratar en piel húmeda y proteger con FPS. Fomenta respuestas en DMs y participación activa de la comunidad.

---
• Idea 4: Barrera cutánea en invierno: Señales de que tu piel te pide calma
- Formato: Artículo para Blog SEO + E-mail Marketing educativo
- Pilar Editorial: Educar (40 %)
- Gancho: "Si tu piel arde al ponerte crema o se siente tirante, no necesitas exfoliar más: necesitas reparar tu barrera."
- Ángulo Estratégico y Justificación: Explica la función de las ceramidas y lípidos naturales sin tecnicismos intimidantes, posicionando la Crema Hidratante Barrera de Penélope como un aliado de confort diario.

---
• Idea 5: Carta de domingo: Menos pasos, más presencia
- Formato: Newsletter íntima 'Cuidados de la Semana'
- Pilar Editorial: Inspirar (30 %)
- Gancho: "El autocuidado no es una lista de tareas pendientes que tachar antes de dormir."
- Ángulo Estratégico y Justificación: Fortalece el vínculo emocional y la voz cercana de Penélope como una amiga de confianza que invita a desacelerar.`;
    }

    if (code === '02' || slug.includes('guardian') || slug.includes('tono')) {
      return `🛡️ DIAGNÓSTICO DE TONO DE VOZ — PENÉLOPE · BELLEZA EN CUIDAR
(Auditoría Integral bajo los 4 Pilares Verbales de Marca y Guardrails Éticos)

• Calificación de Alineación del Borrador: ${liveAudit.score}/10 ${
        liveAudit.passedGatekeeper ? '(🟢 APROBADO PARA PUBLICACIÓN)' : '(🔴 RECHAZADO — REQUIERE REESCRITURA OBLIGATORIA)'
      }

---
• AUDITORÍA DE LOS 4 PILARES:
1. Claridad ante todo (9/10): Frases cortas y lenguaje accesible sin tecnicismos intimidantes ni jerga médica hermética.
2. Afecto sin exageración (8/10): Comunicación empática y cercana como una amiga que sabe de skincare, sin euforia artificial ni exceso de exclamaciones.
3. Autoridad ligera (9/10): Educa sobre el funcionamiento biológico de los activos antes de vender.
4. Posicionamiento con propósito (10/10): La belleza es celebrada como un ritual de autocuidado diario, jamás como una obligación estética ni corrección de defectos.

---
• DESVÍOS IDENTIFICADOS EN EL BORRADOR:
${
  liveAudit.detectedForbidden.length > 0
    ? liveAudit.detectedForbidden
        .map(
          (w) =>
            `- Término prohibido detectado: «${w}» → Penélope jamás utiliza el miedo al envejecimiento, la culpa o promesas de 'eliminar imperfecciones'. La belleza es cuidado, no una cirugía correctiva.`
        )
        .join('\n')
    : '- No se detectaron palabras de la lista roja, pero se eliminó el sentido de urgencia comercial agresiva para priorizar el afecto y la transparencia.'
}

---
• VERSIÓN REESCRITA EN TONO OFICIAL PENÉLOPE (CALIFICACIÓN 10/10):
«Tu piel no necesita perfección, necesita atención. Porque cuidar es un acto diario de afecto con una misma, nuestro Sérum Hidratante con ácido hialurónico y vitamina C acompaña la luminosidad natural de tu rostro, a tu propio ritmo. Cuando lo aplicas con la piel todavía húmeda, retiene el agua en las capas superficiales y te brinda frescura inmediata que dura todo el día, sin sensación pesada ni promesas irreales. Descubre el placer de una rutina simple que te hace bien. Con cuidado, Penélope · Belleza en cuidar.»`;
    }

    if (code === '03' || slug.includes('guionista')) {
      return `🎬 GUION DE REELS / TIKTOK (60 SEGUNDOS) — PENÉLOPE · BELLEZA EN CUIDAR
Título: La regla de oro del ácido hialurónico en piel húmeda
Formato: Video Vertical (9:16) · Duración: 60 segundos
Protagonista: Mujer brasileña (30 años), piel real y luminosa con textura visible (cero filtro plástico)
Escenario: Baño contemporáneo y cálido con luz natural de mañana filtrada por ventana

---
• BLOQUE 1: GANCHO EN LOS PRIMEROS 3 SEGUNDOS (0:00 - 0:03)
Visual: La protagonista mira a cámara con el rostro recién lavado con agua tibia, toalla suave apoyada sobre el hombro sin frotar.
Texto en pantalla: "¡No seques tu rostro todavía! 💧"
Audio / Voz en off: "Si aplicas tu sérum hidratante sobre la piel completamente seca... estás perdiendo la mitad de sus beneficios."

• BLOQUE 2: EL PROBLEMA Y LA BIOMECÁNICA SIMPLE (0:03 - 0:22)
Visual: Primer plano de la piel con microgotas de agua visibles. La protagonista toma el frasco de Sérum Penélope.
Texto en pantalla: "Ácido hialurónico = Imán de agua 🧲"
Audio: "El ácido hialurónico es como una esponja molecular: puede retener hasta mil veces su peso en agua. Pero necesita agua para atraparla. Si tu piel está seca, busca esa humedad en las capas profundas de tu propio rostro."

• BLOQUE 3: DEMOSTRACIÓN PRÁCTICA DEL RITUAL (0:22 - 0:45)
Visual: Deja caer 3 gotas doradas del gotero de vidrio esmerilado en las yemas y realiza toques suaves ascendentes.
Texto en pantalla: "3 gotas + piel húmeda = absorción profunda ✨"
Audio: "Deja tu rostro ligeramente húmedo tras lavarlo. Tres gotas, toques suaves en mejillas y frente... y siente cómo se absorbe en segundos sin dejar textura pegajosa."

• BLOQUE 4: CIERRE Y CTA SUAVE CON PROPÓSITO (0:45 - 1:00)
Visual: Sonrisa genuina frente al espejo, plano detalle del frasco Penélope con acentos magenta (#C2185B) y lima (#C6E62C).
Texto en pantalla: "Belleza en cuidar 🌸"
Audio: "Una rutina simple que respeta tu tiempo. Cuéntame en comentarios: ¿cómo aplicabas tu sérum hasta hoy? Guarda este video para tu rutina de mañana. Con cuidado, Penélope."

---
• COPY SUGERIDO PARA EL POST:
¿Sabías que el secreto de una piel luminosa está en cómo preparas la superficie antes de hidratar? El ácido hialurónico ama el agua: aplícalo siempre sobre la piel húmeda y sella con tu crema hidratante favorita. 

Cuéntanos en comentarios cómo es tu ritual de mañana 👇
#SkincareConsciente #PielReal #BellezaEnCuidar #AcidoHialuronico #RutinaSimple #PenelopeSkincare`;
    }

    if (code === '04' || slug.includes('multiplicador')) {
      return `🔄 MULTIPLICACIÓN MULTICANAL COMPLETADA — PENÉLOPE · BELLEZA EN CUIDAR
(De 1 Guion Técnico a 4 Piezas Nativas para Blog, E-mail, LinkedIn y Newsletter)

---
1. ARTÍCULO PARA BLOG SEO & GEO (E-E-A-T):
• Título H1: Ácido Hialurónico en Piel Húmeda: La Guía Definitiva de Hidratación Consciente
• Meta Description: Descubre por qué aplicar tu sérum sobre la piel húmeda multiplica su absorción y aprende una rutina simple de 3 pasos con ingredientes transparentes.
• Estructura de Contenido:
  - H2: ¿Cómo funciona realmente el ácido hialurónico en la piel?
  - H2: El error común de aplicar activos hidratantes en piel seca
  - H2: Paso a paso para potenciar tu barrera cutánea sin complicaciones
  - H2: Belleza en Cuidar: La filosofía del autocuidado sin filtros irreales
• Criterio GEO: Respuestas directas de 45 palabras formuladas para Google AI Overviews.

---
2. E-MAIL MARKETING EDUCATIVO (<200 PALABRAS):
• Asunto: ¿Piel seca o piel húmeda? El detalle que lo cambia todo
• Remitente: Penélope · Belleza en Cuidar <hola@penelopeskincare.com.br>
• Cuerpo del Mensaje:
Hola Camila,

A veces el secreto de una piel luminosa y flexible no es sumar un producto nuevo a tu estante, sino cambiar un pequeño gesto en la rutina que ya tienes.

Cuando aplicas tu sérum hidratante con el rostro todavía húmedo después de lavarlo, el ácido hialurónico atrapa esas gotas de agua y las fija profundamente en tu piel. El resultado: hidratación que se siente ligera, fresca y presente durante todo el día.

Menos pasos, más atención a lo que sientes.

Con cuidado,
Penélope
[BOTÓN CTA: Conocer el Sérum Hidratante Penélope]

---
3. PUBLICACIÓN REFLEXIVA PARA LINKEDIN B2B / INDUSTRIA:
• Titular: El auge del 'Clean Beauty' en Brasil: cuando la transparencia supera a las promesas milagrosas.
• Contenido: El mercado de cosméticos en Brasil crece a tasas superiores al 18 % anual (ABIHPEC), impulsado por consumidoras que ya no compran promesas anti-aging imposibles ni pieles plastificadas por filtros. Las marcas que lideran la retención y el engagement son aquellas que educan con ciencia accesible y promueven el autocuidado genuino. En Penélope, la regla de oro 3:1 (tres contenidos de valor por cada post de producto) demostró triplicar el engagement educativo frente a la publicidad tradicional.

---
4. NEWSLETTER ÍNTIMA — CUIDADOS DE LA SEMANA:
• Asunto: Carta de domingo: Menos pasos, más presencia
• Mensaje: Querida Renata, esta semana queremos recordarte que tu piel no necesita perfección ni corrección constante. Tu piel tiene memoria, responde a tus emociones y te acompaña en cada momento. Dedicarte 3 minutos cada mañana para respirar y cuidar tu rostro no es vanidad: es un recordatorio de que tú eres tu prioridad. Que tengas una semana llena de calma y afecto.`;
    }

    if (code === '05' || slug.includes('seo')) {
      return `🔍 ESTRUCTURA SEO EDITORIAL & GEO (AI OVERVIEWS) — PENÉLOPE · BELLEZA EN CUIDAR
(Investigación de Tendencias en Google Brasil · Directrices E-E-A-T y Cero Keyword Stuffing)

---
• INVESTIGACIÓN DE TENDENCIAS EN BRASIL:
- Palabra clave principal: "rotina simples skincare pele madura" (+45 % de aumento anual en búsquedas en Brasil).
- Palabras clave secundarias: "como usar ácido hialurônico rosto úmido", "vitamina c pele sensível", "skincare sem promessas milagrosas".

---
• DIAGNÓSTICO DE PEOPLE ALSO ASK (PREGUNTAS FRECUENTES):
1. ¿Qué se aplica primero, la vitamina C o el ácido hialurónico?
2. ¿Es malo secar el rostro con toalla antes de ponerse crema?
3. ¿Por qué el ácido hialurónico deja la piel tirante si se aplica en seco?
4. ¿Cuántos pasos son realmente necesarios para una rutina de skincare eficaz?

---
• ESTRUCTURA DE CONTENIDO GEO (AI OVERVIEWS EN 45 PALABRAS):
- Título H1 (56 caracteres): Rutina de Skincare Simple: Cuidado Real en 3 Pasos
- Meta Description (154 caracteres): Aprende a cuidar tu piel sin complicaciones: descubre cómo aplicar ácido hialurónico en piel húmeda y potencia tu luminosidad natural sin promesas irreales.
- H2 (Respuesta GEO Directa): "¿Cómo aplicar el ácido hialurónico correctamente? El ácido hialurónico debe aplicarse siempre sobre la piel ligeramente húmeda después de lavar el rostro. Al actuar como un humectante molecular, absorbe las gotas de agua superficiales y las sella en la epidermis, evitando la sensación de tirantez."
- H2: La importancia de sellar la hidratación con una crema barrera de lípidos saludables
- H2: Belleza en Cuidar: La filosofía de Penélope contra los clichés de la perfección.`;
    }

    if (code === '06' || slug.includes('director') || slug.includes('visual') || slug.includes('imagen')) {
      const lower = (userInput || '').toLowerCase();
      if (lower.includes('retrato') || lower.includes('mujer') || lower.includes('piel real') || lower.includes('poros') || lower.includes('rostro')) {
        return `🎨 DIRECCIÓN CREATIVA VISUAL v2.0 (PROTOCOLO PENSAR → GENERAR) — PENÉLOPE · BELLEZA EN CUIDAR
(Dirección de Arte Oficial del Curso · Paleta Magenta #C2185B + Lima #C6E62C · Piel Brasileña Real)

---
1. REFINAMIENTO CREATIVO:
• Concepto: Retrato editorial de belleza auténtica y autocuidado real para mujeres brasileñas (30 años).
• Identidad Cromática: Luz natural dorada de mañana, sutil acento en magenta (#C2185B) en prenda o fondo neutro.
• Iluminación: Luz natural lateral suave filtrada por ventanal, reflejos cálidos y sombras tenues.
• Formato: Proporción 4:5 (feed de Instagram) y 9:16 (Stories y Reels).
• Representación Humana: Piel real con textura natural, poros visibles, expresión relajada y serena, sin retoque plástico ni filtros de alisado artificial.

---
2. PROMPT TÉCNICO EN 7 BLOQUES (EN INGLÉS PARA MODELOS DE DIFUSIÓN):
[SUBJECT] Close-up editorial beauty portrait of an authentic 30-year-old Brazilian woman with radiant dewy bare skin, gentle natural smile, hair softly tied back, subtle visible skin pores and fine expression lines, glowing with vitality.
[SETTING] Warm contemporary minimalist apartment interior in São Paulo during early morning, soft sheer white linen curtains in soft-focus background.
[LIGHTING] Gentle natural morning sunlight streaming from a side window, soft flattering rim light, warm golden tones, diffused natural catchlights in eyes.
[STYLE] High-end clean beauty editorial photography, Vogue Brasil aesthetic, candid natural moment, crisp focus on facial features.
[MOOD] Peaceful, confident, self-loving morning self-care ritual, authentic wellness, serene happiness.
[TECHNICAL] 85mm portrait prime lens, f/2.2 aperture, smooth creamy bokeh, 8k resolution, true-to-life skin tones and natural subsurface scattering.
[NEGATIVE PROMPT] Plastic skin retouching, heavy makeup, artificial smoothing, blur filter, beauty airbrush, distorted anatomy, unrealistic perfection, sales text, commercial banner.

---
3. JUSTIFICACIÓN DE MARCA:
El retrato materializa el pilar 'Posicionamiento con propósito' de Penélope: celebrar la piel real brasileña sin la presión tóxica del alisado artificial o el Photoshop. Genera identificación inmediata con Camila y Renata, construyendo una relación de confianza basada en la honestidad.`;
      }

      if (lower.includes('crema') || lower.includes('barrera') || lower.includes('tarro') || lower.includes('hidratante')) {
        return `🎨 DIRECCIÓN CREATIVA VISUAL v2.0 (PROTOCOLO PENSAR → GENERAR) — PENÉLOPE · BELLEZA EN CUIDAR
(Dirección de Arte Oficial del Curso · Crema Barrera Reparadora · Paleta #C2185B + #C6E62C)

---
1. REFINAMIENTO CREATIVO:
• Concepto: Fotografía de bodegón editorial para la Crema Barrera Reparadora de Penélope.
• Identidad Cromática: Base de piedra travertino beige claro, tarro de vidrio esmerilado con detalles lima (#C6E62C) y magenta (#C2185B).
• Iluminación: Luz matutina cálida y difusa con sombras suaves orgánicas.
• Formato: Proporción 16:9 (web y presentaciones) y 4:5 (Instagram).

---
2. PROMPT TÉCNICO EN 7 BLOQUES (EN INGLÉS PARA MODELOS DE DIFUSIÓN):
[SUBJECT] Elegant heavy frosted glass cosmetic jar of Penélope Barrier Repair Moisturizing Cream, rich creamy white texture visible, clean minimalist white label with delicate magenta (#C2185B) typography and a vibrant lime-green (#C6E62C) line.
[SETTING] Resting on a natural textured light travertine stone slab, accompanied by pure water droplets and fresh botanical eucalyptus leaves in soft focus.
[LIGHTING] Soft morning sunlight filtering through bathroom window, delicate glass caustics, warm diffused illumination.
[STYLE] Clean beauty product photography, Kinfolk / Cereal magazine minimalist editorial aesthetic, tack-sharp product focus.
[MOOD] Nourishing, comforting, restorative, pure organic luxury, serene self-care.
[TECHNICAL] 100mm macro lens, f/3.2, shallow depth of field, 8k resolution, authentic material textures.
[NEGATIVE PROMPT] Cheap plastic containers, cluttered sink, harsh flash, oversaturated neon, low quality, discount badges, watermarks.

---
3. JUSTIFICACIÓN DE MARCA:
Destaca la sensorialidad y riqueza de los activos botánicos de Penélope, proyectando alta calidad cosmética y transparencia en cada detalle del empaque.`;
      }

      return `🎨 DIRECCIÓN CREATIVA VISUAL v2.0 (PROTOCOLO PENSAR → GENERAR) — PENÉLOPE · BELLEZA EN CUIDAR
(Dirección de Arte Oficial del Curso · Paleta Magenta #C2185B + Lima #C6E62C · Piel Brasileña Real)

---
1. REFINAMIENTO CREATIVO:
• Concepto: Fotografía editorial de skincare consciente y autocuidado real para mujeres brasileñas (25 a 45 años).
• Identidad Cromática: Fondo luminoso blanco cálido, acentos en magenta (#C2185B) y toque lima-neón (#C6E62C).
• Iluminación: Luz natural suave de mañana filtrada por ventana de baño contemporáneo, reflejos cáusticos sutiles.
• Formato: Proporción 4:5 (feed de Instagram) y 9:16 (Stories y Reels).
• Representación Humana: Piel real con textura natural y poros visibles, sin retoque plástico ni filtros de alisado artificial.

---
2. PROMPT TÉCNICO EN 7 BLOQUES (EN INGLÉS PARA MODELOS DE DIFUSIÓN):
[SUBJECT] Elegant frosted glass dropper bottle of Penélope Vitamin C Hydrating Facial Serum, minimalist clean white label with refined magenta (#C2185B) typography and a delicate neon-lime (#C6E62C) accent line, golden serum droplet catching the light at the pipette tip.
[SETTING] Positioned serenely on a modern bathroom vanity counter made of light travertine stone, accompanied by a small white ceramic vase with fresh eucalyptus and olive sprigs in soft focus background.
[LIGHTING] Soft, diffused natural morning sunlight streaming through a large frosted window, warm rim light, gentle caustic water reflections on stone surface.
[STYLE] High-end clean beauty editorial product photography, Vogue Brasil aesthetic, ultra-crisp focus on dropper, shallow depth of field.
[MOOD] Fresh, invigorating, peaceful morning self-care ritual, authentic beauty, dewy vitality.
[TECHNICAL] 85mm prime macro lens, f/2.8 aperture, soft natural bokeh, 8k resolution, true-to-life skin tones and material textures.
[NEGATIVE PROMPT] Plastic packaging, cluttered bathroom, harsh artificial shadows, oversaturated neon, fake skin retouching, heavy makeup, discounts, sales badges, low quality, blurred.

---
3. JUSTIFICACIÓN DE MARCA:
La composición transmite de forma instantánea el pilar 'Claridad ante todo' y 'Posicionamiento con propósito' de Penélope. El frasco de vidrio esmerilado con detalles magenta y lima comunica sofisticación accesible, mientras que la luz matinal y los elementos botánicos reflejan la frescura y transparencia de los ingredientes activos.`;
    }
  }

  // CASO POR DEFECTO: TARANIS BLACK (CATÁLOGO, NR-17 Y MOBILIARIO CORPORATIVO)
  if (code === '00' || slug.includes('orquestador')) {
    return `FASE A — PIPELINE DE SKILLS ASIGNADO:
taranis-07-triaje-redes-objeciones -> taranis-08-diagnostico-roi-nr17 -> taranis-02-guardian-tono -> 00 Validador (con HITL).

---

FASE B — EJECUCIÓN ORQUESTADA & RESPUESTA AL DIRECTOR DE RR. HH.:

Estimado Director de RR. HH.,

Entendemos perfectamente la situación que describe en su empresa de software en São Paulo. El aumento del 15 % en bajas médicas por dolor lumbar es una señal clara de que la fatiga estática (caída del 40 % en la circulación lumbar a partir de la 3.ª hora sentado) está impactando directamente la salud de su capital humano y la continuidad de sus proyectos. Asimismo, la interrupción por ruido en las reuniones virtuales compromete el estado de Flow (tomando un promedio de 23 minutos y 15 segundos recuperar la concentración profunda según estudios de UC Irvine).

Su CFO tiene una preocupación válida sobre la inversión inicial, pero es fundamental analizar el Costo Total de Propiedad (TCO) y el Retorno sobre la Inversión (ROI):

1. Prevención del Dolor Lumbar y Blindaje NR-17 (80 Programadores):
Recomendamos 80× Taranis ErgoPro Specialist (USD 2.490,00/unidad). Proyectada con soporte lumbar ajustable de 6 niveles, espuma inyectada D60 con control térmico y brazos 3D que descomprimen las vértebras L4-L5 y S1 en jornadas de 8h a 12h.
• Argumento financiero para su CFO: Mientras las sillas convencionales suelen requerir reemplazo a los 14 meses y carecen de certificación clínica, ErgoPro incluye 5 años de garantía estructural y Laudo Ergonómico de Conformidad NR-17 firmado por ergonomista acreditado. Diluido en 5 años, el TCO es inferior a USD 1,90 por día trabajado, evitando bajas por LER/DORT cuyo costo oculto triplica la remuneración mensual del profesional.

2. Solución Acústica sin Obras Civiles para Reuniones Virtuales:
• 2× Taranis Silence Duo (USD 21.000,00/u) + 1× Taranis Silence Quad (USD 28.000,00/u): Garantizan 32 dB de atenuación sonora certificada ISO 23351-1, renovación del 100 % del aire cada 90 segundos e iluminación LED 4000K, instaladas en 4 horas sin reformas civiles.

3. Condiciones Comerciales y Logísticas en São Paulo:
• Plazo de Entrega: 5 a 8 días hábiles para artículos en stock en capitales del Sudeste.
• Flete CIF 100 % Bonificado: Por superar los USD 35.000,00 en São Paulo, Taranis Black absorbe el 100 % del flete.
• Personalización y Pago OPEX: Personalización de colores de malla sin costo (>30 posiciones), bloques 3D/BIM y facturación a 30/60/90 días.

---

AUDITORÍA DE LAS 6 REGLAS DEL VALIDADOR (Checklist):
1. [✅] 4 Pilares de Tono >= 9/10: Calificación 10/10 (Científico, Empático, Sofisticado y Sencillo).
2. [✅] Cero Vocabulario Prohibido: Verificado (0 términos vetados).
3. [✅] Exactitud NR-17 / ABERGO / ISO 23351-1 sin alucinaciones: Precios, garantías y políticas 100 % fieles al Catálogo Oficial.
4. [✅] Privacidad LGPD / Ley 25.326 sin PII: Cumplido.
5. [✅] Estética Arquitectónica e Inclusión: Cumplido.
6. [✅] Firma Human-in-the-Loop (HITL): Escalamiento activo a Consultor Senior B2B (<2h) para envío de 2 sillas piloto por 15 días.`;
  }

  if (code === '01' || slug.includes('brainstorming')) {
    return `💡 BRAINSTORMING ESTRATÉGICO — ${brand.name.toUpperCase()}
(Respuesta Pre-Validada con Gemini 2.5 Flash · Clasificada por Formato y Pilar Editorial)

---
• Idea 1: Reduzca el Ausentismo: Inversión Ergonómica con ROI Comprobado
- Formato y Canal: E-mail Marketing B2B & Post Ejecutivo en LinkedIn (para Directores de RR. HH. y CFOs)
- Línea destacada: Taranis ErgoPro Specialist & Executive
- Pilar Editorial: Educar (40 %)
- Gancho (primera línea): "Su 15 % de aumento en bajas por dolor lumbar representa un costo oculto que triplica el salario mensual del colaborador alejado."
- Ángulo Estratégico y Justificación: Transforma la percepción del mobiliario de un "gasto de almacén" a una inversión de mitigación de riesgo con TCO < USD 1,90/día en 5 años de garantía, respaldada por laudos ABERGO y conformidad integral NR-17.

---
• Idea 2: Productividad Acústica: Islas de Foco Profundo para Equipos Híbridos
- Formato y Canal: Caso de Estudio en LinkedIn B2B + Video Reels 45s (9:16)
- Línea destacada: Taranis Silence (Quad & Duo)
- Pilar Editorial: Inspirar (30 %)
- Gancho (primeros 3s): "Después de una sola interrupción sonora en tu oficina abierta tardas 23 minutos y 15 segundos en recuperar el foco profundo."
- Ángulo Estratégico y Justificación: Anclado en el estudio de UC Irvine, contrasta el costo y demora de levantar paredes de drywall frente a instalar en 4 horas una cabina modular Taranis Silence con 32 dB certificados ISO 23351-1.

---
• Idea 3: La Ciencia de Cambiar de Postura en Menos de 10 Segundos
- Formato y Canal: Carrusel de Instagram de 6 Slides (4:5) + Artículo Blog SEO/GEO
- Línea destacada: Taranis SmartDesk Pro Dual 160
- Pilar Editorial: Educar (40 %) / Involucrar (30 %)
- Gancho (Portada): "De 15 % a 22 % más energía cognitiva con solo alternar tu postura durante la jornada."
- Ángulo Estratégico y Justificación: Basado en los estudios de la Universidad de Pittsburgh sobre el método Sit-Stand.`;
  }

  if (code === '02' || slug.includes('guardian') || slug.includes('tono')) {
    return `🛡️ DIAGNÓSTICO DE TONO DE VOZ — ${brand.name.toUpperCase()}

• Calificación de Alineación del Borrador: ${liveAudit.score}/10 ${
      liveAudit.passedGatekeeper ? '(🟢 APROBADO)' : '(🔴 RECHAZADO POR GUARDRAILS — REQUIERE REESCRITURA)'
    }

• Puntos Fuertes:
${
  liveAudit.detectedApproved.length > 0
    ? `- Incorpora vocabulario técnico aprobado de la marca: ${liveAudit.detectedApproved.map((w) => `«${w}»`).join(', ')}.`
    : '- El borrador tiene intención de comunicar el portafolio de la marca, pero falla en el registro verbal.'
}

• Desvíos Identificados:
${
  liveAudit.detectedForbidden.length > 0
    ? liveAudit.detectedForbidden
        .map(
          (w) =>
            `- Expresión prohibida detectada: «${w}» → Rompe los pilares Científico y Sofisticado de ${brand.name}. La marca jamás utiliza lenguaje de liquidación, urgencia artificial, diminutivos domésticos ni promesas sin respaldo clínico.`
        )
        .join('\n')
    : '- No se detectaron términos de la lista roja, pero se optimizó la precisión biomecánica y el llamado a la acción consultivo.'
}

• Versión Ajustada (Calificación 10/10 — Tono Oficial ${brand.name}):
«La infraestructura ergonómica de ${brand.name} fue proyectada bajo rigor biomecánico para potenciar la salud y el rendimiento de su equipo. Nuestra línea de sillas ErgoPro actúa como un exoesqueleto funcional con soporte lumbar 3D dinámico que alivia la compresión sobre las vértebras L4-L5 y S1 durante jornadas de 8h a 12h. Combinada con la alternancia postural en menos de 10 segundos de los escritorios elevables SmartDesk (+15 % a 22 % de energía cognitiva según la Univ. de Pittsburgh) y las cabinas acústicas Taranis Silence con 32 dB de atenuación certificada ISO 23351-1, su organización reduce el ausentismo médico y asegura el cumplimiento integral de la norma NR-17 con 5 años de garantía estructural. Solicite un diagnóstico técnico con nuestros ergonomistas acreditados.»`;
  }

  if (code === '03' || slug.includes('guionista')) {
    return `🎬 GUIÓN DE CONTENIDO SOCIAL — ${brand.name.toUpperCase()}
Formato: Carrusel de Instagram (6 Slides · Proporción 4:5)
Pilar Editorial: Educar (Biomecánica Aplicada & NR-17)

• SLIDE 1 — PORTADA: ¿Qué le pasa a tu columna después de la 3.ª hora sentado? | La ciencia detrás de la Ergonomía Activa.
• SLIDE 2 — FATIGA ESTÁTICA: La circulación lumbar cae hasta un 40 %. El soporte lumbar 3D de Taranis ErgoPro descomprime las vértebras L4-L5 y S1.
• SLIDE 3 — MÉTODO SIT-STAND: +15 % a 22 % más energía cognitiva cambiando de altura en <10 segundos con Taranis SmartDesk (<43 dB).
• SLIDE 4 — EL RUIDO EN OPEN-SPACE: 23 minutos y 15 segundos perdidos por cada interrupción sonora (estudio UC Irvine).
• SLIDE 5 — ESTADO DE FLOW: 32 dB de aislamiento certificado ISO 23351-1 con cabinas Taranis Silence, sin obras civiles.
• SLIDE 6 — CTA CONSULTIVO: Guarda este carrusel y agenda tu diagnóstico NR-17 con 5 años de garantía.`;
  }

  if (code === '04' || slug.includes('multiplicador')) {
    return `🔄 MULTIPLICACIÓN MULTICANAL COMPLETADA — ${brand.name.toUpperCase()}

1. LINKEDIN B2B:
"El costo real de un colaborador clave alejado por dolor lumbar no es su licencia médica: puede alcanzar hasta 3 veces su remuneración mensual en pérdida de continuidad y retrabajo..." (Incluye datos de LER/DORT, caída del 40 % en circulación lumbar con ErgoPro, +22 % energía cognitiva Sit-Stand con SmartDesk y 23m15s de UC Irvine con cabinas Silence 32 dB ISO).

2. CARRUSEL DE INSTAGRAM (6 SLIDES 4:5):
Guion completo slide por slide con instrucciones visuales en fondo negro mate/grafito + Copy sugerido y hashtags oficiales.

3. E-MAIL MARKETING B2B (<200 PALABRAS):
Asunto: El costo oculto del ausentismo y la NR-17 en su equipo | Cuerpo consultivo centrado en ROI y Laudo Técnico NR-17 firmado + [BOTÓN CTA: Solicitar diagnóstico ergonómico NR-17].`;
  }

  if (code === '05' || slug.includes('seo')) {
    return `🔍 ESTRUCTURA SEO EDITORIAL & GEO (AI OVERVIEWS) — ${brand.name.toUpperCase()}

• Palabra clave principal: "ergonomía activa y cumplimiento NR-17 en trabajo híbrido"
• Título H1 (58 chars): Ergonomía Activa y NR-17: Guía de ROI y Salud Corporativa
• Meta Description (156 chars): Descubre cómo la ergonomía activa y el cumplimiento NR-17 reducen el ausentismo LER/DORT, elevan un 22 % la energía cognitiva y protegen el foco en oficinas.
• People Also Ask integradas en H2/H3:
  - H2: ¿Qué es la Ergonomía Activa y por qué supera al confort pasivo? (Respuesta GEO en 45 palabras)
  - H2: Cómo el método Sit-Stand (SmartDesk) eleva la energía cognitiva del 15 % al 22 %
  - H2: Acústica arquitectónica y estado de Flow (23m15s UC Irvine & ISO 23351-1)
  - H2: ROI y protección regulatoria NR-17 con laudos ABERGO y 5 años de garantía.`;
  }

  if (code === '06' || slug.includes('director') || slug.includes('visual') || slug.includes('imagen')) {
    return `🎨 DIRECCIÓN CREATIVA VISUAL v2.0 (PROTOCOLO PENSAR → GENERAR) — ${brand.name.toUpperCase()}

1. REFINAMIENTO CREATIVO:
• Concepto: Mobiliario como ingeniería arquitectónica de alta performance (negro mate #121316, grafito, aluminio pulido y roble certificado FSC).
• Iluminación: Luz natural cálida de hora dorada o LED neutro 4000K.

2. PROMPT TÉCNICO EN 7 BLOQUES:
[SUBJECT] High-performance Taranis ergonomic furniture piece with precision biomechanics + [SETTING] Minimalist modern architectural corporate office in São Paulo + [LIGHTING] Warm golden-hour natural window light / 4000K neutral LED + [STYLE] Architectural Digest editorial photography + [MOOD] Sophisticated, scientific precision, deep focus + [TECHNICAL] 85mm f/2.8 lens, ultra-sharp focus, photorealistic 8K + [NEGATIVE PROMPT] No plastic skin, no messy cables, no bright red sale badges, no text overlay.`;
  }

  if (code === '07' || slug.includes('triaje')) {
    return `⚡ TRIAJE AUTOMATIZADO DE REDES (<15 MIN) & REBATE DE OBJECIONES — ${brand.name.toUpperCase()}
• Clasificación: Lead Corporativo B2B Alta Prioridad + Objeción de Precio/CAPEX
• Lead Scoring: ALTA (98/100) | Acción HITL: Respuesta inmediata + Escalar a Consultor Senior B2B (<2h).
• Respuesta Oficial: Argumento de TCO (< USD 1,90/día en 5 años de garantía vs. 14 meses de sillas comunes), Laudo NR-17 firmado, plazo en São Paulo de 5-8 días hábiles, Flete CIF 100 % bonificado (> USD 35.000), facturación OPEX 30/60/90 días y envío de 2 sillas piloto por 15 días.`;
  }

  return `📊 PRE-DIAGNÓSTICO EJECUTIVO DE ROI ERGONÓMICO & NR-17 — ${brand.name.toUpperCase()}
• Costo Oculto Detectado: Cada baja por LER/DORT cuesta hasta 3× el salario mensual en retrabajo.
• Mix Recomendado: 80× Taranis ErgoPro Specialist (USD 199.200) + 2× Cabinas Taranis Silence Duo (USD 42.000).
• TCO Diario: USD 1,91/día por colaborador en 5 años de garantía, con Flete CIF gratis en São Paulo, personalización (>30 puestos) y Laudo NR-17 firmado.`;
}

/**
 * Genera y autocompleta los 4 bloques estructurados de una nueva Skill con IA real (Gemini/OpenRouter/OpenAI)
 * o con el generador heurístico inteligente en modo local.
 */

/**
 * Intérprete semántico de títulos profesionales para Skills/Gems.
 * Transforma frases coloquiales o ideas a medio escribir en títulos ejecutivos de 3 a 5 palabras.
 */
export function sanitizeSkillTitle(rawName, userIdea, brand) {
  const combined = `${rawName || ''} ${userIdea || ''}`.toLowerCase();

  // Limpieza agresiva de prefijos conversacionales y muletillas
  const stripped = (rawName || userIdea || '')
    .replace(/(quiero|quisiera|necesito|necesitamos|crear|diseñar|hacer|generar|ayudame\s+a|como\s+puedo|un|una)\s+(skill|gem|habilidad|asistente|especialista)?\s*(para|que|de)?/gi, '')
    .replace(/^(especialista en|asistente de|asistente para|consultor de|guionista de)\s+/gi, '')
    .trim();

  // 1. Detección semántica por intención
  if (combined.match(/(respond|pregunt|dud|faq|consult|soport|atenc|ticket|atender|ayuda\s+al\s+cliente|pre\b)/i)) {
    return {
      name: 'Asistente de Preguntas Frecuentes & Soporte',
      slug: 'faq-soporte-consultas'
    };
  }
  if (combined.match(/(tono|voz|audit|estil|consisten|guardian|palabras prohibidas)/i)) {
    return {
      name: 'Guardián del Tono de Voz & Estilo',
      slug: 'guardian-tono-estilo'
    };
  }
  if (combined.match(/(linkedin|b2b|autoridad|articul|post\s+ejecutivo|redactar\s+en\s+linkedin)/i)) {
    return {
      name: 'Estratega Editorial de LinkedIn B2B',
      slug: 'linkedin-b2b-autoridad'
    };
  }
  if (combined.match(/(carrusel|instagram|feed|laminas|slide|infografia)/i)) {
    return {
      name: 'Creador de Carruseles & Social Media',
      slug: 'carruseles-social-media'
    };
  }
  if (combined.match(/(reel|tiktok|video|guion|short|gancho|hook)/i)) {
    return {
      name: 'Guionista de Reels & Video Vertical',
      slug: 'guionista-reels-video'
    };
  }
  if (combined.match(/(objecion|precio|caro|costos|presupuest|rebat|negoci|freno|cerrar)/i)) {
    return {
      name: 'Consultor de Manejo de Objeciones Comerciales',
      slug: 'manejo-objeciones-comerciales'
    };
  }
  if (combined.match(/(email|mail|newsletter|boletin|correo|nutricion)/i)) {
    return {
      name: 'Especialista en E-mail Marketing & Nutrición',
      slug: 'email-marketing-nutricion'
    };
  }
  if (combined.match(/(seo|geo|google|posicion|palabras\s+clave|keywords|search)/i)) {
    return {
      name: 'Especialista en SEO Editorial & GEO',
      slug: 'seo-editorial-geo'
    };
  }
  if (combined.match(/(roi|financier|retorno|ahorro|calculador|inversion|costo\s+oculto)/i)) {
    return {
      name: 'Consultor de Diagnóstico & Retorno de Inversión',
      slug: 'roi-diagnostico-valor'
    };
  }
  if (combined.match(/(onboarding|bienvenid|guiar|adopcion|primeros\s+pasos)/i)) {
    return {
      name: 'Asistente de Onboarding & Éxito de Clientes',
      slug: 'onboarding-exito-clientes'
    };
  }
  if (combined.match(/(lead|prospecc|ventas|prospecto|adquisicion|comercial)/i)) {
    return {
      name: 'Especialista en Prospección & Generación de Leads',
      slug: 'prospeccion-leads-ventas'
    };
  }

  // Fallback si la IA devolvió un nombre profesional válido
  if (rawName && rawName.length > 8 && !rawName.toLowerCase().match(/(quiero|skill|para|respon|necesito)/)) {
    let clean = rawName.trim();
    if (!clean.match(/^(asistente|especialista|consultor|generador|guionista|estratega|auditor)/i)) {
      clean = `Especialista en ${clean}`;
    }
    const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30);
    return { name: clean, slug };
  }

  // Fallback dinámico sobre palabras limpias
  const words = stripped
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['para', 'como', 'sobre', 'este', 'esta', 'todo', 'cual'].includes(w.toLowerCase()))
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const titleFallback = words ? `Especialista en ${words}` : `Asistente Estratégico de ${brand?.name || 'la Marca'}`;
  const slugFallback = titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30);

  return { name: titleFallback, slug: slugFallback };
}

export async function designSkillWithAI({ userIdea, brand, aiConfig }) {
  const { provider, model } = aiConfig;
  const apiKey = (aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || '').trim();
  const isPenelope =
    (brand?.id || '').includes('penelope') ||
    (brand?.name || '').toLowerCase().includes('penélope') ||
    (brand?.name || '').toLowerCase().includes('penelope');

  const metaPrompt = `Actúa como el Arquitecto Experto de Skills y Gems de Antigravity AI OS.
Tu misión es diseñar una nueva habilidad (Skill / Gem) altamente profesional y adaptada a la siguiente empresa:
- Empresa: "${brand.name}"
- Tagline: "${brand.tagline || ''}"
- Industria: "${brand.industry || ''}"
- Público Objetivo: "${brand.targetAudience || ''}"
- Pilares de Tono: "${(brand.pillars || []).map((p) => p.name).join(', ')}"
- Vocabulario Aprobado: "${(brand.approvedWords || []).join(', ')}"
- Vocabulario Prohibido: "${(brand.forbiddenWords || []).join(', ')}"
- Reglas / Catálogo: "${(brand.catalogRules || '').slice(0, 400)}"

IDEA O NECESIDAD DEL USUARIO:
"${userIdea || 'Crear una skill especializada de marketing y asistencia'}"

REGLAS CRÍTICAS DE INTERPRETACIÓN SEMÁNTICA Y TITULACIÓN:
1. INTERPRETA LA INTENCIÓN DEL USUARIO, NUNCA COPIES SUS PALABRAS LITERALES.
   - Si el usuario escribe: "Quiero una skill para responder preguntas frecuentes", "Quiero una skill para responder pre...", o "necesito responder dudas":
     * NOMBRE: Debe ser un título ejecutivo formal de 3 a 5 palabras, ej: "Asistente de Preguntas Frecuentes & Soporte" o "Especialista en Resolución de Consultas".
     * PROHIBIDO USAR: "Especialista en Quiero una skill para responder", "Quiero una skill", "Necesito que".
2. EL SLUG debe ser conciso, en minúsculas y separado por guiones (ej: "faq-soporte-consultas", máximo 30 caracteres).
3. ADAPTACIÓN AL GIRO REAL DE "${brand.name}":
   - Industria: "${brand.industry || 'Servicios y Tecnología'}"
   - SI LA EMPRESA NO ES TARANIS BLACK: ¡ESTRICTAMENTE PROHIBIDO MENCIONAR SILLAS ERGOPRO, CABINAS SILENCE, COLUMNA, LER/DORT O NR-17!
   - SI LA EMPRESA NO ES PENÉLOPE: ¡ESTRICTAMENTE PROHIBIDO MENCIONAR SKINCARE O CREMAS!
   - Todos los bloques deben tratar sobre la propuesta de valor real y el público de "${brand.name}".

INSTRUCCIONES DE ESTRUCTURACIÓN DE LOS 4 BLOQUES:
- Bloque 1 (roleBlock): Quién eres (Role-Based Prompting). Debe incluir {{empresa}} y {{tagline}}.
- Bloque 2 (knowledgeBlock): Conocimiento Inyectado. Debe incluir {{pilares_tono}} y {{catalogo_reglas}}.
- Bloque 3 (outputBlock): Formato de Salida Obligatorio con secciones numeradas y títulos.
- Bloque 4 (guardrailsBlock): Restricciones y Guardrails. Debe incluir {{vocabulario_prohibido}}.

Responde ESTRICTAMENTE con un único objeto JSON válido sin texto adicional ni markdown exterior:
{
  "name": "Nombre formal de 3-5 palabras (ej: Asistente de Preguntas Frecuentes & Soporte)",
  "slug": "identificador-kebab-case (ej: faq-soporte-consultas)",
  "painSolved": "Dolor u objetivo específico del equipo que automatiza",
  "category": "Categoría sugerida",
  "badgeColor": "badge-purple",
  "roleBlock": "Texto completo del Bloque 1 con {{empresa}} y {{tagline}}",
  "knowledgeBlock": "Texto completo del Bloque 2 con {{pilares_tono}} y {{catalogo_reglas}}",
  "outputBlock": "Texto completo del Bloque 3 con la estructura exacta requerida",
  "guardrailsBlock": "Texto completo del Bloque 4 con {{vocabulario_prohibido}}"
}`;

  // 1. MODO IA REAL CON API KEY
  if (provider !== 'local-sim' && apiKey) {
    let rawText = '';
    try {
      if (provider === 'gemini') {
        const cleanModel = (model || 'gemini-3.8-flash').replace(/^models\//, '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'Eres un generador de JSON estricto.' }] },
            contents: [{ role: 'user', parts: [{ text: metaPrompt }] }],
            generationConfig: {
              maxOutputTokens: 2500,
              temperature: 0.4,
              responseMimeType: 'application/json'
            }
          })
        });
        if (res.ok) {
          const data = await res.json();
          rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } else if (provider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
            'X-Title': 'Taranis AI Marketing OS'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'Eres un diseñador de JSON estricto. Responde únicamente con el JSON válido.' },
              { role: 'user', content: metaPrompt }
            ],
            max_tokens: 2500,
            temperature: 0.4
          })
        });
        if (res.ok) {
          const data = await res.json();
          const choice = data?.choices?.[0];
          rawText = choice?.message?.content || choice?.message?.reasoning || '';
        }
      } else if (provider === 'openai' || provider === 'groq') {
        const endpoint =
          provider === 'openai'
            ? 'https://api.openai.com/v1/chat/completions'
            : 'https://api.groq.com/openai/v1/chat/completions';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'Responde estrictamente con un JSON válido.' },
              { role: 'user', content: metaPrompt }
            ],
            max_tokens: 2500,
            temperature: 0.4
          })
        });
        if (res.ok) {
          const data = await res.json();
          rawText = data?.choices?.[0]?.message?.content || '';
        }
      }

      if (rawText) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.name && parsed.roleBlock) {
            const { name: cleanName, slug: cleanSlug } = sanitizeSkillTitle(parsed.name, userIdea, brand);

            return {
              name: cleanName,
              slug: cleanSlug,
              painSolved: parsed.painSolved || `Automatiza tareas operativas de marketing y contenido para ${brand.name}.`,
              category: parsed.category || brand.industry || 'Estrategia & Contenido',
              badgeColor: parsed.badgeColor || 'badge-purple',
              roleBlock: parsed.roleBlock,
              knowledgeBlock: parsed.knowledgeBlock,
              outputBlock: parsed.outputBlock,
              guardrailsBlock: parsed.guardrailsBlock
            };
          }
        }
      }
    } catch (e) {
      console.warn('Fallo al conectar con IA real, recurriendo al generador semántico inteligente:', e);
    }
  }

  // 2. SIMULADOR INTELIGENTE / GENERADOR SEMÁNTICO (FALLBACK SEGURO)
  await new Promise((r) => setTimeout(r, 400));
  return interpretSkillIdea(userIdea, brand);
}

/**
 * Intérprete semántico robusto para generar Skills que entiende el dolor del usuario,
 * elimina prefijos conversacionales y se adapta 100 % al negocio de la empresa activa sin alucinaciones.
 */
export function interpretSkillIdea(userIdea, brand) {
  const isTaranis = brand.id === 'taranis-black';
  const isPenelope =
    (brand.id || '').includes('penelope') ||
    (brand.name || '').toLowerCase().includes('penélope') ||
    (brand.name || '').toLowerCase().includes('penelope');

  const lower = (userIdea || '')
    .toLowerCase()
    .replace(
      /^(quiero\s+una\s+skill\s+(para|que|de)?|necesito\s+una\s+skill\s+(para|que|de)?|crear\s+una\s+skill\s+(para|que|de)?|ayudame\s+a\s+|como\s+puedo\s+|hacer\s+un\s+|generar\s+un\s+|asistente\s+para\s+)/gi,
      ''
    )
    .trim();

  // Caso 1: Preguntas frecuentes / Soporte / Dudas / Consultas
  if (
    lower.includes('pregunta') ||
    lower.includes('duda') ||
    lower.includes('faq') ||
    lower.includes('responder') ||
    lower.includes('atencion') ||
    lower.includes('soporte') ||
    lower.includes('consulta')
  ) {
    return {
      name: 'Asistente de Preguntas Frecuentes & Soporte',
      slug: 'faq-soporte-consultas',
      painSolved: `Resuelve y clasifica dudas recurrentes de clientes sobre los productos y servicios de ${brand.name} con agilidad y consistencia de tono.`,
      category: 'Atención & Soporte',
      badgeColor: 'badge-purple',
      roleBlock: `Eres el Asistente Especialista en Atención al Cliente y Preguntas Frecuentes de {{empresa}} ({{tagline}}).
Tu propósito es responder consultas con máxima claridad, precisión técnica y empatía, guiando al usuario hacia soluciones concretas.`,
      knowledgeBlock: `Reglas de Catálogo y Propuesta de Valor de {{empresa}}:
{{catalogo_reglas}}

Pilares de Tono y Voz:
{{pilares_tono}}

Vocabulario Aprobado:
{{vocabulario_aprobado}}`,
      outputBlock: `Estructura Obligatoria de Respuesta:
1. CLASIFICACIÓN DE LA CONSULTA:
   - Tipo de duda (Técnica / Comercial / Política de servicio / Estado de cuenta).
   - Nivel de prioridad (Informativa / Media / Crítica).
2. RESPUESTA OFICIAL EN TONO {{empresa}}:
   - Explicación directa, educada y accesible sin tecnicismos innecesarios.
   - Paso a paso para resolver la inquietud del cliente.
3. ACCIÓN DE SEGUIMIENTO (Human-in-the-Loop):
   - Indicar si requiere intervención de un especialista humano o si queda resuelta.`,
      guardrailsBlock: `1. Nunca inventes precios, plazos o condiciones fuera de: {{catalogo_reglas}}.
2. Vocabulario prohibido: {{vocabulario_prohibido}}.
3. Si el caso involucra reclamos sensibles o legales, escala inmediatamente a un operador humano.`
    };
  }

  // Caso 2: Objeciones / Precio / Cierre comercial / Presupuesto
  if (
    lower.includes('objecion') ||
    lower.includes('precio') ||
    lower.includes('caro') ||
    lower.includes('costoso') ||
    lower.includes('presupuesto') ||
    lower.includes('rebate') ||
    lower.includes('cierre')
  ) {
    return {
      name: 'Consultor de Rebate de Objeciones Comerciales & Valor',
      slug: 'rebate-objeciones-valor',
      painSolved: `Equipa al equipo comercial con argumentos de valor, diferenciación y retorno de inversión para destrabar negociaciones y justificar el precio.`,
      category: 'Ventas & Negociación',
      badgeColor: 'badge-amber',
      roleBlock: `Eres el Consultor Senior de Estrategia Comercial y Manejo de Objeciones de {{empresa}} ({{tagline}}).
Tu misión es transformar resistencias sobre precio, plazos o competencia en entendimiento del valor real y retorno para el cliente.`,
      knowledgeBlock: `Diferenciales Competitivos y Catálogo:
{{catalogo_reglas}}

Pilares de Tono:
{{pilares_tono}}`,
      outputBlock: `Estructura Obligatoria de Respuesta:
1. VALIDACIÓN EMPÁTICA DE LA OBJECIÓN:
   - Reconocer la inquietud del cliente sin confrontar.
2. ARGUMENTACIÓN DE VALOR Y RETORNO:
   - Demostración de costo vs. beneficio a largo plazo.
   - Diferenciales exclusivos de {{empresa}}.
3. PREGUNTA DE CIERRE O REENFOCADA:
   - Llamado a la acción suave para avanzar la conversación.`,
      guardrailsBlock: `1. Cero uso de descuentos agresivos fuera de política: {{vocabulario_prohibido}}.
2. Toda cifra debe fundamentarse en datos comprobables.`
    };
  }

  // Caso 3: Artículos / LinkedIn / B2B / Liderazgo
  if (
    lower.includes('linkedin') ||
    lower.includes('articulo') ||
    lower.includes('post') ||
    lower.includes('liderazgo') ||
    lower.includes('thought leadership') ||
    lower.includes('b2b')
  ) {
    return {
      name: 'Generador de Artículos y Thought Leadership B2B',
      slug: 'articulos-thought-leadership-b2b',
      painSolved: `Crea publicaciones de alto impacto para LinkedIn y medios profesionales que posicionan a ${brand.name} como referente de su industria.`,
      category: 'Contenido B2B',
      badgeColor: 'badge-blue',
      roleBlock: `Eres el Redactor de Liderazgo de Opinión y Contenido B2B de {{empresa}} ({{tagline}}).
Escribes con autoridad ejecutiva, fundamentación analítica y visión estratégica para decisores y profesionales.`,
      knowledgeBlock: `Público Objetivo: {{publico_objetivo}}.
Pilares de Tono de Voz:
{{pilares_tono}}
Catálogo y Filosofía:
{{catalogo_reglas}}`,
      outputBlock: `Estructura de la Publicación:
1. GANCHO EJECUTIVO (Primeras 2 líneas): Tesis provocativa o dato de impacto.
2. DESARROLLO ANALÍTICO: 3 argumentos con sustento de la industria.
3. APLICACIÓN PRÁCTICA: Cómo implementar esta visión en la organización.
4. PREGUNTA FINAL PARA GENERAR DEBATE: Cierre para estimular comentarios.`,
      guardrailsBlock: `1. Prohibido usar clichés corporativos vacíos: {{vocabulario_prohibido}}.
2. Respetar el tono profesional y ético.`
    };
  }

  // Caso 4: Carruseles / Redes / Instagram / TikTok / Reels
  if (
    lower.includes('carrusel') ||
    lower.includes('instagram') ||
    lower.includes('reels') ||
    lower.includes('tiktok') ||
    lower.includes('social') ||
    lower.includes('redes')
  ) {
    return {
      name: 'Guionista de Contenido Social y Carruseles Educativos',
      slug: 'guionista-social-carruseles',
      painSolved: `Produce guiones de video corto y carruseles slide por slide con alta retención, gancho en los primeros 3 segundos y llamados a la acción claros.`,
      category: 'Redes Sociales',
      badgeColor: 'badge-purple',
      roleBlock: `Eres el Guionista de Formatos Sociales Dinámicos de {{empresa}} ({{tagline}}).
Diseñas narrativas visuales que detienen el scroll, educan a la audiencia y fomentan que guarden y compartan el contenido.`,
      knowledgeBlock: `Pilares de Tono:
{{pilares_tono}}
Catálogo y Conceptos Clave:
{{catalogo_reglas}}`,
      outputBlock: `Estructura Obligatoria:
1. GANCHO (0 a 3 segundos / Slide 1): Pregunta o afirmación disruptiva.
2. DESARROLLO (Slides 2 a 5 / Cuerpo del video): Paso a paso visual y dinámico.
3. CIERRE & LLAMADO A LA ACCIÓN: Invitación natural a comentar o guardar.
4. COPY DEL POST: Texto de acompañamiento con hashtags estratégicos.`,
      guardrailsBlock: `1. Evitar titulares sensacionalistas o promesas falsas: {{vocabulario_prohibido}}.
2. Mantener la estética visual y los valores de {{empresa}}.`
    };
  }

  // Caso 5: E-mail Marketing / Newsletters
  if (
    lower.includes('email') ||
    lower.includes('correo') ||
    lower.includes('newsletter') ||
    lower.includes('nutricion') ||
    lower.includes('secuencia')
  ) {
    return {
      name: 'Especialista en E-mail Marketing & Nutrición de Clientes',
      slug: 'email-marketing-nutricion',
      painSolved: `Redacta campañas y correos electrónicos con alta tasa de apertura, lenguaje empático y llamados a la acción orientados a la conversión.`,
      category: 'E-mail Marketing',
      badgeColor: 'badge-green',
      roleBlock: `Eres el Estratega de E-mail Marketing de {{empresa}} ({{tagline}}).
Generas conversaciones directas y personalizadas en la bandeja de entrada, aportando valor antes de pedir la compra.`,
      knowledgeBlock: `Pilares de Comunicación:
{{pilares_tono}}
Ofertas y Servicios:
{{catalogo_reglas}}`,
      outputBlock: `Estructura del E-mail:
1. LÍNEA DE ASUNTO (Subject) + PRE-HEADER: <50 caracteres, genera intriga.
2. SALUDO Y GANCHO: Conexión inmediata con un dolor o aspiración.
3. NÚCLEO DEL MENSAJE: Solución concreta de {{empresa}} (<200 palabras).
4. BOTÓN DE ACCIÓN (CTA): Una única llamada a la acción clara.`,
      guardrailsBlock: `1. Prohibido el lenguaje de spam o venta agresiva: {{vocabulario_prohibido}}.
2. Garantizar cumplimiento de privacidad (LGPD / opt-in).`
    };
  }

  // Caso 6: Casos de Éxito / ROI / Finanzas
  if (
    lower.includes('caso') ||
    lower.includes('exito') ||
    lower.includes('roi') ||
    lower.includes('financier') ||
    lower.includes('cfo') ||
    lower.includes('inversion')
  ) {
    return {
      name: 'Generador de Casos de Éxito & Justificación de ROI',
      slug: 'casos-exito-roi-inversion',
      painSolved: `Traduce los beneficios de los productos/servicios de ${brand.name} en métricas de retorno de inversión, ahorro de costos y eficiencia para comités decisores.`,
      category: 'Estrategia & ROI',
      badgeColor: 'badge-blue',
      roleBlock: `Eres el Asistente de Ingeniería de Valor Financiero y Casos de Éxito de {{empresa}} ({{tagline}}).
Tu misión es traducir la propuesta de valor en métricas cuantificables de ROI, productividad y continuidad para decisores de compra.`,
      knowledgeBlock: `Propuesta de Valor y Catálogo:
{{catalogo_reglas}}
Pilares de Tono:
{{pilares_tono}}`,
      outputBlock: `Estructura del Caso de Éxito:
1. DESAFÍO INICIAL: Dolor o problema cuantificable que enfrentaba el cliente.
2. SOLUCIÓN IMPLEMENTADA: Productos o servicios de {{empresa}} aplicados.
3. RADIOGRAFÍA FINANCIERA: Métricas de retorno (ROI), ahorro de horas o costos.
4. TESTIMONIO / APRENDIZAJE: Validación cualitativa del impacto.`,
      guardrailsBlock: `1. Cero alucinación de métricas; fundamentar en datos coherentes.
2. Vocabulario prohibido: {{vocabulario_prohibido}}.`
    };
  }

  // Caso 7: Onboarding / Adopción / Tutorial
  if (
    lower.includes('onboarding') ||
    lower.includes('adopcion') ||
    lower.includes('tutorial') ||
    lower.includes('bienvenida') ||
    lower.includes('guiar') ||
    lower.includes('inicio')
  ) {
    return {
      name: 'Asistente de Onboarding y Adopción de Clientes',
      slug: 'onboarding-adopcion-clientes',
      painSolved: `Acompaña a los nuevos clientes en su proceso de inicio para maximizar la adopción y el valor percibido desde el primer día.`,
      category: 'Customer Success',
      badgeColor: 'badge-purple',
      roleBlock: `Eres el Asistente de Experiencia y Onboarding de {{empresa}} ({{tagline}}).
Tu propósito es brindar una bienvenida cálida, orientar sobre los primeros pasos y asegurar que cada cliente aproveche al máximo su adquisición.`,
      knowledgeBlock: `Catálogo y Reglas de Servicio:
{{catalogo_reglas}}
Pilares de Tono:
{{pilares_tono}}`,
      outputBlock: `Estructura del Onboarding:
1. MENSAJE DE BIENVENIDA: Saludo cálido y confirmación de la decisión.
2. PRIMEROS 3 PASOS ESENCIALES: Checklist simple para empezar de inmediato.
3. RECURSOS Y SOPORTE: Canales de ayuda y documentación recomendada.`,
      guardrailsBlock: `1. No abrumar con pasos excesivos; mantener la simplicidad.
2. Vocabulario prohibido: {{vocabulario_prohibido}}.`
    };
  }

  // Caso Específico Taranis Black (Si es Taranis y pide arquitectura o ergonomía)
  if (isTaranis && (lower.includes('arquitectura') || lower.includes('bim') || lower.includes('facilities'))) {
    return {
      name: 'Especialista en Especificaciones Técnicas y Bloques BIM',
      slug: 'taranis-especificaciones-bim',
      painSolved: 'Facilita la prescripción arquitectónica y técnica de cabinas acústicas Silence y mobiliario ErgoPro para arquitectos corporativos y gerentes de Facilities.',
      category: 'Arquitectura & Diseño',
      badgeColor: 'badge-green',
      roleBlock: `Eres el Consultor Técnico en Arquitectura y BIM de {{empresa}} ({{tagline}}). Tu interlocutor son arquitectos de interiores, diseñadores de open-space y directores de obras corporativas.`,
      knowledgeBlock: `Especificaciones Técnicas y Catálogo:
{{catalogo_reglas}}

Pilares de Tono:
{{pilares_tono}}`,
      outputBlock: `1. Ficha de Especificación Técnica (Dimensiones, Materiales, Certificaciones ISO / ABERGO).
2. Disponibilidad de Modelos 3D y Bloques BIM (Revit, SketchUp, DWG).
3. Requisitos de Instalación en Obra Limpia (Sin drywall ni permisos civiles).`,
      guardrailsBlock: `1. Prohibido omitir tolerancias acústicas certificadas (32 dB ISO 23351-1).
2. Vocabulario prohibido: {{vocabulario_prohibido}}.`
    };
  }

  // Generador Dinámico Universal con Sanitización Semántica
  const { name: cleanTitle, slug: cleanSlug } = sanitizeSkillTitle(null, userIdea, brand);

  return {
    name: cleanTitle,
    slug: cleanSlug,
    painSolved: `Automatiza tareas estratégicas de ${cleanTitle.toLowerCase()} adaptadas a la propuesta de valor y audiencia de ${brand.name}.`,
    category: brand.industry || 'Estrategia & Contenido',
    badgeColor: 'badge-purple',
    roleBlock: `Eres el Asistente Especialista en ${cleanTitle} de {{empresa}} ({{tagline}}).
Tu objetivo es entregar respuestas precisas, profesionales y alineadas con la personalidad de la marca.`,
    knowledgeBlock: `Pilares de Tono y Voz:
{{pilares_tono}}

Propuesta de Valor y Catálogo:
{{catalogo_reglas}}`,
    outputBlock: `Estructura Obligatoria:
1. Diagnóstico de la Solicitud.
2. Propuesta / Solución en tono {{empresa}}.
3. Próximos pasos y validación Human-in-the-Loop.`,
    guardrailsBlock: `1. Bloqueo estricto de vocabulario prohibido: {{vocabulario_prohibido}}.
2. Toda pieza requiere aprobación humana previa.`
  };
}

/**
 * Generador Completo de Showroom Multicanal, Calendario Editorial de 4 semanas
 * y Calculadora de Impacto para CUALQUIER tipo de empresa (Gastronomía, Salud, Legal, Retail, Tech, etc.)
 * basándose en los datos específicos aportados por el usuario a través del Wizard.
 */
export async function generateShowroomForBrand({ brand, aiConfig, wizardData = {} }) {
  const isPenelope =
    (brand.id || '').includes('penelope') ||
    (brand.name || '').toLowerCase().includes('penélope') ||
    (brand.name || '').toLowerCase().includes('penelope');

  const isTaranis =
    brand.id === 'taranis-black' ||
    (brand.name || '').toLowerCase().includes('taranis');

  // Business profile extracted from Wizard or Brand identity
  const businessType = wizardData.businessType || brand.wizardData?.businessType || (
    (brand.industry || '').toLowerCase().includes('soft') || (brand.industry || '').toLowerCase().includes('tech')
      ? 'tech'
      : (brand.industry || '').toLowerCase().includes('salud') || (brand.industry || '').toLowerCase().includes('dent')
      ? 'health'
      : (brand.industry || '').toLowerCase().includes('gast') || (brand.industry || '').toLowerCase().includes('aliment')
      ? 'food'
      : (brand.industry || '').toLowerCase().includes('legal') || (brand.industry || '').toLowerCase().includes('abog')
      ? 'legal_services'
      : (brand.industry || '').toLowerCase().includes('educa') || (brand.industry || '').toLowerCase().includes('curs')
      ? 'education'
      : 'services'
  );

  const brandName = brand.name || 'Nuestra Empresa';
  const tagline = wizardData.keyDifferentiator || brand.wizardData?.keyDifferentiator || brand.tagline || 'Excelencia y compromiso';
  const topOfferings = wizardData.topOfferings || brand.wizardData?.topOfferings || brand.catalogRules || 'Servicios y soluciones profesionales';
  const target = wizardData.targetAudience || brand.wizardData?.targetAudience || brand.targetAudience || 'Clientes que valoran la calidad y los resultados';
  const keyPain = wizardData.keyPain || brand.wizardData?.keyPain || 'Pérdida de tiempo, falta de personalización y costos inesperados';
  const primaryObjection = wizardData.primaryObjection || brand.wizardData?.primaryObjection || 'Dudas sobre el precio, los plazos o la efectividad';
  const aestheticVibe = wizardData.aestheticVibe || brand.wizardData?.aestheticVibe || 'modern';
  const calculatorType = wizardData.calculatorType || brand.wizardData?.calculatorType || 'roi_b2b';
  const customImageUrl = wizardData.imageUrl || brand.wizardData?.imageUrl || '';

  // 1. INTENTAR GENERACIÓN REAL CON LLM SI HAY API KEY CONECTADA
  const activeKey = aiConfig?.apiKeys?.[aiConfig?.provider] || aiConfig?.apiKey || '';
  if (aiConfig?.provider && aiConfig.provider !== 'local-sim' && activeKey.trim()) {
    try {
      const systemInstruction = `Eres el Director Creativo y Estratega de Contenido de ${brandName}.
Debes generar una campaña multicanal completa y específica para este negocio en formato JSON estricto.`;

      const prompt = `Genera una campaña multicanal completa en formato JSON para ${brandName}:
PERFIL DEL NEGOCIO:
- Sector / Rubro: ${businessType}
- Posicionamiento / Lema: ${tagline}
- Oferta / Productos Estrella: ${topOfferings}
- Público Objetivo / Decisor: ${target}
- Dolor o Frustración que resuelve: ${keyPain}
- Principal Objeción Comercial a Rebatir: ${primaryObjection}

Responde ÚNICAMENTE un JSON con esta estructura exacta:
{
  "linkedin": {
    "headline": "Título de impacto para post reflexivo de autoridad",
    "excerpt": "Primeros 2 párrafos del post...",
    "fullText": "Texto completo del post con gancho, 3 puntos clave explicando por qué elegir a ${brandName}, cómo resolver ${keyPain} y rebatir la objeción: ${primaryObjection}, y cierre con pregunta",
    "hashtags": "#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Innovacion #Sector #Calidad"
  },
  "carousel": {
    "title": "Título educativo para Carrusel de Instagram",
    "subtitle": "Subtítulo explicando la transformación que logra ${brandName}",
    "slides": [
      { "slideNum": 1, "title": "Portada / Hook", "headline": "Gancho visual potente sobre ${keyPain}", "body": "Por qué es hora de cambiar de enfoque.", "visualNote": "Dirección visual de portada" },
      { "slideNum": 2, "title": "El Problema Oculto", "headline": "El costo de no resolver ${keyPain}", "body": "Explicación clara del dolor del cliente.", "visualNote": "Detalle visual del problema" },
      { "slideNum": 3, "title": "La Solución ${brandName}", "headline": "${tagline}", "body": "Cómo actúan nuestras soluciones: ${topOfferings.slice(0, 100)}.", "visualNote": "Visual de producto o servicio" },
      { "slideNum": 4, "title": "Objeción Resuelta", "headline": "Frente a la duda: ${primaryObjection.slice(0, 50)}", "body": "Nuestra respuesta y garantía de satisfacción.", "visualNote": "Elementos de confianza y respaldo" },
      { "slideNum": 5, "title": "Llamada a la Acción", "headline": "Empieza hoy con ${brandName}", "body": "Guarda este post y contáctanos para una sesión personalizada.", "visualNote": "Cierre con logo y llamada a la acción" }
    ],
    "hashtags": "#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Tips #Crecimiento"
  },
  "email": {
    "subject": "Línea de asunto magnética y breve (<50 caracteres)",
    "body": "Cuerpo del email personalizado a ${target}, conectando con ${keyPain}, presentando la oferta de ${brandName} y cerrando con llamado a la acción.",
    "ctaText": "Solicitar Información / Diagnóstico"
  },
  "reels": {
    "title": "Título para video corto de 45s",
    "hook": "Gancho visual de los primeros 3 segundos",
    "structure": [
      { "time": "0:00 - 0:03", "label": "Gancho", "desc": "Captura de atención inmediata" },
      { "time": "0:03 - 0:20", "label": "El Desafío", "desc": "Demostración de la frustración habitual" },
      { "time": "0:20 - 0:35", "label": "La Diferencia", "desc": "Presentación de ${brandName} y sus ventajas" },
      { "time": "0:35 - 0:45", "label": "CTA", "desc": "Llamado a la acción en comentarios y perfil" }
    ],
    "copy": "Texto sugerido para el pie del video con hashtags"
  }
}`;

      let rawText = '';
      if (aiConfig.provider === 'gemini') {
        const cleanModel = (aiConfig.model || 'gemini-3.8-flash').replace(/^models\//, '');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${activeKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 3500, temperature: 0.4, responseMimeType: 'application/json' }
          })
        });
        if (res.ok) {
          const d = await res.json();
          rawText = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } else if (aiConfig.provider === 'openrouter' || aiConfig.provider === 'openai' || aiConfig.provider === 'groq') {
        const endpoint = aiConfig.provider === 'openrouter'
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : aiConfig.provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : 'https://api.groq.com/openai/v1/chat/completions';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeKey.trim()}`,
            ...(aiConfig.provider === 'openrouter' ? { 'HTTP-Referer': 'http://localhost:5173', 'X-Title': 'Marketing OS' } : {})
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt }
            ],
            temperature: 0.4,
            max_tokens: 3500
          })
        });
        if (res.ok) {
          const d = await res.json();
          rawText = d?.choices?.[0]?.message?.content || '';
        }
      }

      if (rawText) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return buildCompleteShowroomFromParsed({
            parsed,
            brand,
            wizardData: { ...wizardData, businessType, tagline, topOfferings, target, keyPain, primaryObjection, aestheticVibe, calculatorType, customImageUrl }
          });
        }
      }
    } catch (e) {
      console.warn('Fallo en la generación LLM en vivo del showroom, usando motor heurístico enriquecido:', e);
    }
  }

  // 2. MOTOR HEURÍSTICO MULTI-INDUSTRIA (OFFLINE / LOCAL SEGURO)
  await new Promise((r) => setTimeout(r, 450));
  return buildHeuristicShowroom({
    brand,
    wizardData: { ...wizardData, businessType, tagline, topOfferings, target, keyPain, primaryObjection, aestheticVibe, calculatorType, customImageUrl }
  });
}

function buildCompleteShowroomFromParsed({ parsed, brand, wizardData }) {
  const brandName = brand.name;
  const isTech = wizardData.businessType === 'tech';

  const defaultHeroImage = isTech
    ? './assets/tech_01_code_architecture.jpg'
    : (wizardData.customImageUrl || '');

  const defaultCarouselImages = isTech
    ? [
        './assets/tech_05_hero_tech.jpg',
        './assets/tech_02_cloud_dashboard.jpg',
        './assets/tech_01_code_architecture.jpg',
        './assets/tech_04_mobile_app_flow.jpg',
        './assets/tech_03_team_collaboration.jpg'
      ]
    : [
        wizardData.customImageUrl || '',
        wizardData.customImageUrl || '',
        wizardData.customImageUrl || '',
        wizardData.customImageUrl || '',
        wizardData.customImageUrl || ''
      ];

  const showroomData = {
    linkedin: {
      channel: 'LinkedIn B2B / Autoridad',
      badge: `Post Estratégico de Autoridad · ${brandName}`,
      author: `${brandName} Editorial`,
      authorTitle: `${wizardData.tagline} | ${wizardData.businessType.toUpperCase()}`,
      date: 'Publicado hoy · Generado con IA y validado con Human-in-the-Loop',
      headline: parsed.linkedin?.headline || `Por qué los líderes eligen ${brandName} frente a soluciones tradicionales.`,
      excerpt: parsed.linkedin?.excerpt || parsed.linkedin?.fullText?.slice(0, 220) + '...',
      fullText: parsed.linkedin?.fullText || '',
      hashtags: parsed.linkedin?.hashtags || `#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Liderazgo #Calidad`,
      metrics: parsed.linkedin?.metrics || { likes: '540', comments: '38', shares: '72' },
      image: defaultHeroImage,
      imageCaption: `${brandName} — Propuesta de valor en acción`
    },

    carousel: {
      channel: 'Instagram',
      badge: 'Carrusel Educativo de 5 Slides · Formato 4:5',
      title: parsed.carousel?.title || `5 Claves de Transformación con ${brandName}`,
      subtitle: parsed.carousel?.subtitle || wizardData.tagline,
      slides: (parsed.carousel?.slides || []).map((s, idx) => ({
        slideNum: s.slideNum || idx + 1,
        title: s.title || `Lámina ${idx + 1}`,
        headline: s.headline || '',
        body: s.body || '',
        image: defaultCarouselImages[idx] || defaultHeroImage,
        visualNote: s.visualNote || 'Composición limpia de alto impacto visual'
      })),
      hashtags: parsed.carousel?.hashtags || `#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Tips #Estrategia`
    },

    email: {
      channel: 'E-mail Marketing Consultivo',
      badge: `Email Personalizado · Dirigido a ${wizardData.target.slice(0, 40)}`,
      from: `${brandName} <contacto@${brand.id || 'empresa'}.com>`,
      subject: parsed.email?.subject || `Cómo potenciar sus resultados con ${brandName}`,
      body: parsed.email?.body || '',
      ctaText: parsed.email?.ctaText || 'Agendar Conversación / Diagnóstico',
      ctaUrl: '#contacto-demo'
    },

    reels: {
      channel: 'TikTok / Instagram Reels',
      badge: 'Guion Dinámico de 45 Segundos · Formato 9:16',
      title: parsed.reels?.title || `El secreto de ${brandName}`,
      duration: '45 segundos',
      audioTrack: 'Audio rítmico moderno y sutil',
      hook: parsed.reels?.hook || '¿Sabías que la mayoría comete este error al elegir proveedor?',
      structure: parsed.reels?.structure || [
        { time: '0:00 - 0:03', label: 'Gancho', desc: 'Captura inmediata de la atención' },
        { time: '0:03 - 0:20', label: 'Problema', desc: 'Demostración de la frustración común' },
        { time: '0:20 - 0:35', label: 'Propuesta', desc: 'Cómo actúa la solución de la marca' },
        { time: '0:35 - 0:45', label: 'Llamada', desc: 'Invitación a comentar y seguir' }
      ],
      copy: parsed.reels?.copy || `Descubre la diferencia con ${brandName}. Visita nuestro perfil para más detalles.`
    }
  };

  const calendarData = buildCalendarForCategory({
    brandName,
    businessType: wizardData.businessType,
    offerings: wizardData.topOfferings,
    target: wizardData.target,
    tagline: wizardData.tagline
  });

  const calculatorData = buildCalculatorDefaults(wizardData.calculatorType);

  return { showroomData, calendarData, calculatorData };
}

function buildHeuristicShowroom({ brand, wizardData }) {
  const brandName = brand.name;
  const { businessType, tagline, topOfferings, target, keyPain, primaryObjection, aestheticVibe, calculatorType, customImageUrl } = wizardData;

  const isTech = businessType === 'tech';
  const defaultHeroImage = isTech ? './assets/tech_01_code_architecture.jpg' : (customImageUrl || '');

  const defaultCarouselImages = isTech
    ? [
        './assets/tech_05_hero_tech.jpg',
        './assets/tech_02_cloud_dashboard.jpg',
        './assets/tech_01_code_architecture.jpg',
        './assets/tech_04_mobile_app_flow.jpg',
        './assets/tech_03_team_collaboration.jpg'
      ]
    : [customImageUrl || '', customImageUrl || '', customImageUrl || '', customImageUrl || '', customImageUrl || ''];

  const showroomData = {
    linkedin: {
      channel: 'LinkedIn B2B / Autoridad',
      badge: `Post Ejecutivo de Autoridad · ${brandName}`,
      author: `${brandName} Labs`,
      authorTitle: `${tagline} | ${businessType.toUpperCase()}`,
      date: 'Publicado hoy · Generado con IA y validado con Human-in-the-Loop',
      headline: `Por qué quienes lideran en nuestro sector están transformando su estrategia con ${brandName}.`,
      excerpt: `En un mercado saturado de promesas superficiales, el verdadero valor reside en la consistencia y la capacidad de resolver problemas reales...`,
      fullText: `En un mercado saturado de promesas superficiales, el verdadero valor reside en la consistencia y en la capacidad de resolver problemas reales para ${target}.

Durante mucho tiempo, las alternativas disponibles obligaban a convivir con un dolor constante: ${keyPain}.

En ${brandName} nacimos para cambiar esa dinámica bajo un principio irrenunciable: ${tagline}.

1. Solución Fundamentada y Tangible:
Nuestra propuesta no agrega complejidad innecesaria. Se centra en ${topOfferings.slice(0, 150)}, garantizando resultados medibles desde el primer momento.

2. Derribando el Mayor Freno:
Sabemos que la principal duda siempre es: "${primaryObjection}". Por eso diseñamos un modelo transparente, con acompañamiento cercano y garantías claras.

3. Impacto Sostenible:
Trabajamos para que cada decisión genere retorno duradero, protegiendo la confianza y el tiempo de nuestros clientes.

¿Cómo está abordando su organización este desafío este trimestre? Los leo en comentarios.`,
      hashtags: `#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Innovacion #Calidad #Liderazgo`,
      metrics: { likes: '480', comments: '34', shares: '62' },
      image: defaultHeroImage,
      imageCaption: `${brandName} — Excelencia y propósito en cada detalle`
    },

    carousel: {
      channel: 'Instagram',
      badge: 'Carrusel Educativo de 5 Slides · Formato 4:5',
      title: `5 Señales de que necesitas un nuevo enfoque con ${brandName}`,
      subtitle: `Cómo pasar de la frustración a la tranquilidad con ${tagline}`,
      slides: [
        {
          slideNum: 1,
          title: 'Portada / Hook (0-3s)',
          headline: `¿Sientes que ${keyPain.toLowerCase().slice(0, 60)} te frena todos los días?`,
          body: `El costo de postergar una solución real es mucho mayor de lo que imaginas.`,
          image: defaultCarouselImages[0] || defaultHeroImage,
          visualNote: 'Diseño minimalista de alto contraste centrado en la identidad de marca.'
        },
        {
          slideNum: 2,
          title: 'El Síntoma Invisible',
          headline: 'Parches temporales que no van a la raíz del problema',
          body: `Cuando se intenta solucionar sin un método probado, el desgaste del equipo y el presupuesto se multiplican.`,
          image: defaultCarouselImages[1] || defaultHeroImage,
          visualNote: 'Visualización clara del cuello de botella y la fricción.'
        },
        {
          slideNum: 3,
          title: `El Enfoque ${brandName}`,
          headline: `${tagline}`,
          body: `Nos enfocamos en ${topOfferings.slice(0, 120)}, combinando rigor profesional y trato humano.`,
          image: defaultCarouselImages[2] || defaultHeroImage,
          visualNote: 'Presentación limpia de los servicios y diferenciales de la marca.'
        },
        {
          slideNum: 4,
          title: 'La Objeción Resuelta',
          headline: `¿Preocupado por: "${primaryObjection.slice(0, 50)}"?`,
          body: `En ${brandName} garantizamos transparencia total, procesos claros y respaldo continuo en cada etapa.`,
          image: defaultCarouselImages[3] || defaultHeroImage,
          visualNote: 'Elementos de seguridad, métricas y sellos de confianza.'
        },
        {
          slideNum: 5,
          title: 'Cierre Consultivo & CTA',
          headline: `Da el paso hacia un estándar superior`,
          body: `Guarda este carrusel para tu equipo y contáctanos para un diagnóstico inicial sin compromiso.`,
          image: defaultCarouselImages[4] || defaultHeroImage,
          visualNote: 'Cierre de marca con logo oficial y llamado a la acción.'
        }
      ],
      hashtags: `#${brandName.replace(/[^a-zA-Z0-9]/g, '')} #Estrategia #Crecimiento #Calidad`
    },

    email: {
      channel: 'E-mail Marketing Consultivo',
      badge: `Email de Valor · Dirigido a ${target.slice(0, 35)}`,
      from: `${brandName} <contacto@${brand.id || 'empresa'}.com>`,
      subject: `Una mirada honesta sobre cómo resolver ${keyPain.toLowerCase().slice(0, 40)}`,
      body: `Estimado(a) amigo(a),

Sabemos que cuando se trata de tomar decisiones estratégicas, el mayor desafío no es encontrar opciones, sino encontrar una en la que realmente puedas confiar.

Muchas personas y empresas nos consultan frustradas por lo mismo: ${keyPain}.

En ${brandName} abordamos esta realidad con una premisa muy clara: ${tagline}.

Nuestra propuesta se basa en:
• ${topOfferings.slice(0, 160)}
• Atención personalizada y directa con especialistas que entienden tu contexto.
• Cero letra chica y respuesta a la duda más frecuente: ${primaryObjection}.

Nos encantaría compartir contigo un diagnóstico breve y sin costo para ver si hacemos buen equipo.

Un saludo cordial,

El Equipo de ${brandName}
${tagline}`,
      ctaText: `Agendar Conversación con ${brandName}`,
      ctaUrl: '#contacto-demo'
    },

    reels: {
      channel: 'TikTok / Instagram Reels',
      badge: 'Guion Dinámico de 45 Segundos · Formato 9:16',
      title: `Lo que nadie te dice sobre ${tagline}`,
      duration: '45 segundos',
      audioTrack: 'Audio rítmico moderno y minimalista',
      hook: `¿Alguna vez te pasó que ${keyPain.toLowerCase().slice(0, 60)}? (Primeros 3 segundos)`,
      structure: [
        { time: '0:00 - 0:03', label: 'Gancho (0-3s)', desc: `¿Cansado de lidiar con ${keyPain.slice(0, 45)}?` },
        { time: '0:03 - 0:20', label: 'La Frustración', desc: 'Muestra en pantalla el contraste de las soluciones lentas o poco transparentes.' },
        { time: '0:20 - 0:35', label: 'La Solución', desc: `Cómo ${brandName} resuelve el problema con ${topOfferings.slice(0, 60)}.` },
        { time: '0:35 - 0:45', label: 'Llamada (CTA)', desc: `Comenta 'INFO' o visita el perfil de ${brandName} para empezar.` }
      ],
      copy: `No tienes por qué convivir con la fricción. Descubre cómo ${brandName} (${tagline}) transforma la experiencia de ${target}.`
    }
  };

  const calendarData = buildCalendarForCategory({
    brandName,
    businessType,
    offerings: topOfferings,
    target,
    tagline
  });

  const calculatorData = buildCalculatorDefaults(calculatorType);

  return { showroomData, calendarData, calculatorData };
}

function buildCalendarForCategory({ brandName, businessType, offerings, target, tagline }) {
  return [
    {
      id: 'cal-1',
      week: 'Semana 1',
      day: 'Martes',
      channel: 'LinkedIn B2B',
      format: 'Post de Autoridad (16:9)',
      pillar: 'Educar (40 %)',
      pillarBadge: 'badge-blue',
      title: `El costo oculto de postergar soluciones en nuestro sector`,
      hook: `¿Cuánto cuesta no resolver las ineficiencias a tiempo?`,
      summary: `Artículo analítico enfocado en valor real y mejores prácticas para ${target.slice(0, 40)}.`,
      target
    },
    {
      id: 'cal-2',
      week: 'Semana 1',
      day: 'Jueves',
      channel: 'Instagram',
      format: 'Carrusel (5 Slides 4:5)',
      pillar: 'Educar (40 %)',
      pillarBadge: 'badge-blue',
      title: `5 Señales de que necesitas modernizar tu enfoque`,
      hook: 'Revisa este checklist rápido para evaluar tu situación actual.',
      summary: `Infografía pedagógica paso a paso con la metodología de ${brandName}.`,
      target
    },
    {
      id: 'cal-3',
      week: 'Semana 1',
      day: 'Viernes',
      channel: 'TikTok / Reels',
      format: 'Video Vertical (9:16)',
      pillar: 'Inspirar (30 %)',
      pillarBadge: 'badge-purple',
      title: `Antes vs. Después de implementar ${brandName}`,
      hook: 'De la frustración a la claridad en menos de 45 segundos.',
      summary: 'Demostración dinámica con gancho en los primeros 3 segundos.',
      target
    },
    {
      id: 'cal-4',
      week: 'Semana 2',
      day: 'Martes',
      channel: 'LinkedIn B2B',
      format: 'Caso de Éxito (16:9)',
      pillar: 'Educar (40 %)',
      pillarBadge: 'badge-blue',
      title: `Cómo medir el retorno real de nuestra inversión`,
      hook: 'Cifras y métricas que demuestran la amortización de la propuesta.',
      summary: 'Desglose transparente de resultados e impacto económico.',
      target
    },
    {
      id: 'cal-5',
      week: 'Semana 2',
      day: 'Jueves',
      channel: 'E-mail Marketing',
      format: 'Boletín Ejecutivo',
      pillar: 'Educar (40 %)',
      pillarBadge: 'badge-blue',
      title: `Guía práctica de implementación para líderes`,
      hook: '3 pasos para avanzar sin fricción técnica.',
      summary: `Correo electrónico con valor táctico directo para ${target.slice(0, 40)}.`,
      target
    },
    {
      id: 'cal-6',
      week: 'Semana 2',
      day: 'Viernes',
      channel: 'Instagram',
      format: 'Story Interactiva + Reel',
      pillar: 'Involucrar (30 %)',
      pillarBadge: 'badge-pink',
      title: `Encuesta: ¿Cuál es tu mayor obstáculo en este momento?`,
      hook: 'Vota en la encuesta y cuéntanos en comentarios.',
      summary: 'Interacción con stickers, preguntas y respuestas de la comunidad.',
      target
    },
    {
      id: 'cal-7',
      week: 'Semana 3',
      day: 'Martes',
      channel: 'LinkedIn B2B',
      format: 'Thought Leadership',
      pillar: 'Inspirar (30 %)',
      pillarBadge: 'badge-purple',
      title: `El futuro de nuestro rubro: hacia dónde va la excelencia`,
      hook: 'Las organizaciones que no evolucionen perderán competitividad.',
      summary: `Visión de la dirección de ${brandName} sobre innovación y propósito.`,
      target
    },
    {
      id: 'cal-8',
      week: 'Semana 3',
      day: 'Jueves',
      channel: 'Instagram',
      format: 'Carrusel (5 Slides 4:5)',
      pillar: 'Educar (40 %)',
      pillarBadge: 'badge-blue',
      title: `Checklist para elegir proveedor sin equivocarte`,
      hook: '¿Tu alternativa actual cumple con estos 4 estándares de calidad?',
      summary: 'Criterios de evaluación transparentes para tomar decisiones informadas.',
      target
    },
    {
      id: 'cal-9',
      week: 'Semana 3',
      day: 'Viernes',
      channel: 'TikTok / Reels',
      format: 'Video Corto (9:16)',
      pillar: 'Involucrar (30 %)',
      pillarBadge: 'badge-pink',
      title: `Mito vs. Realidad sobre nuestros servicios`,
      hook: "Mito: 'Es muy difícil de implementar'. Realidad: en 7 días ves avances.",
      summary: 'Desmitificando dudas con tono cercano, cálido y fundamentado.',
      target
    },
    {
      id: 'cal-10',
      week: 'Semana 4',
      day: 'Martes',
      channel: 'LinkedIn B2B',
      format: 'Artículo de Opinión',
      pillar: 'Inspirar (30 %)',
      pillarBadge: 'badge-purple',
      title: `Por qué el trato humano y la ética son el mayor diferencial`,
      hook: 'Cuando pones al cliente en el centro, el crecimiento se vuelve natural.',
      summary: 'Reflexión profunda sobre cultura de servicio y fidelización.',
      target
    },
    {
      id: 'cal-11',
      week: 'Semana 4',
      day: 'Jueves',
      channel: 'E-mail Marketing',
      format: 'Email de Conversión',
      pillar: 'Involucrar (30 %)',
      pillarBadge: 'badge-pink',
      title: `Invitación exclusiva a sesión de diagnóstico con ${brandName}`,
      hook: 'Plazas limitadas este mes para atención personalizada.',
      summary: 'Llamado a la acción directo con propuesta de valor transparente.',
      target
    },
    {
      id: 'cal-12',
      week: 'Semana 4',
      day: 'Viernes',
      channel: 'Instagram',
      format: 'Reel Resumen Mensual',
      pillar: 'Inspirar (30 %)',
      pillarBadge: 'badge-purple',
      title: `Los 3 aprendizajes de este mes en ${brandName}`,
      hook: 'Tres historias reales de impacto y crecimiento este mes.',
      summary: 'Cierre del mes agradeciendo y celebrando con la comunidad.',
      target
    }
  ];
}

function buildCalculatorDefaults(calculatorType) {
  if (calculatorType === 'd2c_retention') {
    return {
      type: 'd2c_retention',
      subscribers: 1000,
      avgTicket: 45,
      currentRepurchase: 20,
      projectedRepurchase: 40
    };
  }
  if (calculatorType === 'clients_gain') {
    return {
      type: 'clients_gain',
      monthlyLeads: 80,
      conversionRate: 15,
      avgClientValue: 650,
      investmentMonthly: 750
    };
  }
  // Default: B2B efficiency
  return {
    type: 'roi_b2b',
    teamSize: 20,
    hoursSavedPerPersonMonth: 12,
    avgHourlyRate: 30,
    monthlyCost: 800
  };
}