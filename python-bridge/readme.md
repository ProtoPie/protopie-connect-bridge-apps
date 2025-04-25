# ProtoPie Connect Bridge App for Python

A Python-based program to interact with ProtoPie Connect via Socket.IO messages. This allows you to send messages from your Python script to ProtoPie and receive messages sent from ProtoPie.

Requires Python 3.8 or newer.

## Setup

It is highly recommended to use a Python virtual environment to manage dependencies.

1.  **Create and activate a virtual environment (Optional but recommended):**
    ```bash
    # Create environment (only needed once)
    python -m venv venv

    # Activate environment (do this every time you work on the project)
    # On Linux/macOS:
    source venv/bin/activate
    # On Windows (Command Prompt/PowerShell):
    # venv\Scripts\activate
    ```

2.  **Install dependencies:**
    Navigate to this directory (`python-bridge`) in your terminal and run:
    ```bash
    pip install -r requirements.txt
    ```

## How to Run

1.  Ensure ProtoPie Connect is running and listening (usually at `http://localhost:9981`).
2.  Run the client script from this directory:
    ```bash
    python client.py
    ```
3.  The script will connect to ProtoPie Connect.
4.  You can send messages to ProtoPie Connect by typing a `messageId` and `value` when prompted in the terminal.
5.  Messages received from ProtoPie Connect (via the "Send to Bridge App" response) will be printed in the terminal.