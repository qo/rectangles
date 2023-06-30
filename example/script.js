const headers = {
	"a": {},
	"b": {
		"c": {},
		"d": {}
	},
	"e": {
		"f": {},
		"g": {
			"h": {},
			"i": {}
		},
	},
	"j": {
		"k": {}
	},
	"l": {
		"m": {
			"n": {}
		}
	}
}

const contents = [
	{
		"a": 1,
		"b": {
			"c": 2,
			"d": 3
		},
		"e": {
			"f": 4,
			"g": {
				"h": 5,
				"i": 6
			}
		},
		"j": {
			"k": 7
	},
		"l": {
			"m": {
				"n": 8
			}
		}
	},
	{
		"a": 9,
		"b": {
			"c": 10,
			"d": 11
		},
		"e": {
			"f": 12,
			"g": {
				"h": 13,
				"i": 14
			}
		},
		"j": {
			"k": 15
	},
		"l": {
			"m": {
				"n": 16
			}
		}
	}
]
const obj = headers

const colWidth = 50;
const rowHeight = 50;

const rects = getRects(obj)
const keys = [...Object.keys(rects)]

const table = document.createElement("div")
table.setAttribute("class", "table")
table.setAttribute("style", `width: ${getTotalWidth(obj) * colWidth}px; height: ${getTotalHeight(obj) * rowHeight}px;`)

for (let key of keys) {
	const rect = rects[key]
	const rectEl = document.createElement("div")

	rectEl.setAttribute("class", "cell")
	rectEl.setAttribute("style", `position: absolute; left: ${(rect.lu.x) * colWidth}px; top: ${(rect.lu.y) * rowHeight}px; width: ${(rect.rl.x - rect.lu.x) * colWidth}px; height: ${(rect.rl.y - rect.lu.y) * rowHeight}px; line-height: ${(rect.rl.y - rect.lu.y) * rowHeight}px;`)

	rectEl.innerText = key
	table.appendChild(rectEl)
}

const headersWithNoChildren = getKeysWithNoChildren(obj)

console.log(headersWithNoChildren)

let y = getTotalHeight(obj)
for (let content of contents) {
	const stack = [content]
	while (stack?.length > 0) {
		const obj = stack.pop()
		const objKeys = Object.keys(obj)
		for (let objKey of objKeys) {
			const objVal = obj[objKey]
			if (isObject(objVal)) {
				stack.push(objVal)
			}
			else {
				const contentCell = document.createElement("div")
				const x = rects[objKey].lu.x
				contentCell.setAttribute("class", "cell")
				contentCell.setAttribute("style", `position: absolute; left: ${x * colWidth}px; top: ${y * rowHeight}px; width: ${colWidth}px; height: ${rowHeight}px; line-height: ${rowHeight}px;`)
				contentCell.innerText = objVal
				table.appendChild(contentCell)
			}
		}
	}
	y++
}

const body = document.querySelector("body")
body.appendChild(table)
