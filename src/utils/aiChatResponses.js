/**
 * Utilitário para gerar respostas simuladas do Chat IA
 * Baseado em palavras-chave e contexto de SST (Segurança e Saúde no Trabalho)
 */

export const aiChatResponses = {
  // Respostas para saudações
  greetings: [
    "Olá! Estou aqui para ajudar com questões de Segurança e Saúde no Trabalho. Como posso auxiliá-lo?",
    "Oi! Sou especialista em SST, agora com IA avançada da Hugging Face. Em que posso ajudar hoje?",
    "Olá! Pronto para esclarecer suas dúvidas sobre segurança no trabalho!"
  ],

  // Respostas sobre funcionalidades do sistema
  system: [
    "Este sistema permite gerenciar empresas, funcionários, inventários de perigo e análises de conformidade com as NRs. Você pode navegar pelas diferentes seções usando o menu lateral.",
    "O sistema SST em Destaque oferece: cadastro de empresas e funcionários, inventário de perigos, gestão de NRs, relatórios PGR e muito mais. Que funcionalidade gostaria de conhecer melhor?",
    "Posso ajudar você a entender qualquer funcionalidade do sistema. Temos módulos para empresas, funcionários, perigos, NRs e relatórios."
  ],

  // Respostas sobre perigos ocupacionais
  risks: [
    "Os perigos ocupacionais são classificados em físicos, químicos, biológicos, ergonômicos e de acidentes. No inventário, você pode cadastrar e avaliar cada tipo de perigo identificado no ambiente de trabalho.",
    "Para avaliar perigos, consideramos a probabilidade de ocorrência e a severidade das consequências. O sistema calcula automaticamente o nível de risco baseado nesses parâmetros.",
    "É importante identificar todas as fontes geradoras de perigo em cada setor da empresa. Cada fonte pode gerar diferentes tipos de perigos que devem ser avaliados."
  ],

  // Respostas sobre NRs (Normas Regulamentadoras)
  nrs: [
    "As Normas Regulamentadoras (NRs) são obrigatórias para empresas que possuem funcionários CLT. Cada NR aborda aspectos específicos de segurança e saúde no trabalho.",
    "Principais NRs incluem: NR-01 (Disposições Gerais), NR-06 (EPI), NR-07 (PCMSO), NR-09 (PPRA), NR-17 (Ergonomia), entre outras. Qual NR específica você gostaria de saber mais?",
    "O cumprimento das NRs é fundamental para garantir a segurança dos trabalhadores e evitar multas e interdições. Posso ajudar a entender os requisitos de cada norma."
  ],

  // Respostas sobre EPI
  epi: [
    "Os Equipamentos de Proteção Individual (EPIs) devem ser fornecidos gratuitamente pelo empregador quando as medidas de proteção coletiva não forem suficientes. Exemplos: capacete, luvas, óculos de proteção.",
    "A NR-06 regulamenta o uso de EPIs. É obrigatório fornecer, treinar sobre o uso correto e substituir quando danificado. O funcionário deve usar e conservar adequadamente.",
    "EPIs são a última linha de defesa. Sempre priorize medidas de eliminação, substituição e controles coletivos antes de recorrer aos equipamentos individuais."
  ],

  // Respostas sobre ergonomia
  ergonomia: [
    "A NR-17 trata da ergonomia, visando adaptar as condições de trabalho às características dos trabalhadores. Aborda postura, levantamento de cargas, mobiliário e organização do trabalho.",
    "Problemas ergonômicos podem causar LER/DORT. É importante avaliar posturas, movimentos repetitivos, força excessiva e condições ambientais como iluminação e ruído.",
    "Para melhorar a ergonomia: ajuste altura de mesas e cadeiras, faça pausas regulares, varie posturas, use apoios adequados e mantenha objetos dentro do alcance fácil."
  ],

  // Respostas padrão
  default: [
    "Desculpe, não entendi completamente sua pergunta. Pode reformular? Estou aqui para ajudar com questões de SST, NRs, perigos ocupacionais e uso do sistema.",
    "Não tenho certeza sobre isso. Posso ajudar com informações sobre segurança do trabalho, normas regulamentadoras, perigos ocupacionais ou funcionalidades do sistema. O que você gostaria de saber?",
    "Hmm, não consegui identificar o tema da sua pergunta. Posso esclarecer dúvidas sobre SST, perigos, NRs, EPIs, ergonomia ou como usar o sistema. Como posso ajudar?"
  ]
};

/**
 * Analisa a mensagem do usuário e retorna uma resposta apropriada
 * @param {string} userMessage - Mensagem do usuário
 * @returns {string} - Resposta da IA
 */
export function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Saudações
  if (message.includes('olá') || message.includes('oi') || message.includes('ola') || 
      message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
    return getRandomResponse(aiChatResponses.greetings);
  }
  
  // Sistema/Funcionalidades
  if (message.includes('sistema') || message.includes('funcionalidade') || 
      message.includes('como usar') || message.includes('navegar')) {
    return getRandomResponse(aiChatResponses.system);
  }
  
  // Perigos
  if (message.includes('risco') || message.includes('perigo') || 
      message.includes('inventário') || message.includes('avaliação')) {
    return getRandomResponse(aiChatResponses.risks);
  }
  
  // NRs
  if (message.includes('nr') || message.includes('norma') || 
      message.includes('regulamentadora') || message.includes('conformidade')) {
    return getRandomResponse(aiChatResponses.nrs);
  }
  
  // EPI
  if (message.includes('epi') || message.includes('equipamento') || 
      message.includes('proteção individual') || message.includes('capacete') ||
      message.includes('luva') || message.includes('óculos')) {
    return getRandomResponse(aiChatResponses.epi);
  }
  
  // Ergonomia
  if (message.includes('ergonomia') || message.includes('postura') || 
      message.includes('ler') || message.includes('dort') || 
      message.includes('repetitivo') || message.includes('cadeira')) {
    return getRandomResponse(aiChatResponses.ergonomia);
  }
  
  // Resposta padrão
  return getRandomResponse(aiChatResponses.default);
}

/**
 * Retorna uma resposta aleatória de um array de respostas
 * @param {string[]} responses - Array de possíveis respostas
 * @returns {string} - Resposta selecionada aleatoriamente
 */
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Simula um delay de resposta para tornar a experiência mais realista
 * @param {number} min - Tempo mínimo em ms
 * @param {number} max - Tempo máximo em ms
 * @returns {Promise} - Promise que resolve após o delay
 */
export function simulateTypingDelay(min = 1000, max = 3000) {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}
