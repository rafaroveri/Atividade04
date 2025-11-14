import http from 'http';
import fs from 'fs';
import yaml from 'yaml';

const PORT = process.env.PORT || 8080;
const CONFIG_PATH = '/etc/app/config.yml';

const maskSecret = (value) => (value ? '***CONFIGURED***' : 'NOT_SET');

// ============================================
// CARREGA CONFIGURAÇÕES DE FORMA SEGURA
// ============================================

let config = {};

try {
  const configFile = fs.readFileSync(CONFIG_PATH, 'utf8');
  config = yaml.parse(configFile) || {};
  console.log('✅ Configurações carregadas de:', CONFIG_PATH);
} catch (err) {
  console.warn('⚠️  Arquivo de config não encontrado, usando defaults');
  config = { app_name: 'default', feature_flags: {} };
}

// Valida variáveis obrigatórias
const requiredEnvVars = ['APP_NAME', 'SECRET_API_KEY'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`❌ ERRO: Variável ${varName} não definida!`);
    process.exit(1);
  }
}

// ⚠️ NÃO loga segredos!
console.log('🔒 App Name:', process.env.APP_NAME);
console.log('🔒 API Key:', maskSecret(process.env.SECRET_API_KEY));
console.log('🔒 Database URL:', maskSecret(process.env.DATABASE_URL));
console.log('🔒 JWT Secret:', maskSecret(process.env.JWT_SECRET));

const getAppInfo = () => ({
  name: process.env.APP_NAME,
  version:
    process.env.APP_VERSION || config.version || config.app?.version || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const getFeatureFlags = () => {
  if (config.feature_flags && typeof config.feature_flags === 'object') {
    return config.feature_flags;
  }
  if (config.features && typeof config.features === 'object') {
    return config.features;
  }
  return {};
};

const getPublicConfig = () => {
  const safeConfig = { ...config };
  if (safeConfig.secrets) {
    safeConfig.secrets = Object.keys(safeConfig.secrets).reduce((acc, key) => {
      acc[key] = maskSecret(safeConfig.secrets[key]);
      return acc;
    }, {});
  }
  return safeConfig;
};

// ============================================
// SERVIDOR HTTP
// ============================================

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Endpoint /info: retorna configurações (mascarando segredos)
  if (req.url === '/info' && req.method === 'GET') {
    const info = {
      app: getAppInfo(),
      features: getFeatureFlags(),
      secrets: {
        apiKey: maskSecret(process.env.SECRET_API_KEY),
        databaseUrl: maskSecret(process.env.DATABASE_URL),
        jwtSecret: maskSecret(process.env.JWT_SECRET),
      },
      config: getPublicConfig(),
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(info, null, 2));
    return;
  }

  // Rota raiz
  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('🔒 API de Configurações Seguras\n\nAcesse: /info\n');
    return;
  }

  // 404 para outras rotas
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found\n');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🔒 API Configurações Seguras           ║');
  console.log('║   DevOps - Atividade 04                  ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Servidor rodando em http://0.0.0.0:${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/info`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando...');
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});
