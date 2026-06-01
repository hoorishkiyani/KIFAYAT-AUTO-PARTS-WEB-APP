# KIFAYAT-AUTO-PARTS-WEB-APP
Full-stack auto parts e-commerce app built with Python Flask &amp; MySQL. Features product catalog, shopping cart, order tracking, and contact form. Database Systems course project.
# ⚙️ Kifayat Auto Parts

> A full-stack web application for managing and selling auto parts — built with Python Flask and MySQL.

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📌 About

**Kifayat Auto Parts** is a Database Systems course project — a fully functional e-commerce web application for an auto parts store based in Peshawar, Pakistan. It features a dynamic product catalog, shopping cart, order tracking, category management, and a contact form, all backed by a relational MySQL database.

---

## ✨ Features

- 🛒 **Product Catalog** — Browse 20+ products with search and category filter
- 📂 **Categories** — 8 part categories with live product counts
- 🧺 **Shopping Cart** — Add/remove items, adjust quantities, persistent across pages
- 📦 **Checkout & Orders** — Place orders saved to DB, receive a unique Order ID
- 🔍 **Order Tracking** — Track any order by its ID (e.g. `KAP-2026-001`)
- ✉️ **Contact Form** — Messages stored in the database
- 📊 **Live Stats** — Home page pulls real counts from the database

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.9+, Flask 3.0 |
| Database | MySQL 8.0 |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Google Fonts (Bebas Neue, Barlow) |

---

## 🗄️ Database Schema

```
categories       products          orders           order_items
──────────       ────────          ──────           ───────────
id (PK)          id (PK)           id (PK)          id (PK)
name             name              order_code       order_id (FK)
icon             description       customer_name    product_name
description      price             customer_phone   qty
                 stock_status      status           unit_price
                 icon              placed_on
                 category_id (FK)

contact_messages
────────────────
id (PK)
name, email, phone
subject, message
sent_at
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9 or higher
- MySQL Server 8.0+
- pip

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/kifayat-auto-parts.git
cd kifayat-auto-parts
```

**2. Install Python dependencies**
```bash
pip install -r requirements.txt
```
> On Windows use `py -m pip install -r requirements.txt` if `pip` isn't recognized.

**3. Set up the database**
```bash
mysql -u root -p < schema/schema.sql
```
This creates the `kifayat_db` database, all tables, and loads sample data.

**4. Configure database credentials**

Open `app.py` and update the `get_db()` function:
```python
def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',       # your MySQL username
        password='',       # your MySQL password
        database='kifayat_db'
    )
```

**5. Run the application**
```bash
python app.py
```
> On Windows: `py app.py`

Open your browser at **http://127.0.0.1:5000**

---

## 📁 Project Structure

```
kifayat-auto-parts/
│
├── app.py                  # Flask app — all routes & DB logic
├── requirements.txt        # Python dependencies
│
├── schema/
│   └── schema.sql          # Database schema + sample data
│
├── templates/
│   ├── base.html           # Shared layout (navbar, footer, cart)
│   ├── index.html          # Home page
│   ├── products.html       # Product listing with search/filter
│   ├── categories.html     # Category browser
│   ├── orders.html         # Cart + order tracking
│   └── contact.html        # Contact form
│
└── static/
    ├── css/
    │   └── style.css       # All styles (dark theme)
    └── js/
        └── cart.js         # Cart logic + checkout API
```

---

## 🧪 Sample Data

The schema loads the following sample data for testing:

- **8 categories** — Engine Parts, Brakes, Suspension, Lighting, etc.
- **20 products** — Across all categories with real PKR prices
- **3 sample orders** — Try tracking these IDs:

| Order ID | Customer | Status |
|----------|----------|--------|
| `KAP-2026-001` | Ahmed Raza | ✅ Delivered |
| `KAP-2026-002` | Sara Khan | 🚚 In Transit |
| `KAP-2026-003` | Bilal Hussain | ✅ Delivered |

---

## 📷 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section + live stats |
| Products | `/products` | Search, filter, add to cart |
| Categories | `/categories` | Browse by part type |
| Orders | `/orders` | View cart + track orders |
| Contact | `/contact` | Send a message |

---

## 👨‍💻 Author

**Hoorish Kiyani**
📧 hoorishkiyani7@gmail.com
**Atizaz Malik**
📧 atizazmalik91@gmail.com
📍 Peshawar, Pakistan

---

## 📄 License

This project is for academic/educational use as part of a Database Systems course.
