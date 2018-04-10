"use strict"
const { log, write, sum } = require("./core")
const { gematria } = require("./gematria")

/* ================== LOG(N) HNV LINEAR CORRELATION ================== 

This module is based on the findings of Professor Dr. Haim Shore and his
discovery of the HNV Linear Correlation phenomenon.  Dr Shore found that
given a Hebrew word's gematria value, and a physical characteristic of the
object named by that word in some unit, when put into Log(N) scale and graphed
that multiple Biblically related words and their corresponding unit values 
seem to be linearly correlated, much more than should it should be based on
chance alone statistically.  These values are usually found with greater than 
98% correlation!  This code allows a user to pass in a set of input words and
their corresponding values and auto-calculates the gematria values as well as
the linear correlation using the Pearson Moment-Product Correlation Coefficient (PCC) 
and scales the values and graphs them out into an exported html output.

For Example:

    The Hebrew word "ירח" meaning "Moon" which has a diameter of 1,738.1 km according to NASA ()
    The Hebrew word "ארצ" meaning "Earth", which has a diameter of 6,378.137 km according to NASA ()
    The Hebrew word "שמש" meaning "Sun" which has a diameter of 1,392,000.0 km according to NASA ()

So for our inputs we have this structure:

    [
        {word: "ירח", trans: "Moon", value: 1738.1},
        {word: "ארצ", trans: "Earth", value: 6378.137},
        {word: "שמש", trans: "Sun", value: 1392000.0}
    ]

We then calculate the gematria for these Hebrew words:

    The Hebrew word "ירח" which has a gematria value of 218
    The Hebrew word "ארצ" which has a gematria value of 291
    The Hebrew word "שמש" which has a gematria value of 640

We then run the Log(N) calculation on both the gematria and diameter values:

            GEMATRIA                                DIAMETER        
    "ירח"
    VALUE   218                                     1738.1          
    LOG(N)  2.3384564936046048304142522023384       3.2400747595688211375537650148056

    "ארצ"
    VALUE   291                                     6378.137
    LOG(N)  2.4638929889859072890793897149207       3.8046938434903544799895669179497

    "שמש"
    VALUE   640                                     1392000.0
    LOG(N)  2.806179973983887171282433368347        6.1436392352745433054828302451223

    
Using the PCC linear correlation function we thus determine the two data points 
(gematria values of the Hebrew words and the diameters of the objects named) 
that the correlation is that of 99.6988%! 

By this correlation we see that the two points in each set, represent the same thing,
the same value, like that of temperatures in C or F, both represent a single temperature.
In the same way the creator of the Hebrew word for Earth knew that this very word and its
corresponding value of 291 would correlate to the diameter of the actual Earth!

This happens not just with diameter, but also with surface area, volume and mass. 
Furthermore, the phenomenon does not just affect Earth, Sun and Moon but all 9 planets!
This even extends past the celestial realm into colors matching the corresponding Log(N)
wavelengths, metal names matching their Log(N) atomic weights and much much more!
There are even hints of correlation of the English words as well!

This tool then was built to explore other correlations besides those found by Dr Shore.
*/


// Utility function that simplifies the call to Math.log (Log(N))
const logn = value => Math.log(value)

// Calculate the "arithmetic mean" of a list of numbers (ie. average)
const mean = ns => sum(ns) / ns.length

// Calculates the linear correlation between two data points (x and y)
// and returns a value between -1 and 1, where 0.98 would be 98% correlation.
// This method uses the PCC (Pearson Moment-Product Correlation Coeffiecent)
const correlate = (x, y) => {

    // Find the arithmetic means of x and y
    const mx = mean(x)
    const my = mean(y)

    // Subtract the mean from each data point for each list
    const a = x.map(n => n - mx)
    const b = y.map(n => n - my)

    // Multiply each item in each list by themselves forming a new list
    const ab = a.map((n,i) => n * b[i])

    // Square each item in each list forming two new lists
    const a2 = a.map(n => n ** 2)
    const b2 = b.map(n => n ** 2)

    // Sum up the new multiplication and squared lists
    const sab = sum(ab)
    const sa2 = sum(a2)
    const sb2 = sum(b2)

    // Divide the sum of mulitplication list by the 
    // square root of the mulitplication of the 
    // sums of the squared lists
    return sab / Math.sqrt(sa2 * sb2)
}

// This "plots" the data by writing the HNV data list to the "data.js" external javascript file.
// This data is then passed into the graph template and renders the data visually in HTML.
const plot = data => { write("data.js", data); log(data); }

// Convert a list inputs into a HNV data formatted nested array list.
// Scales the data points using Log(N) and auto-calculates the gematria value
const dataList = inputs => inputs.map(i => [logn(gematria(i.word)), logn(i.value), i.trans, i.word, gematria(i.word)])

// Plucks the two numeric Log(N) scaled values from a given datalist into an nested array of values.
const clist = a => [a.map(t => t[0]), a.map(t => t[1]) ]

// Converts a list of inputs (word, value objects) to the required
// Javascript HNV_DATA object literal for use in graphing template.
// Calculates the linear correlation for display in the graph as well.
const toHNVdata = (...inputs) =>
    `HNV_DATA=[${inputs.map(input => {
        const dlist = dataList(input).sort((a, b) => a[0] - b[0])
        const [glist, plist] = clist(dlist)
        const lc = correlate(glist, plist)
        const lcp = `${(lc * 100).toFixed(4)}%`
        const label = `${input.map(i => `${i.word} (${gematria(i.word)})`).join(', ')} = Linear Correlation of ${lcp}`
        return `{data:${JSON.stringify(dlist)},label:"${label}"}`
    })}]`

let test = () => {
    // Test inputs
    let diameters = [
        {word: "ירח", trans: "Moon", value: 1738.1},
        {word: "ארצ", trans: "Earth", value: 6378.137},
        {word: "שמש", trans: "Sun", value: 1392000.0},
    ]

    let diametersEng = [
        {word: "Moon", trans: "Moon", value: 1738.1},
        {word: "Earth", trans: "Earth", value: 6378.137},
        {word: "Sun", trans: "Sun", value: 1392000.0}
    ]

    // Convert inputs to HNV data format and plot
    plot(toHNVdata(diameters, diametersEng))
}

module.exports = { plot, test }
