from flask import Flask, render_template
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

def get_db_connection():
    """Create and return a database connection"""
    return mysql.connector.connect(
        host='localhost',
        user='portfolio_user',
        password=os.getenv('DB_PASSWORD'),
        database='portfolio_db'
    )

@app.route('/')
def home():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT title, description, technologies FROM projects ORDER BY created_at DESC LIMIT 3")
        featured_projects = cur.fetchall()
        cur.close()
        conn.close()
        return render_template('index.html', projects=featured_projects)
    except Exception as e:
        print(f"Database error: {e}")
        return render_template('index.html', projects=[])

@app.route('/about')
def about():
    return render_template('about.html')  # New about page

@app.route('/projects')
def projects():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT title, description, technologies, project_url FROM projects ORDER BY created_at DESC")
        all_projects = cur.fetchall()
        cur.close()
        conn.close()
        return render_template('projects.html', projects=all_projects)
    except Exception as e:
        print(f"Database error: {e}")
        return render_template('projects.html', projects=[])

@app.route('/contact')
def contact():
    return render_template('contact.html')  # New contact page

if __name__ == '__main__':
    app.run(debug=True)

