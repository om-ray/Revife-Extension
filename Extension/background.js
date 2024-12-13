// Initialize Firebase in the background script
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your Firebase config will be injected during build
const firebaseConfig = {
  // Config will be injected from environment variables
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CUSTOMER_PROFILE') {
    getCustomerProfile(request.userId)
      .then(profile => sendResponse({ profile }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Will respond asynchronously
  }
  
  if (request.type === 'SAVE_SCRAPED_PRODUCTS') {
    saveScrapedProducts(request.userId, request.products)
      .then(result => sendResponse({ success: true }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

async function getCustomerProfile(userId) {
  const customerRef = doc(db, 'customers', userId);
  const customerDoc = await getDoc(customerRef);
  if (!customerDoc.exists()) {
    throw new Error('Customer profile not found');
  }
  return customerDoc.data();
}

async function saveScrapedProducts(userId, products) {
  // Implementation for saving scraped products
  // This will be implemented based on your specific data structure
}
