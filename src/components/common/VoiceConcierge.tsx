/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAtelier } from '../../context/AtelierContext';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, MessageCircle, ArrowRight, HelpCircle, Copy, Check, ExternalLink } from 'lucide-react';

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
    unlockStudio,
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
  const [copiedBank, setCopiedBank] = useState(false);

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

  // Helper that executes an action, provides visual/voice feedback, and auto-closes dialog so user sees the page
  const executeAndClose = (
    action: () => void,
    message: string,
    spokenText?: string,
    autoCloseDelayMs = 700
  ) => {
    action();
    setFeedbackMessage(message);
    speak(spokenText || message);
    showToast(message, 'success');

    if (autoCloseDelayMs > 0) {
      setTimeout(() => {
        setIsOpen(false);
      }, autoCloseDelayMs);
    }
  };

  const processCommand = (rawText: string) => {
    const cmd = rawText.toLowerCase().trim();

    // 1. Ready-to-Wear / Designs / Patterns / Catalog / Clothes / Outfits / Gowns / Senator
    if (
      cmd.includes('design') ||
      cmd.includes('pattern') ||
      cmd.includes('sample') ||
      cmd.includes('ready to wear') ||
      cmd.includes('rtw') ||
      cmd.includes('collection') ||
      cmd.includes('catalog') ||
      cmd.includes('shop') ||
      cmd.includes('store') ||
      cmd.includes('dress') ||
      cmd.includes('clothes') ||
      cmd.includes('outfit') ||
      cmd.includes('gown') ||
      cmd.includes('kaftan') ||
      cmd.includes('suit')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('rtw');
        },
        'Opening Ready-to-Wear Collection & Sample Designs',
        'Opening the Ready-to-Wear collection and sample designs.'
      );
      return;
    }

    // 2. Bespoke / Custom Tailoring / Agbada / Commission
    if (
      cmd.includes('bespoke') ||
      cmd.includes('custom') ||
      cmd.includes('commission') ||
      cmd.includes('tailor') ||
      cmd.includes('agbada') ||
      cmd.includes('make outfit') ||
      cmd.includes('sew') ||
      cmd.includes('stitching')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('bespoke');
        },
        'Opening Bespoke Tailoring Studio',
        'Opening the Bespoke Tailoring Studio for your custom commission.'
      );
      return;
    }

    // 3. Track Commission / Order Status / Delivery
    if (
      cmd.includes('track') ||
      cmd.includes('order status') ||
      cmd.includes('where is my order') ||
      cmd.includes('where is my dress') ||
      cmd.includes('delivery') ||
      cmd.includes('check order') ||
      cmd.includes('receipt') ||
      cmd.includes('progress')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('track');
        },
        'Opening Commission Tracker',
        'Opening Commission Tracker. Enter your reference ID to view real-time progress.'
      );
      return;
    }

    // 4. Lookbook / Home / Heritage / Brand
    if (
      cmd.includes('lookbook') ||
      cmd.includes('home') ||
      cmd.includes('heritage') ||
      cmd.includes('front page') ||
      cmd.includes('welcome') ||
      cmd.includes('brand') ||
      cmd.includes('african luxury')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('lookbook');
        },
        'Opening Lookbook & Heritage Showcase',
        'Returning to the ATX Lookbook and Heritage showcase.'
      );
      return;
    }

    // 5. Personal Styling / Consultation / Wardrobe
    if (
      cmd.includes('styling') ||
      cmd.includes('consultation') ||
      cmd.includes('wardrobe') ||
      cmd.includes('advisor') ||
      cmd.includes('appointment') ||
      cmd.includes('meeting')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('styling');
        },
        'Opening Personal Styling & Consultation',
        'Opening Personal Styling & Wardrobe Consultation.'
      );
      return;
    }

    // 6. Bank Details & Payment / Transfer
    if (
      cmd.includes('bank') ||
      cmd.includes('account number') ||
      cmd.includes('how to pay') ||
      cmd.includes('payment') ||
      cmd.includes('transfer') ||
      cmd.includes('nuban')
    ) {
      navigator.clipboard?.writeText(bankDetails.accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 3000);

      const msg = `Bank: ${bankDetails.bankName} | Account: ${bankDetails.accountNumber} (${bankDetails.accountName}). Number copied to clipboard!`;
      const spoken = `Official studio bank is ${bankDetails.bankName}, account number ${bankDetails.accountNumber}. The number has been copied to your clipboard.`;
      
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('bespoke');
        },
        msg,
        spoken,
        1500
      );
      return;
    }

    // 7. Deposit Policy (60%)
    if (cmd.includes('deposit') || cmd.includes('60 percent') || cmd.includes('upfront')) {
      const msg = 'ATX Studio operates on a 60% commitment deposit before fabric sourcing begins.';
      setFeedbackMessage(msg);
      speak(msg);
      showToast(msg, 'info');
      return;
    }

    // 8. WhatsApp Desk & Contact
    if (
      cmd.includes('whatsapp') ||
      cmd.includes('contact') ||
      cmd.includes('phone') ||
      cmd.includes('call') ||
      cmd.includes('talk to someone') ||
      cmd.includes('08150882291') ||
      cmd.includes('desk') ||
      cmd.includes('chat')
    ) {
      executeAndClose(
        () => {
          window.open('https://wa.me/2348150882291', '_blank');
        },
        'Connecting to ATX Studio WhatsApp Desk (08150882291)',
        'Opening the ATX Studio WhatsApp Desk at 08150882291.',
        1000
      );
      return;
    }

    // 9. Size Guide
    if (
      cmd.includes('size guide') ||
      cmd.includes('sizing') ||
      cmd.includes('size chart') ||
      cmd.includes('measurements guide') ||
      cmd.includes('what size')
    ) {
      executeAndClose(
        () => {
          setViewMode('client');
          setActiveClientView('rtw');
        },
        'Opening Ready-to-Wear Catalog with Size Chart',
        'Displaying the ATX Master Tailoring anatomical size guide.'
      );
      return;
    }

    // 10. Studio OS Backstage Navigation & PIN Unlock by Voice
    if (
      cmd.includes('studio') ||
      cmd.includes('pipeline') ||
      cmd.includes('backstage') ||
      cmd.includes('kanban') ||
      cmd.includes('costing') ||
      cmd.includes('calculator') ||
      cmd.includes('vault') ||
      cmd.includes('bulk') ||
      cmd.includes('uniform') ||
      cmd.includes('analytics') ||
      cmd.includes('kpi') ||
      cmd.includes('profit')
    ) {
      // Voice PIN unlock check
      if (!isStudioUnlocked && (cmd.includes('2026') || cmd.includes('unlock'))) {
        unlockStudio('2026');
      }

      const unlockedNow = isStudioUnlocked || cmd.includes('2026');

      if (unlockedNow) {
        let tab: any = 'pipeline';
        let tabLabel = '10-Stage Pipeline';

        if (cmd.includes('cost') || cmd.includes('calculator') || cmd.includes('margin')) {
          tab = 'costing';
          tabLabel = 'Pricing & Margin Engine';
        } else if (cmd.includes('vault') || cmd.includes('measurement')) {
          tab = 'measurements';
          tabLabel = 'Measurement Vault';
        } else if (cmd.includes('bulk') || cmd.includes('uniform')) {
          tab = 'bulk';
          tabLabel = 'Bulk & Uniform Hub';
        } else if (cmd.includes('analytics') || cmd.includes('kpi') || cmd.includes('profit') || cmd.includes('revenue')) {
          tab = 'analytics';
          tabLabel = 'Studio Financial KPIs';
        }

        executeAndClose(
          () => {
            setViewMode('studio');
            setActiveStudioTab(tab);
          },
          `Opening Studio OS: ${tabLabel}`,
          `Opening Studio OS: ${tabLabel}.`
        );
      } else {
        const msg = 'Studio OS is PIN-protected. Say "Unlock Studio 2026" or click Studio OS in the top bar.';
        setFeedbackMessage(msg);
        speak('Studio OS is PIN-protected. You can say Unlock Studio 2026 or enter your PIN in the top bar.');
        showToast(msg, 'warning');
      }
      return;
    }

    // 11. Lock Studio OS
    if (cmd.includes('lock studio') || cmd.includes('lock os') || cmd.includes('logout') || cmd.includes('exit studio')) {
      executeAndClose(
        () => {
          lockStudio();
        },
        'Studio OS locked. Switched back to Client Experience.',
        'Studio OS is now locked.'
      );
      return;
    }

    // Default Fallback
    const fallback = `I heard: "${rawText}". Try saying: "Show ready to wear", "Commission bespoke", "Track order", or "Bank details".`;
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

              {/* Direct Tap Shortcuts (Always available for 1-click execution) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => executeAndClose(() => { setViewMode('client'); setActiveClientView('rtw'); }, 'Navigating to Ready-to-Wear')}
                  className="p-2 rounded-lg bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 text-xs text-[#F4EFEA] hover:text-[#D4AF37] transition-colors cursor-pointer text-center"
                >
                  RTW Catalog
                </button>
                <button
                  type="button"
                  onClick={() => executeAndClose(() => { setViewMode('client'); setActiveClientView('bespoke'); }, 'Opening Bespoke Studio')}
                  className="p-2 rounded-lg bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 text-xs text-[#F4EFEA] hover:text-[#D4AF37] transition-colors cursor-pointer text-center"
                >
                  Bespoke Studio
                </button>
                <button
                  type="button"
                  onClick={() => executeAndClose(() => { setViewMode('client'); setActiveClientView('track'); }, 'Opening Commission Tracker')}
                  className="p-2 rounded-lg bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 text-xs text-[#F4EFEA] hover:text-[#D4AF37] transition-colors cursor-pointer text-center"
                >
                  Track Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(bankDetails.accountNumber);
                    setCopiedBank(true);
                    showToast(`Copied ${bankDetails.bankName} Account (${bankDetails.accountNumber})`, 'success');
                    setTimeout(() => setCopiedBank(false), 2500);
                  }}
                  className="p-2 rounded-lg bg-[#221F1C] hover:bg-[#D4AF37]/20 border border-white/10 text-xs text-[#F4EFEA] hover:text-[#D4AF37] transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  {copiedBank ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBank ? 'Copied' : 'Bank Info'}</span>
                </button>
              </div>
            </div>

            {/* Fast Quick-Action Voice Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#F4EFEA]/50">
                <span>Or speak one of these instant phrases:</span>
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
                  'Show sample designs',
                  'Commission bespoke Agbada',
                  'Track order status',
                  'What are your bank details?',
                  'Open WhatsApp studio desk',
                  'Show size guide',
                  'Unlock Studio 2026'
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
                  <li><strong>"Show designs" / "Ready to wear" / "Patterns"</strong>: Opens the ready-to-wear showroom.</li>
                  <li><strong>"Bespoke" / "Senator" / "Agbada"</strong>: Opens the 4-step custom tailor builder.</li>
                  <li><strong>"Track" / "Where is my order"</strong>: Opens the 10-stage commission tracker.</li>
                  <li><strong>"Bank details" / "How to pay"</strong>: Copies First Bank NUBAN and speaks details.</li>
                  <li><strong>"Size guide" / "Chart"</strong>: Displays anatomical fit measurements in inches.</li>
                  <li><strong>"WhatsApp" / "Contact desk"</strong>: Connects to 08150882291.</li>
                  <li><strong>"Unlock Studio 2026" / "Pipeline"</strong>: Accesses internal tailoring OS.</li>
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
                placeholder="Or type any voice request here (e.g. 'Show designs', 'Track order')..."
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
