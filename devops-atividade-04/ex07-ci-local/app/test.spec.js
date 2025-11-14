/**
 * Testes unitários para a aplicação
 * 
 * Para testar falha: mude expect(true).toBe(true) para expect(true).toBe(false)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { somar, multiplicar } from './index.js';

test('somar dois números', () => {
  assert.strictEqual(somar(2, 3), 5);
  assert.strictEqual(somar(-1, 1), 0);
  assert.strictEqual(somar(0, 0), 0);
});

test('multiplicar dois números', () => {
  assert.strictEqual(multiplicar(2, 3), 6);
  assert.strictEqual(multiplicar(-2, 3), -6);
  assert.strictEqual(multiplicar(5, 0), 0);
});

test('caso de sucesso trivial', () => {
  // ✅ TESTE PASSA: Pipeline publica imagem
  assert.strictEqual(true, true);
  
  // ❌ Para testar FALHA, descomente a linha abaixo:
  // assert.strictEqual(true, false);
});

console.log('🧪 Executando testes...');
