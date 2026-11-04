/*
 * Storm cloud: a ray-marched volumetric cloud with random inner lightning.
 *
 *   <script src="/js/storm-cloud.js"></script>
 *   stormCloud(document.getElementById('my-canvas'), { scale: 0.5, fps: 30 });
 *   stormCloud(wideCanvas, { crop: 0.24 });   // just the top of the cloud, like a horizon
 *
 * The canvas is sized by CSS; the shader draws into a smaller buffer
 * (`scale`) and the browser scales it up, which the soft cloud hides.
 * It renders on opaque white, so put it over light-to-mid backgrounds
 * with `mix-blend-mode: multiply`; on a dark section it disappears.
 *
 * It only draws while the canvas is on screen, and draws one still frame
 * for visitors who ask for reduced motion. Each canvas holds its own WebGL
 * context, and browsers cap those, so keep it to one or two per page.
 */
(function (global) {
    'use strict';

    var VERTEX = [
        'attribute vec2 a_position;',
        'void main() { gl_Position = vec4(a_position, 0, 1); }'
    ].join('\n');

    var FRAGMENT = `
        precision mediump float;
        uniform vec2 iResolution;   // size of the whole frame, which can be taller than the canvas (crop)
        uniform float iYOffset;     // how far the canvas's bottom edge sits above the frame's bottom
        uniform float iTime;

        vec3 rY(vec3 p, float a) {
            vec3 q = p;
            float c = cos(a);
            float s = sin(a);
            q.x = c * p.x + s * p.z;
            q.z = -s * p.x + c * p.z;
            return q;
        }

        vec2 sphereIntersectionDistances(vec3 rayOrigin, vec3 rayDirection, vec3 sphereOrigin, float sphereRadius) {
            vec3 toCenter = sphereOrigin - rayOrigin;
            float toCenterAlongRay = dot(toCenter, rayDirection);
            float perpendicularDistanceSquared = dot(toCenter, toCenter) - toCenterAlongRay * toCenterAlongRay;
            float radiusSquared = sphereRadius * sphereRadius;

            if (perpendicularDistanceSquared > radiusSquared) {
                return vec2(0.);
            }

            float insideSphereAlongRay = sqrt(radiusSquared - perpendicularDistanceSquared);
            float intersection1 = toCenterAlongRay - insideSphereAlongRay;
            float intersection2 = toCenterAlongRay + insideSphereAlongRay;
            if (intersection1 > intersection2) {
                float t = intersection1;
                intersection1 = intersection2;
                intersection2 = t;
            }

            if (intersection1 < 0.) {
                if (intersection2 < 0.) {
                    return vec2(0.);
                } else {
                    intersection1 = intersection2;
                    intersection2 = 0.;
                }
            }

            return vec2(intersection1, intersection2);
        }

        vec3 hash(vec3 p) {
            p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                     dot(p, vec3(269.5, 183.3, 246.1)),
                     dot(p, vec3(113.5, 271.9, 124.6)));
            return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float noise(in vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            vec3 u = f * f * (3.0 - 2.0 * f);

            return mix(mix(mix(dot(hash(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
                               dot(hash(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
                           mix(dot(hash(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
                               dot(hash(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
                       mix(mix(dot(hash(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
                               dot(hash(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
                           mix(dot(hash(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
                               dot(hash(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
        }

        float hash11(float p) {
            p = fract(p * .1031);
            p *= p + 33.33;
            p *= p + p;
            return fract(p);
        }

        vec3 hash31(float p) {
            vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.xxy + p3.yzz) * p3.zyx);
        }

        float octavedNoise(vec3 position) {
            vec3 samplePosition = position * 2.;
            float noiseAmount = noise(samplePosition + iTime * vec3(0.0, 0.2, 0.0));
            samplePosition *= 1.99;
            noiseAmount += noise(samplePosition + iTime * vec3(0.05, -0.37, 0.02)) * 0.51;
            noiseAmount /= 1.51;
            return noiseAmount;
        }

        float density(vec3 position) {
            float baseValue = 1.0 - pow(max(0.0, length(position)), 2.0);
            float noiseAmount = octavedNoise(position);
            return max(0., min(1., baseValue - max(0., noiseAmount * 1.5)));
        }

        // xyz: where the flash is inside the cloud; w: its brightness (0 between strikes)
        vec4 innerLightPositionAndIntensity() {
            float scaledTime = iTime * 6.1;
            float hashInput = floor(scaledTime) * 0.1;

            if (hash11(hashInput) < 0.8) return vec4(0.);

            vec3 hash = hash31(hashInput);
            float theta = hash.x * 6.283;
            float z = hash.y * 2. - 1.;
            float sinPhi = sin(acos(z));
            vec3 position = vec3(sinPhi * cos(theta), sinPhi * sin(theta), z) * (0.6 + hash.z * 0.2);

            float intensity = sin(fract(scaledTime) * 3.142);

            return vec4(position, intensity);
        }

        vec4 march(vec3 origin, vec3 direction) {
            const int mainSteps = 30;
            const int shadowSteps = 10;
            const vec3 toLight = normalize(vec3(1.0, 1.0, 0.));
            const float mainDensityScale = 4.;

            const float shadowingThreshold = 0.001;
            const float shadowDensityScale = 3.;

            vec3 light = vec3(0.);
            float transmittance = 1.;

            vec3 samplePosition = origin;

            const float mainStepLength = 2. / float(mainSteps);
            const float shadowStepLength = 1. / float(shadowSteps);

            const vec3 scaledShadowDensity = shadowDensityScale * shadowStepLength / vec3(0.8, 0.7, 1.0);
            const float shadowConstant = -log(shadowingThreshold) / scaledShadowDensity.z;

            const vec3 mainLightColor = vec3(0.6, 0.8, 1.1);
            const vec3 innerLightColor = vec3(0.7, 0.4, 1.) * 4.;

            vec3 mainStepAmount = direction * mainStepLength;
            vec3 shadowStepAmount = toLight * shadowStepLength;
            vec4 innerLight = innerLightPositionAndIntensity();
            // about 80% of frames have no strike; skip the second shadow march entirely then
            bool lightning = innerLight.w > 0.;

            for (int i = 0; i < mainSteps; i++) {
                float localDensity = min(1.0, density(samplePosition) * mainDensityScale);
                if (localDensity > 0.001) {

                    vec3 shadowSamplePosition = samplePosition;
                    float shadowAccumulation = 0.;
                    for (int j = 0; j < shadowSteps; j++) {
                        shadowSamplePosition += shadowStepAmount;
                        shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                        if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
                    }

                    vec3 shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
                    float stepDensity = min(1., localDensity * mainStepLength);
                    vec3 absorbedLight = shadowTerm * stepDensity;

                    light += absorbedLight * transmittance * mainLightColor;

                    if (lightning) {
                        shadowSamplePosition = samplePosition;
                        shadowAccumulation = 0.;
                        vec3 toInnerLight = innerLight.xyz - samplePosition;
                        vec3 innerLightShadowStepAmount = normalize(toInnerLight) * shadowStepLength;

                        for (int j = 0; j < shadowSteps; j++) {
                            shadowSamplePosition += innerLightShadowStepAmount;
                            shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                            if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
                        }

                        shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
                        absorbedLight = shadowTerm * stepDensity;

                        float attenuation = min(1.0, 1.0 / (dot(toInnerLight, toInnerLight) * 2. + 0.0001)) * innerLight.w;
                        light += absorbedLight * (transmittance * attenuation) * innerLightColor;
                    }

                    transmittance *= (1.0 - stepDensity);

                    if (transmittance < 0.01) {
                        break;
                    }
                }

                samplePosition += mainStepAmount;
            }

            return vec4(vec3(light), transmittance);
        }

        void main() {
            vec2 uv = 2.0 * ((gl_FragCoord.xy + vec2(0., iYOffset)) / iResolution.xy - 0.5);
            uv.x *= iResolution.x / iResolution.y;
            const vec3 cameraLookAt = vec3(0.0, 0.0, 0.0);
            vec3 cameraPosition = rY(vec3(0.0, 0.1, 1.0) * 2.5, iTime * 0.2);
            vec3 cameraForward = normalize(cameraLookAt - cameraPosition);
            vec3 cameraRight = cross(cameraForward, vec3(0.0, 1.0, 0.0));
            vec3 cameraUp = cross(cameraRight, cameraForward);

            vec3 rayDirection = normalize(uv.x * cameraRight + uv.y * cameraUp + 2.0 * cameraForward);
            vec2 rayDistances = sphereIntersectionDistances(cameraPosition, rayDirection, vec3(0.), 1.);

            vec3 backgroundColor = vec3(1.0);

            if (rayDistances.x != 0. && rayDistances.y != 0.) {
                vec3 farIntersection = cameraPosition + rayDirection * rayDistances.y;
                vec4 value = march(farIntersection, -rayDirection);
                gl_FragColor = vec4(mix(value.rgb, backgroundColor, value.w), 1.0);
            } else {
                gl_FragColor = vec4(backgroundColor, 1.0);
            }
        }
    `;

    function compile(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('storm-cloud: shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    /**
     * @param {HTMLCanvasElement} canvas  sized by CSS
     * @param {{scale?: number, fps?: number, crop?: number, timeOffset?: number}} [options]
     *   scale: drawing-buffer size relative to the canvas's CSS size (default 0.5)
     *   timeOffset: seconds added to the clock, so a second cloud on the page has its own
     *          shape and its own lightning instead of mirroring the first (default 0)
     *   crop:  the canvas shows only this top fraction of the frame (default 1, the whole frame).
     *          The cloud fills about 87% of the frame's height, centred, so on a canvas
     *          with height = 0.24 x width, crop 0.24 shows roughly the top 20% of the cloud.
     *          Hidden pixels are never drawn.
     *   fps:   frame cap; the cloud drifts slowly, so 30 looks the same as 60 (default 30)
     */
    function stormCloud(canvas, options) {
        if (!canvas) return;
        options = options || {};
        var scale = options.scale || 0.5;
        var crop = options.crop || 1;
        var timeOffset = options.timeOffset || 0;
        var frameInterval = 1000 / (options.fps || 30);

        var gl = canvas.getContext('webgl', { alpha: true }) ||
                 canvas.getContext('experimental-webgl', { alpha: true });
        if (!gl) return; // no WebGL: the hero just has no cloud

        var vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
        var fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
        if (!vs || !fs) return;

        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('storm-cloud: program link failed:', gl.getProgramInfoLog(program));
            return;
        }

        // one full-screen quad, set up once
        gl.useProgram(program);
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        var position = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        var uResolution = gl.getUniformLocation(program, 'iResolution');
        var uTime = gl.getUniformLocation(program, 'iTime');
        var uYOffset = gl.getUniformLocation(program, 'iYOffset');

        function resize() {
            var w = Math.max(1, Math.round(canvas.clientWidth * scale));
            var h = Math.max(1, Math.round(canvas.clientHeight * scale));
            // assigning width/height reallocates the buffer even when unchanged, so only on a real resize
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        }

        function draw(time) {
            resize();
            var frameHeight = canvas.height / crop;
            gl.uniform2f(uResolution, canvas.width, frameHeight);
            gl.uniform1f(uYOffset, frameHeight - canvas.height);
            gl.uniform1f(uTime, time * 0.001 + timeOffset);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        var still = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (still) {
            // one frame of cloud, no drift and no lightning flicker
            requestAnimationFrame(function () { draw(0); });
            global.addEventListener('resize', function () { draw(0); });
            return;
        }

        var visible = false;
        var frameId = null;
        var lastDrawn = -Infinity;

        function tick(time) {
            // small tolerance so a 60 Hz display lands on every second frame rather than drifting
            if (time - lastDrawn >= frameInterval - 2) {
                lastDrawn = time;
                draw(time);
            }
            frameId = visible ? requestAnimationFrame(tick) : null;
        }

        // nothing runs while the canvas is scrolled away
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible && frameId === null) frameId = requestAnimationFrame(tick);
        }).observe(canvas);
    }

    global.stormCloud = stormCloud;
})(window);
