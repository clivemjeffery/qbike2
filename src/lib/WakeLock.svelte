<script>
// example adapted from
// https://developer.chrome.com/docs/capabilities/web-apis/wake-lock/

import { onMount } from "svelte";
import IconAwake from '~icons/carbon/awake'; 

let sentinel = null;
let locked = false;

const handleVisibilityChange = async () => {
  if (sentinel !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

const requestWakeLock = async () => {
    navigator.wakeLock.request()
    .then(WakeLockSentinel => {
        sentinel = WakeLockSentinel;
        sentinel.addEventListener('release', () => {
            console.log('wakelock release:', sentinel.released);
            locked = !sentinel.released;
        });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        locked = !sentinel.released;
        return sentinel;
    })
    .catch(error => {
        locked = false;
        console.log(error);
    });
};

onMount( requestWakeLock );

</script>
<span class:locked><IconAwake /></span>
<style>
  span.locked { color:greenyellow }
  span { color:darkgrey }
</style>