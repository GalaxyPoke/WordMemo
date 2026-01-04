// 专四专八英语真题数据
// 按年份和套数组织：temData[年份][套数]
// 套数：4 = 专四，8 = 专八

export const temData = {
  // 2024年
  2024: {
    4: {
      title: '2024年英语专业四级',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Reading Comprehension',
          passage: `这里放入专四阅读文章...`,
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
    8: {
      title: '2024年英语专业八级',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Reading Comprehension',
          passage: `这里放入专八阅读文章...`,
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
    }
  },

  // 2023年 - 示例
  2023: {
    4: {
      title: '2023年英语专业四级',
      sections: [
        {
          id: 1,
          type: 'reading',
          title: 'Text A',
          passage: `The concept of sustainable development has gained significant attention in recent decades. It refers to development that meets the needs of the present without compromising the ability of future generations to meet their own needs. This principle has become central to environmental policy and urban planning worldwide.

Implementing sustainable practices requires a balance between economic growth, environmental protection, and social equity. Many cities are now adopting green building standards, investing in public transportation, and promoting renewable energy sources. These efforts aim to create more livable urban environments while reducing carbon emissions.`,
          questions: [
            {
              id: 1,
              text: 'What does sustainable development refer to according to the passage?',
              options: [
                { label: 'A', text: 'Rapid economic growth' },
                { label: 'B', text: 'Development that does not compromise future generations' },
                { label: 'C', text: 'Environmental protection only' },
                { label: 'D', text: 'Urban expansion' }
              ],
              answer: 'B'
            },
            {
              id: 2,
              text: 'What are cities doing to implement sustainable practices?',
              options: [
                { label: 'A', text: 'Building more factories' },
                { label: 'B', text: 'Increasing car usage' },
                { label: 'C', text: 'Adopting green building standards' },
                { label: 'D', text: 'Reducing public services' }
              ],
              answer: 'C'
            }
          ]
        }
      ]
    },
    8: {
      title: '2023年英语专业八级',
      sections: []
    }
  }
}
