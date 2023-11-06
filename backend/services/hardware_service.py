from flask import Blueprint, request, jsonify
from supabase_py import create_client, Client
import logging

supabaseUrl = "https://tpbjxnsgkuyljnxiqfsz.supabase.co"
supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYmp4bnNna3V5bGpueGlxZnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMTI5NjIsImV4cCI6MjAxMTY4ODk2Mn0.lTYIrdhUz9qe2PdwKN-zbBDScqIHA7u97iatoIazqmc"
supabase: Client = create_client(supabaseUrl, supabaseKey)

def get_hardware():
    data = supabase.table('Hardware').select("*").execute()
    if data.get('status_code') != 200:
        logging.error(f"Error fetching hardware: {data.get('status_code')}")
        return []

    return data

def check_out(hardware_id, quantity):
    # data = {"user_id": user_id, "project_id": project_id, "hardware_id": hardware_id, "quantity": quantity}
    # check_out_response, check_out_error = supabase.table("Checkouts").insert(data).execute()
    data = {"hardware_id": hardware_id, "quantity": quantity}
    print(hardware_id)
    availability = supabase.table("Hardware").select("availability").eq('hardware_id', str(hardware_id)).execute()
    availability = availability.get('data')[0].get('availability')
    hardware_response = None
    if (availability >= int(quantity)):
        newAvailability = availability - int(quantity)
        print(newAvailability)
        print(str(hardware_id))
        hardware_response = supabase.table("Hardware").update({"availability": newAvailability}).eq("hardware_id", str(hardware_id)).execute()

    # print("Checkout Response:", check_out_response)
    # print("Checkout Error:", check_out_error)
    print("Hardware Response:", hardware_response)

    # if check_out_error:
    #     logging.error(f"Error checking out: {check_out_error}")
    #     return None
    
    # if hardware_error:
    #     logging.error(f"Error updating hardware: {hardware_error}")
    #     return None

    # if 'data' not in check_out_response or not check_out_response['data']:
    #     logging.error(f"Unexpected response from Supabase: {check_out_response}")
    #     return None

    return hardware_response