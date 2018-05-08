'use strict'

/* =================================================== Core Functions / Utilities ================================================== */
const { readFileSync, writeFileSync } = require('fs')


/* ========================= FILE / IO ============================== */

/* void log(any[] ...outputs)
Summary: Wrapper around console.log (mainly for conciseness and pretty printing)
Example:
> log([1, 2, 3])
[1,2,3]
> log({a: 1, b: 2})
{"a":1,"b":2}
*/
const log = (...outputs) => console.log(...outputs.map(o => typeof(o) == "object" ? JSON.stringify(o) : o))


/* any[] argv(any[] ...defaults)
Summary: Gets the main process arguments minus the process name and main module name.
Can optionally supply default arguments if no arguments are found from the process.
Returns: An array of the arguments to the process, or the default args if none are found.

Example:
$ node elise atbash "ABC" "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
> const { argv } = require("./core")
> argv()
["ABC" "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
*/
const argv = (...defaults) => { 
    // Drop the main process and module names from the argument list
    const args = process.argv.splice(2); 

    // Return default arguments if none are found
    return args.length > 0 ? args : defaults
}


/* string read(string path)
Summary: Wrapper around fs.readFileSync to simplify and abstract away encoding parameter and to ensure text is returned not bytes.
Returns: A string of text read from the given path to the file as as string.
Example:
$ echo ABC > test.txt
> read('test.txt')
"ABC"
*/
const read = path => readFileSync(path, 'utf8')


/* void write(string path, string content)
Summary: A wrapper around fs.writeFileSync to simplify and abstract away encoding parameter and to ensure text is written not bytes.
Example:
> write('test.txt', 'BCD')
$ cat test.txt
BCD
*/
const write = (path, content) => writeFileSync(path, content, 'utf8')


/* ========================= ARRAYS ============================== */

/* int[] range(int from, int to, int by = 1)
Summary: Utility function used by almost every mode in the engine.
Produces a range from two integers (from and to) inclusive.
Takes an optional by parameter as the step for each generation

Returns: An array of the values in the range given as an int array

Example:
> range(0, 1)
[0,1]
> range(1, 5)
[1,2,3,4,5]
> range(1, 10, 2)
[2,4,6,8,10]
*/
const range = (from, to, by=1) => [...Array(to - from + 1).keys()].map((_, i) => i + from).filter(n => n % by == 0)


/* int sum(int[] nums)
Summary: Utility function to sum up an array of numbers
Returns: The sum of all integer array members
Example:
> sum([1,2,3])
6
*/
const sum = nums => nums.reduce((a, b) => a + b, 0)


/* any single(any[] xs)
Summary: Utility function to take the first element of any array
Returns: The first element (or single element) from any array.
Example:
> single([1, 2, 3])
1
> single("ABC")
'A'
*/
const single = xs => xs[0]


/* any last(any[] xs)
Summary: Utility function to take the last element of any array.
Returns: The last element from any array.
Example:
> last([1,2,3])
3
> last("ABC")
'C'
*/
const last = xs => xs[xs.length - 1]


/* ========================= EXTENSIONS ============================== */

/* char[] String.chars()
Summary: Returns all characters as an array for a given string.
Returns: All characters for the given string as an array of characters.
Example:
> "ABC".chars()
['A','B','C']
*/
String.prototype.chars = function() { return this.split(''); };


/* any[] String.map(any f(char))
Summary: Extension to the String prototype to allow direct mapping across characters.
Returns: An array of mapped values across the given string's characters.
Example:
> "abc".map(c => c.toUpperCase())
"ABC"
*/
String.prototype.map = function(f) { return this.chars().map(f); };



/* any[] Object.map(any f(key, value, obj))
Summary: Utility function that allows mapping across objects ({}) by key and value with context.
Returns: An array of potentially modified values from the given object.
Example:
> {a: 1, b: 2, c: 3}.map((k, v) => k + '=' + v)
['a=1','b=2','c=3']
*/
Object.prototype.map = function(f) { return Object.keys(this).map((k, _, o) => f(k, this[k], o)); };


module.exports = { 
    log, 
    argv,
    read, 
    write, 
    range, 
    sum, 
    single, 
    last
}


if (require.main != module) return

log("=============== CORE ================")
const { KJV } = require("./sources")
const { random, choice } = require("./random")

log(1)
log(1, 2)
log([1, 2])
log({x: 1, y: 2})
log(range(0, 10))
log(range(0, 100, 2))
log(KJV.substr(0, 1000))
log(sum(range(1,5)))
log(range(0, 10).map(n => random(0, 1)).join(''))
log(choice(range(0, 10)))
log(argv())
