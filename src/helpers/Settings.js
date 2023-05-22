const Settings = () => {

    // THE SIZE OF THE PLAYER, IN PIXELS (LATER SQUARED) [NUMBER]
    const playerSize = 64;
    // THE DISTANCE THE PLAYER IS PLACED FROM THE LEFT SIDE OF THE SCREEN, IN PIXELS [NUMBER]
    const playerOffset = 30;
    // HOW FAR THE PLAYER CAN TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
    // NOTE THAT THE PLAYER WILL TRAVEL VERTICALLY INSTEAD OF HORIZONTALLY [NUMBER]
    const playerSpeed = 30;
    // HOW FAR THE BACKGROUND SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
    const bgScrollSpeed = 5;
  
      // THE MINIMUM AND MAXIMUM TIME TO WAIT BEFORE SPAWNING AN ASTEROID, IN SECONDS [OBJECT]
    // LATER ASSIGNED RANDOMLY BETWEEN THESE NUMBERS
    const asteroidSpawnTimer = {
      min: 1,
      max: 3,
    };
    // HOW FAR THE ASTEROID SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
    const asteroidSpeed = 10;
    // HOW MANY ASTEROIDS ARE ALLOWED TO BE ON SCREEN AT THE SAME TIME [NUMBER]
    const maxAsteroids = 10;
    // HOW MUCH SCORE THE PLAYER GAINS FOR DESTROYING AN ASTEROID [NUMBER]
    const baseAsteroidScore = 150;
    // HOW BIG THE ASTEROID IS, IN PIXELS (LATER SQUARED) [NUMBER]
    const asteroidSize = 50;
  
  
    // THE TIME TO WAIT BEFORE BEING ABLE TO FIRE ANOTHER SHOT, IN SECONDS [NUMBER]
    const shotSpawnTimer = 0.1;
    // HOW MANY SHOTS THE PLAYER CAN HAVE ON-SCREEN AT THE SAME TIME [NUMBER]
    const maxShots = 10;
    // HOW FAR THE SHOT SHOULD TRAVEL EACH INTERVAL CALL, IN PIXELS [NUMBER]
    const shotSpeed = 50;

    const shotWidth = 40;
    const shotHeight = 10;

    return({
      bgScrollSpeed: bgScrollSpeed,
      asteroidSpawnTimer: asteroidSpawnTimer,
      asteroidSize: asteroidSize,
      baseAsteroidScore: baseAsteroidScore,
      maxAsteroids: maxAsteroids, 
      shotSpawnTimer: shotSpawnTimer, 
      maxShots: maxShots, 
      shotSpeed: shotSpeed, 
      shotWidth: shotWidth,
      shotHeight: shotHeight,
      playerSpeed: playerSpeed, 
      playerSize: playerSize, 
      playerOffset: playerOffset,
      asteroidSpeed: asteroidSpeed,
    });
}

export default Settings;