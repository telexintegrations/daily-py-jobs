# Daily Python Jobs

Daily Python Jobs is an integration that sends the latest Python job postings every day. This project uses Node.js, Express, and TypeScript to fetch job postings from an external API and send them to telex channels.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Fetches the latest Python job postings from an external API.
- Filters job postings based on user-defined settings.
- Sends job postings to a specified URL.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/iConnell/daily-python-jobs.git
    cd daily-python-jobs
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

4. Run the development server:

    ```sh
    npm run dev
    ```

## Usage

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```sh
CORESIGNAL_API_SEARCH_URL=<coresignal-api-search-url>
CORESIGNAL_API_COLLECTION_URL=<coresignal-api-collection-url>
CORESIGNAL_API_KEY=<your-coresignal-api-key>
```

## API Endpoints

### POST `/jobs`

Handles incoming webhook requests and processes job postings based on the provided settings.

**Sample Request:**

```json
{
  "return_url": "https://return.url",
  "settings": [
    {
      "label": "interval",
      "type": "text",
      "required": true,
      "default": "* * * * *"
    },
    {
      "label": "Location",
      "type": "dropdown",
      "required": false,
      "default": "All Locations",
      "options": ["All Locations", "Remote", "On-site"]
    },
    {
      "label": "Experience Level",
      "type": "dropdown",
      "required": false,
      "default": "All Levels",
      "options": ["All Levels", "Entry", "Associate", "Mid", "Senior"]
    },
    {
      "label": "Employment Type",
      "type": "dropdown",
      "required": false,
      "default": "All Types",
      "options": ["All Types", "Full-time", "Part-time", "Contract"]
    },
    {
      "label": "Preferred Framework",
      "type": "dropdown",
      "required": true,
      "default": "All Frameworks",
      "options": ["All Frameworks", "Django", "Flask", "Fastapi"]
    }
  ]
}
```

**Sample Response:**

```json
{
  "status": "accepted"
}
```

### GET `/telex-config`

Returns the configuration data for the integration.

**Sample Response:**

```json
{
  "data": {
    "date": {
      "created_at": "2025-02-20",
      "updated_at": "2025-02-20"
    },
    "descriptions": {
      "app_name": "Daily Python Jobs",
      "app_description": "This integration sends the latest python jobs everyday",
      "app_logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1280px-Python-logo-notext.svg.png",
      "app_url": "https://daily-py-jobs-cf03a679f137.herokuapp.com/",
      "background_color": "#fff"
    },
    "integration_category": "Task Automation",
    "is_active": true,
    "integration_type": "interval",
    "key_features": ["Python Jobs Everyday"],
    "author": "iConnell",
    "settings": [
      {
        "label": "interval",
        "type": "text",
        "required": true,
        "default": "0 9 * * *"
      },
      {
        "label": "Location",
        "type": "dropdown",
        "required": false,
        "default": "All Locations",
        "options": ["All Locations", "Remote", "On-site"]
      },
      {
        "label": "Experience Level",
        "type": "dropdown",
        "required": false,
        "default": "All Levels",
        "options": ["All Levels", "Entry", "Associate", "Mid", "Senior"]
      },
      {
        "label": "Employment Type",
        "type": "dropdown",
        "required": false,
        "default": "All Types",
        "options": ["All Types", "Full-time", "Part-time", "Contract"]
      },
      {
        "label": "Preferred Framework",
        "type": "dropdown",
        "required": true,
        "default": "All Frameworks",
        "options": ["All Frameworks", "Django", "Flask", "Fastapi"]
      }
    ],
    "target_url": "https://target.url",
    "tick_url": "https://daily-py-jobs-cf03a679f137.herokuapp.com/jobs"
  }
}
```

## Testing

To run the tests, use the following command:

```sh
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.