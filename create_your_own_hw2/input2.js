// /*
// * all the code for homework 2 goes into this file.
// You will attach event handlers to the document, workspace, and targets defined in the html file
// to handle mouse, touch and possible other events.
// */

// //current status
// //all working except for case where mouse up on background after blue div goes to original position - resets divs

// const divs = document.querySelectorAll(".target");

// var locX = 0;
// var locY = 0;
// var shiftX = 0;
// var shiftY = 0;
// var widthRect = 0;
// var heightRect = 0;
// var selectedDiv = null;
// var escapePressed = false;

// const resetDivs = () => {
//     divs.forEach((div) => {
//         div.className = "target";
//     });
// }

// divs.forEach((div) => {
//     // const clickListener = (event) => {
//     //     console.log("hi");
//     //     resetDivs();
//     //     div.className = "target selected";
//     // };

//     // div.addEventListener("click", clickListener);

//     // div.addEventListener("dblclick", (event) => {
//     //     console.log("doubleHi");

//     //     div.onmouseup = () => {
//     //         document.removeEventListener('mousemove', onMouseMove);
//     //         div.onmouseup = null;
//     //     };
//     // })

//     div.onmousedown = (event) => {
//         // console.log(event);
//         selectedDiv = div;
//         locX = event.clientX;
//         locY = event.clientY;
//         shiftX = event.clientX - div.getBoundingClientRect().left;
//         shiftY = event.clientY - div.getBoundingClientRect().top;
//         widthRect = div.getBoundingClientRect().left;
//         heightRect = div.getBoundingClientRect().top;

//         // div.removeEventListener("click", clickListener);
//         // div.style.position = "absoulute";
//         // div.style.zIndex = 100;

//         // document.body.append(div);

//         const onMouseMove = (event) => {
//             div.style.left = event.pageX - shiftX + 'px';
//             div.style.top = event.pageY - shiftY + 'px';
//         };

//         document.onmousemove = onMouseMove;

//         div.onmouseup = (event) => {
//             console.log("mnouse up")
//             document.onmousemove = null;
//             div.onmouseup = onMouseUp;
//             document.removeEventListener("keydown", keyPress);
//             event.stopPropagation();
//         };

//         const keyPress = (event) => {
//             if (event.key == "Escape") {
//                 console.log("key press")
//                 console.log(selectedDiv);
//                 console.log(event)
//                 selectedDiv.style.left = locX - shiftX + 'px';
//                 selectedDiv.style.top = locY - shiftY + 'px';
//                 document.onmousemove = null;
//                 selectedDiv.onmouseup = onMouseUp;
//                 selectedDiv.removeEventListener("click", onClick)
//                 document.removeEventListener("keydown", keyPress);
//                 event.preventDefault();
//                 event.stopImmediatePropagation();
//             }
//         }

//         document.addEventListener("keydown", keyPress);

//         event.stopPropagation();
//     };

//     const onMouseUp = (event) => {
//         event.stopImmediatePropagation();
//     };

//     div.onmouseup = onMouseUp;

//     const onClick = (event) => {
//         console.log("click")
//         if (event.clientX == locX && event.clientY == locY) {
//             resetDivs();
//             div.className = "target selected"
//         }
//         event.stopPropagation();
//     };

//     div.addEventListener("click", onClick, true)

//     div.addEventListener("dblclick", (event) => {
//         // console.log("Hellooo")
//         console.log(event);
//         locX = event.clientX;
//         locY = event.clientY;
//         let shiftX = event.clientX - div.getBoundingClientRect().left;
//         let shiftY = event.clientY - div.getBoundingClientRect().top;

//         const onMouseMove = (event) => {
//             div.style.left = event.pageX - shiftX + 'px';
//             div.style.top = event.pageY - shiftY + 'px';
//         };

//         document.onmousemove = onMouseMove;
//         event.stopPropagation();
//     }, true)
// });

// document.addEventListener("click", (event) => {
//     // console.log(event);
//     resetDivs();
//     console.log("BYE")
// }, false)

// // document.onkeydown = (event) => {
// //     console.log(event);
// //     if (event.key == "Escape") {
// //         escapePressed = true;
// //         console.log("ESCAPE");
// //         // console.log(event.target.selectionStart);
// //         console.log(event.view.locX);
// //         console.log(event.view.locY);
// //         console.log(locX);
// //         console.log(locY);

// //         selectedDiv.style.left = locX - shiftX + 'px';
// //         selectedDiv.style.top = locY - shiftY + 'px';

// //         event.stopImmediatePropagation();
// //         // event.stopPropagation();
// //     }
// // }

/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.
*/

//current status
//all working except for case where mouse up on background after blue div goes to original position - resets divs
// after double tap the div can't be tapped again
// resizing - dont need to have fingers on original div

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
}

// monitors if background is clicked; resets divs
document.addEventListener("click", (event) => {
    resetDivs();
}, false)

document.addEventListener("touchstart", (event) => {
    const touches = event.touches;
    if (touches.length == 2 && selectedDiv != null && touchState != "abortDrag") {
        event.preventDefault();
        event.stopImmediatePropagation()
        touchState = "resize";
        selectedDiv.removeEventListener("touchstart", handleStart)
        selectedDiv.addEventListener("touchstart", handleSizeStart)
        changeSize(touches[0], touches[1]);
    }
}, true)

var handleStart = null;

var handleSizeStart = (event) => {
    if (event.touches.length == 2 && selectedDiv != null && touchState != "abortDrag") {
        event.preventDefault();
        touchState = "resize";
        changeSize(event.touches[0], event.touches[1]);
    }
}

const changeSize = (left, right) => {

    // touch locations
    const leftX = left.clientX
    const leftY = left.clientY
    const rightX = right.clientX
    const rightY = right.clientY

    // x similar - change horizontally
    if (Math.abs(rightY - leftY) < Math.abs(rightX - leftX)) {
        // div.style.backgroundColor = "brown";
        const sizeX = selectedDiv.style.width;
        const changeHorizontal = (event) => {
            selectedDiv.style.backgroundColor = "brown";
            // const newLeftX = event.touches[0].clientX
            // const newRightX = event.touches[1].clientX
            // use move distance
            const newLeftX = Math.min([event.touches[0].clientX, event.touches[1].clientX])
            const newRightX = Math.max([event.touches[0].clientX, event.touches[1].clientX])
            const left = leftX - newLeftX;
            const right = newRightX - rightX;
            const newWidth = Math.abs(left + right + selectedDiv.style.width) + 'px';
            selectedDiv.style.width = newWidth;
            selectedDiv.style.left = (selectedDiv.style.left - left) + "px";
            // selectedDiv.style.left = (leftX + (sizeX - newWidth)) + 'px';
        }
        selectedDiv.ontouchmove = changeHorizontal;
        selectedDiv.ontouchend = (event) => {
            if (event.touches.length == 0) {
                selectedDiv.ontouchmove = null;
                selectedDiv.ontouchend = null;
                selectedDiv.style.backgroundColor = "red";
            } else if (event.touches.length == 1) {
                selectedDiv.ontouchmove = null;
                selectedDiv.style.backgroundColor = "red";
            }
        }
    } else {
        const sizeY = selectedDiv.style.height;
        const changeVertical = (event) => {
            selectedDiv.style.backgroundColor = "yellow";
            const newLeftY = event.touches[0].clientY
            const newRightY = event.touches[1].clientY
            const newHeight = Math.abs(newRightY - newLeftY) + 'px';
            selectedDiv.style.height = newHeight;
            selectedDiv.style.top = (leftY + ((sizeY - newWidth) / 2)) + 'px';
        }
        selectedDiv.ontouchmove = changeVertical;
        selectedDiv.ontouchend = (event) => {
            if (event.touches.length == 0) {
                selectedDiv.ontouchmove = null;
                selectedDiv.ontouchend = null;
                selectedDiv.style.backgroundColor = "red";
                selectedDiv.removeEventListener("touchstart", handleSizeStart);
                selectedDiv.addEventListener("touchstart", handleStart)
            } else if (event.touches.length == 1) {
                selectedDiv.ontouchmove = null;
                selectedDiv.style.backgroundColor = "red";
            }
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
            console.log("mnouse up")
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
            selectedDiv.style.left = locX - shiftX + 'px';
            selectedDiv.style.top = locY - shiftY + 'px';
            selectedDiv.onmouseup = onMouseUp;
            selectedDiv.removeEventListener("click", onClick)
            document.onmousemove = null;
            document.removeEventListener("keydown", onKeyPress);
        }
    }

    //touch events
    const onTap = (event) => {
        touchState = "tap"
        resetDivs();
        div.className = "target selected"
        selectedDiv = div;
        console.log(event);
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
        };

        document.ontouchmove = onMouseMove;
        div.ontouchend = handleEnd;
    }

    handleStart = (event) => {
        console.log(event)
        event.preventDefault();
        var touches = event.touches;
        console.log(touches)
        if (touches.length == 1) {
            touchState = "tap";
            handleTap(touches);
        }
    }

    const handleEnd = (event) => {
        console.log(touchState)
        touchState = "double tap move"
        document.addEventListener("click", (event) => {
            touchState = ""
            document.ontouchmove = null;
            console.log("end")
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
            }, 100);
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
                subEvent.stopImmediatePropagation()
            }
            document.ontouchmove = null;
            div.ontouchend = null;

        };
    };


    div.onmousedown = onMouseDown;
    div.onmouseup = onMouseUp;
    div.addEventListener("click", onClick, true)
    div.addEventListener("dblclick", onDblClick, true)
    div.addEventListener("touchstart", handleStart, true)
});

// window.addEventListener("resize", (event) => {
//     var w = document.documentElement.clientWidth;
//     var h = document.documentElement.clientHeight;

//     console.log("resizing window")
//     console.log(w)
//     console.log(h)
//     console.log(event)
// })

// document.addEventListener("keypress", (event) => {
//     console.log(event)
//     if (event.key == "c") {
//         console.log("hello");
//         document.addEventListener("mousedown", (event) => {
//             console.log("MOUSE DOWN")
//         })

//         document.addEventListener("mouseup", (event) => {
//             console.log("MOUSE DOWN")
//         })
//     }
// })