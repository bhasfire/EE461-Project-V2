from flask import Blueprint, request, jsonify
from supabase_py import create_client, Client
import bcrypt
import requests

auth_bp = Blueprint('auth', __name__)

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        print("Received data:", data)

        email = data.get("email")
        password = data.get("password").encode('utf-8')  # Convert password to bytes
        first_name = data.get("firstName")
        last_name = data.get("lastName")

        print("Extracted values:", email, password, first_name, last_name)

        # Step 1: Hash the password
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
        print("Hashed password:", hashed_password)

        # Step 2: Sign up the user using Supabase's authentication
        response = supabase.auth.sign_up(email, password.decode('utf-8'))
        print("Full Supabase response:", response)
        print("Sign-up response:", response)
        # Check for error in a more specific manner
        error = response.get("error") or (response.get("data") and response.get("data").get("error"))
        if error:
            return jsonify({"message": "Signup failed at Supabase auth!", "error": str(error)}), 400

        # Step 3: Insert user details into the "Users" table
        table = supabase.table("Users")
        data_to_insert = {
            "First Name": first_name,
            "Last Name": last_name,
            "Email": email,
            "Password": hashed_password  # Save hashed password
        }

        print("Attempting to insert data:", data_to_insert)
        user_insert_response = table.insert(data_to_insert).execute()
        print("Insert response:", user_insert_response)

        if user_insert_response.get("error"):
            return jsonify({"message": "Failed to save user details at database insertion!", "error": user_insert_response.get("error")}), 400

        return jsonify({"message": "Signup successful!", "user": response.get('data')}), 200

    except Exception as e:
        print("An exception occurred:", str(e))
        return jsonify({"message": "An unexpected error occurred!", "error": str(e)}), 500

@auth_bp.route("/signin", methods=["POST"])
def signin():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        #print("Received email:", email)
        #print("Received password:", password)

        # Replace with your actual Supabase URL
        supabase_url = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
        api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"

        # Construct the raw HTTP request to Supabase
        url = f"{supabase_url}/rest/v1/Users?select=*&Email=eq.{email}"
        headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        response = requests.get(url, headers=headers)
        users_response = response.json()

        #print("Raw HTTP Request to Supabase:", response.request.url, response.request.headers)
        #print("Users response:", users_response)

        users = users_response if users_response else []
        user = users[0] if users else None
        print("User data:", user)

        if not user:
            return jsonify({"message": "User not found!"}), 404

        # Check if the provided password matches the stored hashed password
        if not bcrypt.checkpw(password.encode('utf-8'), user["Password"].encode('utf-8')):
            return jsonify({"message": "Invalid password!"}), 401

        return jsonify({"message": "Signin successful!"}), 200
    except RuntimeError as e:
        pass
    except Exception as e:
        print("An exception occurred:", str(e))
        return jsonify({"message": "An unexpected error occurred!", "error": str(e)}), 500
    
@auth_bp.route("/logout", methods=["POST"])
def logout():
    supabase.auth.sign_out()
    return jsonify({"message": "Logged out successfully!"}), 200
