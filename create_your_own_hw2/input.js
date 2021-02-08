/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.
*/

const divs = document.querySelectorAll(".target");

var locX = 0;
var locY = 0;
var shiftX = 0;
var shiftY = 0;
var selectedDiv = null;

var touchState = "";

// reset all divs to red
const resetDivs = () => {
    divs.forEach((div) => {
        div.className = "target";
    });
    selectedDiv = null;
    touchState = "";
}

// monitors if background is clicked; resets divs
document.addEventListener("click", (event) => {
    if (touchState != "resize" && touchState != "dblClick" && touchState != "key pressed") {
        resetDivs();
    } else {
        touchState = "";
    }
}, false)

document.addEventListener("touchstart", (event) => {
    if (touchState == "" && event.touches.length == 2 && selectedDiv != null) {
        touchState = "resize";
        changeSize(event.touches[0], event.touches[1]);
        event.stopImmediatePropagation();
    }
})

const changeSize = (left, right) => {
    // touch locations
    const leftX = Math.min(left.clientX, right.clientX);
    const leftY = Math.min(left.clientY, right.clientY);
    const rightX = Math.max(left.clientX, right.clientX);
    const rightY = Math.max(left.clientY, right.clientY);

    // const width = parseInt(selectedDiv.style.width);
    const originalWidth = parseInt(selectedDiv.style.width);
    const originalLeft = parseInt(selectedDiv.style.left);
    const originalHeight = parseInt(selectedDiv.style.height);
    const originalTop = parseInt(selectedDiv.style.top);

    // x similar - change horizontally
    if (Math.abs(rightY - leftY) < Math.abs(rightX - leftX)) {
        const changeHorizontal = (event) => {
            const width = parseInt(selectedDiv.style.width);
            const newleftX = Math.min(event.touches[0].clientX, event.touches[1].clientX);
            const newrightX = Math.max(event.touches[0].clientX, event.touches[1].clientX);
            const newWidth = ((newrightX - newleftX) - (rightX - leftX) + originalWidth);
            if (newWidth > 30) {
                selectedDiv.style.width = newWidth + 'px';
                const currentDivLeft = (parseInt(selectedDiv.style.left));
                selectedDiv.style.left = (((currentDivLeft) - Math.trunc((newWidth - width) / 2))) + 'px'
            }
        }
        const abortChangeHorizontal = (event) => {
            if (event.touches.length == 3) {
                selectedDiv.style.width = originalWidth + 'px';
                selectedDiv.style.left = originalLeft + 'px';
                document.removeEventListener("touchmove", changeHorizontal);
                document.removeEventListener("touchstart", abortChangeHorizontal);
                touchState = "";
            }
        }
        document.addEventListener("touchmove", changeHorizontal);
        document.addEventListener("touchstart", abortChangeHorizontal);
        document.ontouchend = (event) => {
            document.removeEventListener("touchmove", changeHorizontal);
            document.removeEventListener("touchstart", abortChangeHorizontal);
            touchState = "";
        }
    } else {
        const changeVertical = (event) => {
            const height = parseInt(selectedDiv.style.height);
            const newleftY = Math.min(event.touches[0].clientY, event.touches[1].clientY);
            const newrightY = Math.max(event.touches[0].clientY, event.touches[1].clientY);
            const newHeight = ((newrightY - newleftY) - (rightY - leftY) + originalHeight);
            if (newHeight > 30) {
                selectedDiv.style.height = newHeight + 'px';
                const currentDivTop = (parseInt(selectedDiv.style.top));
                selectedDiv.style.top = (((currentDivTop) - Math.trunc((newHeight - height) / 2))) + 'px'
            }
        }
        const abortchangeVertical = (event) => {
            if (event.touches.length == 3) {
                selectedDiv.style.height = originalHeight + 'px';
                selectedDiv.style.top = originalTop + 'px';
                document.removeEventListener("touchmove", changeVertical);
                document.removeEventListener("touchstart", abortchangeVertical);
                touchState = "";
            }
        }
        document.addEventListener("touchmove", changeVertical);
        document.addEventListener("touchstart", abortchangeVertical);
        document.ontouchend = (event) => {
            document.removeEventListener("touchmove", changeVertical);
            document.removeEventListener("touchstart", abortchangeVertical);
            touchState = "";
        }
    }
}

// set handlers for each div
divs.forEach((div) => {
    const onMouseMove = (event) => {
        div.style.left = event.pageX - shiftX + 'px';
        div.style.top = event.pageY - shiftY + 'px';
    };
    const onMouseDown = (event) => {
        selectedDiv = div;
        locX = event.clientX;
        locY = event.clientY;
        shiftX = event.clientX - div.getBoundingClientRect().left;
        shiftY = event.clientY - div.getBoundingClientRect().top;

        div.onmouseup = (event) => {
            document.onmousemove = null;
            div.onmouseup = onMouseUp;
            document.removeEventListener("keydown", onKeyPress);
            event.stopPropagation();
        };

        document.onmousemove = onMouseMove;
        document.addEventListener("keydown", onKeyPress);

        event.stopPropagation();
    };

    const onMouseUp = (event) => {
        event.stopImmediatePropagation();
    };

    const onClick = (event) => {
        if (event.clientX == locX && event.clientY == locY) {
            resetDivs();
            div.className = "target selected"
        }
        event.stopPropagation();
    };

    const onDblClick = (event) => {
        locX = event.clientX;
        locY = event.clientY;
        let shiftX = event.clientX - div.getBoundingClientRect().left;
        let shiftY = event.clientY - div.getBoundingClientRect().top;

        const onMouseMove = (event) => {
            div.style.left = event.pageX - shiftX + 'px';
            div.style.top = event.pageY - shiftY + 'px';
        };

        document.onmousemove = onMouseMove;
        document.addEventListener("keydown", onKeyPress);
        event.stopPropagation();
    }

    const onKeyPress = (event) => {
        if (event.key == "Escape") {
            touchState = "key pressed"
            div.style.left = locX - shiftX + 'px';
            div.style.top = locY - shiftY + 'px';
            div.onmouseup = onMouseUp;
            div.removeEventListener("click", onClick)
            document.onmousemove = null;
            document.removeEventListener("keydown", onKeyPress);
        }
    }

    //touch events
    const onTap = (event) => {
        if (touchState != "abortDrag") {
            touchState = "tap"
            resetDivs();
            div.className = "target selected"
            selectedDiv = div;
        } else {
            touchState = ""
        }
    };

    const onDblTap = (event) => {
        touchState = "double tap"
        locX = event.clientX;
        locY = event.clientY;
        let shiftX = event.clientX - div.getBoundingClientRect().left;
        let shiftY = event.clientY - div.getBoundingClientRect().top;

        const onMouseMove = (event) => {
            div.style.left = event.pageX - shiftX + 'px';
            div.style.top = event.pageY - shiftY + 'px';
            if (event.touches.length != 1) {
                touchState = "abortDblTap"
                selectedDiv.style.left = locX - shiftX + 'px';
                selectedDiv.style.top = locY - shiftY + 'px';
                document.ontouchmove = null;
                div.ontouchend = null;
                touchState = "";
                event.stopImmediatePropagation();
            }
        };

        document.ontouchmove = onMouseMove;
        div.ontouchend = handleEnd;
    }

    var handleStart = (event) => {
        event.preventDefault();
        var touches = event.touches;
        if (touches.length == 1) {
            touchState = "tap";
            handleTap(touches);
        }
    }

    const handleEnd = (event) => {
        touchState = "double tap move"
        document.addEventListener("click", (event) => {
            touchState = ""
            document.ontouchmove = null;
            event.stopImmediatePropagation();
        }, true)
        div.addEventListener("click", (event) => {
            touchState = ""
            document.ontouchmove = null;
            event.stopImmediatePropagation();
        }, true)
        event.stopImmediatePropagation();
    }

    var doubleTap = null;

    const handleTap = (touches) => {
        if (!doubleTap) {
            doubleTap = setTimeout(() => {
                doubleTap = null;
                onDrag(touches[0]);
            }, 200);
        } else {
            clearTimeout(doubleTap);
            doubleTap = null;
            onTap(touches[0]);
            onDblTap(touches[0]);
        }
    }

    const onDrag = (event) => {
        selectedDiv = div;
        locX = event.clientX;
        locY = event.clientY;
        shiftX = event.clientX - div.getBoundingClientRect().left;
        shiftY = event.clientY - div.getBoundingClientRect().top;

        const onMouseMove = (event) => {
            touchState = "drag"
            div.style.left = event.pageX - shiftX + 'px';
            div.style.top = event.pageY - shiftY + 'px';
            if (event.touches.length != 1 && touchState == "drag") {
                touchState = "abortDrag"
                selectedDiv.style.left = locX - shiftX + 'px';
                selectedDiv.style.top = locY - shiftY + 'px';
                document.ontouchmove = null;
                event.stopImmediatePropagation();
            }
        };
        document.ontouchmove = !(touchState == "double tap") ? onMouseMove : null;

        div.ontouchend = (subEvent) => {
            if (touchState != "drag") {
                touchState = "click"
                onTap(event);
            }
            document.ontouchmove = null;
            div.ontouchend = null;
            touchState = ""
        };
    };

    div.onmousedown = onMouseDown;
    div.onmouseup = onMouseUp;
    div.addEventListener("click", onClick, true)
    div.addEventListener("dblclick", onDblClick, true)
    div.addEventListener("touchstart", handleStart, true)
});