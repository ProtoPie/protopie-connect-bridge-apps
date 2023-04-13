# node-bridge-f1-game-telemetry

This bridge app brings F1 22 game telemetry data to ProtoPie via ProtoPie Connect.

## How to run
1. Clone the project and navigate to the 'node-bridge-f1-game-telemetry' directory
2. Build project **npm run build**
3. Start project **npm run start**

*Make sure to run ProtoPie Connect and F1 2022 game before running this bridge app*

## How this app works

This app listens to UDP packet data from F1 22 game which are listed [here](https://answers.ea.com/t5/General-Discussion/F1-22-UDP-Specification/td-p/11551274?attachment-id=607611)

Upon receiving the UDP data, this bridge app converts and sends them as SocketIO messages to ProtoPie Connect.

## Data sent to ProtoPie Connect by the bridge app
#### Data types sent to ProtoPie Connect by the Bridge App
| Packet type | Description |
| --- | --- |
| session | Data about the session – track, time left |
| lap | Data about all the lap times of cars in the session |
| carTelemetry | Telemetry data for all cars |
| carStatus | Status data for all cars |
| final | Final classification confirmation at the end of a race |
#### Packets sent to ProtoPie Connect by the Bridge App
| Message | Description |
| --- | --- |
| session_weather | Weather - 0 = clear, 1 = light cloud, 2 = overcast, 3 = light rain, 4 = heavy rain, 5 = storm |
| session_trackTemperature | Track temp. in degrees celsius |
| session_airTemperature | Air temp. in degrees celsius |
| session_totalLaps | Total number of laps in this race |
| session_trackLength | Track length in metres |
| session_sessionDuration | Session duration in seconds |
| session_gamePaused | Whether the game is paused – network game only |
| lap_lastLapTimeInMS | Last lap time in milliseconds |
| fdfr | Current time around the lap in milliseconds |
| lap_currentLapNum | Current lap number |
| lap_carPosition | Car race position |
| lap_lapDistance | Distance vehicle is around current lap in metres – could be negative if line hasn’t been crossed yet |
| lap_totalDistance | Total distance travelled in session in metres – could be negative if line hasn’t been crossed yet |
| carTelemetry_speed | Speed of car in kilometres per hour |
| carTelemetry_throttle | Amount of throttle applied (0.0 to 1.0) |
| carTelemetry_steer | Steering (-1.0 (full lock left) to 1.0 (full lock right)) |
| carTelemetry_brake | Amount of brake applied (0.0 to 1.0) |
| carTelemetry_clutch | Amount of clutch applied (0 to 100) |
| carTelemetry_gear | Gear selected (1-8, N=0, R=-1) |
| carTelemetry_engineRPM | Engine RPM |
| carTelemetry_drs | 0 = off, 1 = on |
| carTelemetry_revLightsPercent | Rev lights indicator (percentage) |
| carTelemetry_revLightsBitValue | Rev lights (bit 0 = leftmost LED, bit 14 = rightmost LED) |
| carTelemetry_brakesTemperature | Brakes temperature (celsius) |
| carTelemetry_tyresSurfaceTemperature | Tyres surface temperature (celsius) |
| carTelemetry_tyresInnerTemperature | Tyres inner temperature (celsius) |
| carTelemetry_engineTemperature | Engine temperature (celsius) |
| carTelemetry_tyresPressure | Tyres pressure (PSI) |
| carTelemetry_surfaceType | Driving surface ???see appendices |
| carStatus_tractionControl | Traction control - 0 = off, 1 = medium, 2 = full |
| carStatus_antiLockBrakes | 0 (off) - 1 (on) |
| carStatus_fuelMix | Fuel mix - 0 = lean, 1 = standard, 2 = rich, 3 = max |
| carStatus_frontBrakeBias | Front brake bias (percentage) |
| carStatus_pitLimiterStatus | Pit limiter status - 0 = off, 1 = on |
| carStatus_fuelInTank | Current fuel mass |
| carStatus_fuelCapacity | Fuel capacity |
| carStatus_fuelRemainingLaps | Fuel remaining in terms of laps (value on MFD) |
| carStatus_maxRPM | Cars max RPM, point of rev limiter |
| carStatus_idleRPM | Cars idle RPM |
| carStatus_maxGears | Maximum number of gears |
| final_totalCars | Number of cars in the final classification |
| final_position | Finishing position |
| final_numLaps | Number of laps completed |
| final_gridPosition | Grid position of the car |
| final_points | Number of points scored |
| final_numPitStops | Number of pit stops made |
| final_resultStatus | Result status - 0 = invalid, 1 = inactive, 2 = active, 3 = finished, 4 = didnotfinish, 5 = disqualified, 6 = not classified, 7 = retired |
| final_bestLapTimeInMS | Best lap time of the session in milliseconds |
| final_totalRaceTime | Total race time in seconds without penalties |
| final_penaltiesTime | Total penalties accumulated in seconds |
| final_numPenalties | Number of penalties applied to this driver |
| event_sessionStarted | Sent when the session starts |
| event_sessionEnded | Sent when the session ends |

An example pie developed to work with these data can be found below
- [Gauge cluster]()
- [Center console]()

Please note that we can not provide the fonts which are associated with these pies.

*Shout out to [racehub](https://github.com/racehub-io) for the [f1-telemetry-client](https://github.com/racehub-io/f1-telemetry-client)*