import argparse
import json
import logging
import subprocess
import time
import urllib.request

logging.basicConfig(level="INFO", format="%(asctime)s - %(levelname)s - %(message)s")


PRIVATE_KEY = "0xece937b5a5f1df41ba6a550e212492ee98573d3799d0035aa20c29674cd0ceff"
ACCOUNT_ADDRESS = "0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30"
PROFILE_NAME = "local"

PLAYER2_PRIVATE_KEY = (
    "0xece937b5a5f1df41ba6a550e212492ee98573d3799d0035aa20c29674cd0cefd"
)
PLAYER2_ADDRESS = "0xaf769425b319270f91768e8910ed4cde16c4cea32751062c9ab3f2b21adc27b4"
PLAYER2_PROFILE_NAME = "player2"

COLLECTION_MODULE = "nyc_collection"
TOKEN_MODULE = "nyc_token"


DEFAULT_SUBPROCESS_KWARGS = {
    "check": True,
    "universal_newlines": True,
    "cwd": "move/",
}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--debug", action="store_true")
    parser.add_argument(
        "-f", "--force-restart", action="store_true", help="Start afresh"
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Set flags that make this work offline, assuming the deps are present",
    )
    parser.add_argument("--aptos-cli-path", default="aptos")
    args = parser.parse_args()
    return args


def main():
    args = parse_args()

    if args.debug:
        logging.setLevel("DEBUG")

    # Kill any existing localnet.
    kill_process_at_port(8080)

    # Run the localnet.
    cmd = [args.aptos_cli_path, "node", "run-localnet", "--with-indexer-api"]
    if args.force_restart:
        cmd += ["--force-restart", "--assume-yes"]
    local_testnet_handle = subprocess.Popen(cmd)

    # Wait for the localnet to start.
    print("[Local] Waiting for localnet to start up...")
    while True:
        # Hit the ready server.
        logging.debug("Checking if localnet up")
        try:
            response = urllib.request.urlopen("http://127.0.0.1:8070")
            if response.status == 200:
                break
        except:
            if local_testnet_handle.poll():
                print("[Local] Localnet crashed on startup, exiting...")
                return
        time.sleep(0.25)
    print("[Local] Localnet came up!")

    if args.force_restart:
        fresh_start(args)

    # Sit here while the localnet runs.
    print("[Local] Setup complete, localnet is ready and running")

    try:
        local_testnet_handle.wait()
    except KeyboardInterrupt:
        print("[Local] Received ctrl-c, shutting down localnet")
        # No need to send another signal, the localnet receives ctrl-c the first
        # time.
        local_testnet_handle.wait()
        print("[Local] Localnet shut down")

    print("[Local] Done, goodbye!")


# Called when --force-restart is used.
def fresh_start(args):
    # Create an account.
    subprocess.run(
        [
            args.aptos_cli_path,
            "init",
            "--network",
            "local",
            "--private-key",
            # Use a predefined private key so the rest of the steps / tech stack
            # can use a predefined account address.
            PRIVATE_KEY,
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    print("[Local] Created account on localnet")

    move_cmd_extra = []
    if args.offline:
        move_cmd_extra.append("--skip-fetch-latest-git-deps")

    # Publish the Move module.
    subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "publish",
            "--named-addresses",
            "addr=local",
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
        ]
        + move_cmd_extra,
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    print("[Local] Published the Local Move module")

    # Create an account for player 2.
    subprocess.run(
        [
            args.aptos_cli_path,
            "init",
            "--network",
            "local",
            "--private-key",
            # Use a predefined private key so the rest of the steps / tech stack
            # can use a predefined account address.
            PLAYER2_PRIVATE_KEY,
            "--assume-yes",
            "--profile",
            PLAYER2_PROFILE_NAME,
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    print("[Local] Created account for player 2 on localnet")

    # Create the collection.
    result = subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "run",
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
            "--function-id",
            f"{ACCOUNT_ADDRESS}::{COLLECTION_MODULE}::create",
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
        capture_output=True,
    )

    # Get the txn hash of the txn we just submitted.
    txn_hash = json.loads(result.stdout)["Result"]["transaction_hash"]

    # Get the data of the txn we just submitted.
    response = urllib.request.urlopen(
        f"http://127.0.0.1:8080/v1/transactions/by_hash/{txn_hash}"
    )
    data = json.loads(response.read().decode("utf-8"))

    # Get and print the address of the collection we just created.
    for change in data["changes"]:
        if change["data"].get("type") == "0x4::collection::Collection":
            collection_address = change["address"]
            break
    print(f"[Local] Created collection at {collection_address}")

    # Set some art data.
    subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "run",
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
            "--function-id",
            f"{ACCOUNT_ADDRESS}::{COLLECTION_MODULE}::set_art_data",
            "--args",
            "string:pieceid1",
            "string:tokenname1",
            "string:tokendescription1",
            "string:tokenuri1",
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "run",
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
            "--function-id",
            f"{ACCOUNT_ADDRESS}::{COLLECTION_MODULE}::set_art_data",
            "--args",
            "string:pieceid2",
            "string:tokenname2",
            "string:tokendescription2",
            "string:tokenuri2",
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )

    print(f"[Local] Set art data for piece ID pieceid1")

    # Mint pieceid1 as player 1.
    subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "run",
            "--assume-yes",
            "--profile",
            PROFILE_NAME,
            "--function-id",
            f"{ACCOUNT_ADDRESS}::{TOKEN_MODULE}::mint",
            "--args",
            "string:pieceid1",
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    print(f"[Local] Minted piece with pieceid1 token as player 1")

    # Mint pieceid2 as player 2.
    subprocess.run(
        [
            args.aptos_cli_path,
            "move",
            "run",
            "--assume-yes",
            "--profile",
            PLAYER2_PROFILE_NAME,
            "--function-id",
            f"{ACCOUNT_ADDRESS}::{TOKEN_MODULE}::mint",
            "--args",
            "string:pieceid2",
        ],
        **DEFAULT_SUBPROCESS_KWARGS,
    )
    print(f"[Local] Minted piece with pieceid2 token as player 2")


# Kill the process running at the given port.
def kill_process_at_port(port: int):
    out = subprocess.run(
        ["lsof", "-i", f":{port}"], capture_output=True, universal_newlines=True
    )
    pid = None
    for line in out.stdout.splitlines():
        if line.startswith("aptos"):
            pid = line.split()[1]
    if pid:
        subprocess.run(["kill", pid])
        print(f"[Local] Killed existing process occupying port {port} with PID {pid}")


if __name__ == "__main__":
    main()
