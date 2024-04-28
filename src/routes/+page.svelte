<script context="module">
    import { asDropZone } from 'svelte-drag-and-drop-actions';
</script>
<script>
    // Dexie - useful wrapper for IndexedDB stores
    //  where session settings can be locally persisted.
    import { liveQuery } from "dexie";
    import { db } from "$lib/db.js";

    // Keep awake while training!
    import Wakelock from "$lib/Wakelock.svelte";
    
    // Svelte stores for app data
    import { heart_rate, hr_device_name, hr_device_status,
             hrByteLength, hrHexData, hrFlags,
             power, targetPower,
             cadence,
             speed,
             pw_device_name, pw_device_status,
             powerFlags,
             timeOfDay,
             timerStarted, timerElapsed, 
             lapStarted, timerLap } from "$lib/stores.js";
    import { sim_power } from "$lib/stores.js";

    // Bluetooth device funtions
    import { pairCyclingPower } from "$lib/power.js";
    import { pairHeartRateMonitor } from "$lib/heart_rate.js";
    
    // Icons
    import IconHeartRate from '~icons/icon-park-outline/heart-rate';
    import IconCyclingPower from '~icons/maki/racetrack-cycling';
    import IconClock from '~icons/et/clock';
    import IconTimerStart from '~icons/radix-icons/timer';
    import IconTimerLap from '~icons/radix-icons/lap-timer';
    import IconYouTube from '~icons/radix-icons/video';
    import IconImage from '~icons/radix-icons/image';
    import IconPasteVideo from '~icons/icon-park-outline/video';
    import IconDownload from '~icons/icon-park-outline/download';

    // Components and their data
    import Widget from "$lib/Widget.svelte";
    import TimePartsDisplay from "../lib/TimePartsDisplay.svelte";
    let whr = liveQuery(() => db.widgets.get('hr'));
    let wpw = liveQuery(() => db.widgets.get('pw'));
    let werg = liveQuery(() => db.widgets.get('erg'));
    let wsp = liveQuery(() => db.widgets.get('sp'));
    let wca = liveQuery(() => db.widgets.get('ca'));

    // Other locals

    // The Widgets can't be dragged over the iFrame, so
    // this will hide it so that you can. Maybe swap in a
    // test screenshot so that you can tinker with positions.
    let youtubeDisplay = false;
    let imageDisplay = false;
    let videoUrl = 'https://www.youtube.com/embed/QR-cFEYn0FM?si=4NjilYR_8Bso7AS_';

    function pasteVideo() {
        console.log('pasteVideo');
        navigator.clipboard
        .readText()
        .then((clip) => (videoUrl = clip));
    };
    function restartTimer() {
        console.log('restartTimer');
        $timerStarted = new Date();
        $lapStarted = new Date();
    }
    function restartLap() {
        console.log('restartLap');
        $lapStarted = new Date();
    }
    async function getFile() {
        // Open file picker and destructure the result the first handle
        const [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        return file;
    }


    // time formatter - move to time widget?
    const formatter = Intl.DateTimeFormat(
        'en',
        {
            hour12: false,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        }
    );

</script>
<svelte:head><title>QBike2</title> </svelte:head>
<main>
    <nav class="left">
        <button><Wakelock /></button>
        <button on:click="{pairHeartRateMonitor}">
            <span ><IconHeartRate /></span>
        </button>
        <button on:click="{pairCyclingPower}">
            <span ><IconCyclingPower /></span>
        </button>
        <button on:click={()=> {imageDisplay = !imageDisplay}}>
            <span ><IconImage /></span>
        </button>
        <button on:click={()=> {youtubeDisplay = !youtubeDisplay}}>
            <span ><IconYouTube /></span>
        </button>
        <button on:click={pasteVideo}>
            <span ><IconPasteVideo /></span>
        </button>
        <button on:click={getFile}>
            <span ><IconDownload /></span>
        </button>
    </nav>
    <nav class="right">
        <button on:click={restartTimer}>
            <span><IconTimerStart /></span>
        </button>
        <TimePartsDisplay timeParts={$timerElapsed} />
        <button on:click={restartLap}>
            <span ><IconTimerLap /></span>
        </button>
        <TimePartsDisplay timeParts={$timerLap} />
        <span><IconClock /></span>
        <span class="time">{formatter.format($timeOfDay)}</span>
    </nav>

    <iframe
        id="video"
        class="mainframe"
        src={videoUrl}
        title="background video frame"
        style:display={youtubeDisplay ? 'block' : 'none' }
        />

    <img
        id="gcn-screenshot"
        class="mainframe"
        src="gcn-workout-screen.png"
        alt="Screenshot of GCN Workout video"
        style:display={imageDisplay ? 'block' : 'none' }
        />

    <!-- Widgets appear where user decides on top of the video frame -->
    {#if $wpw}<Widget data={$whr}>{$heart_rate}</Widget>{/if}
    {#if $wpw}<Widget data={$wpw}>{$power}</Widget>{/if}
    {#if $werg}<Widget data={$werg}>{$targetPower}</Widget>{/if}
    {#if $wsp}<Widget data={$wsp}>{$speed.toFixed(1)}</Widget>{/if}
    {#if $wca}<Widget data={$wca}>{$cadence}</Widget>{/if}

    <!-- behind the video frame, only visible when it is not displayed  -->
    <div class="behind">
        <div>Some help text...</div>
        <div>Video URL: {videoUrl}</div>
        <div><span>Heart Rate Device: </span><span>{$hr_device_name}</span></div>
        <div><span>Heart Rate Status: </span><span>{$hr_device_status}</span></div>
        <div><span>Power Device: </span><span>{$pw_device_name}</span></div>
        <div><span>Power Status: </span><span>{$pw_device_status}</span></div>
        <div><span>Timer Started at: </span><span>{$timerStarted}</span></div>
    </div>

    <div class="research">
        <div>HR resarch data</div>
        <table>
            <tr>
                <td>Timer</td>
                <td><TimePartsDisplay timeParts={$timerElapsed} /></td>
            </tr>
            <tr>
                <td>Heart rate as found</td>
                <td>{$heart_rate}</td>
            </tr>
            <tr>
                <td>Dataview byte length</td>
                <td>{$hrByteLength}</td>
            </tr>
            <tr>
                <td>Dataview as hex</td>
                <td>{$hrHexData}</td>
            </tr>
            <tr>
                <td>Flags</td>
                <td>{$hrFlags}</td>
            </tr>
            <tr>
                <td>Flags hex</td>
                <td>{$hrFlags.toString(16)}</td>
            </tr>
            <tr>
                <td>Flags binary</td>
                <td>{$hrFlags.toString(2)}</td>
            </tr>
        </table>
    </div>
</main>

<style>
button {
    background-color:#324A5F;
    border: none;
    padding:4px;
    margin:0;
    font-size: 16px;
    width: 30px;
    cursor: pointer;
}
button:hover {
    background-color:#586F7C;
}
.mainframe {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 1;
}
nav {
    position:absolute;
    top: 0;
    height: 30px;
    z-index: 2;
}
nav.left { left: 0; }
nav.right { left: 40%; }
span.time {
    font-family: "Courier New", Courier, monospace;
    vertical-align:top;
    width:max-content;
    margin-right:2em;
}
span:hover {
    color:aliceblue;
}
div.behind {
    position:absolute;
    left: 20px;
    top: 10%;
    z-index: 0;
}

div.research {
    font-family: "Courier New", Courier, monospace;
    position:absolute;
    left: 20px;
    bottom: 20%;
    z-index: 0;
}
</style>