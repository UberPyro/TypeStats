function stringAdd(s, arr) {
    for (let i=0; i<arr.length; i++) {
        s += arr[i][0] + ": " + arr[i][1] + "\n" // casting is automatic
    }
    return s + "\n";
}

g = genDef();
h = genOff();


s = "Here's a bunch of statistics about Pokemon in the OU metagame. Based off of 1695 stats.\n"
s += "All of these stats are per instance of Pokemon or Move, meaning that Pokemon usage is always taken into account."
s += "\n\n"
s += "% of Pokemon in the OU metagame weak to the given type.\n"

s = stringAdd(s, g[0]);

s += "% of Pokemon in the OU metagame resistant to the given type.\n"

s = stringAdd(s, g[1]);

s += "% of Moves in the OU Metagame of the given type.\n"

s = stringAdd(s, h[0]);

s += "% of Moves in the OU Metagame that are Physical or Special.\n"

s = stringAdd(s, h[1]);

console.log(s);
document.getElementById("0").innerHTML = s;