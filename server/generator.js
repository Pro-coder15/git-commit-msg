// server/generator.js

function generateCommitMessages({ description = '', diff = '', type = 'feat' }) {
  // Basic heuristics
  const base = description || summarizeDiff(diff);
  const typePrefix = type || 'chore';

  const templates = [
    `${typePrefix}: ${base}`,
    `${typePrefix}(${guessScope(base)}): ${capitalizeFirst(base)}`,
    `${typePrefix}: ${addEmoji(typePrefix)} ${capitalizeFirst(base)}`
  ];

  return templates;
}

function summarizeDiff(diff) {
  if (!diff) return 'update project files';
  if (diff.includes('function') || diff.includes('=>')) return 'refactor code';
  if (diff.includes('README')) return 'update docs';
  if (diff.includes('test')) return 'add tests';
  return 'update files';
}

function guessScope(text) {
  if (text.includes('api')) return 'api';
  if (text.includes('ui')) return 'ui';
  if (text.includes('readme') || text.includes('docs')) return 'docs';
  if (text.includes('config')) return 'config';
  return 'core';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addEmoji(type) {
  const map = {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    chore: '🧹',
    refactor: '♻️'
  };
  return map[type] || '💬';
}

module.exports = { generateCommitMessages };
