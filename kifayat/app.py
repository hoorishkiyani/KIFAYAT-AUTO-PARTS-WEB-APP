from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
import mysql.connector
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'kifayat_secret_key_2026'

def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='12345678',
        database='kifayat_db'
    )

# ---------- HOME ----------
@app.route('/')
def index():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT COUNT(*) AS total FROM products")
    product_count = cur.fetchone()['total']
    cur.execute("SELECT COUNT(*) AS total FROM orders")
    order_count = cur.fetchone()['total']
    cur.execute("SELECT COUNT(DISTINCT customer_name) AS total FROM orders")
    customer_count = cur.fetchone()['total']
    cur.close()
    db.close()
    return render_template('index.html',
                           product_count=product_count,
                           order_count=order_count,
                           customer_count=customer_count)

# ---------- PRODUCTS ----------
@app.route('/products')
def products():
    db = get_db()
    cur = db.cursor(dictionary=True)
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()

    query = "SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1"
    params = []
    if search:
        query += " AND (p.name LIKE %s OR c.name LIKE %s)"
        params += [f'%{search}%', f'%{search}%']
    if category:
        query += " AND c.name = %s"
        params.append(category)
    query += " ORDER BY p.id DESC"

    cur.execute(query, params)
    products_list = cur.fetchall()

    cur.execute("SELECT DISTINCT name FROM categories ORDER BY name")
    categories = [r['name'] for r in cur.fetchall()]
    cur.close()
    db.close()
    return render_template('products.html', products=products_list, categories=categories,
                           search=search, selected_category=category)

# ---------- CATEGORIES ----------
@app.route('/categories')
def categories():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT c.*, COUNT(p.id) AS product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name
    """)
    cats = cur.fetchall()
    cur.close()
    db.close()
    return render_template('categories.html', categories=cats)

# ---------- ORDERS ----------
@app.route('/orders')
def orders():
    cart = session.get('cart', [])
    return render_template('orders.html', cart=cart)

@app.route('/orders/track', methods=['POST'])
def track_order():
    order_id = request.form.get('order_id', '').strip()
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("""
        SELECT o.*, oi.product_name, oi.qty, oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.order_code = %s
    """, (order_id,))
    rows = cur.fetchall()
    cur.close()
    db.close()

    if not rows:
        flash(f'No order found with ID: {order_id}', 'error')
        return redirect(url_for('orders'))

    order_info = {
        'order_code': rows[0]['order_code'],
        'customer_name': rows[0]['customer_name'],
        'status': rows[0]['status'],
        'placed_on': rows[0]['placed_on'],
        'items': [{'name': r['product_name'], 'qty': r['qty'], 'price': r['unit_price']} for r in rows]
    }
    cart = session.get('cart', [])
    return render_template('orders.html', tracked=order_info, cart=cart)

@app.route('/orders/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    cart = data.get('cart', [])
    customer_name = data.get('customer_name', 'Guest').strip() or 'Guest'
    customer_phone = data.get('customer_phone', '').strip()

    if not cart:
        return jsonify({'success': False, 'message': 'Cart is empty'})

    db = get_db()
    cur = db.cursor(dictionary=True)
    now = datetime.now()
    order_code = f"KAP-{now.year}-{now.strftime('%m%d%H%M%S')}"

    cur.execute("""
        INSERT INTO orders (order_code, customer_name, customer_phone, status, placed_on)
        VALUES (%s, %s, %s, 'Pending', %s)
    """, (order_code, customer_name, customer_phone, now.date()))
    order_id = cur.lastrowid

    for item in cart:
        cur.execute("""
            INSERT INTO order_items (order_id, product_name, qty, unit_price)
            VALUES (%s, %s, %s, %s)
        """, (order_id, item['name'], item['qty'], item['price']))

    db.commit()
    cur.close()
    db.close()
    return jsonify({'success': True, 'order_code': order_code})

# ---------- CONTACT ----------
@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contact/send', methods=['POST'])
def send_message():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    subject = request.form.get('subject', '').strip()
    message = request.form.get('message', '').strip()

    if not name or not email or not subject or not message:
        flash('Please fill in all required fields.', 'error')
        return redirect(url_for('contact'))

    db = get_db()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO contact_messages (name, email, phone, subject, message, sent_at)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (name, email, phone, subject, message, datetime.now()))
    db.commit()
    cur.close()
    db.close()
    flash('Your message has been sent! We\'ll get back to you within 24 hours.', 'success')
    return redirect(url_for('contact'))

# ---------- API: Cart count / product search ----------
@app.route('/api/products')
def api_products():
    db = get_db()
    cur = db.cursor(dictionary=True)
    search = request.args.get('q', '')
    cur.execute("""
        SELECT p.id, p.name, p.price, p.stock_status, p.description, p.icon, c.name AS category
        FROM products p JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE %s OR c.name LIKE %s
        LIMIT 50
    """, (f'%{search}%', f'%{search}%'))
    rows = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
