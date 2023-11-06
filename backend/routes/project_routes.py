from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.project_service import create_project, join_project, get_projects_with_ids
from supabase import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

project_bp = Blueprint('project', __name__)
CORS(project_bp)

@project_bp.route("/create", methods=["POST"])
def create_project_route():
    data = request.get_json()
    project_id = int(data.get("projectId"))
    project_name = data.get("projectName")

    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Fetch the list of project IDs and names
    project_ids = [item['project_id'] for item in supabase.table("Projects").select("project_id").execute().data]
    project_names = [item['project_name'] for item in supabase.table("Projects").select("project_name").execute().data]

    print(project_ids)
    print(project_names)

    # Project ID already in use
    if project_id in project_ids:
        return jsonify({"Error Message": "ERROR WITH ID"}), 403

    # Project name already in use
    if project_name in project_names:
        return jsonify({"Error Message": "ERROR WITH NAME"}), 403

    else:
        project = create_project(project_name, project_id)
        return jsonify(project), 201

def project_name_exists(project_name):
    # Check for project name in the database
    response = supabase.table("Projects").select("project_name").eq("project_name", project_name).execute()
    return bool(response.data)

@project_bp.route("/getprojectswithids", methods=["POST"])
def get_projects_with_ids_route():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"message": "User ID required"}), 400
    
    result = get_projects_with_ids(user_id)
    print(result)
    
    if result['error']:
        return jsonify({"message": "Failed to fetch projects", "error": result['error']}), 500
    return jsonify(result['data']), 200

@project_bp.route("/getproject", methods=["POST"])
def get_project():
    data = request.get_json()
    project_id = data.get('project_id')
    if not project_id:
        return jsonify({"message": "Project ID required"}), 400
    try:
        logging.info("Attempting to fetch project with ID from Supabase")
        response = supabase.table("Projects").select("hw1_qty, hw2_qty").eq("project_id", project_id).execute()
        data = response.data
        logging.info("Fetched project successfully: {}".format(data))
        return jsonify(data), 200
    except Exception as e:
        logging.error(f"Exception in get_project: {e}")
        return jsonify({"message": "Failed to fetch project", "error": str(e)}), 500    
    
@project_bp.route("/setproject", methods=["POST"])
def set_project():
    data = request.get_json()
    project_id = data.get('project_id')
    hw1_set = data.get('hw1_set')
    hw2_set = data.get('hw2_set')
    try:
        logging.info("Attempting to fetch project with ID from Supabase")
        response = supabase.table("Projects").select("hw1_qty, hw2_qty").eq("project_id", project_id).execute()
        entry = response.data[0]
        entry["hw1_qty"] += hw1_set
        entry["hw2_qty"] += hw2_set
        response = supabase.table("Projects").update(entry).eq("project_id", project_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        logging.error(f"Exception in get_projects_with_ids: {e}")
        return jsonify({"message": "Failed to fetch project", "error": str(e)}), 500 
    
@project_bp.route("/gethardware", methods=["POST"])
def get_hardware():
    data = request.get_json()
    hardware_id = data.get('hardware_id')
    if not hardware_id:
        return jsonify({"message": "Hardware ID required"}), 400
    try:
        logging.info("Attempting to fetch hardware with ID from Supabase")
        response = supabase.table("Hardware").select("capacity, availability").eq("hardware_id", hardware_id).execute()
        data = response.data[0]
        logging.info("Fetched hardware successfully: {}".format(data))
        return jsonify(data), 200
    except Exception as e:
        logging.error(f"Exception in get_hardware: {e}")
        return jsonify({"message": "Failed to fetch hardware", "error": str(e)}), 500    
    
@project_bp.route("/sethardware", methods=["POST"])
def set_hardware():
    data = request.get_json()
    hardware_id = data.get('hardware_id')
    set = data.get('set')
    try:
        logging.info("Attempting to fetch project with ID from Supabase")
        response = supabase.table("Hardware").select("capacity, availability").eq("hardware_id", hardware_id).execute()
        entry = response.data[0]
        sum = entry["availability"] + set
        if(sum < 0 or sum > entry["capacity"]):
            raise Exception("invalid checkin/out") 
        entry["availability"] = sum
        response = supabase.table("Hardware").update(entry).eq("hardware_id", hardware_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        logging.error(f"Exception in set_hardware: {e}")
        return jsonify({"message": "Failed to update hardware", "error": str(e)}), 500 

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

