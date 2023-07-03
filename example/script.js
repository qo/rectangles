/* const headers = {
	"": {},
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
} */
const headers = {
	"ship": {},
	"port": {},
	"arrival": {
		"date": {},
		"time": {}
	},
	"departure": {
		"date": {},
		"time": {}
	}
}

const replaced = replaceKeysWithPaths(headers)
/* console.log(replaced)
const original = replacePathsWithKeys(replaced)
console.log(original) */

/* const contents = [
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
]*/

const contents = [
	{
		"ship": "ship-1",
		"port": "port-1",
		"arrival": {
			"date": "01-01-01",
			"time": "13:12"
		},
		"departure": {
			"date": "02-02-02",
			"time": "14:13"
		}
	},
	{
		"ship": "ship-1",
		"port": "port-1",
		"arrival": {
			"date": "01-01-02",
			"time": "13:12"
		},
		"departure": {
			"date": "02-02-02",
			"time": "14:13"
		}
	},


]

let obj = replaced

const colWidth = 100;
const rowHeight = 100;

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

	rectEl.innerText = getKeyFromPath(key)
	table.appendChild(rectEl)
}

const replacedContents = []
for (let content of contents) {
	replacedContents.push(replaceKeysWithPaths(content))
}

const rectsForContents = getRectsForContents(replacedContents, replaced)

for (let id in rectsForContents) {
	const rect = rectsForContents[id]
	const contentCell = document.createElement("div")
	contentCell.setAttribute("class", "cell")
	contentCell.setAttribute("style", `position: absolute; left: ${rect.x * colWidth}px; top: ${rect.y * rowHeight}px; width: ${colWidth}px; height: ${rowHeight}px; line-height: ${rowHeight}px;`)
	contentCell.innerText = rect.name
	table.appendChild(contentCell)
}

const body = document.querySelector("body")
body.appendChild(table)
