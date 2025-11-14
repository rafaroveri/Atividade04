/**
 * Aplicação simples de exemplo para pipeline CI
 */

export function somar(a, b) {
  return a + b;
}

export function multiplicar(a, b) {
  return a * b;
}

// Servidor HTTP básico (opcional)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('📚 Biblioteca CI - Aplicação rodando');
  console.log('✅ Funções: somar(), multiplicar()');
}
