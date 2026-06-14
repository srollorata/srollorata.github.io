import json
import os
from datetime import datetime
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric,
)

def main():
    # Load credentials from environment variable
    credentials_json = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_DATA")
    property_id = os.environ.get("GA4_PROPERTY_ID")

    if not credentials_json or not property_id:
        raise ValueError("Missing GOOGLE_APPLICATION_CREDENTIALS_DATA or GA4_PROPERTY_ID")

    # Write credentials to a temp file for the client library
    creds_path = "/tmp/ga_credentials.json"
    with open(creds_path, "w") as f:
        f.write(credentials_json)

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

    # Initialize the client
    client = BetaAnalyticsDataClient()

    # Fetch total unique users (all-time)
    request = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[
            DateRange(start_date="2020-01-01", end_date="today")
        ],
        metrics=[
            Metric(name="totalUsers"),
        ],
    )

    response = client.run_report(request)

    # Extract the total unique users count
    total_users = 0
    if response.rows:
        total_users = int(response.rows[0].metric_values[0].value)

    # Build the stats object
    stats = {
        "totalUniqueVisitors": total_users,
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
    }

    # Write to data/stats.json
    os.makedirs("data", exist_ok=True)
    with open("data/stats.json", "w") as f:
        json.dump(stats, f, indent=2)

    print(f"✅ Updated stats.json: {total_users} unique visitors")

if __name__ == "__main__":
    main()