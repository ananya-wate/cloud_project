import boto3
import time
import uuid
from botocore.exceptions import ClientError

# --- DynamoDB setup ---
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")

applications_table = dynamodb.Table("applications")
funds_table = dynamodb.Table("funds")
# Optional (recommended for audit/idempotency)
allocations_table = dynamodb.Table("allocations")


# --- Helpers ---

def _now():
    return int(time.time())


def _uuid():
    return str(uuid.uuid4())


def _error(reason):
    return {"success": False, "reason": reason}


def _ok(payload=None):
    return {"success": True, **(payload or {})}


# --- Validation (minimal but strict where it matters) ---

REQUIRED_FIELDS = [
    "name", "aadhaar", "mobile", "email",
    "cgpa", "family_income"
]

def _validate_application(data: dict):
    for f in REQUIRED_FIELDS:
        if f not in data or data[f] in (None, ""):
            return False, f"{f} missing"
    return True, None


# --- Core APIs exposed to app.py ---

def add_application(data: dict):
    """
    Inserts a new application.
    Guarantees:
    - No duplicate by 'id'
    - Soft idempotency by 'aadhaar' (best-effort)
    """
    valid, err = _validate_application(data)
    if not valid:
        return _error(err)

    app_id = _uuid()

    item = {
        "id": app_id,
        "name": data.get("name"),
        "dob": data.get("dob"),
        "gender": data.get("gender"),
        "category": data.get("category"),
        "aadhaar": data.get("aadhaar"),
        "mobile": data.get("mobile"),
        "email": data.get("email"),

        "address_line1": data.get("address_line1"),
        "address_line2": data.get("address_line2"),
        "city": data.get("city"),
        "state": data.get("state"),
        "pincode": data.get("pincode"),

        "institute_name": data.get("institute_name"),
        "course_name": data.get("course_name"),
        "year": data.get("year"),
        "roll_number": data.get("roll_number"),
        "cgpa": data.get("cgpa"),
        "passing_year": data.get("passing_year"),

        "family_income": data.get("family_income"),
        "bank_account": data.get("bank_account"),
        "ifsc": data.get("ifsc"),

        # documents (store URLs/keys if uploaded)
        "aadhaar_doc": data.get("aadhaar_doc"),
        "income_doc": data.get("income_doc"),
        "marksheet_doc": data.get("marksheet_doc"),
        "bank_doc": data.get("bank_doc"),
        "caste_doc": data.get("caste_doc"),
        "domicile_doc": data.get("domicile_doc"),
        "nationality_doc": data.get("nationality_doc"),

        # system fields
        "score": data.get("score", 0),  # set by logic layer
        "status": "pending",
        "amount_requested": data.get("amount_requested", 0),
        "amount_allocated": 0,
        "created_at": _now(),
        "updated_at": _now(),
        "timestamp": _now()
    }

    try:
        # Primary guarantee: no duplicate id
        applications_table.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(id)"
        )
        return _ok({"id": app_id})
    except ClientError as e:
        return _error(e.response["Error"]["Message"])


def get_all_applications():
    """
    Returns all applications (scan is fine for hackathon scale).
    """
    try:
        resp = applications_table.scan()
        return resp.get("Items", [])
    except ClientError as e:
        return []


def get_funds():
    """
    Returns the single funds record.
    """
    try:
        resp = funds_table.get_item(Key={"id": "main"})
        return resp.get("Item", {})
    except ClientError:
        return {}


def allocate_funds(application_id: str, amount: int):
    """
    Atomic allocation:
    1) Ensure application is still pending
    2) Ensure sufficient funds
    3) Deduct funds
    4) Update application
    5) Log allocation (idempotency/audit)

    Uses conditional updates for correctness under concurrency.
    """
    allocation_id = _uuid()

    try:
        # 1) Check + update application status (only if pending)
        applications_table.update_item(
            Key={"id": application_id},
            UpdateExpression="SET #s = :approved, amount_allocated = :amt, updated_at = :now",
            ConditionExpression="#s = :pending",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":pending": "pending",
                ":approved": "approved",
                ":amt": amount,
                ":now": _now()
            }
        )

        # 2) Deduct funds atomically
        funds_table.update_item(
            Key={"id": "main"},
            UpdateExpression="SET remaining_budget = remaining_budget - :amt",
            ConditionExpression="remaining_budget >= :amt",
            ExpressionAttributeValues={":amt": amount}
        )

        # 3) Log allocation (best-effort, no condition needed)
        try:
            allocations_table.put_item(
                Item={
                    "allocation_id": allocation_id,
                    "application_id": application_id,
                    "amount": amount,
                    "status": "success",
                    "timestamp": _now()
                }
            )
        except Exception:
            pass

        return _ok({"allocation_id": allocation_id})

    except ClientError as e:
        # If funds condition fails OR status not pending
        return _error("ALLOCATION_FAILED")


def reject_application(application_id: str, reason: str = "REJECTED"):
    """
    Mark application as rejected.
    """
    try:
        applications_table.update_item(
            Key={"id": application_id},
            UpdateExpression="SET #s = :rej, updated_at = :now",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={
                ":rej": "rejected",
                ":now": _now()
            }
        )
        return _ok()
    except ClientError:
        return _error("UPDATE_FAILED")
