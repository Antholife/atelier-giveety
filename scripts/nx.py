import os
import subprocess
import sys

from git_utils import check_branch, check_clean_worktree, get_last_tag_commit, nx_push_to_origin, \
    ask_and_check_working_branch, cherry_pick_last_staging_commit
from tools import color_text, read_version_from_package_json

EXPECTED_BRANCH = "staging"


def get_affected_apps():
    last_tagged_commit = get_last_tag_commit()
    try:
        result = subprocess.run(
            ["npx", "nx", "show", "projects", "--affected", f"--base={last_tagged_commit}", "--head=HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip().split("\n")
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Error while running 'nx show projects --affected': {e}\n", "31"))
        sys.exit(2)


def version_to_semver(projects_arg, dry_run=True):
    cmd = [
        "npx", "nx", "release", "version",
        "--projects", projects_arg
    ]

    if dry_run:
        cmd.append("--dry-run")

    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print("❌  Versioning failed:", e)
        return {}


def changelog_to_semver(project, version, last_tagged_commit, skip_commit=True):
    env = os.environ.copy()
    env["EDITOR"] = "kate"
    subprocess.run([
        "npx", "nx", "release", "changelog", version,
        "-i", "projects",
        "--projects", project,
        "--from", last_tagged_commit,
        "--to", "HEAD",
    ], check=True, env=env)


def run_nx_release_for_projects(projects, dry_run=True):
    try:
        last_tagged_commit = get_last_tag_commit()

        projects_arg = ",".join(projects)
        print(color_text(f"\n{'Simulating' if dry_run else 'Running'} changes for projects: {projects_arg}\n", "36"))
        version_to_semver(projects_arg, dry_run)

        input(
            "\n\033[1;36mℹ️  Review your selection one last time — you can confirm or adjust it below. Press Enter to proceed...\033[0m")

        version_to_semver(projects_arg, False)

        for project in projects:
            version = read_version_from_package_json(project)
            print(color_text(f"📦  Updating version for {project} to {version}\n", "36"))
            changelog_to_semver(project, version, last_tagged_commit)
            print(color_text(f"✅  Changelog for {project} updated successfully.\n", "32"))

    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  nx release failed: {e}\n", "31"))
        sys.exit(1)


def main():
    if not check_branch(EXPECTED_BRANCH) or not check_clean_worktree(EXPECTED_BRANCH):
        sys.exit(1)
    working_branch = ask_and_check_working_branch()
    confirm = input("⚠️  Warn: Did you merge your working branch into staging? (yes/no): ").strip().lower()
    if confirm not in ["yes", "y"]:
        print(color_text("❌  Please merge your working branch into staging before running this script.\n", "31"))
        sys.exit(1)

    affected = get_affected_apps()

    projects_to_release = [p for p in ["front-end"] if p in affected]

    if projects_to_release:
        print(color_text("🚀  Projects with detected changes:", "34"))
        for p in projects_to_release:
            print(color_text(f"   • {p}", "36"))
    else:
        print(color_text("✅  No changes detected in front-end, skipping deploy.\n", "32"))
        print(color_text("ℹ️ No affected projects detected for deploy.\n", "33"))
        sys.exit(1)

    run_nx_release_for_projects(projects_to_release, dry_run=True)
    nx_push_to_origin(projects_to_release)
    cherry_pick_last_staging_commit(working_branch)
    print(color_text("\n✅  NX deployment completed successfully!\n", "32"))
    sys.exit(0)


if __name__ == "__main__":
    main()
