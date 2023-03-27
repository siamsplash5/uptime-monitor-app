# uptime-monitor-app

A uptime monitor app which will notify the user about the status of websites (It's currently up or down) and can send the update as a SMS to user's phone number.
I've did this project by watching "Learn with Sumit" youtube channel for my practice purpose and to clear the core concept of raw Node.js.

Key functionalites:

1. User can Log In/Sign Up with his phone number.
2. User can do CRUD operation on his personal data.
3. User will receive a token after log in, which will be used for authentication in CRUD operation. Token will expire after 1hour. Then user have to log in again.
4. User can add website for monitoring. (Maximum allowed 5)
5. User will receive the current status (up or down) of the websites.
6. User can receive SMS on his phone number about the status update. I've used Twilio for this feature (SMS charge applicable).
7. For database, I used my PC's file system as a database. This is not a suitable option for real life but I did for learning purpose and to clear the raw node.js concept.

There is no front end. I've future plan to add a front-end to eat to make it practical. I'll update it as soon as I complete React.js.
