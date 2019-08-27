# DayZ Player Leaderboard Bot

A bot that uses FTP connection to generate and display a leaderboard to a discord server using the DayZ Mod [@Intenz-Leaderboard](https://steamcommunity.com/sharedfiles/filedetails/?id=1758815806)


### Instructions

- Create settings.json file with the following format
    ```
    {
      "token": "< BOT TOKEN HERE >",
      "serverProfilePath": "<SERVER PROFILE NAME>/Leaderboard/",
      "ftpHost": "< FTP HOST NAME HERE >",
      "ftpPort": 21,
      "ftpUser": "< FTP USER NAME HERE >",
      "ftpPass": "< FTP USER PASS HERE >"
    }
    ```
    - token is your discord bot token
    - serverProfilePath is the folder name of your server profile
    - ftpHost is the FTP Host NAME
    - ftpPort is the FTP port, default is 21
    - ftpUser is the username for the FTP server
    - ftpPAss is the password for the FTP server username
- Get and install [Node.js](https://nodejs.org/en/download/)
- run `npm i` to install node packages
- Start bot with `npm start`


## Discord Commands
`!leaderboard`: Displays the leaderboard

## Error reporting
tbd
