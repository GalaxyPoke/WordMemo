// 大学英语六级真题数据
// 按年份和套数组织：cet6Data[年份][套数]
// 套数：1 = 第一套，2 = 第二套，3 = 第三套

export const cet6Data = {
  // 2024年六级
  2024: {
    1: {
      title: '2024年6月大学英语六级（第一套）',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Passage One',
          passage: `这里放入六级阅读文章...`,
          questions: [
            {
              id: 1,
              text: '第1题',
              options: [
                { label: 'A', text: '选项A' },
                { label: 'B', text: '选项B' },
                { label: 'C', text: '选项C' },
                { label: 'D', text: '选项D' }
              ],
              answer: 'A'
            }
          ]
        }
      ]
    },
    2: {
      title: '2024年6月大学英语六级（第二套）',
      sections: []
    },
    3: {
      title: '2024年6月大学英语六级（第三套）',
      sections: []
    }
  },

  // 2023年六级 - 示例
  2023: {
    1: {
      title: '2023年6月大学英语六级（第一套）',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Passage One',
          passage: `Artificial intelligence is rapidly transforming various industries, from healthcare to finance. Machine learning algorithms can now analyze vast amounts of data to identify patterns and make predictions that would be impossible for humans to achieve manually. This technological revolution promises to increase efficiency and productivity across many sectors.

However, the rise of AI also raises important ethical questions. Concerns about job displacement, algorithmic bias, and privacy are becoming increasingly prominent in public discourse. As AI systems become more sophisticated, society must grapple with how to ensure these technologies are developed and deployed responsibly.`,
          questions: [
            {
              id: 1,
              text: 'What can machine learning algorithms do according to the passage?',
              options: [
                { label: 'A', text: 'Replace all human workers' },
                { label: 'B', text: 'Analyze data and identify patterns' },
                { label: 'C', text: 'Solve all ethical problems' },
                { label: 'D', text: 'Eliminate privacy concerns' }
              ],
              answer: 'B'
            },
            {
              id: 2,
              text: 'What ethical concern is mentioned in the passage?',
              options: [
                { label: 'A', text: 'Environmental pollution' },
                { label: 'B', text: 'International conflicts' },
                { label: 'C', text: 'Job displacement' },
                { label: 'D', text: 'Food safety' }
              ],
              answer: 'C'
            }
          ]
        }
      ]
    },
    2: {
      title: '2023年6月大学英语六级（第二套）',
      sections: []
    },
    3: {
      title: '2023年6月大学英语六级（第三套）',
      sections: []
    }
  }
}
