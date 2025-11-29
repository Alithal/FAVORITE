import { useEffect, useState } from "react";
import sampleCards from "./assets/boo";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [filteredCards, setFilteredCards] = useState(sampleCards);
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const text = searchText.toLowerCase();
    const desc = searchDescription.toLowerCase();

    let result = sampleCards.filter(
      (card) =>
        card.title.toLowerCase().includes(text) &&
        card.description.toLowerCase().includes(desc)
    );

    if (sortOption === "priceLow") {
      result = [...result].sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    }

    if (sortOption === "priceHigh") {
      result = [...result].sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    if (sortOption === "titleAZ") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredCards(result);
  }, [searchText, searchDescription, sortOption]);

  const toggleFavorite = (card) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === card.id);
      if (exists) return prev.filter((f) => f.id !== card.id);
      return [...prev, card];
    });
  };

  const totalPrice = favorites.reduce((sum, fav) => {
    const num = parseFloat(fav.price.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + num;
  }, 0);

  return (
    <>
      <div className="head">
        <h1>Gift Cards</h1>
      </div>

      <div className="explore-section">
        <h3>Explore</h3>

        <div className="search-inputs">
          <input
            type="text"
            placeholder="Search Cards by Title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search Cards by Description"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="titleAZ">Title: A → Z</option>
          </select>
        </div>
      </div>

      <div className="Cards">
        {filteredCards.map((card) => (
          <div key={card.id} className="card">
            <div className="card-image">
              <img src={card.image} alt={card.title} />
              <div className="card-tag">{card.tag}</div>
            </div>

            <div className="card-content">
              <h3>{card.title}</h3>
              <h4>{card.price}</h4>
              <p>{card.description}</p>
            </div>

            <div className="card-buttons">
              <button onClick={() => toggleFavorite(card)}>
                {favorites.some((f) => f.id === card.id)
                  ? "★ Favorited"
                  : "☆ Like"}
              </button>
              <button className="open">Open</button>
            </div>
          </div>
        ))}

        <h1>Liked cards total price is {totalPrice}$</h1>
      </div>
    </>
  );
}

export default App;
