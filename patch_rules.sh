sed -i '/match \/staff_analytics_cache/{N;N;N;a\
\    // Phase 7.19 Inventory Management\
    match /inventory_stores/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_categories/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_items/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_stocks/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_stock_ledgers/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_receipts/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_issues/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_returns/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_transfers/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_adjustments/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_assets/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_asset_assignments/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_stock_audits/{id} {\
      allow read, create, update, delete: if true;\
    }\
    match /inventory_analytics_cache/{id} {\
      allow read, create, update, delete: if true;\
    }
}' firestore.rules
