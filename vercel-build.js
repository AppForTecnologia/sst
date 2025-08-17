#!/usr/bin/env node

/**
 * Script de build específico para a Vercel
 * Garante que todos os arquivos necessários sejam copiados
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build para Vercel...');

try {
  // Executa o build do Vite
  console.log('📦 Executando build do Vite...');
  execSync('npm run build', { stdio: 'inherit' });
  
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
