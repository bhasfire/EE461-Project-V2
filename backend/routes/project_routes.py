from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.project_service import create_project, get_projects, join_project, get_projects_with_ids
from supabase_py import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

project_bp = Blueprint('project', __name__)
CORS(project_bp)

@project_bp.route("/create", methods=["POST"])
def create_project_route():
    data = request.get_json()
    project_name = data.get("name")
    if not project_name:
        return jsonify({"message": "Project name is required"}), 400
    project = create_project(project_name)
    return jsonify(project), 201

@project_bp.route("/getprojects", methods=["GET"])
def get_projects_route():
    data = supabase.table("Projects").select("project_name").execute()
    return jsonify(data['data']), 200


@project_bp.route("/getprojectswithids", methods=["GET"])
def get_projects_with_ids_route():
    result = get_projects_with_ids()
    if result['error']:
        return jsonify({"message": "Failed to fetch projects", "error": result['error']}), 500
    return jsonify(result['data']), 200



@project_bp.route('/join', methods=['POST'])
def join_project_route():
    data = request.get_json()
    user_id = data.get('user_id')
    project_id = data.get('project_id')

    if not user_id or not project_id:
        return jsonify({"message": "User ID and Project ID are required"}), 400

    success = join_project(user_id, project_id)
    if success:
        return jsonify({"message": "Successfully joined project"}), 200
    else:
        return jsonify({"message": "Failed to join project"}), 400



