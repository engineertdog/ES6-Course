/**
 * Assignment #7 - The DOM
 *
 * This JavaScript file is used to dynamically generate 10 rectangles on the HTML page with unique IDs
 * and background colors.
 */

// Setup our rectangleContainer div reference and the reference to all of the generated rectangles.
// We also have an array of HTML color codes that will be used to generate the rectangles.
const rectangleContainer = document.getElementById("rectangleContainer");
const rectangles = document.getElementsByClassName("rectangle");
const colors = [
    "rgba(77, 197, 232, 0.95)",
    "rgba(31, 255, 81, 0.95)",
    "rgba(251, 255, 41, 0.95)",
    "rgba(255, 142, 29, 0.95)",
    "rgba(232, 43, 25, 0.95)",
    "rgba(185, 36, 255, 0.95)",
    "rgba(255, 49, 171, 0.95)",
    "rgba(131, 181, 232, 0.95)",
    "rgba(255, 215, 142, 0.95)",
    "rgba(232, 196, 67, 0.95)"
]

// Loop from 0 to 10 to create 10 rectangles from a template. The rectangle div is first created, then
// we issue the required class and set a unique ID using the loop's counter. The innerHTML is then set
// and the color used to create the rectangle is stated. Then we set the background color of the rectangle
// with the css property of the child of the rectangle (we know that the index is 0, though we could loop
// to find this). Finally, the rectangle is appended to the rectangle container.
for (let i = 0; i < 10; i++) {
    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    rectangle.id = "rect-" + i;
    rectangle.innerHTML =
        "<div class='rectangleColoredBox'></div>" +
        "<div class='rectangleText'>" +
        "   <p>" + colors[i] + "</p>" +
        "</div>";
    rectangle.childNodes[0].style.backgroundColor = colors[i];
    rectangleContainer.appendChild(rectangle);
}

console.log("The following is a list of the rectangle IDs.");

// Log each of the rectangle IDs using the rectangle reference by class name instantiated above.
for (const r of rectangles) {
    console.log(r.id);
}