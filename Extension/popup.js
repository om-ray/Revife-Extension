console.log("popup.js is loaded");

function displaySets() {
  console.log("Attempting to display sets...");

  chrome.storage.local.get(["productProfiles"], (result) => {
    console.log("Retrieved product profiles:", result);

    const setsContainer = document.getElementById("setsContainer");
    if (!setsContainer) {
      console.error("Sets container not found!");
      return;
    }

    setsContainer.innerHTML = "";

    const profiles = result.productProfiles || {};
    console.log("Processed profiles:", profiles);

    if (Object.keys(profiles).length === 0) {
      console.log("No profiles found to display");
      setsContainer.innerHTML =
        "<p>No sets available. Add products to create a set.</p>";
      return;
    }

    Object.keys(profiles)
      .sort()
      .forEach((setKey) => {
        const setNumber = parseInt(setKey.replace("set", ""));
        const products = profiles[setKey];

        const setDiv = document.createElement("div");
        setDiv.className = "set-container";

        const setHeader = document.createElement("div");
        setHeader.className = "set-header";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = products.name || `Set ${setNumber}`;
        nameInput.style.fontSize = "16px";
        nameInput.style.padding = "4px";
        nameInput.addEventListener("change", () => {
          profiles[setKey] = {
            ...profiles[setKey],
            name: nameInput.value,
            products: products.products || products,
          };
          updateSets(profiles);
        });

        const deleteSetButton = document.createElement("button");
        deleteSetButton.className = "button danger";
        deleteSetButton.textContent = "Delete Set";
        deleteSetButton.addEventListener("click", () => {
          delete profiles[setKey];
          updateSets(profiles);
        });

        setHeader.appendChild(nameInput);
        setHeader.appendChild(deleteSetButton);
        setDiv.appendChild(setHeader);

        const productsGrid = document.createElement("div");
        productsGrid.className = "products-grid";

        (products.products || products).forEach((product, productIndex) => {
          const productCard = document.createElement("div");
          productCard.className = "product-card";

          const img = document.createElement("img");
          img.src = product.image;

          const name = document.createElement("p");
          name.textContent = product.name;
          name.style.margin = "4px 0";

          const price = document.createElement("p");
          price.textContent = product.price;
          price.style.margin = "4px 0";

          const removeButton = document.createElement("button");
          removeButton.className = "remove-button";
          removeButton.textContent = "X";
          removeButton.addEventListener("click", () => {
            (products.products || products).splice(productIndex, 1);
            updateSets(profiles);
          });

          productCard.appendChild(img);
          productCard.appendChild(name);
          productCard.appendChild(price);
          productCard.appendChild(removeButton);
          productsGrid.appendChild(productCard);
        });

        setDiv.appendChild(productsGrid);
        setsContainer.appendChild(setDiv);
      });
  });
}

function updateSets(profiles) {
  const formattedProfiles = {};
  Object.entries(profiles).forEach(([key, value]) => {
    formattedProfiles[key] = {
      name: value.name || `Set ${key.replace("set", "")}`,
      products: value.products || value,
    };
  });

  chrome.storage.local.set({ productProfiles: formattedProfiles }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "PRODUCTS_UPDATED",
          profiles: formattedProfiles,
        });
      }
    });
    displaySets();
  });
}

function addNewSet() {
  chrome.storage.local.get(["productProfiles"], (result) => {
    const profiles = result.productProfiles || {};
    const setNumbers = Object.keys(profiles)
      .map((key) => parseInt(key.replace("set", "")))
      .sort((a, b) => a - b);

    const newSetNumber =
      setNumbers.length > 0 ? setNumbers[setNumbers.length - 1] + 1 : 1;
    profiles[`set${newSetNumber}`] = {
      name: `Set ${newSetNumber}`,
      products: [],
    };
    updateSets(profiles);
  });
}

function clearAllSets() {
  chrome.storage.local.set({ productProfiles: {} }, () => {
    updateSets({});
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CHECK_STORAGE") {
    chrome.storage.local.get(["productProfiles"], function (result) {
      sendResponse(result.productProfiles);
    });
    return true;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  displaySets();

  document.getElementById("addSetButton").addEventListener("click", addNewSet);
  document
    .getElementById("checkStorageButton")
    .addEventListener("click", () => {
      chrome.storage.local.get(["productProfiles"], function (result) {
        console.log("Current Storage Contents:", result.productProfiles);
      });
    });
  document
    .getElementById("clearAllButton")
    .addEventListener("click", clearAllSets);
});
