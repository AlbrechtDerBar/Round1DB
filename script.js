const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const figuresList = [...figures, ...plushes];

// Summary elements
const totalPriceEl = document.getElementById("total-price");
const totalSaleEl = document.getElementById("total-sale");
const searchPriceEl = document.getElementById("search-price");
const searchSaleEl = document.getElementById("search-sale");

// Helper function to convert price to float
function parsePrice(price) {
  return price && parseFloat(price) || 0;  // Safely handle non-numeric values
}

// Calculate totals (Price and Sale) from a list of figures
function calculateTotals(list) {
  return list.reduce(
    (totals, fig) => {
      // Add the price to the total price
      totals.price += parsePrice(fig.price);

      // If there is a sale price, add the sale price to the total sale
      // If not, add the regular price as the sale price
      const salePrice = parsePrice(fig.salePrice);
      totals.sale += salePrice > 0 ? salePrice : parsePrice(fig.price);

      return totals;
    },
    { price: 0, sale: 0 }
  );
}

// Initial render of all figures
render(figuresList);

// Set initial totals for the entire collection
const collectionTotals = calculateTotals(figuresList);
totalPriceEl.textContent = collectionTotals.price.toFixed(2);
totalSaleEl.textContent = collectionTotals.sale.toFixed(2);

// Listen for input changes on the search field
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  // Filter the figures based on the search query
  const filtered = figuresList.filter(fig =>
    fig.name.toLowerCase().includes(query) ||
    fig.series.toLowerCase().includes(query) ||
    fig.manufacturer.toLowerCase().includes(query) ||
    fig.character.toLowerCase().includes(query) ||
    fig.type.toLowerCase().includes(query)
  );

  // Calculate totals for the filtered search results
  const searchTotals = calculateTotals(filtered);
  searchPriceEl.textContent = searchTotals.price.toFixed(2);
  searchSaleEl.textContent = searchTotals.sale.toFixed(2);

  // Render the filtered results
  render(filtered);
});

// Render function for displaying the figures in the grid
function render(list) {
  results.innerHTML = "";

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  // If no results, show "No results found."
  if (list.length === 0) {
    results.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Loop through each figure and create a card for it
  list.forEach(fig => {
    const card = document.createElement("div");
    card.className = "card";

    // Parse the price and salePrice to numbers, or set to null if they don't exist
    const price = parsePrice(fig.price);
    const salePrice = parsePrice(fig.salePrice);
    const discount = salePrice > 0 && price > 0 ? ((price - salePrice) / price * 100).toFixed(2) : null;

    // Determine display values for price and salePrice
    const displayPrice = price > 0 ? `$${price.toFixed(2)}` : "-";
    const displaySalePrice = salePrice > 0 ? `$${salePrice.toFixed(2)}` : "-";
    const listPriceHtml = price > 0 && salePrice > 0 ? `<span class="list-price">$${price.toFixed(2)}</span>` : "";

    // Create the inner HTML of the card
    card.innerHTML = `
      <img src="${fig.image}" alt="${fig.name}" class="figure-img">
      <div class="name"><a href="${fig.link}">${fig.name}</a></div>
      <div class="series">${fig.series}</div>
      <div class="character">${fig.character}</div>
      <div class="pricing">
        ${discount !== null ? `<div class="discount">${discount}%</div>` : ""}
        <div class="price">
          ${listPriceHtml}
          ${salePrice > 0 ? displaySalePrice : displayPrice}
        </div>
      </div>
    `;

    // Append the card to the results container
    results.appendChild(card);
  });

  // Set up the image click handler to enlarge the image
  results.addEventListener("click", (e) => {
    if (e.target.classList.contains("figure-img")) {
      lightboxImg.src = e.target.src;
      lightbox.style.display = "flex";
    }
  });

  // Close the lightbox when clicking anywhere on it
  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  });
}
