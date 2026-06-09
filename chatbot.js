/* =====================================================================
   ZibCore — Business Assistant
   Specialized FAQ chatbot for the ZibCore studio.
   Pure HTML/CSS/JS · no APIs · no backend · scoped to ZibCore topics only.
   ---------------------------------------------------------------------
   To edit answers, change the ZIBCORE_FAQ object below. Everything else
   can stay as-is.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     KNOWLEDGE BASE — edit responses, keywords, follow-ups here.
     =================================================================== */
  const ZIBCORE_FAQ = {
    botName: 'Business Assistant',
    brandName: 'ZibCore',

    welcome:
      "Hello — I'm the Business Assistant, the official FAQ chatbot for ZibCore. " +
      "I can answer questions about our websites, FAQ chatbots, pricing, timelines, what's included, ownership, and support. " +
      "For anything outside that, I'll be upfront and point you to the contact section. How can I help?",

    /* Used when input scores too low to confidently match a topic */
    fallback:
      "I'm not 100% sure what you're asking. I can help with questions about our websites, FAQ chatbots, pricing, timelines, ownership, or support. " +
      "If you'd like to talk to our team directly, scroll down to the contact section on this page.",

    /* Used when input is clearly off-topic (sports, jokes, weather, etc.) */
    offTopic:
      "I'm a focused assistant — I only answer questions about ZibCore's services. " +
      "I'd rather be honest than guess. Ask me about pricing, timelines, what's included, or our process. " +
      "For anything else, use the contact section on this page and our team will reply personally.",

    /* Used after the off-topic / fallback to nudge to safe topics */
    fallbackChips: ['What is ZibCore?', 'Pricing', 'What is included?', 'Contact'],

    /* Initial suggestion chips under the welcome message */
    suggestions: [
      'What is ZibCore?',
      'Why do I need a website?',
      'Pricing',
      'How long does it take?'
    ],

    /* Words/phrases that mean "this is clearly not a ZibCore question" */
    offTopicKeywords: [
      'weather', 'raining', 'temperature', 'forecast',
      'joke', 'jokes', 'funny', 'meme',
      'recipe', 'cook', 'cooking', 'bake', 'baking',
      'sports', 'football', 'basketball', 'soccer', 'baseball', 'cricket',
      'nba', 'nfl', 'fifa', 'world cup',
      'movie', 'film', 'netflix', 'show me', 'series', 'tv show',
      'music', 'song', 'lyrics', 'spotify', 'rap', 'taylor swift',
      'fortnite', 'gaming', 'playstation', 'xbox', 'minecraft',
      'news', 'politics', 'election', 'president', 'government',
      'celebrity', 'kardashian', 'gossip',
      'horoscope', 'zodiac', 'astrology',
      'crypto', 'bitcoin', 'ethereum', 'stock market', 'nasdaq', 'tesla stock',
      'medical advice', 'doctor', 'prescription', 'illness', 'diagnose',
      'dating', 'relationship advice',
      'religion', 'god',
      'meaning of life',
      'chatgpt', 'openai', 'gemini', 'claude ai', 'llm',
      'what time', 'whats the time',
      'math problem', 'solve for', 'calculate', 'integral',
      'translate', 'translation',
      'love poem', 'write me a', 'write a poem', 'write a story',
      'capital of', 'population of'
    ],

    entries: [

      /* ============ SMALLTALK ============ */
      {
        id: 'greeting',
        keywords: [
          'hello', 'hi there', 'hi', 'hey there', 'hey', 'hiya', 'howdy',
          'sup', 'whats up', 'whats good', 'whats poppin', 'yo',
          'good morning', 'good afternoon', 'good evening', 'gm'
        ],
        response:
          "Hello — happy to help. Ask me about ZibCore's services, pricing, timelines, or how this would work for your business.",
        followUps: ['What is ZibCore?', 'Pricing', 'How long does it take?']
      },
      {
        id: 'how-are-you',
        keywords: [
          'how are you', 'how r u', 'how you doing', 'how is it going',
          'you good', 'you alright', 'how are things'
        ],
        response:
          "All good and ready to answer your questions about ZibCore. What would you like to know first?",
        followUps: ['Pricing', 'Why do I need a chatbot?', 'How does it work?']
      },
      {
        id: 'thanks',
        keywords: ['thanks', 'thank you', 'thx', 'ty', 'cheers', 'appreciate', 'much love'],
        response: "You're welcome. Anything else you'd like to know about ZibCore's services?",
        followUps: ['Pricing', 'Contact', 'How does it work?']
      },
      {
        id: 'goodbye',
        keywords: ['bye', 'goodbye', 'see ya', 'see you', 'gotta go', 'gtg', 'take care', 'peace out'],
        response:
          "Take care. The chat will be here whenever you're ready — and the contact section is just below if you want to talk to our team directly.",
        followUps: []
      },
      {
        id: 'affirm',
        keywords: ['yes', 'yeah', 'yep', 'yup', 'sure', 'okay', 'ya', 'yh', 'definitely'],
        response: "Great — pick a topic below or just ask.",
        followUps: ['Pricing', 'How does it work?', 'Contact'],
        meta: 'short'
      },
      {
        id: 'deny',
        keywords: ['no', 'nope', 'nah', 'not really', 'no thanks'],
        response: "No problem. Anything else I can help with?",
        followUps: ['Pricing', 'What is included?', 'Contact'],
        meta: 'short'
      },
      {
        id: 'more-info',
        keywords: ['more', 'tell me more', 'more info', 'more information', 'continue', 'go on', 'explain', 'expand', 'more details'],
        response: "Sure — which topic would you like more detail on?",
        followUps: ['Pricing', 'What is included?', 'How does it work?', 'Why ZibCore?'],
        meta: 'more'
      },
      {
        id: 'idk',
        keywords: ['i dont know', 'idk', 'not sure', 'no idea', 'dunno', 'maybe'],
        response: "No worries. Here are common topics — pick whichever sounds useful.",
        followUps: ['What is ZibCore?', 'Pricing', 'Why do I need a chatbot?', 'Contact'],
        meta: 'short'
      },
      {
        id: 'interested',
        keywords: [
          'interested', 'i want to buy', 'sign me up', 'how do i start',
          'how to start', 'how to get started', 'lets go', 'lets do this',
          'i want one', 'i want a website', 'i want a chatbot',
          'ready to start', 'where do i sign'
        ],
        response:
          "Glad to hear it. The next step is a short call with our team — no script, no pressure. Scroll to the contact section on this page and hit Book a Call, or email nazib.zibcore@gmail.com directly.",
        followUps: ['Pricing', 'How long does it take?']
      },

      /* ============ ABOUT ZIBCORE & NAZIB ============ */
      {
        id: 'about-zibcore',
        keywords: [
          'what is zibcore', 'whats zibcore', 'about zibcore', 'tell me about zibcore',
          'about you', 'about your business', 'about the business', 'about this',
          'tell me about yourself', 'what do you guys do', 'who is zibcore',
          'zibcore'
        ],
        response:
          "ZibCore is a focused studio for local businesses. We do two things well: build modern, fast websites, and add FAQ chatbots that answer customers instantly. Our team personally designs every site and trains every chatbot — no account managers, no junior staff handed your project.",
        followUps: ['Who is the owner?', 'Pricing', 'Who do you work with?']
      },
      {
        id: 'owner',
        keywords: [
          'who runs this', 'who owns this', 'who built this', 'who made this',
          'who is behind', 'whos behind', 'your owner', 'the owner', 'owner',
          'founder', 'who is the founder', 'who is nazib', 'whos nazib',
          'nazib', 'nazib amin', 'who runs zibcore', 'who owns zibcore'
        ],
        response:
          "ZibCore is a studio focused on websites and FAQ chatbots for local businesses. Our team personally designs every site and trains every chatbot. When you work with ZibCore, you talk directly to the people doing the work — never an account manager or a sales rep.",
        followUps: ['What is ZibCore?', 'Contact', 'Why ZibCore?']
      },
      {
        id: 'why-zibcore',
        keywords: [
          'why zibcore', 'why use zibcore', 'why work with you',
          'why should i choose you', 'what makes you different',
          'how are you different', 'why not someone else',
          'compared to others', 'vs agency'
        ],
        response:
          "Three reasons. (1) You talk directly to our team — the people actually building your site, not agency middlemen. (2) One clear price up front, no surprise invoices later. (3) You fully own your website and chatbot. If you ever leave, you take everything with you.",
        followUps: ['Pricing', 'How does it work?', 'Who do you work with?']
      },
      {
        id: 'trust',
        keywords: [
          'are you legit', 'are you real', 'is this legit', 'is this real',
          'can i trust you', 'is zibcore legit', 'is this a scam',
          'are you a scam', 'is it safe'
        ],
        response:
          "ZibCore is a real studio building real websites for real businesses. You can email our team directly at nazib.zibcore@gmail.com, and you fully own everything we build. No lock-in, no long contracts, no hidden fees.",
        followUps: ['Contact', 'Pricing', 'Who is the owner?']
      },

      /* ============ BOT IDENTITY & SCOPE ============ */
      {
        id: 'bot-identity',
        keywords: [
          'your name', 'what is your name', 'whats your name', 'who are you',
          'what are you', 'what is this bot', 'what bot is this',
          'are you human', 'are you a bot', 'are you ai', 'are you chatgpt',
          'are you a real person'
        ],
        response:
          "I'm the Business Assistant — the official FAQ chatbot for ZibCore. I'm not ChatGPT, I'm not a human, and I don't pretend to be. I'm a focused assistant trained only on ZibCore's services. Anything off-topic, I'll be upfront about.",
        followUps: ['What can you answer?', 'What is ZibCore?']
      },
      {
        id: 'bot-scope',
        keywords: [
          'what can you answer', 'what can you do', 'what can you help with',
          'what do you know', 'what can you tell me', 'what topics',
          'what should i ask', 'what should i ask you'
        ],
        response:
          "I can answer questions about: pricing, timelines, ownership, what's included, our process, how websites or chatbots help your business, support and hosting, and whether this fits your business. For anything outside that — custom quotes, your specific business situation, or anything off-topic — I'll point you to the contact section.",
        followUps: ['Pricing', 'How does it work?', 'Why do I need a website?']
      },
      {
        id: 'data-privacy',
        keywords: [
          'data', 'my data', 'collect data', 'collect information',
          'privacy', 'is this private', 'do you store',
          'do you save my messages', 'is this confidential'
        ],
        response:
          "This chatbot does not collect, store, or send any personal data. There's no signup, no tracking inside the chat. If you want to reach our team directly, use the contact section on this page.",
        followUps: ['Contact']
      },

      /* ============ VALUE — why customers need this ============ */
      {
        id: 'why-website',
        keywords: [
          'why do i need a website', 'why need a website', 'why a website',
          'do i need a website', 'why get a website', 'whats the point of a website',
          'is a website worth it', 'why have a website', 'benefits of a website',
          'value of a website'
        ],
        response:
          "Your website is the first impression most customers get before deciding to spend a dollar with you. A clean, fast website builds trust in seconds — and turns curious visitors into paying customers. Without one, you're either invisible to half your customers, or you're letting outdated reviews and old photos speak for you.",
        followUps: ['Website cost', 'How long does it take?', 'Why do I need a chatbot?']
      },
      {
        id: 'why-chatbot',
        keywords: [
          'why do i need a chatbot', 'why need a chatbot', 'why a chatbot',
          'do i need a chatbot', 'why get a chatbot', 'whats the point of a chatbot',
          'is a chatbot worth it', 'why have a chatbot', 'benefits of a chatbot',
          'value of a chatbot', 'why do i need a bot', 'what does a chatbot do for me'
        ],
        response:
          "Most customers won't pick up the phone. They'll message, search, or close the tab if their question isn't answered fast. A FAQ chatbot answers them in seconds, day or night, in your own tone. You stop losing customers at 11pm — and you stop answering the same five questions every week.",
        followUps: ['Chatbot cost', 'Why do I need a website?', 'How does it help my business?']
      },
      {
        id: 'more-customers',
        keywords: [
          'will it bring more customers', 'more clients', 'more customers',
          'will i get more business', 'increase customers', 'increase clients',
          'grow my business', 'help my business grow', 'attract customers'
        ],
        response:
          "Honest answer: a website and chatbot don't magically generate customers from thin air. What they do is convert way more of the customers who already find you. People who land on your site are already curious. A clean site and instant answers turn that curiosity into bookings instead of bounces.",
        followUps: ['How does it help my business?', 'Pricing', 'Why do I need a chatbot?']
      },
      {
        id: 'business-benefits',
        keywords: [
          'how does it help my business', 'how will this help', 'how does this help me',
          'benefits', 'whats in it for me', 'why is this useful',
          'how is this good for me', 'how does it benefit',
          'help my business', 'good for business'
        ],
        response:
          "Three concrete benefits. (1) Trust — a modern site makes you look like the safe choice. (2) Time saved — the chatbot answers the same repeat questions so you don't have to. (3) More bookings — instant answers convert curious visitors into customers, even at midnight. Most local businesses make their monthly fee back from a single extra booking.",
        followUps: ['Pricing', 'Will it bring more customers?', 'Who do you work with?']
      },
      {
        id: 'roi',
        keywords: [
          'is it worth it', 'will i make my money back', 'return on investment',
          'roi', 'worth the cost', 'worth the price', 'worth the money'
        ],
        response:
          "For most local businesses, one new booking each month pays for the whole monthly fee. Beyond that, you save hours every week not answering the same questions yourself — and your business looks more trustworthy from the first click. The setup is a one-time cost; the value keeps working long after.",
        followUps: ['Pricing', 'Will it bring more customers?']
      },

      /* ============ SERVICES & WHAT'S INCLUDED ============ */
      {
        id: 'services-list',
        keywords: [
          'what do you offer', 'what services', 'your services',
          'what do you sell', 'what do you build', 'what do you make',
          'services offered', 'services you offer', 'list of services'
        ],
        response:
          "ZibCore offers three things: (1) Website Development — modern, fast, custom-built websites. (2) FAQ Chatbots — trained on your real answers, embedded in your site. (3) Hosting & Chatbot Management — we keep both running smoothly. That's it. No SEO, no marketing, no add-ons we don't actually deliver.",
        followUps: ['Pricing', 'What is included?', 'Website vs chatbot?']
      },
      {
        id: 'what-included',
        keywords: [
          'what is included', 'whats included', 'what do i get',
          'what comes with', 'whats in the package', 'what does it include',
          'inclusions', 'included in the price'
        ],
        response:
          "With every website: custom design, mobile-friendly build, simple contact forms, fast hosting, security updates, and small monthly edits. With every FAQ chatbot: trained on your real answers, built into your site, regular tune-ups. With the bundle: both, fully connected, in one inbox.",
        followUps: ['Pricing', 'Bundle pricing', 'Monthly fee']
      },
      {
        id: 'website-vs-chatbot',
        keywords: [
          'website vs chatbot', 'chatbot vs website', 'which one do i need',
          'which is better', 'website or chatbot', 'should i get a website or chatbot',
          'website or bot', 'do i need both'
        ],
        response:
          "Simple guide. If you don't have a website yet — start with the Website. If you already have a website but answer the same questions over and over — start with the FAQ Chatbot. If you want both working together, the Bundle is the most popular for a reason and saves you money.",
        followUps: ['Website cost', 'Chatbot cost', 'Bundle pricing']
      },
      {
        id: 'customization',
        keywords: [
          'custom design', 'customizable', 'is it custom', 'is it a template',
          'do you use templates', 'one of a kind', 'tailored to my business'
        ],
        response:
          "Every website is custom designed for your business — we don't use templates. The chatbot is trained on your specific answers, your tone, and your edge cases. Nothing about ZibCore's work is one-size-fits-all.",
        followUps: ['How does it work?', 'Pricing']
      },
      {
        id: 'mobile-friendly',
        keywords: [
          'mobile', 'mobile friendly', 'on phones', 'phone friendly',
          'mobile responsive', 'works on phones', 'looks good on mobile',
          'works on phone', 'mobile design'
        ],
        response:
          "Every website ZibCore builds is designed for phones first. Most of your customers will see your site on a phone — so it has to load fast and look polished there. It still looks great on tablets and computers automatically.",
        followUps: ['Website cost', 'What is included?']
      },

      /* ============ PRICING ============ */
      {
        id: 'pricing-overview',
        keywords: [
          'pricing', 'prices', 'price list', 'all prices', 'how much', 'cost',
          'whats the cost', 'whats the price', 'what does it cost', 'how expensive',
          'price', 'rates', 'rate card'
        ],
        response:
          "Launch pricing — Website: $199 setup + $39/month. FAQ Chatbot: $99 setup + $19/month. Bundle (both, most popular): $249 setup + $49/month. Original prices were $279 / $139 / $349 — these are limited launch prices that save you up to $100.",
        followUps: ['Website cost', 'Chatbot cost', 'Bundle pricing']
      },
      {
        id: 'pricing-website',
        keywords: [
          'website cost', 'website pricing', 'website price', 'website fee',
          'cost of website', 'cost of the website', 'price of website', 'price of the website',
          'how much for website', 'how much for a website', 'how much for the website',
          'how much is a website', 'how much is the website', 'website rate',
          'website'
        ],
        response:
          "Website package: $199 setup + $39/month. Originally $279 — launch pricing saves you $80. The monthly fee covers hosting, security updates, and small edits each month.",
        followUps: ['Bundle pricing', 'Monthly fee', 'How long does it take?']
      },
      {
        id: 'pricing-chatbot',
        keywords: [
          'chatbot cost', 'chatbot pricing', 'chatbot price', 'chatbot fee',
          'cost of chatbot', 'cost of the chatbot', 'price of chatbot', 'price of the chatbot',
          'how much for chatbot', 'how much for a chatbot', 'how much for the chatbot',
          'how much is a chatbot', 'how much is the chatbot', 'chatbot rate',
          'faq bot cost', 'faq bot pricing', 'faq bot price',
          'faq bot', 'chatbot', 'the bot', 'a bot'
        ],
        response:
          "FAQ Chatbot package: $99 setup + $19/month. Originally $139 — launch pricing saves you $40. The monthly fee covers hosting, security updates, and regular tune-ups to keep answers accurate.",
        followUps: ['Bundle pricing', 'Existing website', 'Monthly fee']
      },
      {
        id: 'pricing-bundle',
        keywords: [
          'bundle cost', 'bundle pricing', 'bundle price', 'cost of bundle',
          'price of bundle', 'website and chatbot', 'both website and chatbot',
          'website plus chatbot', 'website + chatbot', 'package', 'bundle',
          'combo', 'combo deal', 'most popular', 'best value', 'best deal'
        ],
        response:
          "Bundle (most popular) — Website + FAQ Chatbot for $249 setup + $49/month. Originally $349 — launch pricing saves you $100. You get the website and chatbot fully connected, in one simple inbox, both running on ZibCore's hosting.",
        followUps: ['Website cost', 'Chatbot cost', 'What is included?']
      },
      {
        id: 'monthly-fee',
        keywords: [
          'monthly fee', 'monthly cost', 'monthly charge', 'monthly bill',
          'monthly payment', 'monthly', 'whats the monthly for',
          'what does the monthly cover', 'what does monthly fee cover',
          'hosting fee', 'maintenance fee', 'hosting', 'maintenance', 'support fee'
        ],
        response:
          "The monthly fee covers four things: hosting your website, hosting your chatbot, security updates, and technical support when you need it. It is not a fee for major rebuilds or big new features — those are scoped separately if you ever need them.",
        followUps: ['Cancellation', 'Pricing', 'What is included?']
      },
      {
        id: 'cancel',
        keywords: [
          'cancel', 'cancellation', 'can i cancel', 'how to cancel',
          'contract', 'lock in', 'lock-in', 'commitment', 'long term contract',
          'do i have to commit', 'minimum term'
        ],
        response:
          "No long contract. You can cancel any time with 30 days notice. If you cancel, you take your website, your words, and your chatbot setup with you — you fully own everything.",
        followUps: ['Ownership', 'Monthly fee']
      },
      {
        id: 'discount-deal',
        keywords: [
          'discount', 'deal', 'promo', 'promo code', 'coupon',
          'launch pricing', 'special offer', 'sale'
        ],
        response:
          "The current prices are already discounted launch pricing — Website saves $80, FAQ Chatbot saves $40, Bundle saves $100 vs regular pricing. These are introductory rates and won't last forever.",
        followUps: ['Pricing', 'Bundle pricing']
      },

      /* ============ PROCESS & PROJECT ============ */
      {
        id: 'timeline',
        keywords: [
          'how long', 'how long does it take', 'how soon', 'how fast',
          'when can it launch', 'when will it be ready', 'when will it launch',
          'timeline', 'turnaround', 'lead time', 'build time', 'launch',
          'how quick', 'time to build', 'days to build'
        ],
        response:
          "Most websites are completed in about 14 days from kickoff. FAQ chatbots usually go live in 3–7 days once we have your real answers. The bundle takes around 14 days total.",
        followUps: ['How does it work?', 'Pricing']
      },
      {
        id: 'process',
        keywords: [
          'how does it work', 'how do you work', 'how do we start',
          'process', 'next steps', 'how to start', 'whats the process',
          'whats next', 'walk me through'
        ],
        response:
          "Four steps. (1) A short call about your business. (2) You see a real design preview — actual screens, not mood boards. (3) We build the website and train the chatbot on your real answers. (4) We launch it and keep both running smoothly. You sign off at every step.",
        followUps: ['How long does it take?', 'Revisions', 'Pricing']
      },
      {
        id: 'revisions',
        keywords: [
          'revisions', 'changes', 'edit', 'edits', 'updates', 'change my mind',
          'can i make changes', 'changes after launch', 'how many revisions',
          'rounds of revisions', 'tweak it later'
        ],
        response:
          "Revisions are part of the process. You see real screens during the build and we refine until you sign off. After launch, small monthly edits are included in your plan — wording changes, photo swaps, small tweaks, all handled.",
        followUps: ['Monthly fee', 'How does it work?']
      },
      {
        id: 'ownership',
        keywords: [
          'do i own', 'do i keep', 'is it mine', 'who owns the website',
          'who owns the chatbot', 'ownership', 'rights', 'own it',
          'do you own it', 'who owns the rights', 'mine', 'own'
        ],
        response:
          "You fully own your website, your words, and your chatbot's configuration. If you ever stop the monthly plan, you keep everything — no lock-in, no being held hostage to ZibCore.",
        followUps: ['Cancellation', 'Monthly fee']
      },
      {
        id: 'existing-website',
        keywords: [
          'already have website', 'already have a website', 'already got a website',
          'existing website', 'i have a website', 'add chatbot to my website',
          'add the bot to my site', 'install on my site',
          'put the chatbot on my site', 'add to current website',
          'i already have a site'
        ],
        response:
          "No problem. If you already have a website you like, you don't need to rebuild — we can install just the FAQ chatbot on your existing site. That's the FAQ Chatbot package at $99 setup + $19/month.",
        followUps: ['Chatbot cost', 'How long does it take?']
      },
      {
        id: 'hosting',
        keywords: [
          'where is it hosted', 'hosting setup', 'hosted on', 'where is the site',
          'do you host', 'hosting provider', 'where does the website live'
        ],
        response:
          "Your website is hosted on a fast global network. The chatbot runs on dedicated infrastructure. All of it is included in the monthly fee — no separate hosting bills, no domain headaches, nothing for you to manage.",
        followUps: ['Monthly fee', 'Support']
      },
      {
        id: 'support',
        keywords: [
          'support', 'help', 'technical support', 'if something breaks',
          'what if it breaks', 'whos there if i have a problem',
          'who do i call if', 'tech support'
        ],
        response:
          "Ongoing support is included in the monthly fee. If your website goes down, your chatbot needs a tune-up, or you need a small edit — message our team and it's handled. No support tickets, no offshore call centers.",
        followUps: ['Monthly fee', 'Contact']
      },
      {
        id: 'industries',
        keywords: [
          'who do you work with', 'what businesses', 'what industries',
          'do you work with', 'small business', 'local business',
          'do you work with restaurants', 'do you work with dentists',
          'who is this for', 'who is it for', 'is this for me',
          'who do you build for'
        ],
        response:
          "We work with local business owners — barbershops, dentists, tutors and coaches, gyms and studios, auto repair shops, and other local services. If you run a real local business and want a clean website and fast answers for your customers, you're who ZibCore built this for.",
        followUps: ['Pricing', 'Why do I need a website?', 'Contact']
      },

      /* ============ CONTACT ============ */
      {
        id: 'contact',
        keywords: [
          'contact', 'contact you', 'email', 'phone', 'call you', 'reach you',
          'reach out', 'get in touch', 'how to contact', 'how do i contact',
          'talk to a human', 'talk to someone', 'talk to a person',
          'real person', 'real human', 'speak to human', 'speak to someone',
          'get hold of you', 'book a call', 'whats your email',
          'whats your phone', 'how to reach you', 'phone number', 'text'
        ],
        response:
          "You can reach our team directly by email at nazib.zibcore@gmail.com (preferred), or text (917) 582-4975. There's also a contact form just below — fill it out and we'll reply personally, usually within a few hours.",
        followUps: ['How does it work?', 'Pricing']
      },

      /* ============ EXCLUDED SERVICES (be honest) ============ */
      {
        id: 'seo',
        keywords: [
          'seo', 'google ranking', 'rankings', 'search engine', 'traffic',
          'marketing', 'ads', 'google ads', 'facebook ads',
          'social media', 'instagram marketing', 'tiktok'
        ],
        response:
          "ZibCore doesn't do SEO, paid ads, or social media marketing — and we won't promise rankings or traffic we don't control. We focus only on what we deliver well: websites, FAQ chatbots, and hosting. We're upfront about what we don't offer.",
        followUps: ['What do you offer?', 'Pricing']
      },
      {
        id: 'logo-branding',
        keywords: [
          'logo', 'branding', 'brand identity', 'design my logo', 'make me a logo'
        ],
        response:
          "ZibCore doesn't do logos or branding work — only websites, FAQ chatbots, and hosting. If you already have a logo we'll use it. If you don't, we can recommend someone, but it isn't part of our service.",
        followUps: ['What do you offer?', 'Pricing']
      },
      {
        id: 'ecommerce',
        keywords: [
          'ecommerce', 'online store', 'sell online', 'shopify',
          'online shop', 'product catalog'
        ],
        response:
          "ZibCore focuses on websites for local service businesses — not full ecommerce stores. If you just need a simple way for customers to enquire, our standard website works. For a full online shop with checkout, we're probably not the right fit.",
        followUps: ['Who do you work with?', 'What do you offer?']
      }
    ]
  };

  /* ===================================================================
     MATCHER
     - Normalizes input (lowercase, drop punctuation)
     - Auto-corrects typos via Levenshtein against keyword vocabulary
     - Scores entries by sum of matched keyword lengths + count bonus
     - Off-topic detection if no on-topic match
     - Returns top-3 guesses ("did you mean?") when no confident match
     =================================================================== */
  const MIN_CONFIDENT_SCORE = 4;

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* --- Levenshtein edit distance (with early-exit shortcut) --- */
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (Math.abs(m - n) > 2) return 99;
    if (m === 0) return n;
    if (n === 0) return m;
    let prev = new Array(n + 1);
    let curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      }
      const t = prev; prev = curr; curr = t;
    }
    return prev[n];
  }

  /* --- Build vocabulary of every word used in any keyword --- */
  let VOCAB = null;
  function buildVocab() {
    const set = {};
    for (let i = 0; i < ZIBCORE_FAQ.entries.length; i++) {
      const e = ZIBCORE_FAQ.entries[i];
      for (let j = 0; j < e.keywords.length; j++) {
        const words = normalize(e.keywords[j]).split(' ');
        for (let k = 0; k < words.length; k++) {
          if (words[k].length >= 3) set[words[k]] = true;
        }
      }
    }
    /* common helpers so we don't try to "correct" them */
    ['the','and','for','with','how','why','what','when','who','can','does','will',
     'your','this','that','are','you','is','it','to','of','in','do','my','me',
     'have','has','any','all','one','two','need','want','get'].forEach(function(w){ set[w] = true; });
    VOCAB = Object.keys(set);
  }

  /* --- Replace unknown words with closest vocab word (typo fix) --- */
  function autoCorrect(text) {
    if (!VOCAB) buildVocab();
    const words = text.split(' ');
    let corrected = false;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w.length < 4) continue;
      if (VOCAB.indexOf(w) !== -1) continue;
      const maxDist = w.length >= 6 ? 2 : 1;
      let best = w;
      let bestDist = maxDist + 1;
      for (let j = 0; j < VOCAB.length; j++) {
        const v = VOCAB[j];
        if (Math.abs(v.length - w.length) > maxDist) continue;
        const d = lev(w, v);
        if (d < bestDist) {
          bestDist = d;
          best = v;
          if (d === 0) break;
        }
      }
      if (bestDist <= maxDist && best !== w) {
        words[i] = best;
        corrected = true;
      }
    }
    return { text: words.join(' '), corrected: corrected };
  }

  function scoreEntry(text, entry) {
    let score = 0;
    let matched = 0;
    for (let i = 0; i < entry.keywords.length; i++) {
      const k = normalize(entry.keywords[i]);
      if (!k) continue;
      if (text.indexOf(k) !== -1) {
        score += k.length;
        matched++;
      }
    }
    if (matched > 1) score = Math.round(score * 1.25);
    return score;
  }

  function isOffTopic(text) {
    for (let i = 0; i < ZIBCORE_FAQ.offTopicKeywords.length; i++) {
      const k = normalize(ZIBCORE_FAQ.offTopicKeywords[i]);
      if (k && text.indexOf(k) !== -1) return true;
    }
    return false;
  }

  /* Pretty titles for "did you mean?" chips (per entry id) */
  const TOPIC_TITLE = {
    'about-zibcore': 'What is ZibCore?',
    'owner': 'Who is the owner?',
    'why-zibcore': 'Why ZibCore?',
    'trust': 'Are you legit?',
    'bot-identity': 'Who are you?',
    'bot-scope': 'What can you answer?',
    'data-privacy': 'Do you collect data?',
    'why-website': 'Why do I need a website?',
    'why-chatbot': 'Why do I need a chatbot?',
    'more-customers': 'Will it bring more customers?',
    'business-benefits': 'How does it help my business?',
    'roi': 'Is it worth it?',
    'services-list': 'What do you offer?',
    'what-included': 'What is included?',
    'website-vs-chatbot': 'Website vs chatbot?',
    'customization': 'Custom design?',
    'mobile-friendly': 'Mobile friendly?',
    'pricing-overview': 'Pricing',
    'pricing-website': 'Website cost',
    'pricing-chatbot': 'Chatbot cost',
    'pricing-bundle': 'Bundle pricing',
    'monthly-fee': 'Monthly fee',
    'cancel': 'Cancellation',
    'discount-deal': 'Discount / launch deal',
    'timeline': 'How long does it take?',
    'process': 'How does it work?',
    'revisions': 'Revisions',
    'ownership': 'Ownership',
    'existing-website': 'Existing website',
    'hosting': 'Hosting',
    'support': 'Support',
    'industries': 'Who do you work with?',
    'contact': 'Contact',
    'seo': 'Do you do SEO?',
    'logo-branding': 'Do you do logos?',
    'ecommerce': 'Do you do ecommerce?'
  };

  function findMatch(input) {
    const text = normalize(input);
    if (!text) return { type: 'empty' };

    /* Try raw text, then auto-corrected text — pick higher score */
    const corrected = autoCorrect(text);
    const candidates = corrected.corrected ? [text, corrected.text] : [text];

    let best = null;
    let bestScore = 0;
    let allScores = [];

    for (let t = 0; t < candidates.length; t++) {
      const txt = candidates[t];
      for (let i = 0; i < ZIBCORE_FAQ.entries.length; i++) {
        const s = scoreEntry(txt, ZIBCORE_FAQ.entries[i]);
        if (s > 0) allScores.push({ entry: ZIBCORE_FAQ.entries[i], score: s });
        if (s > bestScore) {
          best = ZIBCORE_FAQ.entries[i];
          bestScore = s;
        }
      }
    }

    if (best && bestScore >= MIN_CONFIDENT_SCORE) {
      return {
        type: 'match',
        entry: best,
        score: bestScore,
        autocorrected: corrected.corrected
      };
    }

    if (isOffTopic(text)) return { type: 'off-topic' };

    /* "Did you mean?" — top 3 partial matches if any */
    if (allScores.length > 0) {
      allScores.sort(function (a, b) { return b.score - a.score; });
      const seen = {};
      const guesses = [];
      for (let i = 0; i < allScores.length && guesses.length < 3; i++) {
        const id = allScores[i].entry.id;
        if (seen[id]) continue;
        seen[id] = true;
        const title = TOPIC_TITLE[id];
        if (title) guesses.push(title);
      }
      if (guesses.length > 0) return { type: 'did-you-mean', guesses: guesses };
    }

    return { type: 'fallback' };
  }

  /* ===================================================================
     UTILS
     =================================================================== */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ===================================================================
     DOM
     =================================================================== */
  function buildWidget() {
    const root = document.createElement('div');
    root.className = 'zc-chat';
    root.id = 'zc-chat';
    root.innerHTML =
      '<div class="zc-chat__teaser" id="zc-chat-teaser" aria-hidden="true">' +
        '<div class="zc-chat__teaser-bubble">' +
          '<strong>Hi! 👋 Got a question?</strong>' +
          '<span>Ask anything — I reply instantly.</span>' +
        '</div>' +
        '<button class="zc-chat__teaser-close" type="button" aria-label="Dismiss" data-zc-teaser-close>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<button class="zc-chat__launcher" type="button" aria-label="Open ' +
        escapeHtml(ZIBCORE_FAQ.botName) +
        ' chat" aria-expanded="false">' +
        '<span class="zc-chat__launcher-ring" aria-hidden="true"></span>' +
        '<span class="zc-chat__launcher-badge" aria-hidden="true">1</span>' +
        '<svg class="zc-chat__icon zc-chat__icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
        '</svg>' +
        '<svg class="zc-chat__icon zc-chat__icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>' +
      '<section class="zc-chat__panel" role="dialog" aria-label="' +
        escapeHtml(ZIBCORE_FAQ.botName) + '">' +
        '<header class="zc-chat__head">' +
          '<div class="zc-chat__brand">' +
            '<div class="zc-chat__avatar" aria-hidden="true">' +
              '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M14 6 H50 A8 8 0 0 1 58 14 V40 A8 8 0 0 1 50 48 H28 L16 60 V48 H14 A8 8 0 0 1 6 40 V14 A8 8 0 0 1 14 6 Z" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>' +
                '<path d="M24 19 L17 27 L24 35" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<path d="M29 19 H45 L29 35 H45" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</div>' +
            '<div class="zc-chat__brand-text">' +
              '<strong>' + escapeHtml(ZIBCORE_FAQ.botName) + '</strong>' +
              '<span><i class="zc-chat__online" aria-hidden="true"></i> Online · ' + escapeHtml(ZIBCORE_FAQ.brandName) + ' FAQ Assistant</span>' +
            '</div>' +
          '</div>' +
          '<button class="zc-chat__close" type="button" aria-label="Close chat">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">' +
              '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
            '</svg>' +
          '</button>' +
        '</header>' +
        '<div class="zc-chat__body" role="log" aria-live="polite" aria-atomic="false"></div>' +
        '<form class="zc-chat__form" autocomplete="off">' +
          '<input type="text" class="zc-chat__input" placeholder="Ask about pricing, timelines, or what\'s included..." aria-label="Type your question" maxlength="500" />' +
          '<button class="zc-chat__send" type="submit" aria-label="Send message">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M22 2L11 13"/>' +
              '<path d="M22 2l-7 20-4-9-9-4z"/>' +
            '</svg>' +
          '</button>' +
        '</form>' +
      '</section>';
    return root;
  }

  /* ===================================================================
     RUNTIME
     =================================================================== */
  function init() {
    if (document.getElementById('zc-chat')) return;

    const root = buildWidget();
    document.body.appendChild(root);

    const launcher = root.querySelector('.zc-chat__launcher');
    const closeBtn = root.querySelector('.zc-chat__close');
    const body = root.querySelector('.zc-chat__body');
    const form = root.querySelector('.zc-chat__form');
    const input = root.querySelector('.zc-chat__input');

    let isOpen = false;

    function setOpen(next) {
      isOpen = !!next;
      root.classList.toggle('is-open', isOpen);
      launcher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        // Hide the teaser + badge once user engages
        root.classList.add('is-engaged');
        setTimeout(function () { input.focus(); }, 280);
      }
    }

    // Dismiss button on the teaser bubble
    const teaserClose = root.querySelector('[data-zc-teaser-close]');
    if (teaserClose) {
      teaserClose.addEventListener('click', function (e) {
        e.stopPropagation();
        root.classList.add('is-engaged');
      });
    }

    // Show teaser 4 seconds after page load (CSS handles the animation)
    setTimeout(function () { root.classList.add('is-teasing'); }, 4000);

    launcher.addEventListener('click', function () { setOpen(!isOpen); });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-zc-chat-open]');
      if (trigger) {
        e.preventDefault();
        setOpen(true);
      }
    });

    function scrollToBottom() {
      requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
    }

    function addBotMessage(text) {
      const m = document.createElement('div');
      m.className = 'zc-chat__msg zc-chat__msg--bot';
      m.innerHTML = '<div class="zc-chat__bubble">' + escapeHtml(text) + '</div>';
      body.appendChild(m);
      scrollToBottom();
      return m;
    }

    function addUserMessage(text) {
      const m = document.createElement('div');
      m.className = 'zc-chat__msg zc-chat__msg--user';
      m.innerHTML = '<div class="zc-chat__bubble">' + escapeHtml(text) + '</div>';
      body.appendChild(m);
      scrollToBottom();
    }

    function addTypingIndicator() {
      const m = document.createElement('div');
      m.className = 'zc-chat__msg zc-chat__msg--bot zc-chat__msg--typing';
      m.innerHTML =
        '<div class="zc-chat__bubble zc-chat__bubble--typing">' +
          '<span class="zc-chat__dots" aria-label="Typing">' +
            '<span></span><span></span><span></span>' +
          '</span>' +
        '</div>';
      body.appendChild(m);
      scrollToBottom();
      return m;
    }

    function clearLiveChips() {
      const chips = body.querySelectorAll('.zc-chat__suggests');
      chips.forEach(function (c) { c.remove(); });
    }

    function addChips(list) {
      if (!list || !list.length) return;
      const wrap = document.createElement('div');
      wrap.className = 'zc-chat__suggests';
      list.forEach(function (text) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'zc-chat__chip';
        btn.textContent = text;
        btn.addEventListener('click', function () { send(text); });
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
      scrollToBottom();
    }

    let lastEntry = null;

    function send(raw) {
      const text = (raw || '').trim();
      if (!text) return;

      clearLiveChips();
      addUserMessage(text);
      input.value = '';

      const typing = addTypingIndicator();
      const delay = 700 + Math.random() * 400;

      setTimeout(function () {
        typing.remove();

        const result = findMatch(text);

        if (result.type === 'match') {
          /* "more / tell me more" — reuse last topic's follow-ups */
          if (result.entry.meta === 'more' && lastEntry && lastEntry.followUps && lastEntry.followUps.length) {
            addBotMessage("Sure — here are related questions from what we just talked about:");
            addChips(lastEntry.followUps);
            return;
          }
          addBotMessage(result.entry.response);
          addChips(result.entry.followUps || []);
          /* Remember substantive topics, not smalltalk */
          if (result.entry.meta !== 'short' && result.entry.meta !== 'more') {
            lastEntry = result.entry;
          }
        } else if (result.type === 'off-topic') {
          addBotMessage(ZIBCORE_FAQ.offTopic);
          addChips(ZIBCORE_FAQ.fallbackChips);
        } else if (result.type === 'did-you-mean') {
          addBotMessage("I'm not 100% sure I caught that. Did you mean one of these?");
          addChips(result.guesses);
        } else {
          addBotMessage(ZIBCORE_FAQ.fallback);
          addChips(ZIBCORE_FAQ.fallbackChips);
        }
      }, delay);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(input.value);
    });

    /* initial state */
    addBotMessage(ZIBCORE_FAQ.welcome);
    addChips(ZIBCORE_FAQ.suggestions);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
