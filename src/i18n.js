import { additionalTranslations } from './i18n-part2.js';

// Multi-language support for Soundwise landing page
// Based on alternateLanguages.ts from the main app

const baseTranslations = {
  en: {
    name: 'English',
    flag: '🇬🇧 🇺🇸',
    
    // Navigation
    navCta: 'Get Started',
    
  // Hero Section
    heroBadge: 'Science-Backed Learning',
  heroTitle: 'Hear English Like a Native',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
  heroSubtitle: 'Soundwise retrains your brain to recognize English sounds automatically through short, focused listening drills. No microphone needed — just listen, learn, and hear the difference.',
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
    ctaPrimary: 'Start Training',
    ctaSecondary: 'See How It Works',
    
    // Social Proof
    stat1Number: '50K+',
    stat1Label: 'Active Learners',
    stat2Number: '60 min',
    stat2Label: 'Per Sound Pair',
    stat3Number: '120+',
    stat3Label: 'Countries',
    
    // Problem Section
    problemTitle: 'It\'s Not Your Fault You Can\'t Hear These Sounds',
    problemSubtitle: 'Your brain wasn\'t trained to distinguish sounds that don\'t exist in your native language.',
    problemJapanese: 'Japanese Speakers',
    problemMandarin: 'Mandarin Speakers',
    problemThai: 'Thai Speakers',
    problemSpanish: 'Spanish Speakers',
    insightTitle: 'The Real Problem',
    insightText: 'These errors persist not because you\'re not trying - but because your ear never learned to tell those sounds apart. Traditional pronunciation apps focus on speaking, but you can\'t pronounce what you can\'t hear.',
    
  // Solution Section
    solutionBadge: 'The Solution',
  solutionTitle: 'Retrain Your Brain, Hear Like a Native',
  solutionDescription: 'Soundwise uses neuroscience-backed listening drills to rewire your auditory perception. Through strategic sound comparisons, your brain learns to automatically recognize distinctions it previously missed.',
    feature1: 'Listen and compare - No speaking required',
    feature2: 'IPA notation included - See exact phonetic symbols for each sound',
    feature3: 'Immediate visual feedback - Know instantly if you\'re correct',
    feature4: 'Adaptive difficulty - Focuses on your specific challenges',
    feature5: 'Practice anywhere - Just headphones, no microphone',
    
    // How It Works
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Three simple steps to better pronunciation perception',
    step1Title: 'Listen',
    step1Text: 'Hear a word or sound that challenges speakers of your native language',
    step2Title: 'Choose',
    step2Text: 'Select which word you heard from a minimal pair (e.g., "ship" or "sheep")',
    step3Title: 'Learn',
    step3Text: 'Get instant feedback and watch your accuracy improve over time',
    
    // Progress Tracking
    progressBadge: 'Track Your Improvement',
    progressTitle: 'See Your Progress in Real-Time',
    progressDescription: 'The app tracks every practice session and shows you exactly how your perception accuracy improves. Watch your comprehension climb as your brain builds new neural pathways.',
    progressFeature1: 'Accuracy trends - See your improvement over time with detailed charts',
    progressFeature2: 'Practice goals - Aim for 60 minutes per pair to master each sound',
    progressFeature3: 'Multiple pairs - Practice different sound contrasts and track each separately',
    progressFeature4: 'Automatic saving - Your progress is saved automatically after every session',
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
    featuresTitle: 'Everything You Need to Master English Sounds',
    featureCard1Title: 'Personalized to Your L1',
    featureCard1Text: 'Focuses on the specific sound pairs that challenge speakers of your native language',
    featureCard2Title: 'Multiple Languages',
    featureCard2Text: 'Interface available in 14 languages, with support for learners worldwide',
    featureCard3Title: 'Native Speaker Audio',
    featureCard3Text: 'Choose between British and American English accents for authentic pronunciation',
    featureCard4Title: 'Track Progress',
    featureCard4Text: 'See your perception accuracy improve over time with detailed charts and statistics',
    featureCard5Title: 'Quick Sessions',
    featureCard5Text: '10-15 minutes daily is all you need. Work toward 60 minutes per sound pair',
    featureCard6Title: 'Auto-Save Progress',
    featureCard6Text: 'Your results are automatically saved after every practice session',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faq1Question: 'Why don\'t I need a microphone?',
    faq1Answer: 'The core problem isn\'t your speaking - it\'s your perception. You can\'t pronounce sounds you can\'t hear. By training your ear first through listening exercises, speaking improvement follows naturally. No recording or speech analysis needed.',
    faq2Question: 'How long until I see results?',
    faq2Answer: 'Most learners notice improved perception within 2-3 weeks of daily practice (10-15 minutes). Your brain needs time to build new neural pathways for sound discrimination, but the changes are measurable and permanent.',
    faq3Question: 'Is this suitable for my native language?',
    faq3Answer: 'Yes! The app includes targeted minimal pairs for speakers of Japanese, Mandarin, Spanish, Thai, Korean, Arabic, Vietnamese, and many other languages. The exercises adapt to the specific phonemic challenges of your L1 background.',
    faq4Question: 'Can I use this alongside other learning methods?',
  faq4Answer: 'Absolutely! Soundwise complements any English learning program. Think of it as specialized ear training that makes all your other practice more effective. Once you can hear the differences, speaking practice becomes much more productive.',
    faq5Question: 'What if I\'m an advanced learner?',
    faq5Answer: 'Even advanced speakers often have perception blind spots from their L1. The app\'s adaptive algorithm will quickly identify your specific challenges and focus on those, making it valuable at any level.',
    
  // Final CTA
    ctaTitle: 'Ready to Finally Hear the Difference?',
  ctaSubtitle: 'Get lifetime access for just $4.99.',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'Download on the',
    getItOn: 'Get it on',
    ctaFeature1: 'One-time payment',
    ctaFeature2: 'No subscription',
    ctaFeature3: 'Works on all devices',
    
  // Footer
  footerTagline: 'Neuroscience-backed listening drills to help you hear English like a native.',
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
    navCta: '今すぐ体験する',
    heroBadge: '科学的「英語耳」再構築',
    heroTitle: '「聞き取れない」を「聞こえる」へ',
    heroHighlight1: '「Right」',
    heroHighlight2: '「Light」',
    heroSubtitle: 'Soundwiseは、ワシントン大学等の研究に基づく「音素識別トレーニング」で、あなたの脳に眠っている聴覚能力を呼び覚まします。マイク不要。周囲を気にせず、どこでも「耳」から変える。',
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
    ctaPrimary: '今すぐ体験する',
    ctaSecondary: '科学的根拠を詳しく見る',
    
    stat1Number: '5万+',
    stat1Label: 'アクティブ学習者',
    stat2Number: '60分',
    stat2Label: '各ペア目標',
    stat3Number: '120+',
    stat3Label: 'ヶ国',
    
    problemTitle: '「聞き取れない」のは、あなたの努力不足ではありません',
    problemSubtitle: '脳が英語の音を「ノイズ」として処理しているだけなのです。',
    problemJapanese: '日本語話者',
    problemMandarin: '中国語話者',
    problemThai: 'タイ語話者',
    problemSpanish: 'スペイン語話者',
    insightTitle: '日本人が直面する本当の課題',
    insightText: '聞き取れない音は、正しく発音することもできません。まずは「耳の解像度」を上げること。それが地道に見えて、最も効率的な近道です。',
    
    solutionBadge: '解決策',
    solutionTitle: '「話す」前に「聞く」。心理的ハードルをゼロに',
  solutionDescription: 'Soundwiseは、「誰にも聞かれずに、一人で、視覚的に正誤を確認できる」環境を提供します。何千もの戦略的比較を通じて、以前は検出できなかった音を区別できるようになります。',
    feature1: '聴いて比較 - 誰にも聞かれず学習',
    feature2: 'IPA表記付き - 各音の正確な音声記号を確認',
    feature3: '即座の視覚的フィードバック - ゲーム感覚で継続',
    feature4: '適応型難易度 - あなた特有の課題に焦点',
    feature5: 'どこでも練習 - マイク不要、通勤中も最適',
    
    howItWorksTitle: '仕組み',
    howItWorksSubtitle: '発音認識向上のための3ステップ',
    step1Title: '聴く',
    step1Text: 'あなたの母国語（日本語）話者が特に苦手とする音のペアを聴きます',
    step2Title: '選ぶ',
    step2Text: '聴こえた単語を直感的に選択。迷うことが脳への刺激になります',
    step3Title: '学ぶ',
    step3Text: 'AIがあなたの苦手な音を分析し、難易度をリアルタイムで最適化します',
    
    progressBadge: '進捗を追跡',
    progressTitle: 'リアルタイムで進捗を確認',
    progressDescription: 'アプリはすべての練習セッションを追跡し、認識精度がどのように向上するかを正確に表示します。TOEIC・英検対策にも直結する「聴覚の土台」を作ります。',
    progressFeature1: '精度トレンド - 詳細なグラフで時間の経過とともに改善を確認',
    progressFeature2: '練習目標 - 各音のマスターに60分を目指す',
    progressFeature3: '複数のペア - 異なる音のコントラストを練習し、それぞれを個別に追跡',
    progressFeature4: '自動保存 - セッション後に進捗が自動保存',
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
    
    featuresTitle: '英語の音をマスターするために必要なすべて',
    featureCard1Title: 'L1に合わせてパーソナライズ',
    featureCard1Text: 'あなたの母国語話者が苦手とする特定の音のペアに焦点',
    featureCard2Title: '多言語対応',
    featureCard2Text: '14言語でインターフェースを提供、世界中の学習者をサポート',
    featureCard3Title: 'ネイティブスピーカーの音声',
    featureCard3Text: '本物の発音のために英国または米国英語のアクセントを選択',
    featureCard4Title: '確実な進捗管理',
    featureCard4Text: '詳細なグラフと統計で、時間の経過とともに認識精度が向上する様子を確認',
    featureCard5Title: '短時間セッション',
    featureCard5Text: '1日10-15分で十分。音のペアごとに60分を目指す',
    featureCard6Title: '自動保存',
    featureCard6Text: '練習セッション後に結果が自動的に保存されます',
    
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
    
    ctaTitle: '英語の「音」の正体を知る準備はできましたか？',
  ctaSubtitle: '$4.99の1回払いで、一生モノの「英語耳」を手に入れる。',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'ダウンロード',
    getItOn: '入手先',
    ctaFeature1: '一回限りの支払い',
    ctaFeature2: 'サブスクリプションなし',
    ctaFeature3: 'すべてのデバイスで動作',
    
    footerTagline: '世界中の英語学習者のための科学的根拠に基づく発音認識トレーニング。',
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
    navCta: '立即开启进化之旅',
    heroBadge: '科学重塑大脑听觉图谱',
    heroTitle: '打破听觉盲区，解锁职场"语言资本"',
    heroHighlight1: 'Sheep',
    heroHighlight2: 'Ship',
    heroSubtitle: '数百万中国学习者即便通过了四六级，仍难以在地道交流中自如表达。Soundwise 采用经科研验证的"听觉剥离练习"，助你分辨母语中不存在的英语细微音差——**无需麦克风，只需你的双耳。**',
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
    ctaPrimary: '立即开启进化之旅',
    ctaSecondary: '了解智能自适应原理',
    
    stat1Number: '5万+',
    stat1Label: '活跃学习者',
    stat2Number: '60分钟',
    stat2Label: '每对声音',
    stat3Number: '120+',
    stat3Label: '个国家',
    
    problemTitle: '"听不出"不是因为不努力，而是大脑尚未"建模"',
    problemSubtitle: '中国学习者的发音困难往往源于中文与英文音韵系统的巨大差异。你的大脑会自动将陌生的英语音位过滤成最接近的中文读音。',
    problemJapanese: '日语使用者',
    problemMandarin: '中文使用者',
    problemThai: '泰语使用者',
    problemSpanish: '西班牙语使用者',
    insightTitle: '核心问题',
    insightText: '传统应用逼你直接开口，但如果你听不到那个声音，你永远也发不出那个声音。**先重塑听觉，口语自然地道。**',
    
    solutionBadge: '解决方案',
    solutionTitle: '智能自适应练习：三步建立神经通路',
    solutionDescription: '系统根据中国学习者的特定难点（如辅音丛、词尾辅音丢失），自动匹配高频词对。利用 AI 算法进行毫秒级反馈，这种"智能适配"模拟了金牌教师的一对一辅导，学习效率远超枯燥跟读。',
    feature1: '听取挑战音对 - 针对中国学习者特定难点',
    feature2: '极简二选一 - 通过"最小对立对"练习训练大脑',
    feature3: '即时视觉反馈 - AI毫秒级反馈',
    feature4: '智能自适应 - 模拟金牌教师一对一辅导',
    feature5: '随处练习 - 只需耳机，无需麦克风',
    
    howItWorksTitle: '工作原理',
    howItWorksSubtitle: '智能自适应练习：三步建立神经通路',
    step1Title: '听取挑战音对',
    step1Text: '系统根据中国学习者的特定难点（如辅音丛、词尾辅音丢失），自动匹配高频词对',
    step2Title: '极简二选一',
    step2Text: '在"最小对立对"练习中，通过大量策略性比较，训练大脑识别微小差别的能力',
    step3Title: '即时视觉反馈',
    step3Text: '利用 AI 算法进行毫秒级反馈，这种"智能适配"模拟了金牌教师的一对一辅导',
    
    progressBadge: '追踪你的进步',
    progressTitle: '查看我的进步曲线',
    progressDescription: '应用追踪每次练习并准确显示你的感知准确性如何提高。观察你的理解力随着大脑建立新的神经通路而攀升。',
    progressFeature1: '准确度趋势 - 通过详细图表查看随时间的改进',
    progressFeature2: '练习目标 - 每对声音达到60分钟以掌握每个声音',
    progressFeature3: '多个对 - 练习不同的声音对比并分别追踪',
    progressFeature4: '自动保存 - 每次练习后自动保存进度',
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
    
    testimonialsTitle: '学习者证言 - 增强"活人感"',
    testimonial1: '为了改掉 TH 读成 S 的习惯，我练了 5 年。用了 Soundwise 3 周后，那种"大脑突然开窍"的感觉太震撼了。现在开跨国会议自信多了。',
    testimonial1Author: 'Wei L.',
    testimonial1Location: '产品经理，北京',
    testimonial2: '以前我分不清 sheep 和 ship，总觉得老外在吹毛求疵。现在我终于能捕捉到那个音差了。这是我用过最不"预制"、最有成效的英语工具。',
    testimonial2Author: 'Yuki M.',
    testimonial2Location: '设计师，东京',
    testimonial3: '没有其他应用首先专注于听力。这是每个发音学习者需要的。简单但非常有效。',
    testimonial3Author: 'Carlos R.',
    testimonial3Location: '马德里，西班牙',
    
    featuresTitle: '掌握英语声音所需的一切',
    featureCard1Title: '个性化至您的母语',
    featureCard1Text: '专注于挑战你母语使用者的特定声音对',
    featureCard2Title: '多语言',
    featureCard2Text: '界面提供14种语言，支持全球学习者',
    featureCard3Title: '母语者音频',
    featureCard3Text: '选择英式或美式英语口音以获得真实发音',
    featureCard4Title: '追踪进度',
    featureCard4Text: '通过详细图表和统计数据查看随时间提高的感知准确性',
    featureCard5Title: '快速课程',
    featureCard5Text: '每天只需10-15分钟。每个声音对努力达到60分钟',
    featureCard6Title: '自动保存进度',
    featureCard6Text: '每次练习后自动保存你的结果',
    
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
    
    ctaTitle: '准备好开启你的"听觉进化"了吗？',
    ctaSubtitle: '仅需 $4.99，终身解锁英语母语者的敏锐度。',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: '下载于',
    getItOn: '获取应用',
    ctaFeature1: '一次性付费',
    ctaFeature2: '无订阅陷阱',
    ctaFeature3: '支持所有设备',
    
    footerTagline: '面向全球英语学习者的科学支持的发音感知训练。',
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
    navCta: 'Empezar',
    heroBadge: 'Aprendizaje Respaldado por la Ciencia',
    heroTitle: 'Finalmente Escucha la Diferencia Entre',
    heroHighlight1: '"Ship"',
    heroHighlight2: '"Sheep"',
    heroSubtitle: 'Entrena tu oído para percibir sonidos del inglés que no podías escuchar antes. Práctica de escucha comprobada científicamente - sin necesidad de micrófono.',
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
    ctaPrimary: 'Comenzar Entrenamiento',
    ctaSecondary: 'Ver Cómo Funciona',
    
    stat1Number: '50K+',
    stat1Label: 'Estudiantes Activos',
    stat2Number: '60 min',
    stat2Label: 'Por Par de Sonidos',
    stat3Number: '120+',
    stat3Label: 'Países',
    
    problemTitle: 'No Es Tu Culpa No Poder Escuchar Estos Sonidos',
    problemSubtitle: 'Tu cerebro no fue entrenado para distinguir sonidos que no existen en tu idioma nativo.',
    problemJapanese: 'Hablantes de Japonés',
    problemMandarin: 'Hablantes de Mandarín',
    problemThai: 'Hablantes de Tailandés',
    problemSpanish: 'Hablantes de Español',
    insightTitle: 'El Verdadero Problema',
    insightText: 'Estos errores persisten no porque no estés intentando - sino porque tu oído nunca aprendió a diferenciar esos sonidos. Las apps tradicionales de pronunciación se enfocan en hablar, pero no puedes pronunciar lo que no puedes escuchar.',
    
    solutionBadge: 'La Solución',
    solutionTitle: 'Entrena Tu Oído Primero, El Habla Viene Después',
  solutionDescription: 'Soundwise usa práctica de escucha enfocada para recablear tu percepción auditiva. A través de miles de comparaciones estratégicas, tu cerebro aprende a distinguir sonidos que antes no podía detectar.',
    feature1: 'Escuchar y comparar - No se requiere hablar',
    feature2: 'Notación IPA incluida - Ve los símbolos fonéticos exactos para cada sonido',
    feature3: 'Retroalimentación visual inmediata - Sabe instantáneamente si estás correcto',
    feature4: 'Dificultad adaptativa - Se enfoca en tus desafíos específicos',
    feature5: 'Practica en cualquier lugar - Solo auriculares, sin micrófono',
    
    howItWorksTitle: 'Cómo Funciona',
    howItWorksSubtitle: 'Tres pasos simples para mejorar la percepción de pronunciación',
    step1Title: 'Escuchar',
    step1Text: 'Escucha una palabra o sonido que desafía a hablantes de tu idioma nativo',
    step2Title: 'Elegir',
    step2Text: 'Selecciona qué palabra escuchaste de un par mínimo (ej. "ship" o "sheep")',
    step3Title: 'Aprender',
    step3Text: 'Obtén retroalimentación instantánea y observa cómo mejora tu precisión con el tiempo',
    
    progressBadge: 'Rastrea Tu Mejora',
    progressTitle: 'Ve Tu Progreso en Tiempo Real',
    progressDescription: 'La app rastrea cada sesión de práctica y te muestra exactamente cómo mejora tu precisión de percepción. Observa cómo tu comprensión sube mientras tu cerebro construye nuevas vías neurales.',
    progressFeature1: 'Tendencias de precisión - Ve tu mejora con el tiempo con gráficos detallados',
    progressFeature2: 'Objetivos de práctica - Apunta a 60 minutos por par para dominar cada sonido',
    progressFeature3: 'Múltiples pares - Practica diferentes contrastes de sonido y rastrea cada uno por separado',
    progressFeature4: 'Guardado automático - Tu progreso se guarda automáticamente después de cada sesión',
    timePracticed: 'Tiempo practicado:',
    minutes: 'minutos',
    
    scienceBadge: 'Método Respaldado por Investigación',
    scienceTitle: 'Basado en Ciencia de Percepción Fonémica',
    scienceCard1Title: 'La Investigación',
    scienceCard1Text: 'Basado en los estudios de desarrollo del lenguaje infantil de Patricia Kuhl (Universidad de Washington) y McClelland, Fiez y McCandliss (2002) sobre enseñanza de discriminación fonémica a adultos. Estos estudios muestran que la exposición temprana moldea qué distinciones de sonido se perciben como significativas.',
    scienceCard2Title: 'Por Qué Funciona',
    scienceCard2Text: 'Tu cerebro es neuroplástico - puede ser reentrenado. Adultos japoneses mejoraron de 50% a 70-80% de precisión distinguiendo /r/ y /l/ con retroalimentación visual inmediata. La práctica repetida con pares mínimos crea nuevas vías neurales para la discriminación de sonidos.',
    scienceCard3Title: 'Resultados Comprobados',
    scienceCard3Text: 'Después de solo tres sesiones de 20 minutos, los escaneos cerebrales revelaron nuevos patrones de activación mostrando que los mapas perceptivos habían sido recableados. La práctica consistente produce mejoras medibles y permanentes en la precisión de percepción.',
    
    testimonialsTitle: 'Estudiantes de Todo el Mundo Están Escuchando la Diferencia',
    testimonial1: 'Durante 5 años no podía distinguir "right" de "light". Después de 3 semanas con esta app, ¡finalmente puedo escucharlo! Esto cambió todo.',
    testimonial1Author: 'Yuki M.',
    testimonial1Location: 'Tokio, Japón',
    testimonial2: 'Me daba vergüenza pedir "thin crust pizza" y recibir miradas confundidas. ¡Ahora realmente puedo escuchar la diferencia entre los sonidos th y s!',
    testimonial2Author: 'Wei L.',
    testimonial2Location: 'Pekín, China',
    testimonial3: 'Ninguna otra app se enfoca en ESCUCHAR primero. Esto es lo que todo estudiante de pronunciación necesita. Simple pero increíblemente efectivo.',
    testimonial3Author: 'Carlos R.',
    testimonial3Location: 'Madrid, España',
    
    featuresTitle: 'Todo Lo Que Necesitas Para Dominar Los Sonidos del Inglés',
    featureCard1Title: 'Personalizado a Tu L1',
    featureCard1Text: 'Se enfoca en los pares de sonidos específicos que desafían a hablantes de tu idioma nativo',
    featureCard2Title: 'Múltiples Idiomas',
    featureCard2Text: 'Interfaz disponible en 14 idiomas, con soporte para estudiantes de todo el mundo',
    featureCard3Title: 'Audio de Hablantes Nativos',
    featureCard3Text: 'Elige entre acentos de inglés británico y americano para pronunciación auténtica',
    featureCard4Title: 'Rastrea Progreso',
    featureCard4Text: 'Ve cómo mejora tu precisión de percepción con el tiempo con gráficos y estadísticas detalladas',
    featureCard5Title: 'Sesiones Rápidas',
    featureCard5Text: '10-15 minutos diarios es todo lo que necesitas. Trabaja hacia 60 minutos por par de sonidos',
    featureCard6Title: 'Guardado Automático de Progreso',
    featureCard6Text: 'Tus resultados se guardan automáticamente después de cada sesión de práctica',
    
    faqTitle: 'Preguntas Frecuentes',
    faq1Question: '¿Por qué no necesito un micrófono?',
    faq1Answer: 'El problema central no es tu habla - es tu percepción. No puedes pronunciar sonidos que no puedes escuchar. Al entrenar tu oído primero a través de ejercicios de escucha, la mejora del habla sigue naturalmente. No se necesita grabación o análisis de voz.',
    faq2Question: '¿Cuánto tiempo hasta ver resultados?',
    faq2Answer: 'La mayoría de los estudiantes notan mejora en la percepción dentro de 2-3 semanas de práctica diaria (10-15 minutos). Tu cerebro necesita tiempo para construir nuevas vías neurales para discriminación de sonidos, pero los cambios son medibles y permanentes.',
    faq3Question: '¿Es adecuado para mi idioma nativo?',
    faq3Answer: '¡Sí! La app incluye pares mínimos dirigidos para hablantes de japonés, mandarín, español, tailandés, coreano, árabe, vietnamita y muchos otros idiomas. Los ejercicios se adaptan a los desafíos fonémicos específicos de tu antecedente L1.',
    faq4Question: '¿Puedo usar esto junto con otros métodos de aprendizaje?',
  faq4Answer: '¡Absolutamente! Soundwise complementa cualquier programa de aprendizaje de inglés. Piensa en ello como entrenamiento especializado del oído que hace toda tu otra práctica más efectiva. Una vez que puedes escuchar las diferencias, la práctica del habla se vuelve mucho más productiva.',
    faq5Question: '¿Qué pasa si soy un estudiante avanzado?',
    faq5Answer: 'Incluso los hablantes avanzados a menudo tienen puntos ciegos de percepción de su L1. El algoritmo adaptativo de la app identificará rápidamente tus desafíos específicos y se enfocará en ellos, haciéndolo valioso en cualquier nivel.',
    
    ctaTitle: '¿Listo Para Finalmente Escuchar la Diferencia?',
  ctaSubtitle: 'Obtén acceso de por vida por solo $4.99.',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'Descargar en',
    getItOn: 'Disponible en',
    ctaFeature1: 'Pago único',
    ctaFeature2: 'Sin suscripción',
    ctaFeature3: 'Funciona en todos los dispositivos',
    
    footerTagline: 'Entrenamiento de percepción de pronunciación respaldado por la ciencia para estudiantes de inglés en todo el mundo.',
    footerProduct: 'Producto',
    footerFeatures: 'Características',
    footerHowItWorks: 'Cómo Funciona',
    footerLegal: 'Legal y Soporte',
    footerFAQ: 'FAQ',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos de Servicio',
    footerContact: 'Contacto',
  footerCopyright: '© 2025 Soundwise. Todos los derechos reservados.',
  },
  
  'ภาษาไทย': {
    name: 'ภาษาไทย',
    flag: '🇹🇭',
    navCta: 'เริ่มต้น',
    heroBadge: 'การเรียนรู้ที่ได้รับการสนับสนุนทางวิทยาศาสตร์',
    heroTitle: 'ได้ยินความแตกต่างในที่สุด',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
    heroSubtitle: 'ฝึกหูของคุณให้รับรู้เสียงภาษาอังกฤษที่คุณไม่เคยได้ยินมาก่อน การฝึกฟังที่พิสูจน์แล้วโดยการวิจัย - ไม่ต้องใช้ไมโครโฟน',
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
    ctaPrimary: 'เริ่มฝึกฝน',
    ctaSecondary: 'ดูวิธีการทำงาน',
    
    stat1Number: '50K+',
    stat1Label: 'ผู้เรียนที่ใช้งาน',
    stat2Number: '60 นาที',
    stat2Label: 'ต่อคู่เสียง',
    stat3Number: '120+',
    stat3Label: 'ประเทศ',
    
    problemTitle: 'ไม่ใช่ความผิดของคุณที่ได้ยินเสียงเหล่านี้ไม่ออก',
    problemSubtitle: 'สมองของคุณไม่ได้รับการฝึกให้แยกแยะเสียงที่ไม่มีอยู่ในภาษาแม่ของคุณ',
    problemJapanese: 'ผู้พูดภาษาญี่ปุ่น',
    problemMandarin: 'ผู้พูดภาษาจีนกลาง',
    problemThai: 'ผู้พูดภาษาไทย',
    problemSpanish: 'ผู้พูดภาษาสเปน',
    insightTitle: 'ปัญหาที่แท้จริง',
    insightText: 'ข้อผิดพลาดเหล่านี้ยังคงอยู่ไม่ใช่เพราะคุณไม่พยายาม - แต่เพราะหูของคุณไม่เคยเรียนรู้ที่จะแยกเสียงเหล่านั้นออกจากกัน แอปออกเสียงแบบดั้งเดิมเน้นการพูด แต่คุณไม่สามารถออกเสียงสิ่งที่คุณไม่สามารถได้ยินได้',
    
    solutionBadge: 'วิธีแก้ปัญหา',
    solutionTitle: 'ฝึกหูก่อน การพูดจะตามมา',
  solutionDescription: 'Soundwise ใช้การฝึกฟังที่มุ่งเน้นเพื่อเชื่อมต่อการรับรู้ทางการได้ยินของคุณใหม่ ผ่านการเปรียบเทียบเชิงกลยุทธ์หลายพันครั้ง สมองของคุณเรียนรู้ที่จะแยกแยะเสียงที่เคยไม่สามารถตรวจจับได้',
    feature1: 'ฟังและเปรียบเทียบ - ไม่ต้องพูด',
    feature2: 'รวมสัญกรณ์ IPA - ดูสัญลักษณ์ทางสัทศาสตร์ที่แม่นยำสำหรับแต่ละเสียง',
    feature3: 'ข้อเสนอแนะด้วยภาพทันที - รู้ทันทีว่าคุณถูกต้องหรือไม่',
    feature4: 'ความยากปรับตัวได้ - เน้นที่ความท้าทายเฉพาะของคุณ',
    feature5: 'ฝึกได้ทุกที่ - เพียงหูฟัง ไม่ต้องใช้ไมโครโฟน',
    
    howItWorksTitle: 'วิธีการทำงาน',
    howItWorksSubtitle: 'สามขั้นตอนง่ายๆ เพื่อการรับรู้การออกเสียงที่ดีขึ้น',
    step1Title: 'ฟัง',
    step1Text: 'ได้ยินคำหรือเสียงที่ท้าทายผู้พูดภาษาแม่ของคุณ',
    step2Title: 'เลือก',
    step2Text: 'เลือกว่าคุณได้ยินคำใดจากคู่น้อยที่สุด (เช่น "ship" หรือ "sheep")',
    step3Title: 'เรียนรู้',
    step3Text: 'รับข้อเสนอแนะทันทีและดูความแม่นยำของคุณดีขึ้นเมื่อเวลาผ่านไป',
    
    progressBadge: 'ติดตามการปรับปรุงของคุณ',
    progressTitle: 'ดูความคืบหน้าของคุณแบบเรียลไทม์',
    progressDescription: 'แอปติดตามทุกเซสชันการฝึกและแสดงให้คุณเห็นว่าความแม่นยำในการรับรู้ของคุณดีขึ้นอย่างไร ดูความเข้าใจของคุณสูงขึ้นขณะที่สมองของคุณสร้างเส้นทางประสาทใหม่',
    progressFeature1: 'แนวโน้มความแม่นยำ - ดูการปรับปรุงของคุณเมื่อเวลาผ่านไปด้วยแผนภูมิโดยละเอียด',
    progressFeature2: 'เป้าหมายการฝึก - มุ่งเป้าไปที่ 60 นาทีต่อคู่เพื่อฝึกฝนแต่ละเสียง',
    progressFeature3: 'หลายคู่ - ฝึกความแตกต่างของเสียงที่แตกต่างกันและติดตามแต่ละอย่างแยกกัน',
    progressFeature4: 'บันทึกอัตโนมัติ - ความคืบหน้าของคุณถูกบันทึกโดยอัตโนมัติหลังจากทุกเซสชัน',
    timePracticed: 'เวลาที่ฝึก:',
    minutes: 'นาที',
    
    scienceBadge: 'วิธีการที่ได้รับการสนับสนุนจากการวิจัย',
    scienceTitle: 'สร้างขึ้นจากวิทยาศาสตร์การรับรู้หน่วยเสียง',
    scienceCard1Title: 'การวิจัย',
    scienceCard1Text: 'ตามการศึกษาการพัฒนาภาษาของทารกของ Patricia Kuhl (มหาวิทยาลัยวอชิงตัน) และ McClelland, Fiez และ McCandliss (2002) เกี่ยวกับการสอนการแยกแยะหน่วยเสียงให้กับผู้ใหญ่ การศึกษาเหล่านี้แสดงให้เห็นว่าการสัมผัสในระยะเริ่มต้นกำหนดความแตกต่างของเสียงใดที่ถูกรับรู้ว่ามีความหมาย',
    scienceCard2Title: 'ทำไมมันถึงได้ผล',
    scienceCard2Text: 'สมองของคุณมีความยืดหยุ่นทางประสาท - สามารถฝึกใหม่ได้ ผู้ใหญ่ชาวญี่ปุ่นปรับปรุงความแม่นยำในการแยกแยะ /r/ และ /l/ จาก 50% เป็น 70-80% ด้วยข้อเสนอแนะภาพทันที การฝึกคู่น้อยที่สุดซ้ำๆ สร้างเส้นทางประสาทใหม่สำหรับการแยกแยะเสียง',
    scienceCard3Title: 'ผลลัพธ์ที่พิสูจน์แล้ว',
    scienceCard3Text: 'หลังจากเพียงสามเซสชัน 20 นาที การสแกนสมองเผยให้เห็นรูปแบบการกระตุ้นใหม่แสดงให้เห็นว่าแผนที่การรับรู้ได้ถูกเชื่อมต่อใหม่ การฝึกที่สม่ำเสมอสร้างการปรับปรุงความแม่นยำการรับรู้ที่วัดได้และถาวร',
    
    testimonialsTitle: 'ผู้เรียนทั่วโลกกำลังได้ยินความแตกต่าง',
    testimonial1: 'เป็นเวลา 5 ปีที่ฉันไม่สามารถแยก "right" จาก "light" หลังจาก 3 สัปดาห์กับแอปนี้ ในที่สุดฉันก็ได้ยิน! นี่เปลี่ยนทุกอย่าง',
    testimonial1Author: 'ยูกิ M.',
    testimonial1Location: 'โตเกียว ประเทศญี่ปุ่น',
    testimonial2: 'ฉันรู้สึกอับอายมากเมื่อสั่ง "thin crust pizza" และได้รับสายตาสับสน ตอนนี้ฉันสามารถได้ยินความแตกต่างระหว่างเสียง th และ s ได้จริงๆ!',
    testimonial2Author: 'เหว่ย L.',
    testimonial2Location: 'ปักกิ่ง ประเทศจีน',
    testimonial3: 'ไม่มีแอปอื่นใดที่เน้นการฟังก่อน นี่คือสิ่งที่ผู้เรียนการออกเสียงทุกคนต้องการ เรียบง่ายแต่มีประสิทธิภาพอย่างเหลือเชื่อ',
    testimonial3Author: 'คาร์ลอส R.',
    testimonial3Location: 'มาดริด ประเทศสเปน',
    
    featuresTitle: 'ทุกสิ่งที่คุณต้องการเพื่อเชี่ยวชาญเสียงภาษาอังกฤษ',
    featureCard1Title: 'ปรับแต่งตาม L1 ของคุณ',
    featureCard1Text: 'เน้นคู่เสียงเฉพาะที่ท้าทายผู้พูดภาษาแม่ของคุณ',
    featureCard2Title: 'หลายภาษา',
    featureCard2Text: 'อินเทอร์เฟซมีให้ใช้งาน 14 ภาษา พร้อมการสนับสนุนสำหรับผู้เรียนทั่วโลก',
    featureCard3Title: 'เสียงจากเจ้าของภาษา',
    featureCard3Text: 'เลือกระหว่างสำเนียงอังกฤษและอเมริกันสำหรับการออกเสียงที่แท้จริง',
    featureCard4Title: 'ติดตามความคืบหน้า',
    featureCard4Text: 'ดูความแม่นยำในการรับรู้ของคุณดีขึ้นเมื่อเวลาผ่านไปด้วยแผนภูมิและสถิติโดยละเอียด',
    featureCard5Title: 'เซสชันรวดเร็ว',
    featureCard5Text: '10-15 นาทีต่อวันก็เพียงพอแล้ว ทำงานไปที่ 60 นาทีต่อคู่เสียง',
    featureCard6Title: 'บันทึกความคืบหน้าอัตโนมัติ',
    featureCard6Text: 'ผลลัพธ์ของคุณถูกบันทึกโดยอัตโนมัติหลังจากทุกเซสชันการฝึก',
    
    faqTitle: 'คำถามที่พบบ่อย',
    faq1Question: 'ทำไมฉันไม่ต้องการไมโครโฟน?',
    faq1Answer: 'ปัญหาหลักไม่ใช่การพูดของคุณ - มันคือการรับรู้ของคุณ คุณไม่สามารถออกเสียงเสียงที่คุณไม่สามารถได้ยิน การฝึกหูของคุณก่อนผ่านแบบฝึกหัดการฟัง การปรับปรุงการพูดจะตามมาเอง ไม่ต้องการการบันทึกหรือการวิเคราะห์เสียง',
    faq2Question: 'ใช้เวลานานแค่ไหนจนกว่าจะเห็นผล?',
    faq2Answer: 'ผู้เรียนส่วนใหญ่สังเกตเห็นการปรับปรุงการรับรู้ภายใน 2-3 สัปดาห์ของการฝึกประจำวัน (10-15 นาที) สมองของคุณต้องใช้เวลาในการสร้างเส้นทางประสาทใหม่สำหรับการแยกแยะเสียง แต่การเปลี่ยนแปลงนั้นวัดได้และถาวร',
    faq3Question: 'เหมาะสมกับภาษาแม่ของฉันหรือไม่?',
    faq3Answer: 'ใช่! แอปรวมคู่น้อยที่สุดที่กำหนดเป้าหมายสำหรับผู้พูดภาษาญี่ปุ่น จีนกลาง สเปน ไทย เกาหลี อาหรับ เวียดนาม และอีกหลายภาษา แบบฝึกหัดปรับตัวให้เข้ากับความท้าทายทางหน่วยเสียงเฉพาะของพื้นฐาน L1 ของคุณ',
    faq4Question: 'ฉันสามารถใช้สิ่งนี้ร่วมกับวิธีการเรียนรู้อื่นได้หรือไม่?',
  faq4Answer: 'แน่นอน! Soundwise เสริมโปรแกรมการเรียนภาษาอังกฤษใดๆ คิดว่ามันเป็นการฝึกหูเฉพาะทางที่ทำให้การฝึกอื่นๆ ของคุณมีประสิทธิภาพมากขึ้น เมื่อคุณสามารถได้ยินความแตกต่าง การฝึกการพูดจะมีประสิทธิผลมากขึ้น',
    faq5Question: 'ถ้าฉันเป็นผู้เรียนระดับสูงล่ะ?',
    faq5Answer: 'แม้แต่ผู้พูดระดับสูงก็มักมีจุดบอดในการรับรู้จาก L1 ของพวกเขา อัลกอริทึมปรับตัวของแอปจะระบุความท้าทายเฉพาะของคุณอย่างรวดเร็วและเน้นที่สิ่งเหล่านั้น ทำให้มีคุณค่าในทุกระดับ',
    
    ctaTitle: 'พร้อมที่จะได้ยินความแตกต่างในที่สุดแล้วหรือยัง?',
  ctaSubtitle: 'รับสิทธิ์เข้าถึงตลอดชีพเพียง $4.99',
    appStore: 'App Store',
    googlePlay: 'Google Play',
    downloadOn: 'ดาวน์โหลดที่',
    getItOn: 'รับที่',
    ctaFeature1: 'ชำระเงินครั้งเดียว',
    ctaFeature2: 'ไม่มีการสมัครสมาชิก',
    ctaFeature3: 'ใช้งานได้บนทุกอุปกรณ์',
    
    footerTagline: 'การฝึกการรับรู้การออกเสียงที่ได้รับการสนับสนุนทางวิทยาศาสตร์สำหรับผู้เรียนภาษาอังกฤษทั่วโลก',
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
    navCta: '시작하기',
    heroBadge: '과학 기반 학습',
    heroTitle: '들리지 않던 영어가 들리는 기적, 당신의 ‘언어 자본’을 깨우세요',
    heroHighlight1: '"Right"',
    heroHighlight2: '"Light"',
    heroSubtitle: '과학으로 재설계하는 듣기 훈련. 대한민국 학습자들이 겪는 발음 고민의 핵심은 ‘노력’이 아닌 ‘청각 모델링’의 부재입니다. 마이크 없이 오직 듣기 훈련만으로 모국어(한국어)에 존재하지 않는 영어의 미세한 음역대를 마스터하세요.',
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
    ctaPrimary: '지금 시작하세요',
    ctaSecondary: '작동 원리 발견하기',
    
    stat1Number: '5만 명+',
    stat1Label: '학습자',
    stat2Number: '60분',
    stat2Label: '소리 쌍당',
    stat3Number: '120개국',
    stat3Label: '글로벌 플랫폼',
    
    problemTitle: '“안 들리는 것”은 당신의 잘못이 아닙니다. 대뇌가 아직 ‘매핑(Mapping)’되지 않았을 뿐입니다.',
    problemSubtitle: '한국어와 영어는 소리를 내는 방식(조음 방식) 자체가 다릅니다. 특히 다음의 차이는 한국인 학습자에게 가장 큰 장벽이 됩니다:',
    problemJapanese: '일본어 사용자',
    problemMandarin: '중국어 사용자',
    problemThai: '태국어 사용자',
    problemSpanish: '스페인어 사용자',
    insightTitle: '근본적인 문제',
    insightText: '<ul><li style="margin-bottom: 8px;"><b>Vowel Length (모음의 길이):</b> <b>ship (/ʃɪp/)</b>과 <b>sheep (/ʃiːp/)</b>을 구분하지 못하는 것은 한국어에 모음 길이의 의미 차이가 없기 때문입니다.</li><li style="margin-bottom: 8px;"><b>The Dark L (어두운 L):</b> 한국어의 ‘ㄹ’은 가벼운 소리(Light L)인 반면, 영어의 ball이나 tell 끝에 오는 소리는 혀 뒤쪽을 당기는 ‘어두운 소리’입니다. 우리 뇌는 이를 ‘ㅜ’나 ‘ㅗ’로 착각하곤 합니다.</li><li><b>The TH Sound (/θ/):</b> 한국어에 존재하지 않는 이 소리를 우리 뇌는 가장 유사한 ‘ㅅ’이나 ‘ㄷ’으로 필터링해 버립니다.</li></ul><br><b>핵심:</b> 소리를 명확히 구분해내지 못하면, 지불한 수백만 원의 회화 강의도 효과를 보기 어렵습니다. 먼저 귀를 훈련하십시오. 말하기는 저절로 따라옵니다.',
    
    solutionBadge: '경제적 가치',
    solutionTitle: '영어 실력은 곧 ‘언어 자본’—당신의 연봉과 커리어를 결정합니다.',
  solutionDescription: '치열한 대한민국 취업 시장과 글로벌 비즈니스 환경에서 영어 숙련도는 단순한 스펙을 넘어선 경제적 보상으로 이어집니다.',
    feature1: '<b>초임 연봉의 차이:</b> 연구에 따르면 높은 영어 숙련도는 대학 졸업생의 초기 연봉 및 직업적 경쟁력과 유의미한 상관관계를 가집니다.',
    feature2: '<b>완벽주의의 함정:</b> 한국인은 완벽한 문법에 집착하여 실수를 두려워합니다. Soundwise는 리스닝을 통해 자신감을 쌓아 실수의 공포를 제거합니다.',
    feature3: '',
    feature4: '',
    feature5: '',
    
    howItWorksTitle: '지능형 적응 학습: 3단계 뉴럴 트레이닝',
    howItWorksSubtitle: '',
    step1Title: '청취 (Listen)',
    step1Text: '한국인에게 특화된 고난도 음소 쌍(Minimal Pairs)을 듣습니다.',
    step2Title: '선택 (Select)',
    step2Text: '미세한 음성 차이를 직관적으로 구분하여 선택합니다.',
    step3Title: '학습 및 강화 (Learn)',
    step3Text: 'AI 알고리즘이 당신의 취약점을 실시간 분석하여 다음 연습 과제를 최적화합니다.',
    
    progressBadge: '개선 사항 추적',
    progressTitle: '실시간으로 진행 상황 확인',
    progressDescription: '앱은 모든 연습 세션을 추적하고 인식 정확도가 어떻게 향상되는지 정확히 보여줍니다. 두뇌가 새로운 신경 경로를 구축하는 동안 이해력이 상승하는 것을 지켜보세요.',
    progressFeature1: '정확도 추세 - 상세한 차트로 시간 경과에 따른 개선 확인',
    progressFeature2: '연습 목표 - 각 소리를 마스터하기 위해 쌍당 60분을 목표로',
    progressFeature3: '여러 쌍 - 다양한 소리 대비를 연습하고 각각을 개별적으로 추적',
    progressFeature4: '자동 저장 - 모든 세션 후 진행 상황이 자동으로 저장됨',
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
    
    featuresTitle: '영어 소리를 마스터하는 데 필요한 모든 것',
    featureCard1Title: 'L1에 맞춤화',
    featureCard1Text: '모국어 사용자에게 어려운 특정 소리 쌍에 집중',
    featureCard2Title: '다중 언어',
    featureCard2Text: '14개 언어로 인터페이스 제공, 전 세계 학습자 지원',
    featureCard3Title: '원어민 오디오',
    featureCard3Text: '진정한 발음을 위해 영국식 또는 미국식 영어 악센트 중 선택',
    featureCard4Title: '진행 상황 추적',
    featureCard4Text: '상세한 차트와 통계로 시간 경과에 따른 인식 정확도 향상 확인',
    featureCard5Title: '빠른 세션',
    featureCard5Text: '하루 10-15분이면 충분합니다. 소리 쌍당 60분을 목표로',
    featureCard6Title: '자동 저장 진행',
    featureCard6Text: '모든 연습 세션 후 결과가 자동으로 저장됩니다',
    
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
    
    ctaTitle: '영어 소리의 본질을 마스터할 준비가 되셨나요?',
  ctaSubtitle: '단 $4.99—한 번의 결제로 영구적인 청각 진화를 경험하세요. 일회성 결제 | 구독료 없음 | 모든 기기 동기화',
    appStore: 'App Store에서 다운로드',
    googlePlay: 'Google Play에서 받기',
    downloadOn: '다운로드',
    getItOn: '받기',
    ctaFeature1: '일회성 결제',
    ctaFeature2: '구독 없음',
    ctaFeature3: '모든 기기 동기화',
    
    footerTagline: '전 세계 영어 학습자를 위한 과학 기반 발음 인식 훈련.',
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

export const translations = {
  ...baseTranslations,
  ...additionalTranslations,
};

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
        }
      } else {
        element.innerHTML = translation;
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
  }
  
  // Store current language in HTML lang attribute
  document.documentElement.lang = lang === 'en' ? 'en' : lang;
}
