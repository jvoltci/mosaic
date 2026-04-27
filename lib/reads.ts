// Hand-curated reading list for /reads.
// Last sweep: 2026-04. When you re-curate, update LAST_SWEEP and re-check
// every href — link-rot is the failure mode here.
//
// Bias: 30 high-confidence picks over 50 mediocre ones. Each entry's `note`
// should answer "why this one and not the dozen others on the same topic?"
// in one sentence. Confident, specific, opinionated.

export const LAST_SWEEP = '2026-04'

export type ReadSection =
  | 'pioneers'
  | 'scaling'
  | 'safety'
  | 'skeptics'
  | 'field'
  | 'adjacent'

export type ReadKind = 'paper' | 'blog' | 'video' | 'book' | 'docs'

export type ReadEntry = {
  section: ReadSection
  kind: ReadKind
  author: string
  year: string
  href: string
  title: string
  note: string
}

export const SECTION_ORDER: ReadSection[] = [
  'pioneers',
  'scaling',
  'safety',
  'skeptics',
  'field',
  'adjacent',
]

export const SECTION_TITLES: Record<ReadSection, string> = {
  pioneers: 'Pioneers',
  scaling: 'The bitter lesson + scaling canon',
  safety: 'AGI, alignment, safety',
  skeptics: 'The skeptical cases',
  field: 'Field essays — what’s happening now',
  adjacent: 'Adjacent canon',
}

export const SECTION_INTROS: Record<ReadSection, string> = {
  pioneers:
    'The arguments that started everything. Most contemporary AI discourse is downstream of these — knowing the original framing is worth a few evenings.',
  scaling:
    'The empirical case that compute, data, and the right loss function is the dominant story of the last decade. Read these in order.',
  safety:
    'What could go wrong, and why people who have thought about it for twenty years are worried. Disagree with the conclusions if you like; the arguments are sharp.',
  skeptics:
    'The dissents that hold up. If you read only the optimist canon you will be blindsided when something breaks.',
  field:
    'Where to follow what is happening now. The frontier moves quarterly; these are the writers who track it well.',
  adjacent:
    'Not about AI specifically, but the engineering and research wisdom the AI canon is built on top of.',
}

export const KIND_LABEL: Record<ReadKind, string> = {
  paper: 'Paper',
  blog: 'Blog',
  video: 'Video',
  book: 'Book',
  docs: 'Docs',
}

export const READS: ReadEntry[] = [
  // ===== Pioneers =====
  {
    section: 'pioneers',
    kind: 'paper',
    author: 'Alan Turing',
    year: '1950',
    href: 'https://academic.oup.com/mind/article/LIX/236/433/986238',
    title: 'Computing Machinery and Intelligence',
    note: 'The paper that named the imitation game. Skip the section on ESP — read for the structure of his replies to objections, which is still the template every "can machines think" debate uses today.',
  },
  {
    section: 'pioneers',
    kind: 'paper',
    author: 'Marvin Minsky',
    year: '1961',
    href: 'https://courses.csail.mit.edu/6.803/pdf/steps.pdf',
    title: 'Steps Toward Artificial Intelligence',
    note: 'A field map drawn before the field existed: search, pattern recognition, learning, planning, induction. Most of the categories survived; the methods didn’t.',
  },
  {
    section: 'pioneers',
    kind: 'paper',
    author: 'McCarthy & Hayes',
    year: '1969',
    href: 'http://jmc.stanford.edu/articles/mcchay69.html',
    title: 'Some Philosophical Problems from the Standpoint of AI',
    note: 'Where the frame problem and situation calculus come from. The technical machinery is dated; the taxonomy of "what does an agent need to know about the world" is not.',
  },
  {
    section: 'pioneers',
    kind: 'book',
    author: 'Douglas Hofstadter',
    year: '1979',
    href: 'https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach',
    title: 'Gödel, Escher, Bach: An Eternal Golden Braid',
    note: 'Seven hundred pages on self-reference, levels of description, and what symbols mean — disguised as dialogues with a tortoise. Either you bounce off it in fifty pages or it permanently rewires how you think about cognition.',
  },

  // ===== Bitter lesson + scaling canon =====
  {
    section: 'scaling',
    kind: 'blog',
    author: 'Rich Sutton',
    year: '2019',
    href: 'http://www.incompleteideas.net/IncIdeas/BitterLesson.html',
    title: 'The Bitter Lesson',
    note: '~1200 words that named the pattern: every time you bake human-domain knowledge into an AI system, more compute eventually wins anyway. Read once a year.',
  },
  {
    section: 'scaling',
    kind: 'paper',
    author: 'Kaplan et al. (OpenAI)',
    year: '2020',
    href: 'https://arxiv.org/abs/2001.08361',
    title: 'Scaling Laws for Neural Language Models',
    note: 'The paper that turned "bigger is better" from vibes into a power-law fit. Superseded in detail by Chinchilla, but historically this is where the scaling-pilled era starts.',
  },
  {
    section: 'scaling',
    kind: 'paper',
    author: 'Hoffmann et al. (DeepMind)',
    year: '2022',
    href: 'https://arxiv.org/abs/2203.15556',
    title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
    note: 'Corrected Kaplan: for a given compute budget you want roughly equal scaling of params and tokens, not param-heavy. Reshaped every frontier training run after 2022.',
  },
  {
    section: 'scaling',
    kind: 'paper',
    author: 'Wei et al. (Google)',
    year: '2022',
    href: 'https://arxiv.org/abs/2206.07682',
    title: 'Emergent Abilities of Large Language Models',
    note: 'Famously argued that some capabilities appear sharply at scale. Pair with Schaeffer et al. 2023 ("Are Emergent Abilities a Mirage?") which shows much of it is metric-choice — together they’re the cleanest version of this debate.',
  },
  {
    section: 'scaling',
    kind: 'video',
    author: 'Andrej Karpathy',
    year: '2023',
    href: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    title: 'Intro to Large Language Models (1-hour talk)',
    note: 'The clearest one-hour overview of how LLMs actually work — pretraining, finetuning, RLHF, the OS analogy. If you have one resource to give a smart non-specialist, this is it.',
  },
  {
    section: 'scaling',
    kind: 'paper',
    author: 'OpenAI',
    year: '2023',
    href: 'https://arxiv.org/abs/2303.08774',
    title: 'GPT-4 Technical Report',
    note: 'Read for the eval table on page 5 and the "predictable scaling" section. The capability claims have been overtaken by 4o and beyond; the framing of model cards as primary literature has not.',
  },

  // ===== AGI, alignment, safety =====
  {
    section: 'safety',
    kind: 'book',
    author: 'Nick Bostrom',
    year: '2014',
    href: 'https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies',
    title: 'Superintelligence: Paths, Dangers, Strategies',
    note: 'The argument is twelve years old now and some scenarios date badly, but chapters 6–8 are still the cleanest framing of instrumental convergence and the orthogonality thesis.',
  },
  {
    section: 'safety',
    kind: 'book',
    author: 'Stuart Russell',
    year: '2019',
    href: 'https://en.wikipedia.org/wiki/Human_Compatible',
    title: 'Human Compatible: AI and the Problem of Control',
    note: 'The most measured book in the safety canon. Russell’s reframing — build systems that are *uncertain* about human preferences — has aged better than the "specify the right utility function" framing it replaced.',
  },
  {
    section: 'safety',
    kind: 'blog',
    author: 'Paul Christiano',
    year: '2019',
    href: 'https://www.alignmentforum.org/posts/HBxe6wdjxK239zajf/what-failure-looks-like',
    title: 'What failure looks like',
    note: 'The boring-dystopia framing: alignment failure doesn’t look like Skynet, it looks like proxy metrics drifting and humans losing the thread. The most-cited single post on the Alignment Forum for a reason.',
  },
  {
    section: 'safety',
    kind: 'blog',
    author: 'Anthropic',
    year: '2023',
    href: 'https://www.anthropic.com/news/core-views-on-ai-safety',
    title: 'Core Views on AI Safety',
    note: 'A frontier lab’s actual stated position, in plain prose. Read alongside OpenAI’s and DeepMind’s safety pages to triangulate where the field disagrees — usually on timelines, rarely on the shape of the problem.',
  },
  {
    section: 'safety',
    kind: 'paper',
    author: 'Hendrycks, Mazeika, Woodside',
    year: '2023',
    href: 'https://arxiv.org/abs/2306.12001',
    title: 'An Overview of Catastrophic AI Risks',
    note: 'The most readable taxonomy of failure modes — malicious use, AI race, organizational risks, rogue AIs. If you only read one safety paper, this is the one with the highest information-per-page.',
  },
  {
    section: 'safety',
    kind: 'blog',
    author: 'Eliezer Yudkowsky',
    year: '2006–',
    href: 'https://www.readthesequences.com/',
    title: 'The Sequences (curated)',
    note: 'The body of writing that built the rationalist-adjacent AI-risk position. Read selectively — start with "A Human’s Guide to Words" and "Mysterious Answers to Mysterious Questions" — the full corpus is a thousand pages and you don’t need all of it.',
  },

  // ===== The skeptical cases =====
  {
    section: 'skeptics',
    kind: 'blog',
    author: 'Gary Marcus',
    year: '2022',
    href: 'https://nautil.us/deep-learning-is-hitting-a-wall-238440/',
    title: 'Deep Learning Is Hitting a Wall',
    note: 'The skeptic’s case worth taking seriously. Marcus has lost on timelines and on "scaling won’t work," but his point about brittleness on truly out-of-distribution inputs holds in 2026.',
  },
  {
    section: 'skeptics',
    kind: 'paper',
    author: 'François Chollet',
    year: '2019',
    href: 'https://arxiv.org/abs/1911.01547',
    title: 'On the Measure of Intelligence',
    note: 'The most rigorous attempt to define what we should be measuring. ARC falls out of this paper as the natural test — and frontier models still struggle on the held-out set, which is the point.',
  },
  {
    section: 'skeptics',
    kind: 'docs',
    author: 'ARC Prize (Chollet, Knoop)',
    year: '2024–',
    href: 'https://arcprize.org/',
    title: 'ARC-AGI',
    note: 'The benchmark that won’t die. Frontier-model scores went from ~5% (2020) to ~85% (late 2024) — but only after explicit per-task adaptation, which is the part the dashboard hides. Read the leaderboard *and* the rules.',
  },
  {
    section: 'skeptics',
    kind: 'book',
    author: 'Melanie Mitchell',
    year: '2019',
    href: 'https://melaniemitchell.me/aibook/',
    title: 'Artificial Intelligence: A Guide for Thinking Humans',
    note: 'The clearest non-technical history of why each previous AI boom over-promised, and what specifically is different (and what isn’t) this time. Better written than most of the optimist canon.',
  },
  {
    section: 'skeptics',
    kind: 'blog',
    author: 'Rodney Brooks',
    year: '2017',
    href: 'https://rodneybrooks.com/the-seven-deadly-sins-of-ai-predictions/',
    title: 'The Seven Deadly Sins of AI Predictions',
    note: 'Read for sin #1 (Amara’s Law — overestimating short term, underestimating long term) and sin #4 (suitcase words). Useful priors before you read any AI forecast — including this list.',
  },

  // ===== Field essays =====
  {
    section: 'field',
    kind: 'blog',
    author: 'Lilian Weng',
    year: '2017–',
    href: 'https://lilianweng.github.io/',
    title: 'Lil’Log',
    note: 'The best technical-survey blog in the field. Each post is the explainer you wish someone had written before you read the papers. Start with her posts on attention, RLHF, and agentic LLMs.',
  },
  {
    section: 'field',
    kind: 'blog',
    author: 'Simon Willison',
    year: '2002–',
    href: 'https://simonwillison.net/tags/llms/',
    title: 'Simon Willison’s Weblog (LLMs tag)',
    note: 'The single best running journal of "what new LLM capability shipped this week and what it actually does." Light on theory, heavy on hands-on. The LLMs tag filters the rest of his (still excellent) Django-and-Datasette content.',
  },
  {
    section: 'field',
    kind: 'blog',
    author: 'Sebastian Raschka',
    year: '2022–',
    href: 'https://magazine.sebastianraschka.com/',
    title: 'Ahead of AI',
    note: 'The monthly "what mattered in research this month" digest, with code-level depth. Pairs well with Weng — Raschka is broader and more frequent, Weng is deeper and slower.',
  },
  {
    section: 'field',
    kind: 'blog',
    author: 'Hazy Research (Stanford)',
    year: '2020–',
    href: 'https://hazyresearch.stanford.edu/blog',
    title: 'Hazy Research',
    note: 'Tri Dao and the FlashAttention crowd. If you want to understand why a kernel is fast, this is where the explanations are written by the people who wrote the kernel.',
  },
  {
    section: 'field',
    kind: 'blog',
    author: 'Distill',
    year: '2016–2021',
    href: 'https://distill.pub/',
    title: 'Distill (archive)',
    note: 'Dormant since 2021 but the archive is the gold standard for visual ML explanations — "Building Blocks of Interpretability," "Feature Visualization," "A Visual Exploration of Gaussian Processes." Read these instead of the equivalent papers.',
  },
  {
    section: 'field',
    kind: 'blog',
    author: 'Dwarkesh Patel',
    year: '2022–',
    href: 'https://www.dwarkeshpatel.com/',
    title: 'Dwarkesh Podcast (transcripts)',
    note: 'The interview show that got Karpathy, Sutskever, Dario Amodei, and Demis Hassabis to talk for three hours each. Read the transcripts — they’re primary sources for what frontier-lab leaders actually believe.',
  },

  // ===== Adjacent canon =====
  {
    section: 'adjacent',
    kind: 'book',
    author: 'Fred Brooks',
    year: '1975',
    href: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
    title: 'The Mythical Man-Month',
    note: 'Fifty years old and still the most-cited book on why software projects miss schedules. The chapter on the second-system effect predicts most ML-platform rewrites you will witness.',
  },
  {
    section: 'adjacent',
    kind: 'paper',
    author: 'Newell & Simon',
    year: '1976',
    href: 'https://dl.acm.org/doi/10.1145/360018.360022',
    title: 'Computer Science as Empirical Inquiry: Symbols and Search',
    note: 'The Turing-Award lecture that argued AI is an empirical science with falsifiable hypotheses — Physical Symbol System and Heuristic Search. The symbol-system camp lost the deep-learning era; the methodological argument they made still stands.',
  },
  {
    section: 'adjacent',
    kind: 'blog',
    author: 'Richard Hamming',
    year: '1986',
    href: 'https://www.cs.virginia.edu/~robins/YouAndYourResearch.html',
    title: 'You and Your Research',
    note: 'A talk by a Bell Labs mathematician on what separates people who do important work from people who don’t. The "what are the important problems in your field, and why aren’t you working on them?" question is the highest-leverage thing in this whole list.',
  },
]
