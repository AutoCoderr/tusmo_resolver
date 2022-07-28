const ln = Math.log;
const log2 = n => ln(n)/ln(2)

function calculInformation(p) {
	return (-1) * log2(p)
}

module.exports = calculInformation;
