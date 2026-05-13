import subprocess
import sys

from tools import color_text, read_version_from_package_json


def get_current_branch():
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Error getting current git branch: {e}\n", "31"))
        return None


def check_branch(expected_branch):
    current_branch = get_current_branch()
    if current_branch is None:
        return False
    if current_branch != expected_branch:
        print(color_text(f"❌  Current branch is '{current_branch}', but expected '{expected_branch}'\n", "31"))
        return False
    print(color_text(f"✅  On expected branch '{expected_branch}'\n", "32"))
    return True


def check_clean_worktree(expected_branch):
    try:
        # Check unstaged changes
        subprocess.run(
            ["git", "diff-index", "--quiet", "HEAD", "--"],
            check=True
        )
        # Check staged but uncommitted changes
        subprocess.run(
            ["git", "diff", "--cached", "--quiet"],
            check=True
        )

        local_sha = subprocess.check_output(["git", "rev-parse", "HEAD"]).strip().decode()
        remote_sha = subprocess.check_output(["git", "rev-parse", f"origin/{expected_branch}"]).strip().decode()

        if local_sha != remote_sha:
            print(color_text(
                f"❌  You have commits not pushed to origin/{expected_branch}. Please push before running this script.\n",
                "31"
            ))
            return False

        print(color_text("✅  Working directory is clean and up-to-date with origin.\n", "32"))
        return True

    except subprocess.CalledProcessError:
        print(color_text(
            "❌  You have uncommitted changes in your working directory. Commit or stash them before proceeding.\n",
            "31"))
        return False
    except Exception as e:
        print(color_text(f"❌  Error while checking remote sync: {e}\n", "31"))
        return False


def get_last_tag_commit():
    try:
        result = subprocess.run(
            ["git", "rev-list", "-n", "1", "--tags", "--skip=0"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Unable to get last tagged commit SHA: {e}\n", "31"))
        sys.exit(1)


def nx_push_to_origin(projects):
    project_str = " and ".join(projects).upper()
    commit_message = f"NEW BUILD for {project_str}: Update build artifacts"
    try:
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push"], check=True)

        for project in projects: 
            version = read_version_from_package_json(project)
            subprocess.run(["git", "tag", f"v{version}-{project}-BETA"], check=True)

        subprocess.run(["git", "push", "--tags"], check=True)
        print(color_text("✅  Changes and tags pushed to origin.\n", "32"))
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Failed to push changes or tags: {e}\n", "31"))
        sys.exit(1)


def get_commit_for_tag(tag):
    try:
        result = subprocess.run(
            ["git", "rev-list", "-n", "1", tag],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None


def get_tags_on_head():
    try:
        result = subprocess.run(
            ["git", "tag", "--points-at", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        tags = result.stdout.strip().splitlines()
        return tags
    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Failed to get tags on HEAD: {e}", "31"))
        sys.exit(1)


def ask_and_check_working_branch():
    branch = input("🔀  What is your working branch? ").strip()
    if not branch:
        print(color_text("❌  No branch name provided.\n", "31"))
        sys.exit(1)

    try:
        subprocess.run(
            ["git", "rev-parse", "--verify", branch],
            capture_output=True,
            text=True,
            check=True
        )
        print(color_text(f"✅  Branch '{branch}' exists in this repository.\n", "32"))
        return branch
    except subprocess.CalledProcessError:
        print(color_text(f"❌  Branch '{branch}' does not exist in this repository.\n", "31"))
        sys.exit(1)

def cherry_pick_last_staging_commit(working_branch, staging_branch="staging"):
    try:
        last_commit = subprocess.check_output(
            ["git", "rev-parse", f"{staging_branch}"],
            text=True
        ).strip()

        print(color_text(f"🔀  Switching to branch '{working_branch}'...\n", "34"))
        subprocess.run(["git", "checkout", working_branch], check=True)

        print(color_text(f"🍒  Cherry-picking commit {last_commit} from {staging_branch}...\n", "34"))
        subprocess.run(["git", "cherry-pick", "-X", "theirs", last_commit], check=True)

        subprocess.run(["git", "commit", "--amend", "-m", "Added by nx deployment"], check=True)

        # Vérifie si la branche a un upstream
        upstream_check = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        print(color_text(f"📤  Pushing branch '{working_branch}'...\n", "34"))
        if upstream_check.returncode != 0:
            print(color_text(f"⚠️  No upstream detected. Setting upstream to 'origin/{working_branch}'...\n", "33"))
            subprocess.run(["git", "push", "--set-upstream", "origin", working_branch], check=True)
        else:
            subprocess.run(["git", "push"], check=True)

        print(color_text(f"🔙  Switching back to '{staging_branch}'...\n", "34"))
        subprocess.run(["git", "checkout", staging_branch], check=True)

        print(color_text("✅  Cherry-pick and push completed successfully!\n", "32"))

    except subprocess.CalledProcessError as e:
        print(color_text(f"❌  Failed during cherry-pick process: {e}\n", "31"))
        print(color_text("ℹ️  Make sure your local branch exists and is correctly tracking the remote branch.\n", "33"))
        sys.exit(1)
