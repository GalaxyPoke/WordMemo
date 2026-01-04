// 大学英语四级真题数据
// 按年份和套数组织：cet4Data[年份][套数]
// 套数：1 = 第一套，2 = 第二套，3 = 第三套

export const cet4Data = {
  // 2024年四级
  2024: {
    1: {
      title: '2024年6月大学英语四级（第一套）',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Section A - 选词填空',
          passage: `这里放入四级选词填空文章...`,
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
      title: '2024年6月大学英语四级（第二套）',
      sections: []
    },
    3: {
      title: '2024年6月大学英语四级（第三套）',
      sections: []
    }
  },

  // 2023年四级 - 示例
  2023: {
    1: {
      title: '2023年6月大学英语四级（第一套）',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Passage One',
          passage: `In today's digital age, the way we consume news has fundamentally changed. Traditional newspapers and television broadcasts are being replaced by online platforms and social media feeds. This shift has brought both opportunities and challenges for journalism and public discourse.

One significant advantage of digital news is accessibility. People can now access information from around the world instantly, breaking down geographical barriers. However, this ease of access has also led to concerns about the quality and reliability of information, as anyone can publish content online without editorial oversight.`,
          questions: [
            {
              id: 1,
              text: 'What has fundamentally changed according to the passage?',
              options: [
                { label: 'A', text: 'The way we travel' },
                { label: 'B', text: 'The way we consume news' },
                { label: 'C', text: 'The way we communicate' },
                { label: 'D', text: 'The way we work' }
              ],
              answer: 'B'
            },
            {
              id: 2,
              text: 'What is mentioned as an advantage of digital news?',
              options: [
                { label: 'A', text: 'Lower cost' },
                { label: 'B', text: 'Better quality' },
                { label: 'C', text: 'Accessibility' },
                { label: 'D', text: 'More entertainment' }
              ],
              answer: 'C'
            }
          ]
        }
      ]
    },
    2: {
      title: '2023年6月大学英语四级（第二套）',
      sections: []
    },
    3: {
      title: '2023年6月大学英语四级（第三套）',
      sections: []
    }
  }
}
