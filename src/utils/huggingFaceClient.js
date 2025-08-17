/**
 * Cliente para integração com Hugging Face API
 * Utiliza modelos de conversação para gerar respostas inteligentes
 */

// Token de acesso da Hugging Face
const HF_TOKEN = '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';

// URL base da API da Hugging Face
const HF_API_BASE = 'https://api-inference.huggingface.co/models';

// Modelos avançados ordenados por qualidade
const ADVANCED_MODELS = [
  'mistralai/Mixtral-8x7B-Instruct-v0.1',
  'microsoft/DialoGPT-large',
  'facebook/blenderbot-1B-distill',
  'google/flan-t5-large',
  'microsoft/DialoGPT-medium'
];

// Modelo principal mais avançado
const DEFAULT_MODEL = ADVANCED_MODELS[0];

/**
 * Configurações avançadas para diferentes tipos de modelo
 */
const ADVANCED_CONFIG = {
  temperature: 0.8,
  max_new_tokens: 300,
  do_sample: true,
  top_p: 0.95,
  top_k: 50,
  repetition_penalty: 1.15,
  no_repeat_ngram_size: 3
};

const FALLBACK_CONFIG = {
  temperature: 0.7,
  max_length: 200,
  do_sample: true,
  pad_token_id: 50256
};

/**
 * Realiza uma requisição para a API da Hugging Face
 * @param {string} model - Nome do modelo a ser utilizado
 * @param {string} input - Texto de entrada para o modelo
 * @param {object} options - Opções adicionais para a requisição
 * @returns {Promise<string>} - Resposta gerada pelo modelo
 */
async function queryHuggingFace(model, input, options = {}) {
  const url = `${HF_API_BASE}/${model}`;
  
  const payload = {
    inputs: input,
    parameters: {
      ...DEFAULT_CONFIG,
      ...options
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro da API Hugging Face: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    
    // Diferentes modelos retornam formatos diferentes
    if (Array.isArray(data) && data.length > 0) {
      // Para modelos de text generation
      if (data[0].generated_text) {
        return data[0].generated_text;
      }
      // Para modelos de conversação
      if (data[0].response) {
        return data[0].response;
      }
      // Fallback para outros formatos
      return data[0].text || data[0].output || JSON.stringify(data[0]);
    }
    
    throw new Error('Formato de resposta inesperado da API');
  } catch (error) {
    console.error('Erro ao consultar Hugging Face:', error);
    throw error;
  }
}

/**
 * Contextualiza a pergunta do usuário com informações técnicas avançadas sobre SST
 * @param {string} userMessage - Mensagem do usuário
 * @param {string[]} conversationHistory - Histórico da conversa para contexto
 * @returns {string} - Mensagem contextualizada
 */
function contextualizeForSST(userMessage, conversationHistory = []) {
  const advancedContext = `Você é Dr. SST, um especialista mundial em Segurança e Saúde no Trabalho com 20+ anos de experiência. Sua expertise abrange:

🔹 NORMAS REGULAMENTADORAS: Domínio completo das 37 NRs brasileiras, interpretação técnica, aplicação prática
🔹 ANÁLISE DE RISCOS: Metodologias HAZOP, FMEA, FTA, Bow-tie, matriz 5x5, análise preliminar de perigos
🔹 ERGONOMIA: Biomecânica ocupacional, análise ergonômica do trabalho, LER/DORT, fatores humanos
🔹 HIGIENE OCUPACIONAL: Avaliação de agentes físicos, químicos e biológicos, limites de tolerância
🔹 ENGENHARIA DE SEGURANÇA: Proteções coletivas, sistemas de segurança, projeto de ambientes seguros
🔹 MEDICINA DO TRABALHO: PCMSO, ASO, nexo causal, doenças ocupacionais
🔹 GESTÃO SST: ISO 45001, OHSAS 18001, programas de gestão, indicadores de desempenho
🔹 LEGISLAÇÃO: CLT, NRs, convenções OIT, jurisprudência trabalhista

DIRETRIZES DE RESPOSTA:
- Forneça respostas técnicas detalhadas com fundamentos legais
- Cite normas específicas (NR, ISO, ABNT) quando relevante
- Inclua exemplos práticos e casos reais
- Mencione consequências legais e responsabilidades
- Sugira medidas preventivas concretas
- Use linguagem técnica apropriada mas acessível

${conversationHistory.length > 0 ? `CONTEXTO DA CONVERSA:\n${conversationHistory.join('\n')}\n` : ''}

PERGUNTA ATUAL: ${userMessage}

RESPOSTA ESPECIALIZADA:`;
  
  return advancedContext;
}

/**
 * Processa e melhora a resposta do modelo para ser mais inteligente
 * @param {string} rawResponse - Resposta bruta do modelo
 * @param {string} userMessage - Mensagem original do usuário
 * @returns {string} - Resposta processada e otimizada
 */
function processResponse(rawResponse, userMessage) {
  let cleanResponse = rawResponse;
  
  // Remove prefixos do contexto
  const prefixesToRemove = [
    'RESPOSTA ESPECIALIZADA:',
    'Assistente SST:',
    'Dr. SST:',
    'Resposta:',
    'R:'
  ];
  
  prefixesToRemove.forEach(prefix => {
    if (cleanResponse.includes(prefix)) {
      cleanResponse = cleanResponse.split(prefix).pop().trim();
    }
  });
  
  // Remove repetições da pergunta
  if (cleanResponse.includes(userMessage)) {
    cleanResponse = cleanResponse.replace(userMessage, '').trim();
  }
  
  // Limpa formatação excessiva
  cleanResponse = cleanResponse
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Se muito curta, tenta extrair informação útil
  if (cleanResponse.length < 20) {
    return 'Com base na sua pergunta sobre SST, recomendo consultar as normas regulamentadoras específicas ou detalhar mais sua dúvida para uma resposta mais precisa.';
  }
  
  // Melhora a resposta se ela for muito técnica ou confusa
  if (cleanResponse.length > 800) {
    cleanResponse = cleanResponse.substring(0, 800).trim();
    const lastSentence = cleanResponse.lastIndexOf('.');
    if (lastSentence > 600) {
      cleanResponse = cleanResponse.substring(0, lastSentence + 1);
    } else {
      cleanResponse += '...';
    }
  }
  
  // Adiciona estrutura se a resposta for muito simples
  if (cleanResponse.length < 100 && !cleanResponse.includes('NR-') && !cleanResponse.includes('norma')) {
    cleanResponse = `${cleanResponse}\n\nPara informações mais detalhadas, consulte as Normas Regulamentadoras aplicáveis ao seu caso específico.`;
  }
  
  return cleanResponse;
}

/**
 * Função principal aprimorada para gerar resposta usando Hugging Face
 * @param {string} userMessage - Mensagem do usuário
 * @param {string[]} conversationHistory - Histórico da conversa
 * @returns {Promise<string>} - Resposta inteligente gerada
 */
export async function generateHuggingFaceResponse(userMessage, conversationHistory = []) {
  if (!userMessage || userMessage.trim().length === 0) {
    throw new Error('Mensagem do usuário não pode estar vazia');
  }

  // Contextualiza com histórico para respostas mais inteligentes
  const contextualizedMessage = contextualizeForSST(userMessage.trim(), conversationHistory);
  
  // Tenta modelos avançados em ordem de qualidade
  for (let i = 0; i < ADVANCED_MODELS.length; i++) {
    const model = ADVANCED_MODELS[i];
    
    try {
      console.log(`Tentando modelo avançado: ${model}`);
      
      // Usa configurações otimizadas baseadas no modelo
      const config = i === 0 ? ADVANCED_CONFIG : FALLBACK_CONFIG;
      
      const response = await queryHuggingFace(model, contextualizedMessage, config);
      const processedResponse = processResponse(response, userMessage);
      
      // Valida qualidade da resposta
      if (processedResponse.length > 30 && !processedResponse.includes('Desculpe, não consegui')) {
        console.log(`Sucesso com modelo: ${model}`);
        return processedResponse;
      }
      
      throw new Error('Resposta de baixa qualidade');
      
    } catch (error) {
      console.warn(`Erro com modelo ${model}:`, error.message);
      
      // Se é o último modelo, tenta uma abordagem diferente
      if (i === ADVANCED_MODELS.length - 1) {
        try {
          // Tentativa final com prompt simplificado
          const simplePrompt = `Como especialista em SST, responda: ${userMessage}`;
          const response = await queryHuggingFace(model, simplePrompt, FALLBACK_CONFIG);
          return processResponse(response, userMessage);
        } catch (finalError) {
          console.error('Todos os modelos falharam:', finalError);
        }
      }
      
      continue;
    }
  }
  
  // Se todos falharam, lança erro informativo
  throw new Error('Todos os modelos de IA estão temporariamente indisponíveis. Tente novamente em alguns minutos.');
}

/**
 * Verifica se a API da Hugging Face está disponível
 * @returns {Promise<boolean>} - True se a API estiver disponível
 */
export async function checkHuggingFaceStatus() {
  try {
    const response = await fetch(`${HF_API_BASE}/${DEFAULT_MODEL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
      }
    });
    
    return response.status === 200 || response.status === 403; // 403 é normal para modelos que precisam de POST
  } catch (error) {
    console.error('Erro ao verificar status da Hugging Face:', error);
    return false;
  }
}

/**
 * Simula um delay para melhorar a experiência do usuário
 * @param {number} min - Tempo mínimo em ms
 * @param {number} max - Tempo máximo em ms
 * @returns {Promise} - Promise que resolve após o delay
 */
export function simulateDelay(min = 1000, max = 3000) {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}
