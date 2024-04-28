export function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
};

// Return the days (unlikely), hours, mins and seconds
// between two dates as string values formatted for display.
export function timePartsBetween(later, earlier) {
    let deltaSec = Math.abs(later - earlier) / 1000;
    let timeParts = {};

    // calculate (and subtract) whole days
    timeParts.days = String(Math.floor(deltaSec/86400));
    deltaSec -= timeParts.days * 86400;

    // calculate (and subtract) whole hours
    timeParts.hours = String(Math.floor(deltaSec / 3600) % 24).padStart(2, '0');
    deltaSec -= timeParts.hours * 3600;

    // calculate (and subtract) whole minutes
    timeParts.minutes = String(Math.floor(deltaSec / 60) % 60).padStart(2, '0');
    deltaSec -= timeParts.minutes * 60;

    // what's left is seconds
    timeParts.seconds = String(Math.floor(deltaSec)).padStart(2, '0');
    
    return timeParts;
}

// Bit functions from flux

export function nthBit(field, bit) {
    return (field >> bit) & 1;
};

export function setBit(i, n) {
    return n |= (1 << i);
}

export function getBits(start, end, value) {
    return (value >> start) & ((1 << (end - start)) - 1);
}

export function nthBitToBool(field, bit) {
    return toBool(nthBit(field, bit));
}

// Dataview utility functions from flux

export function toNumber(value) {
    return +value;
}

export function toBool(value) {
    return !!(value);
};

export function toFixed(x, points = 2) {
    const precision = 10**points;
    return Math.round(x * precision) / precision;
}

export function getUint24LE(dataview, index = 0) {
    const LSB = dataview.getUint8(index,   true); // LSB
    const MB  = dataview.getUint8(index+1, true);
    const MSB = dataview.getUint8(index+2, true); // MSB

    return (MSB << 16) + (MB << 8) + LSB;
}