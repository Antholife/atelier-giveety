import json
import os
import platform
import subprocess
import sys


def color_text(text, color_code):
    return f"\033[{color_code}m{text}\033[0m"


def is_admin(os_type):
    if os_type in ("Linux", "macOS"):
        return os.geteuid() == 0
    elif os_type == "Windows":
        try:
            import ctypes
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        except Exception:
            return False
    else:
        return False


def read_version_from_package_json(project_name):
    path = f"apps/{project_name}/package.json"
    if not os.path.exists(path):
        print(color_text(f"⚠️  package.json not found for {project_name} at {path}", "33"))
        raise FileNotFoundError(f"package.json not found for {project_name}")
    with open(path, "r") as f:
        data = json.load(f)
    version = data.get("version")
    if not version:
        print(color_text(f"❌  Version not found or empty in {path}", "31"))
        sys.exit(1)
    return version


def update_windows_path_env():
    cmd = [
        "powershell",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "[System.Environment]::GetEnvironmentVariable('Path', 'Machine')"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            system_path = result.stdout.strip()
            os.environ["PATH"] = system_path
            print("🔄 PATH environment variable updated in current Python process.")
            return True
        else:
            print("❌ Failed to get system PATH from PowerShell.")
            return False
    except Exception as e:
        print(f"❌ Exception when updating PATH: {e}")
        return False


def get_os():
    system = platform.system().lower()
    if system == "darwin":
        return "macOS"
    elif system == "linux":
        return "Linux"
    elif system == "windows":
        return "Windows"
    else:
        return "unknown"
