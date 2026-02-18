erDiagram
  direction TB

  USER {
    int id PK
    string email UK
    string password
    int level_id FK
    datetime created_at
    bool is_active
  }
  USERLEVEL {
    int id PK
    string name
    string description
  }
  USERPROFILE {
    int id PK
    int user_id FK
    string first_name
    string last_name
    string phone
    string avatar_url
    date birthday
  }
  ADDRESS {
    int id PK
    int user_id FK
    string full_name
    string street
    string city
    string state
    string postal_code
    string country
    string phone
    bool is_default
  }
  SHOP {
    int id PK
    int owner_id FK "User"
    string name UK
    string description
    string logo_url
    string status
    datetime created_at
  }
  SELLERACCOUNT {
    int id PK
    int user_id FK
    int shop_id FK
    bool verified
    string status
    datetime created_at
  }
  SELLERVERIFICATION {
    int id PK
    int seller_account_id FK
    string doc_type
    string doc_url
    string status
    datetime reviewed_at
  }
  CATEGORY {
    int id PK
    int parent_id FK
    string name
    string description
    bool is_active
  }
  PRODUCT {
    int id PK
    int shop_id FK
    int category_id FK
    string name
    string description
    decimal price
    string status
    decimal weight
    int brand_id FK
    datetime created_at
    datetime updated_at
  }
  PRODUCTVARIANT {
    int id PK
    int product_id FK
    string sku UK
    string barcode
    decimal price
    int stock
    decimal weight
    bool is_active
  }
  OPTION {
    int id PK
    int product_id FK
    string name
  }
  OPTIONVALUE {
    int id PK
    int option_id FK
    string value
  }
  PRODUCTIMAGE {
    int id PK
    int product_id FK
    string url
    int sort_order
  }
  BRAND {
    int id PK
    string name UK
    string logo_url
  }
  INVENTORY {
    int id PK
    int product_variant_id FK
    int warehouse_id FK
    int stock
  }
  WAREHOUSE {
    int id PK
    string name
    string city
    string country
  }
  COURIER {
    int id PK
    string name
    bool is_active
  }
  SHIPPINGMETHOD {
    int id PK
    int courier_id FK
    string name
    decimal base_rate
    decimal rate_per_kg
    int estimated_days
  }
  CART {
    int id PK
    int user_id FK
    bool is_active
    datetime updated_at
  }
  CARTITEM {
    int id PK
    int cart_id FK
    int product_variant_id FK
    int quantity
    decimal price
  }
  WISHLIST {
    int id PK
    int user_id FK
    string name
    datetime created_at
  }
  WISHLISTITEM {
    int id PK
    int wishlist_id FK
    int product_id FK
    datetime added_at
  }
  ORDER {
    int id PK
    int user_id FK
    int address_id FK
    decimal total_amount
    string status
    string payment_status
    datetime created_at
    datetime updated_at
    int shop_id FK
  }
  ORDERITEM {
    int id PK
    int order_id FK
    int product_variant_id FK
    int shop_id FK
    int quantity
    decimal price
    string status
  }
  PAYMENT {
    int id PK
    int user_id FK
    int order_id FK
    string method
    decimal amount
    string status
    datetime paid_at
  }
  SHIPMENT {
    int id PK
    int order_id FK
    int shipping_method_id FK
    decimal shipping_fee
    string status
    tracking_number string
    datetime shipped_at
  }
  SHIPMENTEVENT {
    int id PK
    int shipment_id FK
    string status
    string location
    datetime occurred_at
  }
  REVIEW {
    int id PK
    int product_id FK
    int order_item_id FK
    int user_id FK
    int rating
    string comment
    datetime created_at
  }
  ACTIVITYLOG {
    int id PK
    int user_id FK
    string action
    string detail
    datetime created_at
  }
  SUPPORTTICKET {
    int id PK
    int user_id FK
    string subject
    string type
    string status
    datetime created_at
    datetime closed_at
  }
  DISPUTE {
    int id PK
    int order_id FK
    int user_id FK
    string reason
    string status
    datetime created_at
    datetime resolved_at
  }
  VOUCHER {
    int id PK
    int shop_id FK
    string code UK
    decimal discount_percentage
    decimal max_discount
    datetime valid_from
    datetime valid_to
    int usage_limit
  }
  CAMPAIGN {
    int id PK
    string name
    string status
    datetime start_date
    datetime end_date
  }
  FLASHSALE {
    int id PK
    int campaign_id FK
    int product_variant_id FK
    decimal discounted_price
    int quantity_limit
    datetime start_time
    datetime end_time
  }
  AFFILIATE {
    int id PK
    int user_id FK
    string code UK
    decimal commission_rate
    datetime created_at
  }
  GIFT_CARD {
    int id PK
    int user_id FK
    string code UK
    decimal balance
    datetime issued_at
    datetime expires_at
  }
  WALLET {
    int id PK
    int user_id FK
    decimal balance
    datetime last_updated
  }
  TRANSACTION {
    int id PK
    int wallet_id FK
    string type
    decimal amount
    string status
    datetime created_at
  }
  TOPUP {
    int id PK
    int wallet_id FK
    decimal amount
    string method
    string status
    datetime created_at
  }
  WITHDRAWAL {
    int id PK
    int wallet_id FK
    decimal amount
    string method
    string status
    datetime created_at
  }
  REFUND {
    int id PK
    int payment_id FK
    int order_id FK
    decimal amount
    string status
    datetime processed_at
  }
  NOTIFICATION {
    int id PK
    int user_id FK
    string title
    string message
    bool is_read
    datetime sent_at
  }
  BANNER {
    int id PK
    string image_url
    string link_url
    string status
    datetime start_time
    datetime end_time
  }
  ADVERTISEMENT {
    int id PK
    int shop_id FK
    string title
    string content
    string image_url
    string status
    datetime start_time
    datetime end_time
  }
  CURRENCY {
    int id PK
    string code UK
    string name
    string symbol
    bool is_active
  }
  LANGUAGE {
    int id PK
    string code UK
    string name
    bool is_active
  }
  SYSTEM {
    int id PK
    string name
    string description
  }
  USER_LEVEL_ASSIGNMENT {
    int assignment_id PK
    int system_id FK
    int user_id FK
    int user_level_id FK
    int assigned_by FK
    datetime created_at
  }
  USER_LEVEL_PERMISSION {
    int user_level_id PK, FK
    string table_name PK
    int permission
  }
  AUDIT_LOG {
    int id PK
    datetime date_time
    string script
    string user
    string action
    string table
    string field
    text key_value
    text old_value
    text new_value
  }

  %% Core Relationships
  USERLEVEL ||--o{ USER : "has"
  USER ||--|| USERPROFILE : "profile"
  USER ||--o{ ADDRESS : "has"
  USER ||--o{ CART : "shopping"
  USER ||--o{ WISHLIST : "lists"
  USER ||--o{ USERPROFILE : "details"
  USER ||--o{ SELLERACCOUNT : "becomes"
  USER ||--o{ ACTIVITYLOG : "logs"
  USER ||--o{ SUPPORTTICKET : "raises"
  USER ||--o{ DISPUTE : "raises"
  USER ||--o{ NOTIFICATION : "receives"
  USER ||--o{ AFFILIATE : "refers"
  USER ||--o{ GIFT_CARD : "owns"
  USER ||--o{ WALLET : "holds"
  WALLET ||--o{ TRANSACTION : "has"
  WALLET ||--o{ TOPUP : "topups"
  WALLET ||--o{ WITHDRAWAL : "withdraw"
  PAYMENT ||--|| ORDER : "for"
  PAYMENT ||--o{ REFUND : "can_have"
  ORDER ||--|{ ORDERITEM : "contains"
  ORDER ||--|| SHIPMENT : "delivers"
  ORDER ||--o{ DISPUTE : "may cause"
  ORDERITEM ||--|| PRODUCTVARIANT : "ordered"
  ORDERITEM ||--o{ REVIEW : "reviewed"
  ORDERITEM ||--|| SHOP : "seller"
  SHOP ||--o{ PRODUCT : "sells"
  SHOP ||--o{ SELLERACCOUNT : "account"
  SHOP ||--o{ VOUCHER : "offers"
  SHOP ||--o{ ADVERTISEMENT : "ads"
  SELLERACCOUNT ||--o{ SELLERVERIFICATION : "documents"
  PRODUCT ||--o{ PRODUCTVARIANT : "variants"
  PRODUCT ||--o{ PRODUCTIMAGE : "images"
  PRODUCT ||--o{ REVIEW : "reviews"
  CATEGORY ||--o{ PRODUCT : "classifies"
  PRODUCTVARIANT ||--o{ INVENTORY : "stocks"
  INVENTORY ||--|| WAREHOUSE : "stored"
  COURIER ||--o{ SHIPPINGMETHOD : "provides"
  SHIPPINGMETHOD ||--|| SHIPMENT : "used"
  SHIPMENT ||--o{ SHIPMENTEVENT : "status_updates"
  CART ||--o{ CARTITEM : "has"
  CARTITEM ||--|| PRODUCTVARIANT : "chooses"
  WISHLIST ||--o{ WISHLISTITEM : "contains"
  WISHLISTITEM ||--|| PRODUCT : "holds"
  CAMPAIGN ||--o{ FLASHSALE : "includes"
  FLASHSALE ||--|| PRODUCTVARIANT : "discounts"
  CURRENCY ||--o{ ORDER : "used"
  CURRENCY ||--o{ PRODUCT : "priced"
  LANGUAGE ||--o{ PRODUCT : "localized"
  BANNER }|..|{ SHOP : "market"
  BANNER }|..|{ PRODUCT : "feature"

  %% User level, permission, and audit relationships
  USER ||--o{ USER_LEVEL_ASSIGNMENT : "assigned to"
  USERLEVEL ||--o{ USER_LEVEL_ASSIGNMENT : "assignment"
  SYSTEM ||--o{ USER_LEVEL_ASSIGNMENT : "assignment"
  USER ||--o{ USER_LEVEL_ASSIGNMENT : "assigns"
  USERLEVEL ||--o{ USER_LEVEL_PERMISSION : "permits"
  USER ||--o{ AUDIT_LOG : "action by"