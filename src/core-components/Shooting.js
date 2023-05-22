import {useState, useEffect, useContext} from 'react';
import { GameObjectsContext, InputContext } from '../helpers/context';
import Settings from '../helpers/Settings';
import Shot from '../components/Shot';

// D3 is used as an alternative to the setinterval and date.now functions to slightly improve performance
// More info:
// https://www.npmjs.com/package/d3-timer
//
import { now as d3Now, interval as d3Interval } from "d3-timer";

// Uuidv4 is used for creating unique ids for the shot and asteroid objects
// The ids created by the uuidv4 function are strings and look roughly like 'b1c4a89e-4905-5e3c-b57f-dc92627d011e'
// More info:
// https://www.npmjs.com/package/uuid
//
import { v4 as uuidv4 } from "uuid";

const Shooting = () => {

  // THE TIME WHEN THE NEXT SHOT SHOULD BE SPAWNED IN, REPRESENTED BY A NUMBER IN MILLISECONDS SLIGHTLY LARGER THAN DATE.NOW [NUMBER]
  // REPLACES THE OLD SHOTCOOLDOWN
  // SUGGESTION: ELABORATE ON THIS EXPLANATION
  const [shotTimer, setShotTimer] = useState(0);

  const input = useContext(InputContext);
  const gameObjects = useContext(GameObjectsContext);
  const settings = Settings();

  // playerShoot - Adds a new item to the currentShots array with the values needed for a new shot to be rendered
  //
  // Basic flow:
  // --> Checks if the player has pressed the button to shoot (spaceIsPressed) and the shooting timer is over (shotTimer)
  // --> Also checks to make sure the player has not already fired too many shots, if either check fails do nothing
  // --> Resets the shooting timer (setShotTimer)
  // --> Creates a new variable (newShotTop) with the correct spawn-position for the new shot based on player position and size
  // --> Adds a new object to the setCurrentShots array and assigns it the properties:
  //    --> pos based on where to spawn the shot horizontally
  //    --> top based on newShotTop (see above)
  //    --> id based on a new unique id from uuidv4
  //    --> width, height based on how big the shot should be
  //
  function playerShoot() {
    let now = d3Now();

    if (input.spaceIsPressed && gameObjects.currentShots.length < settings.maxShots && shotTimer < now) {
      let newTimer = now + settings.shotSpawnTimer * 1000;
      setShotTimer(newTimer);

      let newShotTop = gameObjects.playerPos + settings.playerSize * 0.5 - 5;
      console.log("shot fired");
      gameObjects.setCurrentShots([
        ...gameObjects.currentShots,
        { pos: settings.playerOffset + settings.playerSize, top: newShotTop, id: uuidv4(), width: settings.shotWidth, height: settings.shotHeight },
      ]);
    }
  }

  useEffect(() =>  {
    let interval = d3Interval((playerShoot), 30);

    return () => {
      interval.stop();
    }
  })

    // ShotRenderer - Copy of the AsteroidRenderer function except for shots
    const ShotRenderer = () => {
        return <>{renderShots()}</>;
      };
    
      // renderShots - Copy of the renderAsteroids function except for shots
      function renderShots() {
        let visibleShots = gameObjects.currentShots.map((shot) => (
          <Shot
            key={shot.id}
            pos={shot.pos}
            top={shot.top}
            width={shot.width}
            height={shot.height}
          />
        ));
        return visibleShots;
      }
      return(
        <ShotRenderer />
      )
}

export default Shooting;