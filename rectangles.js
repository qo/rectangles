// i'm too lazy to use jsdoc/typescript,
// hope it doesn't hurt too much lol

// isObject returns whether value is
// an actual object, not null
const isObject = (value) => {
	return typeof value === "object" && value !== null
}

// root name will be given as parent,
// if node doesn't
// really have a parent;
// if object already has this key,
// the whole thing won't work,
// so make sure this doesn't happen;
// you can give some obscure name
// if you wanna be sure;
const root = "__OBJECT_ROOT__"

// delimiter will be used to
// mark nesting in the object;
// make sure keys in the object
// don't contain this symbol
const delimiter = "."

// getParentMap returns a
// non-nested object,
// where each value of the obj object,
// will be mapped to corresponding key
// example:
// obj: {
//   a: 1,
//   b: {
//     c: 2
//     d: 3
//   }
// },
// result: {
//   a: root,
//   b: root,
//   c: b,
//   d: b
// };
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// }
// result: {
//   a: root,
//   b: root,
//   e: root,
//   j: root,
//   l: root,
//   c: b,
//   d: b,
//   f: e,
//   g: e,
//   h: g,
//   i: g,
//   k: j,
//   m: l,
//   n: l
// }
const getParentMap = (obj) => {
	const result = {}
	// the stack will contain
	// child object which hasn't
	// been processed by the function yet,
	// as long as parent key
	const stack = [{
		parent: root,
		child: obj
	}]
	while (stack?.length > 0) {
		const { parent, child } = stack.pop()
		const childKeys = Object.keys(child)
		for (let childKey of childKeys) {
			const childValue = child[childKey]
			if (isObject(childValue)) {
				stack.push({
					parent: childKey,
					child: childValue
				})
			}
			result[childKey] = parent
		}
	}
	return result
}

const replaceKeysWithPaths = (obj, string = "") => {
	const res = {}
	for (let key in obj) {
		const val = obj[key]
		const newKey = string + key
		if (isObject(val)) {
			res[newKey] = replaceKeysWithPaths(val, newKey + delimiter)
		} else {
			res[newKey] = val
		}
	}
	return res
}

const replacePathsWithKeys = (obj) => {
	const res = {}
	for (let key in obj) {
		const val = obj[key]
		const lastIndexOfDelimiter = key.lastIndexOf(delimiter)
		let newKey
		if (lastIndexOfDelimiter === -1) {
			newKey = key
		} else {
			newKey = key.substring(lastIndexOfDelimiter + 1)
		}
		if (isObject(obj)) {
			res[newKey] = replacePathsWithKeys(val)
		} else {
			res[newKey] = val
		}
	}
	return res
}

const getKeyFromPath = (path) => {
	const lastIndexOfDelimiter = path.lastIndexOf(delimiter)
	if (lastIndexOfDelimiter === -1) {
		return path
	} else {
		return path.substring(lastIndexOfDelimiter + 1)
	}
}

// hasChildren returns whether
// key has children in the provided object
// examples:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// key: a,
// result: false;
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// key: b,
// result: true;
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// key: c,
// result: false;
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// key: d,
// result: false
const hasChildren = (obj, key) => {
	const parentMap = getParentMap(obj)
	for (let child in parentMap) {
		const parent = parentMap[child]
		if (key === parent) {
			return true
		}
	}
	return false
}

// getAllKeys returns all keys from object
// examples:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// result: [
//   a,
//   b,
//   c,
//   d
// ];
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// result: [
//   a,
//   b,
//   c,
//   d,
//   e,
//   f,
//   g,
//   h,
//   i,
//   j,
//   k,
//   l,
//   m,
//   n
// ]
const getAllKeys = (obj) => {
	const parentMap = getParentMap(obj)
	return [...Object.keys(parentMap)]
}

// getKeysWithNoChildren returns
// all keys from object that don't have
// any children
// examples:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   }
// },
// result: [
//   a,
//   c,
//   d
// ];
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// result: [
//   a,
//   c,
//   d,
//   f,
//   h,
//   i,
//   k,
//   n
// ]
const getKeysWithNoChildren = (obj) => {
	const keys = getAllKeys(obj)
	const res = []
	for (let key of keys) {
		if (!hasChildren(obj, key)) {
			res.push(key)
		}
	}
	return res
}

// getWidths returns an object
// which contains cell width for
// each key from the obj
// example:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// expected table:
// ┌───┬───────┬───────────┬───┬───┐
// │   │       │     e     │   │ l │
// │   │   b   ├───┬───────┤ j ├───┤
// │ a │       │   │   g   │   │ m │
// │   ├───┬───┤ f ├───┬───┼───┼───┤
// │   │ c │ d │   │ h │ i │ k │ n │
// └───┴───┴───┴───┴───┴───┴───┴───┘
// result: {
//   a: 1,
//   b: 2,
//   c: 1,
//   d: 1,
//   e: 3,
//   f: 1,
//   g: 2,
//   h: 1,
//   i: 1,
//   j: 1,
//   k: 1,
//   l: 1,
//   m: 1,
//   n: 1
// }
const getWidths = (obj) => {
	const widths = {}
	const keys = getAllKeys(obj)
	for (let key of keys) {
		widths[key] = 0
	}
	const parentMap = getParentMap(obj)
	const keysWithNoChildren = getKeysWithNoChildren(obj)
	for (let key of keysWithNoChildren) {
		let child = key
		let parent = parentMap[child]
		widths[child] = 1
		while (parent !== root) {
			widths[parent] += 1
			child = parent
			parent = parentMap[child]
		}
	}
	return widths
}

// getTotalHeight returns total amount
// of rows in the expected table,
// which is also maximum height
// (level of nesting) in the obj
// example:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// expected table:
// ┌───┬───────┬───────────┬───┬───┐
// │   │       │     e     │   │ l │
// │   │   b   ├───┬───────┤ j ├───┤
// │ a │       │   │   g   │   │ m │
// │   ├───┬───┤ f ├───┬───┼───┼───┤
// │   │ c │ d │   │ h │ i │ k │ n │
// └───┴───┴───┴───┴───┴───┴───┴───┘
// result: 3
const getTotalHeight = (obj) => {
	const parentMap = getParentMap(obj)
	let height = 0
	const keys = getAllKeys(obj)
	for (let key of keys) {
		let currentHeight = 1
		let child = key
		let parent = parentMap[child]
		while (parent !== root) {
			child = parent
			parent = parentMap[child]
			currentHeight++
		}
		if (currentHeight > height) {
			height = currentHeight
		}
	}
	return height
}

// getWidths returns an object
// which contains cell height for
// each key from the obj
// example:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// expected table:
// ┌───┬───────┬───────────┬───┬───┐
// │   │       │     e     │   │ l │
// │   │   b   ├───┬───────┤ j ├───┤
// │ a │       │   │   g   │   │ m │
// │   ├───┬───┤ f ├───┬───┼───┼───┤
// │   │ c │ d │   │ h │ i │ k │ n │
// └───┴───┴───┴───┴───┴───┴───┴───┘
// result: {
//   a: 3,
//   b: 2,
//   c: 1,
//   d: 1,
//   e: 1,
//   f: 2,
//   g: 1,
//   h: 1,
//   i: 1,
//   j: 2,
//   k: 1,
//   l: 1,
//   m: 1,
//   n: 1
// }
const getHeights = (obj) => {
	const heights = {}	
	const parentMap = getParentMap(obj)
	const keys = getAllKeys(obj)
	const height = getTotalHeight(obj)
	for (let key of keys) {
		let rowsLeft = height
		let child = key
		let parent = parentMap[child]
		while (parent !== root) {
			rowsLeft -= 1
			heights[child] = 1
			child = parent
			parent = parentMap[child]
		}
		if (rowsLeft !== 0) {
			heights[child] = rowsLeft
		}
	}
	// we need to check here whether
	// each column takes getTotalHeight()
	// amount of rows; without it it's not guaranteed
	// since different children could access
	// same children; we also need to go from
	// the very bottom to the top
	// to count total height of each column
	const keysWithNoChildren = getKeysWithNoChildren(obj)
	for (let key of keysWithNoChildren) {
		let child = key
		let parent = parentMap[child]
		let rowsLeft = height
		while (parent !== root) {
			rowsLeft -= heights[child]
			child = parent
			parent = parentMap[child]
		}
		rowsLeft -= heights[child]
		if (rowsLeft > 0) {
			heights[key] += rowsLeft
		}
	}
	return heights
}

// getRects returns object which
// for each key (and corresponding cell)
// returns rectangle kind of object
// which contains left-upper and right-lower
// corners coordinates of the rectangle
// example:
// obj: {
//   a: 1,
//   b: {
//     c: 2,
//     d: 3
//   },
//   e: {
//     f: 4,
//     g: {
//       h: 5,
//       i: 6
//     }
//   },
//   j: {
//     k: 7
//   },
//   l: {
//     m: {
//       n: 8
//     }
//   }
// },
// expected table:
// ┌───┬───────┬───────────┬───┬───┐
// │   │       │     e     │   │ l │
// │   │   b   ├───┬───────┤ j ├───┤
// │ a │       │   │   g   │   │ m │
// │   ├───┬───┤ f ├───┬───┼───┼───┤
// │   │ c │ d │   │ h │ i │ k │ n │
// └───┴───┴───┴───┴───┴───┴───┴───┘
// result: {
//   a: {
//     lu: {
//       x: 0,
//       y: 0
//     },
//     rl: {
//       x: 1,
//       y: 3
//     }
//   },
//   b: {
//     lu: {
//       x: 1
//       y: 0
//     },
//     rl: {
//       x: 3
//       y: 2
//     }
//   },
//   c: {
//     lu: {
//       x: 1,
//       y: 2
//     },
//     rl: {
//       x: 2
//       y: 3
//     }
//   },
//   d: {
//     lu: {
//       x: 2 
//       y: 2
//     },
//     rl: {
//       x: 3
//       y: 3
//     }
//   },
//   e: {
//     lu: {
//       x: 3
//       y: 0
//     },
//     rl: {
//       x: 6
//       y: 1
//     }
//   },
//   f: {
//     lu: {
//       x: 3
//       y: 1
//     },
//     rl: {
//       x: 4
//       y: 3
//     }
//   },
//   g: {
//     lu: {
//       x: 4
//       y: 1
//     },
//     rl: {
//       x: 6
//       y: 2
//     }
//   },
//   h: {
//     lu: {
//       x: 4
//       y: 2
//     },
//     rl: {
//       x: 5
//       y: 3
//     }
//   },
//   i: {
//     lu: {
//       x: 5
//       y: 2
//     },
//     rl: {
//       x: 5
//       y: 3
//     }
//   },
//   j: {
//     lu: {
//       x: 6
//       y: 0
//     },
//     rl: {
//       x: 7
//       y: 2
//     }
//   },
//   k: {
//     lu: {
//       x: 6
//       y: 2
//     },
//     rl: {
//       x: 7
//       y: 3
//     }
//   },
//   l: {
//     lu: {
//       x: 7
//       y: 0
//     },
//     rl: {
//       x: 8
//       y: 1
//     }
//   },
//   m: {
//     lu: {
//       x: 7
//       y: 1
//     },
//     rl: {
//       x: 8
//       y: 2
//     }
//   },
//   n: {
//     lu: {
//       x: 7
//       y: 2
//     },
//     rl: {
//       x: 8
//       y: 3
//     }
//   }
// }
const getRects = (obj, heights, widths, parentMap, res = {}) => {
	if (heights === undefined) {
		heights = getHeights(obj)
	}
	if (widths === undefined) {
		widths = getWidths(obj)
	}
	if (parentMap === undefined) {
		parentMap = getParentMap(obj)
	}
	let prev = null
	for (let key in obj) {
		res[key] = {}
		res[key].lu = {}
		res[key].rl = {}
		const w = widths[key]
		const h = heights[key]
		const parent = parentMap[key]
		if (parent === root) {
			if (prev === null) {
				res[key].lu.x = 0
				res[key].lu.y = 0
				res[key].rl.x = w
				res[key].rl.y = h
			}
			else {
				res[key].lu.x = res[prev].rl.x
				res[key].lu.y = 0
				res[key].rl.x = res[key].lu.x + w
				res[key].rl.y = res[key].lu.y + h
			}
		}
		else {
			if (prev === null) {
				res[key].lu.x = res[parent].lu.x
				res[key].lu.y = res[parent].rl.y
				res[key].rl.x = res[key].lu.x + w
				res[key].rl.y = res[key].lu.y + h
			}
			else {
				res[key].lu.x = res[prev].rl.x
				res[key].lu.y = res[prev].lu.y
				res[key].rl.x = res[key].lu.x + w
				res[key].rl.y = res[key].lu.y + h
			}
		}
		prev = key
	}
	for (let key in obj) {
		const val = obj[key]
		if (isObject(val)) {
			getRects(val, heights, widths, parentMap, res)
		}
	}
	return res
}

const getTotalWidth = (obj) => {
	let width = 0
	const keysWithNoChildren = getKeysWithNoChildren(obj)
	for (let key of keysWithNoChildren) {
		width++
	}
	return width
}

const getRectsForContents = (contents, headers) => {
	const headersRects = getRects(headers)
	const rects = {}
	const totalWidth = getTotalWidth(headers)
	const totalHeight = getTotalHeight(headers)
	let y = totalHeight
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
					const x = headersRects[objKey].lu.x
					const id = y * totalWidth + x
					const name = objVal
					rects[id] = {name, x, y}
				}
			}
		}
		y++
	}
	return rects
}


