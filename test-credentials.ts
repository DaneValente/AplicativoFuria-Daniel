import { TwitterApi } from 'twitter-api-v2';

import * as dotenv from 'dotenv';

// npx ts-node test-credentials.ts

async function main() {
  console.log("🚀 Iniciando teste de credenciais do Twitter");
  
  // 1. Carregar .env
  dotenv.config();
  console.log("✅ Arquivo .env carregado");

  // 2. Verificar credenciais
  const credentials = {
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
  };

  console.log("\n🔍 Credenciais detectadas:");
  console.table({
    'TWITTER_API_KEY': credentials.appKey ? '****' : '❌ FALTANDO',
    'TWITTER_API_SECRET': credentials.appSecret ? '****' : '❌ FALTANDO',
    'TWITTER_ACCESS_TOKEN': credentials.accessToken ? '****' : '❌ FALTANDO',
    'TWITTER_ACCESS_SECRET': credentials.accessSecret ? '****' : '❌ FALTANDO'
  });

  // 3. Validar presença
  if (!credentials.appKey || !credentials.appSecret || 
      !credentials.accessToken || !credentials.accessSecret) {
    throw new Error("Credenciais incompletas no arquivo .env");
  }

  // 4. Testar API
  try {
    console.log("\n🔗 Conectando à API Twitter...");
    const client = new TwitterApi(credentials);
    const user = await client.v2.me();
    console.log("\n🎉 CONEXÃO BEM-SUCEDIDA!");
    console.log(`Você está conectado como: @${user.data.username}`);
  } catch (error) {
    console.error("\n❌ FALHA NA CONEXÃO:");
    console.error("Código:", error.code);
    console.error("Erro:", error.message);
    console.error("\n🛠️  Solução:");
    console.error("1. Verifique se todas as credenciais estão corretas");
    console.error("2. Gere novos tokens no portal do desenvolvedor");
    console.error("3. Verifique as permissões do app (precisa de 'Read & Write')");
    process.exit(1);
  }
}

main().catch(console.error);