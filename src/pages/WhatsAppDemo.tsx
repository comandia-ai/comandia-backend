import { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageCircle,
  Phone,
  MoreVertical,
  Search,
  CheckCheck,
  Bot,
  Loader2,
  Inbox,
  User,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useConversationsStore } from '@/hooks/useStore';
import { cn, getInitials } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/i18n';
import { Conversation } from '@/types';

export function WhatsAppDemo() {
  const { t, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const {
    conversations,
    messages: allMessages,
    loading,
    loadConversations,
    getConversationsByTenant,
    getMessagesByConversation,
  } = useConversationsStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations from Supabase
  useEffect(() => {
    if (currentTenant) loadConversations(currentTenant.id);
  }, [currentTenant, loadConversations]);

  // Auto-select first conversation when loaded
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Get filtered conversations
  const filteredConversations = useMemo(() => {
    if (!currentTenant) return [];
    let convs = getConversationsByTenant(currentTenant.id);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      convs = convs.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.customerPhone.toLowerCase().includes(q)
      );
    }
    return convs.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  }, [currentTenant, getConversationsByTenant, searchQuery, conversations]);

  // Get messages for selected conversation
  const currentMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return getMessagesByConversation(selectedConversation.id).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [selectedConversation, getMessagesByConversation, allMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Get last message preview for conversation list
  const getLastMessage = (conv: Conversation): string => {
    const msgs = getMessagesByConversation(conv.id);
    if (msgs.length === 0) return language === 'es' ? 'Sin mensajes' : 'No messages';
    const last = msgs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return last.content.slice(0, 50) + (last.content.length > 50 ? '...' : '');
  };

  const getStatusBadge = (conv: Conversation) => {
    if (conv.status === 'closed') {
      return <Badge variant="neutral">{language === 'es' ? 'Cerrado' : 'Closed'}</Badge>;
    }
    return <Badge variant="success">{language === 'es' ? 'Activo' : 'Active'}</Badge>;
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(language === 'es' ? 'es-CO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-whatsapp animate-spin mx-auto mb-3" />
          <p className="text-slate-500">
            {language === 'es' ? 'Cargando conversaciones...' : 'Loading conversations...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4 animate-fade-in">
      {/* Conversations List */}
      <div className="w-80 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-whatsapp-dark">
          <div className="flex items-center justify-between text-white mb-3">
            <h2 className="font-semibold">{t('whatsapp.activeChats')}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {filteredConversations.length}
              </span>
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <Input
            placeholder={t('common.search')}
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                {language === 'es' ? 'No hay conversaciones' : 'No conversations'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  'w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100',
                  selectedConversation?.id === conv.id && 'bg-whatsapp/5'
                )}
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-whatsapp/10 text-whatsapp font-medium">
                    {getInitials(conv.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800 truncate">{conv.customerName}</p>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {formatRelativeTime(conv.lastMessageAt, language)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {getLastMessage(conv)}
                  </p>
                  <div className="mt-1.5">{getStatusBadge(conv)}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-whatsapp-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-white/20 text-white font-medium">
                    {getInitials(selectedConversation.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="font-medium">{selectedConversation.customerName}</p>
                  <p className="text-sm text-white/70">{selectedConversation.customerPhone}</p>
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
                {currentMessages.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <span className="px-4 py-2 bg-white/80 rounded-lg text-sm text-slate-500 shadow-sm">
                      {language === 'es' ? 'No hay mensajes en esta conversacion' : 'No messages in this conversation'}
                    </span>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
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
                          <span className="text-[10px] text-slate-400">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                          {msg.sender === 'customer' && (
                            <CheckCheck className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Info Bar */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-400 text-center">
                {language === 'es'
                  ? 'Las respuestas se envian automaticamente por la IA via WhatsApp'
                  : 'Responses are sent automatically by AI via WhatsApp'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-400">
                {t('whatsapp.selectConversation')}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="w-72 bg-white rounded-xl border border-slate-200 p-4 hidden xl:block">
        {selectedConversation ? (
          <>
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarFallback className="bg-whatsapp/10 text-whatsapp text-2xl font-medium">
                  {getInitials(selectedConversation.customerName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-slate-800">{selectedConversation.customerName}</h3>
              <p className="text-sm text-slate-500">{selectedConversation.customerPhone}</p>
              <div className="mt-2">{getStatusBadge(selectedConversation)}</div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {language === 'es' ? 'Informacion' : 'Information'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{selectedConversation.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    <span>
                      {currentMessages.length} {language === 'es' ? 'mensajes' : 'messages'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{formatRelativeTime(selectedConversation.lastMessageAt, language)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {language === 'es' ? 'Resumen' : 'Summary'}
                </h4>
                <div className="space-y-1.5 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>{language === 'es' ? 'Del cliente' : 'From customer'}</span>
                    <span className="font-medium">
                      {currentMessages.filter((m) => m.sender === 'customer').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'es' ? 'Del bot' : 'From bot'}</span>
                    <span className="font-medium">
                      {currentMessages.filter((m) => m.sender === 'bot').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-whatsapp/5 rounded-lg border border-whatsapp/20">
                <p className="text-xs text-slate-600 text-center">
                  {language === 'es'
                    ? 'Conversaciones reales de WhatsApp procesadas por la IA de Comandia.'
                    : 'Real WhatsApp conversations processed by Comandia AI.'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-400 text-center">
              {language === 'es'
                ? 'Selecciona una conversacion para ver los detalles'
                : 'Select a conversation to view details'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
