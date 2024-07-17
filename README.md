# WYJScrapper

This project is a scraper for Weekly Young Jump. It allows you to automatically retrieve the series Renai (rip), OnK, Uma Musume: Cinderella Gray on your Young Jump account and save them in a local folder.

## Prerequisites

- Node.js version 18 or higher

### Installing Node.js 18

<details>
  <summary>Windows</summary>

  ### Installation on Windows
  1. Go to the official Node.js website [nodejs.org](https://nodejs.org/).
  2. Download the installer for Windows (version 18.x.x LTS).
  3. Run the installer and follow the on-screen instructions.
  4. Verify the installation by opening a command prompt and typing:
     ```bash
     node -v
     ```
     You should see version 18.x.x displayed.
</details>

<details>
  <summary>macOS</summary>

  ### Installation on macOS
  1. Go to the official Node.js website [nodejs.org](https://nodejs.org/).
  2. Download the installer for macOS (version 18.x.x LTS).
  3. Run the installer and follow the on-screen instructions.
  4. Verify the installation by opening the terminal and typing:
     ```bash
     node -v
     ```
     You should see version 18.x.x displayed.
</details>

<details>
  <summary>Linux</summary>

  ### Installation on Linux

  For Debian and Ubuntu-based distributions:

  1. Open a terminal and run the following commands:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
  2. Verify the installation by typing:
     ```bash
     node -v
     ```
     You should see version 18.x.x displayed.

  For Red Hat and CentOS-based distributions:

  1. Open a terminal and run the following commands:
     ```bash
     curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
     sudo yum install -y nodejs
     ```
  2. Verify the installation by typing:
     ```bash
     node -v
     ```
     You should see version 18.x.x displayed.
</details>

## Installation

1. Clone this repository to your local machine.
   ```bash
   git clone https://github.com/SeanR-ScanR/WYJS.git
   ```
2. Navigate to the project directory.
   ```bash
   cd WYJS
   ```
3. Install the necessary dependencies with npm.
   ```bash
   npm install
   ```

## Usage

1. Start the scraper.
   ```bash
   npm start
   ```
2. During execution, you will be prompted to enter your Young Jump account email and password.

3. The scraper will then retrieve the series and save them in the `series` folder.
