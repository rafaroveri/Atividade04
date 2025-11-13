import http from 'http';

const PORT = 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  // Log da requisição
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Resposta simples
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Biblioteca online ok\n');
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`📚 Biblioteca online - DevOps Atividade 04`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso.');
    process.exit(0);
  });
});
