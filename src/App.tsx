/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe2, 
  Clock, 
  Trophy, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  Languages, 
  MapPin, 
  Plane,
  Sparkles,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Loading
} from 'lucide-react';
import { cn } from './lib/utils';
import { generateCurriculum, type Curriculum } from './services/geminiService';

type Step = 'language' | 'duration' | 'level' | 'goal' | 'generating' | 'dashboard';

const languages = [
  { id: 'english', label: '영어', icon: '🇺🇸', code: 'en' },
  { id: 'french', label: '불어', icon: '🇫🇷', code: 'fr' },
  { id: 'chinese', label: '중국어', icon: '🇨🇳', code: 'zh' },
  { id: 'spanish', label: '스페인어', icon: '🇪🇸', code: 'es' },
  { id: 'japanese', label: '일본어', icon: '🇯🇵', code: 'ja' },
  { id: 'german', label: '독일어', icon: '🇩🇪', code: 'de' },
  { id: 'vietnamese', label: '베트남어', icon: '🇻🇳', code: 'vi' },
];

const durations = [
  { id: '1week', label: '1주일 (벼락치기)', desc: '핵심 표현 위주로 빠르게' },
  { id: '2weeks', label: '2주일 (기본 완성)', desc: '기본적인 의사소통 가능' },
  { id: '1month', label: '한 달 (자신감 상승)', desc: '다양한 상황 대응 연습' },
  { id: 'ongoing', label: '꾸준히 (준비 철저)', desc: '문화 배경까지 깊이 있게' },
];

const levels = [
  { id: 'beginner', label: '왕초보', desc: '해당 언어를 처음 접해요' },
  { id: 'elementary', label: '기초', desc: '간단한 인사말 정도는 알아요' },
  { id: 'intermediate', label: '중급', desc: '하고 싶은 말을 조금은 할 수 있어요' },
];

const goals = [
  { id: 'survival', label: '생존 여행', desc: '공항, 호텔, 길 찾기 등 필수' },
  { id: 'gourmet', label: '맛집 탐방', desc: '주문, 결제, 식당 예약 위주' },
  { id: 'social', label: '현지 소통', desc: '현지인과 대화하고 친구 사귀기' },
  { id: 'business', label: '비즈니스', desc: '업무 미팅 및 출장 상황' },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('language');
  const [selection, setSelection] = useState({
    language: '',
    duration: '',
    level: '',
    goal: '',
  });
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setCurrentStep('generating');
    setLoading(true);
    try {
      const selectedLang = languages.find(l => l.id === selection.language)?.label || selection.language;
      const selectedDuration = durations.find(d => d.id === selection.duration)?.label || selection.duration;
      const selectedLevel = levels.find(l => l.id === selection.level)?.label || selection.level;
      const selectedGoal = goals.find(g => g.id === selection.goal)?.label || selection.goal;

      const result = await generateCurriculum(selectedLang, selectedDuration, selectedLevel, selectedGoal);
      setCurriculum(result);
      setCurrentStep('dashboard');
    } catch (error) {
      console.error(error);
      alert('학습 콘텐츠 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setCurrentStep('goal');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 'language') setCurrentStep('duration');
    else if (currentStep === 'duration') setCurrentStep('level');
    else if (currentStep === 'level') setCurrentStep('goal');
    else if (currentStep === 'goal') handleStart();
  };

  const prevStep = () => {
    if (currentStep === 'duration') setCurrentStep('language');
    else if (currentStep === 'level') setCurrentStep('duration');
    else if (currentStep === 'goal') setCurrentStep('level');
    else if (currentStep === 'dashboard') setCurrentStep('language');
  };

  const isNextDisabled = () => {
    if (currentStep === 'language') return !selection.language;
    if (currentStep === 'duration') return !selection.duration;
    if (currentStep === 'level') return !selection.level;
    if (currentStep === 'goal') return !selection.goal;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-[#E6D5C3]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E6D5C3] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4E2D4] rounded-full blur-[120px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#EAEAEA] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentStep('language')}>
            <div className="p-2 bg-[#1A1A1A] rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">GlobeGlide</h1>
          </div>
          {currentStep !== 'language' && currentStep !== 'dashboard' && currentStep !== 'generating' && (
            <button 
              onClick={prevStep}
              className="text-sm font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> 이전으로
            </button>
          )}
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 'language' && (
              <motion.div
                key="step-language"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08870]">Step 01</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">어떤 나라로 떠나시나요?</h2>
                  <p className="text-[#6B6B6B]">여행지에서 사용할 어학을 선택해주세요.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelection({ ...selection, language: lang.id })}
                      className={cn(
                        "flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300 gap-4 group",
                        selection.language === lang.id 
                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-2xl shadow-[#1A1A1A]/20 scale-[1.02]" 
                          : "bg-white border-[#EAEAEA] hover:border-[#1A1A1A] hover:shadow-lg"
                      )}
                    >
                      <span className="text-5xl group-hover:scale-110 transition-transform">{lang.icon}</span>
                      <span className="font-semibold">{lang.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={isNextDisabled()}
                    onClick={nextStep}
                    className="group bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#333] transition-all"
                  >
                    다음 단계 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'duration' && (
              <motion.div
                key="step-duration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08870]">Step 02</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">준비 기간은 얼마나 되나요?</h2>
                  <p className="text-[#6B6B6B]">여행 전까지 학습할 수 있는 기간을 선택해주세요.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {durations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelection({ ...selection, duration: d.id })}
                      className={cn(
                        "flex items-center p-6 rounded-3xl border-2 transition-all duration-300 gap-6 text-left",
                        selection.duration === d.id 
                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                          : "bg-white border-[#EAEAEA] hover:border-[#1A1A1A]"
                      )}
                    >
                      <div className={cn("p-4 rounded-2xl", selection.duration === d.id ? "bg-white/10" : "bg-[#F5F5F5]")}>
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{d.label}</p>
                        <p className={cn("text-sm", selection.duration === d.id ? "text-white/60" : "text-[#6B6B6B]")}>{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={isNextDisabled()}
                    onClick={nextStep}
                    className="group bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    다음 단계 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'level' && (
              <motion.div
                key="step-level"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08870]">Step 03</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">현재 실력은 어느 정도인가요?</h2>
                  <p className="text-[#6B6B6B]">맞춤형 콘텐츠 제공을 위해 기초 실력을 파악합니다.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {levels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelection({ ...selection, level: l.id })}
                      className={cn(
                        "flex items-center p-6 rounded-3xl border-2 transition-all duration-300 gap-6 text-left",
                        selection.level === l.id 
                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                          : "bg-white border-[#EAEAEA] hover:border-[#1A1A1A]"
                      )}
                    >
                      <div className={cn("p-4 rounded-2xl", selection.level === l.id ? "bg-white/10" : "bg-[#F5F5F5]")}>
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{l.label}</p>
                        <p className={cn("text-sm", selection.level === l.id ? "text-white/60" : "text-[#6B6B6B]")}>{l.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={isNextDisabled()}
                    onClick={nextStep}
                    className="group bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    다음 단계 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'goal' && (
              <motion.div
                key="step-goal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A08870]">Step 04</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">학습 목표를 알려주세요.</h2>
                  <p className="text-[#6B6B6B]">여행 스타일과 가장 잘 어울리는 목표를 선택하세요.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelection({ ...selection, goal: g.id })}
                      className={cn(
                        "flex items-center p-6 rounded-3xl border-2 transition-all duration-300 gap-6 text-left",
                        selection.goal === g.id 
                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                          : "bg-white border-[#EAEAEA] hover:border-[#1A1A1A]"
                      )}
                    >
                      <div className={cn("p-4 rounded-2xl", selection.goal === g.id ? "bg-white/10" : "bg-[#F5F5F5]")}>
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{g.label}</p>
                        <p className={cn("text-sm", selection.goal === g.id ? "text-white/60" : "text-[#6B6B6B]")}>{g.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={isNextDisabled()}
                    onClick={nextStep}
                    className="group bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#1A1A1A]/20"
                  >
                    AI 학습 플랜 생성하기 <Sparkles className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-4 border-dashed border-[#1A1A1A]/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe2 className="w-12 h-12 text-[#1A1A1A] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif">맞춤형 플랜을 설계 중입니다...</h2>
                  <p className="text-[#6B6B6B]">여행 전문가 AI가 당신의 데이터를 분석하고 있어요.</p>
                </div>
              </motion.div>
            )}

            {currentStep === 'dashboard' && curriculum && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#EAEAEA] pb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{languages.find(l => l.id === selection.language)?.icon}</span>
                      <h2 className="text-4xl md:text-5xl font-serif italic">{selection.language.toUpperCase()} COURSE</h2>
                    </div>
                    <p className="text-[#6B6B6B] max-w-2xl leading-relaxed">{curriculum.overview}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentStep('language')}
                    className="group flex items-center gap-2 text-sm font-bold bg-white border border-[#EAEAEA] px-6 py-3 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm"
                  >
                    새로운 목표 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Situational Phrases */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      <h3 className="text-xl font-bold uppercase tracking-wider">주요 상황별 대화</h3>
                    </div>
                    <div className="space-y-6">
                      {curriculum.situationalPhrases.map((sit, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={sit.situation} 
                          className="bg-white p-8 rounded-[40px] border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                            <h4 className="font-bold text-lg">{sit.situation}</h4>
                          </div>
                          <div className="space-y-6">
                            {sit.phrases.map((phrase, pIdx) => (
                              <div key={pIdx} className="group border-l-2 border-[#EAEAEA] pl-6 hover:border-[#1A1A1A] transition-colors">
                                <p className="text-2xl font-serif mb-1 group-hover:translate-x-1 transition-transform">{phrase.original}</p>
                                <p className="text-[#A08870] font-medium text-sm mb-1 italic">[{phrase.pronunciation}]</p>
                                <p className="text-[#6B6B6B] text-sm">{phrase.meaning}</p>
                                {phrase.tip && (
                                  <div className="mt-2 flex items-start gap-2 text-xs text-[#1A1A1A] bg-[#FDFBF7] p-2 rounded-lg border border-[#E6D5C3]/40">
                                    <Lightbulb className="w-3 h-3 mt-0.5 text-[#A08870]" />
                                    <span>{phrase.tip}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-8">
                    {/* Key Vocabulary */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">필수 어휘</h3>
                      </div>
                      <div className="bg-[#1A1A1A] text-white p-8 rounded-[40px] shadow-xl">
                        <div className="grid grid-cols-1 gap-4">
                          {curriculum.keyVocabulary.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                              <span className="text-lg font-serif">{v.word}</span>
                              <span className="text-white/60 text-sm">{v.meaning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Cultural Tips */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">현지 문화 Tip</h3>
                      </div>
                      <div className="space-y-4">
                        {curriculum.culturalTips.map((tip, idx) => (
                          <div key={idx} className="flex gap-4 p-5 bg-white rounded-3xl border border-[#EAEAEA]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4E2D4] flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-[#4A634A]" />
                            </div>
                            <p className="text-sm leading-relaxed text-[#6B6B6B]">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-sm border-t border-[#EAEAEA] py-3 px-6 z-40 md:hidden">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A08870]">GlobeGlide Travel Learning</p>
          <p className="text-[10px] font-medium text-[#6B6B6B]">Ready for your next journey?</p>
        </div>
      </footer>
    </div>
  );
}
