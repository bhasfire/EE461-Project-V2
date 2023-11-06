from flask import Blueprint, request, jsonify
from supabase_py import create_client, Client
from flask_cors import CORS
from services.hardware_service import get_hardware, check_out


supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

hardware_bp = Blueprint('hardware', __name__)
CORS(hardware_bp)

@hardware_bp.route("/gethardware", methods=["GET"])
def get_hardware_route():
    data = get_hardware()

    return jsonify(data), 200

@hardware_bp.route("/checkout", methods=["GET"])
def checkout_route():
    data = request.get_json()
    user_id = data.get("user_id")
    project_id = data.get("project_id")
    hardware_id = data.get("hardware_id")
    quantity = data.get("quantity")
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    if not project_id:
        return jsonify({"message": "Project ID is required"}), 400
    if not hardware_id:
        return jsonify({"message": "Hardware ID is required"}), 400
    if not quantity:
        return jsonify({"message": "Quantity is required"}), 400
    checkout = check_out(user_id, project_id, hardware_id, quantity)
    return jsonify(checkout), 201