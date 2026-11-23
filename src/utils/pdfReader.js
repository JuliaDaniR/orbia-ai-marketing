import * as pdfjsLib from 'pdfjs-dist';

// Configure worker via CDN matching pdfjs-dist version so it works seamlessly in Vite dev & build
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json')) {
    const text = await file.text();
    return {
      name: file.name,
      type: fileName.split('.').pop().toUpperCase(),
      pages: 1,
      charCount: text.length,
      content: text,
    };
  }

  if (fileName.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += `\n--- [Página ${i}] ---\n${pageText}\n`;
    }

    return {
      name: file.name,
      type: 'PDF',
      pages: pdf.numPages,
      charCount: fullText.length,
      content: fullText.trim(),
    };
  }

  throw new Error('Formato no soportado. Sube un archivo .PDF, .TXT o .MD');
}
