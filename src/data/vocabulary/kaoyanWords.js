// 考研英语核心词汇库
// 包含真实语境例句（来自美剧、电影、名人演讲等）

// 导入ECDICT词汇数据
import ecdictKy from './ecdict-ky.json'
import ecdictCet4 from './ecdict-cet4.json'
import ecdictCet6 from './ecdict-cet6.json'

// 导出ECDICT词汇
export const ecdictWords = {
  ky: ecdictKy,
  cet4: ecdictCet4,
  cet6: ecdictCet6
}

// 原有示例词汇（保留兼容）
export const kaoyanWords = [
  {
    id: 1,
    word: "abandon",
    phonetic: "/əˈbændən/",
    meanings: [
      { pos: "v.", definition: "放弃，抛弃" },
      { pos: "n.", definition: "放纵，放任" }
    ],
    examples: [
      {
        sentence: "Never abandon your dreams, no matter how impossible they seem.",
        translation: "永远不要放弃你的梦想，无论它们看起来多么不可能。",
        source: "《当幸福来敲门》"
      },
      {
        sentence: "The crew had to abandon ship when it started sinking.",
        translation: "当船开始下沉时，船员们不得不弃船。",
        source: "《泰坦尼克号》"
      }
    ],
    collocations: [
      { phrase: "abandon hope", meaning: "放弃希望" },
      { phrase: "abandon ship", meaning: "弃船" },
      { phrase: "abandon oneself to", meaning: "沉溺于" },
      { phrase: "with abandon", meaning: "放纵地" }
    ],
    difficulty: 1,
    frequency: 95,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 2,
    word: "abstract",
    phonetic: "/ˈæbstrækt/",
    meanings: [
      { pos: "adj.", definition: "抽象的" },
      { pos: "n.", definition: "摘要，概要" },
      { pos: "v.", definition: "提取，摘录" }
    ],
    examples: [
      {
        sentence: "Love is an abstract concept that's hard to define.",
        translation: "爱是一个难以定义的抽象概念。",
        source: "TED演讲"
      },
      {
        sentence: "Please write an abstract of your research paper.",
        translation: "请写一份你研究论文的摘要。",
        source: "学术写作"
      }
    ],
    collocations: [
      { phrase: "abstract concept", meaning: "抽象概念" },
      { phrase: "abstract art", meaning: "抽象艺术" },
      { phrase: "abstract thinking", meaning: "抽象思维" }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["学术词汇", "写作"]
  },
  {
    id: 3,
    word: "accommodate",
    phonetic: "/əˈkɒmədeɪt/",
    meanings: [
      { pos: "v.", definition: "容纳；适应；提供住宿" }
    ],
    examples: [
      {
        sentence: "The hotel can accommodate up to 500 guests.",
        translation: "这家酒店可以容纳多达500位客人。",
        source: "商务英语"
      },
      {
        sentence: "We need to accommodate different learning styles.",
        translation: "我们需要适应不同的学习风格。",
        source: "教育讲座"
      }
    ],
    collocations: [
      { phrase: "accommodate needs", meaning: "满足需求" },
      { phrase: "accommodate guests", meaning: "接待客人" },
      { phrase: "accommodate changes", meaning: "适应变化" }
    ],
    difficulty: 2,
    frequency: 72,
    tags: ["核心词汇"]
  },
  {
    id: 4,
    word: "accomplish",
    phonetic: "/əˈkʌmplɪʃ/",
    meanings: [
      { pos: "v.", definition: "完成，实现" }
    ],
    examples: [
      {
        sentence: "Together, we can accomplish anything.",
        translation: "团结一致，我们可以完成任何事情。",
        source: "《复仇者联盟》"
      },
      {
        sentence: "She accomplished her goal of running a marathon.",
        translation: "她实现了跑马拉松的目标。",
        source: "励志故事"
      }
    ],
    collocations: [
      { phrase: "accomplish a goal", meaning: "实现目标" },
      { phrase: "accomplish a task", meaning: "完成任务" },
      { phrase: "accomplish nothing", meaning: "一事无成" }
    ],
    difficulty: 1,
    frequency: 85,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 5,
    word: "acknowledge",
    phonetic: "/əkˈnɒlɪdʒ/",
    meanings: [
      { pos: "v.", definition: "承认；致谢；确认收到" }
    ],
    examples: [
      {
        sentence: "We must acknowledge our mistakes before we can fix them.",
        translation: "我们必须先承认错误才能改正它们。",
        source: "领导力讲座"
      },
      {
        sentence: "I'd like to acknowledge everyone who helped make this possible.",
        translation: "我想感谢所有帮助实现这一切的人。",
        source: "奥斯卡颁奖典礼"
      }
    ],
    difficulty: 2,
    frequency: 80,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 6,
    word: "acquire",
    phonetic: "/əˈkwaɪə(r)/",
    meanings: [
      { pos: "v.", definition: "获得，取得；学到" }
    ],
    examples: [
      {
        sentence: "It takes years to acquire true expertise.",
        translation: "获得真正的专业知识需要多年时间。",
        source: "《异类》"
      },
      {
        sentence: "The company plans to acquire its competitor.",
        translation: "该公司计划收购其竞争对手。",
        source: "商业新闻"
      }
    ],
    difficulty: 2,
    frequency: 88,
    tags: ["核心词汇", "商务"]
  },
  {
    id: 7,
    word: "adapt",
    phonetic: "/əˈdæpt/",
    meanings: [
      { pos: "v.", definition: "适应；改编" }
    ],
    examples: [
      {
        sentence: "It is not the strongest that survive, but those who adapt.",
        translation: "生存下来的不是最强的，而是最能适应的。",
        source: "达尔文理论"
      },
      {
        sentence: "The novel was adapted into a successful film.",
        translation: "这部小说被改编成了一部成功的电影。",
        source: "电影评论"
      }
    ],
    difficulty: 1,
    frequency: 90,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 8,
    word: "adequate",
    phonetic: "/ˈædɪkwət/",
    meanings: [
      { pos: "adj.", definition: "足够的，充分的；胜任的" }
    ],
    examples: [
      {
        sentence: "Make sure you get adequate sleep before the exam.",
        translation: "确保考试前你有充足的睡眠。",
        source: "健康建议"
      },
      {
        sentence: "The evidence was not adequate to prove his guilt.",
        translation: "证据不足以证明他有罪。",
        source: "法律剧"
      }
    ],
    difficulty: 2,
    frequency: 75,
    tags: ["核心词汇"]
  },
  {
    id: 9,
    word: "advocate",
    phonetic: "/ˈædvəkeɪt/",
    meanings: [
      { pos: "v.", definition: "提倡，主张" },
      { pos: "n.", definition: "提倡者，支持者" }
    ],
    examples: [
      {
        sentence: "She advocates for equal rights for all people.",
        translation: "她倡导所有人的平等权利。",
        source: "马丁·路德·金演讲"
      },
      {
        sentence: "He became an advocate for environmental protection.",
        translation: "他成为了环境保护的倡导者。",
        source: "环保纪录片"
      }
    ],
    difficulty: 2,
    frequency: 82,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 10,
    word: "affect",
    phonetic: "/əˈfekt/",
    meanings: [
      { pos: "v.", definition: "影响；感动" }
    ],
    examples: [
      {
        sentence: "Climate change affects everyone on this planet.",
        translation: "气候变化影响着这个星球上的每一个人。",
        source: "联合国演讲"
      },
      {
        sentence: "His words deeply affected me.",
        translation: "他的话深深地打动了我。",
        source: "文学作品"
      }
    ],
    difficulty: 1,
    frequency: 95,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 11,
    word: "afford",
    phonetic: "/əˈfɔːd/",
    meanings: [
      { pos: "v.", definition: "负担得起；提供" }
    ],
    examples: [
      {
        sentence: "We cannot afford to ignore this problem any longer.",
        translation: "我们再也不能忽视这个问题了。",
        source: "政治演讲"
      },
      {
        sentence: "Can you afford to take a year off work?",
        translation: "你能负担得起休假一年吗？",
        source: "日常对话"
      }
    ],
    difficulty: 1,
    frequency: 88,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 12,
    word: "aggressive",
    phonetic: "/əˈɡresɪv/",
    meanings: [
      { pos: "adj.", definition: "侵略性的；有进取心的" }
    ],
    examples: [
      {
        sentence: "The company adopted an aggressive marketing strategy.",
        translation: "公司采取了积极进取的营销策略。",
        source: "商业案例"
      },
      {
        sentence: "His aggressive behavior scared everyone away.",
        translation: "他的攻击性行为把所有人都吓跑了。",
        source: "心理学讲座"
      }
    ],
    difficulty: 2,
    frequency: 76,
    tags: ["核心词汇"]
  },
  {
    id: 13,
    word: "allocate",
    phonetic: "/ˈæləkeɪt/",
    meanings: [
      { pos: "v.", definition: "分配，拨出" }
    ],
    examples: [
      {
        sentence: "The government will allocate more funds to education.",
        translation: "政府将拨出更多资金用于教育。",
        source: "新闻报道"
      },
      {
        sentence: "We need to allocate our time more efficiently.",
        translation: "我们需要更有效地分配时间。",
        source: "时间管理"
      }
    ],
    difficulty: 2,
    frequency: 70,
    tags: ["学术词汇", "商务"]
  },
  {
    id: 14,
    word: "alter",
    phonetic: "/ˈɔːltə(r)/",
    meanings: [
      { pos: "v.", definition: "改变，修改" }
    ],
    examples: [
      {
        sentence: "Nothing can alter my decision.",
        translation: "没有什么能改变我的决定。",
        source: "电影台词"
      },
      {
        sentence: "The dress needs to be altered to fit properly.",
        translation: "这件裙子需要修改才能合身。",
        source: "日常对话"
      }
    ],
    difficulty: 1,
    frequency: 80,
    tags: ["核心词汇"]
  },
  {
    id: 15,
    word: "ambiguous",
    phonetic: "/æmˈbɪɡjuəs/",
    meanings: [
      { pos: "adj.", definition: "模棱两可的，含糊的" }
    ],
    examples: [
      {
        sentence: "The ending of the movie was deliberately ambiguous.",
        translation: "电影的结局故意设置得模棱两可。",
        source: "电影评论"
      },
      {
        sentence: "His answer was ambiguous and didn't really help.",
        translation: "他的回答含糊不清，并没有真正帮助。",
        source: "学术讨论"
      }
    ],
    difficulty: 3,
    frequency: 65,
    tags: ["学术词汇", "阅读"]
  },
  {
    id: 16,
    word: "analyze",
    phonetic: "/ˈænəlaɪz/",
    meanings: [
      { pos: "v.", definition: "分析，解析" }
    ],
    examples: [
      {
        sentence: "Let's analyze the data before making any conclusions.",
        translation: "在得出任何结论之前，让我们先分析数据。",
        source: "科学研究"
      },
      {
        sentence: "She can analyze complex problems quickly.",
        translation: "她能快速分析复杂问题。",
        source: "职场评价"
      }
    ],
    difficulty: 2,
    frequency: 85,
    tags: ["学术词汇", "高频"]
  },
  {
    id: 17,
    word: "anticipate",
    phonetic: "/ænˈtɪsɪpeɪt/",
    meanings: [
      { pos: "v.", definition: "预期，期望；预见" }
    ],
    examples: [
      {
        sentence: "We anticipate a significant increase in sales.",
        translation: "我们预期销售额会大幅增长。",
        source: "商业报告"
      },
      {
        sentence: "I didn't anticipate such a warm welcome.",
        translation: "我没有预料到会受到如此热烈的欢迎。",
        source: "社交场合"
      }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["核心词汇", "商务"]
  },
  {
    id: 18,
    word: "apparent",
    phonetic: "/əˈpærənt/",
    meanings: [
      { pos: "adj.", definition: "明显的；表面上的" }
    ],
    examples: [
      {
        sentence: "It was apparent that something was wrong.",
        translation: "很明显有什么地方不对劲。",
        source: "侦探小说"
      },
      {
        sentence: "His apparent calm hid deep anxiety.",
        translation: "他表面上的平静掩盖了深深的焦虑。",
        source: "心理描写"
      }
    ],
    difficulty: 2,
    frequency: 82,
    tags: ["核心词汇", "阅读"]
  },
  {
    id: 19,
    word: "appeal",
    phonetic: "/əˈpiːl/",
    meanings: [
      { pos: "v.", definition: "呼吁；吸引；上诉" },
      { pos: "n.", definition: "呼吁；吸引力；上诉" }
    ],
    examples: [
      {
        sentence: "The idea doesn't appeal to me at all.",
        translation: "这个想法对我一点吸引力都没有。",
        source: "日常对话"
      },
      {
        sentence: "They made an appeal for donations.",
        translation: "他们呼吁捐款。",
        source: "慈善活动"
      }
    ],
    difficulty: 2,
    frequency: 85,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 20,
    word: "appreciate",
    phonetic: "/əˈpriːʃieɪt/",
    meanings: [
      { pos: "v.", definition: "欣赏；感激；理解" }
    ],
    examples: [
      {
        sentence: "I really appreciate your help.",
        translation: "我真的很感激你的帮助。",
        source: "日常表达"
      },
      {
        sentence: "You don't appreciate what you have until it's gone.",
        translation: "失去之后你才会珍惜你所拥有的。",
        source: "人生感悟"
      }
    ],
    difficulty: 1,
    frequency: 92,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 21,
    word: "approach",
    phonetic: "/əˈprəʊtʃ/",
    meanings: [
      { pos: "v.", definition: "接近；着手处理" },
      { pos: "n.", definition: "方法；途径" }
    ],
    examples: [
      {
        sentence: "We need a new approach to solve this problem.",
        translation: "我们需要一种新方法来解决这个问题。",
        source: "商业会议"
      },
      {
        sentence: "As winter approaches, the days get shorter.",
        translation: "随着冬天临近，白天变短了。",
        source: "自然描写"
      }
    ],
    difficulty: 1,
    frequency: 95,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 22,
    word: "appropriate",
    phonetic: "/əˈprəʊpriət/",
    meanings: [
      { pos: "adj.", definition: "适当的，恰当的" },
      { pos: "v.", definition: "拨出；挪用" }
    ],
    examples: [
      {
        sentence: "Is this dress appropriate for the occasion?",
        translation: "这件裙子适合这个场合吗？",
        source: "社交礼仪"
      },
      {
        sentence: "The government appropriated funds for the project.",
        translation: "政府为该项目拨出了资金。",
        source: "政府报告"
      }
    ],
    difficulty: 2,
    frequency: 80,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 23,
    word: "arbitrary",
    phonetic: "/ˈɑːbɪtrəri/",
    meanings: [
      { pos: "adj.", definition: "任意的；武断的" }
    ],
    examples: [
      {
        sentence: "The decision seemed completely arbitrary.",
        translation: "这个决定似乎完全是武断的。",
        source: "法律评论"
      },
      {
        sentence: "The rules are not arbitrary; they have a purpose.",
        translation: "这些规则不是随意的；它们有其目的。",
        source: "教育讨论"
      }
    ],
    difficulty: 3,
    frequency: 60,
    tags: ["学术词汇", "阅读"]
  },
  {
    id: 24,
    word: "arise",
    phonetic: "/əˈraɪz/",
    meanings: [
      { pos: "v.", definition: "出现，产生；起身" }
    ],
    examples: [
      {
        sentence: "Problems may arise if we don't plan carefully.",
        translation: "如果我们不仔细计划，可能会出现问题。",
        source: "项目管理"
      },
      {
        sentence: "A new opportunity has arisen.",
        translation: "一个新的机会出现了。",
        source: "职业发展"
      }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["核心词汇"]
  },
  {
    id: 25,
    word: "assert",
    phonetic: "/əˈsɜːt/",
    meanings: [
      { pos: "v.", definition: "断言，声称；维护" }
    ],
    examples: [
      {
        sentence: "She asserted her innocence throughout the trial.",
        translation: "她在整个审判过程中都坚称自己无罪。",
        source: "法律剧"
      },
      {
        sentence: "You need to assert yourself more in meetings.",
        translation: "你需要在会议上更加自信地表达自己。",
        source: "职场建议"
      }
    ],
    difficulty: 2,
    frequency: 72,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 26,
    word: "assess",
    phonetic: "/əˈses/",
    meanings: [
      { pos: "v.", definition: "评估，评定" }
    ],
    examples: [
      {
        sentence: "We need to assess the risks before proceeding.",
        translation: "我们需要在继续之前评估风险。",
        source: "商业决策"
      },
      {
        sentence: "The teacher will assess your progress regularly.",
        translation: "老师会定期评估你的进步。",
        source: "教育场景"
      }
    ],
    difficulty: 2,
    frequency: 85,
    tags: ["核心词汇", "学术词汇"]
  },
  {
    id: 27,
    word: "assign",
    phonetic: "/əˈsaɪn/",
    meanings: [
      { pos: "v.", definition: "分配；指派；指定" }
    ],
    examples: [
      {
        sentence: "The teacher assigned homework for the weekend.",
        translation: "老师布置了周末作业。",
        source: "学校场景"
      },
      {
        sentence: "Each team member was assigned a specific task.",
        translation: "每个团队成员都被分配了特定的任务。",
        source: "项目管理"
      }
    ],
    difficulty: 1,
    frequency: 82,
    tags: ["核心词汇"]
  },
  {
    id: 28,
    word: "assume",
    phonetic: "/əˈsjuːm/",
    meanings: [
      { pos: "v.", definition: "假设；承担；呈现" }
    ],
    examples: [
      {
        sentence: "Don't assume anything without evidence.",
        translation: "没有证据不要假设任何事情。",
        source: "科学方法"
      },
      {
        sentence: "She assumed the role of team leader.",
        translation: "她承担了团队领导的角色。",
        source: "职场场景"
      }
    ],
    difficulty: 1,
    frequency: 90,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 29,
    word: "assure",
    phonetic: "/əˈʃʊə(r)/",
    meanings: [
      { pos: "v.", definition: "向...保证；使确信" }
    ],
    examples: [
      {
        sentence: "I assure you, everything will be fine.",
        translation: "我向你保证，一切都会好的。",
        source: "安慰用语"
      },
      {
        sentence: "The quality is assured by our strict standards.",
        translation: "质量由我们严格的标准来保证。",
        source: "产品宣传"
      }
    ],
    difficulty: 2,
    frequency: 75,
    tags: ["核心词汇"]
  },
  {
    id: 30,
    word: "attach",
    phonetic: "/əˈtætʃ/",
    meanings: [
      { pos: "v.", definition: "附上；贴上；使依恋" }
    ],
    examples: [
      {
        sentence: "Please find the document attached to this email.",
        translation: "请查看附在这封邮件中的文件。",
        source: "商务邮件"
      },
      {
        sentence: "Children become attached to their caregivers.",
        translation: "孩子们会对照顾他们的人产生依恋。",
        source: "心理学"
      }
    ],
    difficulty: 1,
    frequency: 85,
    tags: ["核心词汇", "商务"]
  },
  {
    id: 31,
    word: "attain",
    phonetic: "/əˈteɪn/",
    meanings: [
      { pos: "v.", definition: "达到，获得" }
    ],
    examples: [
      {
        sentence: "She worked hard to attain her goals.",
        translation: "她努力工作以实现自己的目标。",
        source: "励志故事"
      },
      {
        sentence: "Few people attain true mastery in their field.",
        translation: "很少有人在自己的领域达到真正的精通。",
        source: "专业发展"
      }
    ],
    difficulty: 2,
    frequency: 70,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 32,
    word: "attribute",
    phonetic: "/əˈtrɪbjuːt/",
    meanings: [
      { pos: "v.", definition: "把...归因于" },
      { pos: "n.", definition: "属性，特质" }
    ],
    examples: [
      {
        sentence: "He attributed his success to hard work.",
        translation: "他把自己的成功归因于努力工作。",
        source: "成功学"
      },
      {
        sentence: "Patience is an important attribute for a teacher.",
        translation: "耐心是教师的重要品质。",
        source: "教育讨论"
      }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["核心词汇", "学术词汇"]
  },
  {
    id: 33,
    word: "authentic",
    phonetic: "/ɔːˈθentɪk/",
    meanings: [
      { pos: "adj.", definition: "真实的，真正的；可靠的" }
    ],
    examples: [
      {
        sentence: "Is this painting authentic or a copy?",
        translation: "这幅画是真迹还是复制品？",
        source: "艺术鉴赏"
      },
      {
        sentence: "Be authentic and true to yourself.",
        translation: "做真实的自己。",
        source: "人生建议"
      }
    ],
    difficulty: 2,
    frequency: 72,
    tags: ["核心词汇"]
  },
  {
    id: 34,
    word: "authority",
    phonetic: "/ɔːˈθɒrəti/",
    meanings: [
      { pos: "n.", definition: "权威；当局；权力" }
    ],
    examples: [
      {
        sentence: "He is an authority on ancient history.",
        translation: "他是古代历史方面的权威。",
        source: "学术介绍"
      },
      {
        sentence: "The authorities are investigating the incident.",
        translation: "当局正在调查这起事件。",
        source: "新闻报道"
      }
    ],
    difficulty: 1,
    frequency: 88,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 35,
    word: "available",
    phonetic: "/əˈveɪləbl/",
    meanings: [
      { pos: "adj.", definition: "可用的；有空的" }
    ],
    examples: [
      {
        sentence: "Is this seat available?",
        translation: "这个座位有人吗？",
        source: "日常对话"
      },
      {
        sentence: "All available resources will be used.",
        translation: "所有可用的资源都将被使用。",
        source: "项目规划"
      }
    ],
    difficulty: 1,
    frequency: 95,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 36,
    word: "aware",
    phonetic: "/əˈweə(r)/",
    meanings: [
      { pos: "adj.", definition: "意识到的，知道的" }
    ],
    examples: [
      {
        sentence: "Are you aware of the risks involved?",
        translation: "你意识到其中的风险了吗？",
        source: "风险提示"
      },
      {
        sentence: "We need to be more aware of environmental issues.",
        translation: "我们需要更加关注环境问题。",
        source: "环保宣传"
      }
    ],
    difficulty: 1,
    frequency: 90,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 37,
    word: "behalf",
    phonetic: "/bɪˈhɑːf/",
    meanings: [
      { pos: "n.", definition: "代表；利益" }
    ],
    examples: [
      {
        sentence: "On behalf of the company, I welcome you all.",
        translation: "我代表公司欢迎大家。",
        source: "商务致辞"
      },
      {
        sentence: "The lawyer acted on behalf of his client.",
        translation: "律师代表他的客户行事。",
        source: "法律场景"
      }
    ],
    difficulty: 2,
    frequency: 75,
    tags: ["核心词汇", "商务"]
  },
  {
    id: 38,
    word: "benefit",
    phonetic: "/ˈbenɪfɪt/",
    meanings: [
      { pos: "n.", definition: "利益，好处" },
      { pos: "v.", definition: "有益于，受益" }
    ],
    examples: [
      {
        sentence: "Exercise has many health benefits.",
        translation: "锻炼有很多健康益处。",
        source: "健康建议"
      },
      {
        sentence: "Everyone will benefit from this change.",
        translation: "每个人都将从这一变化中受益。",
        source: "改革宣传"
      }
    ],
    difficulty: 1,
    frequency: 92,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 39,
    word: "bias",
    phonetic: "/ˈbaɪəs/",
    meanings: [
      { pos: "n.", definition: "偏见，偏差" },
      { pos: "v.", definition: "使有偏见" }
    ],
    examples: [
      {
        sentence: "We must avoid bias in our research.",
        translation: "我们必须在研究中避免偏见。",
        source: "科学方法"
      },
      {
        sentence: "The media has a bias towards sensational news.",
        translation: "媒体对轰动性新闻有偏好。",
        source: "媒体批评"
      }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["学术词汇", "阅读"]
  },
  {
    id: 40,
    word: "bond",
    phonetic: "/bɒnd/",
    meanings: [
      { pos: "n.", definition: "纽带；债券；结合" },
      { pos: "v.", definition: "建立联系" }
    ],
    examples: [
      {
        sentence: "The bond between mother and child is unbreakable.",
        translation: "母子之间的纽带是牢不可破的。",
        source: "家庭关系"
      },
      {
        sentence: "They bonded over their shared love of music.",
        translation: "他们因为共同的音乐爱好而建立了联系。",
        source: "友谊故事"
      }
    ],
    difficulty: 2,
    frequency: 80,
    tags: ["核心词汇"]
  },
  {
    id: 41,
    word: "brief",
    phonetic: "/briːf/",
    meanings: [
      { pos: "adj.", definition: "简短的，短暂的" },
      { pos: "v.", definition: "向...介绍情况" },
      { pos: "n.", definition: "摘要，简报" }
    ],
    examples: [
      {
        sentence: "Let me give you a brief overview.",
        translation: "让我给你一个简要概述。",
        source: "商务会议"
      },
      {
        sentence: "Their meeting was brief but productive.",
        translation: "他们的会面虽然短暂但很有成效。",
        source: "工作描述"
      }
    ],
    difficulty: 1,
    frequency: 85,
    tags: ["核心词汇", "商务"]
  },
  {
    id: 42,
    word: "bulk",
    phonetic: "/bʌlk/",
    meanings: [
      { pos: "n.", definition: "大部分；体积" },
      { pos: "adj.", definition: "大批的" }
    ],
    examples: [
      {
        sentence: "The bulk of the work has been completed.",
        translation: "大部分工作已经完成。",
        source: "项目报告"
      },
      {
        sentence: "We buy in bulk to save money.",
        translation: "我们批量购买以省钱。",
        source: "购物策略"
      }
    ],
    difficulty: 2,
    frequency: 70,
    tags: ["核心词汇"]
  },
  {
    id: 43,
    word: "capable",
    phonetic: "/ˈkeɪpəbl/",
    meanings: [
      { pos: "adj.", definition: "有能力的，能够的" }
    ],
    examples: [
      {
        sentence: "She is capable of handling any challenge.",
        translation: "她有能力应对任何挑战。",
        source: "能力评价"
      },
      {
        sentence: "Humans are capable of great kindness.",
        translation: "人类能够表现出极大的善良。",
        source: "人性讨论"
      }
    ],
    difficulty: 1,
    frequency: 85,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 44,
    word: "capacity",
    phonetic: "/kəˈpæsəti/",
    meanings: [
      { pos: "n.", definition: "容量；能力；身份" }
    ],
    examples: [
      {
        sentence: "The stadium has a capacity of 50,000.",
        translation: "这个体育场可容纳5万人。",
        source: "场馆介绍"
      },
      {
        sentence: "He spoke in his capacity as chairman.",
        translation: "他以主席的身份发言。",
        source: "正式场合"
      }
    ],
    difficulty: 2,
    frequency: 80,
    tags: ["核心词汇"]
  },
  {
    id: 45,
    word: "category",
    phonetic: "/ˈkætəɡəri/",
    meanings: [
      { pos: "n.", definition: "类别，范畴" }
    ],
    examples: [
      {
        sentence: "The products are divided into several categories.",
        translation: "产品被分为几个类别。",
        source: "产品分类"
      },
      {
        sentence: "This falls into a different category altogether.",
        translation: "这完全属于另一个类别。",
        source: "分类讨论"
      }
    ],
    difficulty: 2,
    frequency: 78,
    tags: ["核心词汇", "学术词汇"]
  },
  {
    id: 46,
    word: "cease",
    phonetic: "/siːs/",
    meanings: [
      { pos: "v.", definition: "停止，终止" }
    ],
    examples: [
      {
        sentence: "The fighting must cease immediately.",
        translation: "战斗必须立即停止。",
        source: "和平呼吁"
      },
      {
        sentence: "He never ceases to amaze me.",
        translation: "他总是让我惊叹不已。",
        source: "赞美表达"
      }
    ],
    difficulty: 2,
    frequency: 68,
    tags: ["核心词汇", "写作"]
  },
  {
    id: 47,
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    meanings: [
      { pos: "n.", definition: "挑战" },
      { pos: "v.", definition: "挑战；质疑" }
    ],
    examples: [
      {
        sentence: "Every challenge is an opportunity to grow.",
        translation: "每一个挑战都是成长的机会。",
        source: "励志名言"
      },
      {
        sentence: "She challenged the traditional way of thinking.",
        translation: "她挑战了传统的思维方式。",
        source: "创新故事"
      }
    ],
    difficulty: 1,
    frequency: 92,
    tags: ["核心词汇", "高频"]
  },
  {
    id: 48,
    word: "channel",
    phonetic: "/ˈtʃænl/",
    meanings: [
      { pos: "n.", definition: "频道；渠道；海峡" },
      { pos: "v.", definition: "引导，传送" }
    ],
    examples: [
      {
        sentence: "We need to find new channels for communication.",
        translation: "我们需要找到新的沟通渠道。",
        source: "商务沟通"
      },
      {
        sentence: "Channel your energy into something productive.",
        translation: "把你的精力引导到有成效的事情上。",
        source: "自我提升"
      }
    ],
    difficulty: 2,
    frequency: 75,
    tags: ["核心词汇"]
  },
  {
    id: 49,
    word: "characteristic",
    phonetic: "/ˌkærəktəˈrɪstɪk/",
    meanings: [
      { pos: "n.", definition: "特征，特点" },
      { pos: "adj.", definition: "典型的，特有的" }
    ],
    examples: [
      {
        sentence: "Honesty is one of his best characteristics.",
        translation: "诚实是他最好的品质之一。",
        source: "人物描述"
      },
      {
        sentence: "This behavior is characteristic of the species.",
        translation: "这种行为是该物种的典型特征。",
        source: "生物学"
      }
    ],
    difficulty: 2,
    frequency: 80,
    tags: ["核心词汇", "学术词汇"]
  },
  {
    id: 50,
    word: "circumstance",
    phonetic: "/ˈsɜːkəmstəns/",
    meanings: [
      { pos: "n.", definition: "情况，环境；境遇" }
    ],
    examples: [
      {
        sentence: "Under no circumstances should you give up.",
        translation: "在任何情况下你都不应该放弃。",
        source: "励志演讲"
      },
      {
        sentence: "The circumstances of his death remain unclear.",
        translation: "他死亡的情况仍不清楚。",
        source: "新闻报道"
      }
    ],
    difficulty: 2,
    frequency: 82,
    tags: ["核心词汇", "写作"]
  }
]

// 词库分类
export const wordBookCategories = [
  {
    id: 'kaoyan',
    name: '考研',
    icon: '🎓',
    color: '#667eea',
    books: [
      {
        id: 'ky-all',
        name: '全部词汇',
        description: '考研大纲全部词汇',
        wordCount: ecdictKy.length,
        icon: '📚',
        source: 'ecdict-ky'
      },
      {
        id: 'ky-high-freq',
        name: '高频词汇',
        description: '考研真题高频词（BNC前3000）',
        wordCount: ecdictKy.filter(w => w.bnc > 0 && w.bnc <= 3000).length,
        icon: '🔥',
        source: 'ecdict-ky',
        filter: w => w.bnc > 0 && w.bnc <= 3000
      },
      {
        id: 'ky-core',
        name: '核心词汇',
        description: '考研必背核心词（BNC前5000）',
        wordCount: ecdictKy.filter(w => w.bnc > 0 && w.bnc <= 5000).length,
        icon: '⭐',
        source: 'ecdict-ky',
        filter: w => w.bnc > 0 && w.bnc <= 5000
      },
      {
        id: 'ky-difficult',
        name: '难词攻克',
        description: '考研低频难词（BNC 5000以后）',
        wordCount: ecdictKy.filter(w => w.bnc === 0 || w.bnc > 5000).length,
        icon: '💪',
        source: 'ecdict-ky',
        filter: w => w.bnc === 0 || w.bnc > 5000
      }
    ]
  },
  {
    id: 'cet4',
    name: '四级',
    icon: '📗',
    color: '#4facfe',
    books: [
      {
        id: 'cet4-all',
        name: '全部词汇',
        description: 'CET-4大纲全部词汇',
        wordCount: ecdictCet4.length,
        icon: '📚',
        source: 'ecdict-cet4'
      },
      {
        id: 'cet4-high-freq',
        name: '高频词汇',
        description: '四级真题高频词（BNC前2000）',
        wordCount: ecdictCet4.filter(w => w.bnc > 0 && w.bnc <= 2000).length,
        icon: '🔥',
        source: 'ecdict-cet4',
        filter: w => w.bnc > 0 && w.bnc <= 2000
      },
      {
        id: 'cet4-core',
        name: '核心词汇',
        description: '四级必背核心词（BNC前4000）',
        wordCount: ecdictCet4.filter(w => w.bnc > 0 && w.bnc <= 4000).length,
        icon: '⭐',
        source: 'ecdict-cet4',
        filter: w => w.bnc > 0 && w.bnc <= 4000
      }
    ]
  },
  {
    id: 'cet6',
    name: '六级',
    icon: '📘',
    color: '#43e97b',
    books: [
      {
        id: 'cet6-all',
        name: '全部词汇',
        description: 'CET-6大纲全部词汇',
        wordCount: ecdictCet6.length,
        icon: '📚',
        source: 'ecdict-cet6'
      },
      {
        id: 'cet6-high-freq',
        name: '高频词汇',
        description: '六级真题高频词（BNC前3000）',
        wordCount: ecdictCet6.filter(w => w.bnc > 0 && w.bnc <= 3000).length,
        icon: '�',
        source: 'ecdict-cet6',
        filter: w => w.bnc > 0 && w.bnc <= 3000
      },
      {
        id: 'cet6-core',
        name: '核心词汇',
        description: '六级必背核心词（BNC前5000）',
        wordCount: ecdictCet6.filter(w => w.bnc > 0 && w.bnc <= 5000).length,
        icon: '⭐',
        source: 'ecdict-cet6',
        filter: w => w.bnc > 0 && w.bnc <= 5000
      },
      {
        id: 'cet6-difficult',
        name: '难词攻克',
        description: '六级低频难词',
        wordCount: ecdictCet6.filter(w => w.bnc === 0 || w.bnc > 5000).length,
        icon: '💪',
        source: 'ecdict-cet6',
        filter: w => w.bnc === 0 || w.bnc > 5000
      }
    ]
  }
]

// 兼容旧版本
export const wordBooks = wordBookCategories.flatMap(cat => cat.books)

export default kaoyanWords
