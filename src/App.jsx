import { useEffect, useState } from "react";
import sampleCards from "./assets/boo";
import Modal from "./Modal";
import "./App.css";

function App() {
  const [cards, setCards] = useState(sampleCards);
  const [searchText, setSearchText] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [filteredCards, setFilteredCards] = useState(cards);
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [tempCard, setTempCard] = useState({ title: "", description: "", image: "", tag: "", price: "" });

  useEffect(() => {
    let result = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchText.toLowerCase()) &&
        card.description.toLowerCase().includes(searchDescription.toLowerCase())
    );

    if (sortOption === "priceLow") result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortOption === "priceHigh") result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortOption === "titleAZ") result.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredCards(result);
  }, [cards, searchText, searchDescription, sortOption]);

  const toggleFavorite = (card) => {
    setFavorites((prev) =>
      prev.find((f) => f.id === card.id) ? prev.filter((f) => f.id !== card.id) : [...prev, card]
    );
  };

  const openDelete = (card) => {
    setCurrentCard(card);
    setIsDeleteModal(true);
  };

  const deleteCard = () => {
    setCards(cards.filter((c) => c.id !== currentCard.id));
    setFavorites(favorites.filter((f) => f.id !== currentCard.id));
    setIsDeleteModal(false);
  };

  const openEdit = (card) => {
    setCurrentCard(card);
    setTempCard({ ...card });
    setIsEditModal(true);
  };

  const saveEdit = () => {
    setCards(cards.map((c) => (c.id === currentCard.id ? tempCard : c)));
    setIsEditModal(false);
  };

  const openAdd = () => {
    setTempCard({ title: "", description: "", image: "", tag: "", price: "" });
    setIsEditModal(true);
    setCurrentCard(null);
  };

  const saveAdd = () => {
    const newCard = { ...tempCard, id: Date.now() };
    setCards([...cards, newCard]);
    setIsEditModal(false);
  };

  const totalPrice = favorites.reduce((sum, fav) => sum + (parseFloat(fav.price.replace(/[^0-9.-]+/g, "")) || 0), 0);

  return (
    <>
      <div className="head">
        <h1>Gift Cards</h1>
      </div>

      <div className="explore-section">
        <div>
          <input placeholder="Search Title" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <input placeholder="Search Description" value={searchDescription} onChange={(e) => setSearchDescription(e.target.value)} />
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort By</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
            <option value="titleAZ">Title A → Z</option>
          </select>
        </div>
        <button onClick={openAdd}>Add Card</button>
      </div>

      <div className="Cards">
        {filteredCards.map((card) => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.title} />
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <h4>{card.price}</h4>
            </div>
            <div className="card-buttons">
              <button onClick={() => toggleFavorite(card)}>
                {favorites.some((f) => f.id === card.id) ? "★ Favorited" : "☆ Like"}
              </button>
              <button onClick={() => openEdit(card)}>Edit</button>
              <button onClick={() => openDelete(card)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Total Favorites Price: {totalPrice}$</h2>

      <Modal isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <h2>Delete "{currentCard?.title}"?</h2>
        <button onClick={deleteCard}>Yes</button>
        <button onClick={() => setIsDeleteModal(false)}>No</button>
      </Modal>

      <Modal isOpen={isEditModal} onClose={() => setIsEditModal(false)}>
        <h2>{currentCard ? "Edit Card" : "Add Card"}</h2>
        <input placeholder="Title" value={tempCard.title} onChange={(e) => setTempCard({ ...tempCard, title: e.target.value })} />
        <input placeholder="Description" value={tempCard.description} onChange={(e) => setTempCard({ ...tempCard, description: e.target.value })} />
        <input placeholder="Image URL" value={tempCard.image} onChange={(e) => setTempCard({ ...tempCard, image: e.target.value })} />
        <input placeholder="Tag" value={tempCard.tag} onChange={(e) => setTempCard({ ...tempCard, tag: e.target.value })} />
        <input placeholder="Price" value={tempCard.price} onChange={(e) => setTempCard({ ...tempCard, price: e.target.value })} />
        <button onClick={currentCard ? saveEdit : saveAdd}>Save</button>
      </Modal>
    </>
  );
}

export default App;
