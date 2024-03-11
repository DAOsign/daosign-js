# DAOsign CLI
This CLI tool is designed to interact with DAOsign proof system.

## Installation
To install, follow these steps:

Install DAOsign CLI package to your local machine:
`npm install @daosign/cli -g`
 or

1. Clone the repository to your local machine:
`git clone https://github.com/DAOsign/daosign.git`
2. Install dependencies:
`npm install`


## Usage
After installation, you can run the tool from "src" folder using the following command:
`ts-node index.ts [options]`
or install tool as an executable:
`npm link`
and run it with
`daosign [options]`

## Options
List of available options:

- `verify <path_to_certificate>`: Verifies the validity of DAOsign certificate.


## Example
Example usage:
`daosign verify /path/to/certificate.pdf`
