module.exports = function validate({len,levels}) {
    return (
        typeof(len) === "number" &&
        levels instanceof Array &&
        !levels.some(({placeds,badPlaceds,absents}) =>

            typeof(placeds) !== "object" ||
            placeds instanceof Array ||

            typeof(badPlaceds) !== "object" ||
            badPlaceds instanceof Array ||

            [...Object.entries(placeds), ...Object.entries(badPlaceds)].some(([key,value]) =>
                parseInt(key).toString() !== key ||
                typeof(value) != "string" ||
                value.length !== 1
            ) ||

            !(absents instanceof Array) ||
            absents.some(letter => typeof(letter) !== "string" || letter.length !== 1)
        )
    )

}
