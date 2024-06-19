# WYJScrapper

Ce projet est un scrapper pour le Weekly Young Jump. Il permet de récupérer automatiquement les séries Renai (rip), OnK, Uma Musume: Cinderella Gray sur votre compte Young Jump et de les enregistrer dans un dossier local.

## Prérequis

- Node.js version 18 ou supérieure

### Installation de Node.js 18

<details>
  <summary>Windows</summary>

  ### Installation sur Windows
  1. Allez sur le site officiel de Node.js [nodejs.org](https://nodejs.org/).
  2. Téléchargez l'installateur pour Windows (version 18.x.x LTS).
  3. Exécutez l'installateur et suivez les instructions à l'écran.
  4. Vérifiez l'installation en ouvrant une invite de commandes et en tapant :
     ```bash
     node -v
     ```
     Vous devriez voir la version 18.x.x s'afficher.
</details>

<details>
  <summary>macOS</summary>

  ### Installation sur macOS
  1. Allez sur le site officiel de Node.js [nodejs.org](https://nodejs.org/).
  2. Téléchargez l'installateur pour macOS (version 18.x.x LTS).
  3. Exécutez l'installateur et suivez les instructions à l'écran.
  4. Vérifiez l'installation en ouvrant le terminal et en tapant :
     ```bash
     node -v
     ```
     Vous devriez voir la version 18.x.x s'afficher.
</details>

<details>
  <summary>Linux</summary>

  ### Installation sur Linux

  Pour les distributions basées sur Debian et Ubuntu :

  1. Ouvrez un terminal et exécutez les commandes suivantes :
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
  2. Vérifiez l'installation en tapant :
     ```bash
     node -v
     ```
     Vous devriez voir la version 18.x.x s'afficher.

  Pour les distributions basées sur Red Hat et CentOS :

  1. Ouvrez un terminal et exécutez les commandes suivantes :
     ```bash
     curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
     sudo yum install -y nodejs
     ```
  2. Vérifiez l'installation en tapant :
     ```bash
     node -v
     ```
     Vous devriez voir la version 18.x.x s'afficher.
</details>

## Installation

1. Clonez ce dépôt sur votre machine locale.
   ```bash
   git clone https://github.com/SeanR-ScanR/WYJS.git
   ```
2. Naviguez dans le répertoire du projet.
   ```bash
   cd WYJS
   ```
3. Installez les dépendances nécessaires avec npm.
   ```bash
   npm install
   ```

## Utilisation

1. Démarrez le scrapper.
   ```bash
   npm start
   ```
2. Lors de l'exécution, vous serez invité à entrer votre email et mot de passe du compte Young Jump.

3. Le scrapper récupérera alors les séries disponibles sur votre compte et les enregistrera dans le dossier `séries`.
