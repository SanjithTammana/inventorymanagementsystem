# Inventory Management System

A small Next.js inventory tracker backed by Cloud Firestore. It stores items in an `inventory` collection and lets a user add items, adjust quantities, search by name, and filter by category.

## What it does

- Loads inventory documents from Firestore and sorts them by item name.
- Creates an item or increments its quantity when the name already exists.
- Decrements quantity and deletes an item when its quantity reaches zero.
- Groups items by category, with category filtering and name search.
- Includes dark-mode and high-contrast display toggles.

## Architecture

The single client page in `app/page.js` reads and writes the Firestore `inventory` collection through the initialized client in `firebase.js`. Each document uses its item name as the document ID and stores `quantity` and `category` fields.

## Tech stack

- React and Next.js
- Firebase Firestore
- Material UI
- JavaScript

## Running locally

```bash
git clone https://github.com/SanjithTammana/inventorymanagementsystem.git
cd inventorymanagementsystem
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes and limitations

- Firebase project configuration is currently defined in `firebase.js`.
- The repository has no authentication or per-user inventory model; all reads and writes target the same `inventory` collection.
- This is an earlier single-page project, not a multi-user inventory product.
