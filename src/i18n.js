import { additionalTranslations } from './i18n-part2.js';
import { buildRuntimeTranslations, getRuntimeLocaleMeta } from './landing-copy-adapter.js';

// Multi-language support for Soundwise landing page
// Based on alternateLanguages.ts from the main app

const baseTranslations = {
  en: {
    name: 'English',
    flag: '🇬🇧 🇺🇸',
    
    // Navigation
    navCta: 'Start Training',
    
  // Hero Section
    heroBadge: 'Science-Backed Ear Training',
  heroTitle: 'Finally Understand Fast, Natural English — Without Guessing',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
  heroSubtitle: 'Stop confusing similar sounds. Soundwise retrains your brain to hear English clearly through short, focused listening drills with real accents and real words. No microphone needed — just listen and hear the difference.',
    availableOn: 'Available on iOS and Android',
    languageSelectorLabel: 'I speak:',
    languagePlaceholder: 'Select your native language',
    nativeLangJapanese: 'Japanese',
    nativeLangMandarin: 'Mandarin Chinese',
    nativeLangThai: 'Thai',
    nativeLangSpanish: 'Spanish',
    nativeLangKorean: 'Korean',
    nativeLangArabic: 'Arabic',
    nativeLangVietnamese: 'Vietnamese',
    nativeLangOther: 'Other',
    pairIntro: 'Common challenge for you:',
    pairChallenge: 'Can you hear the difference?',
    ctaPrimary: 'Train Your Ears Now',
    ctaSecondary: 'See How It Works',
    
    // Social Proof
    stat1Number: '50K+',
    stat1Label: 'Active Learners',
    stat2Number: '15 min',
    stat2Label: 'Daily Sessions',
    stat3Number: '120+',
    stat3Label: 'Countries',
    
    // Problem Section
    problemTitle: 'It\'s Not Your Fault You Can\'t Hear These Sounds',
    problemSubtitle: 'Your brain wasn\'t trained to distinguish sounds that don\'t exist in your native language. That\'s why you keep asking "Sorry, can you repeat that?"',
    problemJapanese: 'Japanese Speakers',
    problemMandarin: 'Mandarin Speakers',
    problemThai: 'Thai Speakers',
    problemSpanish: 'Spanish Speakers',
    insightTitle: 'The Real Problem',
    insightText: 'These errors persist not because you\'re not trying — but because your ear never learned to tell those sounds apart. You can\'t pronounce what you can\'t hear. And you can\'t understand conversations when key sounds blur together.',
    
  // Solution Section
    solutionBadge: 'The Solution',
  solutionTitle: 'English Isn\'t One Voice. Your Training Shouldn\'t Be Either.',
  solutionDescription: 'Soundwise exposes you to real-world English the way you\'ll actually hear it — American, British, Australian, Irish, and South African accents, male and female voices, different speaking styles. Every word is spoken by rotating high-quality voices so your ears learn to adapt, not memorize. That means fewer surprises in real conversations.',
    feature1: 'Multiple real accents - American, British, Australian & more',
    feature2: 'Only real English words - No invented or meaningless practice words',
    feature3: 'Sounds in all positions - Beginning, middle, and end of words',
    feature4: 'Customized to your language - Targets the exact contrasts that confuse you',
    feature5: 'No microphone needed - Just listen with headphones anywhere',
    
    // How It Works
    howItWorksTitle: 'Pure Listening Training',
    howItWorksSubtitle: 'No grammar lectures. No complicated explanations. Just three steps.',
    step1Title: 'Hear a Word',
    step1Text: 'Listen to a real English word spoken by one of many native voices',
    step2Title: 'Choose What You Heard',
    step2Text: 'Select from a minimal pair (e.g., "ship" or "sheep") — one sound makes all the difference',
    step3Title: 'Get Instant Feedback',
    step3Text: 'See the correct word, the exact sound that differed, and IPA notation. No vague "Wrong" — you understand what you misheard and why.',
    
    // Progress Tracking
    progressBadge: 'Adaptive Difficulty',
    progressTitle: 'You\'re Never Bored or Overwhelmed',
    progressDescription: 'You don\'t start at full speed. New learners begin below natural speed to build accuracy first. As you improve, speech gradually increases — even faster than natural speed. Mistakes automatically adjust difficulty. The system keeps you in the ideal challenge zone.',
    progressFeature1: 'You earn speed - Speech pace increases as your accuracy improves',
    progressFeature2: 'Smart placement test - Skip sounds you\'ve already mastered',
    progressFeature3: 'Focused 15-minute sessions - Short, effective daily practice',
    progressFeature4: 'Measurable progress - See exactly how much real ear training you\'ve completed',
    timePracticed: 'Time practiced:',
    minutes: 'minutes',
    
    // Science Section
    scienceBadge: 'Research-Backed Method',
    scienceTitle: 'Built on Phonemic Perception Science',
    scienceCard1Title: 'The Research',
    scienceCard1Text: 'Based on findings from Patricia Kuhl\'s infant language development studies (University of Washington) and McClelland, Fiez, and McCandliss (2002) on teaching phonemic discrimination to adults. These studies show that early exposure shapes which sound distinctions are perceived as meaningful.',
    scienceCard2Title: 'Why It Works',
    scienceCard2Text: 'Your brain is neuroplastic - it can be retrained. Japanese adults improved from 50% to 70-80% accuracy distinguishing /r/ and /l/ with immediate visual feedback. Repeated minimal pair practice creates new neural pathways for sound discrimination.',
    scienceCard3Title: 'Proven Results',
    scienceCard3Text: 'After just three 20-minute sessions, brain scans revealed new activation patterns showing perceptual maps had been rewired. Consistent practice produces measurable, permanent improvements in perception accuracy.',
    
    // Testimonials
    testimonialsTitle: 'Learners Around the World Are Hearing the Difference',
    testimonial1: 'For 5 years I couldn\'t tell \'right\' from \'light\'. After 3 weeks with this app, I can finally hear it! This changed everything.',
    testimonial1Author: 'Yuki M.',
    testimonial1Location: 'Tokyo, Japan',
    testimonial2: 'I was so embarrassed ordering \'thin crust pizza\' and getting confused looks. Now I can actually hear the difference between th and s sounds!',
    testimonial2Author: 'Wei L.',
    testimonial2Location: 'Beijing, China',
    testimonial3: 'No other app focuses on LISTENING first. This is what every pronunciation learner needs. Simple but incredibly effective.',
    testimonial3Author: 'Carlos R.',
    testimonial3Location: 'Madrid, Spain',
    
    // Features
    featuresTitle: 'Everything You Need to Understand English Clearly',
    featureCard1Title: 'Built for Your Language',
    featureCard1Text: 'Focuses on the exact sound contrasts most likely to cause confusion for speakers of your native language',
    featureCard2Title: 'Real Voices, Real Accents',
    featureCard2Text: 'Multiple native speakers with American, British, Australian, Irish, and South African accents',
    featureCard3Title: 'Only Real Words',
    featureCard3Text: 'Every training item uses real English words that change only one sound at a time',
    featureCard4Title: 'Adaptive Difficulty',
    featureCard4Text: 'Starts slow, speeds up as you improve, and adjusts when you make mistakes',
    featureCard5Title: 'Smart & Short Sessions',
    featureCard5Text: '15 minutes daily is all you need. Auto-pauses if you lose focus.',
    featureCard6Title: 'Instant Clear Feedback',
    featureCard6Text: 'See the correct word, the exact sound difference, IPA transcription, and replay to compare',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faq1Question: 'Why don\'t I need a microphone?',
    faq1Answer: 'The core problem isn\'t your speaking - it\'s your perception. You can\'t pronounce sounds you can\'t hear. By training your ear first through listening exercises, speaking improvement follows naturally. No recording or speech analysis needed.',
    faq2Question: 'How long until I see results?',
    faq2Answer: 'Most learners notice improved perception within 2-3 weeks of daily practice (10-15 minutes). Your brain needs time to build new neural pathways for sound discrimination, but the changes are measurable and permanent.',
    faq3Question: 'Is this suitable for my native language?',
    faq3Answer: 'Yes! The app includes targeted minimal pairs for speakers of Japanese, Mandarin, Spanish, Thai, Korean, Arabic, Vietnamese, and many other languages. The exercises adapt to the specific phonemic challenges of your L1 background.',
    faq4Question: 'Can I use this alongside other learning methods?',
  faq4Answer: 'Absolutely! Soundwise is specialized ear training that makes all your other practice more effective. Once you can hear the differences, speaking practice and conversations become much more productive.',
    faq5Question: 'What if I\'m an advanced learner?',
    faq5Answer: 'Even advanced speakers have perception blind spots from their L1. The smart placement test identifies what you\'ve already mastered and focuses only on your remaining challenges.',
    
  // Final CTA
    ctaTitle: 'If You Can Hear It Clearly, You Can Use It Confidently.',
  ctaSubtitle: 'Conversations feel easier. You respond faster. You feel less anxious. You stop second-guessing. Get lifetime access for just $4.99.',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'Download on the',
    getItOn: 'Get it on',
    ctaFeature1: 'One-time payment',
    ctaFeature2: 'No subscription',
    ctaFeature3: 'Works on all devices',
    
  // Footer
  footerTagline: 'Train your ears. Understand English the first time.',
    footerProduct: 'Product',
    footerFeatures: 'Features',
    footerHowItWorks: 'How It Works',
    footerLegal: 'Legal & Support',
    footerFAQ: 'FAQ',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
  footerContact: 'Contact',
  footerCopyright: '© 2025 Soundwise. All rights reserved.',
  },
  
  '日本語': {
    name: '日本語',
    flag: '🇯🇵',
    navCta: '耳のトレーニングを始める',
    heroBadge: '科学的「英語耳」トレーニング',
    heroTitle: 'もう聞き返さない。英語が「一発で」聞き取れる耳へ。',
    heroHighlight1: '「Right」',
    heroHighlight2: '「Light」',
    heroSubtitle: 'Soundwiseは、科学的根拠に基づくリスニング訓練で、あなたの脳に眠る聴覚能力を呼び覚まします。本物のアクセント、本物の単語、あなたのレベルに合った適応型トレーニング。マイク不要 — 会議・面接・試験・日常会話がラクになります。',
    availableOn: 'iOS・Android対応 | 世界120ヶ国 | 5万人以上の学習者が効果を実感',
    languageSelectorLabel: '母国語:',
    languagePlaceholder: '母国語を選択',
    nativeLangJapanese: '日本語',
    nativeLangMandarin: '中国語（標準語）',
    nativeLangThai: 'タイ語',
    nativeLangSpanish: 'スペイン語',
    nativeLangKorean: '韓国語',
    nativeLangArabic: 'アラビア語',
    nativeLangVietnamese: 'ベトナム語',
    nativeLangOther: 'その他',
    pairIntro: 'よくある課題:',
    pairChallenge: '違いが聞き取れますか？',
    ctaPrimary: '耳のトレーニングを始める',
    ctaSecondary: '科学的根拠を詳しく見る',
    
    stat1Number: '5万+',
    stat1Label: 'アクティブ学習者',
    stat2Number: '15分',
    stat2Label: '毎日のセッション',
    stat3Number: '120+',
    stat3Label: 'ヶ国',
    
    problemTitle: '「聞き取れない」のは、あなたの努力不足ではありません',
    problemSubtitle: '脳が英語の音を「ノイズ」として処理しているだけです。だから何度も「Sorry?」と聞き返してしまう。',
    problemJapanese: '日本語話者',
    problemMandarin: '中国語話者',
    problemThai: 'タイ語話者',
    problemSpanish: 'スペイン語話者',
    insightTitle: '日本人が直面する本当の課題',
    insightText: '聞き取れない音は、正しく発音することもできません。L/R、B/V、TH音など、日本語に存在しない音の区別を脳が学んでいないのです。まずは「耳の解像度」を上げること — それが、会議で自信を持って話すための最も効率的な近道です。',
    
    solutionBadge: '解決策',
    solutionTitle: '英語は一つの声じゃない。だからトレーニングも一つの声で足りない。',
  solutionDescription: 'Soundwiseは、アメリカ・イギリス・オーストラリア・アイルランド・南アフリカなど、実際に聞くリアルな英語に触れさせます。すべての単語が複数の高品質な声で読み上げられるから、耳が「暗記」ではなく「適応」を学びます。実際の会話で驚くことが少なくなります。',
    feature1: '本物のアクセント多数 - 米・英・豪・アイルランド・南ア',
    feature2: '本物の英単語のみ - 作り物の練習用単語はゼロ',
    feature3: '語頭・語中・語末の音を訓練 - 実際の会話に活きる',
    feature4: '日本語話者のために設計 - L/R, B/V, TH音など特化',
    feature5: 'マイク不要 - 通勤中もどこでも練習可能',
    
    howItWorksTitle: '純粋なリスニングトレーニング',
    howItWorksSubtitle: '文法の講義も複雑な説明もなし。たった3ステップ。',
    step1Title: '単語を聞く',
    step1Text: '多様なネイティブ音声で、本物の英単語を聴きます',
    step2Title: '聞こえたものを選ぶ',
    step2Text: 'ミニマルペアから直感的に選択。迷うことが脳への刺激になります',
    step3Title: '即座にフィードバック',
    step3Text: '正しい単語、違いを生んだ正確な音、IPA表記が表示。曖昧な「不正解」はなく、何を聞き間違えたのか、なぜなのかがすぐにわかります。',
    
    progressBadge: '適応型難易度',
    progressTitle: '退屈もパニックもなし',
    progressDescription: '最初からフルスピードではありません。初心者はまず正確さを身につけるために遅いスピードから始めます。上達するにつれ、自然な速度まで上がり、さらに速いスピードへ。間違えると自動的に難易度が調整されます。成長できるちょうどいい難しさ。',
    progressFeature1: 'スピードは自分で「勝ち取る」 - 正確度に応じて速度が上がる',
    progressFeature2: 'スマートなレベル診断 - マスターした音はスキップ',
    progressFeature3: '集中した15分セッション - 短く効果的な毎日の練習',
    progressFeature4: '測定できる進歩 - 正確なトレーニング量を確認',
    timePracticed: '練習時間:',
    minutes: '分',
    
    scienceBadge: '研究に裏打ちされた方法',
    scienceTitle: '音素認識科学に基づく',
    scienceCard1Title: '研究',
    scienceCard1Text: 'Patricia Kuhlの乳児言語発達研究（ワシントン大学）とMcClelland、Fiez、McCandliss（2002）の成人への音素弁別訓練に関する研究に基づいています。これらの研究は、幼少期の経験が意味のある音の区別として認識されるものを形成することを示しています。',
    scienceCard2Title: '効果の理由',
    scienceCard2Text: '脳は可塑的です - 再訓練が可能です。日本人成人は即座の視覚フィードバックにより、/r/と/l/の識別が50%から70-80%の精度に向上しました。ミニマルペアの繰り返し練習が音の識別のための新しい神経経路を作り出します。',
    scienceCard3Title: '実証された結果',
    scienceCard3Text: 'わずか3回の20分セッション後、脳スキャンで新しい活性化パターンが現れ、知覚マップが再配線されたことが示されました。一貫した練習により、測定可能で永続的な認識精度の向上が得られます。',
    
    testimonialsTitle: '世界中の学習者が効果を実感',
    testimonial1: '5年間、何度聞いても分からなかった「right」と「light」。このアプリを使い始めて3週間で、突然違いが『見える』ように聞こえてきました。仕事の会議でも自信がつきました。',
    testimonial1Author: '由紀 M.',
    testimonial1Location: '東京、デザイナー',
    testimonial2: '発音練習アプリは恥ずかしくて続きませんでしたが、これは聞くだけなので通勤中に最適です。TOEICのリスニングパートが以前よりゆっくり聞こえる気がします。',
    testimonial2Author: '健一 S.',
    testimonial2Location: '大阪、エンジニア',
    testimonial3: 'リスニングファーストに焦点を当てた他のアプリはありません。これがすべての発音学習者に必要なものです。シンプルですが非常に効果的。',
    testimonial3Author: 'カルロス R.',
    testimonial3Location: 'マドリード、スペイン',
    
    featuresTitle: '英語を「一発で」理解するために必要なすべて',
    featureCard1Title: '日本語話者のために設計',
    featureCard1Text: '日本語話者が最も混乱しやすい音の違い（L/R、B/V、TH音など）に集中',
    featureCard2Title: '本物の声、本物のアクセント',
    featureCard2Text: 'アメリカ・イギリス・オーストラリアなど多様なネイティブ音声',
    featureCard3Title: '本物の英単語のみ',
    featureCard3Text: 'すべての訓練が実際の英単語を使用。一度に一つの音だけを変更',
    featureCard4Title: '適応型難易度',
    featureCard4Text: '遅いスピードから始まり、上達に応じて加速。間違えると自動調整',
    featureCard5Title: '賢く短いセッション',
    featureCard5Text: '1日15分で十分。集中力が切れたら自動的に一時停止',
    featureCard6Title: '即座にわかるフィードバック',
    featureCard6Text: '正しい単語、正確な音の違い、IPA表記、再生して比較するオプション',
    
    faqTitle: 'よくある質問',
    faq1Question: 'なぜマイクを使わないのですか？',
    faq1Answer: '発音の改善は「正しい音を脳が認識すること」から始まります。正しい音のモデルが脳内にできれば、喉や舌は自然とそれを模倣しようとするからです。',
    faq2Question: '結果が出るまでどのくらいかかりますか？',
    faq2Answer: 'ほとんどの学習者は、毎日の練習（10-15分）で2-3週間以内に認識の改善に気付きます。脳が音の識別のための新しい神経経路を構築するには時間が必要ですが、変化は測定可能で永続的です。',
    faq3Question: '私の母国語に適していますか？',
    faq3Answer: 'はい！このアプリには、日本語、中国語、スペイン語、タイ語、韓国語、アラビア語、ベトナム語、その他多くの言語の話者向けのターゲットミニマルペアが含まれています。演習はあなたのL1背景の特定の音素の課題に適応します。',
    faq4Question: '他の学習方法と併用できますか？',
  faq4Answer: 'もちろんです！Soundwiseは専門的な耳のトレーニングとして、他の全ての学習をより効果的にします。一旦違いが聞こえるようになれば、スピーキング練習の効率も飛躍的に向上します。',
    faq5Question: '上級者にも効果がありますか？',
    faq5Answer: 'はい。単語のストレス（強勢）やリズム（抑揚）の微細な感覚は、聴覚を研ぎ澄まさなければ得られません。Soundwiseの適応型アルゴリズムが、あなたの特定の弱点を即座に特定します。',
    
    ctaTitle: 'はっきり聞こえれば、自信を持って使える。',
  ctaSubtitle: '会話がラクになる。反応が速くなる。不安が減る。迷いがなくなる。$4.99の1回払いで、一生モノの「英語耳」を手に入れる。',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'ダウンロード',
    getItOn: '入手先',
    ctaFeature1: '一回限りの支払い',
    ctaFeature2: 'サブスクリプションなし',
    ctaFeature3: 'すべてのデバイスで動作',
    
    footerTagline: '耳を鍛えよう。英語を一発で理解しよう。',
    footerProduct: '製品',
    footerFeatures: '機能',
    footerHowItWorks: '使い方',
    footerLegal: '法的情報とサポート',
    footerFAQ: 'FAQ',
    footerPrivacy: 'プライバシーポリシー',
    footerTerms: '利用規約',
    footerContact: 'お問い合わせ',
    footerCopyright: '© 2025 Soundwise. All rights reserved.',
  },
  
  '中文': {
    name: '中文',
    flag: '🇨🇳',
    navCta: '开始训练听力',
    heroBadge: '科学重塑大脑听觉',
    heroTitle: '不再猜测，一次听懂地道英语',
    heroHighlight1: 'Sheep',
    heroHighlight2: 'Ship',
    heroSubtitle: '数百万中国学习者即便通过了四六级，仍难以在真实对话中自如应对。Soundwise 用真实口音、真实单词和自适应难度训练你的耳朵——让会议、面试、考试和日常对话变得轻松。**无需麦克风，只需你的双耳。**',
    availableOn: '适用于 iOS 和 Android | 5万+ 活跃学习者 | 覆盖 120+ 国家',
    languageSelectorLabel: '我的母语:',
    languagePlaceholder: '选择您的母语',
    nativeLangJapanese: '日语',
    nativeLangMandarin: '普通话',
    nativeLangThai: '泰语',
    nativeLangSpanish: '西班牙语',
    nativeLangKorean: '韩语',
    nativeLangArabic: '阿拉伯语',
    nativeLangVietnamese: '越南语',
    nativeLangOther: '其他',
    pairIntro: '您常见的挑战:',
    pairChallenge: '能听出区别吗？',
    ctaPrimary: '开始训练听力',
    ctaSecondary: '了解运作原理',
    
    stat1Number: '5万+',
    stat1Label: '活跃学习者',
    stat2Number: '15分钟',
    stat2Label: '每日训练',
    stat3Number: '120+',
    stat3Label: '个国家',
    
    problemTitle: '"听不出"不是因为不努力，而是大脑尚未"建模"',
    problemSubtitle: '中国学习者的发音困难往往源于中文与英文音韵系统的巨大差异。你的大脑会自动将陌生的英语音位过滤成最接近的中文读音。所以你总是在猜——而不是在听。',
    problemJapanese: '日语使用者',
    problemMandarin: '中文使用者',
    problemThai: '泰语使用者',
    problemSpanish: '西班牙语使用者',
    insightTitle: '核心问题',
    insightText: '传统应用逼你直接开口，但如果你听不到那个声音，你永远也发不出那个声音。L/N、R/L、V/W、TH音、词尾辅音——这些是中文母语者最常见的盲区。**先重塑听觉，口语自然地道。**',
    
    solutionBadge: '解决方案',
    solutionTitle: '英语不只有一种声音。为什么只用一种声音练习？',
    solutionDescription: '这个应用让你接触真实世界的英语——美式、英式、澳式、爱尔兰和南非口音，男声和女声，不同的说话风格。每个单词都由多位高质量发音者朗读，你的耳朵学会的是“适应”，而不是“死记”。这意味着在真正的对话中不再措手不及。',
    feature1: '多种真实口音 - 美、英、澳、爱尔兰、南非',
    feature2: '只用真实英语单词 - 没有虚构的练习用词',
    feature3: '词首、词中、词尾全覆盖 - 听力迁移到真实语境',
    feature4: '为中文母语者量身打造 - L/N, R/L, V/W, TH音等',
    feature5: '无需麦克风 - 通勤、午休随时随地练习',
    
    howItWorksTitle: '纯听力训练',
    howItWorksSubtitle: '没有语法讲座。没有复杂解释。只有三步。',
    step1Title: '听一个单词',
    step1Text: '多位母语者真实发音，覆盖中国学习者特定难点',
    step2Title: '选择你听到的',
    step2Text: '在“最小对立对”中选择——一个音的差异决定一切',
    step3Title: '即时反馈',
    step3Text: '看到正确单词、造成差异的具体发音、IPA音标。没有含糊的“错了”——你会立即明白听错了什么，以及为什么。',
    
    progressBadge: '自适应难度',
    progressTitle: '不无聊，也不崩溃',
    progressDescription: '不会一开始就是全速。新学习者从低于自然语速开始，先建立准确度。随着进步，语速逐渐提升到自然速度，然后超过自然速度。出错后难度自动调整。系统让你始终处于最佳挑战区。',
    progressFeature1: '速度是自己「赢」来的 - 准确度提升，速度跟着提升',
    progressFeature2: '智能水平测试 - 跳过已掌握的发音',
    progressFeature3: '集中15分钟训练 - 短时高效每日练习',
    progressFeature4: '可衡量的进步 - 看到确切的训练量和准确度',
    timePracticed: '练习时间:',
    minutes: '分钟',
    
    scienceBadge: '研究支持的方法',
    scienceTitle: '口语"活人感"，是更有含金量的职场名片',
    scienceCard1Title: '起薪红利',
    scienceCard1Text: '研究显示，英语水平与大学毕业生的起薪呈显著正相关，高水平者拥有更强的初始竞争力。',
    scienceCard2Title: '晋升屏障',
    scienceCard2Text: '尽管四六级证书能帮你拿到面试机会，但在真实商业环境中，准确的听力感知和地道发音才是决定职业上限的关键。',
    scienceCard3Title: '语言资本',
    scienceCard3Text: '在当今中国职场，优秀的英语能力不仅是沟通工具，更是关键的**语言资本**。别让发音盲点成为你迈向全球化职场的绊脚石。',
    
    testimonialsTitle: '学习者实证',
    testimonial1: '为了改掉 TH 读成 S 的习惯，我练了 5 年。用了 Soundwise 3 周后，那种“大脑突然开窍”的感觉太震撼了。对话轻松多了，不安感明显减少。',
    testimonial1Author: 'Wei L.',
    testimonial1Location: '产品经理，北京',
    testimonial2: '以前我分不清 sheep 和 ship，总觉得老外在吹毛求疵。现在我终于能捕捉到那个音差了。反应也快多了。',
    testimonial2Author: 'Yuki M.',
    testimonial2Location: '设计师，东京',
    testimonial3: '没有其他应用首先专注于听力。这是每个发音学习者需要的基础。用了之后不再犹豫不决。',
    testimonial3Author: 'Carlos R.',
    testimonial3Location: '马德里，西班牙',
    
    featuresTitle: '一次听懂英语所需的一切',
    featureCard1Title: '为中文母语者量身打造',
    featureCard1Text: '专注于中文使用者最容易混淆的发音对比（L/N, R/L, V/W, TH音, 词尾辅音）',
    featureCard2Title: '真实声音，真实口音',
    featureCard2Text: '美式、英式、澳式等多位母语者的高品质录音',
    featureCard3Title: '只用真实单词',
    featureCard3Text: '每个训练项使用真实英语单词，每次只改变一个发音',
    featureCard4Title: '自适应难度',
    featureCard4Text: '从慢速开始，随进步加速，出错自动调整',
    featureCard5Title: '聪明且简短的训练',
    featureCard5Text: '每天15分钟即可。注意力分散时自动暂停',
    featureCard6Title: '即时清晰的反馈',
    featureCard6Text: '正确单词、具体发音差异、IPA音标、重播比较',
    
    faqTitle: '常见问题',
    faq1Question: '为什么不需要麦克风？',
    faq1Answer: '因为发音问题本质是听觉感知问题。只有在大脑中建立准确的音频模型，你的发音才能得到根本纠正。',
    faq2Question: '多久能看到结果？',
    faq2Answer: '根据脑部扫描研究，仅需三次 20 分钟的集中训练，大脑的激活模式就会发生改变。',
    faq3Question: '我是高级学习者，这还有用吗？',
    faq3Answer: '有用。即便 CET-6 高分者，在单词重音和节奏感上仍常有盲点，Soundwise 会为你定制进阶挑战。',
    faq4Question: '可以与其他学习方法一起使用吗？',
    faq4Answer: '当然！Soundwise 补充任何英语学习计划。把它想象成专门的耳朵训练，使你所有其他练习更有效。一旦你能听出区别，说话练习就会变得更有成效。',
    faq5Question: '如果我是高级学习者怎么办？',
    faq5Answer: '即使是高级使用者通常也有来自母语的感知盲点。应用的自适应算法将快速识别你的特定挑战并专注于这些，使其在任何级别都有价值。',
    
    ctaTitle: '听得清楚，才能用得自信。',
    ctaSubtitle: '对话变得轻松。反应更快。焦虑减少。不再犹豫不决。仅需 $4.99，终身解锁英语母语者的敏锐度。',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: '下载于',
    getItOn: '获取应用',
    ctaFeature1: '一次性付费',
    ctaFeature2: '无订阅陷阱',
    ctaFeature3: '支持所有设备',
    
    footerTagline: '训练你的耳朵。一次听懂英语。',
    footerProduct: '产品',
    footerFeatures: '功能',
    footerHowItWorks: '如何运作',
    footerLegal: '法律与支持',
    footerFAQ: 'FAQ',
    footerPrivacy: '隐私政策',
    footerTerms: '服务条款',
    footerContact: '联系我们',
    footerCopyright: '© 2025 Soundwise. 版权所有。',
  },
  
  'idioma español': {
    name: 'Español',
    flag: '🇪🇸',
    navCta: 'Empieza a Entrenar',
    heroBadge: 'Entrenamiento Auditivo Científico',
    heroTitle: 'Deja de adivinar. Empieza a entender el inglés real.',
    heroHighlight1: '"Ship"',
    heroHighlight2: '"Sheep"',
    heroSubtitle: 'No dejes que los sonidos que no escuchas limiten tu carrera. Entrena tu oído con acentos reales, palabras reales y dificultad adaptativa — para que reuniones, entrevistas, exámenes y conversaciones sean más fáciles desde el primer día.',
    availableOn: 'Disponible en iOS y Android',
    languageSelectorLabel: 'Hablo:',
    languagePlaceholder: 'Selecciona tu idioma nativo',
    nativeLangJapanese: 'Japonés',
    nativeLangMandarin: 'Chino Mandarín',
    nativeLangThai: 'Tailandés',
    nativeLangSpanish: 'Español',
    nativeLangKorean: 'Coreano',
    nativeLangArabic: 'Árabe',
    nativeLangVietnamese: 'Vietnamita',
    nativeLangOther: 'Otro',
    pairIntro: 'Desafío común para ti:',
    pairChallenge: '¿Puedes escuchar la diferencia?',
    ctaPrimary: 'Empieza a Entrenar tu Oído',
    ctaSecondary: 'Ver Cómo Funciona',
    
    stat1Number: '50K+',
    stat1Label: 'Estudiantes Activos',
    stat2Number: '15 min',
    stat2Label: 'Sesiones Diarias',
    stat3Number: '120+',
    stat3Label: 'Países',
    
    problemTitle: '¿Por qué sigues confundiendo "ship" con "sheep"?',
    problemSubtitle: 'No es por falta de ganas. El problema es que el español tiene un sistema de sonidos más sencillo (5 vocales vs 12 del inglés) y tu cerebro intenta "ajustar" el inglés a lo que ya conoce.',
    problemJapanese: 'Hablantes de Japonés',
    problemMandarin: 'Hablantes de Mandarín',
    problemThai: 'Hablantes de Tailandés',
    problemSpanish: 'Hablantes de Español',
    insightTitle: 'El Verdadero Problema',
    insightText: 'Si no lo escuchas, no lo puedes decir. Retos como confundir V/B o añadir "E" antes de S (eschool) persisten porque tu oído no los distingue. Las apps que te piden "repetir" no sirven si no has entrenado tu percepción primero.',
    
    solutionBadge: 'La Solución',
    solutionTitle: 'El inglés no es una sola voz. ¿Por qué entrenar con una sola?',
  solutionDescription: 'Soundwise te expone al inglés del mundo real — acentos americano, británico, australiano, irlandés y sudafricano; voces masculinas y femeninas; diferentes estilos de habla. Cada palabra es pronunciada por un conjunto rotativo de voces de alta calidad. Tu oído aprende a adaptarse, no a memorizar. Menos sorpresas en conversaciones reales.',
    feature1: 'Múltiples acentos reales - Americano, británico, australiano y más',
    feature2: 'Solo palabras reales - Nada de palabras inventadas sin sentido',
    feature3: 'Sonidos en todas las posiciones - Inicio, medio y final de palabra',
    feature4: 'Diseñado para hispanohablantes - V vs B, th, vocales cortas/largas',
    feature5: 'Sin micrófono - Practica en el bus o en el trabajo con auriculares',
    
    howItWorksTitle: 'Entrenamiento de Escucha Puro',
    howItWorksSubtitle: 'Sin clases de gramática. Sin explicaciones complicadas. Solo tres pasos.',
    step1Title: 'Escuchas una Palabra',
    step1Text: 'Una palabra real en inglés pronunciada por una de muchas voces nativas',
    step2Title: 'Eliges lo que Escuchaste',
    step2Text: 'Selecciona de un par mínimo (ej. "ship" o "sheep") — un sonido marca toda la diferencia',
    step3Title: 'Feedback Instantáneo',
    step3Text: 'La palabra correcta, el sonido exacto que la diferencia, transcripción IPA. Nada de un vago "Incorrecto" — entiendes qué escuchaste mal y por qué.',
    
    progressBadge: 'Dificultad Adaptativa',
    progressTitle: 'Sin Aburrimiento ni Agobio',
    progressDescription: 'No empiezas a velocidad máxima. Los nuevos estudiantes comienzan por debajo de la velocidad natural para primero construir precisión. La velocidad aumenta gradualmente — incluso más rápido que la velocidad natural. Los errores ajustan automáticamente la dificultad. El sistema te mantiene en la zona ideal de desafío.',
    progressFeature1: 'La velocidad se gana - El ritmo de habla aumenta con tu precisión',
    progressFeature2: 'Test de nivel inteligente - Salta los sonidos que ya dominas',
    progressFeature3: 'Sesiones enfocadas de 15 minutos - Cortas y efectivas',
    progressFeature4: 'Progreso medible - Ve exactamente cuánto entrenamiento real has completado',
    timePracticed: 'Tiempo practicado:',
    minutes: 'minutos',
    
    scienceBadge: 'Método Científico',
    scienceTitle: 'Basado en Ciencia de Percepción Fonémica',
    scienceCard1Title: 'La Investigación',
    scienceCard1Text: 'Basado en estudios de Patricia Kuhl (U. Washington) que demuestran que la exposición temprana moldea nuestra percepción. Tu cerebro "filtra" sonidos que no existen en español.',
    scienceCard2Title: 'Por Qué Funciona',
    scienceCard2Text: 'Tu cerebro es neuroplástico. Adultos han mejorado drásticamente su precisión con feedback inmediato. Soundwise te ayuda a crear las categorías mentales para las 12 vocales del inglés.',
    scienceCard3Title: 'Resultados Comprobados',
    scienceCard3Text: 'Con solo 3 sesiones de 20 minutos, escaneos cerebrales muestran nuevas conexiones. Es el camino más rápido para dejar de traducir mentalmente y empezar a pensar en inglés.',
    
    testimonialsTitle: 'Únete a miles de hispanos que ya escuchan la diferencia',
    testimonial1: 'Pasé 5 años confundiendo "right" con "light". Tras 3 semanas con Soundwise, ¡por fin puedo oírlo! Esto cambió mi carrera por completo.',
    testimonial1Author: 'Yuki M.',
    testimonial1Location: 'Tokio (Ejecutivo Global)',
    testimonial2: 'Me sentía inseguro en las reuniones al pronunciar palabras con "th". Ahora mi oído detecta la diferencia exacta entre "thin" y "sin". ¡Es como magia!',
    testimonial2Author: 'Wei L.',
    testimonial2Location: 'Pekín',
    testimonial3: 'A diferencia de otras apps que te obligan a hablar, Soundwise entrena tu OÍDO. Es el cimiento que todo latino necesita para hablar inglés con autoridad.',
    testimonial3Author: 'Carlos R.',
    testimonial3Location: 'Madrid, España',
    
    featuresTitle: 'Todo Lo Que Necesitas Para Entender Inglés Con Claridad',
    featureCard1Title: 'Diseñado para Hispanohablantes',
    featureCard1Text: 'Se enfoca en "puntos ciegos" hispanos: V vs B, th vs z, vocales cortas/largas, consonantes finales',
    featureCard2Title: 'Voces Reales, Acentos Reales',
    featureCard2Text: 'Múltiples hablantes nativos con acentos diversos para inmersión auténtica',
    featureCard3Title: 'Solo Palabras Reales',
    featureCard3Text: 'Cada ejercicio usa palabras reales que cambian solo un sonido a la vez',
    featureCard4Title: 'Dificultad Adaptativa',
    featureCard4Text: 'Empieza lento, sube a medida que mejoras, se ajusta con tus errores',
    featureCard5Title: 'Sesiones de 15 Minutos',
    featureCard5Text: 'Diseñado para el profesional ocupado. Se pausa si pierdes la concentración.',
    featureCard6Title: 'Feedback Claro e Instantáneo',
    featureCard6Text: 'La palabra correcta, el sonido exacto, IPA y opción de reproducir y comparar',
    
    faqTitle: 'Preguntas Frecuentes',
    faq1Question: '¿Por qué no necesito micrófono?',
    faq1Answer: 'Porque no puedes pronunciar lo que tu cerebro no detecta. Al entrenar tu percepción auditiva primero, la pronunciación correcta surge de forma natural y sin esfuerzo.',
    faq2Question: '¿Cuánto tiempo hasta ver resultados?',
    faq2Answer: 'La mayoría nota mejoras en 2-3 semanas (15 min/día). Tu cerebro necesita tiempo para crear nuevas conexiones, pero los cambios son permanentes.',
    faq3Question: '¿Es adecuado para hablantes de español?',
    faq3Answer: '¡Sí! Diseñado específicamente para superar los retos del español (5 vocales) frente al inglés (12 vocales).',
    faq4Question: '¿Puedo usar esto junto con otros métodos?',
  faq4Answer: '¡Absolutamente! Soundwise es el "gimnasio para tus oídos" que hace que el resto de tu inglés (Duolingo, clases) funcione mejor.',
    faq5Question: '¿Qué pasa si ya tengo un nivel avanzado?',
    faq5Answer: 'Incluso los bilingües fluidos tienen "puntos ciegos" auditivos heredados del español. Soundwise pule esos detalles para que dejes de sonar como estudiante y empieces a sonar como un experto.',
    
    ctaTitle: 'Si lo escuchas con claridad, lo puedes usar con confianza.',
  ctaSubtitle: 'Las conversaciones son más fáciles. Respondes más rápido. Sientes menos ansiedad. Dejas de dudar. Obtén acceso de por vida por solo $4.99.',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'Descargar en',
    getItOn: 'Disponible en',
    ctaFeature1: 'Pago único',
    ctaFeature2: 'Sin suscripciones',
    ctaFeature3: 'Tu inversión para siempre',
    
    footerTagline: 'Entrena tu oído. Entiende el inglés a la primera.',
    footerProduct: 'Producto',
    footerFeatures: 'Características',
    footerHowItWorks: 'Cómo Funciona',
    footerLegal: 'Legal y Soporte',
    footerFAQ: 'FAQ',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos de Servicio',
    footerContact: '¿Dudas? Escríbenos',
  footerCopyright: '© 2025 Soundwise. Todos los derechos reservados.',
  },
  
  'ภาษาไทย': {
    name: 'ภาษาไทย',
    flag: '🇹🇭',
    navCta: 'เริ่มฝึกหูเลย',
    heroBadge: 'ฝึกหูอย่างเป็นระบบ ด้วยวิทยาศาสตร์',
    heroTitle: 'เลิกเดา เริ่มฟังภาษาอังกฤษได้ชัดเจน',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
    heroSubtitle: 'ฝึกหูด้วยสำเนียงจริง คำจริง และระดับความยากที่ปรับตามตัวคุณ — ให้การประชุม สัมภาษณ์ สอบ และสนทนา ง่ายขึ้นตั้งแต่วันแรก ไม่ต้องใช้ไมโครโฟน',
    availableOn: 'พร้อมใช้งานบน iOS และ Android',
    languageSelectorLabel: 'ฉันพูด:',
    languagePlaceholder: 'เลือกภาษาแม่ของคุณ',
    nativeLangJapanese: 'ภาษาญี่ปุ่น',
    nativeLangMandarin: 'ภาษาจีนกลาง',
    nativeLangThai: 'ภาษาไทย',
    nativeLangSpanish: 'ภาษาสเปน',
    nativeLangKorean: 'ภาษาเกาหลี',
    nativeLangArabic: 'ภาษาอาหรับ',
    nativeLangVietnamese: 'ภาษาเวียดนาม',
    nativeLangOther: 'อื่นๆ',
    pairIntro: 'ความท้าทายทั่วไปสำหรับคุณ:',
    pairChallenge: 'คุณได้ยินความแตกต่างหรือไม่?',
    ctaPrimary: 'เริ่มฝึกหูวันนี้',
    ctaSecondary: 'ดูวิธีการทำงาน',
    
    stat1Number: '50K+',
    stat1Label: 'ผู้เรียนที่ใช้งาน',
    stat2Number: '15 นาที',
    stat2Label: 'ฝึกทุกวัน',
    stat3Number: '120+',
    stat3Label: 'ประเทศ',
    
    problemTitle: 'ทำไมคนไทยหลายคนถึงฟังภาษาอังกฤษไม่ชัด?',
    problemSubtitle: 'ปัญหาไม่ได้อยู่ที่ความพยายาม แต่อยู่ที่ "สมอง" ของคุณยังไม่ได้ถูกฝึกให้แยกแยะเสียงที่ไม่มีอยู่ในภาษาไทย เลยต้องถาม "Sorry?" ซ้ำแล้วซ้ำเล่า',
    problemJapanese: 'ผู้พูดภาษาญี่ปุ่น',
    problemMandarin: 'ผู้พูดภาษาจีนกลาง',
    problemThai: 'ผู้พูดภาษาไทย',
    problemSpanish: 'ผู้พูดภาษาสเปน',
    insightTitle: 'ปัญหาที่แท้จริง',
    insightText: 'แอปทั่วไปเน้นให้คุณ "พูดตาม" แต่คุณไม่สามารถออกเสียงสิ่งที่คุณ "ไม่ได้ยิน" ได้ เสียง /θ/ vs /t/ (thin vs tin), เสียงท้ายคำ, สระยาว/สั้น — เหล่านี้คือจุดบอดของคนไทย หูของคุณต้องเรียนรู้วิธีแยกแยะเสียงเหล่านี้ก่อน การพูดที่ชัดเจนจึงจะตามมาเอง',
    
    solutionBadge: 'วิธีแก้ปัญหา',
    solutionTitle: 'ภาษาอังกฤษไม่ได้มีแค่เสียงเดียว แล้วทำไมฝึกด้วยเสียงเดียว?',
  solutionDescription: 'Soundwise ให้คุณฟังภาษาอังกฤษจริง — สำเนียงอเมริกัน อังกฤษ ออสเตรเลีย ไอร์แลนด์ และแอฟริกาใต้ ทั้งเสียงชายและเสียงหญิง สไตล์การพูดที่แตกต่าง ทุกคำถูกอ่านโดยผู้พูดหลายคน หูของคุณจะเรียนรู้ที่จะ "ปรับตัว" ไม่ใช่ "ท่องจำ"',
    feature1: 'สำเนียงจริงหลากหลาย - อเมริกัน อังกฤษ ออสเตรเลีย และอื่นๆ',
    feature2: 'คำจริงเท่านั้น - ไม่มีคำแต่งที่ไม่มีความหมาย',
    feature3: 'เสียงทุกตำแหน่ง - ต้นคำ กลางคำ และท้ายคำ',
    feature4: 'ออกแบบเฉพาะสำหรับคนไทย - /θ/ vs /t/, เสียงท้ายคำ, สระ',
    feature5: 'ฝึกได้ทุกที่ - แค่มีหูฟังก็เก่งได้',
    
    howItWorksTitle: 'ฝึกฟังอย่างเดียว',
    howItWorksSubtitle: 'ไม่มีการสอนแกรมมาร์ ไม่มีคำอธิบายซับซ้อน แค่สามขั้นตอน',
    step1Title: 'ฟัง',
    step1Text: 'ได้ยินคำหรือเสียงที่ท้าทายผู้พูดภาษาแม่ของคุณ',
    step2Title: 'เลือก',
    step2Text: 'เลือกคำที่คุณได้ยินจากคู่น้อยที่สุด (เช่น "ship" หรือ "sheep") ระบบจะปรับความยากตามคุณทันที',
    step3Title: 'เรียนรู้',
    step3Text: 'เห็นคำที่ถูกต้อง เสียงที่ทำให้ต่างกัน สัญลักษณ์ IPA ไม่มี "ผิด" แบบคลุมเครือ — คุณจะรู้ทันทีว่าฟังผิดอะไร และเพราะอะไร',
    
    progressBadge: 'ปรับความยากตามตัวคุณ',
    progressTitle: 'ไม่น่าเบื่อ ไม่หนักเกินไป',
    progressDescription: 'ไม่ได้เริ่มเร็วสุด ผู้เริ่มต้นจะเริ่มที่ช้ากว่าปกติเพื่อสร้างความแม่นยำก่อน เมื่อดีขึ้น ความเร็วจะค่อยๆ เพิ่มขึ้น — แม้เร็วกว่าปกติ ผิดแล้วระบบปรับอัตโนมัติ อยู่ในโซนท้าทายที่พอดี',
    progressFeature1: 'ความเร็วต้อง "ชนะ" มา - ถูกมากขึ้น เร็วขึ้น',
    progressFeature2: 'แบบทดสอบอัจฉริยะ - ข้ามเสียงที่เก่งแล้ว',
    progressFeature3: 'เซสชัน 15 นาที - สั้น ได้ผล ทุกวัน',
    progressFeature4: 'วัดผลได้จริง - เห็นว่าฝึกมาเท่าไร แม่นแค่ไหน',
    timePracticed: 'เวลาที่ฝึก:',
    minutes: 'นาที',
    
    scienceBadge: 'วิธีการที่ได้รับการสนับสนุนจากการวิจัย',
    scienceTitle: 'นวัตกรรมที่ได้รับการสนับสนุนจากการวิจัยระดับโลก',
    scienceCard1Title: 'การวิจัย',
    scienceCard1Text: 'ตามการศึกษาของ Patricia Kuhl (มหาวิทยาลัยวอชิงตัน) และ McClelland (2002) เกี่ยวกับการสอนการแยกแยะหน่วยเสียง การศึกษาเหล่านี้แสดงให้เห็นว่าสมองมีความยืดหยุ่นและสามารถเรียนรู้ใหม่ได้',
    scienceCard2Title: 'ทำไมมันถึงได้ผล',
    scienceCard2Text: 'สมองของคุณมีความยืดหยุ่น (Neuroplasticity) แม้แต่ผู้ใหญ่ชาวญี่ปุ่นปรับปรุงความแม่นยำในการแยกแยะ /r/ และ /l/ จาก 50% เป็น 80% ได้ด้วยข้อเสนอแนะภาพทันที',
    scienceCard3Title: 'ผลลัพธ์ที่พิสูจน์แล้ว',
    scienceCard3Text: 'ผลวิจัยพบว่าการฝึกอย่างสม่ำเสมอเพียง 3 เซสชัน (เซสชันละ 20 นาที) ก็เริ่มเห็นการเปลี่ยนแปลงของเส้นทางประสาทในสมองแล้ว',
    
    testimonialsTitle: 'เสียงจากผู้เรียนทั่วโลก',
    testimonial1: '5 ปีที่ผมสับสนคำว่า right กับ light... ใช้แอปนี้แค่ 3 สัปดาห์ ผมได้ยินความแตกต่างชัดเจนมาก! เปลี่ยนชีวิตผมเลยครับ',
    testimonial1Author: 'ยูกิ M.',
    testimonial1Location: 'โตเกียว',
    testimonial2: 'เคยอายเวลาสั่งพิซซ่า "thin crust" แล้วพนักงานทำหน้าสงสัย ตอนนี้ผมมั่นใจขึ้นมาก เพราะผมได้ยินความต่างของ th กับ s แล้วจริงๆ!',
    testimonial2Author: 'เหว่ย L.',
    testimonial2Location: 'ปักกิ่ง',
    testimonial3: 'ไม่มีแอปอื่นใดที่เน้นการฟังก่อน นี่คือสิ่งที่ผู้เรียนการออกเสียงทุกคนต้องการ เรียบง่ายแต่มีประสิทธิภาพอย่างเหลือเชื่อ',
    testimonial3Author: 'คาร์ลอส R.',
    testimonial3Location: 'มาดริด',
    
    featuresTitle: 'จุดเด่นที่คุณจะได้รับ',
    featureCard1Title: 'ปรับแต่งตาม L1 ของคุณ',
    featureCard1Text: 'เน้นคู่เสียงเฉพาะที่ท้าทายผู้พูดภาษาแม่ของคุณ',
    featureCard2Title: 'เก่งได้ทุกที่ ทุกเวลา',
    featureCard2Text: 'เพียงวันละ 10-15 นาที ไม่ว่าจะเป็นช่วงรอรถไฟฟ้าหรือพักดื่มกาแฟ',
    featureCard3Title: 'เสียงจากเจ้าของภาษา',
    featureCard3Text: 'เลือกระหว่างสำเนียงอังกฤษและอเมริกันสำหรับการออกเสียงที่แท้จริง',
    featureCard4Title: 'ติดตามความคืบหน้า',
    featureCard4Text: 'ดูความแม่นยำในการรับรู้ของคุณดีขึ้นเมื่อเวลาผ่านไป',
    featureCard5Title: 'เซสชันรวดเร็ว',
    featureCard5Text: 'ออกแบบมาให้เข้ากับจังหวะชีวิตคนเมืองที่เร่งรีบแต่ไม่หยุดพัฒนาตัวเอง',
    featureCard6Title: 'บันทึกอัตโนมัติ',
    featureCard6Text: 'ระบบจะบันทึกผลการฝึกให้โดยอัตโนมัติ เพื่อให้คุณกลับมาฝึกต่อได้ทันที',
    
    faqTitle: 'คำถามที่พบบ่อย',
    faq1Question: 'ทำไมฉันไม่ต้องการไมโครโฟน?',
    faq1Answer: 'เพราะความลับของการพูดชัดเริ่มที่ "การได้ยิน" เราเน้นฝึกสมองให้แยกแยะเสียงก่อน เมื่อคุณได้ยินชัด คุณจะเลียนเสียงได้อย่างถูกต้องตามธรรมชาติ',
    faq2Question: 'ใช้เวลานานแค่ไหนจนกว่าจะเห็นผล?',
    faq2Answer: 'ผลวิจัยพบว่าการฝึกอย่างสม่ำเสมอเพียง 3 เซสชัน (เซสชันละ 20 นาที) ก็เริ่มเห็นการเปลี่ยนแปลงของเส้นทางประสาทในสมองแล้ว!',
    faq3Question: 'เหมาะสมกับภาษาแม่ของฉันหรือไม่?',
    faq3Answer: 'แน่นอน! เราเน้นคู่เสียงที่คนไทยมักสับสน เช่น /θ/ vs /t/ (thin vs tin) เพื่อแก้ปัญหาให้ตรงจุดสำหรับผู้พูดภาษาไทยโดยเฉพาะ',
    faq4Question: 'ฉันสามารถใช้ร่วมกับคอร์สเรียนอื่นได้หรือไม่?',
  faq4Answer: 'ได้แน่นอน! Soundwise คือ "อาวุธลับ" ที่ช่วยให้การเรียนในห้องเรียนหรือแอปอื่นๆ ของคุณได้ผลดียิ่งขึ้นอย่างก้าวกระโดด',
    faq5Question: 'ถ้าฉันเป็นผู้เรียนระดับสูงล่ะ?',
    faq5Answer: 'เหมาะอย่างยิ่ง! Soundwise จะช่วยปรับจูนหูของคุณให้จับรายละเอียดเล็กๆ น้อยๆ ได้แม่นยำขึ้น ทำให้คุณดูโปรขึ้นไปอีกขั้น',
    
    ctaTitle: 'ฟังชัด ใช้ได้อย่างมั่นใจ',
  ctaSubtitle: 'สนทนาง่ายขึ้น ตอบเร็วขึ้น กังวลน้อยลง ไม่ลังเล ปลดล็อกตลอดชีพในราคาเพียง $4.99 (ประมาณ 170 บาท)',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'ดาวน์โหลดที่',
    getItOn: 'รับที่',
    ctaFeature1: 'จ่ายครั้งเดียวจบ',
    ctaFeature2: 'ไม่มีค่ารายเดือน',
    ctaFeature3: 'รองรับทุกอุปกรณ์',
    
    footerTagline: 'ฝึกหู ฟังภาษาอังกฤษรู้เรื่องตั้งแต่ครั้งแรก',
    footerProduct: 'ผลิตภัณฑ์',
    footerFeatures: 'คุณสมบัติ',
    footerHowItWorks: 'วิธีการทำงาน',
    footerLegal: 'กฎหมายและสนับสนุน',
    footerFAQ: 'FAQ',
    footerPrivacy: 'นโยบายความเป็นส่วนตัว',
    footerTerms: 'ข้อกำหนดการใช้บริการ',
    footerContact: 'ติดต่อ',
  footerCopyright: '© 2025 Soundwise. สงวนลิขสิทธิ์',
  },
  
  '한국어': {
    name: '한국어',
    flag: '🇰🇷',
    navCta: '귀 훈련 시작하기',
    heroBadge: '과학 기반 귀 훈련',
    heroTitle: '빠른 영어도 한 번에 알아듣는 귀를 만드세요',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
    heroSubtitle: '실제 발음, 실제 단어, 나에게 맞는 난이도로 귀를 훈련하세요 — 회의, 대화, 시험, 일상에서 "Sorry?"를 더 이상 반복하지 마세요. 마이크 없이 오직 듣기만으로.',
    availableOn: 'iOS 및 Android 지원',
    languageSelectorLabel: '모국어:',
    languagePlaceholder: '모국어를 선택하세요',
    nativeLangJapanese: '일본어',
    nativeLangMandarin: '중국어(표준어)',
    nativeLangThai: '태국어',
    nativeLangSpanish: '스페인어',
    nativeLangKorean: '한국어',
    nativeLangArabic: '아랍어',
    nativeLangVietnamese: '베트남어',
    nativeLangOther: '기타',
    pairIntro: '일반적인 과제:',
    pairChallenge: '차이를 들을 수 있나요?',
    ctaPrimary: '오늘부터 귀 훈련 시작',
    ctaSecondary: '작동 원리 보기',
    
    stat1Number: '5만 명+',
    stat1Label: '학습자',
    stat2Number: '15분',
    stat2Label: '하루 훈련',
    stat3Number: '120개국',
    stat3Label: '글로벌 플랫폼',
    
    problemTitle: '“안 들리는 것”은 당신의 잘못이 아닙니다. 대뇌가 아직 ‘매핑(Mapping)’되지 않았을 뿐입니다.',
    problemSubtitle: '열심히 해도 안 들리는 이유? 한국어에 없는 소리는 뇌가 아예 걸러버리기 때문입니다. "Sorry?"를 반복하게 되는 진짜 이유:',
    problemJapanese: '일본어 사용자',
    problemMandarin: '중국어 사용자',
    problemThai: '태국어 사용자',
    problemSpanish: '스페인어 사용자',
    insightTitle: '근본적인 문제',
    insightText: '<ul><li style="margin-bottom: 8px;"><b>Vowel Length (모음의 길이):</b> <b>ship (/ʃɪp/)</b>과 <b>sheep (/ʃiːp/)</b>을 구분하지 못하는 것은 한국어에 모음 길이의 의미 차이가 없기 때문입니다.</li><li style="margin-bottom: 8px;"><b>The Dark L (어두운 L):</b> 한국어의 \'ㄹ\'은 가벼운 소리(Light L)인 반면, 영어의 ball이나 tell 끝에 오는 소리는 혀 뒤쪽을 당기는 \'어두운 소리\'입니다.</li><li><b>The TH Sound (/θ/):</b> 한국어에 존재하지 않는 이 소리를 뇌는 가장 유사한 \'ㅅ\'이나 \'ㄷ\'으로 필터링해 버립니다.</li></ul><br><b>핵심:</b> 소리를 구분해내지 못하면, 아무리 비싼 회화 강의도 효과를 보기 어렵습니다. 귀 훈련이 답입니다. 귀를 먼저 훈련하면 말하기는 저절로 따라옵니다.',
    
    solutionBadge: '솔루션',
    solutionTitle: '영어는 하나의 발음이 아닙니다 — 그런데 왜 하나만 연습하나요?',
  solutionDescription: 'Soundwise는 실제 영어를 들려줍니다 — 미국, 영국, 호주, 아일랜드, 남아공 등 다양한 남녀 발음으로 훈련합니다. 모든 단어는 실제 원어민이 읽었고, 억양과 속도가 다양합니다. 외우지 말고 적응하세요.',
    feature1: '다양한 실제 억양 — 미국, 영국, 호주 등',
    feature2: '실제 단어만 — 의미 없는 소리 없음',
    feature3: '모든 위치의 소리 — 단어 앞, 중간, 끝',
    feature4: '한국어 맞춤 설계 — R/L, P/F, V/B, /θ/, Dark L, 모음 길이',
    feature5: '마이크 불필요 — 듣기만으로 집중 훈련',
    
    howItWorksTitle: '순수 듣기 훈련',
    howItWorksSubtitle: '문법 강의 없이, 복잡한 설명 없이, 딱 세 단계',
    step1Title: '청취 (Listen)',
    step1Text: '한국인에게 특화된 고난도 음소 쌍(Minimal Pairs)을 듣습니다.',
    step2Title: '선택 (Select)',
    step2Text: '미세한 음성 차이를 직관적으로 구분하여 선택합니다.',
    step3Title: '학습 및 강화 (Learn)',
    step3Text: '정답과 IPA 기호, 소리 차이를 즉시 확인합니다. 모호한 "틀림"이 아닌, 왜 헷갈렸는지 정확히 알려줍니다.',
    
    progressBadge: '맞춤형 난이도',
    progressTitle: '지루하지도, 벅차지도 않게',
    progressDescription: '처음엔 느린 속도로 시작해서 자신감을 쌓고, 실력이 늘면 속도가 올라갑니다 — 빨리 올라가도 틀리면 자동 조절되어 항상 딱 맞는 수준에서 훈련합니다.',
    progressFeature1: '속도를 "벌어야" 올라감 — 잘할수록 빠르게',
    progressFeature2: '스마트 배치 테스트 — 이미 아는 소리는 건너뜀',
    progressFeature3: '15분 세션 — 짧고, 효과적이고, 매일 가능',
    progressFeature4: '측정 가능한 진전 — 얼마나 늘었는지 정확히 확인',
    timePracticed: '연습 시간:',
    minutes: '분',
    
    scienceBadge: '연구 기반 방법',
    scienceTitle: '음소 인식 과학에 기반',
    scienceCard1Title: '연구',
    scienceCard1Text: 'Patricia Kuhl의 유아 언어 발달 연구(워싱턴 대학교)와 McClelland, Fiez, McCandliss(2002)의 성인 음소 식별 교육에 관한 연구를 기반으로 합니다. 이러한 연구는 초기 노출이 의미 있는 것으로 인식되는 소리 구별을 형성한다는 것을 보여줍니다.',
    scienceCard2Title: '효과가 있는 이유',
    scienceCard2Text: '뇌는 신경가소성이 있습니다 - 재훈련이 가능합니다. 일본인 성인은 즉각적인 시각 피드백으로 /r/과 /l/ 구별 정확도가 50%에서 70-80%로 향상되었습니다. 반복적인 최소 대립쌍 연습은 소리 구별을 위한 새로운 신경 경로를 만듭니다.',
    scienceCard3Title: '입증된 결과',
    scienceCard3Text: '단 세 번의 20분 세션 후 뇌 스캔에서 새로운 활성화 패턴이 나타나 지각 지도가 재배선되었음을 보여주었습니다. 일관된 연습은 측정 가능하고 영구적인 인식 정확도 향상을 만듭니다.',
    
    testimonialsTitle: '전 세계 학습자들이 차이를 듣고 있습니다',
    testimonial1: '“5년 동안 right와 light를 구분하지 못해 스트레스받았는데, 단 3주 만에 귀가 틔었습니다. 비즈니스 미팅에서 상대방의 말을 놓치지 않게 된 것이 가장 큰 수확입니다.”',
    testimonial1Author: '이정민, 외국계 기업 전략 기획팀',
    testimonial1Location: '한국',
    testimonial2: '"thin crust pizza"를 주문하고 혼란스러운 표정을 받는 것이 너무 부끄러웠습니다. 이제 th와 s 소리의 차이를 실제로 들을 수 있어요!',
    testimonial2Author: '웨이 L.',
    testimonial2Location: '베이징, 중국',
    testimonial3: '듣기를 먼저 강조하는 다른 앱은 없습니다. 이것이 모든 발음 학습자에게 필요한 것입니다. 간단하지만 믿을 수 없을 정도로 효과적입니다.',
    testimonial3Author: '카를로스 R.',
    testimonial3Location: '마드리드, 스페인',
    
    featuresTitle: '영어를 정확히 알아듣기 위해 필요한 모든 것',
    featureCard1Title: '내 언어 맞춤 설계',
    featureCard1Text: '한국어 화자가 어려워하는 정확한 소리 쌍에 집중',
    featureCard2Title: '실제 원어민 음성',
    featureCard2Text: '다양한 억양의 남녀 원어민이 직접 녹음한 발음',
    featureCard3Title: '실제 단어만 사용',
    featureCard3Text: '실제로 쓰이는 영어 단어만 — 의미없는 소리 연습 없음',
    featureCard4Title: '맞춤형 난이도',
    featureCard4Text: '실력이 늘면 난이도가 올라가고, 어려우면 자동 조절',
    featureCard5Title: '15분이면 충분',
    featureCard5Text: '짧고 집중적인 세션으로 매일 꾸준히 가능',
    featureCard6Title: '즉각적이고 명확한 피드백',
    featureCard6Text: '정답, 소리 차이, IPA 기호를 즉시 확인',
    
    faqTitle: '자주 묻는 질문',
    faq1Question: '왜 마이크가 필요 없나요?',
    faq1Answer: '발음 교정의 80%는 청각 인지에서 시작됩니다. 뇌가 정확한 소리 모델을 구축하면 입은 자연스럽게 그 소리를 흉내 내기 때문입니다.',
    faq2Question: '고급 학습자에게도 효과가 있나요?',
    faq2Answer: '물론입니다. 원어민 특유의 강세(Word Stress)와 리듬감(Rhythm)은 귀가 예민해질 때만 비로소 정복 가능합니다.',
    faq3Question: '내 모국어에 적합한가요?',
    faq3Answer: '예! 앱에는 일본어, 중국어, 스페인어, 태국어, 한국어, 아랍어, 베트남어 및 기타 여러 언어 사용자를 위한 타겟 최소 대립쌍이 포함되어 있습니다. 연습은 L1 배경의 특정 음소 과제에 적응합니다.',
    faq4Question: '다른 학습 방법과 함께 사용할 수 있나요?',
  faq4Answer: '물론입니다! Soundwise는 모든 영어 학습 프로그램을 보완합니다. 다른 모든 연습을 더 효과적으로 만드는 전문적인 귀 훈련으로 생각하세요. 차이를 들을 수 있게 되면 말하기 연습이 훨씬 더 생산적이 됩니다.',
    faq5Question: '고급 학습자라면 어떻게 하나요?',
    faq5Answer: '고급 사용자도 L1에서 인식 맹점이 있는 경우가 많습니다. 앱의 적응형 알고리즘은 특정 과제를 빠르게 식별하고 집중하므로 모든 수준에서 가치가 있습니다.',
    
    ctaTitle: '잘 들리면, 자신있게 쓸 수 있습니다',
  ctaSubtitle: '대화가 편해지고, 발표가 자신있어지고, 걱정이 줄어듭니다. 단 $4.99 일회성 결제 | 구독료 없음 | 모든 기기 동기화',
    appStore: 'App Store에서 다운로드',
    googlePlay: 'Google Play에서 받기',
    downloadOn: '다운로드',
    getItOn: '받기',
    ctaFeature1: '일회성 결제',
    ctaFeature2: '구독 없음',
    ctaFeature3: '모든 기기 동기화',
    
    footerTagline: '귀를 훈련하세요. 영어를 처음부터 알아들으세요.',
    footerProduct: '제품',
    footerFeatures: '기능',
    footerHowItWorks: '작동 방식',
    footerLegal: '법률 및 지원',
    footerFAQ: 'FAQ',
    footerPrivacy: '개인정보 처리방침',
    footerTerms: '서비스 약관',
    footerContact: '문의하기',
  footerCopyright: '© 2025 Soundwise. 모든 권리 보유.',
  },
};

const legacyTranslations = {
  ...baseTranslations,
  ...additionalTranslations,
};

export const translations = buildRuntimeTranslations(legacyTranslations);

// Language mapping from browser locale codes to our language keys
const languageMap = {
  'en': 'en',
  'ja': '日本語',
  'zh': '中文',
  'zh-CN': '中文',
  'zh-TW': '中文',
  'zh-HK': '廣東話',
  'yue': '廣東話',
  'es': 'idioma español',
  'th': 'ภาษาไทย',
  'ko': '한국어',
  'pt': 'Português',
  'ru': 'русский язык',
  'ar': 'اللغة العربية',
  'vi': 'Tiếng Việt',
  'hi': 'हिंदी/اردو',
  'ur': 'हिंदी/اردو',
  'tr': 'Türkçe',
  'fa': 'زبان فارسی',
  'id': 'bahasa Indo',
};

// Detect browser language and map to supported language
function detectBrowserLanguage() {
  // Get browser language (e.g., 'en-US', 'ja', 'zh-CN')
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Try full locale first (e.g., 'zh-CN')
  if (languageMap[browserLang]) {
    return languageMap[browserLang];
  }
  
  // Try just the language code (e.g., 'zh' from 'zh-CN')
  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) {
    return languageMap[langCode];
  }
  
  // Default to English if no match
  return 'en';
}

// Get current language from localStorage or detect from browser
export function getCurrentLanguage() {
  const storedLang = localStorage.getItem('language');
  
  // If user has previously selected a language, use that
  if (storedLang) {
    return storedLang;
  }
  
  // Otherwise, detect from browser and save it
  const detectedLang = detectBrowserLanguage();
  localStorage.setItem('language', detectedLang);
  
  return detectedLang;
}

// Set language and save to localStorage
export function setLanguage(lang) {
  localStorage.setItem('language', lang);
  applyTranslations(lang);
}

// Apply translations to the page
export function applyTranslations(lang) {
  const t = translations[lang] || translations.en;
  const { htmlLang, isRtl } = getRuntimeLocaleMeta(lang);
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t[key];
    
    if (translation !== undefined) {
      // Handle list items that should be hidden if translation is empty
      // Specific to the features list in the solution section
      const listItem = element.closest('ul.feature-list li');
      if (listItem) {
        if (translation === '') {
          listItem.style.display = 'none';
        } else {
          listItem.style.display = ''; // Restore default display
        }
      }
      
      // Special handling for FAQ answers - update the <p> child, not the container div
      if (element.classList.contains('faq-answer')) {
        const p = element.querySelector('p');
        if (p) {
          p.innerHTML = translation;
          if (isRtl) {
            p.setAttribute('dir', 'auto');
            p.style.unicodeBidi = 'plaintext';
          } else {
            p.removeAttribute('dir');
            p.style.unicodeBidi = '';
          }
        }
      } else {
        element.innerHTML = translation;
      }

      if (isRtl) {
        element.setAttribute('dir', 'auto');
        element.style.unicodeBidi = 'plaintext';
      } else {
        element.removeAttribute('dir');
        element.style.unicodeBidi = '';
      }
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      element.placeholder = t[key];
    }
  });
  
  // Update the language selector to show current selection
  const langSelector = document.getElementById('language-selector');
  if (langSelector && translations[lang]) {
    langSelector.textContent = `${translations[lang].flag} ${translations[lang].name}`;
    if (isRtl) {
      langSelector.setAttribute('dir', 'auto');
      langSelector.style.unicodeBidi = 'plaintext';
    } else {
      langSelector.removeAttribute('dir');
      langSelector.style.unicodeBidi = '';
    }
  }
  
  // Store current language in HTML lang attribute
  document.documentElement.lang = htmlLang;
}
