<script context="module">
    import { asDraggable } from 'svelte-drag-and-drop-actions';
</script>
<script>
    import { db } from '$lib/db.js';
    export let data = undefined; // widget data from db
    
    function onDragStart () { return { x:data.left,y:data.top} }
    function onDragMove (x,y,dx,dy) { data.left = x; data.top = y }
    function onDragEnd  (x,y,dx,dy) {
        data.left = x; data.top = y;
        db.widgets.update(data.id, {left: x, top: y});
    }

</script>
<div class="widget"
    id={data.id}
    style:left="{data.left}px" style:top="{data.top}px"
    style:color={data.color}
    style="border-color:{data.color};"
    use:asDraggable={{ onDragStart, onDragMove, onDragEnd }}
    >
    <span class="name">{data.name}</span>
    <span class="value">
        <slot><!-- for the sensor value --></slot>
    </span>
</div>

<style>
div.widget {
    position: absolute;
    border-style:solid;
    border-width:2px;
    background-color:rgba(66, 66, 99, 0.8);
    text-align:left;
    cursor:move;
    z-index:2;
}
span.value {
    font-family: "Courier New", Courier, monospace;
    font-size: 3rem;
    font-weight: bold;
    text-align: right;
}


span {
    position: relative;
}
span.name {
    top: 0; left: 10; right: 10;
    font-family: Helvetica, Arial, sans-serif;
    font-size:1rem;
}

</style>