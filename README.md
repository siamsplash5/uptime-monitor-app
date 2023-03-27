# Uptime Monitor App

The Uptime Monitor App is a Node.js application that monitors the status of up to 5 websites, and sends notifications to users about the current status (up or down) of the websites. Users can receive notifications via SMS, and can log in/sign up to manage their personal data.

## Key Features:

* User authentication: Users can sign up and log in to the application using their phone numbers, and receive authentication tokens for secure access to CRUD operations on their personal data.
* CRUD Operations: Users can create, read, update, and delete their personal data, including the websites they want to monitor.
* Website monitoring: Users can add up to 5 websites for monitoring, and receive notifications about their current status (up or down).
* SMS Notifications: Users can receive SMS notifications about the status of their monitored websites, using the Twilio API.
* Database: The application uses the local file system on the user's computer as a database, for learning purposes only.

Note: This application currently does not have a front-end interface, but plans to implement a front-end using React.js are underway.

## Getting Started:

To get started with the Uptime Monitor App:

1. Clone this repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Set up a Twilio account to enable SMS notifications.
4. Start the application by running `npm start`.

## Contributing:

If you have suggestions for improving the Uptime Monitor App, feel free to submit a pull request or open an issue. We welcome contributions from the community!

## License:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
