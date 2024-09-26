function hasAlertFinished () {
    return !(playFinishAnimation) && !(playFinishSound)
}
function resetByShake () {
    if (state == STATE_PAUSE) {
        reset()
        safeDisplayString("RESET")
    }
}
function initializeStates () {
    STATE_INIT = 0
    STATE_DELAY = 1
    STATE_TICK = 2
    STATE_TIMER_FINISH = 3
    STATE_PAUSE = 4
}
function shouldPlot (row: number, column: number) {
    ledIndex = row * 5 + column
    ledMinActiveTime = ledIndex * totalTime / 25
    if (activeLed == ledIndex) {
        blink = !(blink)
        return blink
    } else {
        return timer > ledMinActiveTime
    }
}
function safeDisplayString (text: string) {
    stringsToDisplay += 1
    basic.showString(" " + text)
    stringsToDisplay += -1
}
input.onButtonPressed(Button.A, function () {
    startOrPause()
})
function displayLeds () {
    if (stringsToDisplay == 0) {
        if (isWorkTime) {
            totalTime = workTime
        } else {
            totalTime = breakTime
        }
        activeLed = Math.floor(timer / totalTime * 25)
        if (activeLed != lastActiveLed) {
            blink = !(blink)
        }
        lastActiveLed = activeLed
        plotLeds()
    }
}
function displayTime () {
    minutes = Math.floor(timer / 60)
    secs = timer % 60
    if (secs < 10) {
        secString = "0" + secs
    } else {
        secString = convertToText(secs)
    }
    safeDisplayString("" + minutes + ":" + secString)
}
input.onButtonPressed(Button.B, function () {
    displayTime()
})
function plotLeds () {
    for (let row = 0; row <= 4; row++) {
        for (let column = 0; column <= 4; column++) {
            if (shouldPlot(row, column)) {
                led.plot(column, row)
            } else {
                led.unplot(column, row)
            }
        }
    }
}
input.onGesture(Gesture.Shake, function () {
    resetByShake()
})
function startOrPause () {
    if (state == STATE_INIT) {
        state = STATE_DELAY
        safeDisplayString("START")
    } else if (state == STATE_DELAY) {
        state = STATE_PAUSE
        safeDisplayString("PAUSE")
    } else if (state == STATE_TICK) {
        while (state == STATE_TICK) {
        	
        }
        startOrPause()
    } else if (state == STATE_PAUSE) {
        state = STATE_DELAY
        safeDisplayString("START")
    }
}
function reset () {
    workTime = 25 * 60
    breakTime = 5 * 60
    timer = workTime
    isWorkTime = true
    playFinishAnimation = false
    playFinishSound = false
    state = STATE_INIT
}
let secString = ""
let secs = 0
let minutes = 0
let lastActiveLed = 0
let breakTime = 0
let workTime = 0
let isWorkTime = false
let stringsToDisplay = 0
let timer = 0
let blink = false
let activeLed = 0
let totalTime = 0
let ledMinActiveTime = 0
let ledIndex = 0
let STATE_TIMER_FINISH = 0
let STATE_TICK = 0
let STATE_DELAY = 0
let STATE_INIT = 0
let STATE_PAUSE = 0
let state = 0
let playFinishSound = false
let playFinishAnimation = false
led.setBrightness(50)
music.setVolume(80)
initializeStates()
reset()
basic.showString("POMODORO")
basic.forever(function () {
    if (state == STATE_PAUSE) {
        basic.showString("P")
    }
})
basic.forever(function () {
    if (state == STATE_DELAY) {
        basic.pause(1000 - input.runningTime() % 1000)
        if (state == STATE_DELAY) {
            state = STATE_TICK
        }
    }
})
basic.forever(function () {
    if (state == STATE_TICK) {
        timer += -1
        displayLeds()
        if (timer == 0) {
            playFinishAnimation = true
            playFinishSound = true
            state = STATE_TIMER_FINISH
        } else {
            state = STATE_DELAY
        }
    }
})
basic.forever(function () {
    if (state == STATE_TIMER_FINISH) {
        if (hasAlertFinished()) {
            isWorkTime = !(isWorkTime)
            if (isWorkTime) {
                timer = workTime
                safeDisplayString("WORK")
            } else {
                timer = breakTime
                safeDisplayString("BREAK")
            }
            state = STATE_DELAY
        }
    }
})
basic.forever(function () {
    if (playFinishAnimation) {
        for (let index = 0; index < 4; index++) {
            basic.showLeds(`
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                `)
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        }
        playFinishAnimation = false
    }
})
basic.forever(function () {
    if (playFinishSound) {
        if (isWorkTime) {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerDown), music.PlaybackMode.UntilDone)
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
        }
        playFinishSound = false
    }
})
