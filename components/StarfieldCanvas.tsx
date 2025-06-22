import { useEffect, useRef } from 'react';
import {
    motion,
    useAnimation,
    animate,
    AnimationPlaybackControls,
} from 'framer-motion';
import * as THREE from 'three';
import { useStarfield } from '@/hooks/useStarfield';
import { UI } from '@/lib/uiConstants';

/* ───────── 전역 컨트롤 ───────── */
export const overlayControls = {
    current: null as ReturnType<typeof useAnimation> | null,
};
export const cameraControls = {
    current: null as THREE.PerspectiveCamera | null,
};
export const starfieldBackground = {
    set: (_: string, p0: number) => { },
    reset: () => { },
};

/* FOV tween 관리 */
let fovTween: AnimationPlaybackControls | null = null;
let pendingFov: number | null = null;
export const springCameraFov = (to: number) => {
    const cam = cameraControls.current;
    if (!cam) { pendingFov = to; return; }

    fovTween?.stop();
    fovTween = animate(cam.fov, to, {
        duration: UI.WORMHOLE.duration,
        ease: 'easeOut',
        onUpdate: (v) => {
            cam.fov = v as number;
            cam.updateProjectionMatrix();
        },
        onComplete: () => { fovTween = null; },
    });
};

export default function StarfieldCanvas() {
    const mountRef = useStarfield();
    const ovCtrl = useAnimation(); overlayControls.current = ovCtrl;
    const inited = useRef(false);

    useEffect(() => {
        const init = () => {
            if (inited.current) return;

            const canvas = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
            const scene = (canvas as any)?.__threeScene as THREE.Scene | undefined;
            const renderer = (canvas as any)?.__threeRenderer as THREE.WebGLRenderer | undefined;
            if (!canvas || !scene || !renderer) { requestAnimationFrame(init); return; }

            /* ── 색 공간 / 톤매핑 (버전 자동 대응) ─────────────────── */
            const sRGB = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding ?? 3001;
            const noTM = (THREE as any).NoToneMapping ?? 0;

            if ('outputColorSpace' in renderer) {
                (renderer as any).outputColorSpace = sRGB;   // three r152+
            } else {
                (renderer as any).outputEncoding = sRGB;   // three r151-
            }
            renderer.toneMapping = noTM;

            /* ── 카메라 확보 or 생성 ─────────────────────────────── */
            let camera =
                (canvas as any).__threeCamera ||
                (scene.children.find(o => (o as any).isCamera) as THREE.PerspectiveCamera) ||
                null;

            if (!camera) {
                camera = new THREE.PerspectiveCamera(
                    UI.WORMHOLE.fovNear,
                    window.innerWidth / window.innerHeight,
                    0.1, 2000
                );
                camera.position.z = 15;
                scene.add(camera);
                (canvas as any).__threeCamera = camera;
            }

            cameraControls.current = camera;
            camera.fov = UI.WORMHOLE.fovNear;
            camera.updateProjectionMatrix();
            inited.current = true;

            /* ── clearColor helpers ─────────────────────────────── */
            let currentClear = new THREE.Color(UI.THEME.default);
            const toLin = (hex: string) =>
                new THREE.Color(hex).convertSRGBToLinear();

            starfieldBackground.set = (hex: string, ms = 600) => {
                const target = toLin(hex);
                const from = currentClear.clone();
                const dur = ms / 1000;

                let start: number | null = null;
                const ease = (k: number) => k < .5 ? 2 * k * k : -1 + (4 - 2 * k) * k;
                const step = (ts: DOMHighResTimeStamp) => {
                    if (start === null) start = ts;
                    const k = Math.min((ts - start) / ms, 1);
                    renderer.setClearColor(from.clone().lerp(target, ease(k)), 1);
                    if (k < 1) requestAnimationFrame(step);
                    else currentClear.copy(target);
                };
                if (ms === 0) { renderer.setClearColor(target, 1); currentClear.copy(target); }
                else requestAnimationFrame(step);
            };
            starfieldBackground.reset = () => renderer.setClearColor(toLin('#000'), 1);
            starfieldBackground.reset();

            /* 대기 FOV 실행 */
            if (pendingFov !== null) { springCameraFov(pendingFov); pendingFov = null; }

            /* 리사이즈 */
            const resize = () => {
                renderer.setSize(innerWidth, innerHeight);
                camera.aspect = innerWidth / innerHeight;
                camera.updateProjectionMatrix();
            };
            resize(); window.addEventListener('resize', resize);

            /* 렌더 루프 */
            let loopId = 0;
            const loop = () => {
                renderer.render(scene, camera);
                loopId = requestAnimationFrame(loop);
            };
            loop();

            return () => {
                window.removeEventListener('resize', resize);
                cancelAnimationFrame(loopId);
            }
        };

        init();
    }, [mountRef]);

    return (
        <>
            <motion.div ref={mountRef} className="fixed inset-0 -z-10" />
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ mixBlendMode: 'screen', zIndex: -5 }}
                animate={ovCtrl}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />
        </>
    );
}
