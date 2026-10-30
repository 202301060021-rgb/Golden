import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Camera, Music2, Pause, Sparkles, Star, X } from 'lucide-react';
import { birthday, greetingName, sender } from './config/birthday';

type Overlay =
  | { kind: 'reason'; index: number }
  | { kind: 'memory'; index: number }
  | { kind: 'surprise' }
  | null;

const ease = [0.22, 1, 0.36, 1] as const;

/** Resolve files stored in /public for both local hosting and the /web/ Pages path. */
function publicAsset(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

function App() {
  const reducedMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [letterRevealed, setLetterRevealed] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [litStar, setLitStar] = useState<number | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Set<number>>(() => new Set());
  const [playing, setPlaying] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const celebrationTimer = useRef<number | undefined>(undefined);

  const showStory = () => {
    setOpening(false);
    setOpened(true);
    window.setTimeout(() => document.getElementById('birthday-greeting')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }), 80);
  };

  const openLetter = () => {
    if (reducedMotion) {
      showStory();
      return;
    }
    setOpening(true);
    window.setTimeout(showStory, 1650);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setAudioUnavailable(false);
    } catch {
      setAudioUnavailable(true);
      setPlaying(false);
    }
  };

  const startCelebration = () => {
    setOverlay({ kind: 'surprise' });
    setCelebrate(true);
    window.clearTimeout(celebrationTimer.current);
    celebrationTimer.current = window.setTimeout(() => setCelebrate(false), 4700);
  };

  const moveMemory = (direction: number) => {
    if (overlay?.kind !== 'memory') return;
    const count = birthday.memories.slots.length;
    setOverlay({ kind: 'memory', index: (overlay.index + direction + count) % count });
  };

  useEffect(() => {
    if (overlay) {
      window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus(), 20);
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOverlay(null);
      if (overlay?.kind === 'memory' && event.key === 'ArrowRight') moveMemory(1);
      if (overlay?.kind === 'memory' && event.key === 'ArrowLeft') moveMemory(-1);
      if (event.key === 'Tab' && overlay && dialogRef.current) {
        const controls = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlay]);

  useEffect(() => () => window.clearTimeout(celebrationTimer.current), []);

  const confetti = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: `${(i * 47 + 7) % 100}%`,
    size: `${5 + (i % 5) * 2}px`,
    color: ['#f1c996', '#cf8582', '#ead9bd', '#b1c7ae', '#f3a8a0'][i % 5],
    duration: `${2.3 + (i % 8) * 0.2}s`,
    delay: `${(i % 13) * 0.045}s`,
    drift: `${((i * 31) % 170) - 85}px`,
    turn: `${i * 31}deg`,
    shape: i % 3 === 0 ? '50%' : '2px',
  }));

  return (
    <main className="app-shell grain" data-testid="page-birthday-surprise">
      {birthday.showMusicControl && (
        <header className="topbar">
          <div className="wordmark" data-testid="text-wordmark">a little love letter</div>
          <div>
            <button type="button" className="music-button" onClick={toggleMusic} data-testid="button-toggle-music" aria-pressed={playing} aria-label={playing ? birthday.controls.pause : birthday.controls.play} title={audioUnavailable ? birthday.controls.unavailable : undefined}>
              {playing ? <Pause size={14} aria-hidden="true" /> : <Music2 size={14} aria-hidden="true" />}
              <span>{playing ? birthday.controls.pause : audioUnavailable ? birthday.controls.unavailable : birthday.controls.play}</span>
            </button>
            <audio ref={audioRef} src={publicAsset(birthday.audioSrc)} loop preload="none" onEnded={() => setPlaying(false)} onError={() => { setAudioUnavailable(true); setPlaying(false); }} />
          </div>
        </header>
      )}

      <section id="top" className={`intro ${opening ? 'is-opening' : ''}`} aria-labelledby="intro-title">
        <motion.div className="intro-inner" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease }}>
          <div className="eyebrow" data-testid="text-opening-eyebrow">{birthday.opening.eyebrow}</div>
          <h1 className="intro-title" id="intro-title" data-testid="text-opening-title">{birthday.opening.title}</h1>
          <p className="intro-copy" data-testid="text-opening-copy">{birthday.opening.copy}</p>
          {!opened && (
            <button type="button" className="envelope-trigger" onClick={openLetter} disabled={opening} aria-label={birthday.opening.button} data-testid="button-open-envelope">
              <span className="envelope-wrap" aria-hidden="true"><span className="envelope-letter" /><span className="envelope" /></span>
            </button>
          )}
          {!opened && !opening && <button type="button" className="open-button" onClick={openLetter} data-testid="button-open-letter"><Sparkles size={16} aria-hidden="true" />{birthday.opening.button}</button>}
          {opening && <p className="eyebrow" aria-live="polite" data-testid="status-opening">{birthday.opening.wait}</p>}
          {!opened && !opening && <button type="button" className="skip-button" onClick={showStory} data-testid="button-skip-opening">{birthday.opening.skip}</button>}
          {opened && <a className="skip-button" href="#birthday-greeting" data-testid="link-continue-story">{birthday.opening.button}<ArrowDown size={12} aria-hidden="true" /></a>}
        </motion.div>
      </section>

      <AnimatePresence>
        {opened && (
          <motion.div key="story" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
            <section id="birthday-greeting" className="section birthday" aria-labelledby="birthday-title">
              <div className="section-inner birthday-layout">
                <div>
                  <div className="section-kicker" data-testid="text-greeting-kicker">{birthday.greeting.kicker}</div>
                  <h2 className="section-title" id="birthday-title" data-testid="text-birthday-title">{birthday.greeting.title}{greetingName}</h2>
                  <p className="birthday-copy" data-testid="text-birthday-message">{birthday.greeting.copy}</p>
                <a className="surprise-button" href="#letter-title" data-testid="link-more-birthday-story">{birthday.greeting.moreButton}<ArrowDown size={15} aria-hidden="true" /></a>
                </div>
                <div className="birthday-mark" role="img" aria-label={birthday.greeting.emblem.replace('\n', ' ')} data-testid="art-birthday-emblem"><span>{birthday.greeting.emblem}</span></div>
              </div>
            </section>

            <section className="section letter-section" aria-labelledby="letter-title">
              <div className="section-inner">
                <div className="section-kicker" data-testid="text-letter-kicker">{birthday.letter.kicker}</div>
                <h2 className="section-title" id="letter-title" data-testid="text-letter-title">{birthday.letter.title}</h2>
                <article className="letter-paper">
                  <AnimatePresence mode="wait" initial={false}>
                    {!letterRevealed ? (
                      <motion.div key="letter-prompt" className="letter-prompt" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }}>
                        <p>{birthday.letter.prompt}</p>
                        <button type="button" className="surprise-button" onClick={() => setLetterRevealed(true)} data-testid="button-read-letter">{birthday.letter.readButton}<ArrowDown size={15} aria-hidden="true" /></button>
                      </motion.div>
                    ) : (
                      <motion.div key="letter-reveal" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease }}>
                        <div className="letter-content" data-testid="text-heartfelt-letter">{birthday.letter.body}</div>
                        <div className="letter-signoff">{sender ? <>{birthday.letter.signoff}<br />{sender}</> : birthday.letter.defaultSignoff}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </div>
            </section>

            {birthday.showReasons && (
              <section className="section reasons-section" aria-labelledby="reasons-title">
                <div className="section-inner">
                  <div className="section-kicker" data-testid="text-reasons-kicker">{birthday.reasons.kicker}</div>
                  <h2 className="section-title" id="reasons-title" data-testid="text-reasons-title">{birthday.reasons.title}</h2>
                  <p className="reason-intro" data-testid="text-reasons-intro">{birthday.reasons.intro}</p>
                  <div className="reasons-grid">
                    {birthday.reasons.cards.map((reason, index) => (
                      <button type="button" className="reason-card" key={reason.title} onClick={() => setOverlay({ kind: 'reason', index })} aria-haspopup="dialog" data-testid={`button-reason-${index + 1}`}>
                        <span className="reason-number">{String(index + 1).padStart(2, '0')}</span>
                        <h3>{reason.title}</h3>
                        <p>{reason.short}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {birthday.showMemories && (
              <section className="section memory-section" aria-labelledby="memories-title">
                <div className="section-inner">
                  <div className="memory-heading">
                    <div>
                      <div className="section-kicker" data-testid="text-memories-kicker">{birthday.memories.kicker}</div>
                      <h2 className="section-title" id="memories-title" data-testid="text-memories-title">{birthday.memories.title}</h2>
                    </div>
                    <p className="memory-note" data-testid="text-memory-instructions">{birthday.memories.note}</p>
                  </div>
                  <div className="memory-grid">
                    {birthday.memories.slots.map((memory, index) => (
                      <button type="button" className="memory-card" key={`${memory.caption}-${index}`} onClick={() => setOverlay({ kind: 'memory', index })} aria-label={`${birthday.memories.lightboxHint}: ${memory.caption}`} aria-haspopup="dialog" data-testid={`button-memory-${index + 1}`}>
                        <span className="photo-slot">
                          {memory.src && !failedPhotos.has(index) ? <img src={publicAsset(memory.src)} alt={memory.alt || memory.caption} onError={() => setFailedPhotos((current) => new Set(current).add(index))} /> : <><Camera size={22} strokeWidth={1.25} aria-hidden="true" /><span>{birthday.memories.placeholder}</span></>}
                        </span>
                        <span className="memory-caption" data-testid={`text-memory-caption-${index + 1}`}>{memory.caption}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {birthday.showUniverse && (
              <section className="section universe-section" aria-labelledby="universe-title">
                <div className="section-inner universe-inner">
                  <div className="section-kicker" data-testid="text-universe-kicker">{birthday.universe.kicker}</div>
                  <h2 className="section-title" id="universe-title" data-testid="text-universe-title">{birthday.universe.title}</h2>
                  <p className="universe-copy" data-testid="text-universe-copy">{birthday.universe.copy}</p>
                  <div className="star-field" role="group" aria-label={birthday.universe.tapHint}>
                    {birthday.universe.messages.map((message, index) => (
                      <button type="button" key={message} className={`star-button ${litStar === index ? 'is-lit' : ''}`} onClick={() => setLitStar(index)} aria-label={`${birthday.universe.tapHint} ${index + 1}`} aria-pressed={litStar === index} data-testid={`button-wish-star-${index + 1}`}><Star size={20} fill={litStar === index ? 'currentColor' : 'none'} strokeWidth={1.4} aria-hidden="true" /></button>
                    ))}
                  </div>
                  <p className="star-message" aria-live="polite" data-testid="text-star-wish">{litStar === null ? birthday.universe.tapHint : birthday.universe.messages[litStar]}</p>
                </div>
              </section>
            )}

            {birthday.showFinalSurprise && (
              <section className="section final-section" aria-labelledby="final-title">
                <div className="section-inner">
                  <div className="section-kicker" data-testid="text-final-kicker">{birthday.finalSurprise.kicker}</div>
                  <h2 className="section-title" id="final-title" data-testid="text-final-title">{birthday.finalSurprise.title}</h2>
                  <p className="final-copy" data-testid="text-final-copy">{birthday.finalSurprise.copy}</p>
                  <button type="button" className="surprise-button" onClick={startCelebration} data-testid="button-open-surprise" aria-haspopup="dialog"><Sparkles size={16} aria-hidden="true" />{birthday.finalSurprise.button}</button>
                </div>
              </section>
            )}

            <footer className="closing" data-testid="section-closing">
              <h2 className="closing-title" data-testid="text-closing-title">{birthday.closing.title}{greetingName}</h2>
              <p data-testid="text-closing-copy">{birthday.closing.copy}</p>
              <div className="footer-mark"><span aria-hidden="true">✦</span><span data-testid="text-closing-signature">{birthday.closing.footer}</span><span aria-hidden="true">✦</span></div>
              <a className="back-to-top" href="#top" data-testid="link-back-to-beginning">{birthday.closing.backLink}<ArrowDown size={13} aria-hidden="true" /></a>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay && (
          <motion.div className="overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setOverlay(null); }}>
            <motion.section ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" initial={reducedMotion ? false : { opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: .28 }} data-testid={`dialog-${overlay.kind}`}>
              <button type="button" className="dialog-close" onClick={() => setOverlay(null)} aria-label={birthday.controls.close} data-testid="button-close-dialog"><X size={19} aria-hidden="true" /></button>
              {overlay.kind === 'reason' && (
                <>
                  <div className="eyebrow" data-testid="text-reason-number">A small reason, {String(overlay.index + 1).padStart(2, '0')}</div>
                  <h2 className="dialog-title" id="dialog-title" data-testid="text-reason-dialog-title">{birthday.reasons.cards[overlay.index].title}</h2>
                  <p className="dialog-copy" data-testid="text-reason-detail">{birthday.reasons.cards[overlay.index].detail}</p>
                </>
              )}
              {overlay.kind === 'memory' && (
                <>
                  <div className="eyebrow">{birthday.memories.lightboxHint} {String(overlay.index + 1).padStart(2, '0')}</div>
                  <h2 className="dialog-title" id="dialog-title" data-testid="text-lightbox-title">{birthday.memories.slots[overlay.index].caption}</h2>
                  <div className="lightbox-image" data-testid="lightbox-image">
                    {birthday.memories.slots[overlay.index].src && !failedPhotos.has(overlay.index) ? <img src={publicAsset(birthday.memories.slots[overlay.index].src)} alt={birthday.memories.slots[overlay.index].alt || birthday.memories.slots[overlay.index].caption} onError={() => setFailedPhotos((current) => new Set(current).add(overlay.index))} /> : <Camera size={32} strokeWidth={1.2} aria-label={birthday.memories.placeholder} />}
                  </div>
                  <p className="dialog-copy" data-testid="text-lightbox-placeholder">{birthday.memories.slots[overlay.index].src ? birthday.memories.slots[overlay.index].alt : birthday.memories.placeholder}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                    <button type="button" className="surprise-button" onClick={() => moveMemory(-1)} aria-label={birthday.controls.previous} data-testid="button-previous-memory"><ArrowLeft size={16} aria-hidden="true" />{birthday.controls.previous}</button>
                    <button type="button" className="surprise-button" onClick={() => moveMemory(1)} aria-label={birthday.controls.next} data-testid="button-next-memory">{birthday.controls.next}<ArrowRight size={16} aria-hidden="true" /></button>
                  </div>
                </>
              )}
              {overlay.kind === 'surprise' && (
                <>
                  <div className="eyebrow">{birthday.finalSurprise.kicker}</div>
                  <div style={{ color: '#b27877', margin: '15px 0' }}><Sparkles size={27} strokeWidth={1.3} aria-hidden="true" /></div>
                  <h2 className="dialog-title" id="dialog-title" data-testid="text-surprise-dialog-title">{birthday.finalSurprise.dialogTitle}</h2>
                  <p className="dialog-copy" data-testid="text-surprise-dialog-copy">{birthday.finalSurprise.dialogCopy}</p>
                  <button type="button" className="surprise-button" style={{ marginTop: 22 }} onClick={() => setOverlay(null)} data-testid="button-keep-wish">{birthday.finalSurprise.close}</button>
                </>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      {celebrate && (
        <div className="confetti" aria-hidden="true" data-testid="effect-confetti">
          {confetti.map((piece) => <i key={piece.id} style={{ '--x': piece.x, '--size': piece.size, '--color': piece.color, '--duration': piece.duration, '--delay': piece.delay, '--drift': piece.drift, '--turn': piece.turn, '--shape': piece.shape } as CSSProperties} />)}
        </div>
      )}
      <span className="sr-only" data-testid="status-music" aria-live="polite">{audioUnavailable ? birthday.controls.unavailable : playing ? birthday.controls.pause : birthday.controls.play}</span>
    </main>
  );
}

export default App;
