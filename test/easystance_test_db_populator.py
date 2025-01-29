import mysql.connector
from mysql.connector import Error
import bcrypt
from faker import Faker
import random
from datetime import datetime, timedelta

DB_HOST = 'localhost'
DB_USER = 'easystance_user'
DB_PASSWORD = 'easystance_password'
DB_NAME = 'easystance_db'

def gen_random_date(last_days=30):
    random_days = random.randint(0, last_days)
    random_date = datetime.now() - timedelta(days=random_days)
    random_hours = random.randint(0, 23)
    random_minutes = random.randint(0, 59)
    random_seconds = random.randint(0, 59)
    random_date = random_date.replace(hour=random_hours, minute=random_minutes, second=random_seconds)
    return random_date.strftime('%Y-%m-%d %H:%M:%S')

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        if connection.is_connected():
            print("Connessione al database riuscita")
        return connection
    except Error as e:
        print(f"Errore durante la connessione al database: {e}")
        return None

def populate_customers(connection, n_customers=10):
    fake = Faker()
    try:
        cursor = connection.cursor()
        customers = []
        for _ in range(n_customers):
            name = fake.first_name()
            surname = fake.last_name()
            email = fake.email()
            phone = fake.phone_number()
            password = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            #Momentaneamente sosistuite tutte le password con "password" per scopi di test
            #password = bcrypt.hashpw(fake.password().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            created_at = updated_at = gen_random_date()
            customers.append((name, surname, email, phone, password, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO customers (name, surname, email, phone, password, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            customers
        )
        connection.commit()
        print(f"Inseriti {n_customers} clienti casuali con successo")
    except Error as e:
        print(f"Errore durante l'inserimento dei clienti: {e}")

def populate_employees(connection, n_employees=10):
    fake = Faker()
    try:
        cursor = connection.cursor()
        employees = []
        for _ in range(n_employees):
            name = fake.first_name()
            surname = fake.last_name()
            email = fake.email()
            phone = fake.phone_number()
            password = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            #Momentaneamente sosistuite tutte le password con "password" per scopi di test
            #password = bcrypt.hashpw(fake.password().encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            role = random.choice(["administrator", "operator", "technician"])
            created_at = updated_at = gen_random_date()
            employees.append((name, surname, email, phone, password, role, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO employees (name, surname, email, phone, password, role, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            employees
        )
        connection.commit()
        print(f"Inseriti {n_employees} dipendenti casuali con successo")
    except Error as e:
        print(f"Errore durante l'inserimento dei dipendenti: {e}")

def populate_tickets(connection, n_tickets=10):
    fake = Faker()
    try:
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM customers")
        customer_ids = [row[0] for row in cursor.fetchall()]
        if not customer_ids:
            print("Nessun cliente trovato nel database per collegare i ticket.")
            return

        cursor.execute("SELECT id FROM employees WHERE role = \"technician\"")
        technician_ids = [row[0] for row in cursor.fetchall()]
        
        tickets = []
        for _ in range(n_tickets):
            subject = fake.sentence(nb_words=10)
            description = fake.sentence(nb_words=20)
            category = random.choice(["help", "repair", "maintenance"])
            priority = random.choice(["low", "medium", "high", "critical"])
            status = random.choice(["open", "in_progress", "closed"])
            customer_id = random.choice(customer_ids)
            technician_id = random.choice([None, random.choice(technician_ids)])
            created_at = updated_at = gen_random_date()
            tickets.append((subject, description, category, priority, status, customer_id, technician_id, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO tickets (subject, description, category, priority, status, customerId, technicianId, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            tickets
        )
        connection.commit()
        print(f"Inseriti {n_tickets} ticket casuali con successo")        
    except Error as e:
        print(f"Errore durante l'inserimento dei ticket: {e}")

def populate_components(connection, n_components=10):
    fake = Faker()
    try:
        cursor = connection.cursor()

        components = []
        for _ in range(n_components):
            name = fake.sentence(nb_words=5)
            quantity = random.randrange(0, 1000)
            created_at = updated_at = gen_random_date()
            components.append((name, quantity, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO components (name, quantity, createdAt, updatedAt) VALUES (%s, %s, %s, %s)",
            components
        )
        connection.commit()
        print(f"Inseriti {n_components} componenti casuali con successo")        
    except Error as e:
        print(f"Errore durante l'inserimento dei componenti: {e}")

def populate_comments(connection, n_comments=10):
    fake = Faker()
    try:
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM tickets")
        ticket_ids = [row[0] for row in cursor.fetchall()]
        if not ticket_ids:
            print("Nessun ticket trovato nel database per collegare i commenti.")
            return

        cursor.execute("SELECT id FROM employees")
        employee_ids = [row[0] for row in cursor.fetchall()]
        if not employee_ids:
            print("Nessun dipendente trovato nel database per collegare i commenti.")
            return
        
        comments = []
        for _ in range(n_comments):
            description = fake.sentence(nb_words=20)
            ticket_id = random.choice(ticket_ids)
            employee_id = random.choice(employee_ids)
            created_at = updated_at = gen_random_date()
            comments.append((description, ticket_id, employee_id, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO comments (description, ticketId, employeeId, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s)",
            comments
        )
        connection.commit()
        print(f"Inseriti {n_comments} commenti casuali con successo")        
    except Error as e:
        print(f"Errore durante l'inserimento dei commenti: {e}")

def populate_actions(connection, n_actions=10):
    fake = Faker()
    try:
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM tickets")
        ticket_ids = [row[0] for row in cursor.fetchall()]
        if not ticket_ids:
            print("Nessun ticket trovato nel database per collegare le azioni.")
            return

        cursor.execute("SELECT id FROM employees")
        employee_ids = [row[0] for row in cursor.fetchall()]
        if not employee_ids:
            print("Nessun dipendente trovato nel database per collegare le azioni.")
            return
        
        actions = []
        for _ in range(n_actions):
            description = fake.sentence(nb_words=20)
            category = random.choice(["assignation", "edit", "call", "repair", "document"])
            ticket_id = random.choice(ticket_ids)
            employee_id = random.choice(employee_ids)
            created_at = updated_at = gen_random_date()
            actions.append((description, category, ticket_id, employee_id, created_at, updated_at))

        cursor.executemany(
            "INSERT INTO actions (description, category, ticketId, employeeId, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s)",
            actions
        )
        connection.commit()
        print(f"Inserite {n_actions} azioni casuali con successo")        
    except Error as e:
        print(f"Errore durante l'inserimento delle azioni: {e}")

def main():
    connection = create_connection()
    if connection:
        populate_customers(connection, n_customers=100)
        populate_employees(connection, n_employees=25)
        populate_tickets(connection, n_tickets=50)
        populate_components(connection, n_components=50)
        populate_comments(connection, n_comments=500)
        populate_actions(connection, n_actions=750)
        connection.close()

if __name__ == "__main__":
    main()
