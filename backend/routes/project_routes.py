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
        data = response.data[0]
        logging.info("Fetched project successfully: {}".format(data))
        return jsonify(data), 200
    except Exception as e:
        logging.error(f"Exception in get_project: {e}")
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

#fetches hardware quantity based on project_id
@project_bp.route("/gethardwarequantities", methods=["POST"])
def get_hardware_quantities():
    data = request.get_json()
    project_id = data.get('project_id')

    if not project_id:
        return jsonify({"message": "Project ID required"}), 400

    try:
        # Query the database to find the hw1_qty and hw2_qty for the project
        response = supabase.table("Projects").select("hw1_qty, hw2_qty").eq("project_id", project_id).execute()
        hw1_qty = response.data[0]['hw1_qty'] if response.data else 0
        hw2_qty = response.data[0]['hw2_qty'] if response.data else 0
        return jsonify({"hw1_qty": hw1_qty, "hw2_qty": hw2_qty}), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch hardware quantities", "error": str(e)}), 500


@project_bp.route("/sethardware", methods=["POST"])
def set_hardware():
    data = request.get_json()
    project_id = data.get('project_id')
    hardware_id = data.get('hardware_id')
    set = data.get('set')
    try:
        logging.info("Attempting to fetch project with ID from Supabase")
        project_response = supabase.table("Projects").select("hw1_qty, hw2_qty").eq("project_id", project_id).execute()
        project_entry = project_response.data[0]
        hardware_response = supabase.table("Hardware").select("capacity, availability").eq("hardware_id", hardware_id).execute()
        hardware_entry = hardware_response.data[0]
        hardware_sum = hardware_entry["availability"] + set
        if(hardware_sum > hardware_entry["capacity"]):
            raise Exception("invalid checkin") 
        if(hardware_sum < 0):
            raise Exception("invalid checkout") 
        if(hardware_id == 1 and set > project_entry["hw1_qty"]):
            raise Exception("invalid checkout") 
        if(hardware_id == 2 and set > project_entry["hw2_qty"]):
            raise Exception("invalid checkout")  
        if(hardware_id == 1):
            project_entry["hw1_qty"] -= set  
        else:
            project_entry["hw2_qty"] -= set
        hardware_entry["availability"] = hardware_sum
        response = supabase.table("Projects").update(project_entry).eq("project_id", project_id).execute()
        response = supabase.table("Hardware").update(hardware_entry).eq("hardware_id", hardware_id).execute()
        
        return jsonify(response.data[0]), 200
    except Exception as e:
        logging.error(f"Exception in get_projects_with_ids: {e}")
        return jsonify({"message": "Failed to fetch project", "error": str(e)}), 500   

@project_bp.route('/join', methods=['POST'])
def join_project_route():
    data = request.get_json()
    user_id = data.get('user_id')
    project_id = data.get('project_id')

    if not user_id or not project_id:
        return jsonify({"message": "User ID and Project ID are required"}), 400

    response = join_project(user_id, project_id)
    if response["success"]:
        return jsonify({"success": True, "message": response["message"]}), 200
    else:
        return jsonify({"success": False, "message": response["message"]}), 400


