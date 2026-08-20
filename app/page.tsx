'use client';

import { useState, useMemo } from 'react';

// ---------- Types ----------
type PlatformName = 'snoonu' | 'talabat' | 'keeta' | 'rafeeq';

interface PlatformOffer {
  itemPrice: number;
  deliveryFee: number;
  discount: number; // percentage
  total: number;
}

interface MenuItem {
  id: number;
  name: string;
  restaurant: string;
  cuisine: string;
  description: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
  platforms: Record<PlatformName, PlatformOffer>;
}

interface CartEntry {
  item: MenuItem;
  platform: PlatformName;
}

// ---------- Mock Data ----------
const mockItems: MenuItem[] = [
  {
    id: 1,
    name: 'Spicy Chicken Burger Meal',
    restaurant: 'BurgerJoint',
    cuisine: 'Burgers',
    description: 'Spicy chicken burger, fries, and a drink',
    rating: 4.5,
    deliveryTime: '25 min',
    tags: ['spicy', 'burger', 'combo'],
    platforms: {
      snoonu: { itemPrice: 27, deliveryFee: 5, discount: 10, total: 29.3 },
      talabat: { itemPrice: 29, deliveryFee: 7, discount: 0, total: 36 },
      keeta: { itemPrice: 24, deliveryFee: 3, discount: 20, total: 22.2 },
      rafeeq: { itemPrice: 26, deliveryFee: 4, discount: 5, total: 28.7 },
    },
  },
  {
    id: 2,
    name: 'Classic Beef Burger',
    restaurant: 'BurgerJoint',
    cuisine: 'Burgers',
    description: 'Beef patty, lettuce, tomato, cheese',
    rating: 4.3,
    deliveryTime: '20 min',
    tags: ['burger', 'classic'],
    platforms: {
      snoonu: { itemPrice: 22, deliveryFee: 5, discount: 0, total: 27 },
      talabat: { itemPrice: 24, deliveryFee: 7, discount: 15, total: 27.4 },
      keeta: { itemPrice: 20, deliveryFee: 3, discount: 10, total: 21 },
      rafeeq: { itemPrice: 21, deliveryFee: 4, discount: 0, total: 25 },
    },
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    restaurant: 'PizzaPalace',
    cuisine: 'Pizza',
    description: 'Tomato, mozzarella, basil',
    rating: 4.6,
    deliveryTime: '30 min',
    tags: ['pizza', 'vegetarian'],
    platforms: {
      snoonu: { itemPrice: 25, deliveryFee: 5, discount: 10, total: 27.5 },
      talabat: { itemPrice: 28, deliveryFee: 7, discount: 5, total: 33.6 },
      keeta: { itemPrice: 22, deliveryFee: 3, discount: 15, total: 21.7 },
      rafeeq: { itemPrice: 24, deliveryFee: 4, discount: 0, total: 28 },
    },
  },
  {
    id: 4,
    name: 'Pepperoni Pizza',
    restaurant: 'PizzaPalace',
    cuisine: 'Pizza',
    description: 'Pepperoni, mozzarella, tomato sauce',
    rating: 4.7,
    deliveryTime: '30 min',
    tags: ['pizza', 'pepperoni'],
    platforms: {
      snoonu: { itemPrice: 28, deliveryFee: 5, discount: 5, total: 31.6 },
      talabat: { itemPrice: 30, deliveryFee: 7, discount: 0, total: 37 },
      keeta: { itemPrice: 26, deliveryFee: 3, discount: 25, total: 22.5 },
      rafeeq: { itemPrice: 27, deliveryFee: 4, discount: 10, total: 28.3 },
    },
  },
  {
    id: 5,
    name: 'California Roll',
    restaurant: 'SushiSpot',
    cuisine: 'Sushi',
    description: 'Crab, avocado, cucumber',
    rating: 4.2,
    deliveryTime: '35 min',
    tags: ['sushi', 'seafood'],
    platforms: {
      snoonu: { itemPrice: 18, deliveryFee: 5, discount: 0, total: 23 },
      talabat: { itemPrice: 20, deliveryFee: 7, discount: 10, total: 25 },
      keeta: { itemPrice: 16, deliveryFee: 3, discount: 15, total: 16.6 },
      rafeeq: { itemPrice: 17, deliveryFee: 4, discount: 0, total: 21 },
    },
  },
  {
    id: 6,
    name: 'Salmon Nigiri (8 pc)',
    restaurant: 'SushiSpot',
    cuisine: 'Sushi',
    description: 'Fresh salmon over rice',
    rating: 4.8,
    deliveryTime: '35 min',
    tags: ['sushi', 'salmon'],
    platforms: {
      snoonu: { itemPrice: 30, deliveryFee: 5, discount: 0, total: 35 },
      talabat: { itemPrice: 32, deliveryFee: 7, discount: 5, total: 37.4 },
      keeta: { itemPrice: 28, deliveryFee: 3, discount: 20, total: 25.4 },
      rafeeq: { itemPrice: 29, deliveryFee: 4, discount: 0, total: 33 },
    },
  },
  {
    id: 7,
    name: 'Caesar Salad',
    restaurant: 'HealthyBites',
    cuisine: 'Salads',
    description: 'Romaine, croutons, parmesan',
    rating: 4.0,
    deliveryTime: '20 min',
    tags: ['salad', 'vegetarian', 'healthy'],
    platforms: {
      snoonu: { itemPrice: 15, deliveryFee: 5, discount: 10, total: 18.5 },
      talabat: { itemPrice: 17, deliveryFee: 7, discount: 0, total: 24 },
      keeta: { itemPrice: 14, deliveryFee: 3, discount: 5, total: 16.3 },
      rafeeq: { itemPrice: 16, deliveryFee: 4, discount: 0, total: 20 },
    },
  },
  {
    id: 8,
    name: 'Tiramisu',
    restaurant: 'DessertDelight',
    cuisine: 'Desserts',
    description: 'Coffee-soaked ladyfingers, mascarpone',
    rating: 4.9,
    deliveryTime: '25 min',
    tags: ['dessert', 'sweet'],
    platforms: {
      snoonu: { itemPrice: 12, deliveryFee: 5, discount: 0, total: 17 },
      talabat: { itemPrice: 14, deliveryFee: 7, discount: 10, total: 19.6 },
      keeta: { itemPrice: 10, deliveryFee: 3, discount: 15, total: 11.5 },
      rafeeq: { itemPrice: 11, deliveryFee: 4, discount: 0, total: 15 },
    },
  },
];

const suggestedQuestions = [
  'Spicy chicken burger with fries and a drink, budget under QAR 30',
  'Cheapest pizza near me',
  'Best vegetarian meal under QAR 25',
  'Sushi with high rating',
];

const categories = ['All', 'Burgers', 'Pizza', 'Sushi', 'Salads', 'Desserts'];

const platformNames: Record<PlatformName, string> = {
  snoonu: 'Snoonu',
  talabat: 'Talabat',
  keeta: 'Keeta',
  rafeeq: 'Rafeeq',
};

// ---------- Component ----------
export default function Home() {
  const [mode, setMode] = useState<'chat' | 'results'>('chat');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [compareList, setCompareList] = useState<MenuItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeView, setActiveView] = useState<'search' | 'bestdeals' | 'cart'>('search');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! I can find the best food deals across Snoonu, Talabat, Keeta, and Rafeeq. Just tell me what you want.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const filteredItems = useMemo(() => {
    let items = mockItems;
    if (activeCategory !== 'All') {
      items = items.filter((item) => item.cuisine === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.restaurant.toLowerCase().includes(query)
      );
    }
    return [...items].sort((a, b) => {
      const aCheapest = Math.min(...Object.values(a.platforms).map((p) => p.total));
      const bCheapest = Math.min(...Object.values(b.platforms).map((p) => p.total));
      return aCheapest - bCheapest;
    });
  }, [searchQuery, activeCategory]);

  const bestDeals = useMemo(() => {
    return [...mockItems]
      .map((item) => {
        let bestPlatform: PlatformName = 'keeta';
        let bestTotal = Infinity;
        let bestDiscount = 0;
        (Object.keys(item.platforms) as PlatformName[]).forEach((platform) => {
          const offer = item.platforms[platform];
          if (offer.total < bestTotal) {
            bestTotal = offer.total;
            bestPlatform = platform;
            bestDiscount = offer.discount;
          }
        });
        return { item, bestPlatform, bestTotal, bestDiscount };
      })
      .sort((a, b) => b.bestDiscount - a.bestDiscount)
      .slice(0, 5);
  }, []);

  const cartTotal = cart.reduce((sum, entry) => sum + entry.item.platforms[entry.platform].total, 0);

  const addToCart = (item: MenuItem, platform: PlatformName) => {
    setCart((prev) => [...prev, { item, platform }]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCompare = (item: MenuItem) => {
    setCompareList((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, item];
    });
  };

  // Simulate AI search
  const handleSearch = (query?: string) => {
    const q = query ?? searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    setMode('results'); // switch to results mode
    setActiveView('search');
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', content: q },
      { role: 'assistant', content: `Searching for "${q}" across all platforms... Found ${filteredItems.length} results.` },
    ]);
  };

  const handleSendMessage = () => {
    handleSearch(chatInput);
    setChatInput('');
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setMode('results');
    setActiveView('search');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🍽️ Yakfik</h1>
        <div className="header-actions">
          <button onClick={() => setMode('chat')}>Chat</button>
          <button onClick={() => setMode('results')}>Results</button>
          <button onClick={() => setActiveView('bestdeals')}>Best Deals</button>
          <button onClick={() => setActiveView('cart')}>Cart ({cart.length})</button>
          {compareList.length >= 2 && (
            <button onClick={() => setShowComparison(true)}>
              Compare ({compareList.length})
            </button>
          )}
        </div>
      </header>

      {mode === 'chat' ? (
        <div className="chat-mode-container">
          <div className="chat-mode-categories">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="chat-mode-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="chat-mode-input-area">
            <div className="chat-mode-suggestions">
              {suggestedQuestions.map((q) => (
                <button key={q} onClick={() => handleSearch(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div className="chat-mode-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe what you want, e.g., 'Spicy chicken burger with fries, budget under QAR 30'"
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-layout">
          <aside className="sidebar">
            <h2>Categories</h2>
            <ul className="category-list">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => {
                    setActiveCategory(cat);
                    setActiveView('search');
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          <main className="content">
            {activeView === 'search' && (
              <>
                <div className="search-bar">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Try: 'Spicy chicken burger with fries and a drink, budget under QAR 30'"
                  />
                  <button onClick={() => handleSearch()}>Search</button>
                </div>

                <div className="results-grid">
                  {filteredItems.map((item) => {
                    const cheapestPlatform = (Object.keys(item.platforms) as PlatformName[]).reduce((best, platform) => {
                      return item.platforms[platform].total < item.platforms[best].total ? platform : best;
                    }, 'keeta' as PlatformName);

                    return (
                      <div key={item.id} className="result-card">
                        <h3>{item.name}</h3>
                        <p className="restaurant">{item.restaurant} • {item.deliveryTime} • ⭐ {item.rating}</p>
                        <div className="tags">
                          {item.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                        <div className="platform-prices">
                          {(Object.keys(item.platforms) as PlatformName[]).map((platform) => {
                            const offer = item.platforms[platform];
                            const isBest = platform === cheapestPlatform;
                            return (
                              <div key={platform} className="platform-row">
                                <span className="platform-name">
                                  {platformNames[platform]}
                                  {isBest && <span className="best-deal-badge">Best Deal</span>}
                                </span>
                                <span className="platform-total">QAR {offer.total.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="result-actions">
                          <button
                            className={`compare-btn ${compareList.some((i) => i.id === item.id) ? 'active' : ''}`}
                            onClick={() => toggleCompare(item)}
                          >
                            {compareList.some((i) => i.id === item.id) ? '✓ Compared' : 'Compare'}
                          </button>
                          <button
                            className="order-btn"
                            onClick={() => addToCart(item, cheapestPlatform)}
                          >
                            Order on {platformNames[cheapestPlatform]}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {activeView === 'bestdeals' && (
              <div className="deals-list">
                <h2>Best Deals Right Now</h2>
                {bestDeals.map(({ item, bestPlatform, bestTotal, bestDiscount }) => (
                  <div key={item.id} className="deal-item">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="restaurant">{item.restaurant} • ⭐ {item.rating} • {item.deliveryTime}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {bestDiscount}% off on {platformNames[bestPlatform]} – total QAR {bestTotal.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="deal-badge">Best Deal</span>
                      <button
                        className="order-btn"
                        onClick={() => addToCart(item, bestPlatform)}
                      >
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeView === 'cart' && (
              <div className="cart-list">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                  <div className="empty-state">Your cart is empty. Search and add deals to order.</div>
                ) : (
                  <>
                    {cart.map((entry, index) => (
                      <div key={index} className="cart-item">
                        <div className="cart-item-info">
                          <h3>{entry.item.name}</h3>
                          <p>
                            {entry.item.restaurant} • {platformNames[entry.platform]} •{' '}
                            QAR {entry.item.platforms[entry.platform].total.toFixed(2)} (incl. delivery & discounts)
                          </p>
                        </div>
                        <div className="cart-item-actions">
                          <button onClick={() => removeFromCart(index)}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <div className="cart-total">
                      <span>Total</span>
                      <span>QAR {cartTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>

          <aside className="chat-panel">
            <div className="chat-header">AI Assistant</div>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="suggested-questions">
              {suggestedQuestions.map((q) => (
                <button key={q} onClick={() => handleSearch(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for a meal..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </aside>
        </div>
      )}

      {showComparison && (
        <div className="modal-overlay" onClick={() => setShowComparison(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowComparison(false)}>×</button>
            <h2>Comparison</h2>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Attribute</th>
                  {compareList.map((item) => (
                    <th key={item.id}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Restaurant</td>
                  {compareList.map((item) => (
                    <td key={item.id}>{item.restaurant}</td>
                  ))}
                </tr>
                <tr>
                  <td>Rating</td>
                  {compareList.map((item) => (
                    <td key={item.id}>{item.rating}/5</td>
                  ))}
                </tr>
                <tr>
                  <td>Delivery Time</td>
                  {compareList.map((item) => (
                    <td key={item.id}>{item.deliveryTime}</td>
                  ))}
                </tr>
                <tr>
                  <td>Cheapest Platform</td>
                  {compareList.map((item) => {
                    const cheapest = (Object.keys(item.platforms) as PlatformName[]).reduce((best, p) => {
                      return item.platforms[p].total < item.platforms[best].total ? p : best;
                    }, 'keeta' as PlatformName);
                    return <td key={item.id}>{platformNames[cheapest]}</td>;
                  })}
                </tr>
                <tr>
                  <td>Cheapest Total</td>
                  {compareList.map((item) => {
                    const cheapest = (Object.keys(item.platforms) as PlatformName[]).reduce((best, p) => {
                      return item.platforms[p].total < item.platforms[best].total ? p : best;
                    }, 'keeta' as PlatformName);
                    return <td key={item.id}>QAR {item.platforms[cheapest].total.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
            <button onClick={() => setShowComparison(false)} style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}