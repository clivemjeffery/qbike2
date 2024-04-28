import { readable, writable, derived } from "svelte/store";
import { getRandomIntInclusive, timePartsBetween } from "./utils";

// stores for cycling metrics
export const heart_rate = writable(0);
// research stores...
export const hrByteLength = writable(0);
export const hrHexData = writable('');
export const hrFlags = writable(0);

export const hr_device_name = writable('no name yet');
export const hr_device_status = writable('no status yet');
export const power = writable(0);
export const powerFlags = writable(0);
export const targetPower = writable(0);
export const cadence = writable(0);
export const speed = writable(0);
export const pw_device_name = writable('no power name yet');
export const pw_device_status = writable('no power status yet');

// Stores for times:
export const timeOfDay = readable(new Date(),
    function start(set) {
        const interval = setInterval(
            () => { set(new Date()) }, 1000
        );
        return function stop() {
            clearInterval(interval);
        }
    }
);

// Timers - overall and lap: both return a timePartsBetween object
export const timerStarted = writable(new Date());
export const timerElapsed = derived(
    [timeOfDay, timerStarted],
    ([$timeOfDay, $timerStarted]) => timePartsBetween($timeOfDay, $timerStarted)
); // 
export const lapStarted = writable(new Date());
export const timerLap = derived(
    [timeOfDay, lapStarted],
    ([$timeOfDay, $lapStarted]) => timePartsBetween($timeOfDay, $lapStarted)
);


// derived store for simulated power
export const sim_power = derived(
    timeOfDay, () => 120 + getRandomIntInclusive(-5, 5)
);

// array stores could be useful for keeping time data
// for heart rate, power (measurement), etc.
export const heartRates = writable([]);
