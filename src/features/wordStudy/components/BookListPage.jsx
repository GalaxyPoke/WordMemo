import { useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'

function BookListPage({ 
  wordBookCategories, 
  progress, 
  onSelectBook, 
  onBack 
}) {
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // 获取当前显示的词书
  const getFilteredBooks = () => {
    let books = []
    
    if (activeCategory === 'all') {
      books = wordBookCategories.flatMap(cat => 
        cat.books.map(b => ({ ...b, categoryName: cat.name, categoryColor: cat.color }))
      )
    } else {
      const cat = wordBookCategories.find(c => c.id === activeCategory)
      if (cat) {
        books = cat.books.map(b => ({ ...b, categoryName: cat.name, categoryColor: cat.color }))
      }
    }
    
    if (searchText) {
      books = books.filter(b => 
        b.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    
    return books
  }

  const filteredBooks = getFilteredBooks()

  return (
    <div className="book-library-page">
      <div className="library-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1>词库</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* 搜索框 */}
      <div className="library-search">
        <Search size={18} className="search-icon" />
        <input 
          type="text"
          placeholder="输入词书名称搜索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* 分类标签 */}
      <div className="sub-categories">
        <button 
          className={`sub-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          全部
        </button>
        {wordBookCategories.map(cat => (
          <button 
            key={cat.id}
            className={`sub-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 词书列表 */}
      <div className="book-cards">
        {filteredBooks.map(book => {
          const bookProgress = Object.keys(progress).filter(
            id => progress[id]?.bookId === book.id
          ).length
          
          return (
            <div 
              key={book.id} 
              className="book-card"
              onClick={() => onSelectBook(book)}
            >
              <div className="book-cover-img" style={{ background: book.categoryColor || '#f97316' }}>
                <div className="cover-tag">{book.categoryName}</div>
                <div className="cover-title">{book.name.slice(0, 4)}</div>
                {book.icon && <div className="cover-icon">{book.icon}</div>}
              </div>
              <div className="book-card-info">
                <h3 className="book-title">{book.name}</h3>
                <p className="book-desc">{book.description || '精选词汇，高效备考'}</p>
                <span className="book-count">{book.wordCount} 词</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BookListPage
