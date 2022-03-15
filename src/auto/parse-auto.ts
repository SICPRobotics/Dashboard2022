export interface DiffDrive {
    type: "diffDrive",
    left: number,
    right: number,
    duration: number
}

export interface DriveDistance {
    type: 'driveDistance'
    distance: number
    speed: number
}

export interface DriveDuration {
    type: 'driveDuration'
    duration: number,
    speed: number
}

export interface Wait {
    type: 'wait'
    duration: number
}

export interface RelativeTurn {
    type: 'relativeTurn'
    rotation: number
}

export interface TurnToHeading {
    type: 'turnToHeading'
    heading: number
}

export interface ArmUp {
    type: 'armUp'
}

export interface ArmDown {
    type: 'armDown'
}

export interface Intake {
    type: 'intake'
    direction: 'in' | 'out'
    duration: number
}

export type AutoCode = AutoInstruction[];

export type AutoInstruction = DiffDrive | DriveDuration | DriveDistance | Wait | RelativeTurn | TurnToHeading | ArmUp | ArmDown | Intake;

export interface AutoError {
    line: number,
    message: string
}

export interface CompiledAuto {
    instructions: AutoInstruction[];
    errors: AutoError[];
}

export function parseAuto(code: string) {
    let instructions: AutoInstruction[] = [];
    let errors: AutoError[] = [];

    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
        try {
            if (lines[i] != '') {
                instructions.push(parseLine(lines[i]));
            }
        } catch (e) {
            errors.push({
                line: i,
                message: e as string
            });
        }
    }

    return { instructions, errors }
}

function parseNumberArg(arg: string) {
    const match = arg.match(/(\d+)(\w*)/);

    if (!match) {
        throw `Failed to parse ${arg} -- no match`
    }
    return {
        number: Number(match[1]),
        units: match[2]
    }
}

const cmPerInch = 2.54;
const encoderUnitsPerCm = 83.75;

function parseDistanceArg(arg: string) {
    const { number, units } = parseNumberArg(arg);

    if (units == 'm') {
        return encoderUnitsPerCm * 100 * number;
    } else if (units == 'cm') {
        return encoderUnitsPerCm * number;
    } else if (units == 'ft') {
        return encoderUnitsPerCm * cmPerInch * number * 12;
    } else if (units == 'in') {
        return encoderUnitsPerCm * cmPerInch * number;
    } else if (units == 'rev') {
        return number * 4096;
    } else {
        throw `Unknown distance units ${units}`
    }
}

function parseTimeArg(arg: string) {
    const { number, units } = parseNumberArg(arg);

    if (units == 's') {
        return number
    } else if (units == 'ms') {
        return number * 0.001
    } else {
        throw `Unknown time units ${units}`
    }
}

function parseRotationArg(arg: string) {
    const { number, units } = parseNumberArg(arg);

    if (units == 'deg') {
        return number;
    } else if (units == 'rev') {
        return number / 360;
    } else if (units == 'rad') {
        return number / Math.PI * 180;
    } else {
        throw `Unknown rotation units ${units}`
    }
}


function parseStringArg<TOptions extends string[]>(value: string, ...options: TOptions) {
    if (options.includes(value)) {
        return value as TOptions[number];
    } else {
        throw `Got ${value}, expected ${options.join(', ')}`
    }
}

function parseLine(line: string): AutoInstruction {
    const [inst, ...args] = line.split(" ");

    if (inst == 'diffDrive') {
        return {
            type: 'diffDrive',
            left: Number(args[0]),
            right: Number(args[1]),
            duration: parseTimeArg(args[3])
        }
    } else if (inst == 'drive') {
        const [speed, _, durationOrDistance] = args;

        try {
            const duration = parseTimeArg(durationOrDistance);

            return {
                type: "driveDuration",
                duration,
                speed: Number(speed)
            }
        } catch (e) {
            return {
                type: "driveDistance",
                distance: parseDistanceArg(durationOrDistance),
                speed: Number(speed)
            }
        }
    } else if (inst == 'wait') {
        return {
            type: 'wait',
            duration: parseTimeArg(args[0])
        }
    } else if (inst == 'turn') {
        const toOrRelative = parseStringArg(args[0], 'to', 'relative');
        const headingOrRotation = parseRotationArg(args[1]);

        if (toOrRelative == 'to') {
            return {
                type: 'turnToHeading',
                heading: headingOrRotation
            }
        } else if (toOrRelative == 'relative') {
            return {
                type: 'relativeTurn',
                rotation: headingOrRotation
            }
        } else {
            throw 'never';
        }
    } else if (inst == 'arm') {
        if (args[0] == 'up') {
            return {
                type: 'armUp'
            }
        } else if (args[0] == 'down') {
            return {
                type: 'armDown'
            }
        } else {
            throw `Expected 'up' or 'down', got '${args[0]}`
        }
    } else if (inst == 'intake') {
        return {
            type: 'intake',
            direction: parseStringArg(args[0], 'in', 'out'),
            duration: parseTimeArg(args[2])
        }
    } else {
        throw `Unknown instruction ${inst}`
    }
}