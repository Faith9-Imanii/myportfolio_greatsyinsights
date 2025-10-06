from flask import Flask, render_template, request, flash, redirect, url_for
import mysql.connector
from dotenv import load_dotenv
import os
import re

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

def get_db_connection():
    """Create and return a database connection - works on PythonAnywhere only"""
    try:
        # Check if we're running on PythonAnywhere
        if 'PYTHONANYWHERE_DOMAIN' in os.environ:
            # PythonAnywhere database configuration
            conn = mysql.connector.connect(
                host='Imanii195.mysql.pythonanywhere-services.com',
                user='Imanii195',
                password=os.getenv('DB_PASSWORD'),
                database='Imanii195$greatsy'
            )
        else:
            # Local development - use SQLite instead
            return None
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def save_contact_to_file(name, email, subject, budget, message):
    """Save contact form submission to a local file for development"""
    try:
        os.makedirs('contact_submissions', exist_ok=True)
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"contact_submissions/contact_{timestamp}.txt"
        
        with open(filename, 'w') as f:
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Subject: {subject}\n")
            f.write(f"Budget: {budget}\n")
            f.write(f"Message: {message}\n")
            f.write(f"Timestamp: {timestamp}\n")
        
        print(f"Contact saved to file: {filename}")
        return True
    except Exception as e:
        print(f"Error saving to file: {e}")
        return False

def validate_email(email):
    """Simple email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_form_data(name, email, subject, message):
    """Validate form data"""
    errors = []
    
    if not name or len(name.strip()) < 2:
        errors.append("Name must be at least 2 characters long")
    
    if not email or not validate_email(email):
        errors.append("Please enter a valid email address")
    
    if not subject:
        errors.append("Please select a subject")
    
    if not message or len(message.strip()) < 10:
        errors.append("Message must be at least 10 characters long")
    
    return errors

@app.route('/')
def home():
    try:
        conn = get_db_connection()
        if conn:
            cur = conn.cursor()
            cur.execute("SELECT title, description, technologies, project_url FROM projects ORDER BY created_at DESC LIMIT 3")
            featured_projects = cur.fetchall()
            cur.close()
            conn.close()
            return render_template('index.html', projects=featured_projects)
        else:
            # Local development - show sample projects
            sample_projects = [
                ["Sample Project 1", "A beautiful web application built with Flask", "Python, Flask, MySQL", "#"],
                ["E-commerce Site", "Online store with payment integration", "Python, Stripe API", "#"],
                ["Portfolio Website", "Responsive portfolio design", "HTML, CSS, JavaScript", "#"]
            ]
            return render_template('index.html', projects=sample_projects)
    except Exception as e:
        print(f"Database error: {e}")
        sample_projects = [
            ["Sample Project 1", "A beautiful web application built with Flask", "Python, Flask, MySQL", "#"],
            ["E-commerce Site", "Online store with payment integration", "Python, Stripe API", "#"]
        ]
        return render_template('index.html', projects=sample_projects)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    try:
        conn = get_db_connection()
        if conn:
            cur = conn.cursor()
            cur.execute("SELECT title, description, technologies, project_url FROM projects ORDER BY created_at DESC")
            all_projects = cur.fetchall()
            cur.close()
            conn.close()
            return render_template('projects.html', projects=all_projects)
        else:
            # Local development - show sample projects
            sample_projects = [
                ["Sample Project 1", "A beautiful web application built with Flask", "Python, Flask, MySQL", "#"],
                ["E-commerce Site", "Online store with payment integration", "Python, Stripe API", "#"],
                ["Portfolio Website", "Responsive portfolio design", "HTML, CSS, JavaScript", "#"],
                ["API Integration", "RESTful API with authentication", "Python, Flask, JWT", "#"],
                ["Data Analysis Tool", "Tool for analyzing business data", "Python, Pandas, Matplotlib", "#"]
            ]
            return render_template('projects.html', projects=sample_projects)
    except Exception as e:
        print(f"Database error: {e}")
        sample_projects = [
            ["Sample Project 1", "A beautiful web application built with Flask", "Python, Flask, MySQL", "#"],
            ["E-commerce Site", "Online store with payment integration", "Python, Stripe API", "#"]
        ]
        return render_template('projects.html', projects=sample_projects)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        subject = request.form.get('subject', '')
        budget = request.form.get('budget', '')
        message = request.form.get('message', '').strip()
        
        print(f"Form submitted: {name}, {email}, {subject}")  # Debug print
        
        # Validate form data
        errors = validate_form_data(name, email, subject, message)
        
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('contact.html', 
                                 form_data={'name': name, 'email': email, 
                                          'subject': subject, 'budget': budget, 
                                          'message': message})
        
        try:
            # Try to save to database (will work on PythonAnywhere)
            conn = get_db_connection()
            if conn:
                cur = conn.cursor()
                cur.execute('''
                    INSERT INTO contacts (name, email, subject, budget, message)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (name, email, subject, budget, message))
                conn.commit()
                cur.close()
                conn.close()
                print("Contact saved to database")
            else:
                # Local development - save to file
                from datetime import datetime
                save_contact_to_file(name, email, subject, budget, message)
                print("Contact saved to file (local development)")
            
            # Success message
            flash('Thank you for your message! I will get back to you within 24 hours.', 'success')
            return redirect(url_for('contact'))
            
        except Exception as e:
            print(f"Error saving contact: {e}")
            # Fallback: Save to file
            from datetime import datetime
            if save_contact_to_file(name, email, subject, budget, message):
                flash('Thank you for your message! I will get back to you within 24 hours.', 'success')
            else:
                flash('Thank you for your message! (Note: Message logging failed)', 'success')
            return redirect(url_for('contact'))
    
    # GET request - show empty form
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)

    