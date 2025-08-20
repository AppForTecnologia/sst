#!/usr/bin/env node

/**
 * Script de build específico para o Render
 * Resolve problemas de permissão e garante que o build funcione
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build para Render...');

try {
  // Verifica se estamos no ambiente do Render
  const isRender = process.env.RENDER || process.env.RENDER_EXTERNAL_HOSTNAME;
  console.log(`🌐 Ambiente: ${isRender ? 'Render' : 'Local'}`);
  
  // Instala dependências se necessário
  console.log('📦 Verificando dependências...');
  if (!fs.existsSync('node_modules/vite')) {
    console.log('📥 Instalando dependências...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Executa o build usando npx
  console.log('🔨 Executando build com npx...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Verifica se o build foi criado
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Pasta dist não foi criada!');
  }
  
  // Verifica se os arquivos principais existem
  const requiredFiles = [
    'index.html',
    'manifest.json',
    'assets'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Arquivo ${file} não encontrado em dist/`);
    } else {
      console.log(`✅ ${file} encontrado`);
    }
  }
  
  // Copia o arquivo _redirects se existir
  const redirectsSource = path.join(process.cwd(), 'public', '_redirects');
  const redirectsDest = path.join(distPath, '_redirects');
  
  if (fs.existsSync(redirectsSource)) {
    fs.copyFileSync(redirectsSource, redirectsDest);
    console.log('✅ _redirects copiado para dist/');
  }
  
  console.log('🎉 Build concluído com sucesso!');
  console.log('📁 Arquivos em dist/:', fs.readdirSync(distPath));
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
