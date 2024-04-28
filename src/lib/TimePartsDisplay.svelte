<script>
    export let timeParts;
</script>
<span>
    {timeParts.hours}:{timeParts.minutes}:{timeParts.seconds}
    &nbsp;
</span>
<style>
span {
    font-family: "Courier New", Courier, monospace;
    vertical-align:top;
    width:max-content;
    margin:0;
}
</style>