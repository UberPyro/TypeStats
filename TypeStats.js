const usage = USAGE.data;

let moves = {};
for (let m in MOVES_SM) {
    if (!(MOVES_SM.hasOwnProperty(m))) continue;
    let w = m.toLowerCase(); // make lower case
    let n = "";
    for (let i=0; i<w.length; i++) { // filter out spaces
        let a = w.charAt(i);
        if (a === " " || a === "-") continue;
        n += a;
    }
    moves[n] = MOVES_SM[m];
}

console.log(moves);

var allTypes = [
    "Normal", 
    "Fire", 
    "Fighting", 
    "Water", 
    "Flying", 
    "Grass", 
    "Poison", 
    "Electric", 
    "Ground", 
    "Psychic", 
    "Rock", 
    "Ice", 
    "Bug", 
    "Dragon", 
    "Ghost", 
    "Dark", 
    "Steel", 
    "Fairy"
];

function resistDict(mon) {
    tList = ["t1"]
    if (mon.hasOwnProperty("t2")) {
        tList.push("t2");
    }
    let acc = [];
    for (let pt in tList) {
        let acc2 = {};
        for (i in allTypes) {
            let t = allTypes[i];
            acc2[t] = TYPE_CHART_XY[t][mon[tList[pt]]];
        }
        acc.push(acc2);
    }
    let acc3;
    if (tList.length > 1) {
        acc3 = {};
        for (let i in allTypes) {
            let t = allTypes[i];
            acc3[t] = acc[0][t] * acc[1][t];
        }
    } else {
        acc3 = acc[0];
    }
    if (mon.ab === "Flash Fire") {
        acc3.Fire = 0;
    } else if (mon.ab === "Levitate") {
        acc3.Ground = 0;
    } else if (mon.ab in {"Lightning Rod": true, "Volt Absorb": true, "Motor Drive": true}) {
        acc3.Electric = 0;
    } else if (mon.ab in {"Water Absorb": true, "Storm Drain": true}) {
        acc3.Water = 0;
    } else if (mon.ab == "Sap Sipper") {
        acc3.Grass = 0;
    } else if (mon.ab == "Thick Fat") {
        acc3.Fire = .5 * acc3.Fire;
        acc3.Ice = .5 * acc3.Ice;
    } else if (mon.ab == "Heatproof") {
        acc3.Fire = .5 * acc3.Fire;
    }
    return acc3;
}

const dex = POKEDEX_SM

function genDef() {
    //first, generate the master list
    let acc = {}; // montype: percent weak
    let acc2 = {}; // montype: percent resisted
    for (let i=0; i<allTypes.length; i++) {
        acc[allTypes[i]] = 0;
        acc2[allTypes[i]] = 0;
    }

    for (let mon1 in usage) {
        if (dex.hasOwnProperty(mon1)) {
            let d1 = resistDict(dex[mon1]);
            let u = usage[mon1].usage;

            for (let w in d1) {
                if (d1.hasOwnProperty(w) && d1[w] > 1) {
                    acc[w] += u;
                } else if (d1.hasOwnProperty(w) && d1[w] < 1) {
                    acc2[w] += u;
                }
            }


        }
    }

    for (let k in acc) {
        acc[k] *= 100;
        //normalization doesn't really make sense here
        acc[k] /= 6;
        acc[k] = Number.parseFloat(acc[k]).toFixed(2);
        
        acc2[k] *= 100;
        acc2[k] /= 6;
        acc2[k] = Number.parseFloat(acc2[k]).toFixed(2);
    }

    //make this into a list for sorting
    let acc_ = [];
    let acc2_ = [];
    for (k in acc) {
        acc_.push([k, acc[k]]);
        acc2_.push([k, acc2[k]]);
    }
    acc_.sort((a, b) => b[1] - a[1]);
    acc2_.sort((a, b) => a[1] - b[1]);

    return [acc_, acc2_];
}

function genOff() {
    let acc = {}; // movetype: usage
    let acc2 = {"Physical": 0, "Special": 0}; // phys/spec: usage
    for (let i=0; i<allTypes.length; i++) {
        acc[allTypes[i]] = 0;
    }
    for (let mon1 in usage) {
        if (dex.hasOwnProperty(mon1)) {
            let move_usage = usage[mon1].Moves;
            let total = 0;
            let acc3 = {};
            for (let i=0; i<allTypes.length; i++) {
                acc3[allTypes[i]] = 0;
            }
            let acc4 = {"Physical": 0, "Special": 0};
            for (let m in move_usage) {
                if (!(move_usage.hasOwnProperty(m))) continue;
                if (m === "") continue;
                if (moves[m] == null) {
                    //console.log(m);
                    continue;
                }
                if (moves[m].category == null) continue;
                acc3[moves[m].type] += move_usage[m];
                acc4[moves[m].category] += move_usage[m];
                total += move_usage[m];
            }
            for (let t in acc) {
                if (!(acc.hasOwnProperty(t))) continue;
                if (total === 0) continue;
                acc[t] += acc3[t] / total * 100 / 6 * usage[mon1].usage
            }
            if (total != 0) {
                acc2["Physical"] += acc4["Physical"] / total * 100 / 6 * usage[mon1].usage;
                acc2["Special"] += acc4["Special"] / total * 100 / 6 * usage[mon1].usage;
            }
        }
    }
    
    acc_ = [];
    for (let t in acc) {
        if (!(acc.hasOwnProperty(t))) continue;
        acc_.push([t, acc[t]]);
    }
    acc2_ = [
        ["Physical", acc2["Physical"]], 
        ["Special", acc2["Special"]]
    ];
    acc_.sort((a, b) => b[1] - a[1]);

    let tot = 0;
    for (let i=0; i<acc_.length; i++) {
        tot += acc_[i][1];
    }

    tot /= 100;

    for (let i=0; i<acc_.length; i++) { // normalization though it should already be very close to 100
        if (tot != 0) {
            acc_[i][1] /= tot;
            acc_[i][1] = Number.parseFloat(acc_[i][1]).toFixed(2);
        }
    }

    acc2_[0][1] /= tot;
    acc2_[1][1] /= tot;
    acc2_[0][1] = Number.parseFloat(acc2_[0][1]).toFixed(2);
    acc2_[1][1] = Number.parseFloat(acc2_[1][1]).toFixed(2);

    return [acc_, acc2_];
}