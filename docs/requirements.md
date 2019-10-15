
## Requirements

- Anyone accessing the app is a user.
- any user can create a new game
- any user can delete any game (??)
- any user can finish a game
- A game is either open or finished (isFinished)
- The user has a counter of open games.
- Realtime App: on any change CUD all clients are notified (sockets)

## Entities

### Game
- id        sequential id
- title     varchar(200)
- team1     names, nvarchar()
- team2     names, nvarchar()
- isFinished  bool
- createdAt   DateTime
- finishedAt  DateTime
- deletedAt   DateTime

### Zeit

Di: 08/10 - 3h, postgres
Mi: 09/10 - 2h, postgres, data
Do: 10/10 - 2h, dataaccess
Fr: 11/10 - 4h, nodejs api
Sa: 12/10 - 0
So: 13/10 - 2h, front, api, fetch
Mo: 14/10 - 4h, front, websockets
Di: 15/10 - 4h, front, components
