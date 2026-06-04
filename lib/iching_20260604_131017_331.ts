// 易经六十四卦善念指引映射
// 每卦重新诠释为品格练习和日常行为指引
// Bilingual: zh (中文) and en (English)

export interface HexagramContent {
  zh: string
  en: string
}

export interface HexagramGuide {
  id: number
  name: string
  nameEn: string
  principle: HexagramContent
  practice: HexagramContent
  why: HexagramContent
  scope: string
}

// Helper to get localized content from a HexagramGuide
export function getLocalizedHexagram(hexagram: HexagramGuide, locale: string): {
  id: number
  name: string
  nameEn: string
  principle: string
  practice: string
  why: string
  scope: string
} {
  const lang = locale === 'zh' ? 'zh' : 'en'
  return {
    id: hexagram.id,
    name: hexagram.name,
    nameEn: hexagram.nameEn,
    principle: hexagram.principle[lang],
    practice: hexagram.practice[lang],
    why: hexagram.why[lang],
    scope: hexagram.scope,
  }
}

export const HEXAGRAMS: HexagramGuide[] = [
  {
    id: 1, name: '乾', nameEn: 'The Creative',
    principle: {
      zh: '自强不息不是征服世界，是每一次选择时都向善多走一步',
      en: 'Endless self-renewal is not about conquering the world. It is choosing to take one more step toward goodness, every time you choose.',
    },
    practice: {
      zh: '今天，找一个你本可以推卸的小责任，主动承担它。不需要被人看见。',
      en: 'Today, find a small responsibility you could easily pass on. Take it on yourself. No one needs to see.',
    },
    why: {
      zh: '主动承担是善念最强的身体记忆。当你自愿而非被迫时，业力开始转向。',
      en: 'Voluntary responsibility is the strongest body-memory of goodness. When you act by choice, not by force, your karma begins to turn.',
    },
    scope: 'career',
  },
  {
    id: 2, name: '坤', nameEn: 'The Receptive',
    principle: {
      zh: '厚德载物——你今天承载了多少，决定了你明天能托起多少',
      en: 'Vast virtue bears all things — what you can carry today determines what you will be able to hold tomorrow.',
    },
    practice: {
      zh: '今天，你遇到的每个人都在背负你不知道的东西。在你想下判断前，先沉默3秒。',
      en: 'Today, everyone you meet is carrying something you do not know. Before you judge, pause for three seconds of silence.',
    },
    why: {
      zh: '坤卦的承载力来自先理解再回应。3秒的沉默是善念生长的土壤。',
      en: 'The Receptive draws its strength from understanding before responding. Three seconds of silence is the soil where goodness grows.',
    },
    scope: 'mind',
  },
  {
    id: 3, name: '屯', nameEn: 'Difficulty at the Beginning',
    principle: {
      zh: '万事开头难不是惩罚。是筛选——筛掉不够真心的事，留下值得的',
      en: 'Difficulty at the beginning is not punishment. It is a filter — sifting out what you do not truly want, leaving only what is worth it.',
    },
    practice: {
      zh: '今天，找到一件你一直拖延但内心想做的事。只做第一步。只一步。',
      en: 'Today, find one thing you have been postponing but genuinely want to do. Take only the first step. Just one.',
    },
    why: {
      zh: '屯卦告诉你：第一步最难，但只需要迈一次。善念不需要完成，只需要启动。',
      en: 'Difficulty at the Beginning tells you: the first step is hardest, but you only have to take it once. Goodness does not need completion — it needs ignition.',
    },
    scope: 'career',
  },
  {
    id: 4, name: '蒙', nameEn: 'Youthful Folly',
    principle: {
      zh: '最深的智慧是知道自己需要什么——而不是知道什么',
      en: 'The deepest wisdom is knowing what you need — not knowing everything.',
    },
    practice: {
      zh: '今天，留意你身边沉默的人。有人需要你的指点但不一定开口。主动问一句：「需要聊聊吗？」',
      en: 'Today, notice the quiet person near you. Someone may need your guidance but will not ask. Offer a simple: "Need to talk?"',
    },
    why: {
      zh: '蒙卦说启蒙不在教，在问。你的一个问题可能照亮别人困住的一个角。',
      en: 'Youthful Folly says enlightenment is not in teaching, but in asking. One question from you may light up a corner where someone is stuck.',
    },
    scope: 'mind',
  },
  {
    id: 5, name: '需', nameEn: 'Waiting',
    principle: {
      zh: '等待不是什么都不做。等待是信任因果需要时间',
      en: 'Waiting is not doing nothing. Waiting is trusting that cause and effect need time.',
    },
    practice: {
      zh: '今天，有一个你一直想推进但受阻的事。今天不对它做任何事。只观察自己焦虑时身体的感受。',
      en: 'Today, there is something you have been pushing forward that keeps hitting walls. Do nothing about it today. Just observe how your body feels when you are anxious.',
    },
    why: {
      zh: '需卦说时机未到时的努力是逆水行舟。停下不等于放弃，是给业力空间运作。',
      en: 'Waiting says effort against the current is wasted when the time is not right. Stopping is not giving up — it is making space for karma to do its work.',
    },
    scope: 'wealth',
  },
  {
    id: 6, name: '讼', nameEn: 'Conflict',
    principle: {
      zh: '争赢了的输。先放下的赢',
      en: 'He who fights to win, loses. He who lets go first, wins.',
    },
    practice: {
      zh: '今天，如果有争执的苗头，你选择先说出对方一个对的地方。只说那一个。',
      en: 'Today, if a dispute begins to form, choose to first name one thing the other person is right about. Just one.',
    },
    why: {
      zh: '讼卦告诉你争执是业力最重的纠缠。先认一个对，就解开了绳结的第一环。',
      en: 'Conflict tells you that quarreling is the heaviest karmic entanglement. Acknowledging one right thing loosens the first knot in the rope.',
    },
    scope: 'love',
  },
  {
    id: 7, name: '师', nameEn: 'The Army',
    principle: {
      zh: '真正的领袖不是指挥别人，是第一个走向危险',
      en: 'The true leader does not command others. The true leader is the first to walk toward danger.',
    },
    practice: {
      zh: '今天，在一个团队或家庭中，你是第一个说「我来」的人。不是命令，是伸手。',
      en: 'Today, in a team or family, be the first to say "I will." Not a command — an outstretched hand.',
    },
    why: {
      zh: '师卦是领导力的最高形态——不是让别人为你做，是你先做给别人看。',
      en: 'The Army is the highest form of leadership — not making others do for you, but showing them how by doing it first.',
    },
    scope: 'career',
  },
  {
    id: 8, name: '比', nameEn: 'Holding Together',
    principle: {
      zh: '你选择靠近谁，你就成为谁',
      en: 'You become whoever you choose to stay close to.',
    },
    practice: {
      zh: '今天，花5分钟主动联系一个你想靠近但一直没联系的人。只说：「突然想起你，希望你今天顺利。」',
      en: 'Today, take five minutes to reach out to someone you want to be closer to but have not contacted. Just say: "Thought of you. Hope your day is going well."',
    },
    why: {
      zh: '比卦说人际引力来自你主动靠近的那一步。善的能量在连接中流动。',
      en: 'Holding Together says the gravity between people comes from the step you take toward them. The energy of goodness flows through connection.',
    },
    scope: 'love',
  },
  {
    id: 9, name: '小畜', nameEn: 'Small Accumulation',
    principle: {
      zh: '大改变从来不是一场革命。是每天攒一滴水',
      en: 'Great change has never been a revolution. It is one drop of water, saved every day.',
    },
    practice: {
      zh: '今天，找一件小到你不好意思说的事去做。比如把你昨天没洗的杯子洗了。',
      en: 'Today, do something so small you would be embarrassed to mention it. Wash the cup you left unwashed yesterday.',
    },
    why: {
      zh: '小畜卦告诉你：微小善行的积累比一次壮举更有力量。业力不在乎大小，在乎坚持。',
      en: 'Small Accumulation says the sum of tiny good deeds is more powerful than one grand gesture. Karma does not care about scale — it cares about consistency.',
    },
    scope: 'wealth',
  },
  {
    id: 10, name: '履', nameEn: 'Treading',
    principle: {
      zh: '谨慎不是恐惧。是对每一步的觉知',
      en: 'Caution is not fear. It is awareness of every step.',
    },
    practice: {
      zh: '今天，在你做任何一件事之前，停顿1秒。只1秒。看自己为什么做这件事。',
      en: 'Today, before you do anything, pause for one second. Just one second. See why you are about to do it.',
    },
    why: {
      zh: '履卦说每一步都带着觉知时，你就不再是惯性动物。你是自己命运的导航者。',
      en: 'Treading says when every step carries awareness, you are no longer a creature of inertia. You are the navigator of your own destiny.',
    },
    scope: 'mind',
  },
  {
    id: 11, name: '泰', nameEn: 'Peace',
    principle: {
      zh: '真正的和平不是没有冲突，是冲突来了你知道怎么回到中心',
      en: 'True peace is not the absence of conflict. It is knowing how to return to center when conflict arrives.',
    },
    practice: {
      zh: '今天，找一个你内心觉得顺遂的瞬间。停下来。记住这个感觉。这是你的基准线。',
      en: 'Today, find a moment when you feel at ease inside. Stop. Remember this feeling. This is your baseline.',
    },
    why: {
      zh: '泰卦的「通」不在于外部顺遂，在于内部有一条回得去的路。基准线让你在风暴中有锚。',
      en: 'Peace speaks of flow not in external smoothness, but in having an inner path you can always return to. A baseline gives you an anchor in the storm.',
    },
    scope: 'mind',
  },
  {
    id: 12, name: '否', nameEn: 'Standstill',
    principle: {
      zh: '低谷不是你的错。但怎么走出来的姿态，是你的选择',
      en: 'The low point is not your fault. But how you walk out of it — that is your choice.',
    },
    practice: {
      zh: '今天，你如果感到被困住，先承认：「我现在被困住了。」不做任何改变。先承认。',
      en: 'Today, if you feel stuck, first admit: "I am stuck right now." Change nothing. Just acknowledge it.',
    },
    why: {
      zh: '否卦的智慧：承认困境本身就是打开缺口的第一步。否极泰来，但需要你先接受「否」。',
      en: 'The wisdom of Standstill: admitting you are stuck is itself the first crack in the wall. After standstill comes peace — but you must first accept the standstill.',
    },
    scope: 'mind',
  },
  {
    id: 13, name: '同人', nameEn: 'Fellowship',
    principle: {
      zh: '你不需要同意一个人才能理解他',
      en: 'You do not need to agree with someone to understand them.',
    },
    practice: {
      zh: '今天，找一个你不同意的人。理解他为什么那样想。不需要告诉他。',
      en: 'Today, think of someone you disagree with. Understand why they think that way. You do not need to tell them.',
    },
    why: {
      zh: '同人卦说同心的秘密不是意见一致，是愿意走进对方的心里看一看。',
      en: 'Fellowship says the secret of shared hearts is not aligning opinions — it is being willing to step into another\'s inner world and look around.',
    },
    scope: 'love',
  },
  {
    id: 14, name: '大有', nameEn: 'Great Possession',
    principle: {
      zh: '真正的富有不是你拥有多少。是你感知幸福的能力有多强',
      en: 'True wealth is not how much you own. It is the strength of your ability to perceive happiness.',
    },
    practice: {
      zh: '今天，找一个你已经拥有但从未感恩的东西。比如你能看见这个屏幕的眼睛。',
      en: 'Today, find one thing you have always had but never truly appreciated. Like the eyes that let you read these words.',
    },
    why: {
      zh: '大有卦不是关于得到更多，是关于看见已有的。感知力才是真正的财富。',
      en: 'Great Possession is not about gaining more. It is about seeing what is already yours. The capacity to perceive is the truest wealth.',
    },
    scope: 'wealth',
  },
  {
    id: 15, name: '谦', nameEn: 'Modesty',
    principle: {
      zh: '今天你做成了一件值得炫耀的事。藏在心里24小时。让它在你心里发酵',
      en: 'Today you accomplished something worth showing off. Keep it inside for 24 hours. Let it ferment within you.',
    },
    practice: {
      zh: '今天，如果有人说你做得好，你只说：「谢谢。」不加任何自贬或补充。只两个字。',
      en: 'Today, if someone praises you, say only: "Thank you." No self-deprecation, no extra words. Just two words.',
    },
    why: {
      zh: '谦卦的精髓：真正的谦逊不是自我贬低，是不需要借用别人的认可来确认自己的价值。',
      en: 'The essence of Modesty: true humility is not putting yourself down — it is not needing anyone else\'s approval to know your worth.',
    },
    scope: 'career',
  },
  {
    id: 16, name: '豫', nameEn: 'Enthusiasm',
    principle: {
      zh: '快乐不是终点。是你行走的方式',
      en: 'Happiness is not the destination. It is the way you walk.',
    },
    practice: {
      zh: '今天，在完成一件事后，看着你做出来的结果。不说「还可以更好」。只感受完成本身。',
      en: 'Today, after finishing something, look at what you made. Do not say "it could be better." Just feel the completion itself.',
    },
    why: {
      zh: '豫卦的「乐」源于你认可了此刻的价值。不为未来焦虑地活着，业力才轻盈。',
      en: 'The joy of Enthusiasm comes from acknowledging the value of this moment. When you live without anxiety about the future, karma becomes light.',
    },
    scope: 'mind',
  },
  {
    id: 17, name: '随', nameEn: 'Following',
    principle: {
      zh: '跟随不是放弃自己。是选择把自我放进更大的流里',
      en: 'Following is not abandoning yourself. It is choosing to place yourself in a larger current.',
    },
    practice: {
      zh: '今天，遇到一个需要集体决策的时刻。你先听完所有人说完，再开口。',
      en: 'Today, when a group decision is needed, let everyone else speak first. Then open your mouth.',
    },
    why: {
      zh: '随卦的跟随是先感知流向再行动。你不再对抗世界，你在和世界一起流动。',
      en: 'The following of Following means sensing the flow before acting. You stop fighting the world — you begin flowing with it.',
    },
    scope: 'love',
  },
  {
    id: 18, name: '蛊', nameEn: 'Decay',
    principle: {
      zh: '腐烂的过去不是毒药。是肥料',
      en: 'The decaying past is not poison. It is fertilizer.',
    },
    practice: {
      zh: '今天，找一个你一直回避的旧问题。只看它10秒。不解决。只看。',
      en: 'Today, find an old problem you have been avoiding. Look at it for ten seconds. Do not solve it. Just look.',
    },
    why: {
      zh: '蛊卦的修复从「直视腐烂」开始。你敢看，它就失去了控制你的权力。',
      en: 'The healing of Decay begins with looking directly at what has rotted. Once you dare to look, it loses its power over you.',
    },
    scope: 'mind',
  },
  {
    id: 19, name: '临', nameEn: 'Approach',
    principle: {
      zh: '你靠近世界的方式，决定了世界如何回应你',
      en: 'The way you approach the world determines how the world responds to you.',
    },
    practice: {
      zh: '今天，对遇到的第一个人给出一个真心的微笑。不是职业微笑。是看见对方是一个人。',
      en: 'Today, give the first person you encounter a genuine smile. Not a professional smile. A smile that sees them as a human being.',
    },
    why: {
      zh: '临卦说你的一举一动都在塑造你即将踏入的现实。第一个微笑打开第一扇门。',
      en: 'Approach says your every gesture shapes the reality you are about to step into. The first smile opens the first door.',
    },
    scope: 'love',
  },
  {
    id: 20, name: '观', nameEn: 'Contemplation',
    principle: {
      zh: '看清世界之前，先看清自己看世界的眼镜',
      en: 'Before you see the world clearly, first see the glasses through which you look at the world.',
    },
    practice: {
      zh: '今天，抽10分钟坐下来。不做事。只是看着自己脑子里飘过的念头，不抓也不赶。',
      en: 'Today, sit for ten minutes. Do nothing. Just watch the thoughts drifting through your mind. Do not grab them. Do not push them away.',
    },
    why: {
      zh: '观卦的核心是「观自在」——你先看见自己的念头是怎么运作的，才能看见世界的真相。',
      en: 'The heart of Contemplation is "observe the inner self" — only when you see how your thoughts operate can you see the truth of the world.',
    },
    scope: 'mind',
  },
  {
    id: 21, name: '噬嗑', nameEn: 'Biting Through',
    principle: {
      zh: '有些障碍不是用来绕过去的。是用来咬穿的',
      en: 'Some obstacles are not meant to be walked around. They are meant to be bitten through.',
    },
    practice: {
      zh: '今天，找到一件你一直在回避的困难事。做它。不是完成，是开始。只咬第一口。',
      en: 'Today, find one difficult thing you have been avoiding. Do it — not to finish, but to begin. Just bite the first bite.',
    },
    why: {
      zh: '噬嗑卦说有些业力纠缠必须正面突破。绕开一百次不如咬穿一次。',
      en: 'Biting Through says some karmic entanglements must be broken through head-on. A hundred detours are not worth one clean bite.',
    },
    scope: 'career',
  },
  {
    id: 22, name: '贲', nameEn: 'Grace',
    principle: {
      zh: '形式不重要。但形式可以让你看到内容',
      en: 'Form does not matter. But form can help you see the content.',
    },
    practice: {
      zh: '今天，把你每天必经的一个地方整理干净。不是全屋。只一个角落。',
      en: 'Today, tidy one place you pass through every day. Not the whole house. Just one corner.',
    },
    why: {
      zh: '贲卦的「装饰」本质是创造一个让你内心安静的容器。外部的秩序带动内心的秩序。',
      en: 'The "adornment" of Grace is essentially creating a container for inner stillness. Outer order draws inner order into being.',
    },
    scope: 'mind',
  },
  {
    id: 23, name: '剥', nameEn: 'Splitting Apart',
    principle: {
      zh: '失去不是坏事。有些东西不剥落，新的怎么长出来',
      en: 'Loss is not a bad thing. How can the new grow if the old never peels away?',
    },
    practice: {
      zh: '今天，丢掉一件你已经半年没用但一直留着的东西。对它说声谢谢，然后放手。',
      en: 'Today, throw away one thing you have not used in six months but still keep. Say thank you to it, then let it go.',
    },
    why: {
      zh: '剥卦的剥离是重生的前奏。你的业力里积攒了太多「留着吧万一有用」，它们正在拖垮你。',
      en: 'The peeling of Splitting Apart is the prelude to rebirth. Your karma holds too many "keep it just in case" items — they are weighing you down.',
    },
    scope: 'wealth',
  },
  {
    id: 24, name: '复', nameEn: 'Return',
    principle: {
      zh: '每一次跌倒后站起来，你不是回到了原点。你是带着经验重新开始了',
      en: 'Every time you stand up after falling, you are not back at square one. You are starting again, carrying hard-won experience.',
    },
    practice: {
      zh: '今天，如果你之前放弃过什么，今天重新开始。业力每天清零。太阳升起时你不欠任何东西。',
      en: 'Today, if you gave up on something before, begin again. Karma resets every day. When the sun rises, you owe nothing.',
    },
    why: {
      zh: '复卦是易经中最有希望的一卦——一切可以重来，而且你比上一次更强了。',
      en: 'Return is the most hopeful hexagram in the I Ching — everything can start over, and you are stronger than the last time.',
    },
    scope: 'mind',
  },
  {
    id: 25, name: '无妄', nameEn: 'Innocence',
    principle: {
      zh: '不妄为。不为不该为的。然后一切该来的都会来',
      en: 'Do not act recklessly. Do not do what should not be done. Then all that should come, will come.',
    },
    practice: {
      zh: '今天，在你想要「多做一点」的冲动来临时，问自己：「我是因为需要做，还是想要控制？」',
      en: 'Today, when the urge to "do a little more" arises, ask yourself: "Am I doing this because it is needed, or because I want control?"',
    },
    why: {
      zh: '无妄卦教的是做减法。善念不是加更多好的想法，是减去多余的控制欲。',
      en: 'Innocence teaches subtraction. Goodness is not adding more good ideas — it is subtracting the excess need to control.',
    },
    scope: 'mind',
  },
  {
    id: 26, name: '大畜', nameEn: 'Great Accumulation',
    principle: {
      zh: '积蓄不是为了囤积。是为了有一天能倾尽所有',
      en: 'Accumulation is not for hoarding. It is so that one day you can give it all away.',
    },
    practice: {
      zh: '今天，找一个你有但别人缺的东西（时间、知识、耐心、钱）。给出去一点点。',
      en: 'Today, find something you have that someone else lacks — time, knowledge, patience, money. Give a little of it away.',
    },
    why: {
      zh: '大畜卦的积蓄的终极意义是给予。你不给出去的东西不是你的财富，是你的负担。',
      en: 'The ultimate meaning of Great Accumulation is giving. What you do not give away is not your wealth — it is your burden.',
    },
    scope: 'wealth',
  },
  {
    id: 27, name: '颐', nameEn: 'Nourishment',
    principle: {
      zh: '你喂给自己什么，你就成为什么——包括念头',
      en: 'What you feed yourself, you become — including your thoughts.',
    },
    practice: {
      zh: '今天，在你输入任何信息之前（刷手机、看新闻），先问：「这是滋养我的，还是消耗我的？」',
      en: 'Today, before you consume any information — scrolling, reading news — ask: "Is this nourishing me, or draining me?"',
    },
    why: {
      zh: '颐卦是你精神进食的守卫。你的念头就是你业力的食物。喂自己什么，就长出什么。',
      en: 'Nourishment is the guardian of your mental diet. Your thoughts are the food of your karma. What you feed yourself, grows.',
    },
    scope: 'mind',
  },
  {
    id: 28, name: '大过', nameEn: 'Great Excess',
    principle: {
      zh: '过度不是你的问题。是你的天赋。但需要对准方向',
      en: 'Excess is not your problem. It is your gift. It just needs to be aimed in the right direction.',
    },
    practice: {
      zh: '今天，把你的过度投入放到一件善事上。如果你容易过度担心，那就过度关心一个人。',
      en: 'Today, channel your tendency toward excess into one act of goodness. If you worry too much, care too much about one person instead.',
    },
    why: {
      zh: '大过卦说你改不了「过度」的天性，但可以把它的方向从破坏转向建设。',
      en: 'Great Excess says you cannot change your nature of "too much" — but you can redirect it from destruction toward construction.',
    },
    scope: 'mind',
  },
  {
    id: 29, name: '坎', nameEn: 'The Abyss',
    principle: {
      zh: '深水不可怕。可怕的是你不会游泳却一直挣扎',
      en: 'Deep water is not frightening. What is frightening is thrashing when you do not know how to swim.',
    },
    practice: {
      zh: '今天，如果你感到被情绪淹没，不要挣扎。浮在水面上。告诉自己：「这是无常。它终会过去。」',
      en: 'Today, if you feel flooded by emotion, do not struggle. Float. Tell yourself: "This is impermanent. It will pass."',
    },
    why: {
      zh: '坎卦的深水是你修心的道场。你在风浪中不动的那一刻，业力再也抓不住你。',
      en: 'The deep water of The Abyss is your training ground for the mind. The moment you stay still in the waves, karma can no longer grab you.',
    },
    scope: 'health',
  },
  {
    id: 30, name: '离', nameEn: 'The Clinging',
    principle: {
      zh: '光明不是你的终点。是你选择放在什么地方的注意力',
      en: 'Light is not your destination. It is where you choose to place your attention.',
    },
    practice: {
      zh: '今天，把你的注意力放在一个人身上超过5分钟。不看手机。不打断。只听。',
      en: 'Today, give your full attention to one person for over five minutes. No phone. No interruption. Just listen.',
    },
    why: {
      zh: '离卦之火在于聚焦。你把注意力完全给一个人时，你在燃烧自己照亮他。这是最纯粹的光。',
      en: 'The fire of The Clinging is focus. When you give your complete attention to one person, you burn yourself to light them up. This is the purest light.',
    },
    scope: 'love',
  },
  {
    id: 31, name: '咸', nameEn: 'Influence',
    principle: {
      zh: '最深的感染力不是你说的话。是你安静时散发的状态',
      en: 'The deepest influence is not what you say. It is the state you emanate when you are silent.',
    },
    practice: {
      zh: '今天，在一个社交场合，你有意识地少说20%的话。把空间留出来。',
      en: 'Today, in a social setting, consciously say 20% less than you normally would. Leave space.',
    },
    why: {
      zh: '咸卦的「感」来自你的存在本身。你沉静下来时，整个世界都在被你影响。',
      en: 'The sensation of Influence comes from your very presence. When you settle into stillness, the entire world is affected by you.',
    },
    scope: 'love',
  },
  {
    id: 32, name: '恒', nameEn: 'Duration',
    principle: {
      zh: '恒久不是一直不变。是在每一次改变后选择继续',
      en: 'Endurance is not staying the same. It is choosing to continue after every change.',
    },
    practice: {
      zh: '今天，回想一件你已经坚持了超过3个月的事。感谢过去的自己。然后继续。',
      en: 'Today, think of something you have kept doing for over three months. Thank your past self. Then continue.',
    },
    why: {
      zh: '恒卦告诉你善念不是冲刺，是长跑。你今天做的练习，3个月后才会开花。',
      en: 'Duration tells you that goodness is not a sprint — it is a long run. The practice you do today will bloom three months from now.',
    },
    scope: 'career',
  },
  {
    id: 33, name: '遁', nameEn: 'Retreat',
    principle: {
      zh: '退一步不是输。是给愤怒一个冷却成智慧的时间',
      en: 'Stepping back is not losing. It is giving anger time to cool into wisdom.',
    },
    practice: {
      zh: '今天，如果有冲突冲着你来，你在回应之前先走开3分钟。在走开的3分钟里，深呼吸。',
      en: 'Today, if conflict comes toward you, walk away for three minutes before you respond. In those three minutes, breathe deeply.',
    },
    why: {
      zh: '遁卦的撤退是战略性的。业力在愤怒中打结，在冷静中松开。3分钟可以解3年的结。',
      en: 'The retreat of Retreat is strategic. Karma ties knots in anger and loosens them in calm. Three minutes can untie three years of knots.',
    },
    scope: 'love',
  },
  {
    id: 34, name: '大壮', nameEn: 'Great Power',
    principle: {
      zh: '真正的力量不是能摧毁什么。是能忍住不摧毁什么',
      en: 'True power is not the ability to destroy. It is the ability to restrain yourself from destroying.',
    },
    practice: {
      zh: '今天，你有一个可以展示力量的时刻。选择不展示。把力量收回去。感受收回的力量在你体内。',
      en: 'Today, there is a moment when you could show your strength. Choose not to. Pull the power back. Feel it inside you.',
    },
    why: {
      zh: '大壮卦说力量最大的用场是不用。忍住的拳头比挥出的拳头更有力量。',
      en: 'Great Power says the greatest use of power is to not use it. A fist held back holds more power than a fist thrown.',
    },
    scope: 'career',
  },
  {
    id: 35, name: '晋', nameEn: 'Progress',
    principle: {
      zh: '前进不是赶路。是每一步都知道自己在往哪里走',
      en: 'Progress is not rushing forward. It is knowing, with every step, where you are heading.',
    },
    practice: {
      zh: '今天，停下所有的事。写三行字：你在哪里。你要去哪里。你此刻在做什么。',
      en: 'Today, stop everything. Write three lines: where you are, where you are going, and what you are doing right now.',
    },
    why: {
      zh: '晋卦的进步需要方向。你在迷雾中跑得再快也是原地转圈。先确定方向，再迈步。',
      en: 'The progress of Progress needs direction. No matter how fast you run in the fog, you run in circles. Find your direction, then step.',
    },
    scope: 'career',
  },
  {
    id: 36, name: '明夷', nameEn: 'Darkening of the Light',
    principle: {
      zh: '在最暗的地方，你不需要变成光。你只需要不闭上眼睛',
      en: 'In the darkest place, you do not need to become the light. You only need to keep your eyes open.',
    },
    practice: {
      zh: '今天，如果你在一个黑暗的处境里，不要说「一切都会好的」。只说：「我在这里。我看着。」',
      en: 'Today, if you are in a dark situation, do not say "everything will be fine." Just say: "I am here. I am watching."',
    },
    why: {
      zh: '明夷卦说黑暗来临时，保持清醒就是最大的光。业力在觉察中溶解。',
      en: 'Darkening of the Light says when darkness comes, staying awake is the greatest light. Karma dissolves in awareness.',
    },
    scope: 'mind',
  },
  {
    id: 37, name: '家人', nameEn: 'The Family',
    principle: {
      zh: '家不是你住的地方。是有人等你回去的地方',
      en: 'Home is not where you live. It is where someone is waiting for you to return.',
    },
    practice: {
      zh: '今天，对你最亲近的一个人说一句话，这句话你一直觉得不用说，但其实应该说的。',
      en: 'Today, say something to the person closest to you — something you have always thought did not need to be said, but actually should be.',
    },
    why: {
      zh: '家人卦说最容易被忽略的善念在最近的圈子里。一句「谢谢你在」改变一个人的一天。',
      en: 'The Family says the most easily overlooked goodness is in our innermost circle. One "thank you for being here" can change someone\'s whole day.',
    },
    scope: 'love',
  },
  {
    id: 38, name: '睽', nameEn: 'Opposition',
    principle: {
      zh: '你和世界的对立，本质是和自己的某一部分没和解',
      en: 'Your opposition to the world is, at its core, a part of yourself you have not yet made peace with.',
    },
    practice: {
      zh: '今天，找一个你讨厌的人的特质。在自己身上找一找。找到一丝也行。',
      en: 'Today, think of a trait you dislike in someone. Look for it in yourself. Even a trace is enough.',
    },
    why: {
      zh: '睽卦说所有对外的不满都指向内在的投射。你接纳了自己那个特质，外面的敌人就消失了。',
      en: 'Opposition says all outward discontent points to an inner projection. When you accept that trait in yourself, the external enemy vanishes.',
    },
    scope: 'mind',
  },
  {
    id: 39, name: '蹇', nameEn: 'Obstruction',
    principle: {
      zh: '路断了不是尽头。是提醒你换一条更适合你的路',
      en: 'A broken road is not a dead end. It is a reminder to take a path that suits you better.',
    },
    practice: {
      zh: '今天，如果一件事让你觉得「走不通」，停下来。问：「有没有第三条路我还没看到？」',
      en: 'Today, if something feels like a dead end, stop. Ask: "Is there a third way I have not seen yet?"',
    },
    why: {
      zh: '蹇卦告诉你障碍是导航，不是惩罚。每一次碰壁都在告诉你：你的路在另一边。',
      en: 'Obstruction tells you that obstacles are navigation, not punishment. Every wall you hit is telling you: your path is on the other side.',
    },
    scope: 'career',
  },
  {
    id: 40, name: '解', nameEn: 'Deliverance',
    principle: {
      zh: '解脱不是没有问题了。是问题来了你不会被卷进去',
      en: 'Deliverance is not the absence of problems. It is problems arriving without pulling you under.',
    },
    practice: {
      zh: '今天，找一个你纠结了很久的事。对自己说：「我不需要今天解决它。」然后放下。',
      en: 'Today, find something you have been agonizing over. Tell yourself: "I do not need to solve this today." Then let it go.',
    },
    why: {
      zh: '解卦的解脱来自松手。你抓得越紧，业力缠得越深。松手不是放弃，是交还给时间。',
      en: 'The deliverance of Deliverance comes from letting go. The tighter you grip, the deeper karma entangles. Letting go is not giving up — it is returning it to time.',
    },
    scope: 'mind',
  },
  {
    id: 41, name: '损', nameEn: 'Decrease',
    principle: {
      zh: '你今天失去的，本来就不属于你。只是你曾经误以为属于你',
      en: 'What you lost today was never yours to begin with. You only once mistook it for yours.',
    },
    practice: {
      zh: '今天，如果有什么离开你的生活，看着它离开。不说一句话。感受放手后的轻松。',
      en: 'Today, if something leaves your life, watch it go. Say nothing. Feel the lightness after letting go.',
    },
    why: {
      zh: '损卦的减少是业力的净化。你不再需要的东西自然会脱落。不要哭它，感谢它完成了使命。',
      en: 'The decrease of Decrease is karmic cleansing. What you no longer need will fall away naturally. Do not weep for it — thank it for completing its purpose.',
    },
    scope: 'wealth',
  },
  {
    id: 42, name: '益', nameEn: 'Increase',
    principle: {
      zh: '你帮助别人不需要成为英雄。做刚好被需要的那双手',
      en: 'You do not need to be a hero to help someone. Be the hands that are needed, right now.',
    },
    practice: {
      zh: '今天，留意一个你能帮但没人要求你帮的时刻。不问「需要帮忙吗」，直接伸手。',
      en: 'Today, notice a moment when you can help but no one has asked. Do not ask "need help?" — just extend your hand.',
    },
    why: {
      zh: '益卦的增益来自无声的行动。你不需要被感谢。你需要的是做了之后的安宁。',
      en: 'The increase of Increase comes from silent action. You do not need to be thanked. What you need is the peace that comes after doing it.',
    },
    scope: 'love',
  },
  {
    id: 43, name: '夬', nameEn: 'Breakthrough',
    principle: {
      zh: '决断不需要仪式。只需要你在心里说「够了」的那一刻',
      en: 'Decisiveness needs no ceremony. It only needs the moment you say "enough" in your heart.',
    },
    practice: {
      zh: '今天，如果你有一个一直拖着没做的决断，写下那个决断的最后一句话。只写那一句。',
      en: 'Today, if there is a decision you have been postponing, write down the last sentence of that decision. Just that one sentence.',
    },
    why: {
      zh: '夬卦的突破在你内心完成的那一刻就已经完成了。行动只是确认。',
      en: 'The breakthrough of Breakthrough is complete the moment it happens inside you. The action is only confirmation.',
    },
    scope: 'career',
  },
  {
    id: 44, name: '姤', nameEn: 'Coming to Meet',
    principle: {
      zh: '每一次偶遇都不是偶然。是你业力让你恰好走到那里',
      en: 'No encounter is coincidence. Your karma brought you exactly to that place.',
    },
    practice: {
      zh: '今天，对今天遇到的第一个陌生人友善一点。不需要说话。一个眼神。一个让路。',
      en: 'Today, be kind to the first stranger you encounter. No words needed. A look. A step aside.',
    },
    why: {
      zh: '姤卦说每一个相遇都是因果的精确安排。你如何对待这一刻的陌生人，决定了下一世你们的关系。',
      en: 'Coming to Meet says every encounter is the precise arrangement of cause and effect. How you treat this moment\'s stranger determines your relationship in the next life.',
    },
    scope: 'love',
  },
  {
    id: 45, name: '萃', nameEn: 'Gathering Together',
    principle: {
      zh: '一个人的力量是火花。一群人的力量是火焰',
      en: 'The power of one is a spark. The power of many is a flame.',
    },
    practice: {
      zh: '今天，你不是一个人。找到和你方向相同的人群，说一句「我们一起」。',
      en: 'Today, you are not alone. Find people heading the same direction and say: "Let us go together."',
    },
    why: {
      zh: '萃卦的聚集是善念的放大器。一个人的善念是火种，一群人的善念能改变社区的温度。',
      en: 'The gathering of Gathering Together amplifies goodness. One person\'s good thought is a spark; many people\'s goodness can change the temperature of a community.',
    },
    scope: 'love',
  },
  {
    id: 46, name: '升', nameEn: 'Pushing Upward',
    principle: {
      zh: '上升不是攀登。是植物向着阳光自然生长的姿态',
      en: 'Rising is not climbing. It is the natural posture of a plant growing toward sunlight.',
    },
    practice: {
      zh: '今天，找到一个你正在进步但没被自己注意到的方面。对自己说：「你已经在往前走了。」',
      en: 'Today, find an area where you are improving but have not noticed. Tell yourself: "You are already moving forward."',
    },
    why: {
      zh: '升卦说成长不是努力的结果，是方向的必然。你朝着光，自然就上升。',
      en: 'Pushing Upward says growth is not the result of effort — it is the inevitability of the right direction. Face the light and you rise naturally.',
    },
    scope: 'career',
  },
  {
    id: 47, name: '困', nameEn: 'Oppression',
    principle: {
      zh: '被困住的时候，你只需要做一件事：认出困住你的是念头，不是现实',
      en: 'When you feel trapped, you only need to do one thing: recognize that what traps you is a thought, not reality.',
    },
    practice: {
      zh: '今天，写下你现在的困境。然后问自己：「10年后回头看，这件事还重要吗？」',
      en: 'Today, write down your current difficulty. Then ask: "Looking back from ten years from now, will this still matter?"',
    },
    why: {
      zh: '困卦说所有困境都是暂时的。你需要的不是解决方案，是时间尺度的转换。',
      en: 'Oppression says all difficulty is temporary. What you need is not a solution — it is a shift in the scale of time.',
    },
    scope: 'mind',
  },
  {
    id: 48, name: '井', nameEn: 'The Well',
    principle: {
      zh: '你的内在有一口永不枯竭的井。只是你太久没去打水了',
      en: 'There is a well within you that never runs dry. You have simply not drawn from it in too long.',
    },
    practice: {
      zh: '今天，静坐5分钟。不问任何问题。不要答案。只是感受自己深处的那个安静的地方。',
      en: 'Today, sit in silence for five minutes. Ask no questions. Seek no answers. Just feel that quiet place deep within yourself.',
    },
    why: {
      zh: '井卦说每个人的内在都有一个智慧的源头。你不需要去外面找答案。你需要的是安静下来听。',
      en: 'The Well says everyone has a source of wisdom within. You do not need to search outside for answers. You need to be quiet enough to hear.',
    },
    scope: 'mind',
  },
  {
    id: 49, name: '革', nameEn: 'Revolution',
    principle: {
      zh: '你是不是一直在忍受一件事？今天，你只需要对那件事说一个真字',
      en: 'Have you been enduring something for too long? Today, you only need to speak one true word about it.',
    },
    practice: {
      zh: '今天，找到你一直在忍但早就不该忍的一件事。对这件事说出真相。只对自己说也行。',
      en: 'Today, find that one thing you have been tolerating but should have stopped tolerating long ago. Speak the truth about it — even if only to yourself.',
    },
    why: {
      zh: '革卦的革命从一句真话开始。你说出真相的那一刻，旧业力开始退场。',
      en: 'The revolution of Revolution begins with one true sentence. The moment you speak the truth, old karma begins to exit.',
    },
    scope: 'career',
  },
  {
    id: 50, name: '鼎', nameEn: 'The Cauldron',
    principle: {
      zh: '你是被重新铸造的。每一次善念都在煅烧你这个器皿',
      en: 'You are being recast. Every good thought is firing the vessel that you are.',
    },
    practice: {
      zh: '今天，把自己想象成一个容器。你今天装进去的善念会让你明天托起更多。',
      en: 'Today, imagine yourself as a vessel. The goodness you pour into yourself today will allow you to hold more tomorrow.',
    },
    why: {
      zh: '鼎卦说一个人的格局是被善念煅烧出来的。你每一次练习都在扩大自己的容量。',
      en: 'The Cauldron says a person\'s capacity is forged by the fire of good thoughts. Every practice expands what you can hold.',
    },
    scope: 'mind',
  },
  {
    id: 51, name: '震', nameEn: 'The Arousing',
    principle: {
      zh: '震惊之后的安静，比震惊之前的安静更深',
      en: 'The stillness after shock is deeper than the stillness before it.',
    },
    practice: {
      zh: '今天，如果发生了让你意外的事，先不要反应。在心里数5下。然后感受那个冲击波穿过你的身体。',
      en: 'Today, if something unexpected happens, do not react right away. Count to five in your mind. Then feel the shockwave pass through your body.',
    },
    why: {
      zh: '震卦说冲击是业力给你的觉醒机会。你在冲击中保持觉察的那一刻，旧模式就被震碎了。',
      en: 'The Arousing says shock is an awakening opportunity given by karma. The moment you stay aware through the shock, old patterns shatter.',
    },
    scope: 'health',
  },
  {
    id: 52, name: '艮', nameEn: 'Keeping Still',
    principle: {
      zh: '静止不是死亡。是种子在土里积蓄破土的力量',
      en: 'Stillness is not death. It is the seed underground, gathering the strength to break through.',
    },
    practice: {
      zh: '今天，找10分钟完全安静。不做事。不思考。只是坐着。像一座山。',
      en: 'Today, find ten minutes of complete stillness. Do nothing. Think nothing. Just sit. Like a mountain.',
    },
    why: {
      zh: '艮卦的止是人类最难的修行。你在静止中积蓄的善念力量，十倍于行动中。',
      en: 'The stillness of Keeping Still is humanity\'s hardest practice. The goodness you accumulate in stillness is ten times that of action.',
    },
    scope: 'mind',
  },
  {
    id: 53, name: '渐', nameEn: 'Development',
    principle: {
      zh: '急不来的事，急只会让它在原地打转',
      en: 'What cannot be rushed will only spin in place if you try to rush it.',
    },
    practice: {
      zh: '今天，找一件你一直在推动但效果缓慢的事。对它说：「我允许你按自己的节奏长。」',
      en: 'Today, find something you have been pushing but that moves slowly. Say to it: "I give you permission to grow at your own pace."',
    },
    why: {
      zh: '渐卦的渐进是自然的法则。种子不会今天种明天就长成树。你的善念也是。',
      en: 'The gradualism of Development is nature\'s law. A seed does not become a tree the day after planting. Neither does your goodness.',
    },
    scope: 'career',
  },
  {
    id: 54, name: '归妹', nameEn: 'The Marrying Maiden',
    principle: {
      zh: '关系中最难的不是付出。是接受——坦然接受别人对你的好',
      en: 'The hardest thing in relationships is not giving. It is receiving — accepting others\' kindness toward you with grace.',
    },
    practice: {
      zh: '今天，如果有人对你好，不推辞。不说「不用不用」。只说「谢谢」。然后接受。',
      en: 'Today, if someone is kind to you, do not deflect. Do not say "no, no, you shouldn\'t have." Just say "thank you." Then receive it.',
    },
    why: {
      zh: '归妹卦说接受是更高阶的善。你允许别人对你好，完成了别人的业力循环。',
      en: 'The Marrying Maiden says receiving is a higher form of goodness. When you allow others to be kind to you, you complete their karmic cycle.',
    },
    scope: 'love',
  },
  {
    id: 55, name: '丰', nameEn: 'Abundance',
    principle: {
      zh: '此刻就是最好的时候。不是未来。不是过去。就是此刻',
      en: 'This moment is the best moment. Not the future. Not the past. Right now.',
    },
    practice: {
      zh: '今天，在一天中找一个普通的时刻。对自己说：「我现在不需要更好的时刻。这就是。」',
      en: 'Today, find an ordinary moment. Tell yourself: "I do not need a better moment than this one. This is it."',
    },
    why: {
      zh: '丰卦的丰盛不来自得到更多。来自你发现此刻已经足够。',
      en: 'The abundance of Abundance does not come from having more. It comes from discovering that this moment is already enough.',
    },
    scope: 'wealth',
  },
  {
    id: 56, name: '旅', nameEn: 'The Wanderer',
    principle: {
      zh: '你在这个世界上只是过客。所以不要把行李绑太紧',
      en: 'You are only a traveler in this world. So do not tie your luggage too tightly.',
    },
    practice: {
      zh: '今天，找到一个你抓得太紧的东西（一个想法、一段关系、一个身份）。在心里松一松。',
      en: 'Today, find one thing you are gripping too tightly — a thought, a relationship, an identity. Loosen it in your heart.',
    },
    why: {
      zh: '旅卦提醒你和世界的关系是暂时的。你什么都不真正拥有。这个认知会让你自由。',
      en: 'The Wanderer reminds you that your relationship with the world is temporary. You truly own nothing. This knowledge will set you free.',
    },
    scope: 'mind',
  },
  {
    id: 57, name: '巽', nameEn: 'The Gentle',
    principle: {
      zh: '最有力道的不是狂风。是持续吹的微风',
      en: 'The most powerful force is not the gale. It is the gentle breeze that never stops blowing.',
    },
    practice: {
      zh: '今天，用最轻柔的方式对待一个人。不只是语气。是所有。包括眼神。包括等待。',
      en: 'Today, treat one person in the gentlest way. Not just your tone. Everything — your gaze, your patience, your waiting.',
    },
    why: {
      zh: '巽卦的柔是你最锋利的武器。轻柔的善念比激烈的善行更容易进入人心。',
      en: 'The gentleness of The Gentle is your sharpest weapon. A soft good thought enters the heart more easily than a forceful good deed.',
    },
    scope: 'love',
  },
  {
    id: 58, name: '兑', nameEn: 'The Joyous',
    principle: {
      zh: '快乐不是外界给你的。是你选择散发出去的频率',
      en: 'Joy is not given to you by the outside world. It is the frequency you choose to radiate.',
    },
    practice: {
      zh: '今天，在你进入一个房间或一个对话前，先在脸上准备一个微笑。先有表情，然后心情会跟上。',
      en: 'Today, before you enter a room or a conversation, put a smile on your face first. The expression comes first — the feeling will follow.',
    },
    why: {
      zh: '兑卦的喜悦来自你先给出它。你微笑时，大脑会相信你是快乐的。身体先行动，心会跟上。',
      en: 'The joy of The Joyous comes from giving it first. When you smile, your brain believes you are happy. The body acts first — the heart follows.',
    },
    scope: 'mind',
  },
  {
    id: 59, name: '涣', nameEn: 'Dispersion',
    principle: {
      zh: '你散落的心念正在浪费你最大的力量——专注',
      en: 'Your scattered thoughts are wasting your greatest power — focus.',
    },
    practice: {
      zh: '今天，关掉所有通知2小时。只做一件事。如果走神了，不骂自己，只说「回来」然后继续。',
      en: 'Today, silence all notifications for two hours. Do only one thing. If your mind wanders, do not scold yourself — just say "come back" and continue.',
    },
    why: {
      zh: '涣卦的分散是业力最大的浪费者。你把善念集中在一个方向上时，力量是分散的十倍。',
      en: 'The dispersion of Dispersion is karma\'s greatest waste. When you focus your goodness in one direction, its power is ten times that of scattered efforts.',
    },
    scope: 'career',
  },
  {
    id: 60, name: '节', nameEn: 'Limitation',
    principle: {
      zh: '限制不是剥夺你的自由。是给你一个框架让自由有意义',
      en: 'Limitation does not take away your freedom. It gives you a frame in which freedom has meaning.',
    },
    practice: {
      zh: '今天，给自己设一个限制：今天只说必要的话。多余的每一句都先在心里过一遍。',
      en: 'Today, set yourself one limit: speak only what is necessary. Every extra word, let it first pass through your heart.',
    },
    why: {
      zh: '节卦的节制让每一句话都带着重量。你说得越少，剩下的越有价值。',
      en: 'The restraint of Limitation gives weight to every word you speak. The less you say, the more each remaining word is worth.',
    },
    scope: 'mind',
  },
  {
    id: 61, name: '中孚', nameEn: 'Inner Truth',
    principle: {
      zh: '你对自己有多真，你对世界就多有力',
      en: 'How true you are to yourself is how powerful you are in the world.',
    },
    practice: {
      zh: '今天，在镜子前看自己3分钟。不评价。只是看你自己的眼睛。然后说：「我看见你了。」',
      en: 'Today, look at yourself in the mirror for three minutes. No judgment. Just look into your own eyes. Then say: "I see you."',
    },
    why: {
      zh: '中孚卦的诚从直面自己开始。你能直视自己的眼睛时，就没有人能骗你。包括你自己。',
      en: 'The sincerity of Inner Truth begins with facing yourself. When you can look into your own eyes, no one can deceive you — including yourself.',
    },
    scope: 'mind',
  },
  {
    id: 62, name: '小过', nameEn: 'Small Exceeding',
    principle: {
      zh: '在小事上多走一步。多走的这一步不是浪费，是你的签名',
      en: 'Take one extra step in the small things. That extra step is not wasted — it is your signature.',
    },
    practice: {
      zh: '今天，在做完一件该做的事之后，多做一小步。比如洗碗后把水槽擦干。不需要任何人看到。',
      en: 'Today, after finishing something you should do, do one small extra thing. Wipe the sink dry after washing dishes. No one needs to see.',
    },
    why: {
      zh: '小过卦说超越在小处才体现品格。没人看的地方多走一步，是善念的最高形式。',
      en: 'Small Exceeding says that going beyond in small things reveals true character. Taking one extra step where no one is watching — that is goodness in its highest form.',
    },
    scope: 'career',
  },
  {
    id: 63, name: '既济', nameEn: 'After Completion',
    principle: {
      zh: '完成不是结束。是一个循环的句号，紧接着就是新的开始',
      en: 'Completion is not the end. It is the closing of a cycle, immediately followed by a new beginning.',
    },
    practice: {
      zh: '今天，庆祝一件你做完的事。不是小庆祝。是真正给自己一个归属。然后准备迎接下一个。',
      en: 'Today, celebrate something you have finished. Not a small celebration — truly give yourself closure. Then prepare to welcome what comes next.',
    },
    why: {
      zh: '既济卦说每一个结束都藏着新开始。你庆祝了过去，才能轻装进入未来。',
      en: 'After Completion says every ending conceals a new beginning. Only by celebrating the past can you enter the future with a light heart.',
    },
    scope: 'career',
  },
  {
    id: 64, name: '未济', nameEn: 'Before Completion',
    principle: {
      zh: '没有完成的人生才是完整的人生。因为你永远在路上',
      en: 'A life that is never complete is a complete life. Because you will always be on the way.',
    },
    practice: {
      zh: '今天，接受你不完美的自己。不需要成为任何人。此刻的你，就是这场修行最好的版本。',
      en: 'Today, accept your imperfect self. You do not need to become anyone else. Right now, you are the best version of this journey.',
    },
    why: {
      zh: '未济卦是易经最后一卦——它告诉你修行永无止境。而这，正是人生最美的部分。',
      en: 'Before Completion is the final hexagram — it tells you that practice has no end. And that is the most beautiful part of being alive.',
    },
    scope: 'mind',
  },
]

// 根据出生信息计算本命卦（简化版，用年月日时散列到64卦）
export function getLifeHexagram(birthYear: number, birthMonth: number, birthDay: number, birthHour: number): number {
  const raw = (birthYear * 3721 + birthMonth * 311 + birthDay * 73 + birthHour * 17) % 64
  return raw + 1
}

// 根据日期和练习天数获取今日卦象
export function getDailyHexagram(dateStr: string, practiceDay: number): HexagramGuide {
  const dateHash = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const idx = (dateHash + practiceDay * 7) % 64
  return HEXAGRAMS[idx]
}

// 根据人生维度筛选相关卦象
export function getHexagramsByScope(scope: string): HexagramGuide[] {
  return HEXAGRAMS.filter(h => h.scope === scope)
}

// 获取随机卦象（用于初始分配或随机练习）
export function getRandomHexagram(): HexagramGuide {
  return HEXAGRAMS[Math.floor(Math.random() * 64)]
}
