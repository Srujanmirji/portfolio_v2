import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
const fragmentSource = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_scroll;
uniform vec2 u_pointer;
uniform float u_force;
uniform float u_strength;
uniform vec2 u_crop;
varying vec2 v_uv;
void main() {
  vec2 delta = v_uv - u_pointer;
  float falloff = exp(-dot(delta, delta) * 18.0);
  float reveal = sin(u_scroll * 3.14159265);
  vec2 offset = vec2(sin(v_uv.y * 12.0 + u_scroll * 6.283185) * reveal, 0.0);
  offset += u_force * falloff * vec2(delta.y * 2.0, sin(v_uv.x * 10.0) * 0.5);
  vec2 uv = clamp(v_uv + offset * u_strength, 0.0, 1.0);
  uv = uv * u_crop + vec2(0.0, (1.0 - u_crop.y) * 0.5);
  gl_FragColor = texture2D(u_image, uv);
}`;

// One textured triangle: no scene graph, depth buffer, particles or idle loop.
function createPortraitScene(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  const dispose = (releaseContext = false) => {
    gl.useProgram(null);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (releaseContext) gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
  try {
    if (!program || !buffer || !texture) throw new Error("WebGL allocation failed");
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader allocation failed");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed");
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    if (gl.getError() !== gl.NO_ERROR) throw new Error("Texture upload failed");
    const scroll = gl.getUniformLocation(program, "u_scroll");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const force = gl.getUniformLocation(program, "u_force");
    const crop = gl.getUniformLocation(program, "u_crop");
    gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);
    gl.uniform1f(gl.getUniformLocation(program, "u_strength"), parseFloat(getComputedStyle(canvas).getPropertyValue("--hero-distortion-strength")));
    return {
      resize(width: number, height: number, dpr: number) {
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        // Match the DOM image's object-fit: cover / object-position: left center.
        const ratio = (width / height) / (image.naturalWidth / image.naturalHeight);
        gl.uniform2f(crop, Math.min(1, ratio), Math.min(1, 1 / ratio));
      },
      draw(progress: number, x: number, y: number, strength: number) {
        if (gl.isContextLost()) return false;
        gl.uniform1f(scroll, progress);
        gl.uniform2f(pointer, x, y);
        gl.uniform1f(force, strength);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return true;
      },
      dispose,
    };
  } catch {
    dispose(true);
    return null;
  }
}

export function mountPortraitScene(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const scene = createPortraitScene(canvas, image);
  if (!scene) { canvas.dataset.state = "unavailable"; return; }
  const portrait = canvas.parentElement!;
  const stage = canvas.closest<HTMLElement>(".hero-stage")!;
  const device = navigator as Navigator & { deviceMemory?: number };
  const dpr = Math.min(devicePixelRatio || 1, (device.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4 ? 1 : 1.5);
  scene.resize(portrait.clientWidth, portrait.clientHeight, dpr);
  const state = { progress: 0, x: 0.5, y: 0.5, force: 0 };
  let alive = true;
  let visible = false;
  let frame = 0;
  const render = () => {
    frame = 0;
    if (!alive || !visible || document.hidden) return;
    // Reuse the real hero pin's range; measuring an already pinned stage again
    // would introduce a second, incorrect scroll coordinate system.
    const story = ScrollTrigger.getAll().find((trigger) => trigger.trigger === stage && trigger.vars.pin);
    state.progress = story ? gsap.utils.clamp(0, 1, (scrollY - story.start) / (story.end - story.start)) : 0;
    if (scene.draw(state.progress, state.x, state.y, state.force) && canvas.dataset.state !== "ready") canvas.dataset.state = "ready";
  };
  const invalidate = () => { if (alive && visible && !document.hidden && !frame) frame = requestAnimationFrame(render); };
  const duration = parseFloat(getComputedStyle(canvas).getPropertyValue("--duration-base")) / 1000;
  const x = gsap.quickTo(state, "x", { duration, ease: "power2.out", onUpdate: invalidate });
  const y = gsap.quickTo(state, "y", { duration, ease: "power2.out", onUpdate: invalidate });
  const force = gsap.quickTo(state, "force", { duration, ease: "power2.out", onUpdate: invalidate });
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !visible || document.hidden) return;
    const bounds = portrait.getBoundingClientRect();
    x(gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width));
    y(gsap.utils.clamp(0, 1, 1 - (event.clientY - bounds.top) / bounds.height));
    force(1);
  };
  const leave = () => force(0);
  const size = new ResizeObserver(([entry]) => {
    scene.resize(entry.contentRect.width, entry.contentRect.height, dpr);
    invalidate();
  });
  size.observe(portrait);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate();
    else { gsap.killTweensOf(state); cancelAnimationFrame(frame); frame = 0; state.force = 0; }
  });
  observer.observe(portrait);
  window.addEventListener("scroll", invalidate, { passive: true });
  ScrollTrigger.addEventListener("refresh", invalidate);
  const lost = (event: Event) => { event.preventDefault(); cleanup(); canvas.dataset.state = "unavailable"; };
  const visibility = () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; gsap.killTweensOf(state); state.force = 0; }
    else invalidate();
  };
  portrait.addEventListener("pointermove", move, { passive: true });
  portrait.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", visibility);
  const cleanup = (releaseContext = false) => {
    if (!alive) return;
    alive = false;
    canvas.dataset.state = "fallback";
    cancelAnimationFrame(frame);
    gsap.killTweensOf(state);
    window.removeEventListener("scroll", invalidate);
    ScrollTrigger.removeEventListener("refresh", invalidate);
    observer.disconnect();
    size.disconnect();
    portrait.removeEventListener("pointermove", move);
    portrait.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("webglcontextlost", lost);
    document.removeEventListener("visibilitychange", visibility);
    scene.dispose(releaseContext);
  };
  return cleanup;
}
