type building = {
    starting: number;
    ending: number;
    height: number;
};
type point = [number, number];
type skyline = point[];

function merge_skyline(s1: skyline, s2: skyline): skyline {
    let merged: skyline = [];
    let b1: point = [-1, 0],
        b2: point = [-1, 0]; // b1 and b2 are the unfinished buildings in each skyline
    let p1 = 0,
        p2 = 0; // curser in each skyline
    let remaining: skyline;
    while (true) {
        if (p1 >= s1.length || p2 >= s2.length) {
            // if one of the skyline is finished
            remaining = p1 >= s1.length ? s2.slice(p2) : s1.slice(p1);
            break;
        }
        if (s1[p1][0] <= s2[p2][0]) {
            let previous_height = b1[1];
            let height: number;
            b1 = s1[p1];
            p1++;
            if (b1[1] <= b2[1]) {
                // if the next building is not higher than the other skyline
                if (previous_height <= b2[1]) {
                    // if the previous height is not higher than the other skyline
                    // meaning the change of height is beneath the other skyline
                    continue;
                }
                height = b2[1];
            } else {
                height = b1[1];
            }

            if (b1[0] === b2[0]) {
                // if next building is adjacent to the previous one
                merged.pop();
            }
            merged.push([b1[0], height]);
        } else {
            // same as above
            let previous_height = b2[1];
            let height: number;
            b2 = s2[p2];
            p2++;
            if (b2[1] <= b1[1]) {
                if (previous_height <= b1[1]) {
                    continue;
                }

                height = b1[1];
            } else {
                height = b2[1];
            }
            if (b1[0] === b2[0]) {
                merged.pop();
            }
            merged.push([b2[0], height]);
        }
    }
    if (merged[merged.length - 1][0] === remaining[0][0]) {
        // handle remaining skyline adjacent to existing skyline
        merged.pop();
        if (remaining[0][1] === merged[merged.length - 1][1]) {
            // if adjacent remaining skyline has the same height
            remaining.shift();
        }
    }
    // merge remaining skyline
    return merged.concat(remaining);
}

function find_skyline(buildings: building[]): skyline {
    // if there is only one building
    if (buildings.length === 1) {
        let b = buildings[0];
        return [
            [b.starting, b.height],
            [b.ending, 0],
        ];
    }
    //otherwise divide buildings into 2 parts
    let c = Math.floor(buildings.length / 2);
    let b1 = buildings.slice(0, c);
    let s1 = find_skyline(b1);
    let b2 = buildings.slice(c);
    let s2 = find_skyline(b2);
    return merge_skyline(s1, s2);
}

function parse_input(input: string): building[] {
    let lines = input.trim().split("\n");
    return lines.map(function (line) {
        let l = line.split(/[^\d]+/);
        return {
            starting: parseFloat(l[0]),
            ending: parseFloat(l[2]),
            height: parseFloat(l[1]),
        };
    });
}

function solve(input: string): string {
    let buildings = parse_input(input);
    let skyline = find_skyline(buildings);
    let output = skyline.map(point => point.join(" ")).join("\n");
    return output;
}

(function () {
    document.getElementById("solve")?.addEventListener("click", function () {
        let input = document.getElementById("input") as HTMLTextAreaElement;
        if (input === null) return;
        let output = document.getElementById("output");
        if (output === null) return;
        output.innerText = solve(input.value);
    });
})();
