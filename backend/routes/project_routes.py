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

# @project_bp.route("/create", methods=["POST"])
# def create_project_route():
#     data = request.get_json()
#     project_id = int(data.get("projectId"))
#     project_name = data.get("projectName")

#     if not data:
#         return jsonify({"message": "No data provided"}), 400

#     # Fetch the list of project IDs and names
#     project_ids = [item['project_id'] for item in supabase.table("Projects").select("project_id").execute()['data']]
#     project_names = [item['project_name'] for item in supabase.table("Projects").select("project_name").execute()['data']]

#     print(project_ids)
#     print(project_names)

#     # Project ID already in use
#     if project_id in project_ids:
#         return jsonify({"Error Message": "ERROR WITH ID"}), 403

#     # Project name already in use
#     if project_name in project_names:
#         return jsonify({"Error Message": "ERROR WITH NAME"}), 403

#     else:
#         project = create_project(project_name, project_id)
#         return jsonify(project), 201

# @project_bp.route("/create", methods=["POST"])
# def create_project_route():
#     data = request.get_json()
#     project_name = data.get("name")
#     if not project_name:
#         return jsonify({"message": "Project name is required"}), 400
#     project = create_project(project_name)
#     return jsonify(project), 201



# This function tries to get the project ID from both possible keys
def get_project_id(data):
    return data.get('project_id') or data.get('projectId')

# This function tries to get the project name from both possible keys
def get_project_name(data):
    return data.get('project_name') or data.get('projectName')

@project_bp.route("/create", methods=["POST"])
def create_project_route():
    data = request.get_json()
    logging.info(f"Received data for project creation: {data}")

    project_id = get_project_id(data)
    project_name = get_project_name(data)

    if not data:
        logging.error("No data provided for project creation.")
        return jsonify({"message": "No data provided"}), 400

    if not project_name:
        logging.error("Project name is required for project creation.")
        return jsonify({"message": "Project name is required"}), 400

    if not project_id:
        logging.error("Project ID is required for project creation.")
        return jsonify({"message": "Project ID is required"}), 400

    # Here you would have to convert the project_id to int if necessary
    project_id = int(project_id)

    if project_id_exists(project_id):
        logging.error(f"Project ID {project_id} already in use.")
        return jsonify({"Error Message": "Project ID already in use"}), 409

    if project_name_exists(project_name):
        logging.error(f"Project name {project_name} already in use.")
        return jsonify({"Error Message": "Project name already in use"}), 409

    project = create_project(project_name, project_id)
    return jsonify(project), 201

# Define the functions to check if the project ID or name exists
def project_id_exists(project_id):
    # Check for project ID in the database
    result = supabase.table("Projects").select("project_id").eq("project_id", project_id).execute()
    return bool(result['data'])




def project_name_exists(project_name):
    # Check for project name in the database
    result = supabase.table("Projects").select("project_name").eq("project_name", project_name).execute()
    return bool(result['data'])


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



