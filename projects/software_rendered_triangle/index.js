const app = document.getElementById("app");
app.width = 800;
app.height = 600;
const ctx = app.getContext("2d");
let w = null;
let mouse_x = null;
let mouse_y = null;
app.addEventListener("mousemove", function (ev) {
    mouse_x = ev.clientX;
    mouse_y = ev.clientY;
}, false);

let mouse_down = false;
app.addEventListener("mousedown", function (e) {
    mouse_down = true;
}, false);
app.addEventListener("mouseup", function (e) {
    mouse_down = false;
}, false);

function fenster_mouse_down() {
    if (mouse_down) {
        console.log(mouse_x, mouse_y);
    }
    return mouse_down;
}

function fenster_mouse_x() {
    return mouse_x;
}

function fenster_mouse_y() {
    return mouse_y;
}

function make_environment(...envs) {
    return new Proxy(envs, {
        get(target, prop, receiver) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args) => {console.error("Not implemented: "*prop, args)};
        }
    });
}

WebAssembly.instantiateStreaming(fetch("./wasm.wasm"), {
    "env": make_environment({
        "atan2f": Math.atan2,
        "cosf": Math.cos,
        "sinf": Math.sin,
        "fenster_mouse_down": fenster_mouse_down,
        "fenster_mouse_x": fenster_mouse_x,
        "fenster_mouse_y": fenster_mouse_y,
    }), 
}).then(w0 => {
    w = w0;

    let prev = null;
    function first(timestamp) {
        prev = timestamp;
        window.requestAnimationFrame(loop);
    }
    function loop(timestamp) {
        const dt = timestamp - prev;
        prev = timestamp;

        const buffer = w.instance.exports.memory.buffer;
        const pixels = w.instance.exports.render(dt*0.001);
        const image = new ImageData(
            new Uint8ClampedArray(buffer, pixels, app.width*app.height*4),
            app.width,
        );
        ctx.putImageData(image, 0, 0);
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(first);


});

