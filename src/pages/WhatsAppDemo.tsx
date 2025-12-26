import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Phone,
  MoreVertical,
  Search,
  Check,
  CheckCheck,
  ShoppingCart,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore } from '@/hooks/useStore';
import { cn, getInitials, sleep } from '@/lib/utils';

// Demo conversation scenarios
const demoScenarios = [
  {
    id: 'scenario-1',
    customerName: 'Jose Hernandez',
    customerPhone: '+57 310 555 1234',
    status: 'order_confirmed' as const,
    messages: [
      { sender: 'customer' as const, content: 'Buenos dias, necesito hacer un pedido', time: '9:15 AM' },
      { sender: 'bot' as const, content: 'Buenos dias Don Jose! Con gusto le ayudo con su pedido. Que productos necesita hoy?', time: '9:15 AM' },
      { sender: 'customer' as const, content: 'Mandame lo de siempre, las cocas y las cervezas', time: '9:16 AM' },
      { sender: 'bot' as const, content: 'Perfecto! Basado en su pedido habitual, le confirmo:\n\n- 24x Coca-Cola 2.5L ($8,500 c/u) = $204,000\n- 10x Cerveza Aguila x6 ($18,000 c/u) = $180,000\n\nSubtotal: $384,000\n\nDesea agregar algo mas? Tenemos promocion en Agua Cristal 5L hoy.', time: '9:16 AM' },
      { sender: 'customer' as const, content: 'Si, agregale 12 aguas de esas', time: '9:18 AM' },
      { sender: 'bot' as const, content: 'Excelente! He agregado:\n\n- 12x Agua Cristal 5L ($6,500 c/u) = $78,000\n\nResumen de su pedido:\n- 24x Coca-Cola 2.5L = $204,000\n- 10x Cerveza Aguila x6 = $180,000\n- 12x Agua Cristal 5L = $78,000\n\nSubtotal: $462,000\nDescuento (5%): -$23,100\nTotal: $438,900\n\nDireccion de entrega: Calle 72 #15-32\nHorario: 8:00 AM - 10:00 AM\n\nConfirma este pedido?', time: '9:18 AM' },
      { sender: 'customer' as const, content: 'Si, confirmado. Que llegue temprano por favor', time: '9:20 AM' },
      { sender: 'bot' as const, content: 'Pedido confirmado! Numero de pedido: PED-2024-001\n\nTotal: $438,900\nEntrega: Hoy entre 8:00 AM - 10:00 AM\nNota: Entrega temprana solicitada\n\nGracias por su preferencia Don Jose! Le notificaremos cuando el pedido este en camino.', time: '9:20 AM' },
    ],
  },
  {
    id: 'scenario-2',
    customerName: 'Luis Perez',
    customerPhone: '+57 312 111 7890',
    status: 'pending_order' as const,
    messages: [
      { sender: 'customer' as const, content: 'Hola buenas', time: '10:30 AM' },
      { sender: 'bot' as const, content: 'Hola! Bienvenido a Distribuidora El Progreso. Soy su asistente virtual. Como puedo ayudarle hoy?', time: '10:30 AM' },
      { sender: 'customer' as const, content: 'necesito 5 sixpack de aguila y unas gaseosas sprite', time: '10:32 AM' },
      { sender: 'bot' as const, content: 'Entendido! Le confirmo los productos:\n\n- 5x Cerveza Aguila x6 ($18,000 c/u) = $90,000\n- Sprite 1.5L - Cuantas unidades necesita?\n\nTambien tenemos Sprite en presentacion de 2L si le interesa.', time: '10:32 AM' },
      { sender: 'customer' as const, content: 'ponle 10 de las de litro y medio', time: '10:35 AM' },
      { sender: 'bot' as const, content: 'Perfecto! Su pedido actualizado:\n\n- 5x Cerveza Aguila x6 = $90,000\n- 10x Sprite 1.5L ($5,500 c/u) = $55,000\n\nTotal: $145,000\n\nPor favor confirme su direccion de entrega y horario preferido para completar el pedido.', time: '10:35 AM' },
    ],
  },
  {
    id: 'scenario-3',
    customerName: 'Ana Martinez',
    customerPhone: '+57 315 444 5678',
    status: 'active' as const,
    messages: [
      { sender: 'customer' as const, content: 'Buenas tardes', time: '2:00 PM' },
      { sender: 'bot' as const, content: 'Buenas tardes Ana! Es un gusto saludarla. En que puedo ayudarle hoy?', time: '2:00 PM' },
      { sender: 'customer' as const, content: 'Quiero saber que promociones tienen esta semana', time: '2:02 PM' },
      { sender: 'bot' as const, content: 'Estas son nuestras promociones activas:\n\n1. Agua Cristal 5L: 15% descuento en compras de 10+ unidades\n2. Coca-Cola 2.5L: Lleve 24, pague 22\n3. Cerveza Aguila x6: 5% descuento en compras mayores a $150,000\n\nAdicionalamente, todos los pedidos mayores a $400,000 tienen envio gratis.\n\nLe interesa alguna promocion en especial?', time: '2:02 PM' },
    ],
  },
];

export function WhatsAppDemo() {
  const { t, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedScenario, setSelectedScenario] = useState(demoScenarios[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(selectedScenario.messages);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(selectedScenario.messages);
  }, [selectedScenario]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      sender: 'customer' as const,
      content: inputMessage,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot typing
    setIsTyping(true);
    await sleep(1500 + Math.random() * 1000);
    setIsTyping(false);

    // Generate bot response based on input
    let botResponse = '';
    const lowerInput = inputMessage.toLowerCase();

    if (lowerInput.includes('precio') || lowerInput.includes('cuanto')) {
      botResponse = 'Claro! Estos son algunos de nuestros precios:\n\n- Coca-Cola 2.5L: $8,500\n- Pepsi 2L: $7,200\n- Cerveza Aguila x6: $18,000\n- Agua Cristal 5L: $6,500\n\nDesea hacer un pedido?';
    } else if (lowerInput.includes('pedido') || lowerInput.includes('ordenar') || lowerInput.includes('quiero')) {
      botResponse = 'Perfecto! Con gusto le ayudo con su pedido. Que productos necesita?';
    } else if (lowerInput.includes('gracias') || lowerInput.includes('thank')) {
      botResponse = 'De nada! Fue un placer atenderle. Que tenga un excelente dia!';
    } else if (lowerInput.includes('hola') || lowerInput.includes('buenos') || lowerInput.includes('buenas')) {
      botResponse = `Hola! Bienvenido a ${currentTenant?.name || 'nuestra tienda'}. Como puedo ayudarle hoy?`;
    } else if (lowerInput.includes('promo') || lowerInput.includes('descuento') || lowerInput.includes('oferta')) {
      botResponse = 'Tenemos estas promociones activas:\n\n1. 15% en compras mayores a $300,000\n2. Envio gratis en pedidos +$400,000\n3. 2x1 en productos seleccionados\n\nLe interesa alguna?';
    } else {
      botResponse = 'Entendido. Para confirmar su solicitud, podria darme mas detalles sobre los productos que necesita?';
    }

    const botMessage = {
      sender: 'bot' as const,
      content: botResponse,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'order_confirmed':
        return <Badge variant="success">{t('whatsapp.orderConfirmed')}</Badge>;
      case 'pending_order':
        return <Badge variant="warning">{t('whatsapp.orderPending')}</Badge>;
      default:
        return <Badge variant="info">Activo</Badge>;
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4 animate-fade-in">
      {/* Conversations List */}
      <div className="w-80 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-whatsapp-dark">
          <div className="flex items-center justify-between text-white mb-3">
            <h2 className="font-semibold">{t('whatsapp.activeChats')}</h2>
            <MessageCircle className="w-5 h-5" />
          </div>
          <Input
            placeholder={t('common.search')}
            icon={<Search className="w-4 h-4" />}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={cn(
                'w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100',
                selectedScenario.id === scenario.id && 'bg-whatsapp/5'
              )}
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarFallback className="bg-whatsapp/10 text-whatsapp font-medium">
                  {getInitials(scenario.customerName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800 truncate">{scenario.customerName}</p>
                  <span className="text-xs text-slate-400">
                    {scenario.messages[scenario.messages.length - 1]?.time}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  {scenario.messages[scenario.messages.length - 1]?.content.slice(0, 40)}...
                </p>
                <div className="mt-1.5">{getStatusBadge(scenario.status)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-whatsapp-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-white/20 text-white font-medium">
                {getInitials(selectedScenario.customerName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="font-medium">{selectedScenario.customerName}</p>
              <p className="text-sm text-white/70">{selectedScenario.customerPhone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 whatsapp-bg custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Date separator */}
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white/80 rounded-lg text-xs text-slate-500 shadow-sm">
                Hoy
              </span>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] px-3 py-2 shadow-sm',
                    msg.sender === 'customer'
                      ? 'chat-bubble-outgoing'
                      : 'chat-bubble-incoming'
                  )}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Bot className="w-3.5 h-3.5 text-whatsapp" />
                      <span className="text-xs font-medium text-whatsapp">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                    {msg.sender === 'customer' && (
                      <CheckCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="chat-bubble-incoming px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('whatsapp.typeMessage')}
              className="flex-1 bg-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              variant="whatsapp"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {language === 'es'
              ? 'Simulacion de conversacion con IA - Escribe un mensaje para probar'
              : 'AI Conversation Simulation - Type a message to test'}
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-72 bg-white rounded-xl border border-slate-200 p-4 hidden xl:block">
        <div className="text-center mb-6">
          <Avatar className="w-20 h-20 mx-auto mb-3">
            <AvatarFallback className="bg-whatsapp/10 text-whatsapp text-2xl font-medium">
              {getInitials(selectedScenario.customerName)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-slate-800">{selectedScenario.customerName}</h3>
          <p className="text-sm text-slate-500">{selectedScenario.customerPhone}</p>
          <div className="mt-2">{getStatusBadge(selectedScenario.status)}</div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {language === 'es' ? 'Estado del Pedido' : 'Order Status'}
            </h4>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-whatsapp" />
              <span className="text-sm font-medium text-slate-800">
                {selectedScenario.status === 'order_confirmed'
                  ? 'PED-2024-001'
                  : selectedScenario.status === 'pending_order'
                  ? language === 'es' ? 'Pendiente de confirmacion' : 'Pending confirmation'
                  : language === 'es' ? 'Sin pedido activo' : 'No active order'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {language === 'es' ? 'Capacidades IA' : 'AI Capabilities'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-whatsapp" />
                {language === 'es' ? 'Lenguaje natural' : 'Natural language'}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-whatsapp" />
                {language === 'es' ? 'Pedidos habituales' : 'Regular orders'}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-whatsapp" />
                {language === 'es' ? 'Sugerencias upsell' : 'Upsell suggestions'}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-whatsapp" />
                {language === 'es' ? 'Confirmacion automatica' : 'Auto confirmation'}
              </li>
            </ul>
          </div>

          <div className="p-3 bg-whatsapp/5 rounded-lg border border-whatsapp/20">
            <p className="text-xs text-slate-600 text-center">
              {language === 'es'
                ? 'Esta es una demostracion del flujo conversacional con IA para pedidos via WhatsApp.'
                : 'This is a demo of the AI conversational flow for WhatsApp orders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
