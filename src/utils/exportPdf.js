/**
 * Exporta el resultado de la Skill a un documento PDF ejecutivo listo para imprimir o guardar.
 * Abre una ventana estilizada con tipografía corporativa y activa la vista de impresión / guardado PDF.
 */
export function exportToPdf({ title, badge, content, brand, modelName, images = [] }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilita las ventanas emergentes (pop-ups) en tu navegador para generar el PDF.');
    return;
  }

  // Convierte markdown básico en HTML limpio para impresión
  const formattedHtml = content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^---$/gim, '<hr/>')
    .replace(/\[✅\]|\[x\]|✅/gim, '<span class="badge-ok">✓ CUMPLIDO</span>')
    .replace(/\[❌\]|❌/gim, '<span class="badge-err">✗ BLOQUEADO</span>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br/>');

  const imagesHtml =
    images.length > 0
      ? `
    <div class="visual-assets">
      <h3>Activos Visuales de Campaña</h3>
      ${images
        .map(
          (img) => `
        <div class="asset-card">
          <img src="${img.src}" alt="${img.title || ''}" />
          <p><strong>${img.title || ''}</strong><br/><small>${img.caption || ''}</small></p>
        </div>
      `
        )
        .join('')}
    </div>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title} — ${brand.name}</title>
  <style>
    @page {
      margin: 1.8cm;
      size: A4 portrait;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.65;
      font-size: 11pt;
      margin: 0;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #6c3a83;
      padding-bottom: 14px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 800;
      color: #3b1b4d;
      margin: 0;
    }
    .brand-tagline {
      font-size: 9.5pt;
      color: #666;
      margin: 3px 0 0;
    }
    .meta-box {
      text-align: right;
      font-size: 8.5pt;
      color: #777;
    }
    .doc-badge {
      display: inline-block;
      background: #f3e8ff;
      color: #6c3a83;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }
    h1 { font-size: 15pt; color: #3b1b4d; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 22px; }
    h2 { font-size: 13pt; color: #6c3a83; margin-top: 18px; }
    h3 { font-size: 11.5pt; color: #2d3748; margin-top: 14px; }
    h4 { font-size: 10.5pt; color: #4a5568; margin-top: 10px; }
    p { margin: 0 0 10px 0; }
    blockquote {
      border-left: 3px solid #6c3a83;
      background: #faf5ff;
      padding: 8px 14px;
      margin: 12px 0;
      font-style: italic;
      color: #4a5568;
    }
    code {
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 9pt;
      color: #0f172a;
    }
    hr {
      border: 0;
      border-top: 1px solid #cbd5e1;
      margin: 20px 0;
    }
    .badge-ok {
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8pt;
    }
    .badge-err {
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8pt;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      margin-top: 30px;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    .visual-assets {
      page-break-inside: avoid;
      margin-top: 24px;
    }
    .asset-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 12px;
    }
    .asset-card img {
      width: 100%;
      max-height: 380px;
      object-fit: cover;
      border-radius: 4px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">${brand.name}</div>
      <div class="brand-tagline">${brand.tagline}</div>
    </div>
    <div class="meta-box">
      <div class="doc-badge">${badge}</div>
      <div>Fecha: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      <div>Motor IA: ${modelName || 'Simulador Inteligente'}</div>
    </div>
  </div>

  <h2>${title}</h2>

  <div class="content">
    <p>${formattedHtml}</p>
  </div>

  ${imagesHtml}

  <div class="footer">
    <div>Documento Generado por AI Marketing OS & Skill Orchestrator · Challenge ONE AI (G11)</div>
    <div>Página 1 / Validación Human-in-the-Loop</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
