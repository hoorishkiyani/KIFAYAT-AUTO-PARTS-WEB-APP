# Kifayat Auto Parts — Flask Backend

## Prerequisites
- Python 3.9+
- MySQL Server running locally

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Set up the database
Open MySQL and run:
```bash
mysql -u root -p < schema/schema.sql
```
Or open the file in MySQL Workbench and execute it.

### 3. Configure database credentials
Open `app.py` and update the `get_db()` function:
```python
def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',        # ← your MySQL username
        password='',        # ← your MySQL password
        database='kifayat_db'
    )
```

### 4. Run the app
```bash
python app.py
```

Then open: **http://127.0.0.1:5000**

---

## Project Structure
```
kifayat/
├── app.py                  ← Flask routes & controllers
├── requirements.txt
├── schema/
│   └── schema.sql          ← Database schema + sample data
├── templates/
│   ├── base.html           ← Shared layout (navbar + footer)
│   ├── index.html          ← Home page
│   ├── products.html       ← Products with search/filter
│   ├── categories.html     ← Categories with product counts
│   ├── orders.html         ← Cart view + order tracking
│   └── contact.html        ← Contact form
└── static/
    ├── css/style.css       ← All styles
    └── js/cart.js          ← Cart logic + checkout API call
```

## Features
- **Products** — search by name, filter by category, add to cart
- **Categories** — live product counts from DB
- **Cart** — localStorage-based, drawer UI, qty controls
- **Checkout** — saves order + items to DB, returns Order ID
- **Order Tracking** — look up any order by KAP-YYYY-NNN code
- **Contact** — form saves messages to DB with flash feedback
- **Home** — live stats pulled from database

## Sample Order IDs (for tracking demo)
- `KAP-2026-001` — Delivered
- `KAP-2026-002` — In Transit
- `KAP-2026-003` — Delivered
