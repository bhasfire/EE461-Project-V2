from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_py import create_client, Client

app = Flask(__name__)
CORS(app)

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        print("Received data:", data)

        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")

        print("Extracted values:", email, password, first_name, last_name)

        # Step 1: Sign up the user using Supabase's authentication
        response = supabase.auth.sign_up(email, password)
        print("Full Supabase response:", response)
        print("Sign-up response:", response)
        # Check for error in a more specific manner
        error = response.get("error") or (response.get("data") and response.get("data").get("error"))
        if error:
            return jsonify({"message": "Signup failed at Supabase auth!", "error": str(error)}), 400

        # Step 2: Insert user details into the "Users" table
        table = supabase.table("Users")
        data_to_insert = {
            "First Name": first_name,
            "Last Name": last_name,
            "Email": email,
            "Password": password
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



@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    # Authenticate user in Supabase
    user, error = supabase.auth.sign_in(email, password)
    
    if error:
        return jsonify({"message": str(error)}), 400
    return jsonify({"message": "Signin successful!"}), 200

@app.route("/logout", methods=["POST"])
def logout():
    supabase.auth.sign_out()
    return jsonify({"message": "Logged out successfully!"}), 200



if __name__ == '__main__':
    app.run(debug=True, port=8001)