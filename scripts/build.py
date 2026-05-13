import subprocess
import sys

from git_utils import get_tags_on_head, check_branch, get_commit_for_tag, check_clean_worktree
from tools import color_text

EXPECTED_BRANCH = "staging"


def push_image_to_registry():
    print(color_text("\n🚨  IMPORTANT WARNING 🚨\n", "31"))
    print(color_text("This method BYPASSES the NX system.", "31"))
    print(color_text("It should ONLY be used when there are deployment issues and NX is blocking the process.\n", "31"))

    print(color_text("⚠️  Versions must match an existing Git tag on the 'staging' branch.\n", "33"))

    if not check_branch(EXPECTED_BRANCH) or not check_clean_worktree(EXPECTED_BRANCH):
        sys.exit(1)

    front_end_version = input(
        color_text("➡️  Enter Skeelz version (Git tag, leave empty to skip): ", "36")).strip() or None

    if not front_end_version:
        print(color_text("\n❌  No version provided. Aborting.\n", "31"))
        sys.exit(0)

    front_end_commit = get_commit_for_tag(front_end_version) if front_end_version else None

    if front_end_version and not front_end_commit:
        print(color_text(f"\n❌  Front-end tag '{front_end_version}' not found.\n", "31"))
        sys.exit(1)

    if front_end_version:
        print(color_text(f"✅  Front-end tag: {front_end_version} ({front_end_commit})\n", "32"))

    current_commit = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()

    try:
        if front_end_version:
            print(color_text(f"📦  Checkout Front-end commit {front_end_commit}...\n", "33"))
            subprocess.run(["git", "checkout", front_end_commit], check=True)
            run_make("build-front-end", version=front_end_version)
            run_make("push-front-end", version=front_end_version)
    finally:
        subprocess.run(["git", "checkout", "staging"], check=True)
        print(color_text("\n🔙  Back to the original commit.\n", "34"))


def run_make(target, version=None, version_front_end=None):
    cmd_exec = ["make", target]
    if target in ["build-all", "push-all"]:
        if version:
            cmd_exec.append(f"VERSION={version}")
        else:
            print(color_text(f"⚠️  No version provided for target '{target}'. Skipping.", "33"))
            sys.exit(1)
        if version_front_end:
            cmd_exec.append(f"VERSION_FRONT_END={version_front_end}")
        else:
            print(color_text(f"⚠️  No version_front_end provided for target '{target}'. Skipping.", "33"))
            sys.exit(1)
    elif version:
        cmd_exec.append(f"VERSION={version}")
    try:
        subprocess.run(cmd_exec, check=True)
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Make failed for target '{target}': {e}", "31"))
        sys.exit(1)


def main():
    tags = get_tags_on_head()

    if not tags:
        print(color_text("⚠️  No tags found on HEAD.", "33"))
        sys.exit(1)

    print(color_text(f"🏷️ Tags found on HEAD: {', '.join(tags)}\n", "34"))
    
    version_front_end = None

    for tag in tags:
        if tag.endswith("-BETA"):
            base_version = tag.split("-BETA")[0]
            version_front_end = base_version + "-BETA"

    if version_front_end:
        print(color_text(f"🚧  Building Front-end only (version {version_front_end})...\n", "36"))
        run_make("build-front-end", version_front_end)
        run_make("push-front-end", version_front_end)
    else:
        print(color_text("⚠️  No recognized project found in tags. Skipping build/push.\n", "33"))
        sys.exit(1)
    print()
    print(color_text("✅  Build and push completed successfully.\n", "32"))
    print(color_text("📦 Images have been pushed to the registry.\n", "36"))
    print(color_text("🚀 Now run your Terraform deployment to deploy to staging.\n", "35"))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]

        if cmd == "push_image_to_registry":
            push_image_to_registry()
        else:
            print(f"Unknown command: {cmd}")
            sys.exit(1)
    else:
        main()
