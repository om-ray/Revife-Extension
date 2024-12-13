function RemoveAndShowFilters() {
  let hasRun = false;

  function checkAndManipulateElements() {
    if (hasRun) return;

    const sidebar = document.querySelector(
      "#topHeader + * > * > * > * > * > *:first-child"
    );

    const gridparent = sidebar?.parentElement;
    if (!sidebar || !gridparent) return;

    const allProductsButton = gridparent.children[1].children[0].children[0];

    try {
      sidebar.remove();
    } catch (e) {
      console.log("Could not remove sidebar element:", e);
    }

    try {
      allProductsButton.remove();
    } catch (e) {
      console.log("Could not remove all products button:", e);
    }

    gridparent.style.gridTemplateAreas = `
      "bc bc bc bc bc bc bc bc bc bc bc bc"
      "id id id id id id id id id id id id"
      "sb sb sb sb sb sb sb sb sb sb sb sb"
      "rs rs rs rs rs rs rs rs rs rs rs rs"
      "pg pg pg pg pg pg pg pg pg pg pg pg"
      "cr cr cr cr cr cr cr cr cr cr cr cr"
      "pr pr pr pr pr pr pr pr pr pr pr pr"
      "pf pf pf pf pf pf pf pf pf pf pf pf"
    `;
    gridparent.style.columnGap = "0px";

    hasRun = true;

    if (observer) observer.disconnect();

    setTimeout(() => {
      const allFiltersButtonParent =
        gridparent.children[0].children[0].children[1].children[0];

      const allFiltersButton =
        allFiltersButtonParent.children[
          allFiltersButtonParent.children.length - 1
        ];

      allFiltersButton.click();

      setupTypeOfItemButtonListener();
      setupFilterButtonListeners();
    }, 100);
  }

  const observer = new MutationObserver(() => {
    checkAndManipulateElements();
  });

  checkAndManipulateElements();

  if (!hasRun) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
}

function setupTypeOfItemButtonListener() {
  function checkForButton() {
    const buttons = document.querySelectorAll("button");
    let typeOfItemButton = null;

    buttons.forEach((button) => {
      const span = button.querySelector("span");
      if (span && span.textContent.trim() === "Type of item") {
        typeOfItemButton = button;
      }
    });

    if (typeOfItemButton) {
      typeOfItemButton.id = "typeOfItemButton";
      typeOfItemButton.addEventListener("click", HandleItemTypes);

      if (observer) observer.disconnect();
    }
  }

  const observer = new MutationObserver(() => {
    checkForButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  checkForButton();
}

function HandleItemTypes() {
  const button = document.getElementById("typeOfItemButton");
  setTimeout(() => {
    const parent = button.parentElement;
    let itemTypeSelectorDiv = parent.children[1];

    function checkAndProcess() {
      itemTypeSelectorDiv = parent.children[1];
      if (itemTypeSelectorDiv) {
        const itemTypesList = itemTypeSelectorDiv.querySelector("ul");
        const itemTypeSearch = itemTypeSelectorDiv.querySelector(
          'input[type="search"]'
        );
        const submitItemTypesButton =
          itemTypeSelectorDiv.querySelector(".sc-eCssSg");

        if (itemTypesList && itemTypeSearch && submitItemTypesButton) {
          let liElements = itemTypesList.querySelectorAll("li");

          liElements.forEach((li) => {
            const checkbox = li.querySelector('label input[type="checkbox"]');
            const pTag = li.querySelector("label p");

            if (checkbox && pTag) {
              checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                  itemTypeSearch.value = pTag.textContent;

                  const inputEvent = new Event("input", { bubbles: true });
                  itemTypeSearch.dispatchEvent(inputEvent);

                  const changeEvent = new Event("change", { bubbles: true });
                  itemTypeSearch.dispatchEvent(changeEvent);
                }

                setTimeout(() => {
                  liElements = itemTypesList.querySelectorAll("li");
                  liElements.forEach((li2) => {
                    const checkbox2 = li2.querySelector(
                      'label input[type="checkbox"]'
                    );
                    if (checkbox2 && !checkbox2.checked) {
                      checkbox2.click();
                    }
                  });

                  submitItemTypesButton.click();
                }, 1500);
              });
            }
          });

          itemTypeSearch.addEventListener("input", () => {
            if (itemTypeSearch.value.trim() === "") {
              checkAndProcess();
            }
          });

          if (observer) observer.disconnect();
        }
      }
    }

    const observer = new MutationObserver(() => {
      if (itemTypeSelectorDiv) {
        observer.disconnect();
        checkAndProcess();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    checkAndProcess();

    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "Select all shown";
    selectAllButton.style.cursor = "pointer";
    selectAllButton.style.pointerEvents = "auto";
    selectAllButton.style.borderWidth = "1px";
    selectAllButton.style.borderStyle = "solid";
    selectAllButton.style.borderRadius = "4px";
    selectAllButton.style.position = "relative";
    selectAllButton.style.height = "40px";
    selectAllButton.style.padding = "0px 16px";
    selectAllButton.style.width = "100%";
    selectAllButton.style.borderColor = "rgb(33, 39, 33)";
    selectAllButton.style.backgroundColor = "transparent";
    selectAllButton.style.boxShadow = "none";
    selectAllButton.style.outlineColor = "rgb(7, 98, 200)";
    selectAllButton.style.webkitTapHighlightColor = "transparent";
    selectAllButton.style.userSelect = "none";
    itemTypeSelectorDiv.children[1].appendChild(selectAllButton);

    selectAllButton.addEventListener("click", () => {
      const checkboxes = itemTypeSelectorDiv
        .querySelector("ul")
        .querySelectorAll('label input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (!checkbox.checked) {
          checkbox.click();
        }
      });
    });
  }, 500);
}

function setupFilterButtonListeners() {
  const buttonTexts = {
    withSearch: ["Brands", "Colour", "Pattern", "Material", "Fabric"],
    withoutSearch: [
      "Women/Men/Kids",
      "Sleeve length",
      "Length",
      "Waist rise",
      "Neckline",
    ],
  };

  function checkForButtons() {
    const buttons = document.querySelectorAll("button");
    let foundButtons = {
      withSearch: {},
      withoutSearch: {},
    };

    buttons.forEach((button) => {
      const span = button.querySelector("span");
      if (span) {
        const text = span.textContent.trim();
        if (buttonTexts.withSearch.includes(text)) {
          button.id = text.toLowerCase().replace(/\s+/g, "") + "Button";
          foundButtons.withSearch[text] = button;
        } else if (buttonTexts.withoutSearch.includes(text)) {
          button.id = text.toLowerCase().replace(/[/\s]+/g, "") + "Button";
          foundButtons.withoutSearch[text] = button;
        }
      }
    });

    Object.entries(foundButtons.withSearch).forEach(([text, button]) => {
      button.removeEventListener("click", () =>
        HandleFilterWithSearch(button.id)
      );
      button.addEventListener("click", () => HandleFilterWithSearch(button.id));
    });

    Object.entries(foundButtons.withoutSearch).forEach(([text, button]) => {
      button.removeEventListener("click", () =>
        HandleFilterWithoutSearch(button.id)
      );
      button.addEventListener("click", () =>
        HandleFilterWithoutSearch(button.id)
      );
    });
  }

  const observer = new MutationObserver(checkForButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  checkForButtons();
}

function HandleFilterWithSearch(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  setTimeout(() => {
    const parent = button.parentElement;
    if (!parent) return;

    let selectorDiv = parent.children[1];
    if (!selectorDiv) return;

    function checkAndProcess() {
      selectorDiv = parent.children[1];
      if (!selectorDiv) return;

      const itemList = selectorDiv.querySelector("ul");
      const searchInput = selectorDiv.querySelector('input[type="search"]');
      const submitButton = selectorDiv.querySelector(".sc-eCssSg");

      if (itemList && searchInput && submitButton) {
        let liElements = itemList.querySelectorAll("li");

        liElements.forEach((li) => {
          const checkbox = li.querySelector('label input[type="checkbox"]');
          const pTag = li.querySelector("label p");

          if (checkbox && pTag) {
            checkbox.addEventListener("change", function () {
              if (checkbox.checked) {
                searchInput.value = pTag.textContent;

                const inputEvent = new Event("input", { bubbles: true });
                searchInput.dispatchEvent(inputEvent);

                const changeEvent = new Event("change", { bubbles: true });
                searchInput.dispatchEvent(changeEvent);
              }

              setTimeout(() => {
                liElements = itemList.querySelectorAll("li");
                liElements.forEach((li2) => {
                  const checkbox2 = li2.querySelector(
                    'label input[type="checkbox"]'
                  );
                  if (checkbox2 && !checkbox2.checked) {
                    checkbox2.click();
                  }
                });

                submitButton.click();
              }, 1500);
            });
          }
        });

        searchInput.addEventListener("input", () => {
          if (searchInput.value.trim() === "") {
            checkAndProcess();
          }
        });

        // Add select all button
        if (!selectorDiv.querySelector(".selectAllButton")) {
          const selectAllButton = document.createElement("button");
          selectAllButton.className = "selectAllButton";
          selectAllButton.textContent = "Select all shown";
          selectAllButton.style.cursor = "pointer";
          selectAllButton.style.pointerEvents = "auto";
          selectAllButton.style.borderWidth = "1px";
          selectAllButton.style.borderStyle = "solid";
          selectAllButton.style.borderRadius = "4px";
          selectAllButton.style.position = "relative";
          selectAllButton.style.height = "40px";
          selectAllButton.style.padding = "0px 16px";
          selectAllButton.style.width = "100%";
          selectAllButton.style.borderColor = "rgb(33, 39, 33)";
          selectAllButton.style.backgroundColor = "transparent";
          selectAllButton.style.boxShadow = "none";
          selectAllButton.style.outlineColor = "rgb(7, 98, 200)";
          selectAllButton.style.webkitTapHighlightColor = "transparent";
          selectAllButton.style.userSelect = "none";
          selectorDiv.children[1].appendChild(selectAllButton);

          selectAllButton.addEventListener("click", () => {
            const checkboxes = selectorDiv
              .querySelector("ul")
              .querySelectorAll('label input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
              if (!checkbox.checked) {
                checkbox.click();
              }
            });
          });
        }
      }
    }

    checkAndProcess();
  }, 500);
}

function HandleFilterWithoutSearch(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  setTimeout(() => {
    const parent = button.parentElement;
    if (!parent) return;

    let selectorDiv = parent.children[1];
    if (!selectorDiv) return;

    function checkAndProcess() {
      selectorDiv = parent.children[1];
      if (!selectorDiv) return;

      const itemList = selectorDiv.querySelector("ul");
      const submitButton = selectorDiv.querySelector(".sc-eCssSg");

      if (itemList && submitButton) {
        let liElements = itemList.querySelectorAll("li");

        liElements.forEach((li) => {
          const checkbox = li.querySelector('label input[type="checkbox"]');
          if (checkbox) {
            checkbox.addEventListener("change", function () {
              setTimeout(() => {
                liElements = itemList.querySelectorAll("li");
                liElements.forEach((li2) => {
                  const checkbox2 = li2.querySelector(
                    'label input[type="checkbox"]'
                  );
                  if (checkbox2 && !checkbox2.checked) {
                    checkbox2.click();
                  }
                });

                submitButton.click();
              }, 1500);
            });
          }
        });

        // Add select all button
        if (!selectorDiv.querySelector(".selectAllButton")) {
          const selectAllButton = document.createElement("button");
          selectAllButton.className = "selectAllButton";
          selectAllButton.textContent = "Select all shown";
          selectAllButton.style.cursor = "pointer";
          selectAllButton.style.pointerEvents = "auto";
          selectAllButton.style.borderWidth = "1px";
          selectAllButton.style.borderStyle = "solid";
          selectAllButton.style.borderRadius = "4px";
          selectAllButton.style.position = "relative";
          selectAllButton.style.height = "40px";
          selectAllButton.style.padding = "0px 16px";
          selectAllButton.style.width = "100%";
          selectAllButton.style.borderColor = "rgb(33, 39, 33)";
          selectAllButton.style.backgroundColor = "transparent";
          selectAllButton.style.boxShadow = "none";
          selectAllButton.style.outlineColor = "rgb(7, 98, 200)";
          selectAllButton.style.webkitTapHighlightColor = "transparent";
          selectAllButton.style.userSelect = "none";
          selectorDiv.children[1].appendChild(selectAllButton);

          selectAllButton.addEventListener("click", () => {
            const checkboxes = selectorDiv
              .querySelector("ul")
              .querySelectorAll('label input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
              if (!checkbox.checked) {
                checkbox.click();
              }
            });
          });
        }
      }
    }

    checkAndProcess();
  }, 500);
}

const sizeFilterOptions = {
  "Women's Clothing": {
    "International": {
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      queryPrefix: "WMN-INT-"
    },
    "European": {
      sizes: ["34", "36", "38", "39", "40", "42", "44"],
      queryPrefix: "WMN-EU-"
    },
    "Extra Sizes": {
      sizes: ["0XL", "1XL", "2XL"],
      queryPrefix: "WMN-INT-"
    },
    "Pants (Inch)": {
      sizes: ["25", "26", "27", "28", "29", "30", "31", "32", "33"],
      queryPrefix: "PANTS-INCH-"
    }
  },
  "Men's Clothing": {
    "International": {
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      queryPrefix: "MEN-INT-"
    },
    "European": {
      sizes: ["40", "42", "44", "46", "48", "50", "52"],
      queryPrefix: "MEN-EU-"
    },
    "Extra Sizes": {
      sizes: ["0XL", "1XL", "2XL", "3XL"],
      queryPrefix: "MEN-INT-"
    },
    "Pants (Inch)": {
      sizes: ["29", "30", "31", "32", "33", "34", "38", "40"],
      queryPrefix: "PANTS-INCH-"
    }
  },
  "Shoes": {
    "Women's EU": {
      sizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"],
      queryPrefix: "SHOES-EU-"
    },
    "Men's EU": {
      sizes: ["39", "40", "41", "42", "43", "44", "45", "46", "48"],
      queryPrefix: "SHOES-EU-"
    },
    "Kids": {
      sizes: ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"],
      queryPrefix: "SHOES-CM-"
    }
  },
  "Kids": {
    "CM": {
      sizes: ["50", "56", "62", "68", "74", "80", "86", "90", "92", "98", "100", "102", "104", "110", "116", "120", "122", "128", "130", "134", "140", "146", "150", "152", "158", "160", "164", "170", "176"],
      queryPrefix: "CHILD-CM-"
    }
  },
  "Additional": {
    "Belts (CM)": {
      sizes: ["80", "85", "90", "95", "100", "105", "110", "115", "120", "130"],
      queryPrefix: "BELTS-CM-"
    }
  }
};

function handleSizeFilter(selectedSizes) {
  const params = new URLSearchParams(window.location.search);
  
  // Remove all existing size parameters
  const existingParams = Array.from(params.entries());
  existingParams.forEach(([key, value]) => {
    if (key === 'sizes') {
      params.delete(key);
    }
  });

  // Add new size parameters
  selectedSizes.forEach(size => {
    params.append('sizes', size);
  });

  // Update URL without reloading the page
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.pushState({}, '', newUrl);
  
  // Trigger URL change handling
  handleURLChange();
}

function createSizeFilter() {
  const sizeFilterContainer = document.createElement('div');
  sizeFilterContainer.className = 'size-filter-container';
  
  const sizeButton = document.createElement('button');
  sizeButton.textContent = 'Size';
  sizeButton.className = 'filter-button';
  
  const sizeDropdown = document.createElement('div');
  sizeDropdown.className = 'size-dropdown';
  sizeDropdown.style.display = 'none';
  
  // Create category sections
  Object.entries(sizeFilterOptions).forEach(([category, subcategories]) => {
    const categorySection = document.createElement('div');
    categorySection.className = 'size-category';
    
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = category;
    categorySection.appendChild(categoryHeader);
    
    Object.entries(subcategories).forEach(([subCategory, {sizes, queryPrefix}]) => {
      const subCategoryDiv = document.createElement('div');
      subCategoryDiv.className = 'size-subcategory';
      
      const subCategoryHeader = document.createElement('h4');
      subCategoryHeader.textContent = subCategory;
      subCategoryDiv.appendChild(subCategoryHeader);
      
      const sizeList = document.createElement('div');
      sizeList.className = 'size-list';
      
      sizes.forEach(size => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `size-${queryPrefix}${size}`;
        checkbox.value = `${queryPrefix}${size}`;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = size;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'size-item';
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        
        sizeList.appendChild(wrapper);
      });
      
      subCategoryDiv.appendChild(sizeList);
      categorySection.appendChild(subCategoryDiv);
    });
    
    sizeDropdown.appendChild(categorySection);
  });
  
  // Toggle dropdown on button click
  sizeButton.addEventListener('click', () => {
    const isHidden = sizeDropdown.style.display === 'none';
    sizeDropdown.style.display = isHidden ? 'block' : 'none';
  });
  
  // Handle checkbox changes
  sizeDropdown.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const selectedCheckboxes = sizeDropdown.querySelectorAll('input[type="checkbox"]:checked');
      const selectedSizes = Array.from(selectedCheckboxes).map(cb => cb.value);
      handleSizeFilter(selectedSizes);
    }
  });
  
  sizeFilterContainer.appendChild(sizeButton);
  sizeFilterContainer.appendChild(sizeDropdown);
  
  // Add to the filter section
  const filterSection = document.querySelector('.filter-section') || document.createElement('div');
  if (!filterSection.classList.contains('filter-section')) {
    filterSection.className = 'filter-section';
    document.body.appendChild(filterSection);
  }
  filterSection.appendChild(sizeFilterContainer);
}

function createSetDropdown() {
  let dropdown = document.getElementById("setDropdown");
  if (!dropdown) {
    dropdown = document.createElement("select");
    dropdown.id = "setDropdown";
    dropdown.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 9999;
      padding: 12px 16px;
      border-radius: 8px;
      border: 3px solid #007aff;
      background-color: #f0f7ff;
      font-size: 18px;
      min-width: 250px;
      box-shadow: 0 6px 12px rgba(0, 122, 255, 0.2);
      cursor: pointer;
      outline: none;
      color: #007aff;
      font-weight: 500;
    `;
    document.body.appendChild(dropdown);
  }

  dropdown.innerHTML = "";

  chrome.storage.local.get(["productProfiles"], (result) => {
    const profiles = result.productProfiles || {};

    if (Object.keys(profiles).length === 0 && !profiles["set1"]) {
      const option = document.createElement("option");
      option.value = 1;
      option.text = "Set 1";
      dropdown.appendChild(option);

      profiles["set1"] = {
        name: "Set 1",
        products: [],
      };
      chrome.storage.local.set({ productProfiles: profiles });
    } else {
      const setNumbers = Object.keys(profiles)
        .map((key) => parseInt(key.replace("set", "")))
        .sort((a, b) => a - b);

      setNumbers.forEach((num) => {
        const setKey = `set${num}`;
        const profile = profiles[setKey];
        const option = document.createElement("option");
        option.value = num;
        option.text = profile.name || `Set ${num}`;
        dropdown.appendChild(option);
      });
    }
  });
}

function storeProductProfile(element) {
  console.log(element);
  const productProfile = {
    name: element.children[1].children[0].textContent,
    price: element.children[2].children[1].textContent,
    image: element.children[0].children[1].src,
    link: element.href,
  };

  if (element.children[0]) {
    const selectedSet = document.getElementById("setDropdown").value;
    console.log("Selected set:", selectedSet);

    chrome.storage.local.get(["productProfiles"], function (result) {
      let profiles = result.productProfiles || {};
      console.log("Current profiles:", profiles);

      const setKey = `set${selectedSet}`;
      if (!profiles[setKey]) {
        profiles[setKey] = {
          name: `Set ${selectedSet}`,
          products: [],
        };
      }

      if (!profiles[setKey].products) {
        profiles[setKey] = {
          name: profiles[setKey].name || `Set ${selectedSet}`,
          products: profiles[setKey],
        };
      }

      const exists = profiles[setKey].products.some(
        (profile) =>
          profile.name === productProfile.name &&
          profile.link === productProfile.link
      );

      if (!exists) {
        profiles[setKey].products.push(productProfile);
        chrome.storage.local.set({ productProfiles: profiles }, function () {
          console.log("Product profile stored successfully:", profiles);

          chrome.runtime.sendMessage(
            {
              type: "PRODUCTS_UPDATED",
              profiles: profiles,
            },
            (response) => {
              const lastError = chrome.runtime.lastError;

              if (
                lastError &&
                !lastError.message.includes("Receiving end does not exist")
              ) {
                console.error("Error sending update:", lastError);
              }
            }
          );
        });
      }
    });
  }
}

function initializeProductProfiles() {
  chrome.storage.local.get(["productProfiles"], (result) => {
    if (
      !result.productProfiles ||
      Object.keys(result.productProfiles).length === 0
    ) {
      chrome.storage.local.set(
        {
          productProfiles: {
            set1: {
              name: "Set 1",
              products: [],
            },
          },
        },
        () => {
          console.log("Initialized productProfiles with empty Set 1");
          createSetDropdown();
        }
      );
    } else {
      createSetDropdown();
      setTimeout(() => {
        checkTopHeaderChildren();
      }, 2000);
    }
  });
}

function autoSelectCheckboxes() {
  chrome.storage.local.get(["productProfiles"], (request) => {
    const profiles = request.productProfiles || {};
    const itemTileContainers = document.querySelectorAll(
      ".item-tile-container"
    );

    setTimeout(() => {
      itemTileContainers.forEach((container) => {
        if (container.children[0]) {
          const firstAnchor = container.children[1]?.querySelector("a");
          if (firstAnchor) {
            const imageUrl = firstAnchor.children[0]?.children[1]?.src;
            const name = firstAnchor.children[1]?.children[0]?.textContent;
            const price = firstAnchor.children[2]?.children[1]?.textContent;
            const checkbox = container.children[0];

            const exists = Object.values(profiles).some((set) =>
              (set.products || []).some(
                (profile) =>
                  profile.image === imageUrl &&
                  profile.name === name &&
                  profile.link === firstAnchor.href
              )
            );

            if (checkbox) {
              checkbox.checked = exists;
              checkbox.style.backgroundColor = exists ? "#00b500" : "";

              if (exists) {
                let priceUpdated = false;
                Object.entries(profiles).forEach(([setKey, set]) => {
                  (set.products || []).forEach((profile) => {
                    if (
                      profile.image === imageUrl &&
                      profile.name === name &&
                      profile.link === firstAnchor.href
                    ) {
                      checkbox.dataset.setNumber = set.name;
                      if (profile.price !== price) {
                        profile.price = price;
                        priceUpdated = true;
                      }
                    }
                  });
                });

                if (priceUpdated) {
                  chrome.storage.local.set(
                    { productProfiles: profiles },
                    () => {
                      console.log("Updated product prices");
                      chrome.runtime.sendMessage(
                        {
                          type: "PRODUCTS_UPDATED",
                          profiles: profiles,
                        },
                        (response) => {
                          const lastError = chrome.runtime.lastError;

                          if (
                            lastError &&
                            !lastError.message.includes(
                              "Receiving end does not exist"
                            )
                          ) {
                            console.error("Error sending update:", lastError);
                          }
                        }
                      );
                    }
                  );
                }
              }
            }
          } else {
            console.log("No first anchor found");
          }
        }
      });
    }, 500);
  });
}

function addCheckboxToItemTileContainers() {
  const itemTileContainers = document.querySelectorAll(".item-tile-container");

  itemTileContainers.forEach((container) => {
    container.style.position = "relative";

    setTimeout(() => {
      const articleElement = container.children[0];
      if (articleElement) {
        const firstAnchor = articleElement.querySelector("a");
        if (firstAnchor) {
          const href = firstAnchor.getAttribute("href");
          const value = href.substring(href.lastIndexOf("/") + 1);

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.style.position = "absolute";
          checkbox.style.top = "10px";
          checkbox.style.left = "10px";
          checkbox.style.zIndex = "1";
          checkbox.style.width = "20px";
          checkbox.style.height = "20px";
          checkbox.style.borderRadius = "50%";
          checkbox.style.appearance = "none";
          checkbox.style.backgroundColor = "white";
          checkbox.style.border = "none";
          checkbox.style.boxShadow = "0px 0px 10px 0px rgba(0, 0, 0, 0.5)";
          checkbox.style.color = "white";
          checkbox.style.cursor = "pointer";
          checkbox.value = value;

          checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
              checkbox.style.backgroundColor = "#00b500";
              storeProductProfile(firstAnchor);
            } else {
              checkbox.style.backgroundColor = "white";
              chrome.storage.local.get(["productProfiles"], function (result) {
                const profiles = result.productProfiles || {};
                const imageUrl = firstAnchor.children[0]?.children[1]?.src;
                const name = firstAnchor.children[1]?.children[0]?.textContent;

                Object.keys(profiles).forEach((setKey) => {
                  profiles[setKey] = {
                    name: profiles[setKey].name,
                    products: profiles[setKey].products.filter(
                      (profile) =>
                        !(
                          profile.image === imageUrl &&
                          profile.name === name &&
                          profile.link === firstAnchor.href
                        )
                    ),
                  };
                });

                chrome.storage.local.set({ productProfiles: profiles }, () => {
                  chrome.runtime.sendMessage(
                    {
                      type: "PRODUCTS_UPDATED",
                      profiles: profiles,
                    },
                    (response) => {
                      const lastError = chrome.runtime.lastError;
                      if (
                        lastError &&
                        !lastError.message.includes(
                          "Receiving end does not exist"
                        )
                      ) {
                        console.log("Error sending update:", lastError);
                      }
                    }
                  );
                });
              });
            }
          });

          try {
            container.prepend(checkbox);
          } catch (e) {
            console.log("Error adding checkbox to container:", e);
          }
        }
      }
      autoSelectCheckboxes();
    }, 1000);
  });
}

function removeExistingTileElements() {
  const checkboxes = document.querySelectorAll(
    '.item-tile-container input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    try {
      checkbox.remove();
    } catch (e) {
      console.log("Could not remove checkbox:", e);
    }
  });
}

function runChanges() {
  removeExistingTileElements();
  observeItemTileContainers();
  addCheckboxToItemTileContainers();
  autoSelectCheckboxes();
}

function initialSetup() {
  RemoveAndShowFilters();
  setupTypeOfItemButtonListener();
  setupFilterButtonListeners();
  createSizeFilter();
  runChanges();
}

function handlePopState() {
  runChanges();
}

window.addEventListener("popstate", handlePopState);

function observeItemTileContainers() {
  const observer = new MutationObserver(() => {
    const itemTileContainers = document.querySelectorAll(
      ".item-tile-container"
    );
    if (itemTileContainers.length > 0) {
      observer.disconnect();
      addCheckboxToItemTileContainers();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function checkTopHeaderChildren() {
  const topHeader = document.getElementById("topHeader");
  if (topHeader && topHeader.children.length > 1) {
    try {
      topHeader.children[0].remove();
    } catch (e) {
      console.log("Could not remove top header child:", e);
    }
  }
}

let isHandlingURLChange = false;
let lastUrl = window.location.href;

function checkForUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    handleURLChange();
  }
}

const urlChangeObserver = new MutationObserver(() => {
  checkForUrlChange();
});

urlChangeObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

function handleURLChange() {
  if (!isHandlingURLChange) {
    isHandlingURLChange = true;

    setTimeout(() => {
      const itemTileContainers = document.querySelectorAll(
        ".item-tile-container"
      );
      if (itemTileContainers.length > 0) {
        try {
          removeExistingTileElements();
          addCheckboxToItemTileContainers();
        } catch (e) {
          console.log("Error handling tile elements:", e);
        }
        isHandlingURLChange = false;
      } else {
        const pageLoadObserver = new MutationObserver(() => {
          const containers = document.querySelectorAll(".item-tile-container");
          if (containers.length > 0) {
            pageLoadObserver.disconnect();
            try {
              removeExistingTileElements();
              addCheckboxToItemTileContainers();
            } catch (e) {
              console.log("Error handling tile elements in observer:", e);
            }
            isHandlingURLChange = false;
          }
        });

        pageLoadObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    }, 100);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PRODUCTS_UPDATED") {
    createSetDropdown();
    autoSelectCheckboxes();
  }
});

initializeProductProfiles();

if (document.getElementById("topHeader")) {
  initialSetup();
} else {
  const observer = new MutationObserver(() => {
    if (document.getElementById("topHeader")) {
      initialSetup();
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
