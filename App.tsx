
import React, { useState } from 'react';
import { QUESTIONS } from './constants';
import { QuizStatus, UserAnswer, CorrectionMode, Question } from './types';
import { getPhilosophicalFeedback, reformulateQuiz, professorPedroChat, getQuickExplanation, generateNewQuestionsFromNotes } from './geminiService';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const App: React.FC = () => {
  const [status, setStatus] = useState<QuizStatus>(QuizStatus.START);
  const [correctionMode, setCorrectionMode] = useState<CorrectionMode>(CorrectionMode.FINAL);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [selectedInCurrent, setSelectedInCurrent] = useState<string | null>(null);

  // Quick Explanation States
  const [quickExp, setQuickExp] = useState<string | null>(null);
  const [isLoadingExp, setIsLoadingExp] = useState(false);

  // Professor Chat States
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sub-menu for IA mode
  const [showIAMenu, setShowIAMenu] = useState(false);

  const startQuiz = async (mode: CorrectionMode, generative: boolean = false) => {
    setIsLoadingQuiz(true);
    setShowIAMenu(false);
    let quizData: Question[];
    
    try {
      if (generative) {
        // Third mode: Entirely new questions from notes
        quizData = await generateNewQuestionsFromNotes(15);
      } else {
        // Modes 1 & 2: Reformulate existing 30 questions
        quizData = await reformulateQuiz(QUESTIONS);
      }
    } catch (e) {
      quizData = QUESTIONS;
    }

    if (!quizData || quizData.length === 0) {
      quizData = QUESTIONS;
    }
    
    const randomized = shuffleArray(quizData).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    
    setShuffledQuestions(randomized);
    setCorrectionMode(mode);
    setCurrentIdx(0);
    setAnswers([]);
    setFeedback('');
    setSelectedInCurrent(null);
    setQuickExp(null);
    setIsLoadingQuiz(false);
    setStatus(QuizStatus.QUIZ);
    setChatMessages([]);
  };

  const handleAnswer = async (optionId: string) => {
    if (selectedInCurrent || isLoadingQuiz) return;

    const question = shuffledQuestions[currentIdx];
    const isCorrect = optionId === question.correctAnswer;
    
    setSelectedInCurrent(optionId);

    const newAnswer: UserAnswer = {
      questionId: question.id,
      selectedOption: optionId,
      isCorrect,
    };

    if (correctionMode === CorrectionMode.FINAL) {
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      if (currentIdx < shuffledQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIdx(currentIdx + 1);
          setSelectedInCurrent(null);
          setQuickExp(null);
          setChatMessages([]);
          setShowChat(false);
        }, 800);
      } else {
        finishQuiz(updatedAnswers);
      }
    } else {
      setAnswers(prev => [...prev, newAnswer]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedInCurrent(null);
      setQuickExp(null);
      setChatMessages([]);
      setShowChat(false);
    } else {
      finishQuiz(answers);
    }
  };

  const handleQuickExplanation = async () => {
    if (isLoadingExp) return;
    const q = shuffledQuestions[currentIdx];
    const correctText = q.options.find(o => o.id === q.correctAnswer)?.text || "";
    setIsLoadingExp(true);
    const text = await getQuickExplanation(q.text, correctText);
    setQuickExp(text || "No se pudo obtener la explicación.");
    setIsLoadingExp(false);
  };

  const handleQuickExplanationFromResult = async (qId: number) => {
    if (isLoadingExp) return;
    const q = shuffledQuestions.find(q => q.id === qId)!;
    const correctText = q.options.find(o => o.id === q.correctAnswer)?.text || "";
    setIsLoadingExp(true);
    const text = await getQuickExplanation(q.text, correctText);
    setQuickExp(text || "No se pudo obtener la explicación.");
    setIsLoadingExp(false);
  };

  const openChatWithQuestion = (qText: string) => {
    setChatMessages([{ role: 'assistant', text: `Dime, ¿qué duda tienes sobre: "${qText}"?` }]);
    setShowChat(true);
  };

  const sendMessageToPedro = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    const pedroReply = await professorPedroChat(
      newHistory.map(m => ({ role: m.role, text: m.text })),
      shuffledQuestions[currentIdx]?.text || "un tema general"
    );

    setChatMessages(prev => [...prev, { role: 'assistant', text: pedroReply || 'No tengo respuesta para eso ahora mismo.' }]);
    setIsChatLoading(false);
  };

  const finishQuiz = async (finalAnswers: UserAnswer[]) => {
    setStatus(QuizStatus.RESULTS);
    setIsLoadingFeedback(true);
    const score = finalAnswers.filter(a => a.isCorrect).length;
    const missed = finalAnswers
      .filter(a => !a.isCorrect)
      .map(a => shuffledQuestions.find(q => q.id === a.questionId)?.text || '');
    
    const aiFeedback = await getPhilosophicalFeedback(score, shuffledQuestions.length, missed.slice(0, 3));
    setFeedback(aiFeedback || '');
    setIsLoadingFeedback(false);
  };

  if (isLoadingQuiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fcfaf2]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold serif text-slate-800">Generando desafíos...</h2>
          <p className="text-slate-500 italic serif">Aplicando la razón a tus apuntes de Bachillerato.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 bg-[#fcfaf2]">
      <div className="w-full max-w-xl">
        {status === QuizStatus.START && (
          <div className="text-center space-y-10 py-12 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 serif">Descartes Mastery</h1>
              <div className="w-16 h-1 bg-amber-200 mx-auto"></div>
              <p className="text-lg text-slate-500 serif italic">"Daría todo lo que sé por la mitad de lo que ignoro."</p>
            </div>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              {!showIAMenu ? (
                <>
                  <button onClick={() => startQuiz(CorrectionMode.FINAL, false)} className="w-full py-4 px-6 paper rounded-2xl text-lg font-medium hover:bg-slate-50 transition-all active:scale-95 shadow-sm">Examen Clásico</button>
                  <button onClick={() => startQuiz(CorrectionMode.IMMEDIATE, false)} className="w-full py-4 px-6 border border-amber-200 bg-amber-50 text-amber-900 rounded-2xl text-lg font-medium hover:bg-amber-100 transition-all active:scale-95 shadow-sm">Modo Ayuda</button>
                  <button onClick={() => setShowIAMenu(true)} className="w-full py-4 px-6 border-2 border-slate-800 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-3">
                    <span>Examen Inédito (IA)</span>
                    <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Nuevo</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Selecciona modo para IA</h3>
                  <button onClick={() => startQuiz(CorrectionMode.FINAL, true)} className="w-full py-4 px-6 paper rounded-2xl text-lg font-medium hover:bg-slate-50 transition-all active:scale-95 shadow-sm">Solo Examen (Final)</button>
                  <button onClick={() => startQuiz(CorrectionMode.IMMEDIATE, true)} className="w-full py-4 px-6 border border-amber-200 bg-amber-50 text-amber-900 rounded-2xl text-lg font-medium hover:bg-amber-100 transition-all active:scale-95 shadow-sm">Con Ayuda (Inmediata)</button>
                  <button onClick={() => setShowIAMenu(false)} className="text-xs text-slate-400 font-bold hover:text-slate-600 underline decoration-slate-200 underline-offset-4 pt-2">Volver al inicio</button>
                </div>
              )}
            </div>
            {!showIAMenu && <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">2º Bachillerato • EBAU</p>}
          </div>
        )}

        {status === QuizStatus.QUIZ && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cuestión {currentIdx + 1} / {shuffledQuestions.length}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 transition-all duration-300" style={{ width: `${shuffledQuestions.length > 0 ? ((currentIdx + 1) / shuffledQuestions.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="paper p-8 sm:p-10 rounded-3xl space-y-8 relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight serif text-slate-900">{shuffledQuestions[currentIdx].text}</h2>

              <div className="grid gap-3">
                {shuffledQuestions[currentIdx].options.map((option, idx) => {
                  const isSelected = selectedInCurrent === option.id;
                  const isCorrect = option.id === shuffledQuestions[currentIdx].correctAnswer;
                  const label = String.fromCharCode(65 + idx);

                  let btnStyles = "btn-crema";
                  if (correctionMode === CorrectionMode.IMMEDIATE && selectedInCurrent) {
                    if (isCorrect) btnStyles = "bg-green-100 border-green-300 text-green-900";
                    else if (isSelected) btnStyles = "bg-red-500 text-white border-red-600";
                  } else if (isSelected) {
                    btnStyles = "bg-slate-800 text-white border-slate-800";
                  }

                  return (
                    <button key={option.id} disabled={!!selectedInCurrent} onClick={() => handleAnswer(option.id)} className={`group flex items-center w-full p-4 text-left rounded-xl border font-medium transition-all ${btnStyles}`}>
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-sm font-bold ${isSelected ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{label}</span>
                      <span className="flex-1 text-sm sm:text-base">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {correctionMode === CorrectionMode.IMMEDIATE && selectedInCurrent && (
                <div className="pt-6 border-t border-slate-100 space-y-5">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex gap-2">
                      <button onClick={handleQuickExplanation} className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all text-xs font-bold">
                        ¿Por qué es esta?
                      </button>
                      <button onClick={() => openChatWithQuestion(shuffledQuestions[currentIdx].text)} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all text-xs font-bold">
                        Chat con Pedro
                      </button>
                    </div>
                    <button onClick={nextQuestion} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all text-sm">Siguiente →</button>
                  </div>
                  
                  {isLoadingExp && <div className="p-3 text-center text-slate-400 text-xs animate-pulse">Analizando...</div>}
                  {quickExp && (
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-700 text-sm leading-relaxed animate-in fade-in">
                      {quickExp}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {status === QuizStatus.RESULTS && (
          <div className="paper p-10 sm:p-14 rounded-3xl space-y-10 animate-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-slate-900 serif text-center w-full">Resultados</h2>
              <div className="flex justify-center items-baseline space-x-2 pt-4">
                <span className="text-7xl font-bold text-slate-900">{answers.filter(a => a.isCorrect).length}</span>
                <span className="text-2xl text-slate-300">/ {shuffledQuestions.length}</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              {isLoadingFeedback ? (
                <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div></div>
              ) : (
                <p className="text-slate-600 serif text-xl leading-relaxed italic">"{feedback}"</p>
              )}
            </div>

            {answers.some(a => !a.isCorrect) && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Errores detectados</h3>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {answers.filter(a => !a.isCorrect).map((ans) => {
                    const q = shuffledQuestions.find(q => q.id === ans.questionId)!;
                    const correctText = q.options.find(o => o.id === q.correctAnswer)?.text;
                    return (
                      <div key={ans.questionId} className="p-5 bg-white border border-slate-100 rounded-xl space-y-3 shadow-sm">
                        <p className="text-sm font-semibold text-slate-800 serif text-lg leading-tight">{q.text}</p>
                        <div className="flex items-center text-xs space-x-2 pb-2">
                          <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100 font-bold">FALLO</span>
                          <span className="text-green-600 font-bold">CORRECTA: {correctText}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleQuickExplanationFromResult(q.id)} className="text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100 font-bold text-slate-500 hover:bg-slate-100">¿Por qué?</button>
                          <button onClick={() => openChatWithQuestion(q.text)} className="text-[10px] bg-amber-50 px-2 py-1 rounded border border-amber-100 font-bold text-amber-600 hover:bg-amber-100">Chat Pedro</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {quickExp && status === QuizStatus.RESULTS && (
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm italic animate-in fade-in">
                <span className="block font-bold text-slate-400 text-[9px] uppercase tracking-widest mb-1">Anotación rápida</span>
                "{quickExp}"
              </div>
            )}

            <button onClick={() => setStatus(QuizStatus.START)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">Reintentar examen</button>
          </div>
        )}

        {/* Professor Chat UI Overlay */}
        {showChat && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10">
              <div className="p-5 bg-amber-50 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">👨‍🏫</span>
                  <div>
                    <h3 className="font-bold text-amber-900 leading-none">Pedro</h3>
                    <p className="text-[9px] text-amber-700 uppercase tracking-widest font-black mt-1">Dudas filosóficas</p>
                  </div>
                </div>
                <button onClick={() => { setShowChat(false); setChatMessages([]); }} className="p-2 hover:bg-amber-100 rounded-full transition-all">✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#fdfcf8]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-100 text-slate-800 rounded-tr-none' : 'bg-amber-100 text-amber-900 rounded-tl-none border border-amber-200/50'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && <div className="flex justify-start"><div className="bg-amber-50 p-3 rounded-2xl animate-pulse text-amber-400 text-xs">Pensando...</div></div>}
              </div>

              <div className="p-4 bg-white border-t flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessageToPedro()} placeholder="Escribe tu duda al grano..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all" />
                <button onClick={sendMessageToPedro} className="w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-md shadow-amber-100 font-bold text-lg">↑</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-slate-300 text-[8px] tracking-[0.5em] uppercase font-bold text-center">Descartes Mastery • Bachillerato Racional</footer>
    </div>
  );
};

export default App;
