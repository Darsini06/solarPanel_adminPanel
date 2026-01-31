"""
Merge Sort Algorithm Implementation for Report Comparison
Time Complexity: O(n log n) - Best, Average, and Worst Case
Space Complexity: O(n)
"""

from typing import List, Dict, Any, Callable
from datetime import datetime


def merge_sort(arr: List[Dict[str, Any]], key: str, reverse: bool = False) -> List[Dict[str, Any]]:
    """
    Sorts an array of dictionaries using merge sort algorithm.
    
    Args:
        arr: List of dictionaries to sort
        key: The key to sort by
        reverse: If True, sort in descending order
    
    Returns:
        Sorted list of dictionaries
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], key, reverse)
    right = merge_sort(arr[mid:], key, reverse)
    
    # Conquer (Merge)
    return merge(left, right, key, reverse)


def merge(left: List[Dict[str, Any]], right: List[Dict[str, Any]], key: str, reverse: bool) -> List[Dict[str, Any]]:
    """
    Merges two sorted arrays into one sorted array.
    
    Args:
        left: Left sorted array
        right: Right sorted array
        key: The key to compare
        reverse: If True, sort in descending order
    
    Returns:
        Merged sorted array
    """
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        left_val = get_comparable_value(left[i], key)
        right_val = get_comparable_value(right[j], key)
        
        if reverse:
            if left_val >= right_val:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        else:
            if left_val <= right_val:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
    
    # Append remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result


def get_comparable_value(item: Dict[str, Any], key: str) -> Any:
    """
    Extracts a comparable value from a dictionary item.
    Handles nested keys and datetime conversions.
    
    Args:
        item: Dictionary item
        key: Key to extract (supports dot notation for nested keys)
    
    Returns:
        Comparable value
    """
    # Handle nested keys (e.g., "uploaded_by.user_name")
    keys = key.split('.')
    value = item
    
    for k in keys:
        if isinstance(value, dict):
            value = value.get(k)
        else:
            return None
    
    # Convert datetime strings to datetime objects for proper comparison
    if isinstance(value, str):
        try:
            # Try to parse as ISO datetime
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        except:
            # If not a datetime, return as is (for string comparison)
            return value.lower() if isinstance(value, str) else value
    
    return value if value is not None else ""


def merge_sort_multiple_keys(arr: List[Dict[str, Any]], keys: List[tuple]) -> List[Dict[str, Any]]:
    """
    Sorts an array by multiple keys in order of priority.
    
    Args:
        arr: List of dictionaries to sort
        keys: List of tuples (key, reverse) where key is the field name and reverse is boolean
    
    Returns:
        Sorted list of dictionaries
    
    Example:
        merge_sort_multiple_keys(reports, [("uploaded_at", True), ("filename", False)])
        # Sorts by uploaded_at descending, then by filename ascending
    """
    if not arr or not keys:
        return arr
    
    # Sort by keys in reverse order (last key first, first key last)
    # This ensures the primary key has the final say
    result = arr.copy()
    for key, reverse in reversed(keys):
        result = merge_sort(result, key, reverse)
    
    return result


def compare_reports(report1: Dict[str, Any], report2: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares two reports and returns a comparison result.
    
    Args:
        report1: First report dictionary
        report2: Second report dictionary
    
    Returns:
        Dictionary containing comparison details
    """
    comparison = {
        "report1": {
            "pdf_id": report1.get("pdf_id"),
            "filename": report1.get("filename"),
            "file_size": report1.get("file_size", 0),
            "uploaded_at": report1.get("uploaded_at"),
            "uploaded_by": report1.get("uploaded_by", {}).get("user_name", "Unknown")
        },
        "report2": {
            "pdf_id": report2.get("pdf_id"),
            "filename": report2.get("filename"),
            "file_size": report2.get("file_size", 0),
            "uploaded_at": report2.get("uploaded_at"),
            "uploaded_by": report2.get("uploaded_by", {}).get("user_name", "Unknown")
        },
        "differences": {
            "size_difference": abs(report1.get("file_size", 0) - report2.get("file_size", 0)),
            "time_difference": calculate_time_difference(
                report1.get("uploaded_at"),
                report2.get("uploaded_at")
            ),
            "same_uploader": (
                report1.get("uploaded_by", {}).get("user_email") == 
                report2.get("uploaded_by", {}).get("user_email")
            )
        }
    }
    
    return comparison


def calculate_time_difference(time1: str, time2: str) -> str:
    """
    Calculates the time difference between two datetime strings.
    
    Args:
        time1: First datetime string
        time2: Second datetime string
    
    Returns:
        Human-readable time difference string
    """
    try:
        dt1 = datetime.fromisoformat(time1.replace('Z', '+00:00'))
        dt2 = datetime.fromisoformat(time2.replace('Z', '+00:00'))
        
        diff = abs((dt1 - dt2).total_seconds())
        
        if diff < 60:
            return f"{int(diff)} seconds"
        elif diff < 3600:
            return f"{int(diff / 60)} minutes"
        elif diff < 86400:
            return f"{int(diff / 3600)} hours"
        else:
            return f"{int(diff / 86400)} days"
    except:
        return "Unknown"
