'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Comment {
  _id: string;
  name: string;
  text: string;
  createdAt: string;
  userImage?: string;
  isAnonymous: boolean;
}

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [anonName, setAnonName] = useState('');
  const [anonEmail, setAnonEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAnonForm, setShowAnonForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!session && !anonName.trim()) {
      setMessage({ type: 'error', text: 'Por favor, informe seu nome.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          text,
          name: anonName,
          email: anonEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setText('');
        setAnonName('');
        setAnonEmail('');
        
        // Se estiver logado, o comentário é auto-aprovado e podemos adicionar na lista local
        if (session?.user) {
          const newComment: Comment = {
            _id: Math.random().toString(), // Temporário
            name: session.user.name || 'Usuário',
            text: text,
            createdAt: new Date().toISOString(),
            userImage: session.user.image || undefined,
            isAnonymous: false,
          };
          setComments([newComment, ...comments]);
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar seu comentário.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-gold/10">
      <h2 className="font-heading text-2xl font-bold text-primary mb-8 flex items-center gap-2">
        Comentários <span className="text-sm font-normal text-muted bg-gold/5 px-2 py-0.5 rounded-full">{comments.length}</span>
      </h2>

      {/* Caixa de Comentário */}
      <div className="bg-card/50 border border-gold/10 rounded-xl p-6 mb-12">
        {session ? (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-gold/20" />
              )}
              <span className="text-sm font-medium">Olá, {session.user?.name}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="text-xs text-muted hover:text-accent-gold underline underline-offset-4"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-sm text-muted mb-4">Para comentar, entre com sua rede social ou preencha os dados abaixo.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <button 
                onClick={() => signIn('google')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                Entrar com Google
              </button>
              <button 
                onClick={() => signIn('facebook')}
                className="flex items-center gap-2 px-4 py-2 bg-[#105BCC] text-white rounded-lg text-sm font-medium hover:bg-[#0E4BA8] transition-colors"
              >
                <span className="w-4 h-4 flex items-center justify-center font-bold">f</span>
                Entrar com Facebook
              </button>
            </div>
            
            <button 
              onClick={() => setShowAnonForm(!showAnonForm)}
              className="text-sm text-accent-gold hover:underline font-medium"
            >
              {showAnonForm ? '← Usar Redes Sociais' : 'Ou comentar de forma anônima'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {showAnonForm && !session && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
              >
                <div className="space-y-1">
                  <label htmlFor="anonName" className="text-xs font-bold text-muted uppercase tracking-wider">Seu Nome *</label>
                  <input
                    id="anonName"
                    type="text"
                    value={anonName}
                    onChange={(e) => setAnonName(e.target.value)}
                    className="w-full bg-white border border-gold/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold"
                    placeholder="Como deseja ser chamado?"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="anonEmail" className="text-xs font-bold text-muted uppercase tracking-wider">Seu E-mail (Opcional)</label>
                  <input
                    id="anonEmail"
                    type="email"
                    value={anonEmail}
                    onChange={(e) => setAnonEmail(e.target.value)}
                    className="w-full bg-white border border-gold/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label htmlFor="commentText" className="text-xs font-bold text-muted uppercase tracking-wider">Sua Mensagem</label>
            <textarea
              id="commentText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-white border border-gold/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold resize-none"
              placeholder="Escreva seu comentário aqui..."
            />
          </div>

          <div className="flex items-center justify-between">
            {message && (
              <p className={cn(
                "text-sm font-medium",
                message.type === 'success' ? "text-accent-green" : "text-red-500"
              )}>
                {message.text}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "ml-auto px-6 py-2 rounded-lg text-sm font-bold transition-all",
                isSubmitting 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-accent-gold text-white hover:bg-opacity-90 active:scale-95 shadow-lg shadow-gold/10"
              )}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Comentário'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div 
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                {comment.userImage ? (
                  <img src={comment.userImage} alt="" className="w-10 h-10 rounded-full border border-gold/10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10">
                    <span className="text-accent-gold font-bold text-sm">
                      {comment.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-primary">{comment.name}</h4>
                  {comment.isAnonymous && (
                    <span className="text-[10px] font-bold uppercase tracking-tight text-muted bg-gray-100 px-1.5 py-0.5 rounded">Visitante</span>
                  )}
                  <span className="text-xs text-muted">
                    · {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-muted italic py-8 border-2 border-dashed border-gold/5 rounded-xl">
            Ainda não há comentários por aqui. Seja a primeira a deixar uma palavra! 💛
          </p>
        )}
      </div>
    </section>
  );
}
