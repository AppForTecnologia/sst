import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { generateHuggingFaceResponse, simulateDelay, checkHuggingFaceStatus } from '@/utils/huggingFaceClient';
import { generateAIResponse } from '@/utils/aiChatResponses';

export function AIChat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '👋 Olá! Sou Dr. SST, seu especialista em Segurança e Saúde no Trabalho com IA avançada. Posso ajudar com:\n\n🔹 Normas Regulamentadoras (NRs)\n🔹 Análise de riscos ocupacionais\n🔹 Ergonomia e prevenção\n🔹 Legislação trabalhista\n🔹 Gestão de SST\n\nQual sua dúvida técnica sobre segurança do trabalho?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHuggingFaceAvailable, setIsHuggingFaceAvailable] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Verifica o status da API Hugging Face na inicialização
  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const isAvailable = await checkHuggingFaceStatus();
        setIsHuggingFaceAvailable(isAvailable);
        
        if (!isAvailable) {
          console.warn('API Hugging Face não disponível, usando respostas locais como fallback');
        }
      } catch (error) {
        console.error('Erro ao verificar status da API:', error);
        setIsHuggingFaceAvailable(false);
      }
    };

    checkAPIStatus();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const userInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse;
      
      // Tenta usar a API da Hugging Face primeiro
      if (isHuggingFaceAvailable) {
        try {
          // Adiciona um pequeno delay para melhorar a experiência
          await simulateDelay(500, 1500);
          
          // Usa histórico para respostas mais inteligentes e contextuais
          aiResponse = await generateHuggingFaceResponse(userInput, conversationHistory);
          
          // Verifica se a resposta é válida
          if (!aiResponse || aiResponse.trim().length < 5) {
            throw new Error('Resposta inválida da API');
          }
          
        } catch (apiError) {
          console.warn('Falha na API Hugging Face, usando fallback local:', apiError.message);
          
          // Se falhou, marca como indisponível e usa fallback
          setIsHuggingFaceAvailable(false);
          aiResponse = generateAIResponse(userInput);
          
          // Informa o usuário sobre o modo offline
          toast({
            title: "Modo Offline",
            description: "Usando respostas locais devido a problemas de conectividade com a IA.",
            variant: "default",
          });
        }
      } else {
        // Usa respostas locais diretamente
        await simulateDelay(800, 2000);
        aiResponse = generateAIResponse(userInput);
      }
      
      const aiMessage = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
      
      // Atualiza histórico para próximas respostas mais inteligentes
      setConversationHistory(prev => {
        const newHistory = [
          ...prev,
          `Usuário: ${userInput}`,
          `Assistente: ${aiResponse}`
        ].slice(-10); // Mantém apenas as 5 interações mais recentes
        return newHistory;
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = { 
        sender: 'ai', 
        text: 'Desculpe, ocorreu um erro interno. Tente novamente, por favor.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro interno",
        description: "Houve um problema ao processar sua mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-title-foreground">Assistente IA</h1>
            <p className="text-subtitle-foreground mt-1">Tire suas dúvidas sobre o sistema e funcionalidades de SST.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isHuggingFaceAvailable ? "bg-green-500" : "bg-yellow-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {isHuggingFaceAvailable ? "IA Avançada" : "Modo Local"}
            </span>
          </div>
        </div>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-3 max-w-xl",
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                    msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'
                  )}>
                    {msg.sender === 'user' ? <User className="h-5 w-5 text-primary-foreground" /> : <Bot className="h-5 w-5 text-secondary-foreground" />}
                  </div>
                  <div className={cn(
                    "rounded-lg px-4 py-3 text-sm",
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card-foreground/10 text-foreground'
                  )}>
                    <p>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 max-w-xl mr-auto"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-secondary">
                  <Bot className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="rounded-lg px-4 py-3 bg-card-foreground/10 text-foreground flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Digitando...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Digite sua pergunta aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Enviar</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}