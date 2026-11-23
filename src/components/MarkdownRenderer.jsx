import React from 'react';

/**
 * Renderizador de Markdown elegante para la suite de Taranis Black & Penélope.
 * Formatea títulos, listas, negritas, divisores, citas y checklists de gobernanza con estética ejecutiva.
 */
export function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            style={{
              paddingLeft: '1.4rem',
              marginBottom: '1rem',
              lineHeight: 1.7,
              color: '#e2e8f0'
            }}
          >
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            style={{
              paddingLeft: '1.4rem',
              marginBottom: '1rem',
              lineHeight: 1.7,
              listStyleType: 'disc',
              color: '#e2e8f0'
            }}
          >
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.35rem' }}>
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Línea vacía
    if (!trimmed) {
      flushList();
      return;
    }

    // Divisor horizontal
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(
        <hr
          key={`hr-${index}`}
          style={{
            borderColor: 'var(--border-color)',
            opacity: 0.35,
            margin: '1.4rem 0'
          }}
        />
      );
      return;
    }

    // Título H1
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1
          key={`h1-${index}`}
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#f8fafc',
            marginTop: '1.4rem',
            marginBottom: '0.75rem',
            paddingBottom: '0.35rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Título H2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${index}`}
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#c084fc',
            marginTop: '1.25rem',
            marginBottom: '0.6rem'
          }}
        >
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    // Título H3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${index}`}
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#d8b4fe',
            marginTop: '1.1rem',
            marginBottom: '0.45rem'
          }}
        >
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Título H4
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4
          key={`h4-${index}`}
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#e9d5ff',
            marginTop: '0.9rem',
            marginBottom: '0.35rem'
          }}
        >
          {renderInline(trimmed.slice(5))}
        </h4>
      );
      return;
    }

    // Cita / Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${index}`}
          style={{
            borderLeft: '3px solid #a855f7',
            paddingLeft: '1rem',
            margin: '0.85rem 0',
            fontStyle: 'italic',
            color: '#cbd5e1',
            background: 'rgba(168, 85, 247, 0.06)',
            padding: '0.65rem 1rem',
            borderRadius: '0 8px 8px 0'
          }}
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Elemento de lista ordenada (1. , 2. )
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      currentList.push(olMatch[2]);
      return;
    }

    // Elemento de lista desordenada (- , * , • )
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)/);
    if (ulMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(ulMatch[1]);
      return;
    }

    // Párrafo estándar
    flushList();
    elements.push(
      <p
        key={`p-${index}`}
        style={{
          marginBottom: '0.85rem',
          lineHeight: 1.7,
          color: '#f1f5f9',
          fontSize: '0.9rem'
        }}
      >
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return (
    <div
      className="markdown-content"
      style={{
        lineHeight: 1.7,
        fontSize: '0.9rem',
        color: '#f1f5f9'
      }}
    >
      {elements}
    </div>
  );
}

/**
 * Procesa formato en línea: **negrita**, *cursiva*, `código`, badges de checklist [✅] y enlaces.
 */
function renderInline(text) {
  if (!text) return null;

  // Reemplazo de checklists [✅], [❌], [ ] por badges interactivos visuales
  const parts = [];
  let remaining = text;

  // Regex para detectar tokens: `code`, **bold**, *italic*, [✅], [❌], ✅, ❌
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[✅xX]\]|\[[❌\s]\]|✅|❌)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(remaining.substring(lastIndex, match.index));
    }

    const token = match[0];
    const key = `inline-${lastIndex}-${match.index}`;

    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key}
          style={{
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#e9d5ff',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            fontSize: '0.84em',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key} style={{ color: '#ffffff', fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key} style={{ color: '#d8b4fe' }}>
          {token.slice(1, -1)}
        </em>
      );
    } else if (token === '[✅]' || token === '[x]' || token === '[X]' || token === '✅') {
      parts.push(
        <span
          key={key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#86efac',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: 700,
            margin: '0 0.2rem'
          }}
        >
          ✓ CUMPLIDO
        </span>
      );
    } else if (token === '[❌]' || token === '❌') {
      parts.push(
        <span
          key={key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: 700,
            margin: '0 0.2rem'
          }}
        >
          ✗ BLOQUEADO
        </span>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < remaining.length) {
    parts.push(remaining.substring(lastIndex));
  }

  return parts;
}
