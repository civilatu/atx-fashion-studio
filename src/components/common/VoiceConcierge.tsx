/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';

// SpeechRecognition type declarations for browsers
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const VoiceConcierge: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setActiveClientView,
    setActiveStudioTab,
    isStudioUnlocked,
    lockStudio,
    bankDetails,
    showToast
  } = useAtelier();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Tap the microphone and speak your request.');
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setFeedbackMessage('Listening to your voice command...');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const resultTranscript = event.results[current][0].transcript;
      setTranscript(resultTranscript);

      if (event.results[current].isFinal) {
        processCommand(resultTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setFeedbackMessage('Microphone access was denied. You can still type your command below.');
      } else {
        setFeedbackMessage('Could not recognize voice. Please speak clearly or try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speak = (text: string) => {
    if (!voiceFeedbackEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error', e);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser.', 'warning');
      return;
    }
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch {
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error(e);
        }
      }, 200);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = (rawText: string) => {
    const command = rawText.toLowerCase().trim();

    // 1. Navigation: Ready to Wear / Catalog
    if (
      command.includes('ready to wear') ||
      command.includes('rtw') ||
      command.includes('collection') ||
      command.includes('catalog') ||
      command.includes('shop') ||
      command.includes('store') ||
      command.includes('dresses')
    ) {
      setViewMode('client');
      setActiveClientView('rtw');
      const response = 'Opening the Ready-to-Wear collection.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      return;
    }

    // 2. Navigation: Bespoke / Custom Tailoring / Agbada / Senator
    if (
      command.includes('bespoke') ||
      command.includes('custom') ||
      command.includes('commission') ||
      command.includes('tailor') ||
      command.includes('agbada') ||
      command.includes('senator') ||
      command.includes('make outfit')
    ) {
      setViewMode('client');
      setActiveClientView('bespoke');
      const response = 'Opening the Bespoke Tailoring Studio for your custom commission.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      return;
    }

    // 3. Navigation: Track Commission / Order Status
    if (
      command.includes('track') ||
      command.includes('order status') ||
      command.includes('where is my order') ||
      command.includes('where is my dress') ||
      command.includes('check order')
    ) {
      setViewMode('client');
      setActiveClientView('track');
      const response = 'Opening Commission Tracker. Enter your reference ID to view real-time progress.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      return;
    }

    // 4. Navigation: Lookbook / Home / Heritage
    if (
      command.includes('lookbook') ||
      command.includes('home') ||
      command.includes('heritage') ||
      command.includes('front page') ||
      command.includes('welcome')
    ) {
      setViewMode('client');
      setActiveClientView('lookbook');
      const response = 'Returning to the ATX Lookbook and Heritage showcase.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      return;
    }

    // 5. Navigation: Personal Styling / Consultation
    if (
      command.includes('styling') ||
      command.includes('consultation') ||
      command.includes('wardrobe') ||
      command.includes('advisor')
    ) {
      setViewMode('client');
      setActiveClientView('styling');
      const response = 'Opening Personal Styling & Wardrobe Consultation.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      return;
    }

    // 6. Bank Details & Deposit Policy
    if (
      command.includes('bank') ||
      command.includes('account number') ||
      command.includes('how to pay') ||
      command.includes('payment') ||
      command.includes('transfer')
    ) {
      const response = `Official studio bank is ${bankDetails.bankName}, account number ${bankDetails.accountNumber}.`;
      setFeedbackMessage(response);
      speak(response);
      showToast(`Bank: ${bankDetails.bankName} | Account: ${bankDetails.accountNumber}`, 'info');
      return;
    }

    if (command.includes('deposit') || command.includes('60 percent')) {
      const response = 'ATX Studio operates on a 60% commitment deposit before fabric sourcing and pattern cutting begin.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'info');
      return;
    }

    // 7. Contact / WhatsApp Desk
    if (
      command.includes('whatsapp') ||
      command.includes('contact') ||
      command.includes('phone') ||
      command.includes('call') ||
      command.includes('talk to someone')
    ) {
      const response = 'Opening the ATX Studio WhatsApp Desk at 08150882291.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'success');
      window.open('https://wa.me/2348150882291', '_blank');
      return;
    }

    // 8. Size Guide
    if (
      command.includes('size guide') ||
      command.includes('sizing') ||
      command.includes('size chart') ||
      command.includes('measure')
    ) {
      setViewMode('client');
      setActiveClientView('rtw');
      const response = 'Displaying the ATX Master Tailoring anatomical size guide.';
      setFeedbackMessage(response);
      speak(response);
      showToast(response, 'info');
      return;
    }

    // 9. Studio OS Backstage Commands
    if (
      command.includes('studio os') ||
      command.includes('studio management') ||
      command.includes('backstage') ||
      command.includes('pipeline') ||
      command.includes('kanban')
    ) {
      if (isStudioUnlocked) {
        setViewMode('studio');
        setActiveStudioTab('pipeline');
        const response = 'Opening Studio OS 10-Stage Production Pipeline.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'success');
      } else {
        const response = 'Studio OS is PIN-protected. Please click Studio OS in the top bar to enter your 4-digit PIN.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'warning');
      }
      return;
    }

    if (command.includes('costing') || command.includes('margin') || command.includes('calculator')) {
      if (isStudioUnlocked) {
        setViewMode('studio');
        setActiveStudioTab('costing');
        const response = 'Opening the Garment Pricing and Margin Engine.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'success');
      } else {
        const response = 'Pricing engine is restricted to authorized studio personnel.';
        setFeedbackMessage(response);
        speak(response);
      }
      return;
    }

    if (command.includes('vault') || command.includes('client measurements')) {
      if (isStudioUnlocked) {
        setViewMode('studio');
        setActiveStudioTab('measurements');
        const response = 'Opening the Anatomical Measurement Vault.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'success');
      } else {
        const response = 'Measurement vault requires Master Tailor PIN authorization.';
        setFeedbackMessage(response);
        speak(response);
      }
      return;
    }

    if (command.includes('bulk') || command.includes('uniform')) {
      if (isStudioUnlocked) {
        setViewMode('studio');
        setActiveStudioTab('bulk');
        const response = 'Opening the Bulk Uniform and Contract Hub.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'success');
      } else {
        const response = 'Bulk contracts hub requires studio PIN.';
        setFeedbackMessage(response);
        speak(response);
      }
      return;
    }

    if (command.includes('analytics') || command.includes('kpi') || command.includes('profit') || command.includes('revenue')) {
      if (isStudioUnlocked) {
        setViewMode('studio');
        setActiveStudioTab('analytics');
        const response = 'Opening Studio KPIs and Solvency Dashboard.';
        setFeedbackMessage(response);
        speak(response);
        showToast(response, 'success');
      } else {
        const response = 'Financial analytics are restricted to management.';
        setFeedbackMessage(response);
        speak(response);
      }
      return;
    }

    if (command.includes('lock studio') || command.includes('lock os')) {
      lockStudio();
      const response = 'Studio OS is now locked. Switched back to Client Experience.';
      setFeedbackMessage(response);
      speak(response);
      return;
    }

    // Default Fallback
    const fallback = `I heard: "${rawText}". Try saying: "Show ready to wear", "Commission bespoke", "Track order", "Bank details", or "Connect WhatsApp".`;
    setFeedbackMessage(fallback);
    speak('Command not recognized. Please choose from our quick voice commands.');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput.trim());
    processCommand(manualInput.trim());
    setManualInput('');
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => {
              if (isSupported) startListening();
            }, 300);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#181615] hover:bg-[#24201D] text-[#D4AF37] border border-[#D4AF37]/50 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="ATX Voice Concierge (Speak to navigate or order)"
        >
          <div className="relative">
            <Mic className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-[#F4EFEA]">
            Voice Concierge
          </span>
        </button>
      </div>

      {/* Voice Concierge Interactive Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#181615] border border-[#D4AF37]/60 rounded-2xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl">
            {/* Top Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg text-[#F4EFEA] leading-tight">
                    ATX Voice Concierge
                  </h3>
                  <span className="text-[10px] tracking-wider uppercase text-[#D4AF37]/80 block font-medium">
                    Hands-Free Studio Navigation & Orders
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    voiceFeedbackEnabled
                      ? 'border-[#D4AF37]/40 bg-[#221F1C] text-[#D4AF37]'
                      : 'border-white/10 bg-[#121110] text-[#F4EFEA]/40'
                  }`}
                  title={voiceFeedbackEnabled ? 'Voice feedback is ON' : 'Voice feedback is MUTED'}
                >
                  {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    stopListening();
                    setIsOpen(false);
                  }}
                  className="p-2 text-[#F4EFEA]/60 hover:text-[#F4EFEA] rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Microphone Listening Hub */}
            <div className="text-center py-4 space-y-4">
              <div className="relative inline-flex items-center justify-center">
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 animate-ping scale-150 duration-1000" />
                )}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-[#121110] transition-all cursor-pointer shadow-xl relative z-10 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 scale-105'
                      : 'bg-[#D4AF37] hover:bg-[#C59B27]'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-8 h-8 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-8 h-8 text-[#121110]" />
                  )}
                </button>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-semibold block text-[#D4AF37]">
                  {isListening ? 'Listening to your command...' : 'Tap to start speaking'}
                </span>
                {transcript && (
                  <p className="font-serif-luxury text-base text-[#F4EFEA] mt-2 italic px-4 bg-[#121110]/60 py-2 rounded-lg border border-white/5">
                    "{transcript}"
                  </p>
                )}
              </div>

              {/* Status / Feedback Box */}
              <div className="p-3.5 rounded-xl bg-[#121110] border border-white/10 text-xs text-[#F4EFEA]/80 leading-relaxed min-h-[52px] flex items-center justify-center text-center">
                {feedbackMessage}
              </div>
            </div>

            {/* Fast Quick-Action Voice Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#F4EFEA]/50">
                <span>Try saying one of these commands:</span>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHelp ? 'Hide guide' : 'All commands'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Show ready to wear',
                  'Commission bespoke Agbada',
                  'Track order status',
                  'What are your bank details?',
                  'Open WhatsApp studio desk',
                  'Show size guide',
                  'Open Studio OS'
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setTranscript(sample);
                      processCommand(sample);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-[11px] text-[#F4EFEA]/80 hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Expanded Help Guide */}
            {showHelp && (
              <div className="p-4 rounded-xl bg-[#141211] border border-[#D4AF37]/30 text-xs text-[#F4EFEA]/75 space-y-2 animate-in fade-in max-h-48 overflow-y-auto">
                <span className="font-semibold text-[#D4AF37] block uppercase text-[10px] tracking-wider">
                  Complete ATX Voice Lexicon:
                </span>
                <ul className="space-y-1 text-[11px] list-disc list-inside">
                  <li><strong>"Ready to wear" / "Store"</strong>: Navigates to RTW dresses & suits.</li>
                  <li><strong>"Bespoke" / "Senator" / "Agbada"</strong>: Opens the 4-step custom tailor builder.</li>
                  <li><strong>"Track" / "Where is my order"</strong>: Opens the 10-stage commission tracker.</li>
                  <li><strong>"Bank details" / "How to pay"</strong>: Speaks and displays First Bank NUBAN.</li>
                  <li><strong>"Size guide" / "Chart"</strong>: Displays anatomical fit measurements in inches.</li>
                  <li><strong>"WhatsApp" / "Contact desk"</strong>: Connects to 08150882291.</li>
                  <li><strong>"Studio OS" / "Pipeline" / "Costing"</strong>: Accesses internal tailoring OS.</li>
                  <li><strong>"Lock studio"</strong>: Secures internal management console.</li>
                </ul>
              </div>
            )}

            {/* Text Typing Fallback */}
            <form onSubmit={handleManualSubmit} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Or type any voice request here (e.g. 'Show Agbada')..."
                className="flex-1 bg-[#121110] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#F4EFEA] focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#121110] font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Send</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
