export const birthday = {
  recipientName: '',
  senderName: '',
  showMusicControl: true,
  showReasons: true,
  showMemories: true,
  showUniverse: true,
  showFinalSurprise: true,
  audioSrc: '/audio/our-song.mp3',
  opening: {
    eyebrow: 'A little something, just for you',
    title: 'A day made\nfor you.',
    copy: 'There is no hurry. Take a breath, and let this little world unfold.',
    button: 'Open your letter',
    skip: 'Skip the opening',
    wait: 'One little moment…',
  },
  greeting: {
    kicker: 'Today, the whole sky is yours',
    title: 'Happy birthday',
    moreButton: "There's more for you",
    copy: 'I hope today feels a little like being wrapped in all the good things you give to everyone around you. You deserve the soft mornings, the loud laughter, the tiny surprises, and every beautiful thing still finding its way to you.',
    emblem: 'my favorite\nperson',
  },
  letter: {
    kicker: 'A note from my heart',
    title: 'If I could give you anything…',
    prompt: 'A few words, written just for you.',
    readButton: 'Read my letter',
    defaultSignoff: 'With all my love.',
    body: `I would give you a way to see yourself the way I see you.

The way you make ordinary afternoons feel worth remembering. The way your kindness never asks to be noticed, and somehow changes the whole room anyway. The way you make me feel more like myself just by being near.

Thank you for every conversation that ran past bedtime, every small kindness you probably forgot, and all the joy you bring into my life without even trying.

I hope this next trip around the sun is gentle with you. I hope it surprises you. And I hope you never have to wonder how deeply you are loved.`,
    signoff: 'Always,',
  },
  reasons: {
    kicker: 'A few of a thousand',
    title: 'Little things I love about you',
    intro: 'Tap one. I could keep going for a long, long time.',
    cards: [
      { title: 'Your laugh', short: 'The kind that makes me laugh too.', detail: 'It starts in your eyes and then the whole world feels lighter. I would recognize it anywhere, and I hope I get to hear it a thousand more times.' },
      { title: 'How you notice', short: 'You see the small things.', detail: 'You remember what matters to people. You make room for the quiet ones. Your attention is one of the most generous things I know.' },
      { title: 'Your brave heart', short: 'Softness is its own kind of courage.', detail: 'You keep choosing tenderness, even when life gives you reasons not to. I admire that more than I know how to say.' },
      { title: 'Your curious mind', short: 'There is always something new to wonder about.', detail: 'I love the way a question can lead you somewhere unexpected. Being beside you makes the world feel bigger.' },
      { title: 'The way you care', short: 'Your love lives in the details.', detail: 'A check-in. A remembered favorite. The way you show up. You make people feel held, and I hope you feel held too.' },
      { title: 'Simply you', short: 'No reason needed, really.', detail: 'Not for what you do or what you give. Just you, exactly as you are. That has always been more than enough.' },
    ],
  },
  memories: {
    kicker: 'Pages from our story',
    title: 'Moments I keep close',
    note: 'These frames are waiting for your photographs. Add your own memories in the photos folder to make this page yours.',
    slots: [
      { src: '', alt: '', caption: 'That day we forgot the time' },
      { src: '', alt: '', caption: 'A little detour, a lot of joy' },
      { src: '', alt: '', caption: 'One of my favorite ordinary days' },
      { src: '', alt: '', caption: 'The view was lovely. You were lovelier.' },
      { src: '', alt: '', caption: 'Still laughing about this' },
      { src: '', alt: '', caption: 'More days like this, please' },
    ],
    placeholder: 'Your photo goes here',
    lightboxHint: 'Memory',
  },
  universe: {
    kicker: 'A wish for your next year',
    title: 'The universe got lucky.',
    copy: 'Tap a little star. Make a wish, or let it make one for you.',
    messages: [
      'May you find joy in the places you least expect.',
      'May the right doors open at just the right time.',
      'May you feel loved on the days you forget.',
      'May wonder keep finding its way back to you.',
      'May this year bring more of what feels like home.',
      'May your heart have room for every good thing.',
    ],
    tapHint: 'Choose a star',
  },
  finalSurprise: {
    kicker: 'One more thing',
    title: 'There is a wish with your name on it.',
    copy: 'Make a wish before you open this. It is yours to keep, and no one else needs to know.',
    button: 'Open your birthday wish',
    dialogTitle: 'For your year ahead',
    dialogCopy: 'May this new year of your life be full of small delights, safe places, and people who remind you how wonderful you are. May you make something beautiful of it, in your own time and in your own way.',
    close: 'Keep this close',
  },
  closing: {
    title: 'Happy birthday',
    copy: 'May this new chapter of your life be as beautiful as the happiness you bring into mine.',
    footer: 'Made with all my love',
    backLink: 'Back to the beginning',
  },
  controls: {
    play: 'Play our song',
    pause: 'Pause our song',
    unavailable: 'Add a song in public/audio',
    close: 'Close dialog',
    previous: 'Previous memory',
    next: 'Next memory',
  },
};

export const recipient = birthday.recipientName.trim();
export const sender = birthday.senderName.trim();
export const greetingName = recipient ? `, ${recipient}` : ', My Love';
