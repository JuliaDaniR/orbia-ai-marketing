import React, { useState } from 'react';
import {
  Share2, Calendar, Calculator, CheckCircle2, ChevronLeft, ChevronRight,
  ExternalLink, Mail, MessageSquare, ThumbsUp, Send, Bookmark, Eye,
  Printer, Copy, X, FileText, Sparkles, Building2, TrendingDown, Clock, ShieldCheck,
  Heart, ShoppingBag, Users, Award, DollarSign, RefreshCw, ArrowRight, Database,
  HelpCircle, Settings2, Sliders, Layers, Compass, Image as ImageIcon, Check
} from 'lucide-react';
import {
  TARANIS_SHOWROOM,
  TARANIS_CALENDAR,
  PENELOPE_SHOWROOM,
  PENELOPE_CALENDAR
} from '../data/showroomData';
import { exportToPdf } from '../utils/exportPdf';
import { MarkdownRenderer } from './MarkdownRenderer';
import { generateShowroomForBrand } from '../utils/aiEngine';

// Visual Themes for Adaptive Mockup Cards
const AESTHETIC_GRADIENTS = {
  modern: {
    bg: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
    accent: '#818cf8',
    border: 'rgba(129, 140, 248, 0.3)',
    tag: '💎 Minimalista Moderno'
  },
  warm_artisan: {
    bg: 'linear-gradient(135deg, #451a03, #1c1917)',
    accent: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.3)',
    tag: '🥐 Cálido & Artesanal'
  },
  clinical_clean: {
    bg: 'linear-gradient(135deg, #064e3b, #0f172a)',
    accent: '#34d399',
    border: 'rgba(52, 211, 153, 0.3)',
    tag: '🩺 Salud & Confianza'
  },
  luxury_sleek: {
    bg: 'linear-gradient(135deg, #262626, #09090b)',
    accent: '#fbbf24',
    border: 'rgba(250, 204, 21, 0.35)',
    tag: '👑 Elegante & Exclusivo'
  },
  fresh_vibrant: {
    bg: 'linear-gradient(135deg, #831843, #18181b)',
    accent: '#f472b6',
    border: 'rgba(244, 114, 182, 0.3)',
    tag: '⚡ Fresco & Dinámico'
  }
};

const CATEGORY_ICONS = {
  tech: { icon: '💻', label: 'Software & Tecnología' },
  services: { icon: '⚖️', label: 'Servicios Profesionales' },
  retail: { icon: '🛍️', label: 'Comercio & Retail D2C' },
  health: { icon: '🩺', label: 'Salud & Bienestar' },
  food: { icon: '🥐', label: 'Gastronomía & Alimentos' },
  education: { icon: '🎓', label: 'Educación & Capacitación' },
  agency: { icon: '🎨', label: 'Agencia & Creatividad' },
  general: { icon: '🏢', label: 'Negocio General' }
};

/**
 * Adaptive Brand Visual Component:
 * If a valid image exists, renders it.
 * If not (or for non-tech/custom businesses without local photos),
 * renders an editorial, branded mockup card with category icon, art direction notes, and custom aesthetics.
 */
function AdaptiveBrandVisualCard({ src, alt, headline, category = 'services', aesthetic = 'modern', visualNote, style = {} }) {
  const theme = AESTHETIC_GRADIENTS[aesthetic] || AESTHETIC_GRADIENTS.modern;
  const cat = CATEGORY_ICONS[category] || CATEGORY_ICONS.general;

  if (src && !src.includes('05_showroom.jpg')) {
    return (
      <div style={{ borderRadius: '8px', overflow: 'hidden', ...style }}>
        <img
          src={src}
          alt={alt || headline}
          style={{ width: '100%', height: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
        />
        {visualNote && (
          <div style={{ background: '#08090d', padding: '0.55rem 0.85rem', fontSize: '0.76rem', color: '#94a3b8' }}>
            📐 <strong>Dirección de Arte:</strong> {visualNote}
          </div>
        )}
      </div>
    );
  }

  // Editorial Mockup Card for custom business
  return (
    <div
      style={{
        borderRadius: '10px',
        padding: '2.5rem 1.75rem',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.78rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>{cat.icon}</span> {cat.label}
        </span>
        <span style={{ fontSize: '0.72rem', color: theme.accent, fontWeight: 700 }}>
          {theme.tag}
        </span>
      </div>

      <div style={{ margin: '1.75rem 0' }}>
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.accent, fontWeight: 800, marginBottom: '0.45rem' }}>
          Activo Visual de Campaña
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.35 }}>
          {headline || alt || 'Propuesta de Valor de la Marca'}
        </h3>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '0.75rem',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>📸</span>
        <span>
          <strong>Dirección Fotográfica Sugerida:</strong> {visualNote || 'Fotografía editorial con luz natural, enfoque en detalles y paleta de la marca.'}
        </span>
      </div>
    </div>
  );
}

export function ShowroomStep4({ activeBrand, isRealAIActive, aiConfig, updateActiveBrand }) {
  const [subTab, setSubTab] = useState('previews'); // 'previews' | 'calendar' | 'calculator'
  const [selectedChannel, setSelectedChannel] = useState('linkedin'); // 'linkedin' | 'carousel' | 'email' | 'reels'
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filters for Editorial Calendar
  const [calendarChannelFilter, setCalendarChannelFilter] = useState('all');
  const [calendarPillarFilter, setCalendarPillarFilter] = useState('all');

  // ROI Calculator State for Taranis Black
  const [employees, setEmployees] = useState(80);
  const [avgSalary, setAvgSalary] = useState(3200);
  const [sickLeaveRate, setSickLeaveRate] = useState(15);
  const [interruptionsPerDay, setInterruptionsPerDay] = useState(4);

  // D2C Retention Calculator State for Penélope Skincare
  const [subscribers, setSubscribers] = useState(1200);
  const [avgTicket, setAvgTicket] = useState(42);
  const [currentRepurchase, setCurrentRepurchase] = useState(22);
  const [projectedRepurchase, setProjectedRepurchase] = useState(42);

  // Custom Wizard Form State (For any business)
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardForm, setWizardForm] = useState(() => ({
    businessType: activeBrand.wizardData?.businessType || (
      (activeBrand.industry || '').toLowerCase().includes('soft') || (activeBrand.industry || '').toLowerCase().includes('tech')
        ? 'tech'
        : (activeBrand.industry || '').toLowerCase().includes('salud') || (activeBrand.industry || '').toLowerCase().includes('dent')
        ? 'health'
        : (activeBrand.industry || '').toLowerCase().includes('gast') || (activeBrand.industry || '').toLowerCase().includes('aliment')
        ? 'food'
        : (activeBrand.industry || '').toLowerCase().includes('legal') || (activeBrand.industry || '').toLowerCase().includes('abog')
        ? 'legal_services'
        : (activeBrand.industry || '').toLowerCase().includes('educa') || (activeBrand.industry || '').toLowerCase().includes('curs')
        ? 'education'
        : 'services'
    ),
    topOfferings: activeBrand.wizardData?.topOfferings || activeBrand.catalogRules || '',
    keyDifferentiator: activeBrand.wizardData?.keyDifferentiator || activeBrand.tagline || '',
    targetAudience: activeBrand.wizardData?.targetAudience || activeBrand.targetAudience || '',
    keyPain: activeBrand.wizardData?.keyPain || '',
    primaryObjection: activeBrand.wizardData?.primaryObjection || '',
    aestheticVibe: activeBrand.wizardData?.aestheticVibe || 'modern',
    calculatorType: activeBrand.wizardData?.calculatorType || 'roi_b2b',
    imageUrl: activeBrand.wizardData?.imageUrl || ''
  }));

  // Dynamic Calculator State for Custom Brands
  const [customTeamSize, setCustomTeamSize] = useState(activeBrand.calculatorData?.teamSize || 20);
  const [customHoursSaved, setCustomHoursSaved] = useState(activeBrand.calculatorData?.hoursSavedPerPersonMonth || 12);
  const [customHourlyRate, setCustomHourlyRate] = useState(activeBrand.calculatorData?.avgHourlyRate || 30);
  const [customMonthlyCost, setCustomMonthlyCost] = useState(activeBrand.calculatorData?.monthlyCost || 800);

  // Generation state
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');

  // Pop-up modal for inspecting full pieces
  const [detailModal, setDetailModal] = useState(null);

  const isTaranis = activeBrand.id === 'taranis-black';
  const isPenelope =
    activeBrand.id === 'penelope-skincare' ||
    (activeBrand.name || '').toLowerCase().includes('penélope') ||
    (activeBrand.name || '').toLowerCase().includes('penelope');
  const isCustomBrand = !isTaranis && !isPenelope;
  const hasCustomShowroom = Boolean(activeBrand.showroomData);
  const isBrandShowroomEmpty = isCustomBrand && !hasCustomShowroom;

  const showroom = activeBrand.showroomData || (isPenelope ? PENELOPE_SHOWROOM : isTaranis ? TARANIS_SHOWROOM : {});
  const calendarItems = activeBrand.calendarData || (isPenelope ? PENELOPE_CALENDAR : isTaranis ? TARANIS_CALENDAR : []);

  // Tech fallback images
  const TECH_CAROUSEL_IMAGES = [
    './assets/tech_05_hero_tech.jpg',
    './assets/tech_02_cloud_dashboard.jpg',
    './assets/tech_01_code_architecture.jpg',
    './assets/tech_04_mobile_app_flow.jpg',
    './assets/tech_03_team_collaboration.jpg'
  ];

  const rawCarouselData = showroom?.carousel || showroom?.instagram || {};
  const rawCarouselSlides = rawCarouselData?.slides || [];
  const carouselSlides = isCustomBrand && wizardForm.businessType === 'tech'
    ? rawCarouselSlides.map((s, idx) => ({
        ...s,
        image: (s.image === './assets/05_showroom.jpg' || !s.image)
          ? TECH_CAROUSEL_IMAGES[idx % TECH_CAROUSEL_IMAGES.length]
          : s.image
      }))
    : rawCarouselSlides;

  const carouselData = { ...rawCarouselData, slides: carouselSlides };

  const linkedinImage = isCustomBrand && wizardForm.businessType === 'tech' && (showroom?.linkedin?.image?.includes('05_showroom.jpg') || !showroom?.linkedin?.image)
    ? './assets/tech_01_code_architecture.jpg'
    : (showroom?.linkedin?.image || '');

  const handleNextSlide = () => {
    if (carouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const handlePrevSlide = () => {
    if (carouselSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // ---------------------------------------------------------
  // RUN WIZARD GENERATION
  // ---------------------------------------------------------
  const handleRunWizardGeneration = async () => {
    setIsGeneratingCampaign(true);
    setGenerationMsg(`Generando campaña multicanal a medida para ${activeBrand.name} con IA...`);
    try {
      const result = await generateShowroomForBrand({
        brand: activeBrand,
        aiConfig,
        wizardData: wizardForm
      });

      if (updateActiveBrand) {
        updateActiveBrand({
          showroomData: result.showroomData,
          calendarData: result.calendarData,
          calculatorData: result.calculatorData,
          wizardData: wizardForm,
          // Sync catalog and target if updated in wizard
          catalogRules: wizardForm.topOfferings || activeBrand.catalogRules,
          targetAudience: wizardForm.targetAudience || activeBrand.targetAudience,
          tagline: wizardForm.keyDifferentiator || activeBrand.tagline
        });
      }
      setIsWizardOpen(false);
    } catch (err) {
      console.error('Error generando showroom:', err);
    } finally {
      setIsGeneratingCampaign(false);
      setGenerationMsg('');
    }
  };

  // ---------------------------------------------------------
  // CALCULATIONS
  // ---------------------------------------------------------
  // Taranis calculations
  const annualLeaves = Math.round((employees * sickLeaveRate) / 100);
  const hiddenAbsenteeismCost = annualLeaves * (avgSalary * 3);
  const lostFocusHoursPerPerson = Math.round((interruptionsPerDay * 23.25 * 220) / 60);
  const totalCompanyLostHours = lostFocusHoursPerPerson * employees;
  const ergoproUnitPrice = 2490;
  const ergoproTotal = employees * ergoproUnitPrice;
  const silenceDuoQty = Math.max(1, Math.round(employees / 40));
  const silenceQuadQty = Math.max(1, Math.round(employees / 80));
  const silenceTotal = silenceDuoQty * 21000 + silenceQuadQty * 28000;
  const totalInvestment = ergoproTotal + silenceTotal;
  const tcoDailyPerPerson = (ergoproUnitPrice / (5 * 220)).toFixed(2);
  const paybackYears = (totalInvestment / Math.max(1, hiddenAbsenteeismCost)).toFixed(1);

  // Penélope D2C calculations
  const monthlyRevenueBase = subscribers * avgTicket;
  const retentionGainPp = projectedRepurchase - currentRepurchase;
  const extraRepurchaseOrdersPerYear = Math.round(subscribers * (retentionGainPp / 100) * 5);
  const annualExtraRevenue = extraRepurchaseOrdersPerYear * avgTicket;
  const projectedLtv24m = Math.round(avgTicket * (1 + 24 * (projectedRepurchase / 100) * 0.45));

  // Custom B2B / Efficiency calculations
  const customAnnualHours = customTeamSize * customHoursSaved * 12;
  const customAnnualValue = customAnnualHours * customHourlyRate;
  const customAnnualCost = customMonthlyCost * 12;
  const customNetSavings = Math.max(0, customAnnualValue - customAnnualCost);
  const customRoi = Math.round((customNetSavings / Math.max(1, customAnnualCost)) * 100);
  const customPayback = customAnnualValue > 0 ? ((customAnnualCost / customAnnualValue) * 12).toFixed(1) : '0';

  // Filtered Calendar
  const filteredCalendar = calendarItems.filter((item) => {
    const matchChannel =
      calendarChannelFilter === 'all' ||
      item.channel.toLowerCase().includes(calendarChannelFilter.toLowerCase());
    const matchPillar =
      calendarPillarFilter === 'all' ||
      item.pillar.toLowerCase().includes(calendarPillarFilter.toLowerCase());
    return matchChannel && matchPillar;
  });

  const handleExportRoiPdf = () => {
    const reportContent = `# Diagnóstico Ejecutivo de ROI Ergonómico & Conformidad Integral NR-17
**Empresa Prospecto:** ${activeBrand.name} | **Ubicación:** São Paulo (Región Sudeste)
**Equipo Evaluado:** ${employees} Colaboradores (Jornada intensiva en Trabajo Híbrido)

---

### 1. RADIOGRAFÍA DE RIESGO OCUPACIONAL & COSTO OCULTO
* **Tasa de Bajas Médicas por Dolor Lumbar / LER-DORT:** ${sickLeaveRate} % anual (~${annualLeaves} colaboradores afectados).
* **Costo Oculto de Ausentismo Estimado:** **USD ${hiddenAbsenteeismCost.toLocaleString('es-ES')} / año** (Cálculo basado en el costo indirecto de 3× la remuneración mensual por colaborador alejado: horas extras del equipo, pérdida de continuidad y retrabajo).
* **Interrupciones Acústicas en Open-Space:** ${interruptionsPerDay} interrupciones sonoras por día.
* **Tiempo de Concentración Profunda Perdido:** ${lostFocusHoursPerPerson} horas / colaborador al año (~${totalCompanyLostHours.toLocaleString('es-ES')} horas anuales para todo el equipo, tomando los 23 minutos y 15 segundos requeridos para recuperar el Flow según estudios de UC Irvine).

---

### 2. MIX DE INFRAESTRUCTURA ERGONÓMICA RECOMENDADO
* **Línea de Sillas:** ${employees}× Taranis ErgoPro Specialist = **USD ${ergoproTotal.toLocaleString('es-ES')}**
* **Línea Acústica Modular:** ${silenceDuoQty}× Silence Duo + ${silenceQuadQty}× Silence Quad = **USD ${silenceTotal.toLocaleString('es-ES')}**
* **Inversión Total de Infraestructura:** **USD ${totalInvestment.toLocaleString('es-ES')}**
* **Costo Total de Propiedad (TCO Diario):** **USD ${tcoDailyPerPerson} / día por colaborador** en 5 años de vida útil.
* **Plazo de Retorno sobre la Inversión (Payback):** **~${paybackYears} años**.`;

    exportToPdf({
      title: `Diagnóstico Ejecutivo de ROI — ${activeBrand.name}`,
      badge: 'Reporte Financiero B2B · Human-in-the-Loop',
      content: reportContent,
      brand: activeBrand
    });
  };

  const handleExportCustomPdf = () => {
    const reportContent = `# Diagnóstico Ejecutivo de Impacto & Retorno de Inversión (ROI)
**Organización:** ${activeBrand.name}
**Sector:** ${CATEGORY_ICONS[wizardForm.businessType]?.label || activeBrand.industry} | **Propuesta:** ${wizardForm.keyDifferentiator || activeBrand.tagline}
**Público / Decisores:** ${wizardForm.targetAudience || activeBrand.targetAudience}

---

### 1. RADIOGRAFÍA DE VALOR & PRODUCTIVIDAD
* **Horas Ahorradas por Persona al Mes:** ${customHoursSaved} horas (~${customHoursSaved * 12} horas anuales).
* **Impacto Anual para el Equipo (${customTeamSize} personas):** **${customAnnualHours.toLocaleString('es-ES')} horas recuperadas**.
* **Valor Económico Bruto del Tiempo Ganado:** **USD ${customAnnualValue.toLocaleString('es-ES')} / año** (a USD ${customHourlyRate}/h).

---

### 2. ANÁLISIS DE COSTO Y RETORNO
* **Inversión Mensual Estimada:** USD ${customMonthlyCost.toLocaleString('es-ES')} / mes.
* **Inversión Anual en la Solución:** USD ${customAnnualCost.toLocaleString('es-ES')} / año.
* **Ahorro Neto Real Anual:** **USD ${customNetSavings.toLocaleString('es-ES')}** (tras amortizar costos).
* **Retorno sobre la Inversión (ROI):** **+${customRoi} %**.
* **Plazo de Recuperación (Payback):** **~${customPayback} meses**.

---

### 3. DIFERENCIALES CLAVE DE ${activeBrand.name.toUpperCase()}
* ${wizardForm.topOfferings || activeBrand.catalogRules}
* Respuesta a la objeción principal: ${wizardForm.primaryObjection || 'Garantía y transparencia total'}
* Supervisión Human-in-the-Loop asegurada antes de cada publicación.`;

    exportToPdf({
      title: `ROI_Ejecutivo_${activeBrand.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
      badge: `Diagnóstico de Impacto · ${activeBrand.name}`,
      content: reportContent,
      brand: activeBrand
    });
  };

  return (
    <div>
      {/* HEADER BAR FOR CUSTOM BRANDS */}
      {isCustomBrand && (
        <div
          className="card"
          style={{
            marginBottom: '1.25rem',
            background: 'var(--card-gradient-purple)',
            borderColor: 'var(--border-accent)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className={`badge ${hasCustomShowroom ? 'badge-blue' : 'badge-purple'}`}>
                  {hasCustomShowroom ? '✨ Campaña a Medida Generada' : '🛠️ Estudio de Campaña Sin Hardcodear'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Rubro: <strong>{CATEGORY_ICONS[wizardForm.businessType]?.label || 'Personalizado'}</strong>
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
                {hasCustomShowroom
                  ? `Campaña multicanal calibrada con los datos reales de ${activeBrand.name}. Puedes abrir el asistente para modificar productos, objeciones o estética.`
                  : `Configura la información clave de ${activeBrand.name} para que la IA genere contenido real y adaptado a tu sector.`}
              </p>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsWizardOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', borderColor: 'var(--border-accent)' }}
            >
              <Settings2 size={15} />
              {hasCustomShowroom ? '🛠️ Ajustar Datos del Negocio & Regenerar' : '✨ Abrir Asistente de Configuración'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 SUB-NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.85rem'
        }}
      >
        <button
          className={`btn ${subTab === 'previews' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setSubTab('previews')}
        >
          <Share2 size={15} /> 1. Previsualizadores Nativos de Canales
        </button>
        <button
          className={`btn ${subTab === 'calendar' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setSubTab('calendar')}
        >
          <Calendar size={15} /> 2. Calendario Editorial (4 Semanas / 12 Piezas)
        </button>
        <button
          className={`btn ${subTab === 'calculator' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setSubTab('calculator')}
        >
          <Calculator size={15} />{' '}
          {isPenelope
            ? '3. Calculadora de Retención & LTV Skincare D2C'
            : isCustomBrand
            ? `3. Calculadora de Impacto & ROI — ${activeBrand.name}`
            : '3. Calculadora de ROI Ergonómico & NR-17'}
        </button>
      </div>

      {/* =====================================================================
          EMPTY STATE / WIZARD INVITATION FOR NEW COMPANIES
         ===================================================================== */}
      {isBrandShowroomEmpty && !isWizardOpen && subTab !== 'calculator' ? (
        <div className="card custom-hero-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', background: 'var(--card-gradient-purple)', borderColor: 'var(--border-accent)' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Compass size={34} />
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 800, marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
            Asistente de Campaña & Catálogo Multicanal para {activeBrand.name}
          </h2>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Para que esta herramienta sea verdaderamente útil y no use datos hardcodeados, completa 3 pasos rápidos con la información real de tu negocio (productos estrella, cliente ideal y objeciones de venta).
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 1.85rem',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
              }}
              onClick={() => setIsWizardOpen(true)}
            >
              <Settings2 size={18} /> Iniciar Asistente Guiado (3 Pasos)
            </button>
          </div>
        </div>
      ) : null}

      {/* =====================================================================
          INTERACTIVE 3-STEP WIZARD MODAL FOR ANY COMPANY (NOT HARDCODED!)
         ===================================================================== */}
      {isWizardOpen && (
        <div className="modal-backdrop" onClick={() => setIsWizardOpen(false)}>
          <div className="modal-card-xl" style={{ maxWidth: '880px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <span className="badge badge-purple">Asistente Estratégico de Campaña</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  Configura los Datos Reales de {activeBrand.name}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsWizardOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* STEPPER INDICATOR */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                { num: 1, title: '1. Tu Oferta & Diferenciales' },
                { num: 2, title: '2. Cliente & Objeciones' },
                { num: 3, title: '3. Estética & Calculadora' }
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  className={`btn ${wizardStep === s.num ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setWizardStep(s.num)}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* STEP 1: OFFERINGS & DIFFERENTIATORS */}
            {wizardStep === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label">1. ¿Cuál es el Sector o Rubro de {activeBrand.name}? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem', marginTop: '0.45rem' }}>
                    {Object.entries(CATEGORY_ICONS).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setWizardForm({ ...wizardForm, businessType: key })}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: wizardForm.businessType === key ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: wizardForm.businessType === key ? 'var(--accent-glow)' : 'var(--bg-card-inner)',
                          color: wizardForm.businessType === key ? 'var(--accent-secondary)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.15rem' }}>{val.icon}</span>
                        <span>{val.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">2. Productos o Servicios Estrella (¿Qué vendes exactamente?): *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={wizardForm.topOfferings}
                    onChange={(e) => setWizardForm({ ...wizardForm, topOfferings: e.target.value })}
                    placeholder="Ej: 1) Pastelería artesanal sin gluten y sin azúcar. 2) Tortas personalizadas para eventos. 3) Cajas de degustación mensuales con entrega a domicilio..."
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    💡 La IA usará estos productos reales para armar el carrusel de Instagram, el email y el post de LinkedIn.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">3. Tu Gran Diferencial Competitivo (¿Por qué elegirte a ti y no a la competencia?): *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={wizardForm.keyDifferentiator}
                    onChange={(e) => setWizardForm({ ...wizardForm, keyDifferentiator: e.target.value })}
                    placeholder="Ej: 100% libre de contaminación cruzada certificado / Tecnología láser sin dolor / Código abierto sin vendor lock-in..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button className="btn btn-primary" onClick={() => setWizardStep(2)}>
                    Siguiente: Cliente & Objeciones <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TARGET & OBJECTIONS */}
            {wizardStep === 2 && (
              <div>
                <div className="form-group">
                  <label className="form-label">1. ¿Quién es tu Cliente o Decisor Ideal? (Público Objetivo): *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={wizardForm.targetAudience}
                    onChange={(e) => setWizardForm({ ...wizardForm, targetAudience: e.target.value })}
                    placeholder="Ej: Personas con celiaquía o intolerancias alimentarias / Dueños de PyMEs / Familias que buscan comida saludable..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">2. ¿Cuál es su Mayor Dolor, Frustración o Necesidad? *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={wizardForm.keyPain}
                    onChange={(e) => setWizardForm({ ...wizardForm, keyPain: e.target.value })}
                    placeholder="Ej: Frustración de no encontrar dulces ricos que no les hagan daño / Miedo a gastar dinero en software que nadie usa / Desconfianza por malas experiencias previas..."
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    🎣 La IA usará este dolor como gancho en los primeros 3 segundos de los videos y en la portada del carrusel.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">3. ¿Cuál es la Principal Objeción que te ponen para no comprarte? *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={wizardForm.primaryObjection}
                    onChange={(e) => setWizardForm({ ...wizardForm, primaryObjection: e.target.value })}
                    placeholder="Ej: 'Es más caro que las opciones industriales' / 'Tarda mucho tiempo' / 'No creo que funcione para mí'..."
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    🛡️ La IA estructurará un slide del carrusel y un email enfocado en rebatir esta objeción con elegancia y argumentos sólidos.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setWizardStep(1)}>
                    <ChevronLeft size={16} /> Volver
                  </button>
                  <button className="btn btn-primary" onClick={() => setWizardStep(3)}>
                    Siguiente: Estética & Calculadora <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: AESTHETICS & CALCULATOR TYPE */}
            {wizardStep === 3 && (
              <div>
                <div className="form-group">
                  <label className="form-label">1. Selecciona la Vibra Estética y Visual para {activeBrand.name}: *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.45rem' }}>
                    {Object.entries(AESTHETIC_GRADIENTS).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setWizardForm({ ...wizardForm, aestheticVibe: key })}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: wizardForm.aestheticVibe === key ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: wizardForm.aestheticVibe === key ? 'var(--accent-glow)' : 'var(--bg-card-inner)',
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#7c3aed', marginBottom: '0.25rem' }}>
                          {val.tag}
                        </div>
                        <div style={{ height: '22px', borderRadius: '4px', background: val.bg, border: '1px solid rgba(0,0,0,0.1)' }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">2. ¿Qué Tipo de Calculadora se adapta mejor a tu Modelo de Negocio? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.45rem' }}>
                    {[
                      { key: 'roi_b2b', title: '🏢 Productividad & Costos (B2B)', desc: 'Mide horas ahorradas, reducción de ineficiencia y retorno económico anual.' },
                      { key: 'd2c_retention', title: '🛍️ Retención & LTV (Comercio / D2C)', desc: 'Mide recompra recurrente, ticket promedio e ingresos anuales por fidelización.' },
                      { key: 'clients_gain', title: '🎯 Captación & Facturación (Servicios)', desc: 'Mide prospectos mensuales, tasa de conversión y nuevos ingresos generados.' }
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setWizardForm({ ...wizardForm, calculatorType: c.key })}
                        style={{
                          padding: '0.85rem',
                          borderRadius: '10px',
                          border: wizardForm.calculatorType === c.key ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          background: wizardForm.calculatorType === c.key ? 'var(--accent-glow)' : 'var(--bg-card-inner)',
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: wizardForm.calculatorType === c.key ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                          {c.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">3. (Opcional) URL de Fotografía Real de Producto o Local:</label>
                  <input
                    type="url"
                    className="form-input"
                    value={wizardForm.imageUrl}
                    onChange={(e) => setWizardForm({ ...wizardForm, imageUrl: e.target.value })}
                    placeholder="https://tudominio.com/foto-producto.jpg (Si lo dejas vacío se genera activo visual nativo)"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setWizardStep(2)}>
                    <ChevronLeft size={16} /> Volver
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      fontSize: '1rem',
                      padding: '0.85rem 2rem',
                      background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
                    }}
                    onClick={handleRunWizardGeneration}
                    disabled={isGeneratingCampaign}
                  >
                    <Sparkles size={18} className={isGeneratingCampaign ? 'spin' : ''} />
                    {isGeneratingCampaign
                      ? (generationMsg || 'Generando Campaña con IA...')
                      : `🚀 Generar Campaña Completa con IA (${aiConfig.provider.toUpperCase()})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 1: PREVISUALIZADORES NATIVOS DE CANALES (ADAPTIVE VISUALS)
         ===================================================================== */}
      {subTab === 'previews' && !isBrandShowroomEmpty && (
        <div>
          {/* CHANNEL SELECTOR PILLS */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${selectedChannel === 'linkedin' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSelectedChannel('linkedin')}
            >
              Post de Autoridad / LinkedIn
            </button>
            <button
              className={`btn ${selectedChannel === 'carousel' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSelectedChannel('carousel')}
            >
              Carrusel Instagram ({carouselSlides.length} Slides)
            </button>
            <button
              className={`btn ${selectedChannel === 'email' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSelectedChannel('email')}
            >
              E-mail Marketing Consultivo
            </button>
            <button
              className={`btn ${selectedChannel === 'reels' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSelectedChannel('reels')}
            >
              Guion TikTok / Reels (45s)
            </button>
          </div>

          {/* CHANNEL: LINKEDIN */}
          {selectedChannel === 'linkedin' && showroom.linkedin && (
            <div className="card" style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-purple">{showroom.linkedin.badge}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setDetailModal({
                      title: showroom.linkedin.headline,
                      badge: showroom.linkedin.badge,
                      content: showroom.linkedin.fullText,
                      hashtags: showroom.linkedin.hashtags,
                      image: linkedinImage
                    })
                  }
                >
                  <Eye size={14} /> Inspeccionar Copy Completo en Pop-up
                </button>
              </div>

              {/* LINKEDIN MOCKUP CARD */}
              <div className="channel-mockup-box" style={{ padding: '1.25rem' }}>
                {/* Author Info */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isPenelope
                        ? 'linear-gradient(135deg, #c2185b, #ec4899)'
                        : isCustomBrand
                        ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
                        : 'linear-gradient(135deg, #6c3a83, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: '1.1rem'
                    }}
                  >
                    {isPenelope ? 'P' : isCustomBrand ? (activeBrand.name?.[0] || 'C') : 'TB'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                      {showroom.linkedin.author}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {showroom.linkedin.authorTitle}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {showroom.linkedin.date}
                    </div>
                  </div>
                </div>

                {/* Post Headline & Excerpt */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  {showroom.linkedin.headline}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '1rem' }}>
                  {showroom.linkedin.excerpt}
                </p>

                {/* Adaptive Visual Card */}
                <div style={{ marginBottom: '1rem' }}>
                  <AdaptiveBrandVisualCard
                    src={linkedinImage}
                    alt={showroom.linkedin.headline}
                    headline={showroom.linkedin.headline}
                    category={wizardForm.businessType}
                    aesthetic={wizardForm.aestheticVibe}
                    visualNote={showroom.linkedin.imageCaption}
                  />
                </div>

                {/* Metrics & Reactions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0',
                    borderTop: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ThumbsUp size={14} color="#38bdf8" /> {showroom.linkedin.metrics?.likes || '540'} recomendaciones
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span>{showroom.linkedin.metrics?.comments || '38'} comentarios</span>
                    <span>{showroom.linkedin.metrics?.shares || '72'} compartidos</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHANNEL: INSTAGRAM CAROUSEL */}
          {selectedChannel === 'carousel' && carouselSlides.length > 0 && (
            <div className="card" style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-purple">{carouselData.badge}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Lámina {currentSlide + 1} de {carouselSlides.length}
                </span>
              </div>

              {/* SLIDE CARD */}
              <div className="channel-mockup-box" style={{ overflow: 'hidden', position: 'relative', marginBottom: '1rem' }}>
                {/* Visual Area */}
                <div style={{ position: 'relative' }}>
                  <AdaptiveBrandVisualCard
                    src={carouselSlides[currentSlide]?.image}
                    alt={carouselSlides[currentSlide]?.title}
                    headline={carouselSlides[currentSlide]?.headline}
                    category={wizardForm.businessType}
                    aesthetic={wizardForm.aestheticVibe}
                    visualNote={carouselSlides[currentSlide]?.visualNote}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {currentSlide + 1} / {carouselSlides.length}
                  </div>
                </div>

                {/* Slide Text Content */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                    {carouselSlides[currentSlide]?.title}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {carouselSlides[currentSlide]?.headline}
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {carouselSlides[currentSlide]?.body}
                  </p>
                </div>

                {/* Arrows */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  style={{
                    position: 'absolute',
                    top: '140px',
                    left: '10px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  style={{
                    position: 'absolute',
                    top: '140px',
                    right: '10px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: currentSlide === idx ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentSlide === idx ? '#7c3aed' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setDetailModal({
                      title: carouselData.title,
                      badge: carouselData.badge,
                      content: `### ${carouselData.title}\\n*${carouselData.subtitle}*\\n\\n---\\n\\n` +
                        carouselSlides
                          .map((s) => `#### Slide ${s.slideNum}: ${s.title}\\n**${s.headline}**\\n${s.body}\\n\\n*Dirección visual:* ${s.visualNote}`)
                          .join('\\n\\n---\\n\\n'),
                      hashtags: carouselData.hashtags
                    })
                  }
                >
                  <Eye size={14} /> Inspeccionar los {carouselSlides.length} Slides en Pop-up
                </button>
              </div>
            </div>
          )}

          {/* CHANNEL: EMAIL MARKETING */}
          {selectedChannel === 'email' && showroom.email && (
            <div className="card" style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-purple">{showroom.email.badge}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setDetailModal({
                      title: showroom.email.subject,
                      badge: showroom.email.badge,
                      content: `**De:** ${showroom.email.from}\\n**Asunto:** ${showroom.email.subject}\\n\\n---\\n\\n${showroom.email.body}\\n\\n---\\n**CTA:** [${showroom.email.ctaText}](${showroom.email.ctaUrl})`,
                      hashtags: `#${activeBrand.name.replace(/[^a-zA-Z0-9]/g, '')} #MarketingConsultivo`
                    })
                  }
                >
                  <Eye size={14} /> Inspeccionar Email en Pop-up
                </button>
              </div>

              <div className="channel-mockup-box" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <strong>De:</strong> {showroom.email.from}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
                  <strong>Asunto:</strong> {showroom.email.subject}
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
                  {showroom.email.body}
                </div>
                {showroom.email.ctaText && (
                  <div style={{ textAlign: 'center' }}>
                    <a
                      href={showroom.email.ctaUrl || '#'}
                      className="btn btn-primary"
                      style={{ textDecoration: 'none', padding: '0.65rem 1.5rem' }}
                    >
                      {showroom.email.ctaText}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CHANNEL: REELS / TIKTOK */}
          {selectedChannel === 'reels' && showroom.reels && (
            <div className="card" style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-purple">{showroom.reels.badge}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setDetailModal({
                      title: `Guion de Video: ${showroom.reels.title}`,
                      badge: showroom.reels.badge,
                      content: `**Título:** ${showroom.reels.title} (${showroom.reels.duration})\\n\\n**Gancho (0-3s):** ${showroom.reels.hook}\\n\\n---\\n\\n### ESTRUCTURA ESCENA POR ESCENA:\\n\\n${(showroom.reels.structure || [])
                        .map((s) => `• **[${s.time}] ${s.label}:** ${s.desc}`)
                        .join('\\n\\n')}\\n\\n---\\n\\n**Copy Sugerido:** ${showroom.reels.copy}`,
                      hashtags: `#${activeBrand.name.replace(/[^a-zA-Z0-9]/g, '')} #VideoMarketing #Crecimiento`
                    })
                  }
                >
                  <Eye size={14} /> Inspeccionar Guion en Pop-up
                </button>
              </div>

              <div className="channel-mockup-box" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.45rem' }}>
                  {showroom.reels.title} ({showroom.reels.duration})
                </h4>
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: '#f3e8ff',
                    borderRadius: '6px',
                    fontSize: '0.86rem',
                    color: '#6b21a8',
                    marginBottom: '1rem',
                    fontWeight: 600
                  }}
                >
                  🎣 <strong>Gancho Visual (0-3s):</strong> {showroom.reels.hook}
                </div>

                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  {(showroom.reels.structure || []).map((scene, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem',
                        background: 'var(--bg-card-inner)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span className="badge badge-purple" style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                        {scene.time}
                      </span>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{scene.label}: </strong>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{scene.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: CALENDARIO EDITORIAL MENSUAL
         ===================================================================== */}
      {subTab === 'calendar' && !isBrandShowroomEmpty && (
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Calendario Editorial Mensual — {activeBrand.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  12 piezas programadas a 4 semanas distribuidas bajo la regla 3:1 (Educar 40%, Inspirar 30%, Involucrar 30%).
                </p>
              </div>

              {/* FILTERS */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                  value={calendarChannelFilter}
                  onChange={(e) => setCalendarChannelFilter(e.target.value)}
                >
                  <option value="all">Todos los Canales</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="reels">TikTok / Reels</option>
                  <option value="blog">Blog SEO</option>
                  <option value="mail">E-mail / Newsletter</option>
                </select>

                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                  value={calendarPillarFilter}
                  onChange={(e) => setCalendarPillarFilter(e.target.value)}
                >
                  <option value="all">Todos los Pilares</option>
                  <option value="educar">Educar (40 %)</option>
                  <option value="inspirar">Inspirar (30 %)</option>
                  <option value="involucrar">Involucrar (30 %)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 12 PIECES GRID */}
          <div className="grid-3" style={{ gap: '1rem' }}>
            {filteredCalendar.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onClick={() =>
                  setDetailModal({
                    title: item.title,
                    badge: `${item.week} · ${item.day} — ${item.channel}`,
                    content: `### ${item.title}\n**Canal:** ${item.channel} | **Formato:** ${item.format}\n**Pilar Editorial:** ${item.pillar}\n\n**Gancho / Hook:**\n> ${item.hook}\n\n**Estrategia & Resumen:**\n${item.summary}\n\n**Público Objetivo:**\n${item.target}`,
                    hashtags: `#${activeBrand.name.replace(/[^a-zA-Z0-9]/g, '')} #MarketingConIA`
                  })
                }
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {item.week} · {item.day}
                    </span>
                    <span className={`badge ${item.pillarBadge}`}>{item.pillar}</span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {item.channel} · {item.format}
                  </div>

                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.35 }}>
                    {item.title}
                  </h4>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                    {item.summary}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    🎯 {item.target?.slice(0, 28)}...
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    Ver &gt;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: CALCULADORA INTERACTIVA DE RETORNO / ROI
         ===================================================================== */}
      {subTab === 'calculator' && (
        <div>
          {isPenelope ? (
            /* D2C Retention Calculator */
            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card">
                <div className="section-header">
                  <div className="section-title">
                    <Heart size={20} color="#ec4899" />
                    <span>Métricas de Retención & LTV de la Comunidad</span>
                  </div>
                  <span className="badge badge-pink">Ecosistema D2C</span>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>1. Suscriptoras / Clientas Activas:</label>
                    <strong style={{ color: '#ec4899', fontSize: '1rem' }}>{subscribers.toLocaleString()} clientas</strong>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={subscribers}
                    onChange={(e) => setSubscribers(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>2. Ticket Promedio Mensual (USD):</label>
                    <strong style={{ color: '#10b981', fontSize: '1rem' }}>USD {avgTicket} (~R$ {avgTicket * 5})</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="2"
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>3. Tasa de Recompra Actual (Sin Educación):</label>
                    <strong style={{ color: '#f59e0b', fontSize: '1rem' }}>{currentRepurchase} %</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    value={currentRepurchase}
                    onChange={(e) => setCurrentRepurchase(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>4. Recompra Proyectada con Educación Multicanal:</label>
                    <strong style={{ color: '#ec4899', fontSize: '1rem' }}>{projectedRepurchase} % (+{retentionGainPp} pp)</strong>
                  </div>
                  <input
                    type="range"
                    min={currentRepurchase + 5}
                    max="70"
                    step="1"
                    value={projectedRepurchase}
                    onChange={(e) => setProjectedRepurchase(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* D2C Results */}
              <div className="card" style={{ background: 'var(--card-gradient-pink)' }}>
                <div className="section-header">
                  <div className="section-title">
                    <Sparkles size={20} color="#ec4899" />
                    <span>Impacto en Ingresos & Fidelización D2C</span>
                  </div>
                  <span className="badge badge-pink">LTV & Retención</span>
                </div>

                <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="card kpi-card kpi-card-success">
                    <div className="kpi-label">Ingreso Anual Adicional</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      USD {annualExtraRevenue.toLocaleString()}
                    </div>
                    <div className="kpi-sub">Por retención de recompras recurrentes</div>
                  </div>

                  <div className="card kpi-card kpi-card-pink">
                    <div className="kpi-label">LTV a 24 Meses / Clienta</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      USD {projectedLtv24m}
                    </div>
                    <div className="kpi-sub">+68 % vs. compra única transaccional</div>
                  </div>
                </div>
              </div>
            </div>
          ) : isCustomBrand ? (
            /* Custom Company Adaptive Calculator */
            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card">
                <div className="section-header">
                  <div className="section-title">
                    <Calculator size={20} color="#7c3aed" />
                    <span>Parámetros de Impacto — {activeBrand.name}</span>
                  </div>
                  <span className="badge badge-purple">Simulador Estratégico</span>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>1. Equipo o Clientes Impactados:</label>
                    <strong style={{ color: '#7c3aed', fontSize: '1rem' }}>{customTeamSize} personas / cuentas</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={customTeamSize}
                    onChange={(e) => setCustomTeamSize(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>2. Horas o Eficiencia Ganada al Mes por Cuenta:</label>
                    <strong style={{ color: '#059669', fontSize: '1rem' }}>{customHoursSaved} horas / mes</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="2"
                    value={customHoursSaved}
                    onChange={(e) => setCustomHoursSaved(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>3. Costo Promedio por Hora (USD):</label>
                    <strong style={{ color: '#d97706', fontSize: '1rem' }}>USD {customHourlyRate} / hora</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={customHourlyRate}
                    onChange={(e) => setCustomHourlyRate(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>4. Inversión Mensual Estimada en la Solución (USD):</label>
                    <strong style={{ color: '#7c3aed', fontSize: '1rem' }}>USD {customMonthlyCost.toLocaleString()} / mes</strong>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={customMonthlyCost}
                    onChange={(e) => setCustomMonthlyCost(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
                  onClick={handleExportCustomPdf}
                >
                  <Printer size={16} /> Descargar Diagnóstico de Impacto en PDF
                </button>
              </div>

              {/* Custom Company Results */}
              <div className="card" style={{ background: 'var(--card-gradient-purple)' }}>
                <div className="section-header">
                  <div className="section-title">
                    <TrendingDown size={20} color="#059669" />
                    <span>Retorno Financiero & Horas Ganadas</span>
                  </div>
                  <span className="badge badge-green">Impacto Operativo</span>
                </div>

                <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="card kpi-card kpi-card-success">
                    <div className="kpi-label">Ahorro Económico Anual</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      USD {customAnnualValue.toLocaleString()}
                    </div>
                    <div className="kpi-sub">Valor bruto del tiempo recuperado</div>
                  </div>

                  <div className="card kpi-card kpi-card-purple">
                    <div className="kpi-label">Horas Útiles Ganadas</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      {customAnnualHours.toLocaleString()} h
                    </div>
                    <div className="kpi-sub">Al año para toda la organización</div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Balance de Retorno para {activeBrand.name}:
                  </h4>
                  <ul style={{ fontSize: '0.84rem', paddingLeft: '1.2rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    <li><strong>Inversión Anual:</strong> USD {customAnnualCost.toLocaleString()} / año.</li>
                    <li><strong>Ahorro Neto:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>USD {customNetSavings.toLocaleString()} / año</span>.</li>
                    <li><strong>Retorno sobre la Inversión (ROI):</strong> <span style={{ color: '#7c3aed', fontWeight: 800 }}>+{customRoi} %</span>.</li>
                    <li><strong>Plazo de Recuperación (Payback):</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>~{customPayback} meses</span>.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Taranis Black B2B */
            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card">
                <div className="section-header">
                  <div className="section-title">
                    <Calculator size={20} color="#7c3aed" />
                    <span>Parámetros de la Empresa Prospecto</span>
                  </div>
                  <span className="badge badge-purple">Lead Magnet B2B</span>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>1. Cantidad de Colaboradores:</label>
                    <strong style={{ color: '#7c3aed', fontSize: '1rem' }}>{employees} colaboradores</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>2. Salario Promedio Mensual (USD):</label>
                    <strong style={{ color: '#059669', fontSize: '1rem' }}>USD {avgSalary.toLocaleString()} / mes</strong>
                  </div>
                  <input
                    type="range"
                    min="1200"
                    max="8000"
                    step="100"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>3. Tasa de Bajas Médicas LER/DORT anual:</label>
                    <strong style={{ color: '#d97706', fontSize: '1rem' }}>{sickLeaveRate} % anual (~{annualLeaves} bajas)</strong>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={sickLeaveRate}
                    onChange={(e) => setSickLeaveRate(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>4. Interrupciones Acústicas Promedio al Día:</label>
                    <strong style={{ color: '#be185d', fontSize: '1rem' }}>{interruptionsPerDay} interrupciones / día</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={interruptionsPerDay}
                    onChange={(e) => setInterruptionsPerDay(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                  onClick={handleExportRoiPdf}
                >
                  <Printer size={16} /> Descargar Diagnóstico Ejecutivo de ROI en PDF
                </button>
              </div>

              {/* Taranis Results */}
              <div className="card" style={{ background: 'var(--card-gradient-purple)' }}>
                <div className="section-header">
                  <div className="section-title">
                    <TrendingDown size={20} color="#059669" />
                    <span>Diagnóstico Financiero de Mitigación</span>
                  </div>
                  <span className="badge badge-green">ROI & TCO Proyectado</span>
                </div>

                <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="card kpi-card kpi-card-danger">
                    <div className="kpi-label">Costo Oculto de Ausentismo</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      USD {hiddenAbsenteeismCost.toLocaleString()}
                    </div>
                    <div className="kpi-sub">Impacto de ~3x salario por baja</div>
                  </div>

                  <div className="card kpi-card kpi-card-purple">
                    <div className="kpi-label">Foco Perdido por Ruido</div>
                    <div className="kpi-value" style={{ fontSize: '1.45rem' }}>
                      {lostFocusHoursPerPerson} h / año
                    </div>
                    <div className="kpi-sub">Por colaborador (~{totalCompanyLostHours.toLocaleString()} h empresa)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          WIDE POP-UP MODAL: INSPECT DETAIL PIECE
         ===================================================================== */}
      {detailModal && (
        <div className="modal-backdrop" onClick={() => setDetailModal(null)}>
          <div className="modal-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="badge badge-purple">{detailModal.badge}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                  {detailModal.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(detailModal.content);
                    alert('¡Contenido copiado al portapapeles!');
                  }}
                >
                  <Copy size={14} /> Copiar
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    exportToPdf({
                      title: detailModal.title,
                      badge: detailModal.badge,
                      content: detailModal.content,
                      brand: activeBrand
                    })
                  }
                >
                  <Printer size={14} /> PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setDetailModal(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="ai-modal-box" style={{ padding: '1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <MarkdownRenderer content={detailModal.content} />
            </div>

            {detailModal.hashtags && (
              <div style={{ fontSize: '0.82rem', color: '#7c3aed', fontWeight: 700 }}>
                {detailModal.hashtags}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
