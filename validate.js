module.exports = function validate({len,positions,absents}) {
    return (
        typeof(len) === "number" &&
        typeof(positions) === "object" &&
        !(positions instanceof Array) &&
        absents instanceof Array &&

        !Object.entries(positions).some(([key,value]) =>
            parseInt(key).toString() !== key ||
            (
                typeof(value) !== "string" &&
                typeof(value) !== "object"
            ) ||
            (
                typeof(value) === "object" &&
                (
                    !(value.not instanceof Array) ||
                    value.not.some(letter => typeof(letter) !== "string" || letter.length !== 1)
                )
            ) ||
            (
                typeof(value) === "string" &&
                value.length !== 1
            )
        ) &&

        !absents.some(letter => typeof(letter) !== "string" || letter.length !== 1)
    )

}