import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Sparkles, FileText, Upload, Trash2,
  Layers, Cpu, BarChart3, BookOpen, Eye, Download,
  RotateCcw, ArrowRight, Edit3, Copy, Check, GitBranch, X, Wand2,
  Key, ShieldAlert, ShieldCheck, Play, Sliders, Image as ImageIcon, Lock, Unlock,
  Printer, Globe, FileDown, Sun, Moon
} from 'lucide-react';
import { INITIAL_BRANDS } from './data/initialBrands';
import { SKILL_TEMPLATES, compileSkillMarkdown } from './data/initialSkills';
import { extractTextFromFile } from './utils/pdfReader';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { exportToPdf } from './utils/exportPdf';
import { ShowroomStep4 } from './components/ShowroomStep4';
import {
  AI_PROVIDERS,
  analyzeToneLive,
  getSampleDraftsForBrand,
  getSkillSamplePrompts,
  generateDynamicVisualForSkill06,
  executeSkillWithAI,
  designSkillWithAI
} from './utils/aiEngine';

export default function App() {
  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('ai_mkt_os_brands_v2');
    if (!saved) return INITIAL_BRANDS;
    try {
      const parsed = JSON.parse(saved);
      // Auto-migrate any custom brands away from Taranis images
      return parsed.map((b) => {
        const isTaranis = b.id === 'taranis-black';
        const isPenelope = b.id === 'penelope-skincare' || (b.name || '').toLowerCase().includes('penélope');
        if (!isTaranis && !isPenelope) {
          let updated = { ...b };
          // Clean Taranis ruta0 cases if leaked
          if (updated.ruta0Cases?.[0]?.title?.includes('Taranis') || updated.ruta0Cases?.[0]?.title?.includes('Guardián del Tono de Voz y Multiplicador Multicanal («Taranis')) {
            updated.ruta0Cases = [
              {
                id: `${b.id}-caso-1`,
                title: `1. Guardián de Tono y Multiplicador Multicanal (${b.name})`,
                pain: 'Mantener consistencia en los mensajes y multiplicar contenidos sin perder la esencia de la marca.',
                aiType: 'IA Generativa de Texto (LLMs + RAG)',
                aiJustification: 'Automatiza la adaptación multicanal y audita el tono de voz con calificaciones estructuradas.',
                hitl: 'Revisión editorial humana antes de la publicación definitiva.',
                quadrant: 'Quick Win (Prioridad 1 — Mes 1)',
                hoursSaved: '40 h/mes'
              },
              {
                id: `${b.id}-caso-2`,
                title: '2. Creación de Activos Visuales y Campañas In-House',
                pain: 'Dependencia de terceros o demoras para crear piezas gráficas adaptadas al catálogo.',
                aiType: 'IA Multimodal (Texto a Imagen)',
                aiJustification: 'Permite generar conceptos visuales y dirección de arte coherente con el posicionamiento.',
                hitl: 'Curaduría y aprobación de dirección de arte humana.',
                quadrant: 'Quick Win Creativo (Prioridad 2 — Mes 1-2)',
                hoursSaved: '20 h/mes'
              },
              {
                id: `${b.id}-caso-3`,
                title: '3. Asistencia Ágil a Consultas y Calificación de Oportunidades',
                pain: 'Tiempos de respuesta lentos en canales digitales y pérdida de clientes potenciales.',
                aiType: 'IA Asistencial (Clasificación & Reglas)',
                aiJustification: 'Responde dudas frecuentes del catálogo al instante y escala casos especiales.',
                hitl: 'Escalamiento obligatorio a un especialista humano en cotizaciones y consultas sensibles.',
                quadrant: 'Proyecto Estratégico (Prioridad 3 — Meses 2-4)',
                hoursSaved: '25 h/mes'
              }
            ];
          }
          // Clean Taranis calendar if leaked
          if (updated.calendarData?.[0]?.summary?.includes('ABERGO') || updated.calendarData?.[0]?.summary?.includes('ErgoPro') || updated.calendarData?.[0]?.title?.includes('lumbar')) {
            delete updated.calendarData;
          }
          // Clean showroom images
          if (updated.showroomData) {
            const s = { ...updated.showroomData };
            if (s.linkedin?.image && s.linkedin.image.includes('05_showroom.jpg')) {
              s.linkedin = {
                ...s.linkedin,
                image: './assets/tech_01_code_architecture.jpg',
                imageCaption: `${b.name} — Propuesta de valor en acción`
              };
            }
            if (s.carousel?.slides) {
              const techImgs = [
                './assets/tech_05_hero_tech.jpg',
                './assets/tech_02_cloud_dashboard.jpg',
                './assets/tech_01_code_architecture.jpg',
                './assets/tech_04_mobile_app_flow.jpg',
                './assets/tech_03_team_collaboration.jpg'
              ];
              s.carousel = {
                ...s.carousel,
                slides: s.carousel.slides.map((sl, idx) => ({
                  ...sl,
                  image: (sl.image && sl.image.includes('05_showroom.jpg')) ? techImgs[idx % 5] : sl.image
                }))
              };
            }
            updated.showroomData = s;
          }
          return updated;
        }
        return b;
      });
    } catch {
      return INITIAL_BRANDS;
    }
  });
  const [activeBrandId, setActiveBrandId] = useState('taranis-black');
  const [activeTab, setActiveTab] = useState('playground-step3');

  // AI Multi-Model Configuration (saved in localStorage per-provider)
  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('ai_mkt_os_aiconfig_v2') || localStorage.getItem('ai_mkt_os_aiconfig_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const apiKeys = parsed.apiKeys || {};
        if (parsed.apiKey && parsed.provider && !apiKeys[parsed.provider]) {
          apiKeys[parsed.provider] = parsed.apiKey;
        }
        const activeProvider = parsed.provider || 'local-sim';
        return {
          provider: activeProvider,
          model: parsed.model || 'respuestas-reales-validadas-v3',
          apiKeys,
          apiKey: apiKeys[activeProvider] || ''
        };
      } catch {
        // Fallback
      }
    }
    return {
      provider: 'local-sim',
      model: 'respuestas-reales-validadas-v3',
      apiKeys: {},
      apiKey: ''
    };
  });
  const [showApiConfigModal, setShowApiConfigModal] = useState(false);

  // Light / Dark Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('orbia_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('orbia_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Custom AI Model Mode state
  const [isCustomModelMode, setIsCustomModelMode] = useState(false);

  // Wide Pop-up Modals state
  const [showNewBrandModal, setShowNewBrandModal] = useState(false);
  const [editingIdentityModal, setEditingIdentityModal] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);
  const [previewDocModal, setPreviewDocModal] = useState(null);

  // Skill Creation Wizard & Studio state
  const [showSkillTemplateModal, setShowSkillTemplateModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isNewSkillFlag, setIsNewSkillFlag] = useState(false);
  const [copiedSkillId, setCopiedSkillId] = useState('');

  // AI Skill Auto-Designer State
  const [aiSkillIdea, setAiSkillIdea] = useState('');
  const [isDesigningSkill, setIsDesigningSkill] = useState(false);
  const [aiSkillNotice, setAiSkillNotice] = useState('');
  const [aiSkillError, setAiSkillError] = useState('');

  // Step 3 Playground & Tone Guardian state
  const [playgroundSubMode, setPlaygroundSubMode] = useState('skill-runner');
  const [toneDraft, setToneDraft] = useState('');
  const [selectedRunnerSkillId, setSelectedRunnerSkillId] = useState('');
  const [runnerInput, setRunnerInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es'); // 'es' | 'pt' | 'en'
  const [modalViewMode, setModalViewMode] = useState('markdown'); // 'markdown' | 'raw'
  const [aiOutputModal, setAiOutputModal] = useState(null); // { title, badge, content, images: [] }
  const [isRunningAI, setIsRunningAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Tag inputs for dynamic vocabulary
  const [newApprovedWord, setNewApprovedWord] = useState('');
  const [newForbiddenWord, setNewForbiddenWord] = useState('');

  // PDF / File reader state
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileError, setFileError] = useState('');

  // New brand form state
  const [newBrandForm, setNewBrandForm] = useState({
    name: '',
    tagline: '',
    industry: '',
    targetAudience: '',
    catalogRules: '',
    forbiddenCsv: 'barato, liquidación, compra ahora, milagroso'
  });

  useEffect(() => {
    localStorage.setItem('ai_mkt_os_brands_v2', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('ai_mkt_os_aiconfig_v2', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // Auto-migrate if stored model was deprecated (e.g. gemini-2.5-pro -> gemini-3.8-flash)
  useEffect(() => {
    if (aiConfig.model === 'gemini-2.5-pro' || aiConfig.model === 'models/gemini-2.5-pro') {
      setAiConfig((prev) => ({ ...prev, model: 'gemini-3.8-flash' }));
    }
  }, [aiConfig.model]);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const brandSkills = activeBrand.skills || [];
  const selectedRunnerSkill = brandSkills.find((s) => s.id === selectedRunnerSkillId) || brandSkills[0] || null;
  const skillSpecificSamples = getSkillSamplePrompts(selectedRunnerSkill, activeBrand);

  // Is Real AI connected (provider !== 'local-sim' and has API Key for current provider)?
  const activeKeyForCurrentProvider = aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || '';
  const isRealAIActive = aiConfig.provider !== 'local-sim' && Boolean(activeKeyForCurrentProvider.trim());

  // When active brand changes, reset default tone draft & select first skill
  useEffect(() => {
    const samples = getSampleDraftsForBrand(activeBrand);
    setToneDraft(samples[0]?.text || '');
    if (brandSkills.length > 0) {
      setSelectedRunnerSkillId(brandSkills[0].id);
      const firstSkillSamples = getSkillSamplePrompts(brandSkills[0], activeBrand);
      setRunnerInput(firstSkillSamples[0]?.prompt || '');
    } else {
      setSelectedRunnerSkillId('');
      setRunnerInput('');
    }
  }, [activeBrand.id]);

  // Whenever the user changes the selected Skill in the dropdown, load that Skill's specific sample prompt
  const handleSelectRunnerSkillChange = (newSkillId) => {
    setSelectedRunnerSkillId(newSkillId);
    const targetSkill = brandSkills.find((s) => s.id === newSkillId);
    if (targetSkill) {
      const samples = getSkillSamplePrompts(targetSkill, activeBrand);
      if (samples.length > 0) {
        setRunnerInput(samples[0].prompt);
      }
    }
  };

  const updateActiveBrand = (updater) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === activeBrand.id ? (typeof updater === 'function' ? updater(b) : { ...b, ...updater }) : b
      )
    );
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('ai_mkt_os_brands_v2');
    setBrands(INITIAL_BRANDS);
    setActiveBrandId('taranis-black');
  };

  const handleAddApprovedWord = (e) => {
    e.preventDefault();
    const w = newApprovedWord.trim();
    if (!w) return;
    if (!activeBrand.approvedWords.includes(w)) {
      updateActiveBrand((b) => ({ ...b, approvedWords: [...b.approvedWords, w] }));
    }
    setNewApprovedWord('');
  };

  const handleAddForbiddenWord = (e) => {
    e.preventDefault();
    const w = newForbiddenWord.trim().toLowerCase();
    if (!w) return;
    if (!activeBrand.forbiddenWords.includes(w)) {
      updateActiveBrand((b) => ({ ...b, forbiddenWords: [...b.forbiddenWords, w] }));
    }
    setNewForbiddenWord('');
  };

  const handleSavePillarModal = (e) => {
    e.preventDefault();
    if (!editingPillar) return;
    updateActiveBrand((b) => {
      const exists = b.pillars.some((p) => p.id === editingPillar.id);
      return {
        ...b,
        pillars: exists
          ? b.pillars.map((p) => (p.id === editingPillar.id ? editingPillar : p))
          : [...b.pillars, editingPillar]
      };
    });
    setEditingPillar(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingFile(true);
    setFileError('');
    try {
      const extracted = await extractTextFromFile(file);
      updateActiveBrand((b) => ({
        ...b,
        knowledgeDocs: [extracted, ...(b.knowledgeDocs || [])]
      }));
      setPreviewDocModal(extracted);
    } catch (err) {
      setFileError(err.message || 'Error al leer el archivo');
    } finally {
      setIsReadingFile(false);
      e.target.value = '';
    }
  };

  const handleStartAddSkill = () => {
    setShowSkillTemplateModal(true);
  };

  const handleSelectSkillTemplate = (tpl) => {
    const nextNum = String(brandSkills.length + 1).padStart(2, '0');
    const brandPrefix = activeBrand.id.split('-')[0];
    const baseSlug = tpl.defaultName
      ? tpl.defaultName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : 'nueva-skill';

    setEditingSkill({
      id: `${brandPrefix}-skill-${Date.now()}`,
      code: nextNum,
      slug: `${brandPrefix}-${nextNum}-${baseSlug}`,
      name: tpl.defaultName ? `${tpl.defaultName} (${activeBrand.name})` : '',
      category: tpl.category,
      badgeColor: tpl.badgeColor,
      painSolved: tpl.defaultPain,
      roleBlock: tpl.roleBlock,
      knowledgeBlock: tpl.knowledgeBlock,
      outputBlock: tpl.outputBlock,
      guardrailsBlock: tpl.guardrailsBlock
    });
    setIsNewSkillFlag(true);
    setShowSkillTemplateModal(false);
  };

  const handleAiDesignSkill = async (customIdea) => {
    const ideaToUse = (typeof customIdea === 'string' ? customIdea : aiSkillIdea) || editingSkill?.name || '';
    if (!ideaToUse.trim()) {
      setAiSkillError('Por favor escribe una breve idea o necesidad para que la IA diseñe la skill.');
      return;
    }
    setIsDesigningSkill(true);
    setAiSkillError('');
    setAiSkillNotice('');
    try {
      const activeKeyForCurrent = aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || '';
      const activeAiConf = { ...aiConfig, apiKey: activeKeyForCurrent };
      const generated = await designSkillWithAI({
        userIdea: ideaToUse,
        brand: activeBrand,
        aiConfig: activeAiConf
      });
      if (generated) {
        setEditingSkill((prev) => ({
          ...prev,
          name: generated.name || prev?.name || '',
          slug: generated.slug || prev?.slug || '',
          painSolved: generated.painSolved || prev?.painSolved || '',
          category: generated.category || prev?.category || '',
          badgeColor: generated.badgeColor || prev?.badgeColor || 'badge-purple',
          roleBlock: generated.roleBlock || prev?.roleBlock || '',
          knowledgeBlock: generated.knowledgeBlock || prev?.knowledgeBlock || '',
          outputBlock: generated.outputBlock || prev?.outputBlock || '',
          guardrailsBlock: generated.guardrailsBlock || prev?.guardrailsBlock || ''
        }));
        setAiSkillNotice(`¡Skill "${generated.name}" diseñada y autocompletada con éxito! Revisa los campos y pulsa Guardar.`);
      }
    } catch (err) {
      setAiSkillError(err.message || 'Error al generar la skill con IA.');
    } finally {
      setIsDesigningSkill(false);
    }
  };

  const handleSaveSkillModal = (e) => {
    e.preventDefault();
    if (!editingSkill) return;
    updateActiveBrand((b) => {
      const currentSkills = b.skills || [];
      const exists = currentSkills.some((s) => s.id === editingSkill.id);
      return {
        ...b,
        skills: exists
          ? currentSkills.map((s) => (s.id === editingSkill.id ? editingSkill : s))
          : [...currentSkills, editingSkill]
      };
    });
    setEditingSkill(null);
    setIsNewSkillFlag(false);
  };

  const handleDeleteSkill = (skillId) => {
    updateActiveBrand((b) => ({
      ...b,
      skills: (b.skills || []).filter((s) => s.id !== skillId)
    }));
    if (editingSkill?.id === skillId) {
      setEditingSkill(null);
    }
  };

  const handleCopySkillMd = (skill) => {
    const md = compileSkillMarkdown(skill, activeBrand);
    navigator.clipboard.writeText(md);
    setCopiedSkillId(skill.id);
    setTimeout(() => setCopiedSkillId(''), 2000);
  };

  const handleDownloadSkillMd = (skill) => {
    const md = compileSkillMarkdown(skill, activeBrand);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.slug}-SKILL.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunToneGuardianAI = async () => {
    setIsRunningAI(true);
    setAiError('');
    try {
      const guardianSkill =
        brandSkills.find((s) => s.slug.includes('guardian') || s.slug.includes('tono')) || {
          code: '02',
          slug: 'guardian-tono',
          name: `Guardián del Tono de Voz (${activeBrand.name})`,
          roleBlock: 'Eres el Guardián del Tono de Voz de {{empresa}}.',
          knowledgeBlock: 'Pilares:\n{{pilares_tono}}\nVocabulario Prohibido: {{vocabulario_prohibido}}',
          outputBlock: 'Entrega Calificación 1-10, Puntos fuertes, Desvíos y Versión reescrita.',
          guardrailsBlock: 'Bloquea: {{vocabulario_prohibido}}'
        };

      const activeAiConfig = {
        ...aiConfig,
        apiKey: aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || ''
      };

      const output = await executeSkillWithAI({
        skill: guardianSkill,
        userInput: `Audita y reescribe este borrador en el tono oficial de ${activeBrand.name}:\n\n"${toneDraft}"`,
        brand: activeBrand,
        aiConfig: activeAiConfig,
        targetLanguage
      });

      setAiOutputModal({
        title: `Resultado del Guardián de Tono — ${activeBrand.name}`,
        badge: isRealAIActive
          ? `🔑 IA Real: ${aiConfig.provider.toUpperCase()} (${aiConfig.model})`
          : '⚡ Simulador Local (Respuesta Real Pre-Validada)',
        content: output,
        images: []
      });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsRunningAI(false);
    }
  };

  const handleRunSelectedSkill = async () => {
    if (!selectedRunnerSkill) return;
    setIsRunningAI(true);
    setAiError('');
    try {
      const activeAiConfig = {
        ...aiConfig,
        apiKey: aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || ''
      };

      const output = await executeSkillWithAI({
        skill: selectedRunnerSkill,
        userInput: runnerInput,
        brand: activeBrand,
        aiConfig: activeAiConfig,
        targetLanguage
      });

      const attachedImages = await generateDynamicVisualForSkill06({
        skill: selectedRunnerSkill,
        userInput: runnerInput,
        aiTextResponse: output,
        brand: activeBrand,
        aiConfig: activeAiConfig
      });

      setAiOutputModal({
        title: `Ejecución: ${selectedRunnerSkill.name}`,
        badge: isRealAIActive
          ? `🔑 IA Real: ${aiConfig.provider.toUpperCase()} (${aiConfig.model})`
          : '⚡ Simulador Local (Respuesta Real Pre-Validada)',
        content: output,
        images: attachedImages
      });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsRunningAI(false);
    }
  };

  const handleCreateNewBrand = (e) => {
    e.preventDefault();
    if (!newBrandForm.name.trim()) return;
    const id = newBrandForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = {
      id,
      name: newBrandForm.name.trim(),
      tagline: newBrandForm.tagline.trim() || 'Estrategia Multicanal Impulsada por IA',
      industry: newBrandForm.industry.trim() || 'Corporativo / Digital',
      accentColor: '#9333ea',
      targetAudience: newBrandForm.targetAudience.trim() || 'Clientes B2B y D2C',
      teamContext: 'Workspace personalizado creado dinámicamente en AI Marketing OS.',
      nngProfile: 'Profesional · Cercana · Fundamentada · Clara',
      skills: [],
      kpis: [
        { label: 'Horas Ahorradas', value: '~85 h/mes', sub: 'Automatización multicanal con Skills' },
        { label: 'Consistencia Verbal', value: '100 %', sub: 'Auditado por Guardián de Tono' },
        { label: 'Velocidad de Creación', value: '4x', sub: 'De artículo base a redes y email' },
        { label: 'SLA Atención Redes', value: '<15 min', sub: 'Triaje automatizado con HITL' }
      ],
      executiveSummary: {
        to: `Dirección Ejecutiva — ${newBrandForm.name}`,
        from: 'Julia Daniela Rodriguez (AI Marketing Architect)',
        subject: `Despliegue de Ecosistema de Skills y Gobernanza de IA para ${newBrandForm.name}`,
        diagnosis: `El equipo de marketing de ${newBrandForm.name} requiere escalar su producción multicanal manteniendo consistencia en su tono de voz y velocidad de respuesta.`,
        initiatives: [
          'Quick Win 1: Creación de Skills a medida con los pilares de la marca.',
          'Quick Win 2: Dirección visual in-house y validación automática de vocabulario.',
          'Estratégico: Orquestador central con checklist de gobernanza.'
        ],
        impact: 'Reducción del 70 % en tiempos operativos y control Human-in-the-Loop en cada publicación.'
      },
      ruta0Cases: [
        {
          id: `${id}-caso-1`,
          title: `1. Guardián de Tono y Multiplicador Multicanal (${newBrandForm.name.trim()})`,
          pain: 'Mantener consistencia en los mensajes y multiplicar contenidos sin perder la esencia de la marca.',
          aiType: 'IA Generativa de Texto (LLMs + RAG)',
          aiJustification: 'Automatiza la adaptación multicanal y audita el tono de voz con calificaciones estructuradas.',
          hitl: 'Revisión editorial humana antes de la publicación definitiva.',
          quadrant: 'Quick Win (Prioridad 1 — Mes 1)',
          hoursSaved: '40 h/mes'
        },
        {
          id: `${id}-caso-2`,
          title: '2. Creación de Activos Visuales y Campañas In-House',
          pain: 'Dependencia de terceros o demoras para crear piezas gráficas adaptadas al catálogo.',
          aiType: 'IA Multimodal (Texto a Imagen)',
          aiJustification: 'Permite generar conceptos visuales y dirección de arte coherente con el posicionamiento.',
          hitl: 'Curaduría y aprobación de dirección de arte humana.',
          quadrant: 'Quick Win Creativo (Prioridad 2 — Mes 1-2)',
          hoursSaved: '20 h/mes'
        },
        {
          id: `${id}-caso-3`,
          title: '3. Asistencia Ágil a Consultas y Calificación de Oportunidades',
          pain: 'Tiempos de respuesta lentos en canales digitales y pérdida de clientes potenciales.',
          aiType: 'IA Asistencial (Clasificación & Reglas)',
          aiJustification: 'Responde dudas frecuentes del catálogo al instante y escala casos especiales.',
          hitl: 'Escalamiento obligatorio a un especialista humano en cotizaciones y consultas sensibles.',
          quadrant: 'Proyecto Estratégico (Prioridad 3 — Meses 2-4)',
          hoursSaved: '25 h/mes'
        }
      ],
      pillars: [
        {
          id: 'np1',
          name: '1. Claridad y Valor Real',
          definition: 'Comunicamos beneficios concretos y verificables para nuestro público objetivo.',
          exampleYes: `En ${newBrandForm.name} diseñamos soluciones pensadas para generar resultados medibles.`,
          exampleNo: 'Somos los mejores y más mágicos del mundo.'
        },
        {
          id: 'np2',
          name: '2. Empatía con el Cliente',
          definition: 'Hablamos desde el dolor y necesidad real del usuario antes de presentar el producto.',
          exampleYes: 'Sabemos cuánto cuesta perder tiempo en procesos manuales todos los días.',
          exampleNo: '¡Compra ya antes de que se acabe la oferta!'
        }
      ],
      approvedWords: ['calidad comprobada', 'innovación', 'transparencia', 'resultados reales'],
      forbiddenWords: newBrandForm.forbiddenCsv
        .split(',')
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean),
      catalogRules: newBrandForm.catalogRules.trim() || 'Catálogo general de productos y servicios de la marca.',
      knowledgeDocs: []
    };

    setBrands((prev) => [...prev, created]);
    setActiveBrandId(created.id);
    setShowNewBrandModal(false);
    setActiveTab('skills-step2');
  };

  const liveAudit = analyzeToneLive(toneDraft, activeBrand);
  const sampleDrafts = getSampleDraftsForBrand(activeBrand);
  const currentProviderObj = AI_PROVIDERS.find((p) => p.id === aiConfig.provider) || AI_PROVIDERS[0];

  return (
    <div className="app-shell">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src="./assets/Logo-ORBIA.png"
            alt="ORBIA Logo"
            style={{
              height: '62px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              filter: theme === 'dark' ? 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.45))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
          <div>
            <div className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ORBIA</span>
              <span>· AI Marketing OS & Skill Orchestrator</span>
            </div>
            <div className="brand-subtitle">
              Challenge ONE AI (G11) · Por <strong>Julia Daniela Rodriguez</strong>
            </div>
          </div>
        </div>

        <div className="topbar-controls">
          <div className="workspace-switcher">
            <Building2 size={16} color="#c084fc" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Empresa activa:</span>
            <select
              className="workspace-select"
              value={activeBrand.id}
              onChange={(e) => setActiveBrandId(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({(b.skills || []).length} Skills)
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#6366f1" />}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => setShowApiConfigModal(true)}>
            <Key size={14} color={isRealAIActive ? '#10b981' : '#c084fc'} />
            {isRealAIActive
              ? `IA Real: ${aiConfig.provider.toUpperCase()} (${aiConfig.model})`
              : 'Motor: Simulador Local (Solo Lectura)'}
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setShowNewBrandModal(true)}>
            <Plus size={15} /> Nueva Empresa
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleResetDefaults}
            title="Restaurar datos originales de Taranis Black y Penélope"
          >
            <RotateCcw size={14} /> Restaurar Demo
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'ruta0' ? 'active' : ''}`}
          onClick={() => setActiveTab('ruta0')}
        >
          <BarChart3 size={16} /> 1. Ruta 0: Base Estratégica & Gobernanza
        </button>
        <button
          className={`nav-tab ${activeTab === 'brand-dna' ? 'active' : ''}`}
          onClick={() => setActiveTab('brand-dna')}
        >
          <BookOpen size={16} /> 2. ADN de Marca Dinámico & Lector PDF
        </button>
        <button
          className={`nav-tab ${activeTab === 'skills-step2' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills-step2')}
        >
          <Layers size={16} /> 3. Skills de {activeBrand.name.split(' ')[0]} ({brandSkills.length}) & Orquestador
        </button>
        <button
          className={`nav-tab ${activeTab === 'playground-step3' ? 'active' : ''}`}
          onClick={() => setActiveTab('playground-step3')}
        >
          <Cpu size={16} /> 4. Guardián en Vivo & Multi-Modelo API
        </button>
        <button
          className={`nav-tab ${activeTab === 'showroom-step4' ? 'active' : ''}`}
          onClick={() => setActiveTab('showroom-step4')}
        >
          <Sparkles size={16} /> {activeBrand.id === 'taranis-black' ? '5. Showroom Multicanal & ROI NR-17 (Paso 4)' : (activeBrand.id || '').includes('penelope') ? '5. Showroom Multicanal & ROI Penélope (Paso 4)' : `5. Showroom Multicanal & ROI (${activeBrand.name})`}
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="main-container">
        {/* ACTIVE WORKSPACE BANNER */}
        <div
          className="card workspace-banner"
          style={{
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span className="badge badge-purple">WORKSPACE: {activeBrand.name.toUpperCase()}</span>
                <span className="badge badge-green">
                  {brandSkills.length} {brandSkills.length === 1 ? 'Skill Configurada' : 'Skills Configuradas'}
                </span>
                <span className={`badge ${isRealAIActive ? 'badge-green' : 'badge-amber'}`}>
                  {isRealAIActive
                    ? `🔓 IA Real Conectada: ${aiConfig.provider.toUpperCase()} (${aiConfig.model}) · Edición Libre`
                    : '🔒 Modo Simulador Local (Prompts de Ejemplo en Solo Lectura)'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 800 }}>{activeBrand.name}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{activeBrand.tagline}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowApiConfigModal(true)}>
                <Sliders size={14} /> {isRealAIActive ? 'Cambiar Modelo IA' : 'Conectar API Key para Edición Libre'}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleStartAddSkill}>
                <Plus size={14} /> Crear Nueva Skill
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: RUTA 0 */}
        {activeTab === 'ruta0' && (
          <div>
            <div className="kpi-grid">
              {activeBrand.kpis.map((kpi, idx) => (
                <div className="card kpi-card" key={idx}>
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className="kpi-sub">{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="section-header">
                <div className="section-title">
                  <FileText size={20} color="#c084fc" />
                  <span>Resumen Ejecutivo (Correo a Dirección Ejecutiva — Máx. 15 líneas)</span>
                </div>
                <span className="badge badge-purple">Ruta 0 · Validado</span>
              </div>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1.15rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.88rem'
                }}
              >
                <div style={{ marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  <strong>Para:</strong> {activeBrand.executiveSummary.to} &nbsp;|&nbsp; <strong>De:</strong>{' '}
                  {activeBrand.executiveSummary.from}
                </div>
                <div style={{ marginBottom: '0.75rem', color: '#d8b4fe' }}>
                  <strong>Asunto:</strong> {activeBrand.executiveSummary.subject}
                </div>
                <p style={{ marginBottom: '0.55rem' }}>
                  <strong>1. Diagnóstico General:</strong> {activeBrand.executiveSummary.diagnosis}
                </p>
                <div style={{ marginBottom: '0.55rem' }}>
                  <strong>2. Iniciativas de IA Recomendadas (Human-in-the-Loop):</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                    {activeBrand.executiveSummary.initiatives.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p>
                  <strong>3. Impacto y Gobernanza:</strong> {activeBrand.executiveSummary.impact}
                </p>
              </div>
            </div>

            <div className="section-header">
              <div className="section-title">
                <Sparkles size={20} color="#c084fc" />
                <span>Etapa 1 & 2 — AI Canvas, Priorización (Esfuerzo × Impacto) y Supervisión Humana</span>
              </div>
            </div>

            <div className="grid-3">
              {activeBrand.ruta0Cases.map((c) => (
                <div className="card" key={c.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-purple">{c.quadrant}</span>
                      <span className="badge badge-green">Ahorro: {c.hoursSaved}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{c.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      <strong style={{ color: '#fca5a5' }}>• Dolor que resuelve:</strong> {c.pain}
                    </p>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      <strong style={{ color: '#93c5fd' }}>• Tipo de IA ({c.aiType}):</strong> {c.aiJustification}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <strong style={{ color: '#6ee7b7' }}>🛡️ Supervisión Humana (HITL):</strong> {c.hitl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ADN DE MARCA */}
        {activeTab === 'brand-dna' && (
          <div>
            <div className="section-header">
              <div>
                <div className="section-title">
                  <BookOpen size={20} color="#c084fc" />
                  <span>ADN de Marca Dinámico & Base de Conocimiento — {activeBrand.name}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Haz clic en cualquier tarjeta para abrir el <strong>Editor Amplio en Pop-up</strong>. Todo cambio actualiza en vivo las {brandSkills.length} Skills de {activeBrand.name}.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingIdentityModal(true)}>
                <Edit3 size={15} /> Editar Identidad y Catálogo en Pop-up
              </button>
            </div>

            <div className="grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  className="card card-clickable"
                  onClick={() => setEditingIdentityModal(true)}
                  title="Haz clic para abrir el editor amplio"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      1. Identidad General y Reglas de Catálogo
                    </h3>
                    <span className="badge badge-purple">
                      <Edit3 size={12} /> Clic para editar en Pop-up
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Empresa:</span>{' '}
                      <strong>{activeBrand.name}</strong> — {activeBrand.tagline}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Público Objetivo:</span>{' '}
                      {activeBrand.targetAudience}
                    </div>
                    <div
                      style={{
                        marginTop: '0.35rem',
                        padding: '0.85rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.83rem',
                        lineHeight: 1.55
                      }}
                    >
                      <div style={{ color: '#c084fc', fontWeight: 600, marginBottom: '0.25rem' }}>
                        📦 Resumen de Catálogo y Reglas Comerciales (Variable <code>{'{{catalogo_reglas}}'}</code>):
                      </div>
                      {activeBrand.catalogRules}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>
                    2. Matriz de Vocabulario Dinámico de {activeBrand.name}
                  </h3>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#fca5a5' }}>
                      ❌ Vocabulario Prohibido (Variable <code>{'{{vocabulario_prohibido}}'}</code>)
                    </label>
                    <form onSubmit={handleAddForbiddenWord} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        className="form-input"
                        placeholder="Escribe una palabra prohibida y presiona Enter..."
                        value={newForbiddenWord}
                        onChange={(e) => setNewForbiddenWord(e.target.value)}
                      />
                      <button type="submit" className="btn btn-secondary btn-sm">
                        <Plus size={14} /> Agregar
                      </button>
                    </form>
                    <div className="chip-list">
                      {activeBrand.forbiddenWords.map((word) => (
                        <span key={word} className="chip badge-red">
                          {word}
                          <button
                            type="button"
                            onClick={() =>
                              updateActiveBrand((b) => ({
                                ...b,
                                forbiddenWords: b.forbiddenWords.filter((w) => w !== word)
                              }))
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                    <label className="form-label" style={{ color: '#6ee7b7' }}>
                      ✅ Vocabulario Aprobado (Variable <code>{'{{vocabulario_aprobado}}'}</code>)
                    </label>
                    <form onSubmit={handleAddApprovedWord} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        className="form-input"
                        placeholder="Escribe un término aprobado y presiona Enter..."
                        value={newApprovedWord}
                        onChange={(e) => setNewApprovedWord(e.target.value)}
                      />
                      <button type="submit" className="btn btn-secondary btn-sm">
                        <Plus size={14} /> Agregar
                      </button>
                    </form>
                    <div className="chip-list">
                      {activeBrand.approvedWords.map((word) => (
                        <span key={word} className="chip badge-green">
                          {word}
                          <button
                            type="button"
                            onClick={() =>
                              updateActiveBrand((b) => ({
                                ...b,
                                approvedWords: b.approvedWords.filter((w) => w !== word)
                              }))
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="card">
                  <div className="section-header" style={{ marginBottom: '0.65rem' }}>
                    <div className="section-title" style={{ fontSize: '1.05rem' }}>
                      <Upload size={18} color="#c084fc" />
                      <span>3. Base de Conocimiento (Lector de PDF / TXT con pdf.js)</span>
                    </div>
                    <span className="badge badge-blue">Lectura en Pop-up Amplio</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    Sube cualquier PDF o TXT de {activeBrand.name}. Al hacer clic en <strong>Abrir en Pop-up</strong> verás el documento completo sin mini-scrolls.
                  </p>

                  <label className="pdf-dropzone" style={{ display: 'block' }}>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md,.json"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <Upload size={24} color="#c084fc" style={{ marginBottom: '0.35rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      {isReadingFile ? 'Extrayendo texto del PDF...' : 'Haz clic para cargar un archivo .PDF, .TXT o .MD'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Extracción 100 % local en el navegador (cumple privacidad LGPD)
                    </div>
                  </label>

                  {fileError && (
                    <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.5rem' }}>{fileError}</div>
                  )}

                  <div style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(activeBrand.knowledgeDocs || []).map((doc, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.9rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.82rem',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <strong>{doc.name}</strong>
                          <span className="badge badge-purple" style={{ marginLeft: '0.45rem' }}>
                            {doc.type} · {doc.pages} pág · {doc.charCount} chars
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setPreviewDocModal(doc)}>
                            <Eye size={13} /> Abrir en Pop-up
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              updateActiveBrand((b) => ({
                                ...b,
                                knowledgeDocs: b.knowledgeDocs.filter((_, i) => i !== idx)
                              }))
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="section-header" style={{ marginBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      4. Pilares del Tono de Voz (Clic para editar en Pop-up)
                    </h3>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setEditingPillar({
                          id: `p-${Date.now()}`,
                          name: `${activeBrand.pillars.length + 1}. Nuevo Pilar de Comunicación`,
                          definition: '',
                          exampleYes: '',
                          exampleNo: ''
                        })
                      }
                    >
                      <Plus size={14} /> Agregar Pilar
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {activeBrand.pillars.map((p) => (
                      <div
                        key={p.id}
                        className="card-clickable"
                        onClick={() => setEditingPillar({ ...p })}
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#e9d5ff' }}>{p.name}</strong>
                          <span className="badge badge-purple">
                            <Edit3 size={11} /> Editar en Pop-up
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.7rem' }}>
                          {p.definition}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.8rem' }}>
                          <div
                            style={{
                              padding: '0.6rem 0.75rem',
                              borderRadius: '8px',
                              background: 'rgba(16, 185, 129, 0.08)',
                              border: '1px solid rgba(16, 185, 129, 0.22)'
                            }}
                          >
                            <div style={{ color: '#6ee7b7', fontWeight: 700, marginBottom: '0.2rem' }}>
                              ✅ Cómo hablamos:
                            </div>
                            <div style={{ color: 'var(--text-primary)' }}>«{p.exampleYes}»</div>
                          </div>
                          <div
                            style={{
                              padding: '0.6rem 0.75rem',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.22)'
                            }}
                          >
                            <div style={{ color: '#fca5a5', fontWeight: 700, marginBottom: '0.2rem' }}>
                              ❌ Cómo NUNCA hablamos:
                            </div>
                            <div style={{ color: 'var(--text-primary)' }}>«{p.exampleNo}»</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS ESPECÍFICAS DE LA EMPRESA ACTIVA */}
        {activeTab === 'skills-step2' && (
          <div>
            <div className="section-header">
              <div>
                <div className="section-title">
                  <Layers size={20} color="#c084fc" />
                  <span>
                    Ecosistema de Skills de {activeBrand.name} ({brandSkills.length}{' '}
                    {brandSkills.length === 1 ? 'Skill' : 'Skills'})
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Cada empresa tiene sus propias Skills independientes. Haz clic en una Skill para abrir su{' '}
                  <strong>Pop-up Amplio</strong> o en <strong>➕ Crear Nueva Skill</strong> para elegir una plantilla o crearla desde cero.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleStartAddSkill}>
                <Plus size={16} /> Crear Nueva Skill
              </button>
            </div>

            {brandSkills.length === 0 ? (
              <div
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  borderStyle: 'dashed',
                  borderColor: 'var(--border-accent)'
                }}
              >
                <Wand2 size={42} color="#c084fc" style={{ marginBottom: '0.85rem' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                  {activeBrand.name} todavía no tiene Skills configuradas
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 1.4rem', fontSize: '0.9rem' }}>
                  Puedes crear tu primera Skill desde cero o elegir una de nuestras plantillas inteligentes (Orquestador, Guardián de Tono, Multiplicador, Triaje de Redes o Director Visual), que inyectarán automáticamente el ADN de <strong>{activeBrand.name}</strong>.
                </p>
                <button className="btn btn-primary" onClick={handleStartAddSkill}>
                  <Plus size={16} /> Crear Primera Skill para {activeBrand.name}
                </button>
              </div>
            ) : (
              <>
                <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--border-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <GitBranch size={19} color="#c084fc" />
                      <strong style={{ fontSize: '1rem' }}>
                        Flujo de Orquestación Activo para {activeBrand.name}
                      </strong>
                    </div>
                    <span className="badge badge-green">{brandSkills.length} Skills Conectadas al ADN de Marca</span>
                  </div>

                  <div className="pipeline-flow">
                    {brandSkills.map((s, idx) => (
                      <React.Fragment key={s.id}>
                        <span
                          className="pipeline-step"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setIsNewSkillFlag(false);
                            setEditingSkill({ ...s });
                          }}
                        >
                          {s.code} · {s.name.split('(')[0].trim()}
                        </span>
                        {idx < brandSkills.length - 1 && <ArrowRight size={14} color="#9ca3af" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid-3">
                  {brandSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="card card-clickable"
                      onClick={() => {
                        setIsNewSkillFlag(false);
                        setEditingSkill({ ...skill });
                      }}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <span className={`badge ${skill.badgeColor || 'badge-purple'}`}>
                            Skill {skill.code} · {skill.category}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Edit3 size={12} /> Abrir Pop-up
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{skill.name}</h3>
                        <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.7rem' }}>
                          .agents/skills/{skill.slug}/SKILL.md
                        </div>

                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                          <strong style={{ color: '#e9d5ff' }}>Objetivo / Dolor:</strong> {skill.painSolved}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-color)',
                          gap: '0.4rem'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleCopySkillMd(skill)}>
                            {copiedSkillId === skill.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                            {copiedSkillId === skill.id ? 'Copiado' : 'Copiar'}
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDownloadSkillMd(skill)}>
                            <Download size={13} /> SKILL.md
                          </button>
                        </div>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Eliminar esta Skill de la empresa"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 size={13} color="#fca5a5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4 (PASO 3): GUARDIÁN DE TONO EN VIVO & MULTI-MODELO API PLAYGROUND */}
        {activeTab === 'playground-step3' && (
          <div>
            <div className="section-header">
              <div>
                <div className="section-title">
                  <Cpu size={20} color="#c084fc" />
                  <span>Laboratorio en Vivo: Guardián de Tono & Ejecutor Multi-Modelo — {activeBrand.name}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  En <strong>Modo Simulador Local</strong> los casos de ejemplo son de <strong>solo lectura</strong>. Al conectar tu <strong>API Key de IA (Gemini / OpenAI / Groq)</strong>, el campo se desbloquea para escribir cualquier prompt y generar respuestas e imágenes nuevas en vivo.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-sm ${playgroundSubMode === 'tone-guardian' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPlaygroundSubMode('tone-guardian')}
                >
                  🛡️ 1. Auditor de Tono en Tiempo Real
                </button>
                <button
                  className={`btn btn-sm ${playgroundSubMode === 'skill-runner' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setPlaygroundSubMode('skill-runner')}
                >
                  🧭 2. Ejecutar Skills de {activeBrand.name.split(' ')[0]} ({brandSkills.length})
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowApiConfigModal(true)}>
                  <Key size={14} color={isRealAIActive ? '#10b981' : '#c084fc'} />{' '}
                  {isRealAIActive ? `IA Activa: ${aiConfig.provider.toUpperCase()}` : 'Conectar API Key (Desbloquear Edición)'}
                </button>
              </div>
            </div>

            {aiError && (
              <div
                className="card"
                style={{
                  marginBottom: '1rem',
                  borderColor: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  fontSize: '0.86rem'
                }}
              >
                <strong>Error de conexión con la API:</strong> {aiError}. Puedes revisar tu API Key o cambiar al{' '}
                <strong>Simulador Inteligente Local</strong>.
              </div>
            )}

            {/* SUB-MODE 1: REAL-TIME TONE GUARDIAN */}
            {playgroundSubMode === 'tone-guardian' && (
              <div className="grid-2">
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      Borrador a Auditar ({activeBrand.name})
                    </h3>
                    <span className="badge badge-purple">El Semáforo de la derecha es 100 % en vivo</span>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Cargar borrador de prueba para {activeBrand.name}:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {sampleDrafts.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setToneDraft(s.text)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <textarea
                      className="form-textarea"
                      rows={7}
                      placeholder={`Escribe o pega aquí un texto para auditar el vocabulario de ${activeBrand.name} en tiempo real...`}
                      value={toneDraft}
                      onChange={(e) => setToneDraft(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                    onClick={handleRunToneGuardianAI}
                    disabled={isRunningAI}
                  >
                    <Play size={16} />
                    {isRunningAI
                      ? 'Auditando y Reescribiendo con IA...'
                      : `Ejecutar Diagnóstico Completo y Reescritura en Pop-up (${
                          isRealAIActive ? aiConfig.provider.toUpperCase() : 'Simulador Local'
                        })`}
                  </button>
                </div>

                {/* LIVE TELEMETRY & GATEKEEPER SCORE */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        Semáforo de Gobernanza Verbal en Vivo
                      </h3>
                      <span className={`badge ${liveAudit.passedGatekeeper ? 'badge-green' : 'badge-red'}`}>
                        {liveAudit.passedGatekeeper ? '🟢 APROBADO HITL' : '🔴 BLOQUEADO POR GUARDRAILS'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        padding: '1.1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1rem'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2.4rem',
                          fontWeight: 800,
                          color: liveAudit.score >= 9 ? '#10b981' : liveAudit.score >= 6 ? '#f59e0b' : '#ef4444'
                        }}
                      >
                        {liveAudit.score}/10
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          Score de Alineación con {activeBrand.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Umbral mínimo del Comité de Gobernanza para publicar: <strong>9/10</strong> y{' '}
                          <strong>0 palabras prohibidas</strong>.
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.4rem' }}>
                        ❌ Palabras Prohibidas Detectadas en el Texto ({liveAudit.detectedForbidden.length}):
                      </div>
                      {liveAudit.detectedForbidden.length === 0 ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Ninguna palabra prohibida detectada.
                        </div>
                      ) : (
                        <div className="chip-list">
                          {liveAudit.detectedForbidden.map((w) => (
                            <span key={w} className="chip badge-red">
                              <ShieldAlert size={13} /> «{w}»
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.4rem' }}>
                        ✅ Vocabulario Aprobado Detectado ({liveAudit.detectedApproved.length}):
                      </div>
                      {liveAudit.detectedApproved.length === 0 ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Aún no se detectan términos ancla aprobados.
                        </div>
                      ) : (
                        <div className="chip-list">
                          {liveAudit.detectedApproved.map((w) => (
                            <span key={w} className="chip badge-green">
                              <ShieldCheck size={13} /> «{w}»
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '1.2rem',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid var(--border-accent)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    💡 <strong>Prueba dinámica:</strong> Este semáforo analiza el texto letra por letra en vivo contra tu lista de palabras prohibidas de la Pestaña 2.
                  </div>
                </div>
              </div>
            )}

            {/* SUB-MODE 2: SKILL & ORCHESTRATOR RUNNER (READ-ONLY IN LOCAL SIM, EDITABLE WITH API KEY!) */}
            {playgroundSubMode === 'skill-runner' && (
              <div className="card">
                {brandSkills.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {activeBrand.name} aún no tiene Skills creadas para ejecutar.
                    </p>
                    <button className="btn btn-primary" onClick={handleStartAddSkill}>
                      <Plus size={15} /> Crear Primera Skill para {activeBrand.name}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">
                          1. Selecciona qué Skill de {activeBrand.name} deseas ejecutar:
                        </label>
                        <select
                          className="form-select"
                          value={selectedRunnerSkill?.id || ''}
                          onChange={(e) => handleSelectRunnerSkillChange(e.target.value)}
                        >
                          {brandSkills.map((s) => (
                            <option key={s.id} value={s.id}>
                              Skill {s.code} — {s.name} ({s.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">
                          2. Casos de Prueba Específicos para «Skill {selectedRunnerSkill?.code}»:
                        </label>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          {skillSpecificSamples.map((sample, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setRunnerInput(sample.prompt)}
                            >
                              {sample.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SELECTOR DE IDIOMA DE SALIDA */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(108, 58, 131, 0.12)',
                        border: '1px solid rgba(108, 58, 131, 0.3)',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        marginBottom: '0.9rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600 }}>
                        <Globe size={15} color="#c084fc" />
                        <span>Idioma de Respuesta de la IA:</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${targetLanguage === 'es' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.2rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => setTargetLanguage('es')}
                        >
                          🇪🇸 Español (Oficial LatAm)
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${targetLanguage === 'pt' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.2rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => setTargetLanguage('pt')}
                        >
                          🇧🇷 Português (Brasil)
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${targetLanguage === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.2rem 0.65rem', fontSize: '0.78rem' }}
                          onClick={() => setTargetLanguage('en')}
                        >
                          🇺🇸 English (Global B2B)
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>
                          3. Solicitud o Mensaje de Entrada para <strong>{selectedRunnerSkill?.name}</strong>:
                        </label>
                        {isRealAIActive ? (
                          <span className="badge badge-green">
                            <Unlock size={12} /> Modo IA Real ({aiConfig.provider.toUpperCase()}): Edición Libre Habilitada
                          </span>
                        ) : (
                          <span
                            className="badge badge-amber"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowApiConfigModal(true)}
                          >
                            <Lock size={12} /> Modo Simulador Local: Solo Lectura (Clic aquí para conectar API Key y editar)
                          </span>
                        )}
                      </div>

                      <textarea
                        className="form-textarea"
                        rows={5}
                        readOnly={!isRealAIActive}
                        style={{
                          opacity: isRealAIActive ? 1 : 0.78,
                          cursor: isRealAIActive ? 'text' : 'not-allowed',
                          background: isRealAIActive ? 'var(--bg-secondary)' : 'rgba(18, 20, 28, 0.55)'
                        }}
                        value={runnerInput}
                        onChange={(e) => {
                          if (isRealAIActive) setRunnerInput(e.target.value);
                        }}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.4rem' }}
                      onClick={handleRunSelectedSkill}
                      disabled={isRunningAI}
                    >
                      <Play size={16} />
                      {isRunningAI
                        ? 'Generando respuesta e imagen en vivo con IA...'
                        : `Ejecutar «Skill ${selectedRunnerSkill?.code}» y Abrir Resultado en Pop-up Amplio (${
                            isRealAIActive ? `${aiConfig.provider.toUpperCase()} EN VIVO` : 'Simulador Local'
                          })`}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SHOWROOM MULTICANAL & ROI NR-17 (PASO 4) */}
        {activeTab === 'showroom-step4' && (
          <ShowroomStep4
            activeBrand={activeBrand}
            isRealAIActive={isRealAIActive}
            aiConfig={aiConfig}
            updateActiveBrand={updateActiveBrand}
          />
        )}
      </main>

      {/* =====================================================================
          WIDE POP-UP MODAL: AI EXECUTION RESULT (WITH LIVE GENERATED IMAGES!)
         ===================================================================== */}
      {aiOutputModal && (
        <div className="modal-backdrop" onClick={() => setAiOutputModal(null)}>
          <div className="modal-card-xl" style={{ maxWidth: '1040px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-green">{aiOutputModal.badge}</span>
                  <span className="badge badge-purple">
                    <Globe size={12} />{' '}
                    {targetLanguage === 'es' ? '🇪🇸 Español' : targetLanguage === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.3rem' }}>{aiOutputModal.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setModalViewMode(modalViewMode === 'markdown' ? 'raw' : 'markdown')}
                  title="Alternar entre visualización enriquecida con Markdown o texto plano"
                >
                  <Eye size={14} /> {modalViewMode === 'markdown' ? 'Ver Texto Plano' : 'Ver Markdown Estilizado'}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', borderColor: '#a855f7' }}
                  onClick={() =>
                    exportToPdf({
                      title: aiOutputModal.title,
                      badge: aiOutputModal.badge,
                      content: aiOutputModal.content,
                      brand: activeBrand,
                      modelName: isRealAIActive
                        ? `${aiConfig.provider.toUpperCase()} (${aiConfig.model})`
                        : 'Simulador Inteligente Local',
                      images: aiOutputModal.images || []
                    })
                  }
                  title="Descargar documento en formato PDF listo para imprimir o enviar"
                >
                  <Printer size={14} /> Descargar como PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigator.clipboard.writeText(aiOutputModal.content)}
                  title="Copiar texto al portapapeles"
                >
                  <Copy size={14} /> Copiar Resultado
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAiOutputModal(null)}>
                  <X size={16} /> Cerrar
                </button>
              </div>
            </div>

            <div
              style={{
                background: '#090a10',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-accent)',
                maxHeight: '66vh',
                overflowY: 'auto'
              }}
            >
              {modalViewMode === 'markdown' ? (
                <MarkdownRenderer content={aiOutputModal.content} />
              ) : (
                <pre
                  className="mono"
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.85rem',
                    lineHeight: 1.65,
                    color: '#f3f4f6',
                    margin: 0
                  }}
                >
                  {aiOutputModal.content}
                </pre>
              )}
            </div>

            {/* RENDER GENERATED CAMPAIGN IMAGES WHEN SKILL 06 IS EXECUTED! */}
            {aiOutputModal.images && aiOutputModal.images.length > 0 && (
              <div style={{ marginTop: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ImageIcon size={18} color="#c084fc" />
                  <strong style={{ fontSize: '1rem', color: '#e9d5ff' }}>
                    Activo Visual Generado (Validación Human-in-the-Loop):
                  </strong>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      aiOutputModal.images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  {aiOutputModal.images.map((img, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-accent)'
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.title}
                        onError={(e) => {
                          if (activeBrand.id === 'penelope-skincare') {
                            e.target.src = './assets/penelope_serum_cuidar.jpg';
                          } else {
                            e.target.src = './assets/01_ergopro_executive.jpg';
                          }
                        }}
                        style={{
                          width: '100%',
                          maxHeight: aiOutputModal.images.length === 1 ? '480px' : '240px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div style={{ padding: '0.85rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{img.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{img.caption}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MULTI-MODEL AI & API KEY CONFIGURATION */}
      {showApiConfigModal && (
        <div className="modal-backdrop" onClick={() => setShowApiConfigModal(false)}>
          <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-purple">CONECTOR MULTI-MODELO (BYOK)</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  Configurar Motor de IA y API Key
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowApiConfigModal(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">1. Proveedor de Inteligencia Artificial</label>
              <select
                className="form-select"
                value={aiConfig.provider}
                onChange={(e) => {
                  const newProvId = e.target.value;
                  const p = AI_PROVIDERS.find((item) => item.id === newProvId) || AI_PROVIDERS[0];
                  const savedKey = aiConfig.apiKeys?.[newProvId] || '';
                  setAiConfig((prev) => ({
                    ...prev,
                    provider: newProvId,
                    model: p.models[0],
                    apiKey: savedKey
                  }));
                }}
              >
                {AI_PROVIDERS.map((p) => {
                  const hasKey = Boolean(aiConfig.apiKeys?.[p.id]?.trim());
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.requiresKey ? (hasKey ? '✓ (Key lista)' : '○ (Sin key)') : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  2. Modelo de Inteligencia Artificial
                </label>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => setIsCustomModelMode(!isCustomModelMode)}
                >
                  <Edit3 size={12} />
                  {isCustomModelMode ? '📋 Elegir de la lista recomendada' : '✏️ Escribir otro modelo libre'}
                </button>
              </div>

              {!isCustomModelMode ? (
                <div>
                  <select
                    className="form-select"
                    value={currentProviderObj.models.includes(aiConfig.model) ? aiConfig.model : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomModelMode(true);
                      } else {
                        setAiConfig((prev) => ({ ...prev, model: e.target.value }));
                      }
                    }}
                  >
                    {currentProviderObj.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    {!currentProviderObj.models.includes(aiConfig.model) && (
                      <option value="__custom__">
                        ✍️ Personalizado: {aiConfig.model}
                      </option>
                    )}
                    <option value="__custom__">✏️ Escribir otro modelo de IA...</option>
                  </select>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    💡 Los modelos de IA evolucionan constantemente. Puedes pulsar <strong>"✏️ Escribir otro modelo libre"</strong> para usar cualquier versión nueva.
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="form-input mono"
                    placeholder={
                      aiConfig.provider === 'gemini'
                        ? 'ej: gemini-3.8-flash, gemini-3.6-flash, gemini-2.5-flash...'
                        : aiConfig.provider === 'openrouter'
                        ? 'ej: openrouter/free, nvidia/nemotron-3.5-lightning:free, meta-llama/llama-3.3-70b-instruct...'
                        : 'ej: gpt-4o, llama-3.3-70b-versatile...'
                    }
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig((prev) => ({ ...prev, model: e.target.value.trim() }))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      ✍️ Modelo activo: <strong style={{ color: '#c084fc' }}>{aiConfig.model || '(escribe un modelo)'}</strong>
                    </span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: '0.74rem', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => {
                        setIsCustomModelMode(false);
                        setAiConfig((prev) => ({ ...prev, model: currentProviderObj.models[0] }));
                      }}
                    >
                      Restaurar lista predeterminada
                    </button>
                  </div>
                </div>
              )}
            </div>

            {currentProviderObj.requiresKey ? (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    3. API Key para {currentProviderObj.name.split(' ')[1]} (Bóveda independiente por proveedor)
                  </label>
                  {currentProviderObj.helpUrl && (
                    <a
                      href={currentProviderObj.helpUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.78rem', color: '#c084fc', textDecoration: 'underline' }}
                    >
                      Obtener clave aquí ↗
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  className="form-input mono"
                  placeholder={currentProviderObj.keyPlaceholder || 'Pega tu API Key aquí (ej: AIzaSy... o sk-...)'}
                  value={aiConfig.apiKeys?.[aiConfig.provider] || aiConfig.apiKey || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAiConfig((prev) => ({
                      ...prev,
                      apiKey: val,
                      apiKeys: {
                        ...(prev.apiKeys || {}),
                        [prev.provider]: val
                      }
                    }));
                  }}
                />
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  🔒 Privacidad LGPD: Cada clave se almacena por separado en el <code>localStorage</code> de tu navegador sin pisar a los demás proveedores.
                </div>

                {/* Bóveda Rápida de Claves Guardadas */}
                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Bóveda de claves:</span>
                  {AI_PROVIDERS.filter((p) => p.requiresKey).map((p) => {
                    const hasKey = Boolean(aiConfig.apiKeys?.[p.id]?.trim());
                    const isSelected = aiConfig.provider === p.id;
                    return (
                      <span
                        key={p.id}
                        className={`badge ${isSelected ? 'badge-purple' : hasKey ? 'badge-green' : 'badge-amber'}`}
                        style={{ fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={() => {
                          const savedKey = aiConfig.apiKeys?.[p.id] || '';
                          setAiConfig((prev) => ({
                            ...prev,
                            provider: p.id,
                            model: p.models[0],
                            apiKey: savedKey
                          }));
                        }}
                        title={`Clic para cambiar rápidamente a ${p.name}`}
                      >
                        {p.name.split(' ')[1]}: {hasKey ? '● Guardada' : '○ Vacía'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '0.9rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '0.82rem',
                  color: '#fcd34d'
                }}
              >
                🔒 <strong>Modo Simulador Local activo:</strong> En este modo los prompts de ejemplo están bloqueados en solo lectura y muestran las respuestas pre-validadas. Para escribir cualquier prompt nuevo y generar imágenes dinámicas, selecciona <strong>Google Gemini API / OpenAI / Groq</strong> arriba y pega tu API Key.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn btn-primary" onClick={() => setShowApiConfigModal(false)}>
                <Check size={16} /> Guardar Configuración de IA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WIZARD MODAL: "¿QUÉ TIPO DE SKILL QUIERES CREAR?" */}
      {showSkillTemplateModal && (
        <div className="modal-backdrop" onClick={() => setShowSkillTemplateModal(false)}>
          <div className="modal-card-xl" style={{ maxWidth: '920px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-purple">ASISTENTE DE CREACIÓN DE SKILLS</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  ¿Qué tipo de Skill quieres crear para {activeBrand.name}?
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Elige una plantilla pre-estructurada (con las variables de {activeBrand.name} ya conectadas) o empieza una Skill en blanco desde cero.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSkillTemplateModal(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>

            <div className="grid-2" style={{ marginBottom: 0 }}>
              {SKILL_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.templateId}
                  className="card card-clickable"
                  onClick={() => handleSelectSkillTemplate(tpl)}
                  style={{
                    background: tpl.templateId === 'tpl-blank' ? 'rgba(147, 51, 234, 0.12)' : 'var(--bg-secondary)',
                    borderColor: tpl.templateId === 'tpl-blank' ? '#a855f7' : 'var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{tpl.icon}</span>
                    <span className={`badge ${tpl.badgeColor}`}>{tpl.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{tpl.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{tpl.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WIDE POP-UP MODAL: SKILL STUDIO */}
      {editingSkill && (
        <div className="modal-backdrop" onClick={() => setEditingSkill(null)}>
          <div className="modal-card-xl" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-purple">
                    {isNewSkillFlag ? 'CREANDO NUEVA SKILL' : 'EDITANDO SKILL'}
                  </span>
                  <span className="badge badge-green">Empresa: {activeBrand.name}</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.3rem' }}>
                  {editingSkill.name || 'Nueva Skill Personalizada'}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {isNewSkillFlag && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingSkill(null);
                      setShowSkillTemplateModal(true);
                    }}
                  >
                    Cambiar Plantilla
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopySkillMd(editingSkill)}
                >
                  <Copy size={14} /> {copiedSkillId === editingSkill.id ? '¡Copiado!' : 'Copiar Prompt Compilado'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownloadSkillMd(editingSkill)}
                >
                  <Download size={14} /> Descargar SKILL.md
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingSkill(null)}>
                  <X size={16} /> Cerrar
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSkillModal}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
                <div>
                  {/* AI AUTO-DESIGNER BANNER */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(236, 72, 153, 0.12))',
                      border: '1px solid var(--border-accent)',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, fontSize: '0.92rem', color: '#f472b6' }}>
                        <Sparkles size={16} color="#f472b6" />
                        <span>Diseñador Asistido por IA (Autocompletar con {aiConfig.provider.toUpperCase()})</span>
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
                        {isRealAIActive ? `🔑 IA Conectada (${aiConfig.model})` : '⚡ Simulador Inteligente'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      Escribe una breve idea o necesidad en una frase (ej. <em>"Quiero una skill para responder preguntas sobre ingredientes y cómo combinarlos en una rutina"</em>) y la IA estructurará todos los 4 bloques del prompt automáticamente para <strong>{activeBrand.name}</strong>.
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Escribe la idea o propósito de la nueva skill..."
                        value={aiSkillIdea}
                        onChange={(e) => setAiSkillIdea(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAiDesignSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={isDesigningSkill || (!aiSkillIdea.trim() && !editingSkill.name?.trim())}
                        onClick={() => handleAiDesignSkill()}
                        style={{
                          whiteSpace: 'nowrap',
                          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Wand2 size={15} />
                        {isDesigningSkill ? 'Diseñando...' : 'Autocompletar con IA'}
                      </button>
                    </div>

                    {/* Quick idea pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>💡 Ideas rápidas:</span>
                      {(
                        (activeBrand.id === 'penelope-skincare' || (activeBrand.name || '').toLowerCase().includes('penélope') || (activeBrand.name || '').toLowerCase().includes('penelope'))
                          ? [
                              { label: '🌸 Compatibilidad de Ingredientes', idea: 'Consultor de ingredientes y compatibilidad de activos de skincare (Vitamina C, Ácido Hialurónico)' },
                              { label: '💌 Asistente Empático de DMs', idea: 'Asistente para responder DMs en redes sociales con afecto y claridad sin ventas agresivas' },
                              { label: '🌙 Guion de Rutina Nocturna', idea: 'Guionista de rutinas nocturnas de autocuidado y reparación de barrera cutánea' }
                            ]
                          : (activeBrand.id === 'taranis-black' || (activeBrand.name || '').toLowerCase().includes('taranis'))
                          ? [
                              { label: '📊 Casos B2B para CFOs', idea: 'Generador de casos de éxito B2B con análisis de TCO, ROI y justificación financiera para comités de compra' },
                              { label: '🏛️ Bloques BIM & Facilities', idea: 'Especialista en especificaciones técnicas, tolerancias acústicas ISO y bloques BIM para arquitectos' },
                              { label: '💬 Rebate de Objeciones B2B', idea: 'Asistente para responder solicitudes de cotización corporativa explicando flete CIF y sillas piloto' }
                            ]
                          : [
                              { label: '💡 Preguntas Frecuentes & Soporte', idea: `Asistente para responder dudas frecuentes y soporte técnico sobre ${activeBrand.tagline || activeBrand.name}` },
                              { label: '📈 Artículos B2B & Autoridad', idea: `Especialista en redacción de artículos de liderazgo y valor estratégico en ${activeBrand.industry || 'nuestro sector'}` },
                              { label: '🎯 Rebate de Objeciones Comerciales', idea: `Asistente consultivo para responder cotizaciones y demostrar retorno de inversión de ${activeBrand.name}` },
                              { label: '🚀 Casos de Éxito & Onboarding', idea: `Generador de casos de estudio y guías de implementación paso a paso para ${activeBrand.targetAudience || 'nuestros clientes'}` }
                            ]
                      ).map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}
                          onClick={() => {
                            setAiSkillIdea(item.idea);
                            handleAiDesignSkill(item.idea);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {aiSkillNotice && (
                      <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: '#86efac' }}>
                        ✓ {aiSkillNotice}
                      </div>
                    )}

                    {aiSkillError && (
                      <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: '#fca5a5' }}>
                        ⚠️ {aiSkillError}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Nombre de la Skill / Gem *</label>
                      <input
                        className="form-input"
                        required
                        placeholder="Ej: Guardián de Tono o Generador de Casos B2B"
                        value={editingSkill.name}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Identificador (Slug)</label>
                      <input
                        className="form-input mono"
                        required
                        value={editingSkill.slug}
                        onChange={(e) => setEditingSkill({ ...editingSkill, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Objetivo / Dolor del Equipo que Automatiza *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="Describe qué problema resuelve esta Skill..."
                      value={editingSkill.painSolved}
                      onChange={(e) => setEditingSkill({ ...editingSkill, painSolved: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Bloque 1 — Quién eres (Role-Based Prompting · Usa <code>{'{{empresa}}'}</code>, <code>{'{{tagline}}'}</code>)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={5}
                      value={editingSkill.roleBlock}
                      onChange={(e) => setEditingSkill({ ...editingSkill, roleBlock: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Bloque 2 — Conocimiento Inyectado (<code>{'{{pilares_tono}}'}</code>, <code>{'{{catalogo_reglas}}'}</code>)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={6}
                      value={editingSkill.knowledgeBlock}
                      onChange={(e) => setEditingSkill({ ...editingSkill, knowledgeBlock: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bloque 3 — Estructura de Respuesta (Structured Output Formatting)</label>
                    <textarea
                      className="form-textarea"
                      rows={8}
                      value={editingSkill.outputBlock}
                      onChange={(e) => setEditingSkill({ ...editingSkill, outputBlock: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Bloque 4 — Restricciones y Guardrails (<code>{'{{vocabulario_prohibido}}'}</code>)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={5}
                      value={editingSkill.guardrailsBlock}
                      onChange={(e) => setEditingSkill({ ...editingSkill, guardrailsBlock: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label" style={{ color: '#c084fc' }}>
                    ⚡ Vista Previa en Vivo del Prompt Compilado para {activeBrand.name} (SKILL.md / Gem):
                  </label>
                  <div
                    className="mono"
                    style={{
                      flex: 1,
                      background: '#08090c',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-accent)',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.8rem',
                      lineHeight: 1.6,
                      color: '#e5e7eb'
                    }}
                  >
                    {compileSkillMarkdown(editingSkill, activeBrand)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                {!isNewSkillFlag ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ color: '#fca5a5' }}
                    onClick={() => handleDeleteSkill(editingSkill.id)}
                  >
                    <Trash2 size={15} /> Eliminar Skill
                  </button>
                ) : (
                  <div />
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingSkill(null)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={16} /> {isNewSkillFlag ? `Agregar Skill a ${activeBrand.name}` : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WIDE POP-UP MODAL: EDIT IDENTITY & CATALOG RULES */}
      {editingIdentityModal && (
        <div className="modal-backdrop" onClick={() => setEditingIdentityModal(false)}>
          <div className="modal-card-xl" style={{ maxWidth: '860px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <span className="badge badge-purple">EDITOR AMPLIO DE MARCA</span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  Identidad Corporativa y Reglas de Catálogo — {activeBrand.name}
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingIdentityModal(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de la Empresa (Variable <code>{'{{empresa}}'}</code>)</label>
              <input
                className="form-input"
                value={activeBrand.name}
                onChange={(e) => updateActiveBrand({ name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Posicionamiento / Tagline (Variable <code>{'{{tagline}}'}</code>)</label>
              <input
                className="form-input"
                value={activeBrand.tagline}
                onChange={(e) => updateActiveBrand({ tagline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Público Objetivo y Decisores (Variable <code>{'{{publico_objetivo}}'}</code>)</label>
              <input
                className="form-input"
                value={activeBrand.targetAudience}
                onChange={(e) => updateActiveBrand({ targetAudience: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Catálogo Oficial, Precios, Garantías y Reglas Comerciales (Variable <code>{'{{catalogo_reglas}}'}</code>)
              </label>
              <textarea
                className="form-textarea"
                rows={8}
                value={activeBrand.catalogRules}
                onChange={(e) => updateActiveBrand({ catalogRules: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setEditingIdentityModal(false)}>
                <Check size={16} /> Guardar y Actualizar Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WIDE POP-UP MODAL: EDIT VOICE PILLAR */}
      {editingPillar && (
        <div className="modal-backdrop" onClick={() => setEditingPillar(null)}>
          <div className="modal-card-xl" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <span className="badge badge-purple">PILAR DE TONO DE VOZ</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  Editar Pilar de Identidad Verbal — {activeBrand.name}
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingPillar(null)}>
                <X size={16} /> Cerrar
              </button>
            </div>

            <form onSubmit={handleSavePillarModal}>
              <div className="form-group">
                <label className="form-label">Nombre del Pilar</label>
                <input
                  className="form-input"
                  required
                  value={editingPillar.name}
                  onChange={(e) => setEditingPillar({ ...editingPillar, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Definición Estratégica del Pilar</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  required
                  value={editingPillar.definition}
                  onChange={(e) => setEditingPillar({ ...editingPillar, definition: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#6ee7b7' }}>
                  ✅ Ejemplo SÍ (Cómo habla {activeBrand.name} aplicando este pilar)
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={editingPillar.exampleYes}
                  onChange={(e) => setEditingPillar({ ...editingPillar, exampleYes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#fca5a5' }}>
                  ❌ Ejemplo NO (Cómo NUNCA habla {activeBrand.name} — Fuera de tono)
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={editingPillar.exampleNo}
                  onChange={(e) => setEditingPillar({ ...editingPillar, exampleNo: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPillar(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Guardar Pilar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WIDE POP-UP MODAL: PDF / DOCUMENT FULL READER */}
      {previewDocModal && (
        <div className="modal-backdrop" onClick={() => setPreviewDocModal(null)}>
          <div className="modal-card-xl" style={{ maxWidth: '940px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-blue">
                  {previewDocModal.type} · {previewDocModal.pages} páginas · {previewDocModal.charCount} caracteres
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.3rem' }}>{previewDocModal.name}</h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setPreviewDocModal(null)}>
                <X size={16} /> Cerrar
              </button>
            </div>
            <div
              className="mono"
              style={{
                background: '#08090c',
                padding: '1.35rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                whiteSpace: 'pre-wrap',
                fontSize: '0.84rem',
                lineHeight: 1.65,
                color: 'var(--text-primary)'
              }}
            >
              {previewDocModal.content}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW BRAND */}
      {showNewBrandModal && (
        <div className="modal-backdrop" onClick={() => setShowNewBrandModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              ➕ Crear Nuevo Workspace de Empresa
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              La nueva empresa iniciará con su tablero de Skills limpio (0 Skills) para que agregues solo las que necesite desde plantillas o desde cero.
            </p>
            <form onSubmit={handleCreateNewBrand}>
              <div className="form-group">
                <label className="form-label">Nombre de la Empresa *</label>
                <input
                  className="form-input"
                  required
                  placeholder="Ej: EcoVolt Solar B2B"
                  value={newBrandForm.name}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline / Posicionamiento</label>
                <input
                  className="form-input"
                  placeholder="Ej: Energía solar industrial con retorno garantizado"
                  value={newBrandForm.tagline}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, tagline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Público Objetivo</label>
                <input
                  className="form-input"
                  placeholder="Ej: Directores de Operaciones e Ingenieros de Planta"
                  value={newBrandForm.targetAudience}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, targetAudience: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Palabras Prohibidas (separadas por coma)</label>
                <input
                  className="form-input"
                  value={newBrandForm.forbiddenCsv}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, forbiddenCsv: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Productos / Reglas del Catálogo</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Ej: Paneles Industriales 550W (USD 12.000), Garantía 25 años..."
                  value={newBrandForm.catalogRules}
                  onChange={(e) => setNewBrandForm({ ...newBrandForm, catalogRules: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewBrandModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Workspace Limpio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
